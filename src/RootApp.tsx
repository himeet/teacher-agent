import { useApp } from '@/context/AppContext';
import { AppProvider } from '@/context/AppContext';
import BottomTab from '@/components/BottomTab';
import AdminSidebar from '@/components/AdminSidebar';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import LearningPage from '@/pages/LearningPage';
import ProfilePage from '@/pages/ProfilePage';
import GenerateCoursePage from '@/pages/GenerateCoursePage';
import ExamPage from '@/pages/ExamPage';
import DrillPage from '@/pages/DrillPage';
import CreditsPage from '@/pages/CreditsPage';
import InstructorsPage from '@/pages/InstructorsPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMembers from '@/pages/admin/AdminMembers';
import AdminPlans from '@/pages/admin/AdminPlans';
import AdminCourses from '@/pages/admin/AdminCourses';
import AdminInstructors from '@/pages/admin/AdminInstructors';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminSettings from '@/pages/admin/AdminSettings';
import * as TaroCompat from '@/components/TaroCompat';
import { isWeapp } from '@/lib/platform';

function FrontApp() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'chat': return <ChatPage />;
      case 'learn': return <LearningPage />;
      case 'me': return <ProfilePage />;
      case 'generateCourse': return <GenerateCoursePage />;
      case 'examCenter': return <ExamPage />;
      case 'drill': return <DrillPage />;
      case 'credits': return <CreditsPage />;
      case 'instructors': return <InstructorsPage />;
      default: return <HomePage />;
    }
  };

  const isTabPage = ['home', 'chat', 'learn', 'me'].includes(currentPage as string);
  const shellClassName = isWeapp
    ? 'weapp-text-scale h-screen w-full bg-[#F4F6F8] flex flex-col overflow-hidden'
    : 'h-screen w-full bg-neutral-200 flex justify-center items-center p-0 md:p-4';
  const appFrameClassName = isWeapp
    ? 'w-full h-screen bg-[#F4F6F8] overflow-hidden relative isolate flex flex-col'
    : 'w-full max-w-[430px] h-[100dvh] md:h-[850px] bg-[#F4F6F8] rounded-none overflow-hidden shadow-2xl relative isolate flex flex-col';

  return (
    <TaroCompat.Div className={shellClassName}>
      <TaroCompat.Div className={appFrameClassName}>
        <TaroCompat.Main className="flex-1 overflow-y-auto scrollbar-hide">
          {renderPage()}
        </TaroCompat.Main>
        {isTabPage && <BottomTab />}
      </TaroCompat.Div>
    </TaroCompat.Div>
  );
}

function AdminApp() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <AdminDashboard />;
      case 'members': return <AdminMembers />;
      case 'plans': return <AdminPlans />;
      case 'courses': return <AdminCourses />;
      case 'instructors': return <AdminInstructors />;
      case 'analytics': return <AdminAnalytics />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <TaroCompat.Div className={`${isWeapp ? 'weapp-text-scale ' : ''}min-h-screen bg-[#F4F6F8] flex`}>
      <AdminSidebar />
      <TaroCompat.Main className="flex-1 overflow-y-auto">
        {renderPage()}
      </TaroCompat.Main>
    </TaroCompat.Div>
  );
}

function AppContent() {
  const { mode } = useApp();
  return mode === 'front' ? <FrontApp /> : <AdminApp />;
}

export default function RootApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
