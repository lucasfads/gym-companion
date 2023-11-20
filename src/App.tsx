import { Routes, Route, Outlet, Link } from "react-router-dom";
import './App.css'

import WorkoutsList from '@/src/components/workouts-list';
import WorkoutDetails from '@/src/components/workout-details';
import ProgramDetails from '@/src/components/program-details'

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
