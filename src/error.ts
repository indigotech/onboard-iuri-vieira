import { ApolloError } from "apollo-server";

export class CustomError extends Error {
  code: number;
  name: string;
  additionalInfo?: string;

  constructor(code: number, message: string, additionalInfo?: string) {
    super(message);
    this.code = code;
    this.additionalInfo = additionalInfo;
    this.name = "CustomError";
  }
}

export function formatError(error: ApolloError) {
  const originalError = error.originalError as CustomError;

  if (originalError?.name === "CustomError") {
    return {
      code: originalError.code,
      message: originalError.message,
      additionalInfo: originalError.additionalInfo,
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
