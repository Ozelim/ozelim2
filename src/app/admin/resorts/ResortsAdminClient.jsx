"use client";

import * as React from "react";
import { Plus, Trash2, Save, X, Pencil, Building2, Hotel, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";

function formatPrice(value) {
  return Number(value || 0).toLocaleString("ru-RU");
}

async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Ошибка запроса");
  return data;
}

function SectionCard({ title, icon: Icon, children, action }) {
  return (
    <div className="rounded-3xl border border-(--app-border) bg-(--app-card) p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-(--app-fg)">
          {Icon && <Icon className="w-5 h-5 text-(--site-accent-bright)" />}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, type = "button", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
        disabled
          ? "bg-(--app-panel) text-(--app-faint) cursor-not-allowed"
          : "bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) hover:shadow-[0_0_20px_var(--site-shadow-glow)]"
      }`}
    >
      {children}
    </button>
  );
}

function GhostIconButton({ onClick, title, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-full border border-(--app-border) flex items-center justify-center transition-colors ${
        danger
          ? "text-red-400 hover:border-red-400/60 hover:bg-red-400/10"
          : "text-(--app-fg) hover:border-(--site-accent)/60 hover:bg-(--app-panel-strong)"
      }`}
    >
      {children}
    </button>
  );
}

function inputClass() {
  return "bg-(--app-panel) border-(--app-border) text-(--app-fg) placeholder:text-(--app-faint) rounded-xl h-10 focus-visible:ring-(--site-accent)/50 focus-visible:border-(--site-accent)";
}

