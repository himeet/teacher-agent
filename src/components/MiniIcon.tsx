import * as TaroCompat from '@/components/TaroCompat';

type MiniIconName =
  | 'home'
  | 'chat'
  | 'learn'
  | 'user'
  | 'sparkles'
  | 'shield'
  | 'trophy'
  | 'mic'
  | 'send'
  | 'clock'
  | 'book'
  | 'star'
  | 'users'
  | 'settings'
  | 'help'
  | 'headphones'
  | 'logout'
  | 'chevronRight';

interface MiniIconProps {
  name: MiniIconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const labels: Record<MiniIconName, string> = {
  home: '⌂',
  chat: '○',
  learn: '□',
  user: '○',
  sparkles: '✦',
  shield: '盾',
  trophy: '奖',
  mic: '麦',
  send: '➤',
  clock: '◷',
  book: '□',
  star: '★',
  users: '企',
  settings: '设',
  help: '?',
  headphones: '☎',
  logout: '↪',
  chevronRight: '›',
};

export default function MiniIcon({ name, size = 20, strokeWidth: _strokeWidth, className = '' }: MiniIconProps) {
  return (
    <TaroCompat.Span
      className={`mini-icon mini-icon-${name} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.round(size * 0.72)}px`,
      }}
    >
      {labels[name]}
    </TaroCompat.Span>
  );
}
