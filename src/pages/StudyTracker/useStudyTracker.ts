import { useCallback, useState, useEffect } from 'react';
import { Subject, StudySession, MonthlyGoal, StudyData } from './types';

const STORAGE_KEY = 'study_tracker_data';

const defaultData: StudyData = {
  subjects: [
    { id: '1', name: 'Toán', color: '#1890ff', createdAt: Date.now() },
    { id: '2', name: 'Văn', color: '#52c41a', createdAt: Date.now() },
    { id: '3', name: 'Anh', color: '#faad14', createdAt: Date.now() },
    { id: '4', name: 'Khoa học', color: '#f5222d', createdAt: Date.now() },
  ],
  sessions: [],
  monthlyGoals: [],
};

export const useStudyTracker = () => {
  const [data, setData] = useState<StudyData>(defaultData);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load study data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addSubject = useCallback((name: string, color: string) => {
    const newSubject: Subject = {
      id: String(Date.now()),
      name,
      color,
      createdAt: Date.now(),
    };
    setData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
    return newSubject;
  }, []);

  const updateSubject = useCallback((id: string, name: string, color: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, name, color } : s)),
    }));
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
      sessions: prev.sessions.filter((s) => s.subjectId !== id),
      monthlyGoals: prev.monthlyGoals.filter((g) => g.subjectId !== id),
    }));
  }, []);

  const addSession = useCallback(
    (subjectId: string, date: string, startTime: string, endTime: string, content: string, notes: string) => {
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);
      const duration = endMinutes >= startMinutes ? endMinutes - startMinutes : (24 * 60 - startMinutes) + endMinutes;

      const newSession: StudySession = {
        id: String(Date.now()),
        subjectId,
        date,
        startTime,
        endTime,
        duration,
        content,
        notes,
        createdAt: Date.now(),
      };
      setData((prev) => ({
        ...prev,
        sessions: [...prev.sessions, newSession],
      }));
      return newSession;
    },
    []
  );

  const updateSession = useCallback(
    (id: string, subjectId: string, date: string, startTime: string, endTime: string, content: string, notes: string) => {
      const startMinutes = timeToMinutes(startTime);
      const endMinutes = timeToMinutes(endTime);
      const duration = endMinutes >= startMinutes ? endMinutes - startMinutes : (24 * 60 - startMinutes) + endMinutes;

      setData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === id ? { ...s, subjectId, date, startTime, endTime, duration, content, notes } : s
        ),
      }));
    },
    []
  );

  const deleteSession = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== id),
    }));
  }, []);

  const setMonthlyGoal = useCallback((subjectId: string | undefined, month: string, targetHours: number) => {
    setData((prev) => {
      const existingGoalIndex = prev.monthlyGoals.findIndex(
        (g) => g.month === month && g.subjectId === subjectId
      );

      if (existingGoalIndex >= 0) {
        const updatedGoals = [...prev.monthlyGoals];
        updatedGoals[existingGoalIndex] = { ...updatedGoals[existingGoalIndex], targetHours };
        return { ...prev, monthlyGoals: updatedGoals };
      } else {
        return {
          ...prev,
          monthlyGoals: [
            ...prev.monthlyGoals,
            {
              id: String(Date.now()),
              subjectId,
              month,
              targetHours,
              createdAt: Date.now(),
            },
          ],
        };
      }
    });
  }, []);

  const deleteMonthlyGoal = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      monthlyGoals: prev.monthlyGoals.filter((g) => g.id !== id),
    }));
  }, []);

  return {
    data,
    addSubject,
    updateSubject,
    deleteSubject,
    addSession,
    updateSession,
    deleteSession,
    setMonthlyGoal,
    deleteMonthlyGoal,
  };
};

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
