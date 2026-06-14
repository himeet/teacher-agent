// User types
export type UserRole = 'personal' | 'enterprise_member' | 'enterprise_admin';
export type MembershipType = 'none' | 'monthly' | 'yearly' | 'enterprise';

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role: UserRole;
  membership: MembershipType;
  creditBalance: number;
  enterpriseCredits?: number;
  monthlyLimit?: number;
  membershipExpiry?: string;
  enterpriseName?: string;
  avgScore: number;
  studyHours: number;
  consultCount: number;
  abilityGrowth: number;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  description: string;
  price: number;
  isPurchased: boolean;
  isEnterprise: boolean;
  specialty: string;
  courses: number;
  students: number;
}

export interface Course {
  id: string;
  title: string;
  cover: string;
  instructorId: string;
  instructorName: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  type: 'generated' | 'purchased' | 'enterprise';
  totalLessons: number;
  completedLessons: number;
  dueDate?: string;
  planName?: string;
}

export interface Exam {
  id: string;
  title: string;
  score: number | null;
  totalQuestions: number;
  answeredQuestions: number;
  duration: number;
  isPassed: boolean | null;
  examDate: string;
  status: 'not_started' | 'in_progress' | 'completed';
  source: string;
  type: 'quiz' | 'scenario';
}

export interface CreditTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  source: string;
  createdAt: string;
  balance: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  metadata?: { source?: string };
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetCount: number;
  completedCount: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
}

export interface LearningRecord {
  id: string;
  date: string;
  type: 'consult' | 'course' | 'drill' | 'exam';
  content: string;
  creditsUsed: number;
  duration: number;
}

export interface AbilityScore {
  dimension: string;
  score: number;
  fullMark: number;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  department: string;
  jobTitle: string;
  monthlyLimit: number;
  monthlyUsed: number;
  studyHours: number;
  lastLogin: string;
  status: 'active' | 'frozen' | 'inactive';
  roleInEnterprise: 'member' | 'sub_admin';
}

// Mock Users
export const mockUser: User = {
  id: 'u1',
  name: '张小明',
  phone: '138****5678',
  avatar: '/images/user_avatar.jpg',
  role: 'enterprise_member',
  membership: 'enterprise',
  creditBalance: 2860,
  enterpriseCredits: 2860,
  monthlyLimit: 500,
  membershipExpiry: '2026-12-31',
  enterpriseName: '美齿口腔连锁',
  avgScore: 82,
  studyHours: 48,
  consultCount: 156,
  abilityGrowth: 23,
};

export const mockAdminUser: User = {
  ...mockUser,
  role: 'enterprise_admin',
  name: '李管理者',
  avatar: '/images/admin_avatar.jpg',
};

// Instructors
export const instructors: Instructor[] = [
  {
    id: 'i1',
    name: '沈羽婷',
    avatar: '/images/instructor_shen.jpg',
    title: '口腔咨询成交专家',
    description: '10年口腔门诊咨询经验，擅长隐形矫正和种植项目的成交转化，著有《成交策略》系列课程。',
    price: 0,
    isPurchased: true,
    isEnterprise: false,
    specialty: '成交策略',
    courses: 12,
    students: 3280,
  },
  {
    id: 'i2',
    name: '王建国',
    avatar: '/images/instructor_male.jpg',
    title: '种植修复技术总监',
    description: '20年口腔临床经验，专注种植修复领域，曾任三甲医院口腔科主任。',
    price: 1288,
    isPurchased: false,
    isEnterprise: false,
    specialty: '种植修复',
    courses: 8,
    students: 1560,
  },
  {
    id: 'i3',
    name: '林美琪',
    avatar: '/images/instructor_female2.jpg',
    title: '正畸咨询顾问',
    description: '8年正畸咨询与患者管理经验，擅长青少年矫正方案解读与家长沟通。',
    price: 0,
    isPurchased: true,
    isEnterprise: false,
    specialty: '正畸咨询',
    courses: 6,
    students: 2140,
  },
];

