import { useApp } from '@/context/AppContext';
import * as TaroCompat from '@/components/TaroCompat';
import MiniIcon from '@/components/MiniIcon';
import { miniSafeTopStyle } from '@/lib/platform';

export default function ProfilePage() {
  const { user, navigate, setMode } = useApp();

  const dataCards = [
    { label: '剩余积分', value: user.creditBalance?.toLocaleString() || '0', unit: '', page: 'credits' as const },
    { label: '咨询次数', value: String(user.consultCount), unit: '次' },
    { label: '学习时长', value: String(user.studyHours), unit: '小时' },
    { label: '平均分', value: String(user.avgScore), unit: '分' },
  ];

  const menuItems = [
    { icon: 'star' as const, label: '我的导师', page: 'instructors' as const, desc: '管理AI讲师' },
    { icon: 'users' as const, label: '企业后台', desc: '管理学员与培训', adminOnly: true },
    { icon: 'settings' as const, label: '设置', desc: '通知/隐私/账号' },
    { icon: 'help' as const, label: '帮助中心', desc: '使用指南' },
    { icon: 'headphones' as const, label: '联系客服', desc: '在线支持' },
  ];

  return (
    <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
      {/* Profile Card */}
      <TaroCompat.Div className="bg-[#2D5AF5] px-5 pb-5" style={miniSafeTopStyle(20)}>
        <TaroCompat.Div className="flex items-center gap-4">
          <TaroCompat.Img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full border-3 border-white/30 object-cover" />
          <TaroCompat.Div className="flex-1">
            <TaroCompat.P className="text-white font-semibold text-lg">{user.name}</TaroCompat.P>
            <TaroCompat.Div className="flex items-center gap-2 mt-1">
              <TaroCompat.Span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                {user.role === 'enterprise_admin' ? '企业管理员' : user.role === 'enterprise_member' ? '企业员工' : '个人用户'}
              </TaroCompat.Span>
              {user.enterpriseName && (
                <TaroCompat.Span className="text-xs text-white/70">{user.enterpriseName}</TaroCompat.Span>
              )}
            </TaroCompat.Div>
          </TaroCompat.Div>
        </TaroCompat.Div>
          <TaroCompat.Div className="mt-4 bg-white/15 backdrop-blur rounded-xl p-3 flex items-center justify-between">
          <TaroCompat.Div className="flex items-center gap-2">
            <MiniIcon name="shield" size={14} className="text-white/70" />
            <TaroCompat.Span className="text-xs text-white/70">会员有效期至 {user.membershipExpiry}</TaroCompat.Span>
          </TaroCompat.Div>
          <TaroCompat.Span className="text-xs text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
            {user.membership === 'enterprise' ? '企业版' : user.membership === 'yearly' ? '年卡' : user.membership === 'monthly' ? '月卡' : '未开通'}
          </TaroCompat.Span>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Data Cards */}
      <TaroCompat.Div className="relative z-10 mx-4 -mt-5 grid grid-cols-4 gap-2.5">
        {dataCards.map(card => (
          <TaroCompat.ButtonCompat
            key={card.label}
            onClick={() => card.page && navigate(card.page)}
            className="min-h-[4.125rem] bg-white rounded-[0.625rem] px-2 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.08)] text-center flex flex-col items-center justify-center"
          >
            <TaroCompat.P className="text-base font-bold text-gray-800">{card.value}</TaroCompat.P>
            <TaroCompat.P className="text-[10px] text-gray-500 mt-0.5">{card.label}{card.unit}</TaroCompat.P>
          </TaroCompat.ButtonCompat>
        ))}
      </TaroCompat.Div>

      {/* Menu */}
      <TaroCompat.Div className="mx-4 mt-4 bg-white rounded-xl shadow-sm divide-y divide-gray-50">
        {menuItems.map((item, i) => {
          if (item.adminOnly && user.role !== 'enterprise_admin') return null;
          return (
            <TaroCompat.ButtonCompat
              key={i}
              onClick={() => {
                if (item.label === '企业后台') {
                  setMode('admin');
                } else if (item.page) {
                  navigate(item.page);
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              <TaroCompat.Div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                <MiniIcon name={item.icon} size={16} className="text-gray-600" />
              </TaroCompat.Div>
              <TaroCompat.Div className="flex-1">
                <TaroCompat.P className="text-sm text-gray-800">{item.label}</TaroCompat.P>
                <TaroCompat.P className="text-xs text-gray-400">{item.desc}</TaroCompat.P>
              </TaroCompat.Div>
              <MiniIcon name="chevronRight" size={16} className="text-gray-300" />
            </TaroCompat.ButtonCompat>
          );
        })}
        <TaroCompat.ButtonCompat className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
          <TaroCompat.Div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
            <MiniIcon name="logout" size={16} className="text-red-400" />
          </TaroCompat.Div>
          <TaroCompat.Span className="text-sm text-red-400">退出登录</TaroCompat.Span>
        </TaroCompat.ButtonCompat>
      </TaroCompat.Div>

      {/* Version */}
      <TaroCompat.P className="text-center text-xs text-gray-400 mt-6 mb-4">齿科AI培训平台 v1.0.0</TaroCompat.P>
    </TaroCompat.Div>
  );
}
