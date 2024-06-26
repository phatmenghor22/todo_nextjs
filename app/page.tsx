"use client";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { FiSearch, FiXCircle } from "react-icons/fi";
import {
  createTodoItemService,
  deleteTodoItemService,
  editTodoItemService,
  filterTodoService,
  getAllTodoService,
} from "@/service/todoService";
import debounce from "lodash/debounce";
import TodoInput from "@/components/TextInput/TodoInput";
import TodosList from "@/components/TodoListing/TodoListing";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TodoModel } from "@/typeModel/TodoType";

const Home: React.FC = () => {
  const [todosData, setTodosData] = useState<TodoModel[]>([]);
  const [todosFilter, setTodosFilter] = useState<TodoModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredTodoId, setHoveredTodoId] = useState<number | null>(null);
  const [editModeTodoId, setEditModeTodoId] = useState<number | null>(null);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [editTodoText, setEditTodoText] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");
  const isEmptyListTodos = todosData.length === 0;
  const isEmptyFilterTodos = todosFilter.length === 0;

  useEffect(() => {
    fetchData();
  }, []);

  /* fetch data first */
  const fetchData = async () => {
    setLoading(true);
    const response = await getAllTodoService();
    setTodosData(response);
    setLoading(false);
  };

  // create textInput set onChange
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(event.target.value);
  };

  // filter textInput set onChange
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    debouncedFetchResults(event.target.value);
  };

  /* when edit data set */
  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditTodoText(event.target.value);
  };

  const debouncedFetchResults = useMemo(
    () => debounce((value: string) => fetchResults(value), 500),
    []
  );
  const fetchResults = async (value: string) => {
    setLoading(true);
    if (value.trim() !== "") {
      const resposne = await filterTodoService({ search: value });
      setTodosFilter(resposne);
    } else {
      const response = await getAllTodoService();
      setTodosData(response);
      setTodosFilter([]);
    }
    setLoading(false);
  };

  /* when press delete */
  const removeTodo = async (id: number, todo: string) => {
    setLoading(true);
    const response = await deleteTodoItemService({ id });
    if (response && filterText.length === 0) {
      const data = await getAllTodoService();
      setTodosData(data);
      notifySuccess(`Todo ${todo} deleted successfully!`);
    } else if (response && filterText.length > 0) {
      const data = await filterTodoService({ search: filterText });
      setTodosFilter(data);
      notifySuccess(`Todo ${todo} deleted successfully!`);
    }
    setLoading(false);
  };

  /* when edit tris checkbox data todo */
  const toggleTodoCompletion = async (id: number, isCompleted: boolean) => {
    setLoading(true);
    const response = await editTodoItemService({
      id,
      isCompleted: !isCompleted,
    });

    if (response && filterText.length === 0) {
      const data = await getAllTodoService();
      setTodosData(data);
      notifySuccess(`Todo edit completed successfully!`);
    } else if (response && filterText.length > 0) {
      const data = await filterTodoService({ search: filterText });
      setTodosFilter(data);
      notifySuccess(`Todo edit completed successfully!`);
    }
    setLoading(false);
  };

  /* when edit textInput data todo */
  const handleEditInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (editTodoText.trim() !== "") {
        setLoading(true);
        const response = await editTodoItemService({
          id,
          todo: editTodoText,
        });

        if (response === true && filterText.length === 0) {
          const data = await getAllTodoService();
          setTodosData(data);
          notifySuccess(`Todo edit completed successfully!`);
        } else if (response === true && filterText.length > 0) {
          const data = await filterTodoService({ search: filterText });
          setTodosFilter(data);
          notifySuccess(`Todo edit completed successfully!`);
        } else {
          alert(response);
        }

        setEditModeTodoId(null);
        setLoading(false);
      } else {
        alert("Todo text cannot be empty");
      }
    }
  };

  /* when create new textInput enter */
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

  /* when textInput filter enter */
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

  /* when click btn new TODO */
  const addNewTodo = async (value: string) => {
    if (newTodoText.trim() !== "") {
      setLoading(true);
      const response = await createTodoItemService({ todo: value });
      if (response === true) {
        const response = await getAllTodoService();
        setTodosData(response);
        setNewTodoText("");
        setLoading(false);
        notifySuccess("Todo listing created successfully!");
      } else {
        setLoading(false);
        alert(response);
      }
    } else {
      alert("Todo text cannot be empty");
    }
  };

  const notifySuccess = (title: string) => {
    toast.success(title, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  /* when click btn clear filter */
  const clearFilterText = async () => {
    setLoading(true);
    setFilterText("");
    const response = await getAllTodoService();
    setTodosData(response);
    setTodosFilter([]);
    setLoading(false);
  };

  /* when click btn clear add new */
  const clearInputAddTodo = () => {
    setNewTodoText("");
  };

  /* when clear edit listing */
  const clearInputListing = () => {
    setEditModeTodoId(null);
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
        <h1 className="text-3xl font-bold mb-4 text-blue-800">Todo List</h1>

        {/* textInput for create new Todo */}
        <div className="flex items-center rounded-md mb-4">
          <TodoInput
            clearInput={clearInputAddTodo}
            handleEnterInput={handleEnterInput}
            handleInputChange={handleInputChange}
            value={newTodoText}
            placeholder="Enter new todo"
          />
          <button
            type="submit"
            onClick={() => addNewTodo(newTodoText)}
            className="px-4 ml-2 bg-blue-500 text-white rounded-md focus:outline-none h-10"
          >
            Add Todo
          </button>
        </div>

        {/* textInput for filter data Todo */}
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

        {/* For Listing without filter */}
        <TodosList
          title="Data Listing"
          titleEmthy="No todos found."
          loading={loading}
          isEmptyListTodos={isEmptyListTodos}
          todosData={todosData}
          editModeTodoId={editModeTodoId}
          hoveredTodoId={hoveredTodoId}
          editTodoText={editTodoText}
          isVisible={filterText.length === 0}
          setHoveredTodoId={setHoveredTodoId}
          handleEditInputChange={handleEditInputChange}
          handleEditInputKeyDown={handleEditInputKeyDown}
          setEditModeTodoId={setEditModeTodoId}
          setEditTodoText={setEditTodoText}
          toggleTodoCompletion={toggleTodoCompletion}
          removeTodo={removeTodo}
          clearInput={clearInputListing}
        />

        {/* For Filter show */}
        <TodosList
          title="Data Filter"
          titleEmthy="No result. Create a new one instead!."
          loading={loading}
          isEmptyListTodos={isEmptyFilterTodos}
          todosData={todosFilter}
          editModeTodoId={editModeTodoId}
          hoveredTodoId={hoveredTodoId}
          editTodoText={editTodoText}
          isVisible={filterText.length > 0}
          setHoveredTodoId={setHoveredTodoId}
          handleEditInputChange={handleEditInputChange}
          handleEditInputKeyDown={handleEditInputKeyDown}
          setEditModeTodoId={setEditModeTodoId}
          setEditTodoText={setEditTodoText}
          toggleTodoCompletion={toggleTodoCompletion}
          removeTodo={removeTodo}
          clearInput={clearInputListing}
        />
      </div>
      {/* render toast message */}
      <ToastContainer />
    </div>
  );
};

export default Home;