// Courses
export const courses: Course[] = [
  {
    id: 'c1',
    title: '隐形矫正初诊沟通全流程',
    cover: '/images/course_cover2.jpg',
    instructorId: 'i1',
    instructorName: '沈羽婷',
    progress: 75,
    status: 'in_progress',
    type: 'generated',
    totalLessons: 8,
    completedLessons: 6,
  },
  {
    id: 'c2',
    title: '种植牙患者疑虑化解技巧',
    cover: '/images/course_cover4.jpg',
    instructorId: 'i2',
    instructorName: '王建国',
    progress: 30,
    status: 'in_progress',
    type: 'purchased',
    totalLessons: 10,
    completedLessons: 3,
  },
  {
    id: 'c3',
    title: '青少年矫正家长沟通策略',
    cover: '/images/course_cover3.jpg',
    instructorId: 'i3',
    instructorName: '林美琪',
    progress: 100,
    status: 'completed',
    type: 'enterprise',
    totalLessons: 6,
    completedLessons: 6,
    dueDate: '2026-06-20',
    planName: '6月正畸专项培训',
  },
  {
    id: 'c4',
    title: '口腔基础知识体系',
    cover: '/images/course_cover1.jpg',
    instructorId: 'i1',
    instructorName: '沈羽婷',
    progress: 0,
    status: 'not_started',
    type: 'purchased',
    totalLessons: 12,
    completedLessons: 0,
  },
];

// Exams
export const exams: Exam[] = [
  {
    id: 'e1',
    title: '隐形矫正初诊沟通测试',
    score: 88,
    totalQuestions: 20,
    answeredQuestions: 20,
    duration: 30,
    isPassed: true,
    examDate: '2026-06-08',
    status: 'completed',
    source: '生成课程配套',
    type: 'quiz',
  },
  {
    id: 'e2',
    title: '种植患者异议处理考核',
    score: null,
    totalQuestions: 15,
    answeredQuestions: 0,
    duration: 25,
    isPassed: null,
    examDate: '',
    status: 'not_started',
    source: '培训计划下发',
    type: 'quiz',
  },
  {
    id: 'e3',
    title: '6月综合能力测评',
    score: null,
    totalQuestions: 50,
    answeredQuestions: 32,
    duration: 60,
    isPassed: null,
    examDate: '',
    status: 'in_progress',
    source: '企业培训计划',
    type: 'quiz',
  },
  {
    id: 'e4',
    title: '矫正方案报价情景模拟',
    score: 76,
    totalQuestions: 5,
    answeredQuestions: 5,
    duration: 15,
    isPassed: true,
    examDate: '2026-06-05',
    status: 'completed',
    source: '情景对练评估',
    type: 'scenario',
  },
];

// Credit Transactions
export const creditTransactions: CreditTransaction[] = [
  { id: 't1', type: 'income', amount: 5000, source: '企业积分分配', createdAt: '2026-06-01 09:00', balance: 5000 },
  { id: 't2', type: 'expense', amount: -100, source: 'AI答疑 - 隐形矫正咨询', createdAt: '2026-06-02 14:30', balance: 4900 },
  { id: 't3', type: 'expense', amount: -100, source: '生成课程 - 种植沟通技巧', createdAt: '2026-06-03 10:15', balance: 4800 },
  { id: 't4', type: 'expense', amount: -100, source: '情景对练 - 初诊接待', createdAt: '2026-06-04 16:00', balance: 4700 },
  { id: 't5', type: 'expense', amount: -100, source: 'AI答疑 - 价格异议处理', createdAt: '2026-06-05 11:20', balance: 4600 },
  { id: 't6', type: 'expense', amount: -100, source: '生成课程 - 复诊跟进策略', createdAt: '2026-06-06 09:45', balance: 4500 },
  { id: 't7', type: 'income', amount: 2000, source: '企业积分追加分配', createdAt: '2026-06-10 08:00', balance: 6500 },
  { id: 't8', type: 'expense', amount: -100, source: '情景对练 - 方案解读', createdAt: '2026-06-10 15:30', balance: 6400 },
  { id: 't9', type: 'expense', amount: -100, source: 'AI答疑 - 种植疑虑解答', createdAt: '2026-06-11 10:00', balance: 6300 },
  { id: 't10', type: 'expense', amount: -100, source: '考试 - 综合能力测评', createdAt: '2026-06-11 14:00', balance: 6200 },
];

// Training Plans
export const trainingPlans: TrainingPlan[] = [
  {
    id: 'p1',
    name: '6月正畸专项培训',
    description: '针对正畸季的患者咨询高峰，强化全体咨询师的正畸项目沟通能力',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    targetCount: 24,
    completedCount: 18,
    status: 'in_progress',
    progress: 75,
  },
  {
    id: 'p2',
    name: '新员工入职培训-第3期',
    description: '新入职咨询师的基础能力培训，包含口腔基础知识与沟通技巧',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    targetCount: 6,
    completedCount: 0,
    status: 'not_started',
    progress: 0,
  },
];

