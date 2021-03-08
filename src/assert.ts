interface IError extends Error {
  code?: string;
}

export default function assert(v: any, code: string, message: string): void {
  if (v) return;
  const err: IError = new Error(message);
  err.code = code;
  throw err;
}
