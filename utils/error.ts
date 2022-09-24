export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
}

export const reportError = (error : any) => {
  console.log(error);
}