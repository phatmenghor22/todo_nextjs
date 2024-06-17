"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { FiSearch, FiXCircle, FiAlertCircle, FiLoader } from "react-icons/fi"; // Import icons from React Icons
import {
  createTodoItemService,
  deleteTodoItemService,
  editTodoItemService,
  filterTodoService,
  getAllTodoService,
} from "@/service/todoService";
import debounce from "lodash/debounce";

type TodoModel = {
  id: number;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
};

const Home: React.FC = () => {
  const [todosData, setTodosData] = useState<TodoModel[]>([]);
  const [todosFilter, setTodosFilter] = useState<TodoModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // State for hovered todo item
  const [hoveredTodoId, setHoveredTodoId] = useState<number | null>(null);
  // State for edit mode todo item
  const [editModeTodoId, setEditModeTodoId] = useState<number | null>(null);
  // State for edited todo text
  const [editTodoText, setEditTodoText] = useState<string>("");
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  // Add Todo
  const addTodo = () => {
    if (newTodoText.trim() === "") {
      alert("Todo cannot be empty");
      return;
    }
    setNewTodoText("");
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(event.target.value);
  };

  // Handle filter change
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    debouncedFetchResults(event.target.value);
  };

  const debouncedFetchResults = useMemo(
    () => debounce((value: string) => fetchResults(value), 1000),
    []
  );

  const fetchResults = async (value: string) => {
    if (value.trim()) {
      setLoading(true);
      const resposne = await filterTodoService({ search: value });
      setTodosFilter(resposne);
      setLoading(false);
    } else {
      setTodosFilter([]);
    }
  };

  // Handle form submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo();
  };

  // Remove Todo
  const removeTodo = async (id: number) => {
    setLoading(true);
    const response = await deleteTodoItemService({ id });
    console.log("### ===response", response);
    if (response) {
      const response = await getAllTodoService();
      setTodosData(response);
    }
    setLoading(false);
  };

  // Toggle completion of Todo
  const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
    setLoading(true);
    const res = await editTodoItemService({
      id,
      isCompleted: !isCompleted,
    });
    if (res && filterText.length === 0) {
      const response = await getAllTodoService();
      setTodosData(response);
    } else if (res && filterText.length > 0) {
      const resposne = await filterTodoService({ search: filterText });
      setTodosFilter(resposne);
    }
    setLoading(false);
  };

  // Handle edit input change
  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditTodoText(event.target.value);
  };

  // Handle enter key press in edit input
  const handleEditInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number,
    currentText: string
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (editTodoText.trim() !== "") {
        setLoading(true);
        const res = await editTodoItemService({
          id,
          todo: editTodoText,
        });
        if (res && filterText.length === 0) {
          const response = await getAllTodoService();
          setTodosData(response);
        } else if (res && filterText.length > 0) {
          const resposne = await filterTodoService({ search: filterText });
          setTodosFilter(resposne);
        }
        setEditModeTodoId(null);
        setLoading(false);
      } else {
        alert("Todo text cannot be empty");
      }
    }
  };

  // Handle enter key press add input
  const handleEnterInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (newTodoText.trim() !== "") {
        addNewTodo(newTodoText);
      } else {
        alert("Todo text cannot be empty");
      }
    }
  };

  // Handle enter key press filter
  const handleEnterFilter = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (filterText.trim() !== "") {
        setLoading(true);
        const resposne = await filterTodoService({ search: filterText });
        setTodosFilter(resposne);
        setLoading(false);
      } else {
        alert("Todo text cannot be empty");
      }
    }
  };

  const addNewTodo = async (value: string) => {
    setLoading(true);
    const response = await createTodoItemService({ todo: value });
    if (response) {
      const response = await getAllTodoService();
      setTodosData(response);
    }
    setLoading(false);
  };

  // Clear filter text
  const clearFilterText = () => {
    setFilterText("");
  };

  // Check if todos are empty
  const isEmptyListTodos = todosData.length === 0 && !loading;
  const isEmptyFilterTodos = todosFilter.length === 0 && !loading;

  const fetchData = async () => {
    setLoading(true);
    const response = await getAllTodoService();
    setTodosData(response);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Head>
        <title>Todo List App</title>
        <meta
          name="description"
          content="A simple todo list app built with Next.js and Tailwind CSS"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 onClick={fetchData} className="text-3xl font-bold mb-4">
          Todo List
        </h1>

        {/* Form to add new todo */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center rounded-md mb-4"
        >
          <input
            type="text"
            value={newTodoText}
            onChange={handleInputChange}
            placeholder="Enter new todo"
            onKeyDown={(e) => handleEnterInput(e)}
            className="px-4 border border-gray-300 rounded-md focus:outline-none h-10 flex-grow"
          />
          <button
            type="submit"
            onClick={() => addNewTodo(newTodoText)}
            className="px-4 ml-2 bg-blue-500 text-white rounded-md focus:outline-none h-10"
          >
            Add Todo
          </button>
        </form>

        {/* Input for filtering todos */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Search todos..."
            onKeyDown={(e) => handleEnterFilter(e)}
            className="pl-10 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none w-full"
          />
          {filterText && (
            <button
              className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-200 hover:bg-gray-300 rounded-md"
              onClick={clearFilterText}
            >
              <FiXCircle className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Display todos */}
        <div className={`${filterText.length > 0 ? "hidden" : "block"}`}>
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
                    {/* Editable input field */}
                    {editModeTodoId === todo.id ? (
                      <input
                        type="text"
                        value={editTodoText}
                        onChange={handleEditInputChange}
                        onKeyDown={(e) =>
                          handleEditInputKeyDown(e, todo.id, todo.todo)
                        }
                        onBlur={() => setEditModeTodoId(null)}
                        className="px-4 border border-gray-300 rounded-md focus:outline-none h-10 flex-grow"
                      />
                    ) : (
                      // Display todo text with strikethrough if completed
                      <span
                        className={`flex-grow ${
                          todo.isCompleted ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.todo}
                      </span>
                    )}
                    {/* Buttons for actions */}
                    <div
                      className={`flex space-x-2 ml-4 ${
                        hoveredTodoId === todo.id ? "visible" : "invisible"
                      }`}
                    >
                      {/* Checkbox for completion */}
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
                      {/* Edit button */}
                      <button
                        onClick={() => {
                          setEditModeTodoId(todo.id);
                          setEditTodoText(todo.todo);
                        }}
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md focus:outline-none hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      {/* Remove button */}
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

        <div className={`${filterText.length === 0 ? "hidden" : "block"}`}>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <FiLoader className="animate-spin h-8 w-8 mr-3 text-gray-500" />
              <span>Loading...</span>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {isEmptyFilterTodos ? (
                <li className="flex items-center justify-center py-4">
                  <div className="flex flex-col items-center">
                    <FiAlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500 text-sm">
                      No result. Create a new one instead!.
                    </p>
                  </div>
                </li>
              ) : (
                todosFilter.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between py-2 border-b border-gray-200"
                    onMouseEnter={() => setHoveredTodoId(todo.id)}
                    onMouseLeave={() => setHoveredTodoId(null)}
                  >
                    {/* Editable input field */}
                    {editModeTodoId === todo.id ? (
                      <input
                        type="text"
                        value={editTodoText}
                        onChange={handleEditInputChange}
                        onKeyDown={(e) =>
                          handleEditInputKeyDown(e, todo.id, todo.todo)
                        }
                        onBlur={() => setEditModeTodoId(null)}
                        className="px-4 border border-gray-300 rounded-md focus:outline-none h-10 flex-grow"
                      />
                    ) : (
                      // Display todo text with strikethrough if completed
                      <span
                        className={`flex-grow ${
                          todo.isCompleted ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.todo}
                      </span>
                    )}
                    {/* Buttons for actions */}
                    <div
                      className={`flex space-x-2 ml-4 ${
                        hoveredTodoId === todo.id ? "visible" : "invisible"
                      }`}
                    >
                      {/* Checkbox for completion */}
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
                      {/* Edit button */}
                      <button
                        onClick={() => {
                          setEditModeTodoId(todo.id);
                          setEditTodoText(todo.todo);
                        }}
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md focus:outline-none hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      {/* Remove button */}
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
      </div>
    </div>
  );
};

export default Home;
