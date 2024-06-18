import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handleError,
  handleSuccess,
  handleValidationError,
} from "@/lib/responseHandler";

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

    const updatedTodo = await prisma.todo.update({
      data: body,
      where: { id: parseInt(tid) },
    });
    return handleSuccess(updatedTodo, `Updated todo ${tid}`);
  } catch (error) {
    return handleError(error);
  }
}

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
