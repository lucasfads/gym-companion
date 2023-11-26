import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Workout } from '@/types';
import { fetchWorkoutDetailsFromDB } from '@/src/lib/indexed-db';
import ProgramsList from '@/src/components/programs-list';
import { formatTimestamp } from '@/src/lib/utils';

const WorkoutDetails: React.FC = () => {
	const [workout, setWorkout] = useState<Workout>();
    const { workoutId } = useParams();

	useEffect(() => {
        const fetchWorkoutDetails = async () => {
			const data = await fetchWorkoutDetailsFromDB(parseInt(workoutId as string));
            setWorkout(data);
        };

        fetchWorkoutDetails();
    }, [workoutId]);

    if (!workout) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Workout started on {formatTimestamp(workout.id)}</h1>
            <ProgramsList workoutId={workout.id}></ProgramsList>
        </div>
    );

}

export default WorkoutDetails;
