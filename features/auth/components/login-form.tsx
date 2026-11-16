"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { LoginOtpScreen } from "@/features/auth/components/login-otp-screen"
import { useLogin } from "@/features/auth/hooks/use-login"
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/login.schema"

const HIGHLIGHTS = [
  { value: "₦120M", label: "Disbursed this month" },
  { value: "92%", label: "Repaid on time" },
  { value: "24/7", label: "Recovery tracking" },
] as const

function LoginBrandPanel() {
  return (
    <aside className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-[#053523] px-8 py-8 text-white md:min-h-full md:px-12 md:py-10 lg:px-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_36%)]"
      />

      <div className="relative z-10 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.svg" alt="" className="size-9" />
        <span className="font-heading text-2xl font-bold italic tracking-tight">
          Motolend
        </span>
      </div>

      <div className="relative z-10 my-10 max-w-xl md:my-0">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Lend fast. Recover smart.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
          One place for loan applications, repayments, recovery and
          disbursement for the Motolend team.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm"
            >
              <p className="font-heading text-2xl font-semibold tracking-tight">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-white/70">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-sm text-white/55">
        © {new Date().getFullYear()} Motolend · Admin portal
      </p>
    </aside>
  )
}

export function LoginForm() {
  const { login, isPending } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [needsOtp, setNeedsOtp] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
      otp: "",
    },
  })

  async function onSubmit(data: LoginInput) {
    try {
      const result = await login({
        login: data.login,
        password: data.password,
      })

      if (result.success && result.otpRequired) {
        setNeedsOtp(true)
      }
    } catch {
      // The login hook already reports the error.
    }
  }

  return (
    <div className="grid min-h-full flex-1 lg:grid-cols-2">
      <LoginBrandPanel />

      <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        {needsOtp ? (
          <LoginOtpScreen
            email={form.getValues("login")}
            password={form.getValues("password")}
            onBack={() => {
              setNeedsOtp(false)
              form.setValue("otp", "")
              form.clearErrors("otp")
            }}
          />
        ) : (
          <div className="w-full max-w-md">
            <div>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h2>
              <p className="mt-2 text-base text-muted-foreground">
                Sign in to the Motolend admin portal.
              </p>
            </div>

            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8"
            >
              <FieldGroup className="gap-5">
                <Controller
                  name="login"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="login-email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="login-email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="amarachi.anigbogu@motolend.ng"
                        autoComplete="email"
                        className="h-12 rounded-lg px-4 text-base md:text-base"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="login-password"
                        className="text-sm font-medium text-foreground"
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
                          className="h-12 rounded-lg px-4 pr-16 text-base md:text-base"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((visible) => !visible)
                          }
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="mt-5 flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
                  <Checkbox
                    checked={keepSignedIn}
                    onCheckedChange={(checked) =>
                      setKeepSignedIn(checked === true)
                    }
                  />
                  Keep me signed in on this device
                </label>
                <span className="text-sm font-medium text-muted-foreground">
                  Forgot password?
                </span>
              </div>

              <Button
                type="submit"
                form="login-form"
                size="lg"
                className="mt-6 h-12 w-full rounded-lg text-base font-semibold"
                disabled={isPending}
              >
                {isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              After your password, we ask for a 4 digit code from your email or
              authenticator app.
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
