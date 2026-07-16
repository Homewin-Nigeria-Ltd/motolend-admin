"use client"

import * as React from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "theme"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type Listener = () => void

let theme: Theme = "light"
let initialized = false
const listeners = new Set<Listener>()

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light"
}

function writeThemeCookie(next: Theme) {
  document.cookie = `${STORAGE_KEY}=${next};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`
}

function initializeTheme() {
  if (initialized || typeof window === "undefined") return
  initialized = true
  theme = readStoredTheme()
  applyTheme(theme)
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  initializeTheme()
  return theme
}

function getServerSnapshot() {
  return "light"
}

function emitChange() {
  listeners.forEach((listener) => listener())
}

function applyTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark")
  localStorage.setItem(STORAGE_KEY, next)
  writeThemeCookie(next)
}

function setTheme(next: Theme | ((prev: Theme) => Theme)) {
  initializeTheme()
  theme = typeof next === "function" ? next(theme) : next
  applyTheme(theme)
  emitChange()
}

export function useTheme() {
  const currentTheme = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  const toggleTheme = React.useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"))
  }, [])

  return { theme: currentTheme, setTheme, toggleTheme }
}
