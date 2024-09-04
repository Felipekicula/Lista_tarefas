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

function Home() {
  const [tarefa, setTarefa] = useState("");
  const [pessoa, setPessoa] = useState("");
  const [idPost, setIdPost] = useState("");
  const [post, setPost] = useState([]);

  useEffect(() => {
    const carregarPosts = () => {
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

  return (
    <div>
      <h1>Gerenciamento de Tarefas</h1>

      <label>ID da tarefa:</label>
      <input
        placeholder=" - - NÃO PREENCHER - - "
        value={idPost}
        onChange={(e) => setIdPost(e.target.value)}
      />
      <br />
      <label>Tarefa:</label>
      <input
        placeholder="Tarefa"
        type="text"
        value={tarefa}
        onChange={(e) => setTarefa(e.target.value)}
      />
      <label>pessoa:</label>
      <input
        placeholder="pessoa"
        type="text"
        value={pessoa}
        onChange={(e) => setPessoa(e.target.value)}
      />

      <button onClick={adicionarPosts}>Adicionar</button>
      <button onClick={buscarPost}>Buscar</button>
      <button onClick={editarPost}>Editar</button>

      <ul>
        {post.map((post) => (
          <li key={post.id}>
            <strong>ID: {post.id}</strong><br />
            <strong>Tarefa: {post.tarefa}</strong><br />
            <strong>pessoa: {post.pessoa}</strong><br />
            <button onClick={() => excluirPost(post.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
