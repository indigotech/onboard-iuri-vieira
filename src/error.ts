import { ApolloError } from "apollo-server";

export class CustomError extends Error {
  code: number;
  name: string;
  additionalInfo?: string;

  constructor(code: number, message: string, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;

    Object.defineProperty(this, "name", { value: "CustomError" });
  }
}

export function formatError(error: ApolloError) {
  if (error.originalError?.name === "CustomError") {
    return {
      code: error.code,
      message: error.message,
      additionalInfo: error.additionalInfo,
      ...error,
    };
  } else {
    return {
      message: "Unexpected error",
      additionalInfo: error.message,
      ...error,
    };
  }
}
