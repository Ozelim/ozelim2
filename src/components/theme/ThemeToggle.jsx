"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-10 h-10 rounded-full border border-app-border bg-app-bg/80 shrink-0",
          className,
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "w-10 h-10 rounded-full border border-(--site-accent)/30 flex items-center justify-center text-(--site-accent) hover:bg-(--site-accent)/10 transition-colors duration-300 shrink-0",
        className,
      )}
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px]" strokeWidth={2.25} />
      ) : (
        <Moon className="w-[18px] h-[18px]" strokeWidth={2.25} />
      )}
    </button>
  );
}
