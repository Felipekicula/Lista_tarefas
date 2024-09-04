import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./login";
import Home from './home';
import Erro from './erro';

function RoutesApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Erro />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesApp;
