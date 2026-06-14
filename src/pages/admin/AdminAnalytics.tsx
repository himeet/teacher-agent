import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Download, AlertTriangle } from 'lucide-react';
import { adminMembers, abilityScores } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';

const teamRadar = abilityScores.map(a => ({
  ...a,
  teamAvg: Math.round(a.score * 0.92),
}));

const deptData = [
  { name: '前台咨询', score: 74 },
  { name: '种植科', score: 82 },
  { name: '正畸科', score: 78 },
  { name: '客服部', score: 65 },
];

const weakKnowledge = [
  { area: '价格异议处理', errorRate: 34 },
  { area: '成交促成', errorRate: 28 },
  { area: '需求挖掘', errorRate: 22 },
  { area: '产品介绍', errorRate: 18 },
  { area: '初诊接待', errorRate: 12 },
];

const behaviorData = [
  { hour: '8时', count: 5 },
  { hour: '9时', count: 15 },
  { hour: '10时', count: 28 },
  { hour: '11时', count: 22 },
  { hour: '12时', count: 12 },
  { hour: '13时', count: 8 },
  { hour: '14时', count: 25 },
  { hour: '15时', count: 30 },
  { hour: '16时', count: 20 },
  { hour: '17时', count: 10 },
  { hour: '18时', count: 5 },
];

export default function AdminAnalytics() {
  return (
    <TaroCompat.Div className="p-6 space-y-6">
      <TaroCompat.Div className="flex items-center justify-between">
        <TaroCompat.H1 className="text-xl font-bold text-gray-800">数据分析</TaroCompat.H1>
        <TaroCompat.ButtonCompat className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Download size={14} />
          导出报告
        </TaroCompat.ButtonCompat>
      </TaroCompat.Div>

      {/* Team Radar */}
      <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100">
        <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-4">团队能力雷达 vs 行业基准</TaroCompat.H3>
        <TaroCompat.Div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={teamRadar}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#666B73' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="团队均分" dataKey="teamAvg" stroke="#2D5AF5" fill="#2D5AF5" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="行业基准" dataKey="score" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.05} strokeWidth={2} strokeDasharray="4 4" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </TaroCompat.Div>
      </TaroCompat.Div>

      <TaroCompat.Div className="grid grid-cols-2 gap-4">
        {/* Dept Comparison */}
        <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100">
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-4">部门能力对比</TaroCompat.H3>
          <TaroCompat.Div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={60} />
                <Tooltip />
                <Bar dataKey="score" fill="#2D5AF5" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </TaroCompat.Div>
        </TaroCompat.Div>

        {/* Weak Knowledge Heatmap */}
        <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100">
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-4">知识点错误率 TOP5</TaroCompat.H3>
          <TaroCompat.Div className="space-y-3">
            {weakKnowledge.map(wk => (
              <TaroCompat.Div key={wk.area}>
                <TaroCompat.Div className="flex items-center justify-between mb-1">
                  <TaroCompat.Span className="text-xs text-gray-600">{wk.area}</TaroCompat.Span>
                  <TaroCompat.Span className="text-xs text-red-500 font-medium">{wk.errorRate}%</TaroCompat.Span>
                </TaroCompat.Div>
                <TaroCompat.Div className="h-2 bg-gray-100 rounded-full">
                  <TaroCompat.Div className="h-full bg-red-400 rounded-full" style={{ width: `${wk.errorRate * 2}%` }} />
                </TaroCompat.Div>
              </TaroCompat.Div>
            ))}
          </TaroCompat.Div>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* Learning Time Distribution */}
      <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100">
        <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-4">学习时段分布</TaroCompat.H3>
        <TaroCompat.Div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behaviorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => [`${v}人次`, '活跃人数']} />
              <Bar dataKey="count" fill="#2D5AF5" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </TaroCompat.Div>
      </TaroCompat.Div>

      {/* At-risk students */}
      <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100">
        <TaroCompat.Div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-amber-500" />
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800">流失预警（7天未学习）</TaroCompat.H3>
        </TaroCompat.Div>
        <TaroCompat.Div className="grid grid-cols-3 gap-3">
          {adminMembers.filter(m => m.status === 'frozen' || m.status === 'inactive').map(m => (
            <TaroCompat.Div key={m.id} className="bg-amber-50 rounded-lg p-3 flex items-center gap-3">
              <TaroCompat.Div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                {m.name[0]}
              </TaroCompat.Div>
              <TaroCompat.Div>
                <TaroCompat.P className="text-sm text-gray-800">{m.name}</TaroCompat.P>
                <TaroCompat.P className="text-xs text-gray-500">{m.department}</TaroCompat.P>
              </TaroCompat.Div>
            </TaroCompat.Div>
          ))}
        </TaroCompat.Div>
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
