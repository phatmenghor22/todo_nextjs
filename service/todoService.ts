import axiosInstance from "@/lib/axios";
import axios, { AxiosError, AxiosResponse } from "axios";

export const getAllTodoService = async () => {
  try {
    const response = await axiosInstance.get("/api/todo");
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const createTodoItemService = async ({ todo = "" }) => {
  try {
    const body = { todo };
    const response = await axiosInstance.post("/api/todo", body);
    if (response.status === 200) {
      return true;
    }
  } catch (error: any) {
    if (error.response) {
      return error.response.data.message ?? "Server Error";
    }
  }
};

type editTodo = {
  id: number;
  isCompleted?: boolean;
  todo?: string;
};

export const editTodoItemService = async ({
  id,
  isCompleted,
  todo,
}: editTodo) => {
  try {
    if (typeof isCompleted === "undefined" && typeof todo === "undefined") {
      console.log("Both isCompleted and todo are missing");
      return false;
    }
    const body: Partial<editTodo> = {};
    if (typeof todo !== "undefined") {
      body.todo = todo;
    }
    if (typeof isCompleted !== "undefined") {
      body.isCompleted = isCompleted;
    }
    const response = await axiosInstance.put(`/api/todo/${id}`, body);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

type deleteTodo = {
  id: number;
};

export const deleteTodoItemService = async ({ id }: deleteTodo) => {
  try {
    const response = await axiosInstance.delete(`/api/todo/${id}`);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

type filterTodo = {
  search: string;
};

export const filterTodoService = async ({ search = "" }: filterTodo) => {
  try {
    const response = await axiosInstance.get(`/api/todo?search=${search}`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};
