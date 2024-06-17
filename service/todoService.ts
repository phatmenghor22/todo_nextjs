import axiosInstance from "@/lib/axios";

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
    } else {
      return false;
    }
  } catch (error) {
    console.log("### ====responseerror", error);
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
    const response = await axiosInstance.delete(`/api/todo?search=${search}}`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};
