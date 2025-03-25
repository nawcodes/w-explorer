import { API_BASE_URL, type ApiResponse, type RequestConfig } from './api.config'

export class ApiService {
    private static async request<T>(
        method: string,
        endpoint: string,
        data?: any,
        config: RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = new URL(`${API_BASE_URL}${endpoint}`)

            // Add query params if any
            if (config.params) {
                Object.keys(config.params).forEach(key =>
                    url.searchParams.append(key, config.params![key])
                )
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers
                },
                body: data ? JSON.stringify(data) : undefined
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            return { data: result }
        } catch (error) {
            console.error(`API ${method} error:`, error)
            return { error: error instanceof Error ? error.message : 'Unknown error occurred' }
        }
    }

    static async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('GET', endpoint, undefined, config)
    }

    static async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('POST', endpoint, data, config)
    }

    static async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('PUT', endpoint, data, config)
    }

    static async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>('DELETE', endpoint, undefined, config)
    }
} 