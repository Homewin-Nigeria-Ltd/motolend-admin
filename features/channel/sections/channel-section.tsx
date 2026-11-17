"use client"

import { useState } from "react"

import { BackLink } from "@/components/back-link"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { PartnerToggleCard } from "@/features/channel/components/partner-toggle-card"
import { channelServices as initialServices } from "@/features/channel/data/mock-channel"
import type { ChannelService } from "@/features/channel/types"
import { toast } from "@/lib/toast"

function getSelectedPartnerId(service: ChannelService) {
  return service.partners.find((partner) => partner.enabled)?.id ?? ""
}

export function ChannelSection() {
  const [services, setServices] = useState<ChannelService[]>(initialServices)

  function selectPartner(serviceId: string, partnerId: string) {
    setServices((current) =>
      current.map((service) => {
        if (service.id !== serviceId) {
          return service
        }

        return {
          ...service,
          partners: service.partners.map((partner) => ({
            ...partner,
            enabled: partner.id === partnerId,
          })),
        }
      }),
    )

    toast.success("Partner selected for new requests")
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-2">
        <BackLink href="/settings" label="Settings" />
        <h2 className="text-base font-semibold text-foreground">Channel</h2>
      </div>

      <section className="rounded-2xl border border-border bg-background">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-start sm:justify-between md:px-6">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-foreground">
              API partners
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Choose one partner per service. Changes apply to new requests
              immediately.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10 shrink-0 px-4"
            icon={{ name: "add", position: "left" }}
          >
            Add partner
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-[220px_minmax(0,1fr)] border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground md:px-6">
            <span>Service</span>
            <span>Partners</span>
          </div>

          {services.map((service, index) => (
            <div
              key={service.id}
              className={
                index % 2 === 0
                  ? "grid min-w-[720px] grid-cols-[220px_minmax(0,1fr)] gap-4 border-b border-border px-5 py-5 last:border-b-0 md:px-6"
                  : "grid min-w-[720px] grid-cols-[220px_minmax(0,1fr)] gap-4 border-b border-border bg-muted/40 px-5 py-5 last:border-b-0 md:px-6"
              }
            >
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{service.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>

              <RadioGroup
                value={getSelectedPartnerId(service)}
                onValueChange={(partnerId) =>
                  selectPartner(service.id, partnerId)
                }
                className="flex flex-wrap gap-3"
              >
                {service.partners.map((partner) => (
                  <PartnerToggleCard
                    key={partner.id}
                    id={`${service.id}-${partner.id}`}
                    value={partner.id}
                    name={partner.name}
                    selected={partner.enabled}
                  />
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
