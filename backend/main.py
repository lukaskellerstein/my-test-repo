from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="TODO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoCreate(BaseModel):
    title: str


class TodoUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None


class Todo(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex[:8])
    title: str
    completed: bool = False


# In-memory store
todos: dict[str, Todo] = {}


@app.get("/todos", response_model=list[Todo])
def list_todos():
    return list(todos.values())


@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(body: TodoCreate):
    todo = Todo(title=body.title)
    todos[todo.id] = todo
    return todo


@app.patch("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: str, body: TodoUpdate):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo = todos[todo_id]
    if body.title is not None:
        todo.title = body.title
    if body.completed is not None:
        todo.completed = body.completed
    return todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: str):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    del todos[todo_id]
