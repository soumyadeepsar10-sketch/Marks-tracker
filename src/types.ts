export interface Paper {
  id: string;
  name: string;
  totalMarks: number;
  obtainedMarks: number | null;
}

export interface Test {
  id: string;
  name: string;
  date: string;
  papers: Paper[];
}

export type ViewMode = 'marks' | 'percentage';
export type Theme = 'light' | 'dark';
