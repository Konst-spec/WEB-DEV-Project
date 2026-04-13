import { Subject } from "./subject.model";

export interface Professor {
    id: number;
    name: string;
    surname: string;
    rating: number;
    subjects: Subject[];
}