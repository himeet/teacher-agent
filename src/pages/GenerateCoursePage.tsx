import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Loader2, CheckCircle, Sparkles, BookOpen, FileText } from 'lucide-react';
import { instructors } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';

export default function GenerateCoursePage() {
  const { goBack, user, showToast, addCreditTransaction } = useApp();
  const [step, setStep] = useState<'input' | 'generating' | 'result'>('input');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'初级' | '中级' | '高级'>('中级');
  const [outputType, setOutputType] = useState<'course' | 'exam'>('course');
  const [selectedInstructor, setSelectedInstructor] = useState('i1');
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    if (!topic.trim()) {
      showToast('请输入课程主题', 'error');
      return;
    }
    if ((user.creditBalance || 0) < 100) {
      showToast('积分不足，请充值', 'error');
      return;
    }
    setStep('generating');
    // Animate progress
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setStep('result'), 500);
      }
      setProgress(Math.min(p, 100));
    }, 300);
  };

  const handleSave = () => {
    const newBalance = (user.creditBalance || 0) - 100;
    addCreditTransaction({
      id: `tx_${Date.now()}`,
      type: 'expense',
      amount: -100,
      source: `生成课程 - ${topic}`,
      createdAt: new Date().toLocaleString('zh-CN'),
      balance: newBalance,
    });
    showToast('课程已保存到"我的课程"', 'success');
    goBack();
  };

  const instructor = instructors.find(i => i.id === selectedInstructor);

  return (
    <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
      {/* Header */}
      <TaroCompat.Div className="sticky top-0 bg-white z-10 flex items-center px-4 py-3 border-b border-gray-100">
        <TaroCompat.ButtonCompat onClick={goBack} className="w-8 h-8 flex items-center justify-center -ml-2">
          <ArrowLeft size={20} className="text-gray-700" />
        </TaroCompat.ButtonCompat>
        <TaroCompat.H1 className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <TaroCompat.Span className="text-base font-semibold text-gray-800">生成课程</TaroCompat.Span>
        </TaroCompat.H1>
      </TaroCompat.Div>

      {step === 'input' && (
        <TaroCompat.Div className="p-4 space-y-4">
          {/* Instructor Selection */}
          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">选择讲师风格</TaroCompat.H3>
            <TaroCompat.Div className="space-y-2">
              {instructors.filter(i => i.isPurchased).map(inst => (
                <TaroCompat.ButtonCompat
                  key={inst.id}
                  onClick={() => setSelectedInstructor(inst.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedInstructor === inst.id
                      ? 'border-[#2D5AF5] bg-[#E8EFFD]'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <TaroCompat.Img src={inst.avatar} alt={inst.name} className="w-10 h-10 rounded-full object-cover" />
                  <TaroCompat.Div className="text-left flex-1">
                    <TaroCompat.P className="text-sm font-medium text-gray-800">{inst.name}</TaroCompat.P>
                    <TaroCompat.P className="text-xs text-gray-500">{inst.title}</TaroCompat.P>
                  </TaroCompat.Div>
                  {selectedInstructor === inst.id && <CheckCircle size={18} className="text-[#2D5AF5]" />}
                </TaroCompat.ButtonCompat>
              ))}
            </TaroCompat.Div>
          </TaroCompat.Div>

          {/* Topic Input */}
          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">输入课程主题</TaroCompat.H3>
            <TaroCompat.CompatInput
              value={topic}
              onChange={(e: any) => setTopic(e.target.value)}
              placeholder="例如：隐形矫正初诊沟通"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2D5AF5]/30 border border-gray-200 focus:border-[#2D5AF5]"
            />
          </TaroCompat.Div>

          {/* Difficulty */}
          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">选择难度</TaroCompat.H3>
            <TaroCompat.Div className="flex gap-2">
              {(['初级', '中级', '高级'] as const).map(d => (
                <TaroCompat.ButtonCompat
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    difficulty === d
                      ? 'bg-[#2D5AF5] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {d}
                </TaroCompat.ButtonCompat>
              ))}
            </TaroCompat.Div>
          </TaroCompat.Div>

          {/* Output Type */}
          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">输出形式</TaroCompat.H3>
            <TaroCompat.Div className="flex gap-2">
              {[
                { key: 'course' as const, label: '课程大纲+考试', icon: BookOpen },
                { key: 'exam' as const, label: '仅考试卷', icon: FileText },
              ].map(t => (
                <TaroCompat.ButtonCompat
                  key={t.key}
                  onClick={() => setOutputType(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    outputType === t.key
                      ? 'bg-[#2D5AF5] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <t.icon size={16} />
                  {t.label}
                </TaroCompat.ButtonCompat>
              ))}
            </TaroCompat.Div>
          </TaroCompat.Div>

          {/* Credit & Generate */}
          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.Div className="flex items-center justify-between mb-4">
              <TaroCompat.Span className="text-sm text-gray-600">预计消耗</TaroCompat.Span>
              <TaroCompat.Span className="text-sm font-bold text-[#2D5AF5]">100 积分</TaroCompat.Span>
            </TaroCompat.Div>
            <TaroCompat.Div className="flex items-center justify-between mb-4">
              <TaroCompat.Span className="text-sm text-gray-600">当前余额</TaroCompat.Span>
              <TaroCompat.Span className="text-sm text-gray-800">{user.creditBalance?.toLocaleString()} 积分</TaroCompat.Span>
            </TaroCompat.Div>
            <TaroCompat.ButtonCompat
              onClick={handleGenerate}
              disabled={(user.creditBalance || 0) < 100}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                (user.creditBalance || 0) >= 100
                  ? 'bg-[#2D5AF5] text-white hover:bg-[#2548C8]'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Sparkles size={16} />
              开始生成
            </TaroCompat.ButtonCompat>
            {(user.creditBalance || 0) < 100 && (
              <TaroCompat.P className="text-xs text-center text-red-500 mt-2">积分不足，请先充值</TaroCompat.P>
            )}
          </TaroCompat.Div>
        </TaroCompat.Div>
      )}

      {step === 'generating' && (
        <TaroCompat.Div className="flex flex-col items-center justify-center py-20 px-8">
          <TaroCompat.Div className="w-16 h-16 bg-[#E8EFFD] rounded-2xl flex items-center justify-center mb-6">
            <Loader2 size={28} className="text-[#2D5AF5] animate-spin" />
          </TaroCompat.Div>
          <TaroCompat.H3 className="text-lg font-semibold text-gray-800 mb-2">AI正在生成内容...</TaroCompat.H3>
          <TaroCompat.P className="text-sm text-gray-500 text-center mb-8">
            基于{instructor?.name}的授课风格生成{outputType === 'course' ? '课程大纲与考试' : '考试卷'}
          </TaroCompat.P>
          <TaroCompat.Div className="w-full h-2 bg-gray-100 rounded-full">
            <TaroCompat.Div className="h-full bg-[#2D5AF5] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </TaroCompat.Div>
          <TaroCompat.P className="text-xs text-gray-400 mt-2">{Math.round(progress)}%</TaroCompat.P>
        </TaroCompat.Div>
      )}

      {step === 'result' && (
        <TaroCompat.Div className="p-4 space-y-4">
          <TaroCompat.Div className="bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle size={24} className="text-emerald-500" />
            <TaroCompat.Div>
              <TaroCompat.P className="text-sm font-semibold text-emerald-700">生成成功！</TaroCompat.P>
              <TaroCompat.P className="text-xs text-emerald-600">课程已准备就绪</TaroCompat.P>
            </TaroCompat.Div>
          </TaroCompat.Div>

          <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.H3 className="text-base font-semibold text-gray-800 mb-1">{topic || '未命名课程'}</TaroCompat.H3>
            <TaroCompat.P className="text-xs text-gray-500 mb-4">讲师：{instructor?.name} · 难度：{difficulty}</TaroCompat.P>

            <TaroCompat.Div className="space-y-3">
              {[
                { title: '一、课程概述', content: '本课程针对隐形矫正初诊沟通场景，系统讲解如何建立患者信任、挖掘真实需求、有效展示矫正价值。' },
                { title: '二、核心知识点', content: '1. 初诊接待标准流程\n2. 患者需求挖掘技巧\n3. 隐形矫正优势话术\n4. 价格异议处理策略\n5. 成交促成技巧' },
                { title: '三、实战演练', content: '通过3个真实案例模拟，帮助学员掌握从接待到成交的完整沟通链路。' },
              ].map(section => (
                <TaroCompat.Div key={section.title} className="border border-gray-100 rounded-lg p-3">
                  <TaroCompat.H4 className="text-sm font-medium text-gray-800 mb-1">{section.title}</TaroCompat.H4>
                  <TaroCompat.P className="text-xs text-gray-600 whitespace-pre-line">{section.content}</TaroCompat.P>
                </TaroCompat.Div>
              ))}
            </TaroCompat.Div>
          </TaroCompat.Div>

          {outputType === 'course' && (
            <TaroCompat.Div className="bg-white rounded-xl p-4 shadow-sm">
              <TaroCompat.H3 className="text-sm font-semibold text-gray-800 mb-3">配套考试（预览）</TaroCompat.H3>
              <TaroCompat.Div className="space-y-2">
                {[
                  '当患者说"我再考虑考虑"时，以下哪种应对方式最有效？',
                  '隐形矫正初诊沟通中，以下哪些环节是必需的？',
                  '患者说"我朋友在其他地方做的才一半价格"，以下回复最恰当的是：',
                ].map((q, i) => (
                  <TaroCompat.Div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <TaroCompat.Span className="text-xs text-[#2D5AF5] font-medium shrink-0">Q{i + 1}</TaroCompat.Span>
                    <TaroCompat.P className="text-xs text-gray-700">{q}</TaroCompat.P>
                  </TaroCompat.Div>
                ))}
              </TaroCompat.Div>
            </TaroCompat.Div>
          )}

          <TaroCompat.Div className="flex gap-3">
            <TaroCompat.ButtonCompat
              onClick={handleSave}
              className="flex-1 bg-[#2D5AF5] text-white py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              保存到课程
            </TaroCompat.ButtonCompat>
            <TaroCompat.ButtonCompat
              onClick={() => { setStep('input'); setTopic(''); setProgress(0); }}
              className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl text-sm font-semibold"
            >
              重新生成
            </TaroCompat.ButtonCompat>
          </TaroCompat.Div>
        </TaroCompat.Div>
      )}
    </TaroCompat.Div>
  );
}
