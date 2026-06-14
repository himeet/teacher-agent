import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

const SAFE_CLASS_NAME_RE = /^-?[A-Za-z_][A-Za-z0-9_-]*$/;
const PLUGIN_NAME = 'WeappWxssClassNormalizerPlugin';
const GLOBAL_PAGE_SELECTORS = new Set([':host', ':root']);
const GLOBAL_PAGE_TAGS = new Set(['body', 'html']);
const UNSUPPORTED_PSEUDO_SELECTORS = new Set([
  ':disabled',
  ':first-child',
  ':focus',
  ':hover',
  ':last-child',
  ':not',
  ':where',
  ':-moz-focusring',
  ':-moz-ui-invalid',
]);
const BROWSER_RESET_TAGS = new Set([
  'a',
  'abbr',
  'audio',
  'b',
  'blockquote',
  'button',
  'canvas',
  'code',
  'dd',
  'dialog',
  'dl',
  'embed',
  'fieldset',
  'figure',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'iframe',
  'img',
  'input',
  'kbd',
  'legend',
  'menu',
  'object',
  'ol',
  'optgroup',
  'p',
  'pre',
  'progress',
  'samp',
  'select',
  'small',
  'strong',
  'sub',
  'summary',
  'sup',
  'svg',
  'table',
  'textarea',
  'ul',
  'video',
]);

function toSafeClassName(className: string) {
  if (SAFE_CLASS_NAME_RE.test(className)) return className;

  let safeName = 'twx-';

  for (const char of className) {
    safeName += /[A-Za-z0-9-]/.test(char)
      ? char
      : `_${char.codePointAt(0)?.toString(16) ?? '0'}_`;
  }

  return safeName;
}

function isGlobalPageTag(tagName: string) {
  return GLOBAL_PAGE_TAGS.has(tagName.toLowerCase());
}

function isBrowserResetTag(tagName: string) {
  return BROWSER_RESET_TAGS.has(tagName.toLowerCase());
}

function selectorHasClass(selector: selectorParser.Selector) {
  let hasClass = false;

  selector.walkClasses(() => {
    hasClass = true;
  });

  return hasClass;
}

function selectorHasId(selector: selectorParser.Selector) {
  let hasId = false;

  selector.walkIds(() => {
    hasId = true;
  });

  return hasId;
}

function normalizeWxssSelector(selector: string) {
  return selectorParser((selectors) => {
    selectors.each((selectorNode) => {
      const hasClass = selectorHasClass(selectorNode);
      const hasId = selectorHasId(selectorNode);
      let shouldRemove = false;

      selectorNode.walkClasses((classNode) => {
        const safeClassName = toSafeClassName(classNode.value);

        if (safeClassName !== classNode.value) {
          classNode.value = safeClassName;
          classNode.raws = {};
        }
      });

      selectorNode.walkPseudos((pseudoNode) => {
        if (pseudoNode.value.startsWith('::')) {
          shouldRemove = true;
          return;
        }

        if (GLOBAL_PAGE_SELECTORS.has(pseudoNode.value)) {
          pseudoNode.replaceWith(selectorParser.tag({ value: 'page' }));
          return;
        }

        if (UNSUPPORTED_PSEUDO_SELECTORS.has(pseudoNode.value)) {
          shouldRemove = true;
        }
      });

      selectorNode.walkUniversals((universalNode) => {
        if (hasClass || hasId) {
          shouldRemove = true;
          return;
        }

        universalNode.replaceWith(selectorParser.tag({ value: 'page' }));
      });

      selectorNode.walkTags((tagNode) => {
        if (isGlobalPageTag(tagNode.value)) {
          tagNode.value = 'page';
          return;
        }

        if (!hasClass && !hasId && isBrowserResetTag(tagNode.value)) {
          shouldRemove = true;
        }
      });

      selectorNode.walkAttributes(() => {
        if (!hasClass && !hasId) {
          shouldRemove = true;
        }
      });

      if (shouldRemove) {
        selectorNode.remove();
      }
    });

    const seenSelectors = new Set<string>();

    selectors.each((selectorNode) => {
      const normalizedSelector = selectorNode.toString().trim();

      if (!normalizedSelector || seenSelectors.has(normalizedSelector)) {
        selectorNode.remove();
        return;
      }

      seenSelectors.add(normalizedSelector);
    });
  }).processSync(selector);
}

function normalizeWxssClassSelectors(css: string) {
  const root = postcss.parse(css);

  root.walkRules((rule) => {
    try {
      rule.selector = normalizeWxssSelector(rule.selector);

      if (!rule.selector.trim()) {
        rule.remove();
      }
    } catch {
      rule.remove();
    }
  });

  root.walkAtRules('supports', (atRule) => {
    if (atRule.nodes?.length) {
      atRule.replaceWith(...atRule.nodes);
      return;
    }

    atRule.remove();
  });

  return root.toString();
}

export class WeappWxssClassNormalizerPlugin {
  apply(compiler: any) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: any) => {
      const { Compilation, sources } = compiler.webpack;

      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets: Record<string, any>) => {
          for (const assetName of Object.keys(assets)) {
            if (!assetName.endsWith('.wxss')) continue;

            const assetSource = assets[assetName].source();
            const source = Buffer.isBuffer(assetSource)
              ? assetSource.toString('utf8')
              : String(assetSource);

            compilation.updateAsset(
              assetName,
              new sources.RawSource(normalizeWxssClassSelectors(source)),
            );
          }
        },
      );
    });
  }
}
