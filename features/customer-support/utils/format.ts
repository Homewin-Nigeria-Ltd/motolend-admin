export function formatTicketCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatTicketDateTime(iso: string | null | undefined) {
  if (!iso) {
    return "-"
  }

  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return iso
  }

  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" ", "")

  return `${datePart} | ${timePart}`
}

export function splitTicketDateTime(iso: string | null | undefined) {
  if (!iso) {
    return { dateCreated: "-", timeCreated: "-" }
  }

  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return { dateCreated: iso, timeCreated: "-" }
  }

  return {
    dateCreated: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date),
    timeCreated: new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(date)
      .replace(" ", ""),
  }
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function buildSparkline(value: number, direction: "up" | "down") {
  const base = Math.max(value, 1)
  const points = Array.from({ length: 10 }, (_, index) => {
    const progress = index / 9
    const wave = Math.sin(progress * Math.PI) * (base * 0.08)
    return direction === "up"
      ? base * (0.55 + progress * 0.45) + wave
      : base * (1 - progress * 0.4) + wave
  })

  return points.map((point) => Math.max(1, Math.round(point)))
}
