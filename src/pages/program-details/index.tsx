import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Workout, Program, Exercise } from '@/types';
import { updateProgramInDB, fetchWorkoutDetailsFromDB } from '@/src/lib/indexed-db';
import ExercisesList from '@/src/components/exercises-list';


const ProgramDetails = () => {
    const { workoutId, programId } = useParams();
    const [_workout, setWorkout] = useState<Workout>();
    const [program, setProgram] = useState<Program>();

    useEffect(() => {
        const fetchProgramDetails = async () => {
            try {
                if (workoutId !== undefined) {
                    const workoutData = await fetchWorkoutDetailsFromDB(parseInt(workoutId as string));
                    setWorkout(workoutData);
            
                    const programData = workoutData.programs.find(program => program.id === parseInt(programId as string, 10));
                    setProgram(programData);
                }
            } catch (err) {
                console.error("Error searching for the program details", err);
            }
        };
        fetchProgramDetails();
    }, [workoutId, programId]);

    const handleAddExercise = async () => {
        const exerciseName = prompt("Enter the name of the exercise:");
        if (!exerciseName) {
            alert("The exercise name is required.");
            return;
        }

        const reps = prompt("Enter the number of reps:");
        if (!reps) {
            alert("Invalid number of reps.");
            return;
        }

        const newExercise: Exercise = {
            name: exerciseName,
            reps: reps,
            records: []
        };
        
        const updatedExercises: Exercise[] = [...(program?.exercises || []), newExercise];
    
        if (program?.id !== undefined) {
            const updatedProgram: Program = { ...program, exercises: updatedExercises };
        
            setProgram(updatedProgram);
            
            updateProgramInDB(parseInt(workoutId as string, 10), updatedProgram);
        }
    };
    

    const handleRemoveExercise = async (exerciseName: string) => {
        const updatedExercises: Exercise[] = program?.exercises.filter(exercise => exercise.name !== exerciseName) || [];
        
        if (program?.id !== undefined) {
            const updatedProgram: Program = { ...program, exercises: updatedExercises };
        
            setProgram(updatedProgram);
        
            updateProgramInDB(parseInt(workoutId as string, 10), updatedProgram);
        }
    };
    

    const handleAddRecord = (exerciseName: string) => {
        const date = new Date();
        
        const maxLoadString: string | null = prompt("Enter the maximum load (kg):");
        let maxLoad: number = 0;
        if (maxLoadString)
             maxLoad = parseFloat(maxLoadString);
        if (isNaN(maxLoad) || maxLoad <= 0) {
            alert("Invalid maximum load.");
            return;
        }
    
        const newRecord = {
            id: Date.now(),
            date: date,
            maxLoad: maxLoad
        };
    
        const updatedExercises = program?.exercises.map(exercise => {
            if (exercise.name === exerciseName) {
                return { ...exercise, records: [...exercise.records, newRecord] };
            }
            return exercise;
        }) || [];

        if (program?.id !== undefined) {
            const updatedProgram = { ...program, exercises: updatedExercises };
            
            setProgram(updatedProgram);
            
            updateProgramInDB(parseInt(workoutId as string, 10), updatedProgram);
        }
    };
    

    const handleRemoveRecord = (exerciseName: string, recordId: number) => {
        const updatedExercises = program?.exercises.map(exercise => {
            if (exercise.name === exerciseName) {
                const updatedRecords = exercise.records.filter(record => record.id !== recordId);
                return { ...exercise, records: updatedRecords };
            }
            return exercise;
        }) || [];

        if (program?.id !== undefined) {
            const updatedProgram = { ...program, exercises: updatedExercises };
        
            setProgram(updatedProgram);
        
            updateProgramInDB(parseInt(workoutId as string, 10), updatedProgram);
        }
    };
    

    if (!program) {
        return <div>Loading program details...</div>;
    }

    return (
        <div>
            <h1>Program {program.id}</h1>
            <button onClick={handleAddExercise}>Add Exercise</button>
            <ExercisesList
                exercises={program.exercises}
                onRemoveExercise={handleRemoveExercise}
                onAddRecord={handleAddRecord}
                onRemoveRecord={handleRemoveRecord}
            />
        </div>
    );
};

export default ProgramDetails;
