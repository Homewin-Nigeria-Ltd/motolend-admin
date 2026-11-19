"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { smsKeys } from "@/features/sms/api/keys"
import { smsMutations } from "@/features/sms/api/mutations"
import type { SendRecoverySmsInput } from "@/features/sms/types"
import { toast } from "@/lib/toast"

export function useSendRecoverySms() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...smsMutations.send,
    onSuccess: (result) => {
      const recipients = result.total_recipients ?? 0
      toast.success(
        `SMS queued for ${recipients.toLocaleString("en-US")} recipient${recipients === 1 ? "" : "s"}`,
      )
      void queryClient.invalidateQueries({ queryKey: smsKeys.overview() })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to send recovery SMS",
      )
    },
  })

  return {
    sendRecoverySms: (input: SendRecoverySmsInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
    pendingStage:
      mutation.isPending && mutation.variables
        ? mutation.variables.stage
        : null,
  }
}