// Learning Records
export const learningRecords: LearningRecord[] = [
  { id: 'r1', date: '2026-06-11', type: 'exam', content: '综合能力测评（50题）', creditsUsed: 100, duration: 45 },
  { id: 'r2', date: '2026-06-11', type: 'consult', content: '向AI咨询种植疑虑化解', creditsUsed: 100, duration: 15 },
  { id: 'r3', date: '2026-06-10', type: 'drill', content: '情景对练 - 方案解读场景', creditsUsed: 100, duration: 20 },
  { id: 'r4', date: '2026-06-08', type: 'exam', content: '隐形矫正初诊沟通测试', creditsUsed: 0, duration: 25 },
  { id: 'r5', date: '2026-06-06', type: 'course', content: '生成课程 - 复诊跟进策略', creditsUsed: 100, duration: 30 },
  { id: 'r6', date: '2026-06-05', type: 'consult', content: 'AI答疑 - 价格异议处理', creditsUsed: 100, duration: 12 },
  { id: 'r7', date: '2026-06-04', type: 'drill', content: '情景对练 - 初诊接待场景', creditsUsed: 100, duration: 18 },
  { id: 'r8', date: '2026-06-03', type: 'course', content: '生成课程 - 种植沟通技巧', creditsUsed: 100, duration: 35 },
  { id: 'r9', date: '2026-06-02', type: 'consult', content: 'AI答疑 - 隐形矫正咨询', creditsUsed: 100, duration: 20 },
  { id: 'r10', date: '2026-06-01', type: 'exam', content: '矫正方案报价情景模拟', creditsUsed: 100, duration: 15 },
];

// Ability Scores
export const abilityScores: AbilityScore[] = [
  { dimension: '专业知识', score: 82, fullMark: 100 },
  { dimension: '沟通技巧', score: 76, fullMark: 100 },
  { dimension: '成交能力', score: 68, fullMark: 100 },
  { dimension: '产品熟悉度', score: 85, fullMark: 100 },
  { dimension: '异议处理', score: 71, fullMark: 100 },
];

// Chat History
export const initialChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'ai',
    content: '您好！我是沈羽婷的AI分身，基于《成交策略》课程训练而成。我可以帮您解答口腔咨询中的各种问题，包括患者沟通、异议处理、成交技巧等。请问有什么可以帮您？',
    timestamp: '2026-06-11 09:00',
  },
  {
    id: 'm2',
    role: 'user',
    content: '患者说隐形矫正太贵了，怎么回复比较好？',
    timestamp: '2026-06-11 09:05',
  },
  {
    id: 'm3',
    role: 'ai',
    content: '遇到价格异议时，千万不要直接反驳或者说"不贵"。我建议采用"先认同、再转化"的策略：\n\n1. **认同感受**："我理解您的考虑，矫正确实是一笔不小的投入。"\n2. **价值重塑**："不过您想一下，这一口整齐的牙齿会陪伴您几十年，平均每天才几块钱..."\n3. **对比引导**："您之前了解过的矫正方案报价大概是多少呢？"\n\n关键是通过提问了解患者的真实预算和顾虑点，而不是硬推。您觉得这个思路怎么样？',
    timestamp: '2026-06-11 09:06',
    metadata: { source: '《成交策略》第3课 需求挖掘' },
  },
  {
    id: 'm4',
    role: 'user',
    content: '如果患者说"我再考虑考虑"怎么办？',
    timestamp: '2026-06-11 09:10',
  },
  {
    id: 'm5',
    role: 'ai',
    content: '"我再考虑考虑"通常是最常见的假性拒绝，背后可能有三种真实原因：\n\n1. **还有未解决的疑虑**（最常见）\n2. **需要和其他人商量**\n3. **真的超出预算**\n\n应对策略：\n\n"当然可以，这是大事确实要考虑清楚。为了帮您更好地做决策，我想确认一下——您主要考虑的是哪方面呢？是方案本身、费用问题，还是时间安排？"\n\n通过这个问题，您可以锁定真正的异议点，然后针对性解决。记住：没有锁定的异议，就没有成交。',
    timestamp: '2026-06-11 09:11',
    metadata: { source: '《成交策略》第5课 异议处理' },
  },
];

