export interface Subject {
  subj_id: number;
  name: string;
  description: string;         
} 

export interface SubjectDetail {
  id: number;
  name: string;
  description: string;
  professors: { id: number; name: string }[];
}