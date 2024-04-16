import React from 'react';
import ReactDOM from "react-dom/client";
import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import './index.css';
import Layout from "./Layout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Scheduler from './components/Scheduler';



const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vlog" element={<Layout />}>
          {/* Define nested routes relative to /vlog */}
          <Route index element={<Dashboard />} />
          <Route path="schedule-meeting" element={<Scheduler />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
  };

// Render the application
export default Main;