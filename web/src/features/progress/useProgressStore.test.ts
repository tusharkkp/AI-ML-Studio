import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from './useProgressStore';

describe('useProgressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it('marks concept as read', () => {
    useProgressStore.getState().markRead('u2-bfs');
    const p = useProgressStore.getState().getConceptProgress('u2-bfs');
    expect(p?.read).toBe(true);
    expect(p?.labCompleted).toBe(false);
  });

  it('records lab completion and quiz scores', () => {
    useProgressStore.getState().markLabCompleted('u2-bfs');
    useProgressStore.getState().recordQuizScore('u2-bfs', 100);

    const p = useProgressStore.getState().getConceptProgress('u2-bfs');
    expect(p?.labCompleted).toBe(true);
    expect(p?.quizScore).toBe(100);
    expect(p?.quizPassed).toBe(true);
  });

  it('handles corrupted JSON import gracefully', () => {
    const success = useProgressStore.getState().importProgressJSON('invalid json {{{');
    expect(success).toBe(false);
  });

  it('exports and imports valid JSON correctly', () => {
    useProgressStore.getState().markRead('u1-agents');
    const exported = useProgressStore.getState().exportProgressJSON();

    useProgressStore.getState().resetProgress();
    expect(useProgressStore.getState().getConceptProgress('u1-agents')).toBeUndefined();

    const success = useProgressStore.getState().importProgressJSON(exported);
    expect(success).toBe(true);
    expect(useProgressStore.getState().getConceptProgress('u1-agents')?.read).toBe(true);
  });

  it('toggles teacher presentation mode', () => {
    expect(useProgressStore.getState().teacherMode).toBe(false);
    useProgressStore.getState().toggleTeacherMode();
    expect(useProgressStore.getState().teacherMode).toBe(true);
    useProgressStore.getState().toggleTeacherMode();
    expect(useProgressStore.getState().teacherMode).toBe(false);
  });
});
