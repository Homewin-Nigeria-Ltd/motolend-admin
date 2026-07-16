import {
  addTicketCommentAction,
  assignTicketAction,
  createTicketAction,
  updateTicketStatusAction,
} from "@/features/customer-support/actions/ticket.actions"
import type {
  AddTicketCommentInput,
  AssignTicketInput,
  CreateTicketInput,
  UpdateTicketStatusInput,
} from "@/features/customer-support/types"

export const ticketMutations = {
  create: {
    mutationFn: (input: CreateTicketInput) => createTicketAction(input),
  },
  updateStatus: {
    mutationFn: (input: UpdateTicketStatusInput) =>
      updateTicketStatusAction(input),
  },
  assign: {
    mutationFn: (input: AssignTicketInput) => assignTicketAction(input),
  },
  addComment: {
    mutationFn: (input: AddTicketCommentInput) => addTicketCommentAction(input),
  },
}
