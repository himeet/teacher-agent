import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'
import { WeappWxssClassNormalizerPlugin } from './weappWxssClassNormalizer'

const cozeAuthToken = 'pat_GPLg5pLg7j6pyJx3Ev1VdHfBxkeTGrBynfkRz888D9WxQ4bG8lSaqhJ52mnhYdmd'
const cozeStreamUrl = 'https://z94mvp2yjk.coze.site/stream_run'

function readRequestBody(req: NodeJS.ReadableStream) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []

    req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function writeCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
}

async function proxyCozeStream(req: any, res: any) {
  try {
    writeCorsHeaders(res)

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end('Method Not Allowed')
      return
    }

    const requestBody = await readRequestBody(req)
    const upstream = await fetch(cozeStreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        'Accept-Encoding': 'identity',
        Authorization: `Bearer ${cozeAuthToken}`,
      },
      body: requestBody,
    })

    res.statusCode = upstream.status
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.removeHeader('Content-Encoding')
    res.removeHeader('Content-Length')
    res.flushHeaders?.()

    if (!upstream.body) {
      res.end()
      return
    }

    const reader = upstream.body.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      res.write(Buffer.from(value))
      res.flush?.()
    }

    res.end()
  } catch (error) {
    console.error('Coze stream proxy error:', error)

    if (!res.headersSent) {
      writeCorsHeaders(res)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({
        error: 'stream_proxy_error',
        message: error instanceof Error ? error.message : 'Unknown stream proxy error',
      }))
      return
    }

    res.end()
  }
}

export default defineConfig<'webpack5'>(async (merge) => {
  const outputRoot = 'dist'

  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'dental-ai-training',
    date: '2026-06-13',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot,
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false,
      },
    },
    cache: {
      enable: false,
    },
    alias: {
      '@': './src',
    },
    copy: {
      patterns: [
        {
          from: 'public/images',
          to: `${outputRoot}/images`,
        },
        {
          from: 'public/assets',
          to: `${outputRoot}/assets`,
        },
      ],
      options: {},
    },
    plugins: [],
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        chain.plugin('weapp-wxss-class-normalizer').use(WeappWxssClassNormalizerPlugin)
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      router: {
        mode: 'hash',
      },
      devServer: {
        port: 3001,
        host: '0.0.0.0',
        setupMiddlewares(middlewares, devServer) {
          devServer.app?.use('/api/coze/stream_run', proxyCozeStream)
          return middlewares
        },
      },
      postcss: {
        pxtransform: {
          enable: false,
        },
        autoprefixer: {
          enable: true,
          config: {},
        },
        tailwindcss: {
          enable: true,
          config: {
            config: './tailwind.config.js',
          },
        },
        cssModules: {
          enable: false,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      htmlPluginOption: {
        template: 'src/index.html',
        title: '齿科AI培训平台',
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      },
    },
  }

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }

  return merge({}, baseConfig, prodConfig)
})
