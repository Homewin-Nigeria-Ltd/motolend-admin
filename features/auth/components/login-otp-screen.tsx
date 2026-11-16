"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod/v3"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { useLogin } from "@/features/auth/hooks/use-login"
import { cn } from "@/lib/utils"

export const OTP_LENGTH = 4
const RESEND_SECONDS = 60

const otpSchema = z.object({
  otp: z.string().min(OTP_LENGTH, "Enter the 4-digit code"),
})

type OtpFormValues = z.infer<typeof otpSchema>

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${rest.toString().padStart(2, "0")}`
}

function maskEmail(email: string) {
  const [local = "", domain = ""] = email.trim().split("@")
  if (!local || !domain) {
    return email
  }

  const visible = local.slice(0, 2)
  return `${visible}${"*".repeat(6)}@${domain}`
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
    <div className="flex gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          id={index === 0 ? "login-otp" : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          maxLength={1}
          value={digit}
          aria-label={`Verification code digit ${index + 1}`}
          aria-invalid={invalid}
          className={cn(
            "size-11 rounded-lg border border-border bg-background text-center text-lg font-semibold outline-none sm:size-12",
            "focus-visible:border-[#053523] focus-visible:ring-2 focus-visible:ring-[#053523]/20",
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

type LoginOtpScreenProps = {
  email: string
  password: string
  onBack: () => void
}

export function LoginOtpScreen({
  email,
  password,
  onBack,
}: LoginOtpScreenProps) {
  const { login, resendOtp, isPending, isResending } = useLogin()
  const [resendIn, setResendIn] = useState(RESEND_SECONDS)

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

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

  async function onSubmit(values: OtpFormValues) {
    const otp = values.otp.replace(/\D/g, "")
    if (otp.length < OTP_LENGTH) {
      form.setError("otp", { message: "Enter the 4-digit code" })
      return
    }

    try {
      await login({
        login: email,
        password,
        otp,
      })
    } catch {
      // The login hook already reports the error.
    }
  }

  async function handleResend() {
    if (isPending || isResending || resendIn > 0) {
      return
    }

    try {
      const result = await resendOtp({
        login: email,
        password,
      })
      if (result.success) {
        form.setValue("otp", "")
        form.clearErrors("otp")
        setResendIn(RESEND_SECONDS)
      }
    } catch {
      // The resend hook already reports the error.
    }
  }

  return (
    <div className="w-full max-w-md">
      <div>
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          Check your email
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          We sent a 4 digit code to {maskEmail(email)}. It expires in 10
          minutes.
        </p>
      </div>

      <form
        id="login-otp-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8"
      >
        <FieldGroup className="gap-5">
          <Controller
            name="otp"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="login-otp"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Verification code
                </FieldLabel>
                <OtpBoxes
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  invalid={fieldState.invalid}
                />
                <p className="mt-3 text-sm text-muted-foreground">
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
                      onClick={() => {
                        void handleResend()
                      }}
                    >
                      Resend
                    </button>
                  )}
                </p>
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          form="login-otp-form"
          size="lg"
          className="mt-6 h-12 w-full rounded-lg text-base font-semibold"
          disabled={isPending || isResending}
        >
          {isPending ? "Signing in…" : "Verify and sign in"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-5 w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        disabled={isPending || isResending}
        onClick={onBack}
      >
        Use authenticator app instead
      </button>
    </div>
  )
}
