"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/lib/use-current-user";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import {
  Scale,
  Gavel,
  Globe2,
  FileText,
  Landmark,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Check,
  HandCoins,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

const functions = [
  {
    icon: ShieldCheck,
    title: "Защита прав потребителей в сфере внутреннего туризма",
    desc: "Это важный аспект, который включает в себя обеспечение соблюдения прав клиентов, путешествующих внутри страны. В рамках этой защиты рассматриваются ключевые моменты: предоставление достоверной информации, качество услуг, разрешение споров, возмещение ущерба, а также представление интересов туриста в суде и других органах.",
  },
  {
    icon: Gavel,
    title: "Представительство в суде",
    desc: "Это процесс, при котором юрист или адвокат представляет интересы юридических лиц в судебном разбирательстве. Члены Ассоциации могут рассчитывать на профессиональную юридическую помощь в любых судебных разбирательствах, связанных с их деятельностью.",
  },
  {
    icon: Globe2,
    title: "Международное сопровождение",
    desc: "Это комплекс услуг, который обеспечивает поддержку и консультации для клиентов, занимающихся международной деятельностью. Это может включать в себя помощь в вопросах, связанных с международным правом, налогами, договорами, а также сопровождение в юридических вопросах и урегулировании споров между сторонами.",
  },
  {
    icon: Landmark,
    title: "Оформление документов на земельный участок по Казахстану",
    desc: "Это профессиональная юридическая помощь в получении документов на земельный участок, который включает в себя несколько этапов: правильная подача заявки на получение земельного участка, подготовка и сбор необходимых документов, процесс получения разрешения на землю, получение кадастрового паспорта на землю и регистрация прав на него в соответствующем органе.",
  },
  {
    icon: HandCoins,
    title: "Получение кредитов и Грантов для туристических направлений",
    desc: "Оформление и разработка документов для получения льготных кредитов и Грантов для туристических направлений является важным шагом для развития туристических проектов. Этот процесс включает в себя несколько ключевых этапов: подготовка бизнес-планов, составление необходимых заявок, юридически правильная подача заявок в государственные и частные организации, предоставляющие кредиты и Гранты, получение всех необходимых разрешений и лицензий для ведения деятельности, подготовка и согласование договоров, следование инструкциям и согласование всех условий с потенциальными инвесторами или кредиторами.",
  },
];

const additionalServices = [
  {
    title: "Консультации и правовая поддержка",
    body: (
      <>
        <p className="mb-3">
          Юридическая консультация является основополагающей частью правовой
          поддержки членов Ассоциации.
        </p>
        <p className="mb-2 text-app-muted">Особое внимание уделяется следующим аспектам:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-app-muted">
          <li>Разъяснение норм законодательства в сфере туризма;</li>
          <li>Предоставление рекомендаций по правовому оформлению сделок;</li>
          <li>Помощь в решении правовых вопросов.</li>
        </ul>
        <p className="mt-3">
          Консультации позволяют членам Ассоциации получать актуальную
          информацию о своих правах и обязанностях.
        </p>
      </>
    ),
  },
  {
    title: "Представление интересов в судах",
    body: (
      <p>
        Юристы Центра представляют интересы членов Ассоциации в судах всех
        инстанций — от подготовки доказательной базы до участия в заседаниях
        и обжалования решений.
      </p>
    ),
  },
  {
    title: "Разработка и анализ договоров",
    body: (
      <p>
        Подготовка, проверка и сопровождение договоров с туристическими
        агентствами, гостиницами, перевозчиками и партнёрами — с учётом
        отраслевых рисков и судебной практики.
      </p>
    ),
  },
  {
    title: "Защита прав потребителей",
    body: (
      <p>
        Помощь туристам при нарушении их прав на качество, безопасность и
        информацию: претензионная работа, возврат стоимости услуг и
        компенсация ущерба.
      </p>
    ),
  },
];

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 overflow-hidden divide-y divide-[#1a6b1a]/20">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left text-app-fg hover:bg-[#0a2a0a]/60 transition-colors"
            >
              <span className="font-semibold">
                {i + 1}. {item.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-(--site-accent) shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-sm text-app-subtle leading-relaxed">
                    {item.body}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function AssociationPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
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
      setSubmitError("Укажите имя");
      return;
    }
    if (!phone.trim()) {
      setSubmitError("Укажите телефон");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "legal_consult",
          name: name.trim(),
          phone: phone.trim(),
          message: topic.trim() || null,
          source: "/legal",
          data: { topic: topic.trim() || null },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Ошибка ${res.status}`);
      setSubmitted(true);
      setName("");
      setPhone("");
      setTopic("");
    } catch (err) {
      setSubmitError(err.message || "Не удалось отправить заявку");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0f3d0f] z-[999] pointer-events-none" />
      <MarqueeTicker />

      {/* Director intro */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[auto_1fr] gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto lg:mx-0"
          >
            <div className="w-56 h-72 rounded-3xl overflow-hidden border border-(--site-accent)/30">
              <Image
                src="/abt-isk.jpeg"
                alt="Султанов Искандер Серикович"
                width={224}
                height={288}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mt-4">
              <div
                className="text-app-fg font-bold text-lg"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Султанов Искандер Серикович
              </div>
              <div className="text-app-faint text-xs mt-1">
                Юрист Ассоциации, директор «GRT COMPANY»
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
              Центр правовой защиты
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-app-fg mb-6 leading-tight"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Центр правовой защиты внутренних туристов{" "}
              <span className="text-gradient">Казахстана</span>
            </h2>
            <p className="text-app-muted leading-relaxed mb-4">
              Казахстанские туристы на мировом рынке отличаются требовательностью
              к качеству оказываемых услуг в сфере туризма, на которое каждый
              имеет право. Законодательством закреплены основные права
              потребителя: право на качество и безопасность услуги, на
              получение необходимой информации об услуге, а также право на
              государственную и общественную защиту в случае нарушения его прав
              и интересов.
            </p>
            <p className="text-app-subtle leading-relaxed">
              Юрист с многолетней профессиональной работой в правовой системе,
              директор юридической компании «GRT COMPANY», автор эксклюзивной
              системы создания и управления Эндаумент фондами в Казахстане,
              автор инновационной методики управления человеческими ресурсами,
              профессиональный эксперт по физиогномике. Международный «complaints
              officer» — уполномоченный по рассмотрению жалоб от пользователей,
              юрист Ассоциации туристов Казахстана «OzElim».
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission banner */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-8 items-center"
          >
            <div className="w-44 h-44 rounded-2xl overflow-hidden border border-(--site-accent)/30 shrink-0 mx-auto md:mx-0">
              <Image
                src="/leg-1.png"
                alt="Члены Ассоциации Öz Elim"
                width={176}
                height={176}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-app-muted leading-relaxed mb-4">
                Члены Ассоциации «Öz Elim» на выгодных условиях имеют уникальный
                доступ к широкому спектру юридических услуг, которые направлены
                на защиту их прав, поддержку туристических проектов, а также
                содействие развитию туристической отрасли в Казахстане.
              </p>
              <p className="text-app-subtle leading-relaxed text-sm">
                Центр правовой защиты внутренних туристов Казахстана предлагает
                услуги по защите прав граждан, путешествующих внутри страны.
                Центр предоставляет консультации по вопросам соблюдения
                туристических прав, урегулирования споров с туристическими
                агентствами, гостиницами и другими предприятиями сферы туризма.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Functions list */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-app-fg mb-8"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Основные функции Центра
          </motion.h2>
          <div className="space-y-5">
            {functions.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 md:p-7 flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-(--site-accent)" />
                </div>
                <div>
                  <h3
                    className="text-app-fg font-bold text-lg mb-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-app-subtle text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional services accordion */}
      <section className="px-6 pb-20 bg-[#0a2a0a]/20">
        <div className="max-w-4xl mx-auto py-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-app-fg mb-8 text-center"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Дополнительные юридические услуги
          </motion.h2>
          <Accordion items={additionalServices} />
        </div>
      </section>

      {/* CTA form */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-(--site-accent)/30 bg-linear-to-br from-(--site-accent)/10 to-transparent p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <h3
                className="text-3xl md:text-4xl font-bold text-app-fg mb-3"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Профессиональное решение Ваших проблем!
              </h3>
              <p className="text-app-subtle text-sm">
                Оставьте заявку — мы свяжемся с вами и подберём подходящий формат
                юридической поддержки.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-3 gap-3"
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                disabled={submitting || submitted}
                className="px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-app-fg placeholder-white/30 text-sm focus:outline-none focus:border-(--site-accent)/50 disabled:opacity-60"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                disabled={submitting || submitted}
                className="px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-app-fg placeholder-white/30 text-sm focus:outline-none focus:border-(--site-accent)/50 disabled:opacity-60"
              />
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Тема обращения"
                disabled={submitting || submitted}
                className="px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-app-fg placeholder-white/30 text-sm focus:outline-none focus:border-(--site-accent)/50 disabled:opacity-60"
              />
              {submitError && (
                <p className="md:col-span-3 text-sm text-red-400 text-center">
                  {submitError}
                </p>
              )}
              {submitted ? (
                <div className="md:col-span-3 mt-2 py-3.5 rounded-xl border border-(--site-accent)/40 bg-(--site-accent)/10 flex items-center justify-center gap-2 text-(--site-accent) font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Заявка отправлена — мы свяжемся с вами
                </div>
              ) : (
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={submitting ? {} : { scale: 1.02 }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                  className="md:col-span-3 mt-2 py-3.5 rounded-xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      Оставить заявку
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
