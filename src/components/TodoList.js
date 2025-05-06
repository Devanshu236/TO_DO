import React, { useState, useEffect } from 'react';
import { getTodos } from '../services/todoService';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await getTodos();
      console.log(getTodos)
      setTodos(response.data);
    };
    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Priority: {todo.priority}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
