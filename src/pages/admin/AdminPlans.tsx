import { useState } from 'react';
import { Plus, CalendarDays, Users, Target, MoreHorizontal } from 'lucide-react';
import { trainingPlans } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';

export default function AdminPlans() {
  const [showCreate, setShowCreate] = useState(false);
  const [createStep, setCreateStep] = useState(1);

  return (
    <TaroCompat.Div className="p-6 space-y-4">
      <TaroCompat.Div className="flex items-center justify-between">
        <TaroCompat.H1 className="text-xl font-bold text-gray-800">培训计划</TaroCompat.H1>
        <TaroCompat.ButtonCompat
          onClick={() => { setShowCreate(true); setCreateStep(1); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#2D5AF5] text-white rounded-lg text-sm hover:bg-[#2548C8]"
        >
          <Plus size={14} />
          创建计划
        </TaroCompat.ButtonCompat>
      </TaroCompat.Div>

      {showCreate ? (
        <TaroCompat.Div className="bg-white rounded-xl p-6 border border-gray-100 max-w-2xl">
          <TaroCompat.Div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map(s => (
              <TaroCompat.Div key={s} className="flex items-center gap-2 flex-1">
                <TaroCompat.Div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                  s === createStep ? 'bg-[#2D5AF5] text-white' :
                  s < createStep ? 'bg-emerald-500 text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {s < createStep ? '✓' : s}
                </TaroCompat.Div>
                {s < 5 && <TaroCompat.Div className={`flex-1 h-0.5 ${s < createStep ? 'bg-emerald-500' : 'bg-gray-100'}`} />}
              </TaroCompat.Div>
            ))}
          </TaroCompat.Div>

          {createStep === 1 && (
            <TaroCompat.Div className="space-y-4">
              <TaroCompat.H3 className="text-base font-semibold text-gray-800">基本信息</TaroCompat.H3>
              <TaroCompat.Div>
                <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">计划名称</TaroCompat.Label>
                <TaroCompat.CompatInput placeholder="例如：6月正畸专项培训" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200 focus:border-[#2D5AF5]" />
              </TaroCompat.Div>
              <TaroCompat.Div>
                <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">培训目标</TaroCompat.Label>
                <TaroCompat.CompatTextarea placeholder="描述本次培训的目标..." rows={3} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200 focus:border-[#2D5AF5] resize-none" />
              </TaroCompat.Div>
              <TaroCompat.Div className="grid grid-cols-2 gap-4">
                <TaroCompat.Div>
                  <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">开始日期</TaroCompat.Label>
                  <TaroCompat.CompatInput type="date" defaultValue="2026-06-15" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200" />
                </TaroCompat.Div>
                <TaroCompat.Div>
                  <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">结束日期</TaroCompat.Label>
                  <TaroCompat.CompatInput type="date" defaultValue="2026-07-15" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200" />
                </TaroCompat.Div>
              </TaroCompat.Div>
            </TaroCompat.Div>
          )}
          {createStep === 2 && (
            <TaroCompat.Div className="space-y-4">
              <TaroCompat.H3 className="text-base font-semibold text-gray-800">选择目标学员</TaroCompat.H3>
              {['全部子账号', '按部门筛选', '按角色筛选', '指定人员'].map((opt, i) => (
                <TaroCompat.Label key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
                  <TaroCompat.CompatInput type="radio" name="target" defaultChecked={i === 0} className="text-[#2D5AF5]" />
                  <TaroCompat.Span className="text-sm text-gray-700">{opt}</TaroCompat.Span>
                </TaroCompat.Label>
              ))}
            </TaroCompat.Div>
          )}
          {createStep === 3 && (
            <TaroCompat.Div className="space-y-4">
              <TaroCompat.H3 className="text-base font-semibold text-gray-800">配置培训内容</TaroCompat.H3>
              <TaroCompat.Div className="space-y-2">
                {['平台预设课程', '企业自主课程', '仅指定讲师智能体答疑'].map((src, i) => (
                  <TaroCompat.Label key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50">
                    <TaroCompat.CompatInput type="checkbox" defaultChecked={i === 0} className="rounded text-[#2D5AF5]" />
                    <TaroCompat.Span className="text-sm text-gray-700">{src}</TaroCompat.Span>
                  </TaroCompat.Label>
                ))}
              </TaroCompat.Div>
            </TaroCompat.Div>
          )}
          {createStep === 4 && (
            <TaroCompat.Div className="space-y-4">
              <TaroCompat.H3 className="text-base font-semibold text-gray-800">考核标准</TaroCompat.H3>
              <TaroCompat.Div className="grid grid-cols-2 gap-4">
                <TaroCompat.Div>
                  <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">考试及格线</TaroCompat.Label>
                  <TaroCompat.CompatInput type="number" defaultValue={80} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200" />
                </TaroCompat.Div>
                <TaroCompat.Div>
                  <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">完成时限（天/课程）</TaroCompat.Label>
                  <TaroCompat.CompatInput type="number" defaultValue={7} className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-sm outline-none border border-gray-200" />
                </TaroCompat.Div>
              </TaroCompat.Div>
            </TaroCompat.Div>
          )}
          {createStep === 5 && (
            <TaroCompat.Div className="space-y-4">
              <TaroCompat.H3 className="text-base font-semibold text-gray-800">发布确认</TaroCompat.H3>
              <TaroCompat.Div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <TaroCompat.P className="text-gray-700"><TaroCompat.Span className="text-gray-500">计划名称：</TaroCompat.Span>新员工入职培训-第3期</TaroCompat.P>
                <TaroCompat.P className="text-gray-700"><TaroCompat.Span className="text-gray-500">目标学员：</TaroCompat.Span>全部子账号（24人）</TaroCompat.P>
                <TaroCompat.P className="text-gray-700"><TaroCompat.Span className="text-gray-500">培训周期：</TaroCompat.Span>2026-06-15 至 2026-07-15</TaroCompat.P>
                <TaroCompat.P className="text-gray-700"><TaroCompat.Span className="text-gray-500">预计消耗：</TaroCompat.Span>约 4,800 积分</TaroCompat.P>
              </TaroCompat.Div>
            </TaroCompat.Div>
          )}

          <TaroCompat.Div className="flex justify-end gap-3 mt-6">
            {createStep > 1 && (
              <TaroCompat.ButtonCompat onClick={() => setCreateStep(s => s - 1)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                上一步
              </TaroCompat.ButtonCompat>
            )}
            {createStep < 5 ? (
              <TaroCompat.ButtonCompat onClick={() => setCreateStep(s => s + 1)} className="px-4 py-2 bg-[#2D5AF5] text-white rounded-lg text-sm hover:bg-[#2548C8]">
                下一步
              </TaroCompat.ButtonCompat>
            ) : (
              <TaroCompat.ButtonCompat onClick={() => { setShowCreate(false); }} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600">
                发布计划
              </TaroCompat.ButtonCompat>
            )}
            <TaroCompat.ButtonCompat onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600">
              取消
            </TaroCompat.ButtonCompat>
          </TaroCompat.Div>
        </TaroCompat.Div>
      ) : (
        <TaroCompat.Div className="grid grid-cols-2 gap-4">
          {trainingPlans.map(plan => (
            <TaroCompat.Div key={plan.id} className="bg-white rounded-xl p-5 border border-gray-100">
              <TaroCompat.Div className="flex items-start justify-between mb-3">
                <TaroCompat.Div>
                  <TaroCompat.H3 className="text-base font-semibold text-gray-800">{plan.name}</TaroCompat.H3>
                  <TaroCompat.P className="text-xs text-gray-500 mt-1">{plan.description}</TaroCompat.P>
                </TaroCompat.Div>
                <TaroCompat.Span className={`text-xs px-2 py-0.5 rounded-full ${
                  plan.status === 'in_progress' ? 'bg-[#E8EFFD] text-[#2D5AF5]' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {plan.status === 'in_progress' ? '进行中' : '未开始'}
                </TaroCompat.Span>
              </TaroCompat.Div>
              <TaroCompat.Div className="grid grid-cols-3 gap-4 mb-4">
                <TaroCompat.Div className="flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-gray-400" />
                  <TaroCompat.Span className="text-xs text-gray-500">{plan.startDate} - {plan.endDate}</TaroCompat.Span>
                </TaroCompat.Div>
                <TaroCompat.Div className="flex items-center gap-1.5">
                  <Users size={13} className="text-gray-400" />
                  <TaroCompat.Span className="text-xs text-gray-500">{plan.completedCount}/{plan.targetCount}人</TaroCompat.Span>
                </TaroCompat.Div>
                <TaroCompat.Div className="flex items-center gap-1.5">
                  <Target size={13} className="text-gray-400" />
                  <TaroCompat.Span className="text-xs text-gray-500">完成率 {plan.progress}%</TaroCompat.Span>
                </TaroCompat.Div>
              </TaroCompat.Div>
              <TaroCompat.Div className="flex items-center gap-3">
                <TaroCompat.Div className="flex-1 h-2 bg-gray-100 rounded-full">
                  <TaroCompat.Div className="h-full bg-[#2D5AF5] rounded-full" style={{ width: `${plan.progress}%` }} />
                </TaroCompat.Div>
                <TaroCompat.ButtonCompat className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </TaroCompat.ButtonCompat>
              </TaroCompat.Div>
            </TaroCompat.Div>
          ))}
        </TaroCompat.Div>
      )}
    </TaroCompat.Div>
  );
}
