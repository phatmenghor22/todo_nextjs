import { NextResponse, NextRequest } from "next/server";
import { Prisma, prisma } from "@/lib/prisma";
import {
  handleError,
  handleSuccess,
  handleValidationError,
} from "@/lib/responseHandler";

/* api/todo METHOD POST for create new TODO */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { todo, isCompleted } = body;

    if (!todo || typeof todo !== "string" || todo.trim().length === 0) {
      return handleValidationError(
        "Todo text is required and must be a non-empty string"
      );
    }

    const newTodo = await prisma.todo.create({
      data: {
        todo,
        isCompleted: typeof isCompleted === "boolean" ? isCompleted : false,
      },
    });
    return handleSuccess(newTodo, "Create todo");
  } catch (error) {
    return handleError(error);
  }
}

/* 
  api/todo METHOD GET for get all TODO 
  api/todo?search=${param} METHOD GET for get all filter TODO 
*/
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("search");
    let whereClause = {};

    if (searchTerm) {
      whereClause = {
        todo: {
          contains: searchTerm,
          mode: "insensitive",
        },
      };
    }
    const todos = await prisma.todo.findMany({
      where: whereClause,
      orderBy: { id: "asc" },
    });

    return handleSuccess(todos, "Get todo");
  } catch (error) {
    return handleError(error);
  }
}
