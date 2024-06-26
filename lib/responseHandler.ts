import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

interface SuccessResponse<T> {
  response: "success";
  message: string;
  data: T;
}

interface ErrorResponse {
  response: "error";
  message: string;
}

// Handle message when success
export const handleSuccess = <T>(data: T, message = "", status = 200) => {
  return NextResponse.json<SuccessResponse<T>>(
    {
      response: "success",
      message: `${message} successful`,
      data,
    },
    { status }
  );
};

// Handle message when catch error
export const handleError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json<ErrorResponse>(
          {
            response: "error",
            message:
              "A todo with this text already exists. Please input new text",
          },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json<ErrorResponse>(
          {
            response: "error",
            message: "Todo not foundssss",
          },
          { status: 404 }
        );
      default:
        return NextResponse.json<ErrorResponse>(
          { response: "error", message: "Database error" },
          { status: 500 }
        );
    }
  }
  return NextResponse.json<ErrorResponse>(
    { response: "error", message: "Internal server error" },
    { status: 500 }
  );
};

// Handle message when valieation by query
export const handleValidationError = (message: string, status = 400) => {
  return NextResponse.json<ErrorResponse>(
    {
      response: "error",
      message,
    },
    { status }
  );
};
