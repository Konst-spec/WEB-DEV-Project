export interface Review {
    id: number;
    user: number;
    professor: number;
    subject: number;
    
    rating: number;
    difficulty: number;
    text: string;
    anonymous: boolean;
    
    created_at: string;
}