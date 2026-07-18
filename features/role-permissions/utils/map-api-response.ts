export function unwrapApiList<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response
  }

  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: unknown }).data

    if (Array.isArray(data)) {
      return data as T[]
    }
  }

  return []
}

export function unwrapApiItem<T>(response: unknown): T {
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: unknown }).data

    if (data !== undefined && data !== null) {
      return data as T
    }
  }

  return response as T
}
