import {
  BookOpen,
  ChevronRight,
  Clock,
  Headphones,
  HelpCircle,
  Home,
  LogOut,
  MessageCircle,
  Mic,
  Send,
  Settings,
  Shield,
  Sparkles,
  Star,
  Trophy,
  User,
  Users,
} from 'lucide-react';

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

const lucideIcons = {
  home: Home,
  chat: MessageCircle,
  learn: BookOpen,
  user: User,
  sparkles: Sparkles,
  shield: Shield,
  trophy: Trophy,
  mic: Mic,
  send: Send,
  clock: Clock,
  book: BookOpen,
  star: Star,
  users: Users,
  settings: Settings,
  help: HelpCircle,
  headphones: Headphones,
  logout: LogOut,
  chevronRight: ChevronRight,
};

export default function MiniIcon({ name, size = 20, strokeWidth, className = '' }: MiniIconProps) {
  const Icon = lucideIcons[name];
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
}
