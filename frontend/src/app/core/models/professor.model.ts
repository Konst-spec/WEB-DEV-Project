import { Subject } from "./subject.model";

export interface Professor {
    prof_id: number;
    name: string;
    description: string;
    subjects: number[];
}