import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
function Erro() {
    const navigate = useNavigate();

    const voltarLogin = () => {
        navigate('/home'); 
    }

    return (
        <div className="container text-center mt-5">
            <h1 className="display-1">404</h1>
            <p className="lead">Página não encontrada</p>
            <button className="btn btn-primary mt-3" onClick={voltarLogin}>Voltar para as tarefas</button>
        </div>
    );
}

export default Erro;
