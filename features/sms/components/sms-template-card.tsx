"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { SmsTemplate } from "@/features/sms/types"

type SmsTemplateCardProps = {
  template: SmsTemplate
  message: string
  onMessageChange: (value: string) => void
  onSend: () => void
  onImportCsv: () => void
}

function getSmsMeta(length: number) {
  const segments = Math.max(1, Math.ceil(length / 160))
  const limit = segments * 160

  return {
    limit,
    segments,
    label: `${length} / ${limit} characters · ${segments} SMS each`,
  }
}

export function SmsTemplateCard({
  template,
  message,
  onMessageChange,
  onSend,
  onImportCsv,
}: SmsTemplateCardProps) {
  const meta = getSmsMeta(message.length)

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
              {template.order}
            </span>
            <h3 className="text-base font-semibold text-foreground">
              {template.title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{template.timing}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted px-4 py-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {template.contactCount} contacts
          </span>{" "}
          from {template.contactsLabel}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={onImportCsv}
        >
          Import CSV
        </Button>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <Textarea
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          className="min-h-[120px] flex-1 rounded-xl border-border bg-background px-4 py-3 text-sm leading-6"
          aria-label={`${template.title} SMS message`}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">{meta.label}</p>
        <Button type="button" className="h-10 shrink-0 px-4" onClick={onSend}>
          {template.buttonLabel}
        </Button>
      </div>
    </article>
  )
}
