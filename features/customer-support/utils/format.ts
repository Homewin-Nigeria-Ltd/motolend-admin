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
