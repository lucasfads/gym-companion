import styles from './styles.module.css';
import prismadb from '@/lib/prismadb';

const WorkoutsList: React.FC = () => {
	
	return (
		<div className={`${styles.workouts}`}>
		  Hello Workouts
		</div>
	);

}
export default WorkoutsList;