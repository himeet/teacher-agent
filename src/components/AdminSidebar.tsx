import { useApp } from '@/context/AppContext';
import type { AdminPage } from '@/context/AppContext';
import {
  LayoutDashboard, Users, CalendarDays, BookOpen, Bot,
  BarChart3, Settings, MessageCircle, LogOut, ChevronLeft
} from 'lucide-react';
import * as TaroCompat from '@/components/TaroCompat';

const menuItems: { key: AdminPage; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { key: 'members', label: '学员管理', icon: Users },
  { key: 'plans', label: '培训计划', icon: CalendarDays },
  { key: 'courses', label: '课程库', icon: BookOpen },
  { key: 'instructors', label: '讲师智能体', icon: Bot },
  { key: 'analytics', label: '数据分析', icon: BarChart3 },
  { key: 'settings', label: '企业设置', icon: Settings },
];

export default function AdminSidebar() {
  const { currentPage, navigate, setMode, user } = useApp();

  return (
    <TaroCompat.Aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <TaroCompat.Div className="px-5 py-4 border-b border-gray-100">
        <TaroCompat.Div className="flex items-center gap-2">
          <TaroCompat.Div className="w-8 h-8 bg-[#2D5AF5] rounded-lg flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </TaroCompat.Div>
          <TaroCompat.Div>
            <TaroCompat.P className="text-sm font-bold text-gray-800">管理后台</TaroCompat.P>
            <TaroCompat.P className="text-[10px] text-gray-400">齿科AI培训平台</TaroCompat.P>
          </TaroCompat.Div>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Navigation */}
      <TaroCompat.Nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(item => {
          const isActive = currentPage === item.key;
          return (
            <TaroCompat.ButtonCompat
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-[#E8EFFD] text-[#2D5AF5] font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={17} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </TaroCompat.ButtonCompat>
          );
        })}
      </TaroCompat.Nav>

      {/* Bottom */}
      <TaroCompat.Div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <TaroCompat.ButtonCompat className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all">
          <MessageCircle size={17} />
          联系客服
        </TaroCompat.ButtonCompat>
        <TaroCompat.ButtonCompat
          onClick={() => setMode('front')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all"
        >
          <ChevronLeft size={17} />
          返回前台
        </TaroCompat.ButtonCompat>
        <TaroCompat.Div className="flex items-center gap-2 px-3 py-2 mt-2">
          <TaroCompat.Img src={user.avatar} alt="admin" className="w-7 h-7 rounded-full object-cover" />
          <TaroCompat.Div className="flex-1 min-w-0">
            <TaroCompat.P className="text-xs font-medium text-gray-700 truncate">{user.name}</TaroCompat.P>
            <TaroCompat.P className="text-[10px] text-gray-400">企业管理员</TaroCompat.P>
          </TaroCompat.Div>
          <TaroCompat.ButtonCompat className="text-gray-400 hover:text-gray-600">
            <LogOut size={14} />
          </TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      </TaroCompat.Div>
    </TaroCompat.Aside>
  );
}
