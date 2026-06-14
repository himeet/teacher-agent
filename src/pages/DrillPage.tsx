import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Target, User, Clock, Zap, Send, X, MessageCircle, BookOpen } from 'lucide-react';
import * as TaroCompat from '@/components/TaroCompat';

const scenes = [
  { id: 's1', name: '隐形矫正初诊接待', category: '初诊', difficulty: '中等', icon: '👋' },
  { id: 's2', name: '种植牙方案解读', category: '方案解读', difficulty: '困难', icon: '🦷' },
  { id: 's3', name: '价格异议处理', category: '客诉', difficulty: '困难', icon: '💰' },
  { id: 's4', name: '复诊患者跟进', category: '复诊', difficulty: '简单', icon: '📅' },
  { id: 's5', name: '未成交客户回访', category: '未成交追踪', difficulty: '中等', icon: '📞' },
  { id: 's6', name: '老客户激活', category: '老客户激活', difficulty: '简单', icon: '⭐' },
];

const drillMessages = [
  { role: 'patient' as const, content: '你好，我想了解一下隐形矫正，但是听说挺贵的？' },
  { role: 'patient' as const, content: '我朋友在其他地方做的才一万多，你们这边怎么要两万多？' },
  { role: 'patient' as const, content: '那这个矫正需要多长时间啊？我工作比较忙，不想老往医院跑。' },
];

