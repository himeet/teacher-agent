import { useApp } from '@/context/AppContext';
import { Zap, Users, ClipboardList, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import * as TaroCompat from '@/components/TaroCompat';

const activityData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}日`,
  count: Math.floor(Math.random() * 50) + 20,
}));

const pieData = [
  { name: 'AI答疑', value: 35, color: '#2D5AF5' },
  { name: '生成课程', value: 25, color: '#10B981' },
  { name: '情景对练', value: 25, color: '#F59E0B' },
  { name: '考试', value: 15, color: '#EF4444' },
];

const weakPointsData = [
  { name: '成交能力', score: 68, benchmark: 75 },
  { name: '异议处理', score: 71, benchmark: 78 },
  { name: '沟通技巧', score: 76, benchmark: 80 },
  { name: '产品熟悉度', score: 85, benchmark: 82 },
  { name: '专业知识', score: 82, benchmark: 80 },
];

const recentMembers = [
  { name: '张小明', dept: '前台咨询', lastStudy: '2分钟前', progress: 75 },
  { name: '王丽丽', dept: '前台咨询', lastStudy: '30分钟前', progress: 62 },
  { name: '陈大伟', dept: '种植科', lastStudy: '1小时前', progress: 88 },
  { name: '刘小红', dept: '正畸科', lastStudy: '2小时前', progress: 45 },
];

export default function AdminDashboard() {
  const { user } = useApp();

  const stats = [
    { label: '企业积分池', value: `${user.creditBalance?.toLocaleString() || 0}`, sub: '本月消耗 2,400', icon: Zap, trend: 'down', color: 'text-[#2D5AF5]', bg: 'bg-[#E8EFFD]' },
    { label: '子账号数量', value: '24', sub: '本月新增 3人', icon: Users, trend: 'up', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: '培训计划完成率', value: '75%', sub: '进行中 2个', icon: ClipboardList, trend: 'up', color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: '团队平均评分', value: '76.4', sub: '较上月 +3.2', icon: TrendingUp, trend: 'up', color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <TaroCompat.Div className="p-6 space-y-6">
      {/* Header */}
      <TaroCompat.Div className="flex items-center justify-between">
        <TaroCompat.Div>
          <TaroCompat.H1 className="text-xl font-bold text-gray-800">仪表盘</TaroCompat.H1>
          <TaroCompat.P className="text-sm text-gray-500 mt-0.5">{user.enterpriseName} · 数据实时更新</TaroCompat.P>
        </TaroCompat.Div>
        <TaroCompat.Div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200">
          <Zap size={14} className="text-[#2D5AF5]" />
          <TaroCompat.Span className="text-sm font-medium text-gray-700">积分池：{user.creditBalance?.toLocaleString()}</TaroCompat.Span>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Stats Grid */}
      <TaroCompat.Div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <TaroCompat.Div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <TaroCompat.Div className="flex items-center justify-between mb-3">
              <TaroCompat.Div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                <s.icon size={18} className={s.color} />
              </TaroCompat.Div>
              {s.trend === 'up'
                ? <ArrowUpRight size={16} className="text-emerald-500" />
                : <ArrowDownRight size={16} className="text-red-400" />
              }
            </TaroCompat.Div>
            <TaroCompat.P className="text-2xl font-bold text-gray-800">{s.value}</TaroCompat.P>
            <TaroCompat.P className="text-xs text-gray-500 mt-0.5">{s.label}</TaroCompat.P>
            <TaroCompat.P className="text-[10px] text-gray-400 mt-1">{s.sub}</TaroCompat.P>
          </TaroCompat.Div>
        ))}
      </TaroCompat.Div>

      {/* Charts Row */}
      <TaroCompat.Div className="grid grid-cols-3 gap-4">
        {/* Activity Trend */}
        <TaroCompat.Div className="col-span-2 bg-white rounded-xl p-5 border border-gray-100">
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-4">学习活跃度趋势（近30天）</TaroCompat.H3>
          <TaroCompat.Div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}人次`, '学习人次']} />
                <Line type="monotone" dataKey="count" stroke="#2D5AF5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TaroCompat.Div>
        </TaroCompat.Div>

        {/* Credit Distribution */}
        <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100">
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-4">积分消耗分布</TaroCompat.H3>
          <TaroCompat.Div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, '占比']} />
              </PieChart>
            </ResponsiveContainer>
          </TaroCompat.Div>
          <TaroCompat.Div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map(d => (
              <TaroCompat.Div key={d.name} className="flex items-center gap-1.5">
                <TaroCompat.Span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <TaroCompat.Span className="text-xs text-gray-600">{d.name} {d.value}%</TaroCompat.Span>
              </TaroCompat.Div>
            ))}
          </TaroCompat.Div>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Bottom Row */}
      <TaroCompat.Div className="grid grid-cols-2 gap-4">
        {/* Weak Points */}
        <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100">
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-4">团队能力短板 TOP5</TaroCompat.H3>
          <TaroCompat.Div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weakPointsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip />
                <Bar dataKey="score" fill="#2D5AF5" radius={[0, 4, 4, 0]} barSize={14} name="团队均分" />
                <Bar dataKey="benchmark" fill="#E5E7EB" radius={[0, 4, 4, 0]} barSize={14} name="行业基准" />
              </BarChart>
            </ResponsiveContainer>
          </TaroCompat.Div>
        </TaroCompat.Div>

        {/* Recent Activity */}
        <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100">
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-4">学员学习动态</TaroCompat.H3>
          <TaroCompat.Div className="space-y-3">
            {recentMembers.map(m => (
              <TaroCompat.Div key={m.name} className="flex items-center gap-3">
                <TaroCompat.Div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {m.name[0]}
                </TaroCompat.Div>
                <TaroCompat.Div className="flex-1 min-w-0">
                  <TaroCompat.Div className="flex items-center gap-2">
                    <TaroCompat.P className="text-sm text-gray-800">{m.name}</TaroCompat.P>
                    <TaroCompat.Span className="text-[10px] text-gray-400">{m.dept}</TaroCompat.Span>
                  </TaroCompat.Div>
                  <TaroCompat.P className="text-xs text-gray-400">{m.lastStudy}</TaroCompat.P>
                </TaroCompat.Div>
                <TaroCompat.Div className="text-right shrink-0">
                  <TaroCompat.Div className="w-16 h-1.5 bg-gray-100 rounded-full">
                    <TaroCompat.Div className="h-full bg-[#2D5AF5] rounded-full" style={{ width: `${m.progress}%` }} />
                  </TaroCompat.Div>
                  <TaroCompat.P className="text-[10px] text-gray-400 mt-0.5">{m.progress}%</TaroCompat.P>
                </TaroCompat.Div>
              </TaroCompat.Div>
            ))}
          </TaroCompat.Div>
        </TaroCompat.Div>
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
