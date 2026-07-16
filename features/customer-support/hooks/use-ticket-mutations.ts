"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { ticketKeys } from "@/features/customer-support/api/keys"
import { ticketMutations } from "@/features/customer-support/api/mutations"
import type {
  AddTicketCommentInput,
  AssignTicketInput,
  CreateTicketInput,
  UpdateTicketStatusInput,
} from "@/features/customer-support/types"
import { toast } from "@/lib/toast"

export function useCreateTicket() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...ticketMutations.create,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      void queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      toast.success("Ticket created successfully")
    },
    onError: () => {
      toast.error("Failed to create ticket. Please try again.")
    },
  })

  return {
    createTicket: (input: CreateTicketInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...ticketMutations.updateStatus,
    onSuccess: (result, { ticketId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(ticketKeys.detail(ticketId), result.data)
      }

      void queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      toast.success("Ticket status updated")
    },
    onError: () => {
      toast.error("Failed to update ticket status")
    },
  })

  return {
    updateStatus: (input: UpdateTicketStatusInput) =>
      mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useAssignTicket() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...ticketMutations.assign,
    onSuccess: (result, { ticketId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(ticketKeys.detail(ticketId), result.data)
      }

      void queryClient.invalidateQueries({ queryKey: ticketKeys.all })
      toast.success("Ticket reassigned")
    },
    onError: () => {
      toast.error("Failed to reassign ticket")
    },
  })

  return {
    assignTicket: (input: AssignTicketInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}

export function useAddTicketComment() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    ...ticketMutations.addComment,
    onSuccess: (result, { ticketId }) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }

      if (result.data) {
        queryClient.setQueryData(ticketKeys.detail(ticketId), result.data)
      } else {
        void queryClient.invalidateQueries({
          queryKey: ticketKeys.detail(ticketId),
        })
      }

      toast.success("Comment added")
    },
    onError: () => {
      toast.error("Failed to add comment")
    },
  })

  return {
    addComment: (input: AddTicketCommentInput) => mutation.mutateAsync(input),
    isPending: mutation.isPending,
  }
}
