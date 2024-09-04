import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from './firebaseConnection';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState(null); 
  const [DetalhesUsuario, setDetalhesUsuario] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const verificarLogin = () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("Usuário logado:", user); 
          setUsuario(true);
          setDetalhesUsuario({
            uid: user.uid,
            email: user.email,
          });
          navigate("/home");
        } else {
          console.log("Usuário não logado"); 
          setUsuario(false);
          setDetalhesUsuario(null); 
        }
      });

      return () => unsubscribe(); 
    };
    verificarLogin();
  }, [navigate]);

  const novoUsuario = async () => {
    if (email === "" || senha === "") {
      alert("Preencha todos os campos");
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      setEmail("");
      setSenha("");
      navigate("/home"); 
    } catch (error) {
      console.error("Erro ao criar usuário:", error); 
      if (error.code === 'auth/weak-password') {
        alert("Senha muito fraca.");
      } else if (error.code === 'auth/email-already-in-use') {
        alert("Email já cadastrado");
      } else {
        alert("Erro ao criar usuário. Por favor, tente novamente.");
      }
    }
  };

  const logarUsuario = async () => {
    if (email === "" || senha === "") {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const value = await signInWithEmailAndPassword(auth, email, senha);
      console.log("Usuário logado:", value.user); 
      setUsuario(true);
      setDetalhesUsuario({
        uid: value.user.uid,
        email: value.user.email,
      });
      setEmail("");
      setSenha("");
      navigate("/home"); 
    } catch (error) {
      console.error("Erro ao logar usuário:", error); 
      if (error.code === 'auth/wrong-password') {
        alert("Senha incorreta.");
      } else if (error.code === 'auth/user-not-found') {
        alert("Usuário não encontrado.");
      } else {
        alert("Erro ao logar. Por favor, tente novamente.");
      }
    }
  };

  const fazerLogout = async () => {
    try {
      await signOut(auth);
      console.log("Usuário deslogado"); 
      setUsuario(null); 
      setDetalhesUsuario(null); 
    } catch (error) {
      console.error("Erro ao sair:", error); 
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Autenticação</h1>
      
      {usuario && DetalhesUsuario && (
        <div className="alert alert-success" role="alert">
          <strong>Seja bem-vindo(a)! Você está logado!</strong>
          <p>ID: {DetalhesUsuario.uid} - Email: {DetalhesUsuario.email}</p>
          <button className="btn btn-danger" onClick={fazerLogout}>Sair</button>
        </div>
      )}

      {!usuario && (
        <div className="card p-4">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                id="email"
                className="form-control"
                placeholder="Insira um e-mail"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="senha" className="form-label">Senha:</label>
              <input
                id="senha"
                className="form-control"
                placeholder="Insira uma senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button className="btn btn-primary me-2" onClick={novoUsuario}>Cadastrar</button>
            <button className="btn btn-secondary" onClick={logarUsuario}>Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
