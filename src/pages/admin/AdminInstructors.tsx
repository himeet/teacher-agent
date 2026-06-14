import { useState } from 'react';
import { Bot, Plus, MessageCircle, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';
import { instructors } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';

export default function AdminInstructors() {
  const [tab, setTab] = useState<'platform' | 'private'>('platform');
  const [showCreate, setShowCreate] = useState(false);

  return (
    <TaroCompat.Div className="p-6 space-y-4">
      <TaroCompat.Div className="flex items-center justify-between">
        <TaroCompat.H1 className="text-xl font-bold text-gray-800">讲师智能体</TaroCompat.H1>
        {tab === 'private' && (
          <TaroCompat.ButtonCompat
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2D5AF5] text-white rounded-lg text-sm hover:bg-[#2548C8]"
          >
            <Plus size={14} />
            新建智能体
          </TaroCompat.ButtonCompat>
        )}
      </TaroCompat.Div>

      {showCreate && (
        <TaroCompat.Div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
          <TaroCompat.H3 className="text-sm font-semibold text-gray-800">新建企业私有讲师</TaroCompat.H3>
          <TaroCompat.Div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            <TaroCompat.P className="text-sm text-gray-600">上传讲师资料（PPT/PDF/视频/文字）</TaroCompat.P>
            <TaroCompat.ButtonCompat className="mt-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg">选择文件</TaroCompat.ButtonCompat>
          </TaroCompat.Div>
          <TaroCompat.Div>
            <TaroCompat.Label className="text-sm text-gray-600 mb-1 block">问答风格</TaroCompat.Label>
            <TaroCompat.Div className="flex gap-2">
              {['严谨', '亲和', '幽默'].map(s => (
                <TaroCompat.ButtonCompat key={s} className="flex-1 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 hover:bg-[#E8EFFD] hover:text-[#2D5AF5] transition-all">
                  {s}
                </TaroCompat.ButtonCompat>
              ))}
            </TaroCompat.Div>
          </TaroCompat.Div>
          <TaroCompat.Div className="flex justify-end gap-2">
            <TaroCompat.ButtonCompat onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-400">取消</TaroCompat.ButtonCompat>
            <TaroCompat.ButtonCompat onClick={() => setShowCreate(false)} className="px-4 py-2 bg-[#2D5AF5] text-white rounded-lg text-sm">提交训练</TaroCompat.ButtonCompat>
          </TaroCompat.Div>
        </TaroCompat.Div>
      )}

      <TaroCompat.Div className="flex gap-0 bg-white rounded-xl p-1 border border-gray-100 w-fit">
        {[
          { key: 'platform' as const, label: '平台签约讲师' },
          { key: 'private' as const, label: '企业私有讲师' },
        ].map(t => (
          <TaroCompat.ButtonCompat
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              tab === t.key ? 'bg-[#2D5AF5] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </TaroCompat.ButtonCompat>
        ))}
      </TaroCompat.Div>

      {tab === 'platform' && (
        <TaroCompat.Div className="space-y-3">
          {instructors.map(inst => (
            <TaroCompat.Div key={inst.id} className="bg-white rounded-xl p-5 border border-gray-100">
              <TaroCompat.Div className="flex items-start gap-4">
                <TaroCompat.Img src={inst.avatar} alt={inst.name} className="w-14 h-14 rounded-full object-cover" />
                <TaroCompat.Div className="flex-1">
                  <TaroCompat.Div className="flex items-center justify-between">
                    <TaroCompat.Div>
                      <TaroCompat.H3 className="text-base font-semibold text-gray-800">{inst.name}</TaroCompat.H3>
                      <TaroCompat.P className="text-xs text-gray-500">{inst.title}</TaroCompat.P>
                    </TaroCompat.Div>
                    <TaroCompat.Span className={`text-xs px-3 py-1 rounded-full ${
                      inst.isPurchased ? 'bg-emerald-50 text-emerald-600' : 'bg-[#E8EFFD] text-[#2D5AF5]'
                    }`}>
                      {inst.isPurchased ? '已选购' : '未选购'}
                    </TaroCompat.Span>
                  </TaroCompat.Div>
                  <TaroCompat.P className="text-xs text-gray-600 mt-2 leading-relaxed">{inst.description}</TaroCompat.P>
                  <TaroCompat.Div className="flex items-center gap-4 mt-3">
                    <TaroCompat.Span className="text-xs text-gray-500">{inst.specialty}</TaroCompat.Span>
                    <TaroCompat.Span className="text-xs text-gray-500">{inst.courses}门课程</TaroCompat.Span>
                    <TaroCompat.Span className="text-xs text-gray-500">{inst.students}学员</TaroCompat.Span>
                    <TaroCompat.Span className="text-xs text-gray-500">服务{Math.floor(inst.students / 100)}家企业</TaroCompat.Span>
                  </TaroCompat.Div>
                </TaroCompat.Div>
              </TaroCompat.Div>
              {/* Usage Stats */}
              {inst.isPurchased && (
                <TaroCompat.Div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-4 gap-4">
                  <TaroCompat.Div className="flex items-center gap-1.5">
                    <MessageCircle size={13} className="text-[#2D5AF5]" />
                    <TaroCompat.Span className="text-xs text-gray-600">本月调用 328次</TaroCompat.Span>
                  </TaroCompat.Div>
                  <TaroCompat.Div className="flex items-center gap-1.5">
                    <ThumbsUp size={13} className="text-emerald-500" />
                    <TaroCompat.Span className="text-xs text-gray-600">好评率 94%</TaroCompat.Span>
                  </TaroCompat.Div>
                  <TaroCompat.Div className="flex items-center gap-1.5">
                    <ThumbsDown size={13} className="text-red-400" />
                    <TaroCompat.Span className="text-xs text-gray-600">差评率 6%</TaroCompat.Span>
                  </TaroCompat.Div>
                  <TaroCompat.Div className="flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-amber-500" />
                    <TaroCompat.Span className="text-xs text-gray-600">较上月 +12%</TaroCompat.Span>
                  </TaroCompat.Div>
                </TaroCompat.Div>
              )}
            </TaroCompat.Div>
          ))}
        </TaroCompat.Div>
      )}

      {tab === 'private' && (
        <TaroCompat.Div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <Bot size={40} className="text-gray-300 mx-auto mb-3" />
          <TaroCompat.P className="text-sm text-gray-500">暂无企业私有讲师</TaroCompat.P>
          <TaroCompat.P className="text-xs text-gray-400 mt-1">点击"新建智能体"创建您自己的AI讲师</TaroCompat.P>
        </TaroCompat.Div>
      )}
    </TaroCompat.Div>
  );
}
