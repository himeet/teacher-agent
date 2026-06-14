import { useApp } from '@/context/AppContext';
import * as TaroCompat from '@/components/TaroCompat';
import MiniIcon from '@/components/MiniIcon';

const tabs = [
  { key: 'home' as const, label: '首页', icon: 'home' as const },
  { key: 'chat' as const, label: '咨询', icon: 'chat' as const },
  { key: 'learn' as const, label: '学习', icon: 'learn' as const },
  { key: 'me' as const, label: '我的', icon: 'user' as const },
];

export default function BottomTab() {
  const { activeTab, navigate } = useApp();

  return (
    <TaroCompat.Nav className="shrink-0 h-16 bg-white border-t border-gray-100 z-50 flex items-center justify-around select-none">
      {tabs.map(t => {
        const isActive = activeTab === t.key;
        return (
          <TaroCompat.ButtonCompat
            key={t.key}
            onClick={() => navigate(t.key)}
            className="flex flex-col items-center justify-center gap-0.5 w-16 h-full relative"
          >
            <TaroCompat.Div className={`relative ${isActive ? 'text-[#2D5AF5]' : 'text-gray-400'}`}>
              <MiniIcon name={t.icon} size={22} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <TaroCompat.Span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#2D5AF5] rounded-full" />
              )}
            </TaroCompat.Div>
            <TaroCompat.Span className={`text-[10px] ${isActive ? 'text-[#2D5AF5] font-semibold' : 'text-gray-400'}`}>
              {t.label}
            </TaroCompat.Span>
          </TaroCompat.ButtonCompat>
        );
      })}
    </TaroCompat.Nav>
  );
}
