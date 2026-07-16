"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTicket } from "@/features/customer-support/hooks/use-ticket-mutations"
import {
  createTicketFormDefaults,
  createTicketSchema,
  ticketCategoryOptions,
  ticketChannelOptions,
  ticketSubcategoryOptions,
  ticketTypeOptions,
  type CreateTicketFormValues,
} from "@/features/customer-support/schemas/create-ticket.schema"
import { useUserList } from "@/features/users/hooks/use-user-list"

const selectTriggerClassName = "h-11 w-full border-border bg-background"

type AddTicketSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTicketSheet({ open, onOpenChange }: AddTicketSheetProps) {
  const { createTicket, isPending } = useCreateTicket()
  const { data: customersData, isPending: isCustomersPending } = useUserList({
    page: 1,
    per_page: 50,
    tab: "active",
  })
  const { data: agentsData, isPending: isAgentsPending } = useUserList({
    page: 1,
    per_page: 50,
    tab: "admin",
  })

  const customers = customersData?.items ?? []
  const agents = agentsData?.items ?? []

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: createTicketFormDefaults,
  })

  const handleOpenChange = (next: boolean) => {
    form.reset(createTicketFormDefaults)
    onOpenChange(next)
  }

  const onSubmit = async (values: CreateTicketFormValues) => {
    const result = await createTicket({
      user_id: values.user_id,
      assigned_to: values.assigned_to?.trim() || null,
      category: values.category,
      subcategory: values.subcategory,
      channel: values.channel,
      ticket_type: values.ticket_type,
      description: values.description,
      sla_hours: values.sla_hours,
    })

    if (result.success) {
      form.reset(createTicketFormDefaults)
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-lg font-semibold">
            Ticket Information
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col"
        >
          <div className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="user_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Customer</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending || isCustomersPending}
                    >
                      <SelectTrigger
                        className={selectTriggerClassName}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="assigned_to"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Ticket Owner (optional)</FieldLabel>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={isPending || isAgentsPending}
                    >
                      <SelectTrigger className={selectTriggerClassName}>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="channel"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Channel</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={selectTriggerClassName}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {ticketChannelOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="ticket_type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Ticket Type</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={selectTriggerClassName}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {ticketTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={selectTriggerClassName}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {ticketCategoryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="subcategory"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Subcategory</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={selectTriggerClassName}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {ticketSubcategoryOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="sla_hours"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                    <FieldLabel>SLA Hours</FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Describe the issue"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
          </div>

          <div className="mt-auto border-t border-border p-6">
            <Button type="submit" className="h-11 px-6" disabled={isPending}>
              {isPending ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
