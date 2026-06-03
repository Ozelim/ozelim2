"use client";
import { motion } from "framer-motion";
import {
  Baby,
  Sparkles,
  Plane,
  MapPin,
  CheckCircle2,
  Users,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import { RequestFormDialog } from "@/components/request-form/request-form";

const conditions = [
  {
    icon: Baby,
    title: "Возраст",
    desc: "Бесплатные авиабилеты оформляются на детей от 2 до 17 лет включительно.",
  },
  {
    icon: ShieldCheck,
    title: "Гражданство",
    desc: "Программа доступна только для детей с гражданством Республики Казахстан.",
  },
  {
    icon: Users,
    title: "Сопровождение",
    desc: "Ребёнок должен лететь в сопровождении совершеннолетнего близкого родственника — родителя, бабушки, дедушки, брата или сестры. С одним взрослым может лететь любое количество детей.",
  },
  {
    icon: Plane,
    title: "Турпакет",
    desc: "Бесплатный детский билет предоставляется только в составе полного турпакета с проживанием.",
  },
];

const destinations = [
  { name: "Алматы", image: "/almighty.webp" },
  { name: "Астана", image: "/satana.jpg" },
  { name: "Шымкент", image: "/shymkent.webp" },
  { name: "Туркестан", image: "/turk-capital.jpg" },
];

const departureCities = [
  "Жезказган",
  "Караганда",
  "Конаев",
  "Кызылорда",
  "Талдыкорган",
  "Тараз",
  "Семей",
  "Туркестан",
  "Усть-Каменогорск",
  "Актау",
  "Актобе",
  "Атырау",
  "Уральск",
  "Кокшетау",
  "Костанай",
  "Павлодар",
  "Петропавловск",
];

const requiredDocs = [
  "Свидетельство о рождении ребёнка",
  "Документ, удостоверяющий личность взрослого",
  "Копия договора на туристическое обслуживание (типовой договор с подписью и печатью)",
  "Все способы оплаты: приходный кассовый ордер, фискальный чек или банковский перевод",
  "Посадочные талоны в обе стороны на ребёнка (электронные или сканы). Для Air Astana и Fly Arystan — справка-подтверждение с сайта а/к (выдаётся через 3 дня после поездки)",
];

const extraDocs = [
  "Если ребёнок летит с близким родственником — нотариально заверенная доверенность и документ родителя",
  "Документы, подтверждающие родство (свидетельство о рождении родителя при поездке с бабушкой/дедушкой, либо свидетельство сопровождающего при поездке с братом/сестрой)",
  "Для лиц без гражданства — копия разрешения на постоянное жительство в РК (ребёнок должен быть лицом без гражданства, гражданство другой страны не принимается)",
];

const algorithm = [
  "Заявка оформляется в системе с пометкой Kids Go Free",
  "Подтверждение заявки",
  "Предоставление документов в личном кабинете к забронированной заявке",
  "Получение документов",
];

const importantNotes = [
  "Все документы должны быть предоставлены в течение 3 дней после подтверждения заявки. Посадочные талоны — в течение 3 дней после окончания поездки.",
  "Документы отправляются на kidsgofree@kompastour.com в PDF-формате, каждый файл отдельно. В теме письма обязательно указывать номер заявки.",
  "При непредоставлении документов в срок туроператор вправе пересчитать тур по полной стоимости без учёта акционных авиабилетов.",
  "Аннуляция заявки невозможна: в случае отказа от тура штрафные санкции оплачивает турагентство, в том числе детский билет.",
];

export default function KidsGoFreePage() {
  return (
    <main className="pt-20">
      {/* Header backdrop to keep marquee from sliding under the navbar */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0f3d0f] z-[999] pointer-events-none" />
      <MarqueeTicker />

      {/* Intro */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-(--site-accent)/40 bg-(--site-accent)/10 text-(--site-accent) text-xs uppercase tracking-widest mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Государственная программа
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold text-app-fg leading-tight mb-5"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Kids Go Free —{" "}
                <span className="text-gradient">дети летают бесплатно</span> по Казахстану
              </h1>
              <p className="text-app-subtle leading-relaxed mb-4">
                Программа выгодных семейных путешествий, запущенная в Казахстане в январе 2022 года.
                С её помощью турагентство оформляет полный турпакет (авиаперелёт, проживание и др.)
                и оплачивает тур за минусом стоимости детского авиабилета.
              </p>
              <div className="rounded-2xl border border-(--site-accent)/25 bg-[#0a2a0a]/40 p-5 text-sm text-app-subtle leading-relaxed">
                В 2023 году благодаря Kids Go Free 2 000 детей бесплатно слетали на отдых. Родители
                сэкономили <span className="text-(--site-accent) font-semibold">90 млн тенге</span> на авиабилетах.
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-(--site-accent)/30 bg-linear-to-br from-(--site-gradient-from)/20 via-(--site-accent-bright)/15 to-(--site-gradient-to)/20 p-10 aspect-square flex flex-col items-center justify-center gap-5 text-center">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], y: [0, -6, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full bg-(--site-accent)/20 border border-(--site-accent)/40 flex items-center justify-center"
              >
                <Plane className="w-12 h-12 text-(--site-accent)" />
              </motion.div>
              <div
                className="text-3xl font-bold text-app-fg"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Kids Go Free
              </div>
              <div className="text-app-subtle text-sm max-w-xs">
                Бесплатные детские авиабилеты при покупке тура с проживанием по Казахстану
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conditions */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Правила и условия
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-app-fg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Основные условия программы
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {conditions.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 card-hover"
              >
                <div className="w-11 h-11 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center mb-4">
                  <c.icon className="w-5 h-5 text-(--site-accent)" />
                </div>
                <h3
                  className="text-app-fg font-bold text-lg mb-2"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {c.title}
                </h3>
                <p className="text-app-subtle text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 rounded-2xl border border-(--site-accent)/30 bg-(--site-accent)/5 p-5 text-center text-app-subtle text-sm"
          >
            В программе Kids Go Free нет ограничений по количеству детей и частоте путешествий.
          </motion.div>
        </div>
      </section>

      {/* Destinations */}
      <section className="px-6 pb-16 bg-[#0a2a0a]/20">
        <div className="max-w-6xl mx-auto py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Направления
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-app-fg mb-3"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Куда летим
            </h2>
            <p className="text-app-subtle max-w-2xl mx-auto">
              Kids Go Free распространяется только на путешествия внутри Казахстана. Детские билеты
              бесплатны исключительно при покупке тура с проживанием.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {destinations.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative overflow-hidden rounded-2xl border border-(--site-accent)/30 bg-cover bg-center p-6 flex flex-col items-center gap-3 text-center"
                style={{ backgroundImage: `url('${d.image}')` }}
              >
                {/* Лёгкое затемнение — чтобы текст читался, но картинка оставалась яркой */}
                <div className="absolute inset-0 bg-black/25" />
                <MapPin className="relative w-6 h-6 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]" />
                <div
                  className="relative text-2xl font-bold text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {d.name}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6">
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
              Города вылета
            </div>
            <div className="flex flex-wrap gap-2">
              {departureCities.map((city) => (
                <span
                  key={city}
                  className="px-3 py-1.5 rounded-full border border-(--site-accent)/25 bg-(--site-accent)/5 text-app-fg text-sm"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Документы
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-app-fg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Что нужно подготовить
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-(--site-accent)" />
                </div>
                <h3
                  className="text-xl font-bold text-app-fg"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Обязательные документы
                </h3>
              </div>
              <ul className="space-y-3">
                {requiredDocs.map((doc) => (
                  <li key={doc} className="flex gap-3 text-app-subtle text-sm leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-(--site-accent) mt-0.5 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-7"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-(--site-accent)" />
                </div>
                <h3
                  className="text-xl font-bold text-app-fg"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Дополнительные документы
                </h3>
              </div>
              <ul className="space-y-3">
                {extraDocs.map((doc) => (
                  <li key={doc} className="flex gap-3 text-app-subtle text-sm leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-(--site-accent) mt-0.5 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking algorithm */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Алгоритм
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-app-fg"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Как забронировать
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {algorithm.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-linear-to-br from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <ClipboardCheck className="w-5 h-5 text-(--site-accent) mb-3 ml-7" />
                <p className="text-app-fg text-sm leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <h3
                className="text-xl font-bold text-app-fg"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Важно знать
              </h3>
            </div>
            <ul className="space-y-3">
              {importantNotes.map((note) => (
                <li key={note} className="flex gap-3 text-app-subtle text-sm leading-relaxed">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA — single contact form */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-(--site-accent)/30 bg-linear-to-br from-(--site-gradient-from)/20 via-(--site-accent-bright)/10 to-(--site-gradient-to)/20 p-10 md:p-14 text-center"
          >
            <motion.div
              aria-hidden
              className="absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/10 to-transparent pointer-events-none"
              animate={{ x: ["-120%", "420%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10 flex flex-col items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-(--site-accent)/15 border border-(--site-accent)/40 flex items-center justify-center">
                <Baby className="w-7 h-7 text-(--site-accent)" />
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-app-fg"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Подберём лучший тур по вашим запросам
              </h2>
              <p className="text-app-subtle max-w-xl">
                Оставьте заявку — менеджер свяжется с вами, расскажет о доступных датах и поможет
                оформить путешествие по программе Kids Go Free.
              </p>
              <RequestFormDialog
                kind="kids_go_free"
                source="/kidsgofree"
                context={{ program: "Kids Go Free" }}
                trigger={
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-9 py-4 rounded-full bg-linear-to-r from-(--site-gradient-from) to-(--site-gradient-to) text-(--site-on-accent) font-bold text-sm tracking-widest uppercase shadow-[0_0_24px_var(--site-shadow-glow)]"
                  >
                    Оставить заявку
                  </motion.button>
                }
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
