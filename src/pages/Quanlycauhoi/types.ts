export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

export interface KnowledgeBlock {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  subjectId: string;
  kbId: string;
  content: string;
  difficulty: Difficulty;
}

export interface ExamStructureDetail {
  kbId: string;
  difficulty: Difficulty;
  quantity: number;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  questions: Question[];
  createdAt: string;
}