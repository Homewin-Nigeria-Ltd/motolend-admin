import { createAdminUserAction } from "@/features/users/actions/create-admin-user.action"
import type { CreateAdminUserInput } from "@/features/users/types"

export const userMutations = {
  createAdmin: {
    mutationFn: (input: CreateAdminUserInput) => createAdminUserAction(input),
  },
}
