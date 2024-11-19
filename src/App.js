import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login/LoginPage';
import Example from './pages/example/Example';
import RegisterPage from './pages/register/RegisterPage';
import BackgroundCircle from './pages/backgroundCircle/BackgroundCircle';
import { AuthProvider } from './authContext'; // Import the AuthProvider
import Dashboard from './pages/dashboard/dashboard';

function App() {    
    const router = createBrowserRouter(
        createRoutesFromElements(
        <Route path="/kriptografi" element={<BackgroundCircle/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='register' element={<RegisterPage/>}/>
        </Route>
        )
    );

    return (
    <>
        <React.StrictMode>
            <AuthProvider>
                    <RouterProvider router={router} />
            </AuthProvider>
        </React.StrictMode>
    </>
    )
}

export default App;
