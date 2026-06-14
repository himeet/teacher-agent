import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { exams, examQuestions } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';

export default function ExamPage() {
  const { goBack, showToast, addCreditTransaction, user } = useApp();
  const [examTab, setExamTab] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [activeExam, setActiveExam] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(0);

  const filteredExams = exams.filter(e => {
    if (examTab === 'all') return true;
    return e.status === examTab;
  });

  const handleStartExam = (examId: string) => {
    if ((user.creditBalance || 0) < 100) {
      showToast('积分不足，请充值', 'error');
      return;
    }
    setActiveExam(examId);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setScoreAnim(0);
  };

  const handleAnswer = (qIndex: number, value: number) => {
    const q = examQuestions[qIndex];
    if (q.type === 'single') {
      setAnswers(prev => ({ ...prev, [qIndex]: value }));
    } else {
      setAnswers(prev => {
        const current = (prev[qIndex] as number[]) || [];
        if (current.includes(value)) {
          return { ...prev, [qIndex]: current.filter(v => v !== value) };
        }
        return { ...prev, [qIndex]: [...current, value] };
      });
    }
  };

  const handleSubmit = () => {
    let score = 0;
    examQuestions.forEach((q, i) => {
      const ans = answers[i];
      if (q.type === 'single') {
        if (ans === q.correct) score += 20;
      } else {
        const correctArr = q.correct as number[];
        const ansArr = (ans as number[]) || [];
        if (ansArr.length === correctArr.length && ansArr.every(a => correctArr.includes(a))) {
          score += 20;
        }
      }
    });

    setShowResult(true);
    // Animate score
    let s = 0;
    const interval = setInterval(() => {
      s += 2;
      if (s >= score) {
        s = score;
        clearInterval(interval);
      }
      setScoreAnim(s);
    }, 30);

    // Deduct credits
    const newBalance = (user.creditBalance || 0) - 100;
    addCreditTransaction({
      id: `tx_exam_${Date.now()}`,
      type: 'expense',
      amount: -100,
      source: '考试 - 综合能力测评',
      createdAt: new Date().toLocaleString('zh-CN'),
      balance: newBalance,
    });
  };

  const activeExamData = exams.find(e => e.id === activeExam);

  if (showResult && activeExamData) {
    const passed = scoreAnim >= 60;
    return (
      <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
        <TaroCompat.Div className="sticky top-0 bg-white z-10 flex items-center px-4 py-3 border-b border-gray-100">
          <TaroCompat.ButtonCompat onClick={() => { setActiveExam(null); setShowResult(false); }} className="w-8 h-8 flex items-center justify-center -ml-2">
            <ArrowLeft size={20} className="text-gray-700" />
          </TaroCompat.ButtonCompat>
          <TaroCompat.H1 className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <TaroCompat.Span className="text-base font-semibold text-gray-800">考试结果</TaroCompat.Span>
          </TaroCompat.H1>
        </TaroCompat.Div>

        <TaroCompat.Div className="p-6 text-center">
          <TaroCompat.Div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
            {passed ? <CheckCircle size={40} className="text-emerald-500" /> : <XCircle size={40} className="text-red-500" />}
          </TaroCompat.Div>
          <TaroCompat.P className="text-5xl font-bold text-gray-800 mb-1">{scoreAnim}</TaroCompat.P>
          <TaroCompat.P className="text-sm text-gray-500 mb-2">满分100分</TaroCompat.P>
          <TaroCompat.Span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
            passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {scoreAnim >= 80 ? '优秀' : scoreAnim >= 60 ? '及格' : '不及格'}
          </TaroCompat.Span>

          <TaroCompat.Div className="bg-white rounded-xl p-4 mt-6 shadow-sm text-left">
            <TaroCompat.H4 className="text-sm font-semibold text-gray-800 mb-3">错题解析</TaroCompat.H4>
            {examQuestions.map((q, i) => {
              const ans = answers[i];
              let isCorrect = false;
              if (q.type === 'single') {
                isCorrect = ans === q.correct;
              } else {
                const correctArr = q.correct as number[];
                const ansArr = (ans as number[]) || [];
                isCorrect = ansArr.length === correctArr.length && ansArr.every(a => correctArr.includes(a));
              }
              if (isCorrect) return null;
              return (
                <TaroCompat.Div key={q.id} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
                  <TaroCompat.P className="text-sm text-gray-700 mb-1">{i + 1}. {q.question}</TaroCompat.P>
                  <TaroCompat.P className="text-xs text-red-500">您的答案：{q.type === 'single' ? (ans !== undefined ? q.options[ans as number] : '未作答') : ((ans as number[]) || []).map(a => q.options[a]).join(', ') || '未作答'}</TaroCompat.P>
                  <TaroCompat.P className="text-xs text-emerald-600 mt-0.5">
                    正确答案：{q.type === 'single' ? q.options[q.correct as number] : (q.correct as number[]).map(c => q.options[c]).join(', ')}
                  </TaroCompat.P>
                  <TaroCompat.P className="text-xs text-gray-500 mt-1">{q.explanation}</TaroCompat.P>
                </TaroCompat.Div>
              );
            })}
          </TaroCompat.Div>

          <TaroCompat.ButtonCompat
            onClick={() => { setActiveExam(null); setShowResult(false); }}
            className="w-full mt-6 bg-[#2D5AF5] text-white py-3.5 rounded-xl text-sm font-semibold"
          >
            返回考试列表
          </TaroCompat.ButtonCompat>
        </TaroCompat.Div>
      </TaroCompat.Div>
    );
  }

  if (activeExam && activeExamData) {
    const q = examQuestions[currentQuestion];
    const totalQ = examQuestions.length;
    const answered = Object.keys(answers).length;

    return (
      <TaroCompat.Div className="min-h-full bg-[#F4F6F8] flex flex-col">
        {/* Header */}
        <TaroCompat.Div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100">
          <TaroCompat.Div className="flex items-center justify-between mb-2">
            <TaroCompat.ButtonCompat onClick={() => setActiveExam(null)} className="text-sm text-gray-500">退出</TaroCompat.ButtonCompat>
            <TaroCompat.Div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock size={14} />
              <TaroCompat.Span>{activeExamData.duration}:00</TaroCompat.Span>
            </TaroCompat.Div>
          </TaroCompat.Div>
          <TaroCompat.Div className="flex items-center gap-3">
            <TaroCompat.Span className="text-xs text-gray-500">已答 {answered}/{totalQ}</TaroCompat.Span>
            <TaroCompat.Div className="flex-1 h-2 bg-gray-100 rounded-full">
              <TaroCompat.Div className="h-full bg-[#2D5AF5] rounded-full" style={{ width: `${(answered / totalQ) * 100}%` }} />
            </TaroCompat.Div>
          </TaroCompat.Div>
        </TaroCompat.Div>

        {/* Question */}
        <TaroCompat.Div className="flex-1 p-4">
          <TaroCompat.Div className="bg-white rounded-xl p-5 shadow-sm">
            <TaroCompat.Span className="text-xs text-[#2D5AF5] font-medium bg-[#E8EFFD] px-2 py-0.5 rounded">
              {q.type === 'single' ? '单选题' : '多选题'}
            </TaroCompat.Span>
            <TaroCompat.P className="text-base text-gray-800 mt-3 mb-4">{currentQuestion + 1}. {q.question}</TaroCompat.P>
            <TaroCompat.Div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isSelected = q.type === 'single'
                  ? answers[currentQuestion] === idx
                  : ((answers[currentQuestion] as number[]) || []).includes(idx);
                return (
                  <TaroCompat.ButtonCompat
                    key={idx}
                    onClick={() => handleAnswer(currentQuestion, idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#2D5AF5] bg-[#E8EFFD] text-[#2D5AF5]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <TaroCompat.Div className="flex items-center gap-3">
                      <TaroCompat.Span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isSelected ? 'bg-[#2D5AF5] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </TaroCompat.Span>
                      <TaroCompat.Span className="text-sm">{opt}</TaroCompat.Span>
                    </TaroCompat.Div>
                  </TaroCompat.ButtonCompat>
                );
              })}
            </TaroCompat.Div>
          </TaroCompat.Div>
        </TaroCompat.Div>

        {/* Bottom Nav */}
        <TaroCompat.Div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3">
          <TaroCompat.ButtonCompat
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2.5 rounded-xl text-sm text-gray-600 bg-gray-100 disabled:opacity-40"
          >
            上一题
          </TaroCompat.ButtonCompat>
          {currentQuestion < totalQ - 1 ? (
            <TaroCompat.ButtonCompat
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="flex-1 bg-[#2D5AF5] text-white py-2.5 rounded-xl text-sm font-medium"
            >
              下一题
            </TaroCompat.ButtonCompat>
          ) : (
            <TaroCompat.ButtonCompat
              onClick={handleSubmit}
              className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-medium"
            >
              交卷
            </TaroCompat.ButtonCompat>
          )}
        </TaroCompat.Div>
      </TaroCompat.Div>
    );
  }

  return (
    <TaroCompat.Div className="min-h-full bg-[#F4F6F8]">
      {/* Header */}
      <TaroCompat.Div className="sticky top-0 bg-white z-10 flex items-center px-4 py-3 border-b border-gray-100">
        <TaroCompat.ButtonCompat onClick={goBack} className="w-8 h-8 flex items-center justify-center -ml-2">
          <ArrowLeft size={20} className="text-gray-700" />
        </TaroCompat.ButtonCompat>
        <TaroCompat.H1 className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <TaroCompat.Span className="text-base font-semibold text-gray-800">考试中心</TaroCompat.Span>
        </TaroCompat.H1>
      </TaroCompat.Div>

      {/* Tabs */}
      <TaroCompat.Div className="bg-white px-4 pb-3 flex gap-0 border-b border-gray-100">
        {[
          { key: 'all' as const, label: '全部' },
          { key: 'not_started' as const, label: '未开始' },
          { key: 'in_progress' as const, label: '进行中' },
          { key: 'completed' as const, label: '已完成' },
        ].map(tab => (
          <TaroCompat.ButtonCompat
            key={tab.key}
            onClick={() => setExamTab(tab.key)}
            className={`flex-1 py-2 text-sm text-center transition-all relative ${
              examTab === tab.key ? 'text-[#2D5AF5] font-medium' : 'text-gray-500'
            }`}
          >
            {tab.label}
            {examTab === tab.key && <TaroCompat.Span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#2D5AF5] rounded-full" />}
          </TaroCompat.ButtonCompat>
        ))}
      </TaroCompat.Div>

      {/* Exam List */}
      <TaroCompat.Div className="p-4 space-y-3">
        {filteredExams.map(exam => (
          <TaroCompat.Div key={exam.id} className="bg-white rounded-xl p-4 shadow-sm">
            <TaroCompat.Div className="flex items-start gap-3">
              <TaroCompat.Div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                exam.type === 'quiz' ? 'bg-[#E8EFFD]' : 'bg-amber-50'
              }`}>
                <FileText size={18} className={exam.type === 'quiz' ? 'text-[#2D5AF5]' : 'text-amber-500'} />
              </TaroCompat.Div>
              <TaroCompat.Div className="flex-1 min-w-0">
                <TaroCompat.P className="text-sm font-medium text-gray-800">{exam.title}</TaroCompat.P>
                <TaroCompat.Div className="flex items-center gap-3 mt-1">
                  <TaroCompat.Span className="text-xs text-gray-500">{exam.totalQuestions}题</TaroCompat.Span>
                  <TaroCompat.Span className="text-xs text-gray-500">{exam.duration}分钟</TaroCompat.Span>
                  <TaroCompat.Span className="text-xs text-gray-500">{exam.source}</TaroCompat.Span>
                </TaroCompat.Div>
                {exam.status === 'completed' && exam.score !== null && (
                  <TaroCompat.Div className="flex items-center gap-2 mt-2">
                    <TaroCompat.Span className={`text-sm font-bold ${exam.isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                      {exam.score}分
                    </TaroCompat.Span>
                    <TaroCompat.Span className={`text-xs px-2 py-0.5 rounded-full ${
                      exam.isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {exam.isPassed ? '通过' : '未通过'}
                    </TaroCompat.Span>
                    <TaroCompat.Span className="text-xs text-gray-400">{exam.examDate}</TaroCompat.Span>
                  </TaroCompat.Div>
                )}
                {exam.status === 'in_progress' && (
                  <TaroCompat.Div className="flex items-center gap-2 mt-2">
                    <TaroCompat.Div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <TaroCompat.Div className="h-full bg-[#2D5AF5] rounded-full" style={{ width: `${(exam.answeredQuestions / exam.totalQuestions) * 100}%` }} />
                    </TaroCompat.Div>
                    <TaroCompat.Span className="text-xs text-gray-500">{exam.answeredQuestions}/{exam.totalQuestions}</TaroCompat.Span>
                  </TaroCompat.Div>
                )}
              </TaroCompat.Div>
              {exam.status !== 'completed' && (
                <TaroCompat.ButtonCompat
                  onClick={() => handleStartExam(exam.id)}
                  className="shrink-0 bg-[#2D5AF5] text-white text-xs px-4 py-2 rounded-full"
                >
                  {exam.status === 'in_progress' ? '继续' : '开始'}
                </TaroCompat.ButtonCompat>
              )}
            </TaroCompat.Div>
          </TaroCompat.Div>
        ))}

        {filteredExams.length === 0 && (
          <TaroCompat.Div className="text-center py-12">
            <TaroCompat.Img src="/images/empty_state.jpg" alt="empty" className="w-32 h-32 mx-auto mb-4 rounded-2xl object-cover opacity-60" />
            <TaroCompat.P className="text-sm text-gray-500">暂无考试</TaroCompat.P>
          </TaroCompat.Div>
        )}
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}
