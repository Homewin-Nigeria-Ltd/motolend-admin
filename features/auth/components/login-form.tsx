"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { useLogin } from "@/features/auth/hooks/use-login"
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/login.schema"
import { cn } from "@/lib/utils"

const OTP_LENGTH = 4
const RESEND_SECONDS = 60

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${rest.toString().padStart(2, "0")}`
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
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "")

  function write(next: string) {
    onChange(next.replace(/\D/g, "").slice(0, OTP_LENGTH))
  }

  return (
    <div className="flex justify-center gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          id={index === 0 ? "login-otp" : undefined}
          type="password"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          maxLength={1}
          value={digit}
          aria-label={`Verification code digit ${index + 1}`}
          aria-invalid={invalid}
          className={cn(
            "size-14 rounded-md border border-border bg-background text-center text-lg outline-none",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
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

export function LoginForm() {
  const { login, resendOtp, isPending, isResending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [needsOtp, setNeedsOtp] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
      otp: "",
    },
  })

  useEffect(() => {
    if (resendIn <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setResendIn((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [resendIn > 0])

  async function onSubmit(data: LoginInput) {
    if (needsOtp && (data.otp?.replace(/\D/g, "").length ?? 0) < OTP_LENGTH) {
      form.setError("otp", { message: "Enter the 4-digit code" })
      return
    }

    try {
      const result = await login(
        needsOtp
          ? data
          : { login: data.login, password: data.password },
      )

      if (result.success && result.otpRequired) {
        setNeedsOtp(true)
        setResendIn(RESEND_SECONDS)
      }
    } catch {
      // The login hook already reports the error.
    }
  }

  return (
    <Card className="w-full max-w-lg gap-6 px-2 py-2 sm:px-4 sm:py-4">
      <CardHeader className="items-center gap-3 px-4 text-center sm:px-6">
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
          Motolend
        </CardTitle>
        <CardDescription className="text-base">
          {needsOtp
            ? "Enter the verification code to finish signing in"
            : "Sign in to your admin dashboard"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-5">
            <Controller
              name="login"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="login-email"
                    className="text-base font-medium"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    autoComplete="email"
                    readOnly={needsOtp}
                    className="h-12 rounded-md px-4 text-base md:text-base"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            {needsOtp ? (
              <Controller
                name="otp"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="login-otp"
                      className="text-base font-medium"
                    >
                      Verification code
                    </FieldLabel>
                    <OtpBoxes
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            ) : (
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="login-password"
                      className="text-base font-medium"
                    >
                      Password
                    </FieldLabel>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-12 rounded-md px-4 pr-12 text-base md:text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className={cn(
                          "absolute top-1/2 right-3 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors",
                          "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        )}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <Icons.eyeOff size={20} aria-hidden />
                        ) : (
                          <Icons.eye size={20} aria-hidden />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-3 px-4 pb-6 sm:px-6">
        <Button
          type="submit"
          form="login-form"
          size="lg"
          className="h-12 w-full text-base font-semibold"
          disabled={isPending || isResending}
        >
          {isPending
            ? "Signing in…"
            : needsOtp
              ? "Verify code"
              : "Sign in"}
        </Button>
        {needsOtp ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full"
            disabled={isPending || isResending || resendIn > 0}
            onClick={async () => {
              try {
                const result = await resendOtp({
                  login: form.getValues("login"),
                  password: form.getValues("password"),
                })
                if (result.success) {
                  form.setValue("otp", "")
                  form.clearErrors("otp")
                  setResendIn(RESEND_SECONDS)
                }
              } catch {
                // The resend hook already reports the error.
              }
            }}
          >
            {isResending
              ? "Sending code…"
              : resendIn > 0
                ? `Resend code in ${formatCountdown(resendIn)}`
                : "Resend code"}
          </Button>
        ) : null}
        {needsOtp ? (
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-full"
            disabled={isPending || isResending}
            onClick={() => {
              setNeedsOtp(false)
              setResendIn(0)
              form.setValue("otp", "")
              form.clearErrors("otp")
            }}
          >
            Use a different account
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
