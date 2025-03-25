export const API_BASE_URL = 'http://localhost:3000/api'

export type ApiResponse<T> = {
    data?: T
    error?: string
}

export type RequestConfig = {
    headers?: Record<string, string>
    params?: Record<string, string>
} 