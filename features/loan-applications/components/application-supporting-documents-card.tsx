"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import type { ApplicationDocument } from "@/features/loan-applications/types"

type ApplicationSupportingDocumentsCardProps = {
  documents: ApplicationDocument[]
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function DocumentRow({ document }: { document: ApplicationDocument }) {
  return (
    <div className="grid grid-cols-1 gap-3 border-b border-border py-4 last:border-b-0 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-center">
      <p className="text-sm text-muted-foreground">{document.label}</p>
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
            <Icons.fileText size={18} className="text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {displayValue(document.name)}
            </p>
            <p className="text-xs text-muted-foreground">
              {displayValue(document.size)}
            </p>
          </div>
        </div>
        {document.downloadUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Download ${document.name}`}
            asChild
          >
            <a
              href={document.downloadUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.download size={18} />
            </a>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Download ${document.name}`}
            disabled
          >
            <Icons.download size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}

export function ApplicationSupportingDocumentsCard({
  documents,
}: ApplicationSupportingDocumentsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">
        Supporting Documents
      </h3>

      <div className="mt-2">
        {documents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No supporting documents uploaded.
          </p>
        ) : (
          documents.map((document) => (
            <DocumentRow key={document.id} document={document} />
          ))
        )}
      </div>
    </div>
  )
}
