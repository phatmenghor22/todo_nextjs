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
  title: string;
  titleEmthy: string;
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
  removeTodo: (id: number, todo: string) => void;
  clearInput: () => void;
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
  title,
  clearInput,
  titleEmthy,
}) => {
  return (
    <div className={`${isVisible ? "block" : "hidden"}`}>
      <h2 className="text-xl font-bold mb-2 mt-8 underline text-blue-800">
        {title}
      </h2>
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
                <p className="text-gray-500 text-sm">{titleEmthy}</p>
              </div>
            </li>
          ) : (
            todosData.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-gray-200"
                onMouseEnter={() => setHoveredTodoId(item.id)}
                onMouseLeave={() => setHoveredTodoId(null)}
              >
                {editModeTodoId === item.id ? (
                  <TodoInput
                    clearInput={clearInput}
                    handleEnterInput={(e) =>
                      handleEditInputKeyDown(e, item.id, item.todo)
                    }
                    handleInputChange={handleEditInputChange}
                    value={editTodoText}
                    placeholder="Enter new todo"
                  />
                ) : (
                  <span
                    className={`flex-grow ${
                      item.isCompleted ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {`${index + 1}. ${item.todo}`}
                  </span>
                )}

                <div
                  className={`flex space-x-2 ml-4 ${
                    hoveredTodoId === item.id ? "visible" : "invisible"
                  }`}
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={() =>
                        toggleTodoCompletion(item.id, item.isCompleted)
                      }
                      className="form-checkbox h-5 w-5 text-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {item.isCompleted
                        ? "Mark as Incomplete"
                        : "Mark as Complete"}
                    </span>
                  </label>

                  <button
                    onClick={() => {
                      setEditModeTodoId(item.id);
                      setEditTodoText(item.todo);
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded-md focus:outline-none hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeTodo(item.id, item.todo)}
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
