"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { settingsKeys } from "@/features/settings/api/keys"
import { settingsMutations } from "@/features/settings/api/mutations"
import type { UpdateCreditCheckSettingInput } from "@/features/settings/types"
import { ApiError } from "@/lib/api/client"
import { toast } from "@/lib/toast"

export function useUpdateCreditCheckSetting() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...settingsMutations.updateCreditCheck,
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: settingsKeys.creditCheck(),
      })
      toast.success(response.message ?? "Credit check setting updated")
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to update credit check setting. Please try again."
      toast.error(message)
    },
  })

  return {
    updateCreditCheckSetting: (input: UpdateCreditCheckSettingInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
