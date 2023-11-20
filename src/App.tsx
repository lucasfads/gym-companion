import { useState } from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import './App.css'

import WorkoutsList from '@/src/components/workouts'

function App() {

  return (
    <Routes>
      <Route path="/" element={<WorkoutsList />} />
    </Routes>
  );
}

export default App
