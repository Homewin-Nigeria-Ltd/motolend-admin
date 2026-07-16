"use server"

import { ticketServerEndpoints } from "@/features/customer-support/api/endpoints"
import type {
  AddTicketCommentInput,
  ApiTicket,
  ApiTicketDetailResponse,
  AssignTicketInput,
  CreateTicketInput,
  TicketActionResult,
  TicketDetail,
  UpdateTicketStatusInput,
} from "@/features/customer-support/types"
import {
  extractApiTicket,
  mapApiTicketToTicketDetail,
} from "@/features/customer-support/utils/ticket"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

function toActionError(error: unknown, fallback: string): TicketActionResult {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message || fallback,
    }
  }

  throw error
}

function mapDetailResult(data: ApiTicketDetailResponse) {
  const ticket = extractApiTicket(data)
  if (!ticket) {
    return undefined
  }

  return mapApiTicketToTicketDetail(ticket)
}

export async function createTicketAction(
  input: CreateTicketInput,
): Promise<TicketActionResult<TicketDetail>> {
  try {
    const body: Record<string, unknown> = {
      user_id: input.user_id,
      category: input.category,
      subcategory: input.subcategory,
      channel: input.channel,
      ticket_type: input.ticket_type,
      description: input.description,
      sla_hours: input.sla_hours,
    }

    if (input.assigned_to) {
      body.assigned_to = input.assigned_to
    }

    const data = await apiServer.post<ApiTicket>(
      ticketServerEndpoints.tickets,
      body,
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to create ticket")
  }
}

export async function updateTicketStatusAction(
  input: UpdateTicketStatusInput,
): Promise<TicketActionResult<TicketDetail>> {
  try {
    const data = await apiServer.put<ApiTicket>(
      ticketServerEndpoints.status(input.ticketId),
      { status: input.status },
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to update ticket status")
  }
}

export async function assignTicketAction(
  input: AssignTicketInput,
): Promise<TicketActionResult<TicketDetail>> {
  try {
    const data = await apiServer.put<ApiTicket>(
      ticketServerEndpoints.assign(input.ticketId),
      { assigned_to: input.assigned_to },
    )

    return { success: true, data: mapDetailResult(data) }
  } catch (error) {
    return toActionError(error, "Failed to reassign ticket")
  }
}

export async function addTicketCommentAction(
  input: AddTicketCommentInput,
): Promise<TicketActionResult<TicketDetail>> {
  try {
    await apiServer.post(ticketServerEndpoints.comments(input.ticketId), {
      comment: input.comment,
    })

    const detail = await apiServer.get<ApiTicketDetailResponse>(
      ticketServerEndpoints.ticket(input.ticketId),
    )

    return { success: true, data: mapDetailResult(detail) }
  } catch (error) {
    return toActionError(error, "Failed to add comment")
  }
}
