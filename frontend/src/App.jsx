import { useEffect, useState } from "react";
import "./App.css";
import "./Modal.css";
import {
  Search,
  Plus,
  Menu,
  UserCircle,
  X,
  Calendar,
  Settings,
  CheckSquare,
} from "lucide-react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:5000/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    setText("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  async function toggleDone(id) {
    // show strikethrough immediately (optimistic UI)
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, done: true } : todo)),
    );

    setTimeout(async () => {
      await deleteTodo(id); // this already calls the API + refetches
    }, 1500);
  }

  return (
    <div>
      {/* Header */}
      <header>
        <nav>
          <Menu />
          <div className="nav-icons">
            <Search />
            <UserCircle />
          </div>
        </nav>
      </header>

      {/* Main */}
      <main>
        <section>
          <h1>All Tasks</h1>

          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <div className="wrapper">
                  <input
                    className="check-box"
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => toggleDone(todo.id)}
                  />
                  {todo.text}
                </div>
                <button
                  className="icon-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete task"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Modal */}
        <div>
          {isOpen && (
            <div className="modal show">
              <div className="modal-content">
                <div className="close-icon">
                  <X onClick={() => setIsOpen(false)} />
                </div>

                <div className="container">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What do you need to do?"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addTodo();
                        setIsOpen(false);
                      }
                    }}
                  />
                  <button
                    className="add-btn"
                    onClick={() => {
                      addTodo();
                      setIsOpen(false);
                    }}
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer>
        <section className="section-1">
          <button className="plus-btn" onClick={() => setIsOpen(true)}>
            <Plus size={20} />
          </button>
        </section>

        <section className="section-2">
          <div className="sub-section">
            <CheckSquare />
            <p>Tasks</p>
          </div>
          <div className="sub-section">
            <Calendar />
            <p>Calender</p>
          </div>
          <div className="sub-section">
            <Settings />
            <p>Settings</p>
          </div>
        </section>
      </footer>
    </div>
  );
}

export default App;
