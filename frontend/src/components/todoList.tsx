import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface Todo {
  _id: string;
  title: string;
  description: string;
}

export const TodoList: React.FC = () => {
  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    Load();
  }, []);

  async function Load() {
    try {
      const result = await axios.get<{ success: boolean; data: Todo[] }>(
        "http://localhost:8080"
      );
      setTodos(result.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function save(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8080/create", {
        title: title,
        description: description,
      });
      alert("Todo item added Successfully");
      setId("");
      setTitle("");
      setDescription("");
      Load();
    } catch (err) {
      alert(err);
    }
  }

  async function editTodo(todo: Todo) {
    setTitle(todo.title);
    setDescription(todo.description);
    setId(todo._id);
  }

  async function deleteTodo(todoId: string) {
    await axios.delete(`http://localhost:8080/delete/${todoId}`);
    alert("Todo item deleted Successfully");
    setId("");
    setTitle("");
    setDescription("");
    Load();
  }

  async function update(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    try {
      const todoItemUpdate = todos.find((u) => u._id === id);
      if (todoItemUpdate) {
        await axios.put(`http://localhost:8080/update/${todoItemUpdate._id}`, {
          title: title,
          description: description,
        });
        alert("Todo Item Updated");
        setId("");
        setTitle("");
        setDescription("");
        Load();
      }
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="App">
      <h1>My Todos</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title:</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the title of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the description of your To Do?"
            />
          </div>
          <div>
            <div className="todo-input-button">
              <button className="primary-btn" type="button" onClick={save}>
                Add
              </button>
              <button className="primary-btn" type="button" onClick={update}>
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="todo-list">
          <div>
            <h3>Todos</h3>
          </div>
          {todos.map((todo) => (
            <div className="todo-list-item" key={todo._id}>
              <div>
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
              </div>
              <div>
                <FontAwesomeIcon
                  className="check-icon"
                  icon={faPenToSquare}
                  onClick={() => editTodo(todo)}
                />
                <FontAwesomeIcon
                  className="delete-icon"
                  icon={faTrash}
                  onClick={() => deleteTodo(todo._id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
