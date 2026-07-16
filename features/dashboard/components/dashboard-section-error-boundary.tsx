"use client"

import { Component, type ReactNode } from "react"

type DashboardSectionErrorBoundaryProps = {
  children: ReactNode
  title: string
}

type DashboardSectionErrorBoundaryState = {
  hasError: boolean
  message: string
}

export class DashboardSectionErrorBoundary extends Component<
  DashboardSectionErrorBoundaryProps,
  DashboardSectionErrorBoundaryState
> {
  state: DashboardSectionErrorBoundaryState = {
    hasError: false,
    message: "",
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Failed to load this section.",
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {this.props.title}: {this.state.message}
        </div>
      )
    }

    return this.props.children
  }
}
