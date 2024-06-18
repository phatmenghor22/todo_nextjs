import axiosInstance from "@/lib/axios";
import handleAxiosError from "@/lib/handleAxios";
import axios, { AxiosError, AxiosResponse } from "axios";

export const getAllTodoService = async () => {
  try {
    const response = await axiosInstance.get("/api/todo");
    return response.data.data;
  } catch (error) {
    return [];
  }
};

type createTodo = {
  todo: string;
};
export const createTodoItemService = async ({ todo = "" }: createTodo) => {
  try {
    const body = { todo };
    const response = await axiosInstance.post("/api/todo", body);
    console.log("### ===response", response);
    return response.status === 200;
  } catch (error: any) {
    console.log(" ### ====error", error);
    return Error(handleAxiosError(error));
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
    if (!id || (!isCompleted && !todo)) {
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
    return response.status === 200;
  } catch (error: any) {
    return Error(handleAxiosError(error));
  }
};

type deleteTodo = {
  id: number;
};

export const deleteTodoItemService = async ({ id }: deleteTodo) => {
  try {
    const response = await axiosInstance.delete(`/api/todo/${id}`);
    return response.status === 200;
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
    return response.data.data;
  } catch (error) {
    return [];
  }
};
