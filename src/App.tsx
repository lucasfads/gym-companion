import { useState } from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import './App.css'

import WorkoutsList from '@/src/components/workouts-list'
import WorkoutDetails from '@/src/components/workout-details'

function App() {

  return (
    <Routes>
      <Route path="/" element={<WorkoutsList />} />
      <Route path="/workout/:id" element={<WorkoutDetails />} />
    </Routes>
  );
}

export default App
