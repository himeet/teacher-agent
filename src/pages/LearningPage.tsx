import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { courses, learningRecords } from '@/data/mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import * as TaroCompat from '@/components/TaroCompat';
import MiniIcon from '@/components/MiniIcon';
import { miniSafeHeaderStyle } from '@/lib/platform';

export default function LearningPage() {
  const { abilityScores, navigate } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'records' | 'portrait'>('courses');

  const overallScore = Math.round(abilityScores.reduce((s, a) => s + a.score, 0) / abilityScores.length);

  const stats = {
    consults: 156,
    courses: 8,
    drills: 24,
    exams: 12,
    hours: 48,
  };

  const weakPoints = abilityScores.filter(a => a.score < 75).sort((a, b) => a.score - b.score);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'consult': return <MiniIcon name="chat" size={14} className="text-[#2D5AF5]" />;
      case 'course': return <MiniIcon name="book" size={14} className="text-emerald-500" />;
      case 'drill': return <MiniIcon name="shield" size={14} className="text-amber-500" />;
      case 'exam': return <MiniIcon name="trophy" size={14} className="text-rose-500" />;
      default: return <MiniIcon name="book" size={14} className="text-gray-400" />;
    }
  };

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case 'consult': return 'AI答疑';
      case 'course': return '生成课程';
      case 'drill': return '情景对练';
      case 'exam': return '考试';
      default: return type;
    }
  };

  return (
    <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
      {/* Quick Entries */}
      <TaroCompat.Div className="bg-white px-4 pb-3" style={miniSafeHeaderStyle(12)}>
        <TaroCompat.Div className="grid grid-cols-4 gap-3">
          {[
            { label: '生成课程', icon: 'learn' as const, color: 'bg-[#E8EFFD]', iconColor: 'text-[#2D5AF5]', page: 'generateCourse' as const },
            { label: '情景对练', icon: 'shield' as const, color: 'bg-emerald-50', iconColor: 'text-emerald-500', page: 'drill' as const },
            { label: '我的考试', icon: 'trophy' as const, color: 'bg-amber-50', iconColor: 'text-amber-500', page: 'examCenter' as const },
            { label: '沟通策略', icon: 'chat' as const, color: 'bg-gray-100', iconColor: 'text-gray-400' },
          ].map(item => (
            <TaroCompat.ButtonCompat
              key={item.label}
              onClick={() => item.page && navigate(item.page)}
              className="flex flex-col items-center gap-1.5"
              disabled={!item.page}
            >
              <TaroCompat.Div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                <MiniIcon name={item.icon} size={18} className={item.iconColor} />
              </TaroCompat.Div>
              <TaroCompat.Span className="text-xs text-gray-700">{item.label}</TaroCompat.Span>
            </TaroCompat.ButtonCompat>
          ))}
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Sub Tabs */}
      <TaroCompat.Div className="bg-white px-4 pb-3 flex gap-0 border-b border-gray-100">
        {[
          { key: 'courses' as const, label: '我的课程' },
          { key: 'records' as const, label: '学习记录' },
          { key: 'portrait' as const, label: '能力画像' },
        ].map(tab => (
          <TaroCompat.ButtonCompat
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={`flex-1 py-2 text-sm font-medium text-center transition-all relative ${
              activeSubTab === tab.key ? 'text-[#2D5AF5]' : 'text-gray-500'
            }`}
          >
            {tab.label}
            {activeSubTab === tab.key && (
              <TaroCompat.Span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#2D5AF5] rounded-full" />
            )}
          </TaroCompat.ButtonCompat>
        ))}
      </TaroCompat.Div>

      {/* Tab Content */}
      <TaroCompat.Div className="p-4">
        {activeSubTab === 'courses' && (
          <TaroCompat.Div className="space-y-3">
            {courses.map(course => (
              <TaroCompat.Div key={course.id} className="bg-white rounded-xl p-3 shadow-sm">
                <TaroCompat.Div className="flex gap-3">
                  <TaroCompat.Img src={course.cover} alt={course.title} className="w-20 h-14 rounded-lg object-cover shrink-0" />
                  <TaroCompat.Div className="flex-1 min-w-0">
                    <TaroCompat.Div className="flex items-center gap-2">
                      <TaroCompat.P className="text-sm font-medium text-gray-800 truncate">{course.title}</TaroCompat.P>
                      {course.type === 'enterprise' && (
                        <TaroCompat.Span className="shrink-0 text-[10px] bg-[#E8EFFD] text-[#2D5AF5] px-1.5 py-0.5 rounded">企业</TaroCompat.Span>
                      )}
                    </TaroCompat.Div>
                    <TaroCompat.P className="text-xs text-gray-500 mt-0.5">{course.instructorName} · {course.totalLessons}节课</TaroCompat.P>
                    <TaroCompat.Div className="flex items-center gap-2 mt-2">
                      <TaroCompat.Div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <TaroCompat.Div className="h-full bg-[#2D5AF5] rounded-full" style={{ width: `${course.progress}%` }} />
                      </TaroCompat.Div>
                      <TaroCompat.Span className="text-xs text-gray-500">{course.progress}%</TaroCompat.Span>
                    </TaroCompat.Div>
                  </TaroCompat.Div>
                </TaroCompat.Div>
                {course.planName && (
                  <TaroCompat.P className="text-[10px] text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded">
                    来自：{course.planName} · 截止 {course.dueDate}
                  </TaroCompat.P>
                )}
              </TaroCompat.Div>
            ))}
          </TaroCompat.Div>
        )}

        {activeSubTab === 'records' && (
          <TaroCompat.Div>
            {/* Stats */}
            <TaroCompat.Div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: '累计答疑', value: stats.consults, unit: '轮', icon: 'chat' as const, color: 'text-[#2D5AF5]' },
                { label: '生成课程', value: stats.courses, unit: '套', icon: 'book' as const, color: 'text-emerald-500' },
                { label: '完成对练', value: stats.drills, unit: '场', icon: 'shield' as const, color: 'text-amber-500' },
                { label: '完成考试', value: stats.exams, unit: '次', icon: 'trophy' as const, color: 'text-rose-500' },
                { label: '学习时长', value: stats.hours, unit: '小时', icon: 'clock' as const, color: 'text-purple-500' },
                { label: '能力提升', value: '+23', unit: '%', icon: 'sparkles' as const, color: 'text-cyan-500' },
              ].map(s => (
                <TaroCompat.Div key={s.label} className="bg-white rounded-xl p-3 text-center">
                  <MiniIcon name={s.icon} size={18} className={`mx-auto mb-1 ${s.color}`} />
                  <TaroCompat.P className="text-lg font-bold text-gray-800">{s.value}</TaroCompat.P>
                  <TaroCompat.P className="text-[10px] text-gray-500">{s.label}（{s.unit}）</TaroCompat.P>
                </TaroCompat.Div>
              ))}
            </TaroCompat.Div>

            {/* Timeline */}
            <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
              <TaroCompat.H4 className="text-sm font-semibold text-gray-800 mb-3">学习轨迹</TaroCompat.H4>
              <TaroCompat.Div className="space-y-0">
                {learningRecords.slice(0, 8).map((rec, i) => (
                  <TaroCompat.Div key={rec.id} className="flex gap-3 relative">
                    {i < 7 && <TaroCompat.Div className="absolute left-[13px] top-6 bottom-0 w-px bg-gray-100" />}
                    <TaroCompat.Div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center shrink-0 z-10">
                      {getRecordIcon(rec.type)}
                    </TaroCompat.Div>
                    <TaroCompat.Div className="pb-3 flex-1">
                      <TaroCompat.P className="text-sm text-gray-700">{rec.content}</TaroCompat.P>
                      <TaroCompat.Div className="flex items-center gap-2 mt-0.5">
                        <TaroCompat.Span className="text-[10px] text-gray-400">{rec.date}</TaroCompat.Span>
                        <TaroCompat.Span className="text-[10px] text-gray-400">{getRecordTypeLabel(rec.type)}</TaroCompat.Span>
                        <TaroCompat.Span className="text-[10px] text-gray-400">{rec.duration}分钟</TaroCompat.Span>
                      </TaroCompat.Div>
                    </TaroCompat.Div>
                  </TaroCompat.Div>
                ))}
              </TaroCompat.Div>
            </TaroCompat.Div>
          </TaroCompat.Div>
        )}

        {activeSubTab === 'portrait' && (
          <TaroCompat.Div className="space-y-4">
            {/* Overall Score */}
            <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <TaroCompat.P className="text-sm text-gray-500 mb-1">综合能力评分</TaroCompat.P>
              <TaroCompat.Div className="flex items-center justify-center gap-2">
                <MiniIcon name="trophy" size={20} className="text-amber-500" />
                <TaroCompat.Span className="text-3xl font-bold text-gray-800">{overallScore}</TaroCompat.Span>
                <TaroCompat.Span className="text-sm text-gray-400">/100</TaroCompat.Span>
              </TaroCompat.Div>
              <TaroCompat.Div className="mt-2 inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full">
                <MiniIcon name="trophy" size={12} />
                黄金等级
              </TaroCompat.Div>
            </TaroCompat.Div>

            {/* Radar Chart */}
            <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
              <TaroCompat.H4 className="text-sm font-semibold text-gray-800 mb-3">五维能力雷达</TaroCompat.H4>
              <TaroCompat.Div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={abilityScores}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#666B73' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="当前能力"
                      dataKey="score"
                      stroke="#2D5AF5"
                      fill="#2D5AF5"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </TaroCompat.Div>
            </TaroCompat.Div>

            {/* Weak Points */}
            <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
              <TaroCompat.H4 className="text-sm font-semibold text-gray-800 mb-3">能力短板</TaroCompat.H4>
              <TaroCompat.Div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weakPoints} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="dimension" type="category" tick={{ fontSize: 11 }} width={70} />
                    <Tooltip formatter={(v: number) => [`${v}分`, '得分']} />
                    <Bar dataKey="score" fill="#2D5AF5" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </TaroCompat.Div>
              {weakPoints.length > 0 && (
                <TaroCompat.Div className="mt-3 flex flex-wrap gap-2">
                  {weakPoints.map(wp => (
                    <TaroCompat.Span key={wp.dimension} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                      {wp.dimension} {wp.score}分 · 待提升
                    </TaroCompat.Span>
                  ))}
                </TaroCompat.Div>
              )}
            </TaroCompat.Div>

            {/* Trend */}
            <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
              <TaroCompat.H4 className="text-sm font-semibold text-gray-800 mb-3">近30天趋势</TaroCompat.H4>
              <TaroCompat.Div className="flex items-center gap-4">
                <TaroCompat.Div className="flex-1 text-center p-3 bg-emerald-50 rounded-xl">
                  <MiniIcon name="sparkles" size={16} className="text-emerald-500 mx-auto mb-1" />
                  <TaroCompat.P className="text-lg font-bold text-emerald-600">+12%</TaroCompat.P>
                  <TaroCompat.P className="text-[10px] text-gray-500">成交能力</TaroCompat.P>
                </TaroCompat.Div>
                <TaroCompat.Div className="flex-1 text-center p-3 bg-[#E8EFFD] rounded-xl">
                  <MiniIcon name="sparkles" size={16} className="text-[#2D5AF5] mx-auto mb-1" />
                  <TaroCompat.P className="text-lg font-bold text-[#2D5AF5]">+8%</TaroCompat.P>
                  <TaroCompat.P className="text-[10px] text-gray-500">沟通技巧</TaroCompat.P>
                </TaroCompat.Div>
                <TaroCompat.Div className="flex-1 text-center p-3 bg-amber-50 rounded-xl">
                  <MiniIcon name="sparkles" size={16} className="text-amber-500 mx-auto mb-1" />
                  <TaroCompat.P className="text-lg font-bold text-amber-600">+5%</TaroCompat.P>
                  <TaroCompat.P className="text-[10px] text-gray-500">异议处理</TaroCompat.P>
                </TaroCompat.Div>
              </TaroCompat.Div>
            </TaroCompat.Div>
          </TaroCompat.Div>
        )}
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
