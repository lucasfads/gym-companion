import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { Workout, Program } from '@/types';
import { updateProgramInDB, fetchWorkoutDetailsFromDB } from '@/lib/indexed-db';
import RecordsGraph from '@/src/components/records-graph';

const ProgramDetails = () => {
    const { workoutId, programId } = useParams();
    const [workout, setWorkout] = useState<Workout>();
    const [program, setProgram] = useState<Program>();

    useEffect(() => {
        const fetchProgramDetails = async () => {
            try {
                const workoutData = await fetchWorkoutDetailsFromDB(workoutId);
                setWorkout(workoutData);
        
                const programData = workoutData.programs.find(program => program.id === parseInt(programId, 10));
                setProgram(programData);
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

        const newExercise = {
            name: exerciseName,
            reps: reps,
            records: []
        };
        
        const updatedExercises = [...program.exercises, newExercise];
    
        const updatedProgram = { ...program, exercises: updatedExercises };
        
        setProgram(updatedProgram);
    
        updateProgramInDB(parseInt(workoutId, 10), updatedProgram);
    };
    

    const handleRemoveExercise = async (exerciseName) => {
        const updatedExercises = program.exercises.filter(exercise => exercise.name !== exerciseName);
        
        const updatedProgram = { ...program, exercises: updatedExercises };
        
        setProgram(updatedProgram);
        
        updateProgramInDB(parseInt(workoutId, 10), updatedProgram);
    };
    

    const handleAddRecord = (exerciseName) => {
        const date = new Date();
        
        const maxLoadString = prompt("Enter the maximum load (kg):");
        const maxLoad = parseFloat(maxLoadString);
        if (isNaN(maxLoad) || maxLoad <= 0) {
            alert("Invalid maximum load.");
            return;
        }
    
        const newRecord = {
            id: Date.now(),
            date: date,
            maxLoad: maxLoad
        };
    
        const updatedExercises = program.exercises.map(exercise => {
            if (exercise.name === exerciseName) {
                return { ...exercise, records: [...exercise.records, newRecord] };
            }
            return exercise;
        });

        const updatedProgram = { ...program, exercises: updatedExercises };
        
        setProgram(updatedProgram);
        
        updateProgramInDB(parseInt(workoutId, 10), updatedProgram);        
    };
    

    const handleRemoveRecord = (exerciseName, recordId) => {
        const updatedExercises = program.exercises.map(exercise => {
            if (exercise.name === exerciseName) {
                const updatedRecords = exercise.records.filter(record => record.id !== recordId);
                return { ...exercise, records: updatedRecords };
            }
            return exercise;
        });
        const updatedProgram = { ...program, exercises: updatedExercises };
        
        setProgram(updatedProgram);
        
        updateProgramInDB(parseInt(workoutId, 10), updatedProgram);
    };
    

    if (!program) {
        return <div>Loading program details...</div>;
    }

    return (
        <div>
            <h1>Program {program.id}</h1>
            <button onClick={handleAddExercise}>Add Exercise</button>
            {program.exercises.map((exercise, index) => {
                const exerciseRecords = exercise.records.map(record => {
                    return {
                        id: record.id,
                        name: exercise.name,
                        date: record.date.toLocaleDateString(),
                        maxLoad: record.maxLoad
                    };
                });
                return(
                    <div key={index} className={styles.exercise}>
                        <h2>{exercise.name}</h2>
                        <p>Reps: {exercise.reps}</p>
                        <button onClick={() => handleRemoveExercise(exercise.name)}>Remove Exercise</button>
                        {/* {exercise.records.map((record, recordIndex) => (
                            <div key={recordIndex}>
                                <p>Date: {record.date.toLocaleDateString()}</p>
                                <p>Maximum Load: {record.maxLoad} kg</p>
                                <button onClick={() => handleRemoveRecord(exercise.name, record.id)}>Remove Record</button>
                            </div>
                        ))} */}
                        <RecordsGraph
                            records={exerciseRecords}
                            onRemoveRecord={handleRemoveRecord}
                            exerciseName={exercise.name}
                        ></RecordsGraph>
                        <button onClick={() => handleAddRecord(exercise.name)}>Add Record</button>
                    </div>
                )}
            )}
        </div>
    );
};

export default ProgramDetails;
