import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Workout, Program } from '@/types';
import { addPrograms, removeProgram, openDatabase } from '@/src/lib/indexed-db'
import { Link } from 'react-router-dom';

const getWorkoutById = async (db: IDBDatabase, id: number): Promise<Workout> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["workouts"], "readonly");
        const store = transaction.objectStore("workouts");
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

type ProgramsListProps = {
    workoutId: number;
};

const ProgramsList: React.FC<ProgramsListProps> = ( {workoutId} ) => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [error, setError] = useState<string | null>(null);

	const handleAddProgram = () => {
		const maxId = programs.reduce((max, p) => p.id > max ? p.id : max, 0);
	
		const newProgram : Program = {
			id: maxId + 1,
			exercises: []
		};

		addPrograms(workoutId, newProgram);
	
		setPrograms([...programs, newProgram]);
	};

	const handleRemoveProgram = (id: number) => {
		const updatedPrograms = programs.filter(program => program.id !== id);
		removeProgram(workoutId, id)
		setPrograms(updatedPrograms);
	};

    useEffect(() => {
        const fetchPrograms = async () => {
			try {
				const db: IDBDatabase = await openDatabase();
				const workout: Workout = await getWorkoutById(db, workoutId);
				if (workout) {
					setPrograms(workout.programs);
				} else {
					console.log("Workout not found");
				}
			} catch (err) {
				console.log("Error searching for programs", err);
				setError(err as string);
			}
		};

        fetchPrograms();
    }, []);

    if (error) {
        return <div>Error loading programs.</div>;
    }

    if (!programs || programs.length === 0) {
        return <div>No program found. <button onClick={handleAddProgram}>Add Program</button></div>;
    }

    return (
		<div>
			<button onClick={handleAddProgram}>Add Program</button>
			<div className={styles.programs}>
				{programs.map((program: Program) => (
					<div key={program.id}>
						{/* <Link to={`/workout/${workout.id}`}>{workout.id}</Link> */}
						<Link to={`/workout/${workoutId}/program/${program.id}`}>Program {program.id}</Link>
						<button onClick={() => handleRemoveProgram(program.id)}>Remove</button>
					</div>
				))}
			</div>
		</div>
    );
}

export default ProgramsList;
