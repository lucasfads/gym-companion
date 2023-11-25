import ExerciseDetails from '@/src/components/exercise-details';
import styles from './styles.module.css';

const ExercisesList = ({ exercises, onRemoveExercise, onAddRecord, onRemoveRecord }) => {
    return (
        <div>
            {exercises.map((exercise, index) => (
                <ExerciseDetails
                    key={index}
                    exercise={exercise}
                    onRemoveExercise={onRemoveExercise}
                    onAddRecord={onAddRecord}
                    onRemoveRecord={onRemoveRecord}
                />
            ))}
        </div>
    );
};

export default ExercisesList;
