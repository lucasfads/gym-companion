import ExerciseDetails from '@/src/components/exercise-details';
import { Exercise, RemoveExerciseHandler, AddRecordHandler, RemoveRecordHandler } from "@/types";

interface ExercisesListProps {
    exercises: Exercise[];
    onRemoveExercise: RemoveExerciseHandler;
    onAddRecord: AddRecordHandler;
    onRemoveRecord: RemoveRecordHandler;
}

const ExercisesList: React.FC<ExercisesListProps>  = ({ exercises, onRemoveExercise, onAddRecord, onRemoveRecord }) => {
    return (
        <div>
            {exercises.map((exercise: Exercise, index: number) => (
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
