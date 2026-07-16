"use server"

import { userEndpoints } from "@/features/users/api/endpoints"
import type {
  ApiAdminUser,
  CreateAdminUserInput,
  UserActionResult,
} from "@/features/users/types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

export async function createAdminUserAction(
  input: CreateAdminUserInput,
): Promise<UserActionResult<ApiAdminUser>> {
  try {
    const data = await apiServer.post<ApiAdminUser>(userEndpoints.create, {
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
      role: input.role,
    })

    return { success: true, data }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to create admin user",
      }
    }

    throw error
  }
}
