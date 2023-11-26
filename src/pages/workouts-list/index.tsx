import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Workout } from '@/types';
import { addWorkout, removeWorkout, openDatabase } from '@/src/lib/indexed-db';
import { Link } from 'react-router-dom';
import { formatTimestamp } from '@/src/lib/utils';

const getAllWorkouts = (db) => {
	return new Promise((resolve, reject) => {
	  const transaction = db.transaction(["workouts"], "readonly");
	  const store = transaction.objectStore("workouts");
	  const request = store.getAll();
  
	  request.onsuccess = () => resolve(request.result);
	  request.onerror = () => reject(request.error);
	});
}

const WorkoutsList: React.FC = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [error, setError] = useState(null);

	const handleAddWorkout = async () => {
		try {
			const db = await openDatabase();
			await addWorkout(db);
			
			const allWorkouts = await getAllWorkouts(db);
			setWorkouts(allWorkouts);
		} catch (err) {
			console.error("Error adding workout", err);
			setError(err);
		}
	};

	const handleRemoveWorkout = async (workoutId : number) => {
		try {
			const db = await openDatabase();
			await removeWorkout(db, workoutId);
			
			const allWorkouts = await getAllWorkouts(db);
			setWorkouts(allWorkouts);
		} catch (err) {
			console.error("Error removing workout", err);
			setError(err);
		}
	};
	

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const db = await openDatabase();
                const allWorkouts = await getAllWorkouts(db);
                setWorkouts(allWorkouts);
            } catch (err) {
                console.log(err);
                setError(err);
            }
        };

        fetchWorkouts();
    }, []);

    if (error) {
        return <div>Error loading workouts.</div>;
    }

    if (!workouts || workouts.length === 0) {
        return <div>No workout found. <button onClick={handleAddWorkout}>Add Workout</button></div>;
    }

    return (
		<div>
			<button onClick={handleAddWorkout}>Add Workout</button>
			<div className={styles.workouts}>
				{workouts.slice(0).reverse().map((workout: Workout) => (
					<div key={workout.id}>
						<Link to={`/workout/${workout.id}`}>Workout started on {formatTimestamp(workout.id)}</Link>
						<button onClick={() => handleRemoveWorkout(workout.id)}>Remove</button>
					</div>
				))}
			</div>
		</div>
    );
}

export default WorkoutsList;
