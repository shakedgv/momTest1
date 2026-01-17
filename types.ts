
export interface Story {
  id: number;
  title: string;
  content: string[];
  gradientClass: string;
  type?: 'text' | 'summary' | 'interactive';
  icon?: string; // Icon name from a set
}

export interface UserInsight {
  id: string;
  text: string;
  timestamp: number;
}
