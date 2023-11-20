import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Workout } from '@/types';
import { addWorkout, openDatabase } from '@/lib/indexed-db'

function getAllWorkouts(db) {
	return new Promise((resolve, reject) => {
	  const transaction = db.transaction(["workouts"], "readonly");
	  const store = transaction.objectStore("workouts");
	  const request = store.getAll();
  
	  request.onsuccess = () => resolve(request.result);
	  request.onerror = () => reject(request.error);
	});
  }
  

const WorkoutsList: React.FC = () => {
    const [workouts, setWorkouts] = useState([]);
    const [error, setError] = useState(null);

	const handleAddWorkout = async () => {
		try {
			const db = await openDatabase(); // Abre a conexão com o IndexedDB
			const newWorkout = {/* dados do novo workout */}; // Substitua isso pelos dados reais do workout
			await addWorkout(db); // Chama addWorkout passando a conexão e o novo workout
			// Recarrega os workouts após a adição
			const allWorkouts = await getAllWorkouts(db);
			setWorkouts(allWorkouts);
		} catch (err) {
			console.error("Erro ao adicionar workout", err);
			setError(err);
		}
	};
	

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const db = await openDatabase(); // Supõe-se que essa função abre o IndexedDB
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
        return <div>Erro ao carregar workouts.</div>;
    }

    if (!workouts || workouts.length === 0) {
        return <div>Nenhum workout encontrado.<button onClick={handleAddWorkout}>ADD</button></div>;
    }

    return (
		<div>
			<button onClick={handleAddWorkout}>ADD</button>
			<div className={styles.workouts}>
				{workouts.map(workout => (
					<div key={workout.id}>{workout.id}</div>
				))}
			</div>
		</div>
    );
}

export default WorkoutsList;
