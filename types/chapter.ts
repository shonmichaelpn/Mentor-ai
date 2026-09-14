export interface Chapter {
  id: number;
  title: string;
  description: string;
  sections: LessonSection[];
  mcqTest: MCQQuestion[];
  codingChallenge: CodingChallenge;
}

export interface LessonSection {
  title: string;
  content: string;
  examples?: CodeExample[];
}

export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface CodingChallenge {
  title: string;
  scenario: string;
  instructions: string[];
  starterCode: string;
  expectedConcepts: string[];
  evaluationCriteria: string[];
}