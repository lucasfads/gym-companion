import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { Workout } from '@/types';
import { openDatabase, fetchWorkoutDetailsFromDB } from '@/lib/indexed-db';
import ProgramsList from '@/src/components/programs-list';

const WorkoutDetails: React.FC = () => {
	const [workout, setWorkout] = useState<Workout>();
    const { workoutId } = useParams();

	useEffect(() => {
        const fetchWorkoutDetails = async () => {
			const data = await fetchWorkoutDetailsFromDB(workoutId);
            setWorkout(data);
        };

        fetchWorkoutDetails();
    }, [workoutId]);

    if (!workout) {
        return <div>Carregando...</div>;
    }

    return (
        <div>
            <h1>{workout.id}</h1>
            <ProgramsList workoutId={workout.id}></ProgramsList>
        </div>
    );

}

export default WorkoutDetails;
