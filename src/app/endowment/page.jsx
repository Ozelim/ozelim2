"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/lib/use-current-user";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import {
  Check,
  ArrowRight,
  Building2,
  Scale,
  Target,
  Eye,
  Database,
  SearchX,
  Plane,
  HelpCircle,
  TrendingDown,
  Sprout,
  ShieldCheck,
  Users,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

const missionItems = [
  "Работы Ассоциации туристов Казахстана",
  "Внутренних туристических инициатив",
  "Цифровых и социальных проектов",
  "Образовательных программ и инфотуров",
  "Социальных туров для детей и пенсионеров",
];

const advantageItems = [
  "Средства сохраняются и приумножаются",
  "Пожертвования не расходуются — работает только доход от них",
  "Поддержка только одобренных проектов с социальным эффектом",
  "Открытая ежегодная финансовая отчётность",
];

const problemCards = [
  {
    icon: Database,
    title: "Отсутствие единой базы данных",
    desc: "Отсутствие единой базы данных санаториев Казахстана.",
  },
  {
    icon: SearchX,
    title: "Нет автоматизированного подбора",
    desc: "Отсутствие централизованной автоматизированной системы подбора санаториев по медицинским показаниям.",
  },
  {
    icon: Plane,
    title: "Утечка клиентов за рубеж",
    desc: "До 40% пациентов выбирают санатории России, Узбекистана, Турции и других стран.",
  },
  {
    icon: TrendingDown,
    title: "Нераскрытый потенциал",
    desc: "Более 60% ресурсов отечественных санаториев недозагружены.",
  },
  {
    icon: HelpCircle,
    title: "Сложность выбора",
    desc: "70% пациентов не знают, какой санаторий подходит под их диагноз.",
  },
  {
    icon: Users,
    title: "Рост спроса и неэффективность",
    desc: "Всё больше людей нуждается в восстановлении, но не знают, куда обращаться.",
  },
];

const characteristics = [
  "Любое юридическое лицо или индивидуальный предприниматель может стать участником Фонда по договору для получения преимуществ, которое даст возможность предоставлять свои услуги или товар со скидкой для пользователей платформы oz-elim.kz, что позволит стоимости услуг и товаров стать более доступными и привлекательными для пользователей.",
  "Уникальной особенностью Фонда является то, что основной капитал Фонда не тратится, а сохраняется как инвестиционного дохода. Это позволяет вкладчикам при желании забрать «тело» вклада по истечению срока договора.",
  "Физические лица также могут быть участниками Фонда, если являются пользователями платформы oz-elim.kz. При этом они получают преимущества предоставленные Фондом и для них сохраняются все условия.",
  "Фонд организован таким образом, что его структура, методика создания и функционирования, а также концепция развития защищены авторским правом. Это гарантирует уникальность фонда, исключает возможность создания аналогичных фондов без разрешения и ведома автора. Концепция развития Фонда направлена на создание устойчивой и эффективной структуры, которая обеспечивает долгосрочную финансовую стабильность и есть инструмент для эффективного мониторинга и поддержки благотворительных программ согласно их Уставам.",
  "Эндаумент фонд Ассоциации туристов Казахстана \"OZ ELIM\" имеет строгие правила управления и отчётности, чтобы обеспечить прозрачность и соблюдение целей Фонда. Руководство Фонда на ежегодной и регулярной основе по итогам деятельности будет публиковать в открытом доступе отчёт о его работе.",
  "Любая некоммерческая организация (НКО) или сообщество юридических лиц, деятельность которых связана с социальным предпринимательством или инновационными услугами населению Казахстана в любой другой сфере может открыть подобный Фонд, при содействии автора системы создания и управления Эндаумент фондами и Председателя Султанова Искандера Сериковича, так как только у него имеется исключительное авторское право на открытые таким фондам в Республике Казахстан.",
  "Открытие Эндаумент Фондов включено в одно из самых послании президента и в Казахстане данное направление имеет правительственную поддержку. Это позволяет иметь долгосрочную перспективу развития для обеспечения финансовой устойчивости нашей организации на длительный период.",
  "В мире местные сообщества (Ассоциации, общественные объединения, некоммерческие организации) создают Эндаумент фонды, который обеспечивают постоянную работу для инновационной выбранной организации, поддержку благотворительных и социальных программ согласно их Уставам (образование, медицина, культура, наука и т.д.).",
];

export default function EndowmentPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [investType, setInvestType] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { user } = useCurrentUser();

  useEffect(() => {
    if (!user || submitted) return;
    const full = [user.name, user.surname].filter(Boolean).join(" ").trim();
    setName((cur) => cur || full);
    setPhone((cur) => cur || user.phone || "");
  }, [user, submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || submitted) return;
    setSubmitError("");

    if (!name.trim()) {
      setSubmitError("Укажите ФИО");
      return;
    }
    if (!phone.trim()) {
      setSubmitError("Укажите телефон или WhatsApp");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "endowment",
          name: name.trim(),
          phone: phone.trim(),
          message: comment.trim() || null,
          source: "/endowment",
          data: { investType: investType || null },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Ошибка ${res.status}`);
      setSubmitted(true);
      setName("");
      setPhone("");
      setInvestType("");
      setComment("");
    } catch (err) {
      setSubmitError(err.message || "Не удалось отправить заявку");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-20">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0f3d0f] z-[999] pointer-events-none" />
      <MarqueeTicker />

      {/* Intro */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center"
          >
            <div>
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                О фонде
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold text-app-fg mb-6 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Эндаумент фонд при{" "}
                <span className="text-gradient">Ассоциации туристов Казахстана</span>
              </h2>
              <p className="text-app-muted leading-relaxed mb-4">
                Эндаумент фонд Ассоциации туристов Казахстана «OzElim» — это
                целевой фонд, созданный для долгосрочного финансирования
                туристических программ. Основной особенностью фонда является
                то, что его капитал не расходуется, а инвестируется.
              </p>
              <p className="text-app-subtle leading-relaxed">
                Доходы от этих инвестиций направляются на поддержку деятельности
                Ассоциации и конкретные программы. Фонд позволяет Ассоциации
                планировать своё будущее, минимизировать финансовые риски и
                обеспечивать стабильное развитие независимо от текущих
                экономических условий.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 p-6">
                <Building2 className="w-7 h-7 text-(--site-accent) mb-3" />
                <div className="text-app-faint text-xs uppercase tracking-widest mb-1">
                  Форма
                </div>
                <div className="text-app-fg font-semibold">
                  Некоммерческая организация
                </div>
              </div>
              <div className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 p-6">
                <Scale className="w-7 h-7 text-(--site-accent) mb-3" />
                <div className="text-app-faint text-xs uppercase tracking-widest mb-1">
                  Юрисдикция
                </div>
                <div className="text-app-fg font-semibold leading-snug">
                  Официальный фонд, зарегистрирован на платформе МФЦА
                  (Международный финансовый центр «Астана»).
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documents */}
      <section className="px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Свидетельство о регистрации",
                badge: "e-gov.kz",
                desc: "Государственная регистрация юридического лица «OzElim».",
                img: "/end-gosreg.jpg",
              },
              {
                title: "Сертификат AFSA",
                badge: "AFSA",
                desc: "Регистрационный сертификат на платформе МФЦА «Астана».",
                img: "/end-cert.jpg",
              },
            ].map((doc) => (
              <motion.a
                key={doc.title}
                href={doc.img}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 flex flex-col gap-3 card-hover cursor-pointer hover:border-(--site-accent)/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="text-app-fg text-2xl font-bold"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {doc.title}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-(--site-accent)/30 text-(--site-accent) bg-(--site-accent)/10">
                    {doc.badge}
                  </span>
                </div>
                <p className="text-app-subtle text-sm leading-relaxed">
                  {doc.desc}
                </p>
                <div className="mt-2 aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={doc.img}
                    alt={doc.title}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Advantages */}
      <section className="py-16 px-6 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <Target className="w-6 h-6 text-(--site-accent)" />
              <h3
                className="text-2xl font-bold text-app-fg"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Миссия фонда
              </h3>
            </div>
            <p className="text-app-subtle text-sm mb-5">
              Обеспечение устойчивых финансовых ресурсов для поддержки:
            </p>
            <ul className="space-y-3">
              {missionItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-app-muted text-sm"
                >
                  <span className="mt-1 w-5 h-5 rounded-full bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-(--site-accent)" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <Eye className="w-6 h-6 text-(--site-accent)" />
              <h3
                className="text-2xl font-bold text-app-fg"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Преимущества и прозрачность
              </h3>
            </div>
            <p className="text-app-subtle text-sm mb-5">
              Эндаумент фонд — это финансовый фундамент устойчивого развития,
              который обеспечивает долгосрочную стабильность без рисков и
              прямых финансовых потерь.
            </p>
            <ul className="space-y-3">
              {advantageItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-app-muted text-sm"
                >
                  <span className="mt-1 w-5 h-5 rounded-full bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-(--site-accent)" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Innovation */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
              Инновация и социальная миссия
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-app-fg mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Инновация и социальная миссия
            </h2>
            <p className="text-app-subtle leading-relaxed">
              Использование Эндаумент модели в сфере туризма — редкость в
              Казахстане и делает проект пионерским в сочетании технологий,
              сервиса и социального вклада. Часть из инвестиционных доходов в
              будущем позволит предоставлять скидки на туры и санаторные путёвки
              для подключённых платформ, включая социально уязвимые категории:
              пенсионеров, многодетные семьи и людей с ограниченными
              возможностями здоровья.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project highlight */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-(--site-accent)/30 bg-linear-to-br from-(--site-accent)/10 to-transparent p-8 md:p-10 text-center"
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-app-fg mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Открыт сбор на социально значимый проект
              <br />
              <span className="text-gradient whitespace-nowrap">«Цифровой ассистент Elim-AI»</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex gap-4">
                <Sprout className="w-7 h-7 text-(--site-accent) shrink-0" />
                <div>
                  <div className="text-app-faint text-xs uppercase tracking-widest mb-1">
                    Проект
                  </div>
                  <p className="text-app-muted text-sm leading-relaxed">
                    Единый реестр санаториев Казахстана и цифровой ассистент
                    по подбору санаториев по заболеваниям и патологиям.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Target className="w-7 h-7 text-(--site-accent) shrink-0" />
                <div>
                  <div className="text-app-faint text-xs uppercase tracking-widest mb-1">
                    Цель
                  </div>
                  <p className="text-app-muted text-sm leading-relaxed">
                    Решение проблемы Государственного масштаба, напрямую
                    влияющей на качество жизни населения, экономику и развитие
                    внутреннего туризма.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem cards grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {problemCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/60 p-6 card-hover"
            >
              <card.icon className="w-7 h-7 text-(--site-accent) mb-3" />
              <h4
                className="text-app-fg font-bold text-lg mb-2"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {card.title}
              </h4>
              <p className="text-app-subtle text-sm leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cost banner + form */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6 text-center border-b border-[#1a6b1a]/25">
              <div className="text-app-subtle text-sm mb-2">
                Стоимость проекта: 14 200 000 ₸
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold text-app-fg"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Поддержите идею создания полезного сервиса для всех!
              </h3>
              <p className="text-app-subtle text-sm mt-3">
                Оставьте заявку на участие, и наша команда свяжется с вами.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-8 py-7 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-app-faint text-xs uppercase tracking-widest mb-1.5 block">
                    ФИО
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя и фамилия"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-app-fg placeholder-white/25 text-sm focus:outline-none focus:border-(--site-accent)/50"
                  />
                </div>
                <div>
                  <label className="text-app-faint text-xs uppercase tracking-widest mb-1.5 block">
                    Телефон / WhatsApp
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (000) 000-00-00"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-app-fg placeholder-white/25 text-sm focus:outline-none focus:border-(--site-accent)/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-app-faint text-xs uppercase tracking-widest mb-1.5 block">
                  Тип инвестирования
                </label>
                <select
                  value={investType}
                  onChange={(e) => setInvestType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-app-fg text-sm focus:outline-none focus:border-(--site-accent)/50"
                >
                  <option value="">Выберите тип инвестирования</option>
                  <option value="business">Бизнес-партнёрство</option>
                  <option value="private">Частное пожертвование</option>
                  <option value="org">Юридическое лицо / НКО</option>
                </select>
              </div>

              <div>
                <label className="text-app-faint text-xs uppercase tracking-widest mb-1.5 block">
                  Ваш комментарий или предложение
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Расскажите нам больше о ваших целях инвестирования..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-app-fg placeholder-white/25 text-sm focus:outline-none focus:border-(--site-accent)/50 resize-none"
                />
              </div>

              {submitError && (
                <p className="text-sm text-red-400 text-center">{submitError}</p>
              )}
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-12 h-12 rounded-full bg-(--site-accent)/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-(--site-accent)" />
                  </div>
                  <p className="text-app-fg font-semibold">Заявка отправлена!</p>
                  <p className="text-app-subtle text-sm text-center">
                    Наша команда свяжется с вами в ближайшее время.
                  </p>
                </div>
              ) : (
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={submitting ? {} : { scale: 1.02 }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      Отправить заявку
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Main characteristics */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2
              className="text-4xl md:text-5xl font-bold text-app-fg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Основные характеристики Фонда
            </h2>
          </motion.div>

          <div className="space-y-4">
            {characteristics.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 text-app-muted text-sm leading-relaxed"
              >
                {text}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation CTA — закомментировано
      <section className="px-6 pb-20">...</section>
      */}

      {/* Authorship */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-(--site-accent)" />
                <h3
                  className="text-2xl md:text-3xl font-bold text-app-fg"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Авторское право
                </h3>
              </div>
              <p className="text-app-subtle text-sm leading-relaxed">
                Султанов Искандер Серикович — директор юридической компании
                «GRT COMPANY», автор эксклюзивной системы создания и управления
                Эндаумент фондами в Казахстане, автор инновационной методики
                управления человеческими ресурсами. Международный «complaints
                officer», юрист Ассоциации туристов Казахстана «OzElim».
              </p>
            </div>
            <div className="w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden border border-(--site-accent)/30 shrink-0 mx-auto md:mx-0">
              <Image
                src="/abt-isk.jpeg"
                alt="Султанов Искандер Серикович"
                width={192}
                height={240}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
