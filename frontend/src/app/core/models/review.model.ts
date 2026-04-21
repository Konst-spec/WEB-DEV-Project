export interface Review {
  rev_id: number;
  user: number;
  professor: number;
  subject: number;
  rating: number;
  difficulty: number;
  text: string;
  created_at: string;
  is_anounimous: boolean;
}

export interface CreateReviewRequest {
  prof_id: number;
  subj_id: number;
  rating: number;
  difficulty: number;
  text: string;
  is_anounimous: boolean;
}