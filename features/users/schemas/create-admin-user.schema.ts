import { z } from "zod/v3"

export const createAdminUserSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
})

export type CreateAdminUserFormValues = z.infer<typeof createAdminUserSchema>

export const createAdminUserFormDefaults: CreateAdminUserFormValues = {
  full_name: "",
  email: "",
  phone: "",
  role: "",
}

export const adminRoleOptions = [
  { value: "Loan Manager", label: "Loan Manager" },
  { value: "admin", label: "Admin" },
  { value: "Customer Support", label: "Customer Support" },
  { value: "Credit Officer", label: "Credit Officer" },
] as const
