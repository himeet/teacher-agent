import { useApp } from '@/context/AppContext';
import * as TaroCompat from '@/components/TaroCompat';
import MiniIcon from '@/components/MiniIcon';
import { miniSafeHeaderStyle } from '@/lib/platform';

export default function HomePage() {
  const { user, navigate } = useApp();

  // Greeting based on time
  const hour = new Date().getHours();
  let greeting = '早上好';
  if (hour >= 12 && hour < 18) greeting = '下午好';
  if (hour >= 18) greeting = '晚上好';

  const quickEntries = [
    {
      icon: 'sparkles' as const,
      iconSrc: '/assets/generate_course.png',
      iconBg: 'bg-[#F0E6FF]',
      iconColor: 'text-[#8B5CF6]',
      title: '生成课程',
      desc: '老师懂你的薄弱点',
      page: 'generateCourse' as const,
    },
    {
      icon: 'shield' as const,
      iconSrc: '/assets/qjdl.png',
      iconBg: 'bg-[#DBEAFE]',
      iconColor: 'text-[#2563EB]',
      title: '情景对练',
      desc: '挑选客户标签开始',
      page: 'drill' as const,
    },
    {
      icon: 'trophy' as const,
      iconSrc: '/assets/wdks.png',
      iconBg: 'bg-[#FEF3C7]',
      iconColor: 'text-[#D97706]',
      title: '我的考试',
      desc: '本月考卷已生成',
      page: 'examCenter' as const,
    },
    {
      icon: 'mic' as const,
      iconSrc: '/assets/gtcl.png',
      iconBg: 'bg-[#FEE2E2]',
      iconColor: 'text-[#DC2626]',
      title: '沟通策略',
      desc: '上传录音获取报告',
      page: undefined,
    },
  ];

  return (
    <TaroCompat.Div className="min-h-full bg-white pb-4">
      {/* Header */}
      <TaroCompat.Div
        className="flex items-center justify-between px-5 pb-2"
        style={miniSafeHeaderStyle(12)}
      >
        <TaroCompat.Div className="flex items-center gap-2.5">
          <TaroCompat.Img
            src={user.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
          />
          <TaroCompat.Span className="text-sm font-medium text-gray-800">{user.name}</TaroCompat.Span>
        </TaroCompat.Div>
        <TaroCompat.ButtonCompat className="w-9 h-9 flex items-center justify-center">
          <MiniIcon name="chat" size={22} className="text-[#2D5AF5]" />
        </TaroCompat.ButtonCompat>
      </TaroCompat.Div>

      {/* Greeting Section */}
      <TaroCompat.Div className="px-5 pt-4 pb-5">
        <TaroCompat.H1 className="text-2xl font-bold text-[#2D5AF5] leading-snug">
          {greeting}，{user.name}同学。<br />
          今天我们从哪里开始？
        </TaroCompat.H1>
        <TaroCompat.ButtonCompat
          onClick={() => navigate('learn')}
          className="mt-4 inline-flex items-center gap-1 px-5 py-2.5 border border-[#2D5AF5]/30 text-[#2D5AF5] text-sm font-medium rounded-full hover:bg-[#E8EFFD] transition-all"
        >
          查看我的进度
        </TaroCompat.ButtonCompat>
      </TaroCompat.Div>

      {/* Hero Card - Instructor CTA */}
      <TaroCompat.Div className="mx-5 mb-5">
        <TaroCompat.ButtonCompat
          onClick={() => navigate('chat')}
          className="w-full relative rounded-2xl overflow-hidden shadow-lg active:scale-[0.98] transition-transform"
        >
          {/* Background Image */}
          <TaroCompat.Img
            src="/images/instructor_shen.jpg"
            alt="咨询沈老师"
            className="w-full h-72 object-cover object-center"
          />
          {/* Gradient Overlay */}
          <TaroCompat.Div className="absolute inset-0 bg-gradient-to-t from-[#2D5AF5]/90 via-[#2D5AF5]/30 to-transparent" />
          {/* Online Badge */}
          <TaroCompat.Div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full">
            <TaroCompat.Span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <TaroCompat.Span className="text-[10px] font-medium text-gray-700">ONLINE NOW</TaroCompat.Span>
          </TaroCompat.Div>
          {/* Chat Icon */}
          <TaroCompat.Div className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
            <MiniIcon name="chat" size={16} className="text-[#2D5AF5]" />
          </TaroCompat.Div>
          {/* Text Content */}
          <TaroCompat.Div className="absolute bottom-4 left-4 text-left">
            <TaroCompat.H2 className="text-lg font-bold text-white">咨询沈老师</TaroCompat.H2>
            <TaroCompat.P className="text-xs text-white/80 mt-0.5">针对您的弱项提供 1:1 指导</TaroCompat.P>
          </TaroCompat.Div>
        </TaroCompat.ButtonCompat>
      </TaroCompat.Div>

      {/* Quick Entry Grid - 2x2 */}
      <TaroCompat.Div className="mx-5 grid grid-cols-2 gap-3">
        {quickEntries.map((item) => (
          <TaroCompat.ButtonCompat
            key={item.title}
            onClick={() => item.page && navigate(item.page)}
            className="w-full min-h-[124px] flex flex-col items-start bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-gray-200 active:scale-[0.97] transition-all"
          >
            <TaroCompat.Div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center mb-3`}>
              {item.iconSrc ? (
                <TaroCompat.Img
                  src={item.iconSrc}
                  alt={item.title}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <MiniIcon name={item.icon} size={20} className={item.iconColor} />
              )}
            </TaroCompat.Div>
            <TaroCompat.H3 className="text-sm font-semibold text-gray-800">{item.title}</TaroCompat.H3>
            <TaroCompat.P className="text-xs text-gray-400 mt-0.5">{item.desc}</TaroCompat.P>
          </TaroCompat.ButtonCompat>
        ))}
      </TaroCompat.Div>

      {/* Spacing at bottom */}
      <TaroCompat.Div className="h-4" />
    </TaroCompat.Div>
  );
}
