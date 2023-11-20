import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { Workout, Program } from '@/types';
import { openDatabase, updateProgramInDB, fetchWorkoutDetailsFromDB } from '@/lib/indexed-db';
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
                console.error("Erro ao buscar os detalhes do programa", err);
            }
        };
        fetchProgramDetails();
    }, [workoutId, programId]);

    const handleAddExercise = async () => {
        const exerciseName = prompt("Digite o nome do exercício:");
        if (!exerciseName) {
            alert("Nome do exercício é obrigatório.");
            return;
        }

        const reps = prompt("Digite o número de repetições:");
        if (!reps) {
            alert("Número de repetições inválido.");
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
        
        const maxLoadString = prompt("Digite a carga máxima (kg):");
        const maxLoad = parseFloat(maxLoadString);
        if (isNaN(maxLoad) || maxLoad <= 0) {
            alert("Carga máxima inválida.");
            return;
        }
    
        const newRecord = {
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
    

    const handleRemoveRecord = (exerciseName, recordDate) => {
        const dateToRemove = typeof recordDate === 'string' ? new Date(recordDate) : recordDate;
    
        const updatedExercises = program.exercises.map(exercise => {
            if (exercise.name === exerciseName) {
                const updatedRecords = exercise.records.filter(record => 
                    record.date.getTime() !== dateToRemove.getTime()
                );
                return { ...exercise, records: updatedRecords };
            }
            return exercise;
        });
    
        const updatedProgram = { ...program, exercises: updatedExercises };
        
        setProgram(updatedProgram);
        
        updateProgramInDB(parseInt(workoutId, 10), updatedProgram);
    };
    

    if (!program) {
        return <div>Carregando detalhes do programa...</div>;
    }

    const exerciseRecords = [
        { date: '2021-01-01', maxLoad: 100 },
        { date: '2021-02-01', maxLoad: 110 },
        { date: '2021-03-01', maxLoad: 105 },
    ];


    return (
        <div>
            <h1>Programa {program.number}</h1>
            <button onClick={handleAddExercise}>Adicionar Exercício</button>
            {program.exercises.map((exercise, index) => (
                <div key={index}>
                    <h2>{exercise.name}</h2>
                    <p>Reps: {exercise.reps}</p>
                    <button onClick={() => handleRemoveExercise(exercise.name)}>Remover Exercício</button>
                    {exercise.records.map((record, recordIndex) => (
                        <div key={recordIndex}>
                            <p>Data: {record.date.toLocaleDateString()}</p>
                            <p>Carga Máxima: {record.maxLoad} kg</p>
                            <button onClick={() => handleRemoveRecord(exercise.name, record.date)}>Remover Registro</button>
                        </div>
                    ))}
                    <RecordsGraph records={exerciseRecords} ></RecordsGraph>
                    <button onClick={() => handleAddRecord(exercise.name)}>Add Registro</button>
                </div>
            ))}
        </div>
    );
};

export default ProgramDetails;