export default function ResortsAdminClient({
  initialDirections,
  initialBases,
  initialServices,
}) {
  const [directions, setDirections] = React.useState(initialDirections);
  const [bases, setBases] = React.useState(initialBases);
  const [services, setServices] = React.useState(initialServices);

  const [newDirection, setNewDirection] = React.useState("");
  const [editingDirectionId, setEditingDirectionId] = React.useState(null);
  const [editingDirectionName, setEditingDirectionName] = React.useState("");

  const [newBaseDirectionId, setNewBaseDirectionId] = React.useState("");
  const [newBaseName, setNewBaseName] = React.useState("");
  const [editingBaseId, setEditingBaseId] = React.useState(null);
  const [editingBaseName, setEditingBaseName] = React.useState("");

  const [newServiceBaseId, setNewServiceBaseId] = React.useState("");
  const [newServiceName, setNewServiceName] = React.useState("");
  const [newServiceAdult, setNewServiceAdult] = React.useState("");
  const [newServiceChild, setNewServiceChild] = React.useState("");
  const [editingServiceId, setEditingServiceId] = React.useState(null);
  const [editingService, setEditingService] = React.useState({
    name: "",
    price_adult: "",
    price_child: "",
  });

  const [error, setError] = React.useState("");

  const handle = (fn) => async (...args) => {
    try {
      setError("");
      await fn(...args);
    } catch (e) {
      setError(e.message || "Ошибка");
    }
  };

  // --- Directions
  const addDirection = handle(async () => {
    if (!newDirection.trim()) return;
    const data = await api("POST", "/api/resort-directions", {
      name: newDirection.trim(),
    });
    setDirections((prev) => [...prev, data.direction]);
    setNewDirection("");
  });

  const saveDirection = handle(async (id) => {
    if (!editingDirectionName.trim()) return;
    const data = await api("PATCH", `/api/resort-directions/${id}`, {
      name: editingDirectionName.trim(),
    });
    setDirections((prev) => prev.map((d) => (d.id === id ? data.direction : d)));
    setEditingDirectionId(null);
    setEditingDirectionName("");
  });

  const deleteDirection = handle(async (id) => {
    if (!confirm("Удалить направление? Все привязанные базы и услуги будут удалены.")) return;
    await api("DELETE", `/api/resort-directions/${id}`);
    setDirections((prev) => prev.filter((d) => d.id !== id));
    setBases((prev) => prev.filter((b) => b.direction_id !== id));
    setServices((prev) =>
      prev.filter((s) => bases.find((b) => b.id === s.base_id)?.direction_id !== id),
    );
  });

  // --- Bases
  const addBase = handle(async () => {
    if (!newBaseName.trim() || !newBaseDirectionId) return;
    const data = await api("POST", "/api/resort-bases", {
      name: newBaseName.trim(),
      direction_id: Number(newBaseDirectionId),
    });
    const directionName = directions.find((d) => d.id === Number(newBaseDirectionId))?.name;
    setBases((prev) => [...prev, { ...data.base, direction_name: directionName }]);
    setNewBaseName("");
  });

  const saveBase = handle(async (id) => {
    if (!editingBaseName.trim()) return;
    const data = await api("PATCH", `/api/resort-bases/${id}`, {
      name: editingBaseName.trim(),
    });
    setBases((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...data.base } : b)),
    );
    setEditingBaseId(null);
    setEditingBaseName("");
  });

  const deleteBase = handle(async (id) => {
    if (!confirm("Удалить базу? Все её услуги будут удалены.")) return;
    await api("DELETE", `/api/resort-bases/${id}`);
    setBases((prev) => prev.filter((b) => b.id !== id));
    setServices((prev) => prev.filter((s) => s.base_id !== id));
  });

  // --- Services
  const addService = handle(async () => {
    if (!newServiceName.trim() || !newServiceBaseId) return;
    const data = await api("POST", "/api/resort-services", {
      name: newServiceName.trim(),
      base_id: Number(newServiceBaseId),
      price_adult: Number(newServiceAdult) || 0,
      price_child: Number(newServiceChild) || 0,
    });
    const base = bases.find((b) => b.id === Number(newServiceBaseId));
    setServices((prev) => [
      ...prev,
      {
        ...data.service,
        base_name: base?.name,
        direction_name: base?.direction_name,
      },
    ]);
    setNewServiceName("");
    setNewServiceAdult("");
    setNewServiceChild("");
  });

  const startEditService = (s) => {
    setEditingServiceId(s.id);
    setEditingService({
      name: s.name,
      price_adult: String(s.price_adult ?? ""),
      price_child: String(s.price_child ?? ""),
    });
  };

  const saveService = handle(async (id) => {
    const data = await api("PATCH", `/api/resort-services/${id}`, {
      name: editingService.name.trim(),
      price_adult: Number(editingService.price_adult) || 0,
      price_child: Number(editingService.price_child) || 0,
    });
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data.service } : s)),
    );
    setEditingServiceId(null);
  });

  const deleteService = handle(async (id) => {
    if (!confirm("Удалить услугу?")) return;
    await api("DELETE", `/api/resort-services/${id}`);
    setServices((prev) => prev.filter((s) => s.id !== id));
  });

  return (
    <div className="min-h-screen px-6 py-32 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="text-(--site-accent-bright) text-xs uppercase tracking-widest mb-2">
          Админка
        </div>
        <h1 className="text-4xl font-bold text-(--app-fg)" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Курортные направления
        </h1>
        <p className="text-sm text-(--app-faint) mt-2">
          Управление направлениями, базами и услугами для калькулятора туров и формы заявок.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <SectionCard title="Курортные направления" icon={Building2}>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Название нового направления"
            value={newDirection}
            onChange={(e) => setNewDirection(e.target.value)}
            className={inputClass()}
          />
          <PrimaryButton onClick={addDirection} disabled={!newDirection.trim()}>
            <Plus className="w-4 h-4" />
            Добавить
          </PrimaryButton>
        </div>

        <div className="space-y-2">
          {directions.length === 0 ? (
            <div className="text-sm text-(--app-faint) text-center py-4">
              Пока нет направлений
            </div>
          ) : (
            directions.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-(--app-border) bg-(--app-panel)"
              >
                {editingDirectionId === d.id ? (
                  <>
                    <Input
                      value={editingDirectionName}
                      onChange={(e) => setEditingDirectionName(e.target.value)}
                      className={inputClass() + " flex-1"}
                    />
                    <GhostIconButton onClick={() => saveDirection(d.id)} title="Сохранить">
                      <Save className="w-4 h-4" />
                    </GhostIconButton>
                    <GhostIconButton
                      onClick={() => {
                        setEditingDirectionId(null);
                        setEditingDirectionName("");
                      }}
                      title="Отменить"
                    >
                      <X className="w-4 h-4" />
                    </GhostIconButton>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-(--app-fg)">{d.name}</span>
                    <GhostIconButton
                      onClick={() => {
                        setEditingDirectionId(d.id);
                        setEditingDirectionName(d.name);
                      }}
                      title="Редактировать"
                    >
                      <Pencil className="w-4 h-4" />
                    </GhostIconButton>
                    <GhostIconButton onClick={() => deleteDirection(d.id)} title="Удалить" danger>
                      <Trash2 className="w-4 h-4" />
                    </GhostIconButton>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard title="Курортные базы" icon={Hotel}>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 mb-4">
          <select
            value={newBaseDirectionId}
            onChange={(e) => setNewBaseDirectionId(e.target.value)}
            className="bg-(--app-panel) border border-(--app-border) text-(--app-fg) rounded-xl h-10 px-3 text-sm"
          >
            <option value="">Выберите направление</option>
            {directions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <Input
            placeholder="Название базы"
            value={newBaseName}
            onChange={(e) => setNewBaseName(e.target.value)}
            className={inputClass()}
          />
          <PrimaryButton
            onClick={addBase}
            disabled={!newBaseDirectionId || !newBaseName.trim()}
          >
            <Plus className="w-4 h-4" />
            Добавить
          </PrimaryButton>
        </div>

        <div className="space-y-2">
          {bases.length === 0 ? (
            <div className="text-sm text-(--app-faint) text-center py-4">
              Пока нет курортных баз
            </div>
          ) : (
            bases.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-(--app-border) bg-(--app-panel)"
              >
                {editingBaseId === b.id ? (
                  <>
                    <Input
                      value={editingBaseName}
                      onChange={(e) => setEditingBaseName(e.target.value)}
                      className={inputClass() + " flex-1"}
                    />
                    <GhostIconButton onClick={() => saveBase(b.id)} title="Сохранить">
                      <Save className="w-4 h-4" />
                    </GhostIconButton>
                    <GhostIconButton
                      onClick={() => {
                        setEditingBaseId(null);
                        setEditingBaseName("");
                      }}
                      title="Отменить"
                    >
                      <X className="w-4 h-4" />
                    </GhostIconButton>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-(--app-fg) truncate">{b.name}</div>
                      <div className="text-[11px] text-(--app-faint) truncate">
                        {b.direction_name ??
                          directions.find((d) => d.id === b.direction_id)?.name ??
                          "—"}
                      </div>
                    </div>
                    <GhostIconButton
                      onClick={() => {
                        setEditingBaseId(b.id);
                        setEditingBaseName(b.name);
                      }}
                      title="Редактировать"
                    >
                      <Pencil className="w-4 h-4" />
                    </GhostIconButton>
                    <GhostIconButton onClick={() => deleteBase(b.id)} title="Удалить" danger>
                      <Trash2 className="w-4 h-4" />
                    </GhostIconButton>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard title="Пункты услуг" icon={Wallet}>
        <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1.4fr_1fr_1fr_auto] gap-2 mb-4">
          <select
            value={newServiceBaseId}
            onChange={(e) => setNewServiceBaseId(e.target.value)}
            className="bg-(--app-panel) border border-(--app-border) text-(--app-fg) rounded-xl h-10 px-3 text-sm"
          >
            <option value="">Выберите базу</option>
            {bases.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
                {b.direction_name ? ` — ${b.direction_name}` : ""}
              </option>
            ))}
          </select>
          <Input
            placeholder="Название услуги"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            className={inputClass()}
          />
          <Input
            type="number"
            min="0"
            placeholder="Цена взр."
            value={newServiceAdult}
            onChange={(e) => setNewServiceAdult(e.target.value)}
            className={inputClass()}
          />
          <Input
            type="number"
            min="0"
            placeholder="Цена реб."
            value={newServiceChild}
            onChange={(e) => setNewServiceChild(e.target.value)}
            className={inputClass()}
          />
          <PrimaryButton
            onClick={addService}
            disabled={!newServiceBaseId || !newServiceName.trim()}
          >
            <Plus className="w-4 h-4" />
            Добавить
          </PrimaryButton>
        </div>

        <div className="space-y-2">
          {services.length === 0 ? (
            <div className="text-sm text-(--app-faint) text-center py-4">
              Пока нет услуг
            </div>
          ) : (
            services.map((s) => {
              const base = bases.find((b) => b.id === s.base_id);
              return (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-2.5 rounded-2xl border border-(--app-border) bg-(--app-panel)"
                >
                  {editingServiceId === s.id ? (
                    <>
                      <Input
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService((p) => ({ ...p, name: e.target.value }))
                        }
                        className={inputClass() + " flex-1"}
                      />
                      <Input
                        type="number"
                        min="0"
                        placeholder="Взр."
                        value={editingService.price_adult}
                        onChange={(e) =>
                          setEditingService((p) => ({ ...p, price_adult: e.target.value }))
                        }
                        className={inputClass() + " sm:w-28"}
                      />
                      <Input
                        type="number"
                        min="0"
                        placeholder="Реб."
                        value={editingService.price_child}
                        onChange={(e) =>
                          setEditingService((p) => ({ ...p, price_child: e.target.value }))
                        }
                        className={inputClass() + " sm:w-28"}
                      />
                      <div className="flex gap-2 justify-end">
                        <GhostIconButton onClick={() => saveService(s.id)} title="Сохранить">
                          <Save className="w-4 h-4" />
                        </GhostIconButton>
                        <GhostIconButton
                          onClick={() => setEditingServiceId(null)}
                          title="Отменить"
                        >
                          <X className="w-4 h-4" />
                        </GhostIconButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-(--app-fg) truncate">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-(--app-faint) truncate">
                          {base?.name ?? s.base_name ?? "—"}
                          {(base?.direction_name ?? s.direction_name) &&
                            ` · ${base?.direction_name ?? s.direction_name}`}
                        </div>
                      </div>
                      <div className="text-xs text-(--app-subtle) flex sm:flex-col sm:text-right gap-3 sm:gap-0">
                        <span>Взр.: {formatPrice(s.price_adult)} ₸</span>
                        <span>Реб.: {formatPrice(s.price_child)} ₸</span>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <GhostIconButton onClick={() => startEditService(s)} title="Редактировать">
                          <Pencil className="w-4 h-4" />
                        </GhostIconButton>
                        <GhostIconButton onClick={() => deleteService(s.id)} title="Удалить" danger>
                          <Trash2 className="w-4 h-4" />
                        </GhostIconButton>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </SectionCard>
    </div>
  );
}
