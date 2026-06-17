export interface Member {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  paidBy: string; // memberId
  participantIds: string[]; // memberIds of those who shared this expense
  date: string; // ISO date string
}

export interface Project {
  id: string;
  name: string;
  description: string;
  members: Member[];
  categories: Category[];
  expenses: Expense[];
  createdAt: string; // ISO date string
}

export interface AppState {
  projects: Project[];
}

// Action types for the reducer
export type AppAction =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: { projectId: string } }
  | { type: 'UPDATE_PROJECT'; payload: { projectId: string; name: string; description: string } }
  | { type: 'ADD_MEMBER'; payload: { projectId: string; member: Member } }
  | { type: 'REMOVE_MEMBER'; payload: { projectId: string; memberId: string } }
  | { type: 'ADD_CATEGORY'; payload: { projectId: string; category: Category } }
  | { type: 'DELETE_CATEGORY'; payload: { projectId: string; categoryId: string } }
  | { type: 'ADD_EXPENSE'; payload: { projectId: string; expense: Expense } }
  | { type: 'DELETE_EXPENSE'; payload: { projectId: string; expenseId: string } }
  | { type: 'LOAD_STATE'; payload: AppState };

// Statistics types
export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
}

export interface MemberStat {
  memberId: string;
  memberName: string;
  totalPaid: number;       // total amount this person paid
  totalParticipated: number; // total amount this person owes (their share)
  balance: number;          // positive = owes money, negative = is owed money
  expenseCount: number;
}

export interface ProjectStatistics {
  totalExpenses: number;
  categoryStats: CategoryStat[];
  memberStats: MemberStat[];
  averagePerPerson: number;
}
