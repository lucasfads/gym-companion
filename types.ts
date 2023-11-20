export interface Workout {
	id: number;
	programs: Program[];
}

export interface Program {
	number: number;
}

export interface Exercise {
    name: string;
    reps: number;
	records: Record[];
}

export interface Record {
    date: Date;
    maxLoad: number;
}
