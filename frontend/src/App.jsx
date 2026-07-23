import { useEffect, useState } from "react";
import "./App.css";
import "./Modal.css";
import { Search, Plus, Menu, UserCircle, Cross, CrossIcon } from "lucide-react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState("false");

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

  return (
    <div>
      <header>
        <nav>
          <Menu />
          <div className="nav-icons">
            <Search />
            <UserCircle />
          </div>
        </nav>
      </header>

      <main>
        <section>
          <h1>All Tasks</h1>

          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.text}</li>
            ))}
          </ul>
        </section>

        {/* Modal */}
        <div>
          <button className="plus" onClick={() => setIsOpen(true)}>
            <Plus size={20} />
          </button>

          {isOpen && (
            <div className="modal show">
              <div className="modal-content">
                <input value={text} onChange={(e) => setText(e.target.value)} />
                <button onClick={addTodo}>Add Task</button>
                <button onClick={() => setIsOpen(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
