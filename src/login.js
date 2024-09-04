import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from './firebaseConnection';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState(null); // Mudado para null
  const [DetalhesUsuario, setDetalhesUsuario] = useState(null); // Mudado para null
  const navigate = useNavigate();

  useEffect(() => {
    const verificarLogin = () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("Usuário logado:", user); // Adicionei log
          setUsuario(true);
          setDetalhesUsuario({
            uid: user.uid,
            email: user.email,
          });
          navigate("/home");
        } else {
          console.log("Usuário não logado"); // Adicionei log
          setUsuario(false);
          setDetalhesUsuario(null); // Mudado para null
        }
      });

      return () => unsubscribe(); // Cleanup the subscription
    };
    verificarLogin();
  }, [navigate]);

  const novoUsuario = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      setEmail("");
      setSenha("");
      navigate("/home"); 
    } catch (error) {
      console.error("Erro ao criar usuário:", error); // Adicionei log
      if (error.code === 'auth/weak-password') {
        alert("Senha muito fraca.");
      } else if (error.code === 'auth/email-already-in-use') {
        alert("Email já cadastrado");
      }
    }
  };

  const logarUsuario = async () => {
    try {
      const value = await signInWithEmailAndPassword(auth, email, senha);
      console.log("Usuário logado:", value.user); // Adicionei log
      setUsuario(true);
      setDetalhesUsuario({
        uid: value.user.uid,
        email: value.user.email,
      });
      setEmail("");
      setSenha("");
      navigate("/home"); 
    } catch (error) {
      console.error("Erro ao logar usuário:", error); // Adicionei log
    }
  };

  const fazerLogout = async () => {
    try {
      await signOut(auth);
      console.log("Usuário deslogado"); // Adicionei log
      setUsuario(null); // Mudado para null
      setDetalhesUsuario(null); // Mudado para null
    } catch (error) {
      console.error("Erro ao sair:", error); // Adicionei log
    }
  };

  return (
    <div>
      <h1>Autenticação</h1>
      {usuario && DetalhesUsuario && (
        <div>
          <strong>Seja bem-vindo(a) Você está logado!</strong>
          <span> ID: {DetalhesUsuario.uid} - Email: {DetalhesUsuario.email}</span>
          <br />
          <button onClick={fazerLogout}>Sair</button>
        </div>
      )}

      <label>Email:</label>
      <input
        placeholder="Insira um e-mail"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <label>Senha:</label>
      <input
        placeholder="Insira uma senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={novoUsuario}>Cadastrar</button>
      <button onClick={logarUsuario}>Login</button>
    </div>
  );
}

export default Login;
