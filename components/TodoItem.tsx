// src/components/TodoList.tsx

import React, { useState } from "react";

type Todo = {
  id: number;
  text: string;
  isCompleted: boolean;
};

type TodoListProps = {
  todos: Todo[];
};

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.isCompleted;
    if (filter === "pending") return !todo.isCompleted;
    return true;
  });

  const handleFilterChange = (newFilter: "all" | "completed" | "pending") => {
    setFilter(newFilter);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md focus:outline-none ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-md focus:outline-none ${
            filter === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleFilterChange("completed")}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded-md focus:outline-none ${
            filter === "pending"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleFilterChange("pending")}
        >
          Pending
        </button>
      </div>
      <table className="w-full border-collapse border-2 border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">Todo</th>
            <th className="border border-gray-200 px-4 py-2 text-left">
              Completed
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map((todo) => (
            <tr key={todo.id} className="border border-gray-200">
              <td className="border border-gray-200 px-4 py-2">{todo.text}</td>
              <td className="border border-gray-200 px-4 py-2">
                {todo.isCompleted ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
