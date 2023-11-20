import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { Workout } from '@/types';
import { openDatabase } from '@/lib/indexed-db';

const fetchWorkoutDetailsFromDB = async (id: number | string) => {
	const db = await openDatabase();
	return new Promise((resolve, reject) => {
	  const transaction = db.transaction(["workouts"], "readonly");
	  const store = transaction.objectStore("workouts");
	  const request = store.get(parseInt(id, 10));
  
	  request.onsuccess = () => resolve(request.result);
	  request.onerror = () => reject(request.error);
	});
}

const WorkoutDetails: React.FC = () => {
	const [workout, setWorkout] = useState<Workout>();
    const { id } = useParams();

	useEffect(() => {
        const fetchWorkoutDetails = async () => {
			const data = await fetchWorkoutDetailsFromDB(id);
            setWorkout(data);
        };

        fetchWorkoutDetails();
    }, [id]);

    if (!workout) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h1>{workout.id}</h1>
            {/* Mais detalhes do workout */}
        </div>
    );

}

export default WorkoutDetails;
