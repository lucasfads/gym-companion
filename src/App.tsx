import { Routes, Route } from "react-router-dom";
import './App.css'

import WorkoutsList from '@/src/pages/workouts-list';
import WorkoutDetails from '@/src/pages/workout-details';
import ProgramDetails from '@/src/pages/program-details'

function NotFound() {
  return (
      <div>
          <h1>Oops! You seem to be lost.</h1>
          <p>Error 404</p>
      </div>
  )
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<WorkoutsList />} />
      <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
      <Route path="/workout/:workoutId/program/:programId" element={<ProgramDetails />} />
      <Route path='*' element={<NotFound />}/>
    </Routes>
  );
}

export default App
