import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Program } from '@/types';
import { addPrograms, removeProgram, openDatabase } from '@/lib/indexed-db'
import { Link } from 'react-router-dom';

const getWorkoutById = async (db, id) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["workouts"], "readonly");
        const store = transaction.objectStore("workouts");
        const request = store.get(parseInt(id, 10));

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

type ProgramsListProps = {
    workoutId: string | number;
};

const ProgramsList: React.FC<ProgramsListProps> = ( {workoutId} ) => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [error, setError] = useState(null);

	const handleAddProgram = () => {
		const maxId = programs.reduce((max, p) => p.id > max ? p.id : max, 0);
	
		const newProgram : Program = {
			id: maxId + 1,
			exercises: []
		};

		addPrograms(workoutId, newProgram);
	
		setPrograms([...programs, newProgram]);
	};

	const handleRemoveProgram = (id) => {
		const updatedPrograms = programs.filter(program => program.id !== id);
		removeProgram(workoutId, id)
		setPrograms(updatedPrograms);
	};

    useEffect(() => {
        const fetchPrograms = async () => {
			try {
				const db = await openDatabase();
				console.log(workoutId);
				const workout = await getWorkoutById(db, workoutId);
				if (workout) {
					setPrograms(workout.programs);
				} else {
					console.log("Workout not found");
				}
			} catch (err) {
				console.log("Error searching for programs", err);
				setError(err);
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
