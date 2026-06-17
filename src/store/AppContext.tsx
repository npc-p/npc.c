import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, Project, Member, Category, Expense } from '../types';

const STORAGE_KEY = 'team-expense-tracker-data';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function loadInitialState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.projects)) {
        return parsed as AppState;
      }
    }
  } catch {
    // corrupted data, start fresh
  }
  return { projects: [] };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload.projectId),
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, name: action.payload.name, description: action.payload.description }
            : p
        ),
      };

    case 'ADD_MEMBER':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, members: [...p.members, action.payload.member] }
            : p
        ),
      };

    case 'REMOVE_MEMBER':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, members: p.members.filter((m) => m.id !== action.payload.memberId) }
            : p
        ),
      };

    case 'ADD_CATEGORY':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, categories: [...p.categories, action.payload.category] }
            : p
        ),
      };

    case 'DELETE_CATEGORY':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, categories: p.categories.filter((c) => c.id !== action.payload.categoryId) }
            : p
        ),
      };

    case 'ADD_EXPENSE':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, expenses: [...p.expenses, action.payload.expense] }
            : p
        ),
      };

    case 'DELETE_EXPENSE':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.projectId
            ? { ...p, expenses: p.expenses.filter((e) => e.id !== action.payload.expenseId) }
            : p
        ),
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addProject: (name: string, description: string) => Project;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, name: string, description: string) => void;
  addMember: (projectId: string, name: string) => Member;
  removeMember: (projectId: string, memberId: string) => boolean;
  addCategory: (projectId: string, name: string) => Category;
  deleteCategory: (projectId: string, categoryId: string) => boolean;
  addExpense: (projectId: string, expense: Omit<Expense, 'id'>) => Expense;
  deleteExpense: (projectId: string, expenseId: string) => void;
  getProject: (projectId: string) => Project | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, null, loadInitialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function getProject(projectId: string): Project | undefined {
    return state.projects.find((p) => p.id === projectId);
  }

  function addProject(name: string, description: string): Project {
    const project: Project = {
      id: generateId(),
      name,
      description,
      members: [],
      categories: [],
      expenses: [],
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PROJECT', payload: project });
    return project;
  }

  function deleteProject(projectId: string) {
    dispatch({ type: 'DELETE_PROJECT', payload: { projectId } });
  }

  function updateProject(projectId: string, name: string, description: string) {
    dispatch({ type: 'UPDATE_PROJECT', payload: { projectId, name, description } });
  }

  function addMember(projectId: string, name: string): Member {
    const member: Member = { id: generateId(), name };
    dispatch({ type: 'ADD_MEMBER', payload: { projectId, member } });
    return member;
  }

  function removeMember(projectId: string, memberId: string): boolean {
    const project = getProject(projectId);
    if (!project) return false;

    // Check if member is referenced in any expense
    const isReferenced = project.expenses.some(
      (e) => e.paidBy === memberId || e.participantIds.includes(memberId)
    );
    if (isReferenced) return false;

    dispatch({ type: 'REMOVE_MEMBER', payload: { projectId, memberId } });
    return true;
  }

  function addCategory(projectId: string, name: string): Category {
    const category: Category = { id: generateId(), name };
    dispatch({ type: 'ADD_CATEGORY', payload: { projectId, category } });
    return category;
  }

  function deleteCategory(projectId: string, categoryId: string): boolean {
    const project = getProject(projectId);
    if (!project) return false;

    const isUsed = project.expenses.some((e) => e.categoryId === categoryId);
    if (isUsed) return false;

    dispatch({ type: 'DELETE_CATEGORY', payload: { projectId, categoryId } });
    return true;
  }

  function addExpense(projectId: string, data: Omit<Expense, 'id'>): Expense {
    const expense: Expense = { id: generateId(), ...data };
    dispatch({ type: 'ADD_EXPENSE', payload: { projectId, expense } });
    return expense;
  }

  function deleteExpense(projectId: string, expenseId: string) {
    dispatch({ type: 'DELETE_EXPENSE', payload: { projectId, expenseId } });
  }

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        addProject,
        deleteProject,
        updateProject,
        addMember,
        removeMember,
        addCategory,
        deleteCategory,
        addExpense,
        deleteExpense,
        getProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}
