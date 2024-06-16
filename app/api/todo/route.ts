import { NextResponse, NextRequest } from "next/server";
import { Prisma, prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { todo } = body;

  if (!todo) {
    return NextResponse.json(
      {
        error: "todo are required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const newTodo = await prisma.todo.create({
      data: {
        todo,
        isCompleted: false,
      },
    });

    return NextResponse.json({
      response: "success",
      data: newTodo,
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            response: "error",
            message: "A todo with this title already exists",
          },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const todo = await prisma.todo.findMany({ orderBy: { id: "asc" } });

  return NextResponse.json(
    {
      response: "success",
      data: todo,
    },
    { status: 200 }
  );
}
