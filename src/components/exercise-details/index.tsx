import RecordsGraph from '@/src/components/records-graph';
import styles from './styles.module.css';
import { Exercise, RemoveExerciseHandler, AddRecordHandler, RemoveRecordHandler } from "@/types";

interface ExerciseDetailsProps {
    exercise: Exercise;
    onRemoveExercise: RemoveExerciseHandler;
    onAddRecord: AddRecordHandler;
    onRemoveRecord: RemoveRecordHandler;
}

const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({ exercise, onRemoveExercise, onAddRecord, onRemoveRecord }) => {
    const exerciseRecords = exercise.records.slice(-6).map(record => ({
        id: record.id,
        name: exercise.name,
        date: record.date.toLocaleDateString(),
        maxLoad: record.maxLoad
    }));

    return (
        <div className={styles.exercise}>
            <div className={styles.exerciseInfo}>
                <h2>{exercise.name}</h2>
                <p>Reps: {exercise.reps}</p>
                <div className={styles.buttonsWrapper}>
                    <button onClick={() => onRemoveExercise(exercise.name)}>Remove Exercise</button>
                    <button onClick={() => onAddRecord(exercise.name)}>Add Record</button>
                </div>
            </div>
            <div className={styles.exerciseRecords}>
                <RecordsGraph
                    records={exerciseRecords}
                    onRemoveRecord={onRemoveRecord}
                    exerciseName={exercise.name}
                />
            </div>
        </div>
    );
};

export default ExerciseDetails;
