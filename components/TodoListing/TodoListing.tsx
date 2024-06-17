import React from "react";
import { FiLoader, FiAlertCircle } from "react-icons/fi"; // Import icons as needed
import TodoInput from "../TextInput/TodoInput";

interface Todo {
  id: number;
  todo: string;
  isCompleted: boolean;
}

interface TodosListProps {
  loading: boolean;
  isEmptyListTodos: boolean;
  todosData: Todo[];
  editModeTodoId: number | null;
  hoveredTodoId: number | null;
  editTodoText: string;
  isVisible: boolean;
  setHoveredTodoId: (id: number | null) => void;
  handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditInputKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    todo: string
  ) => void;
  setEditModeTodoId: (id: number | null) => void;
  setEditTodoText: (text: string) => void;
  toggleTodoCompletion: (id: number, isCompleted: boolean) => void;
  removeTodo: (id: number) => void;
}

const TodosList: React.FC<TodosListProps> = ({
  loading,
  isEmptyListTodos,
  todosData,
  editModeTodoId,
  hoveredTodoId,
  editTodoText,
  isVisible,
  setHoveredTodoId,
  handleEditInputChange,
  handleEditInputKeyDown,
  setEditModeTodoId,
  setEditTodoText,
  toggleTodoCompletion,
  removeTodo,
}) => {
  return (
    <div className={`${isVisible ? "block" : "hidden"}`}>
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <FiLoader className="animate-spin h-8 w-8 mr-3 text-gray-500" />
          <span>Loading...</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {isEmptyListTodos ? (
            <li className="flex items-center justify-center py-4">
              <div className="flex flex-col items-center">
                <FiAlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No todos found.</p>
              </div>
            </li>
          ) : (
            todosData.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between py-2 border-b border-gray-200"
                onMouseEnter={() => setHoveredTodoId(todo.id)}
                onMouseLeave={() => setHoveredTodoId(null)}
              >
                {editModeTodoId === todo.id ? (
                  <TodoInput
                    handleEnterInput={(e) =>
                      handleEditInputKeyDown(e, todo.id, todo.todo)
                    }
                    handleInputChange={handleEditInputChange}
                    value={editTodoText}
                    placeholder="Enter new todo"
                  />
                ) : (
                  <span
                    className={`flex-grow ${
                      todo.isCompleted ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.todo}
                  </span>
                )}

                <div
                  className={`flex space-x-2 ml-4 ${
                    hoveredTodoId === todo.id ? "visible" : "invisible"
                  }`}
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() =>
                        toggleTodoCompletion(todo.id, todo.isCompleted)
                      }
                      className="form-checkbox h-5 w-5 text-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {todo.isCompleted
                        ? "Mark as Incomplete"
                        : "Mark as Complete"}
                    </span>
                  </label>

                  <button
                    onClick={() => {
                      setEditModeTodoId(todo.id);
                      setEditTodoText(todo.todo);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md focus:outline-none hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md focus:outline-none hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default TodosList;
