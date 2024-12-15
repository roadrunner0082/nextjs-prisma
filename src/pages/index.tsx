import { NextPage } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { createTodo, deleteTodo, toggleTodo, useTodos } from "../api";
import styles from "../styles/Home.module.css";
import { Todo } from "../types";

// Mock-Login- und Registrierungsfunktionen
const login = async (username: string, password: string) => {
  // Hier sollte die tatsächliche Authentifizierungslogik implementiert werden
  return username === "user" && password === "password";
};

const register = async (username: string, password: string) => {
  // Hier sollte die tatsächliche Registrierungslogik implementiert werden
  return true; // Annahme: Registrierung erfolgreich
};

// TodoList-Komponente: Ruft Todos ab und zeigt sie an
export const TodoList: React.FC = () => {
  const { data: todos, error } = useTodos();

  if (error != null) return <div>Error loading todos...</div>;
  if (todos == null) return <div>Loading...</div>;

  if (todos.length === 0) {
    return <div className={styles.emptyState}>Schreib was rein! ☝️️</div>;
  }

  return (
    <ul className={styles.todoList}>
      {todos.map(todo => (
        <TodoItem todo={todo} />
      ))}
    </ul>
  );
};

// TodoItem-Komponente: Stellt ein einzelnes Todo-Element dar
const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => (
  <li className={styles.todo}>
    <label
      className={`${styles.label} ${todo.completed ? styles.checked : ""}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        className={`${styles.checkbox}`}
        onChange={() => toggleTodo(todo)}
      />
      {todo.text}
    </label>

    <button className={styles.deleteButton} onClick={() => deleteTodo(todo.id)}>
      ✕
    </button>
  </li>
);

// AddTodoInput-Komponente: Formular zum Hinzufügen neuer Todos
const AddTodoInput = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [text, setText] = useState("");

  if (!isLoggedIn) {
    return <div className={styles.loginMessage}>Bitte loggen Sie sich ein, um Todos hinzuzufügen.</div>;
  }

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        createTodo(text);
        setText("");
      }}
      className={styles.addTodo}
    >
      <input
        className={styles.input}
        placeholder="Buy some milk"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button className={styles.addButton}>Add</button>
    </form>
  );
};

// Login-Komponente
const Login = ({ onLogin }: { onLogin: (isLoggedIn: boolean) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isLoggedIn = await login(username, password);
    onLogin(isLoggedIn);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <input
        className={styles.input}
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className={styles.loginButton}>Login</button>
    </form>
  );
};

// Register-Komponente
const Register = ({ onRegister }: { onRegister: (isRegistered: boolean) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isRegistered = await register(username, password);
    onRegister(isRegistered);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <input
        className={styles.input}
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        className={styles.input}
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className={styles.registerButton}>Register</button>
    </form>
  );
};

// Home-Komponente: Hauptkomponente der Seite
const Home: NextPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>Railway NextJS Prisma</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Todos</h1>
        <h2 className={styles.desc}>
          NextJS app connected to Postgres using Prisma and hosted on{" "}
          <a href="https://railway.app">Railway</a>
        </h2>
      </header>

      <main className={styles.main}>
        {isLoggedIn ? (
          <>
            <AddTodoInput isLoggedIn={isLoggedIn} />
            <TodoList />
          </>
        ) : isRegistering ? (
          <Register onRegister={(isRegistered) => {
            if (isRegistered) setIsRegistering(false);
          }} />
        ) : (
          <>
            <Login onLogin={setIsLoggedIn} />
            <button onClick={() => setIsRegistering(true)} className={styles.switchButton}>
              Register
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
