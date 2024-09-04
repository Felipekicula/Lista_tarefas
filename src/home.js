import { useState, useEffect } from "react";
import { db } from './firebaseConnection';
import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o CSS do Bootstrap

function Home() {
  const [tarefa, setTarefa] = useState("");
  const [pessoa, setPessoa] = useState("");
  const [idPost, setIdPost] = useState("");
  const [post, setPost] = useState([]);

  useEffect(() => {
    const carregarPosts = async () => {
      const unsubscribe = onSnapshot(collection(db, "tarefa"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            pessoa: doc.data().pessoa,
          });
        });
        setPost(listaPost);
      });

      return () => unsubscribe();
    };

    carregarPosts();
  }, []);

  const adicionarPosts = async () => {
    if (tarefa === "" || pessoa === "") {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await addDoc(collection(db, "tarefa"), {
        tarefa: tarefa,
        pessoa: pessoa,
      });
      setPessoa("");
      setTarefa("");
    } catch (error) {
      console.log("Erro ao adicionar tarefa: " + error);
    }
  };

  const buscarPost = async () => {
    try {
      const snapshot = await getDocs(collection(db, "tarefa"));
      let listaPost = [];

      snapshot.forEach((doc) => {
        listaPost.push({
          id: doc.id,
          tarefa: doc.data().tarefa,
          pessoa: doc.data().pessoa,
        });
      });

      setPost(listaPost);
    } catch (error) {
      console.log("Erro ao buscar tarefa: " + error);
    }
  };

  const editarPost = async () => {
    if (idPost === "") {
      alert("Selecione uma tarefa para editar!");
      return;
    }

    try {
      const postEditado = doc(db, "tarefa", idPost);
      await updateDoc(postEditado, {
        tarefa: tarefa,
        pessoa: pessoa
      });
      setIdPost("");
      setTarefa("");
      setPessoa("");
    } catch (error) {
      console.log("Erro ao editar tarefa: " + error);
    }
  };

  const excluirPost = async (id) => {
    try {
      const postExcluido = doc(db, "tarefa", id);
      await deleteDoc(postExcluido);
      alert("Tarefa excluída com sucesso!");
    } catch (error) {
      console.log("Erro ao excluir tarefa: " + error);
    }
  };

  const selecionarPost = (post) => {
    setIdPost(post.id);
    setTarefa(post.tarefa);
    setPessoa(post.pessoa);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gerenciamento de Tarefas</h1>

      <div className="mb-3">
        <label htmlFor="tarefa" className="form-label">Tarefa:</label>
        <input
          id="tarefa"
          className="form-control"
          placeholder="Insira uma tarefa"
          type="text"
          value={tarefa}
          onChange={(e) => setTarefa(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="pessoa" className="form-label">Pessoa:</label>
        <input
          id="pessoa"
          className="form-control"
          placeholder="Insira o nome da pessoa"
          type="text"
          value={pessoa}
          onChange={(e) => setPessoa(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={adicionarPosts}>Adicionar</button>
        <button className="btn btn-secondary me-2" onClick={buscarPost}>Buscar</button>
        <button className="btn btn-warning" onClick={editarPost}>Editar</button>
      </div>

      <ul className="list-group">
        {post.map((post) => (
          <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>ID: {post.id}</strong><br />
              <strong>Tarefa: {post.tarefa}</strong><br />
              <strong>Pessoa: {post.pessoa}</strong>
            </div>
            <div>
              <button className="btn btn-info me-2" onClick={() => selecionarPost(post)}>Editar</button>
              <button className="btn btn-danger" onClick={() => excluirPost(post.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
