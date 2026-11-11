import { api } from "@/lib/api/client"
import { createAdminUserAction } from "@/features/users/actions/create-admin-user.action"
import { userEndpoints } from "@/features/users/api/endpoints"
import type {
  CreateAdminUserInput,
  UpdateUserStatusInput,
} from "@/features/users/types"

export const userMutations = {
  createAdmin: {
    mutationFn: (input: CreateAdminUserInput) => createAdminUserAction(input),
  },
  updateStatus: {
    mutationFn: ({ id, status }: UpdateUserStatusInput) =>
      api.patch(userEndpoints.status(id), { status }),
  },
}
