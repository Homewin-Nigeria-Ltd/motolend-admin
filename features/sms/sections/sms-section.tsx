"use client"

import { useMemo, useState } from "react"

import { BackLink } from "@/components/back-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SmsTemplateCard } from "@/features/sms/components/sms-template-card"
import {
  SMS_FIELD_HINTS,
  SMS_PARTNERS,
  defaultSmsProvider,
  smsTemplates,
} from "@/features/sms/data/mock-sms"
import type { SmsPartner } from "@/features/sms/types"
import { toast } from "@/lib/toast"

export function SmsSection() {
  const [partner, setPartner] = useState<SmsPartner>(defaultSmsProvider.partner)
  const [apiKey, setApiKey] = useState(defaultSmsProvider.apiKey)
  const [showApiKey, setShowApiKey] = useState(false)
  const [messages, setMessages] = useState<Record<string, string>>(() =>
    Object.fromEntries(smsTemplates.map((item) => [item.id, item.message])),
  )

  const unitsLabel = useMemo(
    () => defaultSmsProvider.unitsLeft.toLocaleString("en-US"),
    [],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-white p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/settings" label="Settings" />
        <h2 className="text-base font-semibold text-foreground">SMS</h2>
      </div>

      <section className="rounded-2xl border border-border bg-background p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <p className="text-sm font-medium text-emerald-700">
              Connected · {unitsLabel} units left
            </p>

            <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
              <div>
                <label
                  htmlFor="sms-partner"
                  className="text-sm font-medium text-foreground"
                >
                  Partner
                </label>
                <Select
                  value={partner}
                  onValueChange={(value) => setPartner(value as SmsPartner)}
                >
                  <SelectTrigger id="sms-partner" className="mt-2 h-11 w-full">
                    <SelectValue placeholder="Select partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {SMS_PARTNERS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="sms-api-key"
                  className="text-sm font-medium text-foreground"
                >
                  API key
                </label>
                <div className="relative mt-2">
                  <Input
                    id="sms-api-key"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                    className="h-11 pr-16"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1/2 right-1 h-8 -translate-y-1/2 px-2 text-muted-foreground"
                    onClick={() => setShowApiKey((current) => !current)}
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-5"
              onClick={() => toast.success("Test SMS queued")}
            >
              Test
            </Button>
            <Button
              type="button"
              className="h-11 px-5"
              onClick={() => toast.success("SMS provider saved")}
            >
              Save
            </Button>
          </div>
        </div>
      </section>

      <p className="text-sm text-muted-foreground">
        Fields you can use:{" "}
        {SMS_FIELD_HINTS.map((field, index) => (
          <span key={field}>
            <code className="rounded bg-background px-1.5 py-0.5 text-foreground">
              {field}
            </code>
            {index < SMS_FIELD_HINTS.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>

      <div className="grid gap-4 xl:grid-cols-2">
        {smsTemplates.map((template) => (
          <SmsTemplateCard
            key={template.id}
            template={template}
            message={messages[template.id] ?? ""}
            onMessageChange={(value) =>
              setMessages((current) => ({
                ...current,
                [template.id]: value,
              }))
            }
            onImportCsv={() =>
              toast.success(`Import started for ${template.title}`)
            }
            onSend={() =>
              toast.success(`${template.buttonLabel} queued`)
            }
          />
        ))}
      </div>
    </div>
  )
}
