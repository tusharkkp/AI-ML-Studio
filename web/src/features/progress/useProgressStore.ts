import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ConceptProgress {
  conceptId: string;
  read: boolean;
  labCompleted: boolean;
  quizScore: number | null; // percentage or null if not taken
  quizPassed: boolean;
  lastVisited: string;
}

export interface ProgressState {
  concepts: Record<string, ConceptProgress>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  markRead: (conceptId: string) => void;
  markLabCompleted: (conceptId: string) => void;
  recordQuizScore: (conceptId: string, score: number, passingThreshold?: number) => void;
  getConceptProgress: (conceptId: string) => ConceptProgress | undefined;
  exportProgressJSON: () => string;
  importProgressJSON: (jsonStr: string) => boolean;
  resetProgress: () => void;
}

const STORAGE_KEY = 'aiml_studio_progress_v1';

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      concepts: {},
      theme: 'light',

      toggleTheme: () => {
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark');
          }
          return { theme: next };
        });
      },

      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
        set({ theme });
      },

      markRead: (conceptId: string) => {
        set((state) => {
          const prev = state.concepts[conceptId] ?? {
            conceptId,
            read: false,
            labCompleted: false,
            quizScore: null,
            quizPassed: false,
            lastVisited: new Date().toISOString(),
          };
          return {
            concepts: {
              ...state.concepts,
              [conceptId]: {
                ...prev,
                read: true,
                lastVisited: new Date().toISOString(),
              },
            },
          };
        });
      },

      markLabCompleted: (conceptId: string) => {
        set((state) => {
          const prev = state.concepts[conceptId] ?? {
            conceptId,
            read: false,
            labCompleted: false,
            quizScore: null,
            quizPassed: false,
            lastVisited: new Date().toISOString(),
          };
          return {
            concepts: {
              ...state.concepts,
              [conceptId]: {
                ...prev,
                labCompleted: true,
                lastVisited: new Date().toISOString(),
              },
            },
          };
        });
      },

      recordQuizScore: (conceptId: string, score: number, passingThreshold = 75) => {
        set((state) => {
          const prev = state.concepts[conceptId] ?? {
            conceptId,
            read: false,
            labCompleted: false,
            quizScore: null,
            quizPassed: false,
            lastVisited: new Date().toISOString(),
          };
          const passed = score >= passingThreshold;
          return {
            concepts: {
              ...state.concepts,
              [conceptId]: {
                ...prev,
                quizScore: Math.max(prev.quizScore ?? 0, score),
                quizPassed: prev.quizPassed || passed,
                lastVisited: new Date().toISOString(),
              },
            },
          };
        });
      },

      getConceptProgress: (conceptId: string) => {
        return get().concepts[conceptId];
      },

      exportProgressJSON: () => {
        return JSON.stringify(
          {
            version: 1,
            exportedAt: new Date().toISOString(),
            concepts: get().concepts,
          },
          null,
          2
        );
      },

      importProgressJSON: (jsonStr: string) => {
        try {
          const parsed = JSON.parse(jsonStr) as { concepts?: Record<string, ConceptProgress> };
          if (parsed && typeof parsed.concepts === 'object') {
            set({ concepts: parsed.concepts });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      resetProgress: () => {
        set({ concepts: {} });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Safe fallback on corrupted storage
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Progress store corrupted, falling back to clean state.');
        } else if (state && typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);
