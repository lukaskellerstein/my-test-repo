const API = "http://localhost:8000";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${API}/todos`);
  return res.json();
}

export async function createTodo(title: string): Promise<Todo> {
  const res = await fetch(`${API}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function updateTodo(
  id: string,
  data: { title?: string; completed?: boolean }
): Promise<Todo> {
  const res = await fetch(`${API}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  await fetch(`${API}/todos/${id}`, { method: "DELETE" });
}
