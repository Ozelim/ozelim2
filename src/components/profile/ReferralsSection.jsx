"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Copy, Check, Share2, Gift, Mail } from "lucide-react";
import {
  Card,
  CardBody,
  Button,
  SectionHeader,
  EmptyState,
  Toast,
  cn,
} from "./ui";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function ReferralLinkCard({ url, code, onCopy, copied }) {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--profile-accent-soft) border border-(--profile-accent-border) flex items-center justify-center shrink-0">
            <Share2 className="w-4 h-4 text-(--profile-accent)" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-app-fg dark:text-white font-semibold text-lg leading-tight"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Ваша реферальная ссылка
            </h3>
            <p className="text-app-subtle dark:text-white/45 text-sm mt-0.5">
              Поделитесь ссылкой и приглашайте друзей в OzElim
            </p>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-app-subtle dark:text-white/50 uppercase tracking-wider mb-1.5 block">
            Ссылка
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              readOnly
              value={url}
              onFocus={(e) => e.target.select()}
              className="flex-1 rounded-xl border border-[#1a6b1a]/30 bg-app-input-bg text-app-fg placeholder:text-app-faint dark:bg-[#0a2a0a]/80 dark:text-white text-sm px-3.5 py-2.5 font-mono tracking-tight focus:outline-none focus:ring-2 focus:ring-(--profile-accent)/25 focus:border-(--profile-accent)/45"
            />
            <Button variant="primary" onClick={onCopy} className="shrink-0">
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Скопировано
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Копировать
                </>
              )}
            </Button>
          </div>
        </div>

        {code && (
          <div className="flex items-center gap-2 pt-2 border-t border-app-border">
            <Gift className="w-3.5 h-3.5 text-(--profile-accent)" />
            <span className="text-xs text-app-subtle dark:text-white/45">
              Ваш реферальный код:
            </span>
            <span className="font-mono text-sm text-app-fg dark:text-white tracking-wider">
              {code}
            </span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function ReferralRow({ r }) {
  const initials = (r.name || r.email || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-app-border bg-app-card/70 dark:bg-[#0a2a0a]/40 hover:border-(--profile-accent)/40 transition-colors">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-br from-(--profile-accent)/20 to-(--profile-accent-bright)/10 border border-(--profile-accent-border) text-(--profile-accent) font-bold text-sm shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-app-fg dark:text-white font-medium text-sm truncate">
          {r.name || "Без имени"}
        </div>
        <div className="flex items-center gap-1.5 text-app-subtle dark:text-white/45 text-xs truncate">
          <Mail className="w-3 h-3 shrink-0" />
          <span className="truncate">{r.email}</span>
        </div>
      </div>
      <div className="text-xs text-app-faint dark:text-white/35 shrink-0">
        {formatDate(r.referredAt)}
      </div>
    </div>
  );
}

function ReferralSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-16 rounded-xl border border-app-border bg-app-card/40 animate-pulse"
        />
      ))}
    </div>
  );
}

export function ReferralsSection() {
  const [link, setLink] = useState(null);
  const [loadingLink, setLoadingLink] = useState(true);
  const [linkError, setLinkError] = useState("");

  const [referrals, setReferrals] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/referral", { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        if (!res.ok) {
          setLinkError(data.error || "Не удалось загрузить ссылку");
        } else {
          setLink(data);
        }
      } catch {
        if (alive) setLinkError("Ошибка сети");
      } finally {
        if (alive) setLoadingLink(false);
      }
    })();
    (async () => {
      try {
        const res = await fetch("/api/referrals", { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        if (!res.ok) {
          setListError(data.error || "Не удалось загрузить рефералов");
        } else {
          setReferrals(data.referrals || []);
        }
      } catch {
        if (alive) setListError("Ошибка сети");
      } finally {
        if (alive) setLoadingList(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function handleCopy() {
    if (!link?.url) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link.url);
      } else {
        const ta = document.createElement("textarea");
        ta.value = link.url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      showToast("Ссылка скопирована", "success");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast("Не удалось скопировать", "error");
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Рефералы"
        subtitle="Приглашайте друзей и следите за вашей сетью"
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm shadow-lg">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {loadingLink ? (
        <div className="h-40 rounded-2xl border border-app-border bg-app-card/40 animate-pulse" />
      ) : linkError ? (
        <Toast message={linkError} type="error" />
      ) : link ? (
        <ReferralLinkCard
          url={link.url}
          code={link.referralCode}
          onCopy={handleCopy}
          copied={copied}
        />
      ) : null}

      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-(--profile-accent)" />
              <h3 className="text-app-fg dark:text-white font-semibold text-base">
                Приглашённые пользователи
              </h3>
            </div>
            <div
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                "bg-(--profile-accent-soft) border border-(--profile-accent-border) text-(--profile-accent)",
              )}
            >
              {loadingList ? "…" : referrals.length}
            </div>
          </div>

          {loadingList ? (
            <ReferralSkeleton />
          ) : listError ? (
            <Toast message={listError} type="error" />
          ) : referrals.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Пока нет рефералов"
              subtitle="Поделитесь вашей ссылкой — приглашённые пользователи появятся здесь"
            />
          ) : (
            <div className="space-y-2">
              {referrals.map((r) => (
                <ReferralRow key={r.id} r={r} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