// Admin Members
export const adminMembers: Member[] = [
  { id: 'mem1', name: '张小明', phone: '138****5678', department: '前台咨询', jobTitle: '高级咨询师', monthlyLimit: 500, monthlyUsed: 340, studyHours: 48, lastLogin: '2026-06-11 14:30', status: 'active', roleInEnterprise: 'member' },
  { id: 'mem2', name: '王丽丽', phone: '139****2345', department: '前台咨询', jobTitle: '咨询师', monthlyLimit: 500, monthlyUsed: 280, studyHours: 36, lastLogin: '2026-06-11 12:00', status: 'active', roleInEnterprise: 'member' },
  { id: 'mem3', name: '陈大伟', phone: '137****8901', department: '种植科', jobTitle: '种植顾问', monthlyLimit: 500, monthlyUsed: 420, studyHours: 52, lastLogin: '2026-06-10 18:00', status: 'active', roleInEnterprise: 'member' },
  { id: 'mem4', name: '刘小红', phone: '136****4567', department: '正畸科', jobTitle: '正畸顾问', monthlyLimit: 500, monthlyUsed: 150, studyHours: 20, lastLogin: '2026-06-09 09:30', status: 'active', roleInEnterprise: 'member' },
  { id: 'mem5', name: '赵小芳', phone: '135****7890', department: '客服部', jobTitle: '客服专员', monthlyLimit: 300, monthlyUsed: 80, studyHours: 12, lastLogin: '2026-06-08 16:00', status: 'frozen', roleInEnterprise: 'member' },
  { id: 'mem6', name: '孙志强', phone: '134****1234', department: '种植科', jobTitle: '见习顾问', monthlyLimit: 500, monthlyUsed: 0, studyHours: 0, lastLogin: '', status: 'inactive', roleInEnterprise: 'member' },
];

// Quick questions for AI chat
export const quickQuestions = [
  '患者说太贵了怎么回复？',
  '如何挖掘患者真实需求？',
  '初诊接待的标准流程？',
  '种植患者常见疑虑？',
  '老客激活的沟通话术？',
];

// Exam questions
export const examQuestions = [
  {
    id: 'q1',
    question: '当患者说"我再考虑考虑"时，以下哪种应对方式最有效？',
    type: 'single' as const,
    options: ['直接给折扣促成成交', '询问具体顾虑点并针对性解答', '告诉患者优惠今天截止', '让患者自己决定，不再跟进'],
    correct: 1,
    explanation: '"我再考虑考虑"通常是假性拒绝，应通过提问锁定真实异议点，然后针对性解决。',
  },
  {
    id: 'q2',
    question: '隐形矫正初诊沟通中，以下哪些环节是必需的？（多选）',
    type: 'multiple' as const,
    options: ['了解患者矫正动机', '口腔检查与数据采集', '展示类似案例效果图', '直接报价并促单'],
    correct: [0, 1, 2],
    explanation: '初诊应先建立信任、了解需求、展示专业性，不宜过早直接报价促单。',
  },
  {
    id: 'q3',
    question: '患者说"我朋友在其他地方做的才一半价格"，以下回复最恰当的是：',
    type: 'single' as const,
    options: ['我们的技术更好', '那您去那边做吧', '价格低可能是因为...（解释差异）', '我们也有优惠方案'],
    correct: 2,
    explanation: '应客观解释价格差异的原因（材料、医生资历、后续服务等），避免贬低竞争对手或直接降价。',
  },
  {
    id: 'q4',
    question: '在种植咨询中，患者最关注的三个核心问题通常是：（多选）',
    type: 'multiple' as const,
    options: ['种植体的品牌和来源', '医生的经验和技术', '价格和付款方式', '诊所的装修风格'],
    correct: [0, 1, 2],
    explanation: '种植患者主要关注种植体质量、医生技术水平和费用，装修风格不是核心决策因素。',
  },
  {
    id: 'q5',
    question: '以下哪种说法最能体现"价值重塑"的沟通技巧？',
    type: 'single' as const,
    options: ['这个价格很便宜了', '矫正的费用分摊到每天只有几块钱', '我们现在有活动', '您可以分期付款'],
    explanation: '价值重塑是将总价拆解为更小的时间单位，让患者感受到性价比。',
    correct: 1,
  },
];
