"use client"

import { useEffect, useRef, useState } from "react"

import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import type { RecoveryLoan } from "@/features/recovery/types"
import { cn } from "@/lib/utils"

const OTP_LENGTH = 4
const RESEND_SECONDS = 60

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${rest.toString().padStart(2, "0")}`
}

function OtpBoxes({
  value,
  onChange,
  invalid,
}: {
  value: string
  onChange: (value: string) => void
  invalid?: boolean
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from(
    { length: OTP_LENGTH },
    (_, index) => value[index] ?? "",
  )

  function write(next: string) {
    onChange(next.replace(/\D/g, "").slice(0, OTP_LENGTH))
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          id={index === 0 ? "mark-paid-otp" : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          maxLength={1}
          value={digit}
          aria-label={`Verification code digit ${index + 1}`}
          aria-invalid={invalid}
          className={cn(
            "size-12 rounded-lg border border-border bg-background text-center text-lg font-semibold outline-none",
            "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            invalid && "border-destructive",
          )}
          onChange={(event) => {
            const char = event.target.value.replace(/\D/g, "").slice(-1)
            const next = digits.map((item, itemIndex) =>
              itemIndex === index ? char : item,
            )
            write(next.join(""))
            if (char && index < OTP_LENGTH - 1) {
              refs.current[index + 1]?.focus()
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && index > 0) {
              refs.current[index - 1]?.focus()
            }
          }}
          onPaste={(event) => {
            event.preventDefault()
            const pasted = event.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, OTP_LENGTH)
            write(pasted)
            refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
          }}
        />
      ))}
    </div>
  )
}

type MarkPaidOtpDialogProps = {
  loan: RecoveryLoan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (otp: string) => void | Promise<void>
  onResend: () => void | Promise<void>
  isPending?: boolean
  isResending?: boolean
}

type MarkPaidOtpDialogSessionProps = {
  loan: RecoveryLoan
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (otp: string) => void | Promise<void>
  onResend: () => void | Promise<void>
  isPending: boolean
  isResending: boolean
}

function MarkPaidOtpDialogSession({
  loan,
  open,
  onOpenChange,
  onVerify,
  onResend,
  isPending,
  isResending,
}: MarkPaidOtpDialogSessionProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [resendIn, setResendIn] = useState(RESEND_SECONDS)
  const isCountingDown = resendIn > 0

  useEffect(() => {
    if (!isCountingDown) {
      return
    }

    const timer = window.setInterval(() => {
      setResendIn((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isCountingDown])

  return (
    <BaseModal
      title={`Approve paid status for ${loan.applicationId}`}
      className="max-w-md"
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isPending || otp.length < OTP_LENGTH}
            onClick={async () => {
              if (otp.length < OTP_LENGTH) {
                setError("Enter the 4-digit code")
                return
              }

              setError(null)
              await onVerify(otp)
            }}
          >
            {isPending ? "Verifying…" : "Verify and mark Paid"}
          </Button>
        </div>
      }
    >
      <p className="-mt-2 text-sm text-muted-foreground">
        Enter the 4 digit code sent to recovery@motolend.ng to confirm this
        recovery payment.
      </p>

      <Field data-invalid={Boolean(error)}>
        <FieldLabel
          htmlFor="mark-paid-otp"
          className="text-sm font-medium text-muted-foreground"
        >
          Verification code
        </FieldLabel>
        <OtpBoxes
          value={otp}
          onChange={(value) => {
            setOtp(value)
            setError(null)
          }}
          invalid={Boolean(error)}
        />
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Didn&apos;t get it?{" "}
          {resendIn > 0 || isResending ? (
            <span>
              {isResending
                ? "Sending…"
                : `Resend in ${formatCountdown(resendIn)}`}
            </span>
          ) : (
            <button
              type="button"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              onClick={async () => {
                await onResend()
                setOtp("")
                setError(null)
                setResendIn(RESEND_SECONDS)
              }}
            >
              Resend
            </button>
          )}
        </p>
        {error ? <FieldError>{error}</FieldError> : null}
      </Field>
    </BaseModal>
  )
}

export function MarkPaidOtpDialog({
  loan,
  open,
  onOpenChange,
  onVerify,
  onResend,
  isPending = false,
  isResending = false,
}: MarkPaidOtpDialogProps) {
  if (!open || !loan) {
    return null
  }

  return (
    <MarkPaidOtpDialogSession
      key={loan.id}
      loan={loan}
      open={open}
      onOpenChange={onOpenChange}
      onVerify={onVerify}
      onResend={onResend}
      isPending={isPending}
      isResending={isResending}
    />
  )
}
