import type { ApplicationActivityLogEntry } from "@/features/loan-applications/types"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ApplicationActivityLogCardProps = {
  activityLog: ApplicationActivityLogEntry[]
}

export function ApplicationActivityLogCard({
  activityLog,
}: ApplicationActivityLogCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-4 md:px-6">
        <h3 className="text-base font-semibold text-foreground">Activity Log</h3>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm font-medium text-primary"
        >
          View all
        </Button>
      </div>

      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="h-auto px-4 py-3 font-medium text-muted-foreground md:px-6">
              Date/Time
            </TableHead>
            <TableHead className="h-auto px-4 py-3 font-medium text-muted-foreground md:px-6">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityLog.length === 0 ? (
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableCell
                colSpan={2}
                className="px-4 py-8 text-center text-sm text-muted-foreground md:px-6"
              >
                No activity recorded yet.
              </TableCell>
            </TableRow>
          ) : (
            activityLog.map((entry) => (
              <TableRow key={entry.id} className="border-border/60">
                <TableCell className="px-4 py-4 whitespace-nowrap text-muted-foreground md:px-6">
                  {entry.dateTime}
                </TableCell>
                <TableCell className="px-4 py-4 text-foreground md:px-6">
                  {entry.action}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
