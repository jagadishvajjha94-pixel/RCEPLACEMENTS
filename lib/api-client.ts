// Frontend API client utilities

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    // If the body is a FormData instance, don't set a Content-Type header
    // so the browser can add the correct multipart boundary.
    const isFormData = options.body instanceof FormData

    const defaultHeaders: Record<string, string> = isFormData
      ? {}
      : { "Content-Type": "application/json" }

    const response = await fetch(endpoint, {
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "API request failed")
    }

    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export const studentAPI = {
  getAll: () => apiCall("/api/students"),
  getById: (id: string) => apiCall(`/api/students/${id}`),
  create: (data: any) => apiCall("/api/students", { method: "POST", body: JSON.stringify(data) }),
}

export const driveAPI = {
  getAll: () => apiCall("/api/drives"),
  getById: (id: string) => apiCall(`/api/drives/${id}`),
  create: (data: any) => apiCall("/api/drives", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/api/drives/${id}`, { method: "PUT", body: JSON.stringify(data) }),
}

export const applicationAPI = {
  get: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters)
    return apiCall(`/api/applications?${params.toString()}`)
  },
  create: (studentId: string, driveId: string) =>
    apiCall("/api/applications", {
      method: "POST",
      body: JSON.stringify({ studentId, driveId }),
    }),
}

export const analyticsAPI = {
  get: () => apiCall("/api/analytics"),
}

export const uploadAPI = {
  file: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return apiCall("/api/upload", {
      method: "POST",
      body: formData,
      headers: {},
    })
  },
}