export default function DrillPage() {
  const { goBack, user, showToast } = useApp();
  const [step, setStep] = useState<'select' | 'config' | 'drill' | 'report'>('select');
  const [selectedScene, setSelectedScene] = useState<typeof scenes[0] | null>(null);
  const [role, setRole] = useState<'医生' | '现场咨询' | '客服' | '网电咨询'>('现场咨询');
  type DrillMsg = { role: 'patient' | 'user'; content: string };
  const [messages, setMessages] = useState<DrillMsg[]>([]);
  const [input, setInput] = useState('');
  const [drillScore, setDrillScore] = useState(0);

  const handleStartDrill = () => {
    if ((user.creditBalance || 0) < 100) {
      showToast('积分不足，请充值', 'error');
      return;
    }
    setStep('drill');
    setMessages([{ role: 'patient', content: drillMessages[0].content }]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: DrillMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // Simulate patient response
    setTimeout(() => {
      const patientCount = messages.filter(m => m.role === 'patient').length;
      const nextIdx = patientCount;
      if (nextIdx < drillMessages.length) {
        setMessages(prev => [...prev, { role: 'patient', content: drillMessages[nextIdx].content }]);
      } else {
        // End drill
        setTimeout(() => {
          setDrillScore(82);
          setStep('report');
        }, 1000);
      }
    }, 1500);
  };

  if (step === 'report') {
    const dimensions = [
      { name: '沟通逻辑', score: 88 },
      { name: '专业度', score: 85 },
      { name: '成交导向', score: 76 },
      { name: '情绪管理', score: 90 },
      { name: '需求挖掘', score: 72 },
    ];

    return (
      <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
        <TaroCompat.Div className="sticky top-0 bg-white z-10 flex items-center px-4 py-3 border-b border-gray-100">
          <TaroCompat.ButtonCompat onClick={goBack} className="w-8 h-8 flex items-center justify-center -ml-2">
            <ArrowLeft size={20} className="text-gray-700" />
          </TaroCompat.ButtonCompat>
          <TaroCompat.H1 className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <TaroCompat.Span className="text-base font-semibold text-gray-800">对练报告</TaroCompat.Span>
          </TaroCompat.H1>
        </TaroCompat.Div>

        <TaroCompat.Div className="p-4 space-y-4">
          <TaroCompat.Div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <TaroCompat.P className="text-4xl font-bold text-gray-800">{drillScore}</TaroCompat.P>
            <TaroCompat.P className="text-sm text-gray-500 mt-1">综合评分</TaroCompat.P>
            <TaroCompat.Div className="flex justify-center gap-4 mt-4">
              {dimensions.map(d => (
                <TaroCompat.Div key={d.name} className="text-center">
                  <TaroCompat.Div className="w-12 h-12 rounded-full bg-[#E8EFFD] flex items-center justify-center mx-auto mb-1">
                    <TaroCompat.Span className="text-xs font-bold text-[#2D5AF5]">{d.score}</TaroCompat.Span>
                  </TaroCompat.Div>
                  <TaroCompat.P className="text-[10px] text-gray-500">{d.name}</TaroCompat.P>
                </TaroCompat.Div>
              ))}
            </TaroCompat.Div>
          </TaroCompat.Div>

          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H4 className="text-sm font-semibold text-gray-800 mb-3">话术优化建议</TaroCompat.H4>
            <TaroCompat.Div className="space-y-2">
              <TaroCompat.Div className="p-3 bg-red-50 rounded-lg">
                <TaroCompat.P className="text-xs text-red-600 line-through">"这个很便宜的，效果很好的"</TaroCompat.P>
                <TaroCompat.P className="text-xs text-emerald-600 mt-1">→ "您之前了解的价格是多少呢？我们可以根据您的预算推荐合适的方案。"</TaroCompat.P>
              </TaroCompat.Div>
              <TaroCompat.Div className="p-3 bg-amber-50 rounded-lg">
                <TaroCompat.P className="text-xs text-amber-700">建议：在回答价格问题前，先确认患者的真实预算范围和核心需求。</TaroCompat.P>
              </TaroCompat.Div>
            </TaroCompat.Div>
          </TaroCompat.Div>

          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H4 className="text-sm font-semibold text-gray-800 mb-3">推荐学习</TaroCompat.H4>
            <TaroCompat.Div className="flex gap-3">
              <TaroCompat.ButtonCompat className="flex-1 flex items-center gap-2 p-3 bg-[#E8EFFD] rounded-lg">
                <BookOpen size={16} className="text-[#2D5AF5]" />
                <TaroCompat.Span className="text-xs text-[#2D5AF5]">价格异议处理课程</TaroCompat.Span>
              </TaroCompat.ButtonCompat>
              <TaroCompat.ButtonCompat className="flex-1 flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                <MessageCircle size={16} className="text-emerald-500" />
                <TaroCompat.Span className="text-xs text-emerald-600">相关问答</TaroCompat.Span>
              </TaroCompat.ButtonCompat>
            </TaroCompat.Div>
          </TaroCompat.Div>

          <TaroCompat.ButtonCompat
            onClick={goBack}
            className="w-full bg-[#2D5AF5] text-white py-3.5 rounded-xl text-sm font-semibold"
          >
            完成
          </TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      </TaroCompat.Div>
    );
  }

  if (step === 'drill') {
    return (
      <TaroCompat.Div className="h-full flex flex-col bg-[#F4F6F8]">
        <TaroCompat.Div className="shrink-0 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <TaroCompat.ButtonCompat onClick={() => setStep('select')}>
            <X size={20} className="text-gray-600" />
          </TaroCompat.ButtonCompat>
          <TaroCompat.Div className="text-center">
            <TaroCompat.P className="text-sm font-semibold text-gray-800">{selectedScene?.name}</TaroCompat.P>
            <TaroCompat.P className="text-[10px] text-gray-500">{role}角色</TaroCompat.P>
          </TaroCompat.Div>
          <TaroCompat.Div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            <TaroCompat.Span>不限时</TaroCompat.Span>
          </TaroCompat.Div>
        </TaroCompat.Div>

        <TaroCompat.Div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <TaroCompat.Div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'patient' && (
                <TaroCompat.Div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2 shrink-0 self-start">
                  <User size={14} className="text-amber-600" />
                </TaroCompat.Div>
              )}
              <TaroCompat.Div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-[#2D5AF5] text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                {msg.content}
              </TaroCompat.Div>
            </TaroCompat.Div>
          ))}
        </TaroCompat.Div>

        <TaroCompat.Div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2">
          <TaroCompat.CompatInput
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            onKeyDown={(e: any) => e.key === 'Enter' && handleSend()}
            placeholder="输入回复..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none"
          />
          <TaroCompat.ButtonCompat
            onClick={handleSend}
            disabled={!input.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              input.trim() ? 'bg-[#2D5AF5] text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={14} />
          </TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      </TaroCompat.Div>
    );
  }

  if (step === 'config') {
    return (
      <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
        <TaroCompat.Div className="sticky top-0 bg-white z-10 flex items-center px-4 py-3 border-b border-gray-100">
          <TaroCompat.ButtonCompat onClick={() => setStep('select')} className="w-8 h-8 flex items-center justify-center -ml-2">
            <ArrowLeft size={20} className="text-gray-700" />
          </TaroCompat.ButtonCompat>
          <TaroCompat.H1 className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <TaroCompat.Span className="text-base font-semibold text-gray-800">角色设定</TaroCompat.Span>
          </TaroCompat.H1>
        </TaroCompat.Div>

        <TaroCompat.Div className="p-4 space-y-4">
          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">您的角色</TaroCompat.H3>
            <TaroCompat.Div className="grid grid-cols-2 gap-2">
              {(['医生', '现场咨询', '客服', '网电咨询'] as const).map(r => (
                <TaroCompat.ButtonCompat
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2.5 rounded-xl text-sm transition-all ${
                    role === r ? 'bg-[#2D5AF5] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {r}
                </TaroCompat.ButtonCompat>
              ))}
            </TaroCompat.Div>
          </TaroCompat.Div>

          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">AI患者设定</TaroCompat.H3>
            <TaroCompat.Div className="space-y-3">
              <TaroCompat.Div>
                <TaroCompat.Label className="text-xs text-gray-500 mb-1 block">患者画像</TaroCompat.Label>
                <TaroCompat.SelectCompat className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-200">
                  <TaroCompat.OptionCompat>28岁女性 · 牙齿不齐 · 关注美观</TaroCompat.OptionCompat>
                  <TaroCompat.OptionCompat>35岁男性 · 缺牙 · 关注功能</TaroCompat.OptionCompat>
                  <TaroCompat.OptionCompat>16岁学生 · 家长陪同 · 关注价格</TaroCompat.OptionCompat>
                </TaroCompat.SelectCompat>
              </TaroCompat.Div>
              <TaroCompat.Div>
                <TaroCompat.Label className="text-xs text-gray-500 mb-1 block">复杂程度</TaroCompat.Label>
                <TaroCompat.Div className="flex gap-2">
                  {['简单', '中等', '困难'].map(d => (
                    <TaroCompat.ButtonCompat key={d} className="flex-1 py-2 bg-gray-50 rounded-lg text-xs text-gray-600 hover:bg-[#E8EFFD] hover:text-[#2D5AF5]">
                      {d}
                    </TaroCompat.ButtonCompat>
                  ))}
                </TaroCompat.Div>
              </TaroCompat.Div>
            </TaroCompat.Div>
          </TaroCompat.Div>

          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.Div className="flex items-center justify-between mb-4">
              <TaroCompat.Span className="text-sm text-gray-600">消耗积分</TaroCompat.Span>
              <TaroCompat.Span className="text-sm font-bold text-[#2D5AF5]">100 积分</TaroCompat.Span>
            </TaroCompat.Div>
            <TaroCompat.ButtonCompat
              onClick={handleStartDrill}
              className="w-full bg-[#2D5AF5] text-white py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              开始对练
            </TaroCompat.ButtonCompat>
          </TaroCompat.Div>
        </TaroCompat.Div>
      </TaroCompat.Div>
    );
  }

  // Scene selection
  return (
    <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
      <TaroCompat.Div className="sticky top-0 bg-white z-10 flex items-center px-4 py-3 border-b border-gray-100">
        <TaroCompat.ButtonCompat onClick={goBack} className="w-8 h-8 flex items-center justify-center -ml-2">
          <ArrowLeft size={20} className="text-gray-700" />
        </TaroCompat.ButtonCompat>
        <TaroCompat.H1 className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <TaroCompat.Span className="text-base font-semibold text-gray-800">情景对练</TaroCompat.Span>
        </TaroCompat.H1>
      </TaroCompat.Div>

      <TaroCompat.Div className="p-4">
        {/* Categories */}
        <TaroCompat.Div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {['全部', '初诊', '复诊', '方案解读', '客诉', '未成交追踪', '老客户激活'].map(cat => (
            <TaroCompat.ButtonCompat
              key={cat}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${
                cat === '全部' ? 'bg-[#2D5AF5] text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {cat}
            </TaroCompat.ButtonCompat>
          ))}
        </TaroCompat.Div>

        {/* Scene Cards */}
        <TaroCompat.Div className="space-y-3">
          {scenes.map(scene => (
            <TaroCompat.ButtonCompat
              key={scene.id}
              onClick={() => { setSelectedScene(scene); setStep('config'); }}
              className="w-full bg-white rounded-xl p-4 shadow-sm text-left flex items-center gap-3"
            >
              <TaroCompat.Div className="w-12 h-12 bg-[#E8EFFD] rounded-xl flex items-center justify-center text-xl">
                <Target size={20} className="text-[#2D5AF5]" />
              </TaroCompat.Div>
              <TaroCompat.Div className="flex-1">
                <TaroCompat.P className="text-sm font-medium text-gray-800">{scene.name}</TaroCompat.P>
                <TaroCompat.Div className="flex items-center gap-2 mt-1">
                  <TaroCompat.Span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{scene.category}</TaroCompat.Span>
                  <TaroCompat.Span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    scene.difficulty === '简单' ? 'bg-emerald-50 text-emerald-600' :
                    scene.difficulty === '中等' ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-500'
                  }`}>
                    {scene.difficulty}
                  </TaroCompat.Span>
                </TaroCompat.Div>
              </TaroCompat.Div>
              <ArrowLeft size={16} className="text-gray-300 rotate-180" />
            </TaroCompat.ButtonCompat>
          ))}
        </TaroCompat.Div>

        {/* Custom Scene */}
        <TaroCompat.ButtonCompat className="w-full mt-4 bg-white rounded-xl p-4 shadow-sm border-2 border-dashed border-gray-200 text-center">
          <TaroCompat.P className="text-sm text-gray-500">自定义场景（高级功能）</TaroCompat.P>
          <TaroCompat.P className="text-xs text-gray-400 mt-0.5">消耗 150 积分</TaroCompat.P>
        </TaroCompat.ButtonCompat>
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
