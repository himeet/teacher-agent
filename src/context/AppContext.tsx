import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, ChatMessage, CreditTransaction, Course } from '@/data/mockData';
import { mockUser, initialChatMessages, creditTransactions as initialTransactions, courses as initialCourses, abilityScores } from '@/data/mockData';
import * as TaroCompat from '@/components/TaroCompat';
import { streamCozeChatAnswer } from '@/services/cozeChat';

export type FrontTab = 'home' | 'chat' | 'learn' | 'me';
export type FrontPage = FrontTab | 'generateCourse' | 'examCenter' | 'examDetail' | 'credits' | 'instructors' | 'drill' | 'courseDetail';
export type AdminPage = 'dashboard' | 'members' | 'plans' | 'courses' | 'instructors' | 'analytics' | 'settings';
export type AppMode = 'front' | 'admin';

interface AppState {
  mode: AppMode;
  user: User;
  activeTab: FrontTab;
  currentPage: FrontPage | AdminPage;
  prevPage: FrontPage | AdminPage | null;
  chatMessages: ChatMessage[];
  creditTransactions: CreditTransaction[];
  courses: Course[];
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  isAiTyping: boolean;
  selectedExamId: string | null;
  selectedCourseId: string | null;
  abilityScores: typeof abilityScores;
}

interface AppContextType extends AppState {
  navigate: (page: FrontPage | AdminPage) => void;
  goBack: () => void;
  setMode: (mode: AppMode) => void;
  setActiveTab: (tab: FrontTab) => void;
  sendChatMessage: (content: string) => Promise<void>;
  addCreditTransaction: (tx: CreditTransaction) => void;
  updateUser: (updates: Partial<User>) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  setIsAiTyping: (v: boolean) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  setSelectedExamId: (id: string | null) => void;
  setSelectedCourseId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Detect initial mode from URL
const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const isAdminMode = urlParams?.get('mode') === 'admin';
const initialMode: AppMode = isAdminMode ? 'admin' : 'front';
const initialPage: FrontPage | AdminPage = isAdminMode ? 'dashboard' : 'home';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(initialMode);
  const [user, setUser] = useState<User>(mockUser);
  const [activeTab, setActiveTab] = useState<FrontTab>('home');
  const [currentPage, setCurrentPage] = useState<FrontPage | AdminPage>(initialPage);
  const [prevPage, setPrevPage] = useState<FrontPage | AdminPage | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(initialTransactions);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigate = useCallback((page: FrontPage | AdminPage) => {
    setPrevPage(currentPage);
    setCurrentPage(page);
    if (mode === 'front') {
      const tabPages: FrontPage[] = ['home', 'chat', 'learn', 'me'];
      if (tabPages.includes(page as FrontPage)) {
        setActiveTab(page as FrontTab);
      }
    }
    window.scrollTo(0, 0);
  }, [currentPage, mode]);

  const goBack = useCallback(() => {
    if (prevPage) {
      setCurrentPage(prevPage);
      setPrevPage(null);
    } else {
      setCurrentPage(mode === 'front' ? activeTab : 'dashboard');
    }
    window.scrollTo(0, 0);
  }, [prevPage, activeTab, mode]);

  const setMode = useCallback((m: AppMode) => {
    setModeState(m);
    setCurrentPage(m === 'front' ? 'home' : 'dashboard');
    setPrevPage(null);
    window.scrollTo(0, 0);
  }, []);

  const sendChatMessage = useCallback(async (content: string) => {
    const timestamp = new Date().toLocaleString('zh-CN');
    const userMessageId = `msg_${Date.now()}`;
    const aiMessageId = `msg_${Date.now() + 1}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp,
    };
    const aiMsg: ChatMessage = {
      id: aiMessageId,
      role: 'ai',
      content: '',
      timestamp,
      metadata: { source: '沈羽婷 AI 分身' },
    };

    setChatMessages(prev => [...prev, userMsg, aiMsg]);
    setIsAiTyping(true);

    let answer = '';
    let renderedAnswer = '';
    let pendingAnswer = '';
    let renderHandle: number | null = null;
    const streamRenderIntervalMs = 48;

    const renderAnswer = (nextAnswer: string) => {
      if (nextAnswer === renderedAnswer) return;
      renderedAnswer = nextAnswer;
      setChatMessages(prev => prev.map(msg => (
        msg.id === aiMessageId ? { ...msg, content: nextAnswer } : msg
      )));
    };

    const flushPendingAnswer = () => {
      renderHandle = null;
      renderAnswer(pendingAnswer);
    };

    const scheduleAnswerRender = () => {
      if (renderHandle !== null) return;

      if (typeof window !== 'undefined') {
        renderHandle = window.setTimeout(flushPendingAnswer, streamRenderIntervalMs);
        return;
      }

      renderHandle = setTimeout(flushPendingAnswer, streamRenderIntervalMs) as unknown as number;
    };

    const cancelScheduledRender = () => {
      if (renderHandle === null) return;

      if (typeof window !== 'undefined') {
        window.clearTimeout(renderHandle);
      } else {
        clearTimeout(renderHandle as unknown as ReturnType<typeof setTimeout>);
      }

      renderHandle = null;
    };

    try {
      await streamCozeChatAnswer(content, {
        onDelta: (delta) => {
          answer += delta;
          pendingAnswer = answer;
          scheduleAnswerRender();
        },
      });

      cancelScheduledRender();
      renderAnswer(answer);

      if (!answer.trim()) {
        setChatMessages(prev => prev.map(msg => (
          msg.id === aiMessageId
            ? { ...msg, content: '我暂时没有收到有效回复，请稍后再试。' }
            : msg
        )));
      }
    } catch (error) {
      cancelScheduledRender();
      const message = error instanceof Error ? error.message : 'AI 服务请求失败，请稍后再试。';
      setChatMessages(prev => prev.map(msg => (
        msg.id === aiMessageId
          ? { ...msg, content: message }
          : msg
      )));
      showToast(message, 'error');
    } finally {
      setIsAiTyping(false);
    }
  }, [showToast]);

  const addCreditTransaction = useCallback((tx: CreditTransaction) => {
    setCreditTransactions(prev => [tx, ...prev]);
    setUser(prev => ({
      ...prev,
      creditBalance: tx.balance,
    }));
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  const updateCourseProgress = useCallback((courseId: string, progress: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const completedLessons = Math.round((progress / 100) * c.totalLessons);
        return {
          ...c,
          progress,
          completedLessons,
          status: progress === 100 ? 'completed' as const : 'in_progress' as const,
        };
      }
      return c;
    }));
  }, []);

  const value: AppContextType = {
    mode,
    user,
    activeTab,
    currentPage,
    prevPage,
    chatMessages,
    creditTransactions,
    courses,
    toast,
    isAiTyping,
    selectedExamId,
    selectedCourseId,
    abilityScores,
    navigate,
    goBack,
    setMode,
    setActiveTab,
    sendChatMessage,
    addCreditTransaction,
    updateUser,
    showToast,
    setIsAiTyping,
    updateCourseProgress,
    setSelectedExamId,
    setSelectedCourseId,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && (
        <TaroCompat.Div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl text-sm font-medium shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-[#2D5AF5] text-white'
        }`}>
          {toast.message}
        </TaroCompat.Div>
      )}
    </AppContext.Provider>
  );
}
