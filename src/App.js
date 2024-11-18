import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/login/loginPage";

function App() {    
    const router = createBrowserRouter(
        createRoutesFromElements(
        <Route path="/">
            <Route path='/login' element={<LoginPage/>}/>
            <Route index element={<LoginPage/>}/>
        </Route>
        )
    );

    return (
    <>
        <React.StrictMode>
                <RouterProvider router={router} />
        </React.StrictMode>
    </>
    )
}

export default App;
