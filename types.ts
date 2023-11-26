export interface Workout {
	id: number;
	programs: Program[];
}

export interface Program {
	id: number;
	exercises: Exercise[];
}

export interface Exercise {
    name: string;
    reps: string;
	records: Record[];
}

export interface Record {
    id: number
	date: Date;
    maxLoad: number;
}


export type RemoveExerciseHandler = (exerciseName: string) => void;
export type AddRecordHandler = (exerciseName: string) => void;
export type RemoveRecordHandler = (exerciseName: string, recordId: number) => void;