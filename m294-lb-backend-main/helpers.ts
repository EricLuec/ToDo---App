
export function parseId (id: any): number | undefined {
  return parseInt(new String(id).toString())
}

export function error (code?: number, message?: string) {
  code = code ?? 400
  return {
    statusCode: code,
    error: { 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found' }[code] ?? 'Bad Request',
    message
  }
}
