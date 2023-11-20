import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { Workout, Program } from '@/types';
import { openDatabase, updateProgramInDB, fetchWorkoutDetailsFromDB } from '@/lib/indexed-db';

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
            records: [] // Inicia com um array vazio
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
    

    const handleAddRecord = (exerciseName, newRecord) => {
        // Lógica para adicionar um novo registro a um exercício
    };

    const handleRemoveRecord = (exerciseName, recordDate) => {
        // Lógica para remover um registro de um exercício
    };
    if (!program) {
        return <div>Carregando detalhes do programa...</div>;
    }
    return (
        <div>
            <h1>Programa {program.number}</h1>
            <button onClick={handleAddExercise}>Adicionar Exercício</button>
            {program.exercises.map((exercise, index) => (
                <div key={index}>
                    <h2>{exercise.name}</h2>
                    <p>Reps: {exercise.reps}</p>
                    <button onClick={() => handleRemoveExercise(exercise.name)}>Remover Exercício</button>
                    {/* Listar registros */}
                    {exercise.records.map((record, recordIndex) => (
                        <div key={recordIndex}>
                            <p>Data: {record.date.toLocaleDateString()}</p>
                            <p>Carga Máxima: {record.maxLoad} kg</p>
                            {/* Botão para remover um registro */}
                            <button onClick={() => handleRemoveRecord(exercise.name, record.date)}>Remover Registro</button>
                        </div>
                    ))}
                    {/* Botão para adicionar um novo registro */}
                    {/* (Pode ser um formulário ou um modal para capturar os detalhes do novo registro) */}
                </div>
            ))}
        </div>
    );
};

export default ProgramDetails;
