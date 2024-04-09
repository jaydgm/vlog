import React from 'react';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import './index.css';
import App from "./App.jsx";
import Login from "./components/Login";
import Signup from "./components/Signup.jsx";
import Signup from "./components/Dashboard.jsx";



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Signup />} /> 
      <Route path="login" element={<Login />} />
      <Route path="/vlog" element={<App />}>
        <Route path="" element={<Dashboard.jsx />} />
      </Route>
    </>
  )
);

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);