import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handleError,
  handleSuccess,
  handleValidationError,
} from "@/lib/responseHandler";

/* api/todo/${ID} METHOD POT for update TODO by ID */
export async function PUT(
  request: NextRequest,
  { params }: { params: { tid: string } }
) {
  try {
    const { tid } = params;
    const body = await request.json();

    if (!tid || isNaN(parseInt(tid))) {
      return handleValidationError("Valid todo ID is required");
    }

    if (!body) {
      return handleValidationError("Request body is required");
    }

    Object.keys(body).forEach((key) => {
      if (typeof body[key] === "string") {
        body[key] = body[key].trim();
      }
    });

    const updatedTodo = await prisma.todo.update({
      data: body,
      where: { id: parseInt(tid) },
    });
    return handleSuccess(updatedTodo, `Updated todo ${tid}`);
  } catch (error) {
    return handleError(error);
  }
}

/* api/todo/${ID} METHOD GET for get TODO by ID */
export async function GET(
  request: NextRequest,
  { params }: { params: { tid: string } }
) {
  try {
    const { tid } = params;

    if (!tid || isNaN(parseInt(tid))) {
      return handleValidationError("Valid todo ID is required");
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(tid),
      },
    });

    if (!todo) {
      return handleValidationError("Todo not found", 404);
    }
    return handleSuccess(todo, `Get todo ${tid}`);
  } catch (error) {
    return handleError(error);
  }
}

/* api/todo/${ID} METHOD DELETE for delete TODO by ID in DB*/
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tid: string } }
) {
  try {
    const { tid } = params;

    if (!tid || isNaN(parseInt(tid))) {
      return handleValidationError("Valid todo ID is required");
    }

    const deletedTodo = await prisma.todo.delete({
      where: { id: parseInt(tid) },
    });

    return handleSuccess(deletedTodo, `Deleted todo ${tid}`);
  } catch (error) {
    return handleError(error);
  }
}
