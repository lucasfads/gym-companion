import { Routes, Route } from "react-router-dom";
import './App.css'

import WorkoutsList from '@/src/pages/workouts-list';
import WorkoutDetails from '@/src/pages/workout-details';
import ProgramDetails from '@/src/pages/program-details'

function App() {

  return (
    <Routes>
      <Route path="/" element={<WorkoutsList />} />
      <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
      <Route path="/workout/:workoutId/program/:programId" element={<ProgramDetails />} />
    </Routes>
  );
}

export default App
