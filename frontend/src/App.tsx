import { useEffect, useState } from "react";
import {
  type Todo,
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./api";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const todo = await createTodo(trimmed);
    setTodos((prev) => [...prev, todo]);
    setInput("");
  }

  async function handleToggle(todo: Todo) {
    const updated = await updateTodo(todo.id, {
      completed: !todo.completed,
    });
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function handleDelete(id: string) {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">TODO App</h1>

        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No todos yet</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
