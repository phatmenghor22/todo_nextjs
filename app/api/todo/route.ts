import { NextResponse, NextRequest } from "next/server";
import { Prisma, prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { todo } = body;

  if (!todo) {
    return NextResponse.json(
      {
        response: "error",
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
      { response: "error", error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("search");
  let whereClause = {};

  if (searchTerm) {
    whereClause = {
      todo: {
        contains: searchTerm, // Case-insensitive search
        mode: "insensitive", // Optional: Explicitly set case-insensitive mode
      },
    };
  }
  const todos = await prisma.todo.findMany({
    where: whereClause,
    orderBy: { id: "asc" },
  });

  return NextResponse.json(
    {
      response: "success",
      data: todos,
    },
    { status: 200 }
  );
}
