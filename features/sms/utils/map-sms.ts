import type {
  ApiRecoverySmsOverview,
  ApiRecoverySmsOverviewResponse,
  ApiRecoverySmsStage,
  SmsOverview,
  SmsTemplate,
} from "@/features/sms/types"

function toStringValue(value: unknown) {
  if (value == null) return ""
  return String(value).trim()
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function extractApiRecoverySmsOverview(
  response: ApiRecoverySmsOverviewResponse,
): ApiRecoverySmsOverview | null {
  if (!response || typeof response !== "object") {
    return null
  }

  if ("stages" in response || "placeholders" in response) {
    return response as ApiRecoverySmsOverview
  }

  const wrapped = response as { data?: ApiRecoverySmsOverview }
  return wrapped.data ?? null
}

function mapApiStage(stage: ApiRecoverySmsStage, index: number): SmsTemplate {
  const key = toStringValue(stage.key) || `stage-${index + 1}`
  const label = toStringValue(stage.label) || key
  const contactCount = toNumber(stage.contact_count, 0)
  const message = toStringValue(stage.template)
  const characterCount =
    toNumber(stage.character_count, 0) || message.length
  const smsSegments =
    toNumber(stage.sms_segments, 0) ||
    Math.max(1, Math.ceil(Math.max(message.length, 1) / 160))

  return {
    id: key,
    order: index + 1,
    title: label,
    timing: toStringValue(stage.description) || "—",
    contactsLabel: `${label} recovery tab`,
    contactCount: formatCount(contactCount),
    contactCountRaw: contactCount,
    message,
    buttonLabel: `Send to ${label}`,
    characterCount,
    smsSegments,
  }
}

export function mapApiRecoverySmsOverview(
  overview: ApiRecoverySmsOverview,
): SmsOverview {
  return {
    placeholders: (overview.placeholders ?? [])
      .map((item) => toStringValue(item))
      .filter(Boolean),
    stages: (overview.stages ?? []).map(mapApiStage),
  }
}
