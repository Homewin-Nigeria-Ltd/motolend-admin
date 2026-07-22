import type { LoanProductApprovalWorkflow } from "@/features/loan-products/types"

type LoanProductApprovalWorkflowCardProps = {
  workflows: LoanProductApprovalWorkflow[]
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

export function LoanProductApprovalWorkflowCard({
  workflows,
}: LoanProductApprovalWorkflowCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <h3 className="text-base font-semibold text-foreground">
        Approval Workflow
      </h3>

      {workflows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No approval workflow configured.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-4 border-b border-border bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>Name</span>
            <span className="text-right">Steps</span>
          </div>

          <div className="divide-y divide-border">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="grid grid-cols-[minmax(0,1fr)_5rem] gap-4 px-4 py-4 text-sm text-foreground"
              >
                <span className="font-medium">{displayValue(workflow.name)}</span>
                <span className="text-right">{displayValue(workflow.steps)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
