import { useRouter } from "next/router";
import { NextResponse, NextRequest } from "next/server";
import { Prisma, prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { tid: string } }
) {
  const { tid } = params;
  const body = await request.json();

  if (!tid) {
    return NextResponse.json(
      {
        response: "success",
        message: "todo ID is required",
      },
      { status: 400 }
    );
  }

  if (!body) {
    return NextResponse.json(
      {
        error: "body are required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const newTodo = await prisma.todo.update({
      data: body,
      where: { id: parseInt(tid) },
    });

    return NextResponse.json({
      response: "success",
      data: newTodo,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { tid: string } }
) {
  const { tid } = params;

  if (!tid) {
    return NextResponse.json(
      {
        response: "success",
        message: "User ID is required",
      },
      { status: 400 }
    );
  }

  const todo = await prisma.todo.findUnique({
    where: {
      id: parseInt(tid),
    },
  });

  return NextResponse.json(
    {
      response: "success",
      data: todo,
    },
    { status: 200 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tid: string } }
) {
  const { tid } = params;

  if (!tid) {
    return NextResponse.json(
      {
        response: "success",
        message: "todo ID is required",
      },
      { status: 400 }
    );
  }

  try {
    const newTodo = await prisma.todo.delete({
      where: { id: parseInt(tid) },
    });

    return NextResponse.json({
      response: "success",
      data: newTodo,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            message: "Cannot delete todo due to related records",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
