import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import './App.css';

const API_BASE = 'http://localhost:4001/todo';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tag, setTag] = useState("");
  const [mention, setMention] = useState("");

  const [selectedTodo, setSelectedTodo] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Date");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    GetTodos();
  }, []);

  const handleChange = (e) => setInput(e.target.value);

  const GetTodos = () => {
    fetch(API_BASE)
      .then(res => res.json())
      .then(data => {
        const enriched = data.map(todo => ({
          ...todo,
          description: todo.description || "Sample description",
          tags: todo.tags || ["work"],
          priority: todo.priority || "Medium",
          notes: todo.notes || [],
          users: todo.users || ["@john"]
        }));
        setItems(enriched);
      })
      .catch(err => console.log(err));
  };

  const addItem = async () => {
    const data = await fetch(API_BASE + "/new", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: input,
        completed: false,
        description,
        tags: tag ? [tag] : [],
        priority,
        users: mention ? [mention] : [],
        notes: []
      })
    }).then(res => res.json());

    await GetTodos();
    setInput('');
    setDescription('');
    setPriority('Medium');
    setTag('');
    setMention('');
  };

  const handleTodoClick = (todo) => setSelectedTodo(todo);

  const addNote = () => {
    const updated = items.map(todo => {
      if (todo._id === selectedTodo._id) {
        return {
          ...todo,
          notes: [...todo.notes, noteInput]
        };
      }
      return todo;
    });
    setItems(updated);
    setNoteInput("");
  };

  const filterAndSort = () => {
    let filtered = [...items];

    if (filter !== "All") {
      filtered = filtered.filter(todo =>
        todo.priority === filter || todo.tags.includes(filter) || todo.users.includes(filter)
      );
    }

    if (sortBy === "Priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      filtered.sort((a, b) => order[a.priority] - order[b.priority]);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  };

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  return (
    <div className="container">
      <div className="heading">
        <h1>TO-DO-APP</h1>
      </div>

      <div className="form">
        <input type='text' placeholder="Title" value={input} onChange={handleChange} />
        <input type='text' placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type='text' placeholder="Tag (e.g., work)" value={tag} onChange={(e) => setTag(e.target.value)} />
        <input type='text' placeholder="@Mention" value={mention} onChange={(e) => setMention(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button onClick={addItem}><span>ADD</span></button>
      </div>

      <div className="filters">
        <label>Filter:</label>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
          <option>work</option>
          <option>@john</option>
        </select>

        <label>Sort By:</label>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option>Date</option>
          <option>Priority</option>
        </select>
      </div>

      <div className="todolist">
        {filterAndSort().map((item) => {
          const { _id, name, completed } = item;
          return (
            <div onClick={() => handleTodoClick(item)} key={_id}>
              <TodoItem name={name} id={_id} completed={completed} setItems={setItems} />
              <div className="todo-info">
                <small>{item.priority}</small> | <small>{item.tags.join(', ')}</small> | <small>{item.users.join(', ')}</small>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button onClick={() => setPage(i + 1)} key={i}>{i + 1}</button>
        ))}
      </div>

      {selectedTodo && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedTodo.name}</h2>
            <p><strong>Description:</strong> {selectedTodo.description}</p>
            <p><strong>Priority:</strong> {selectedTodo.priority}</p>
            <p><strong>Tags:</strong> {selectedTodo.tags.join(', ')}</p>
            <p><strong>Users:</strong> {selectedTodo.users.join(', ')}</p>

            <div>
              <h3>Notes</h3>
              <ul>
                {selectedTodo.notes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
              <input
                type="text"
                placeholder="Add note"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
              />
              <button onClick={addNote}>Add Note</button>
            </div>
            <button onClick={() => setSelectedTodo(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
