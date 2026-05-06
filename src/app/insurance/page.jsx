"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  PhoneCall,
  Wallet,
  PiggyBank,
  GraduationCap,
  UserCheck,
  Target,
  Award,
  ArrowRight,
  Check,
  Image as ImageIcon,
  BadgeCheck,
} from "lucide-react";

const protectionCards = [
  {
    icon: ShieldCheck,
    title: "Страхование жизни туриста",
    desc: "На сегодняшний день страхование туриста является обязательным требованием при въезде в многие страны мира, и в Казахстане страхование жизни туриста не является исключением. Для любителей путешествий мы предлагаем краткосрочное туристическое страхование, которое позволит защитить вас и ваших близких от непредвиденных ситуаций в пути: оно покроет расходы на экстренную медицинскую помощь при травмах, компенсирует расходы на лечение и поможет в решении других бытовых вопросов.",
  },
  {
    icon: FileText,
    title: "Как получить туристическое страхование?",
    desc: "Этот процесс можно осуществить самостоятельно, обратившись к представителю и консультанту страховой компании «Халык-Life», Мадине. С ней вы сможете обсудить страховые программы, выбрать наиболее выгодный вариант и рассмотреть способы оплаты. Персональный представитель страховой компании поможет оформить страховой договор и отправит документы в цифровом формате на вашу электронную почту, который имеет такую же юридическую силу, как и оформленные на бумаге.",
  },
  {
    icon: AlertTriangle,
    title: "Что не покрывает туристическое страхование?",
    list: [
      "Обострение хронических заболеваний — если заболевание было до начала путешествия, и его обострение произошло во время поездки.",
      "Стоматологические услуги, кроме снятия острой боли.",
      "Осложнения во время беременности — если они не связаны с экстренными ситуациями.",
      "Травмы, полученные под воздействием алкоголя или запрещённых веществ — если травма была получена под воздействием алкоголя или наркотиков, страховка не покрывает расходы.",
    ],
  },
  {
    icon: PhoneCall,
    title: "Что делать, если наступил страховой случай?",
    desc: "В этом случае клиент или его родственники должны напрямую связаться с сервисным центром страховой компании. Оператору необходимо предоставить следующие данные:",
    list: [
      "полное имя",
      "срок действия страхового полиса",
      "место нахождения",
      "контактный номер застрахованного",
      "краткая информация о произошедшем событии",
    ],
    footer: "Затем необходимо следовать указаниям сотрудника сервисного центра.",
  },
];

const agentBenefits = [
  {
    icon: Wallet,
    title: "Заработная плата",
    desc: "Вы сами решаете, сколько будете работать и сколько зарабатывать.",
  },
  {
    icon: PiggyBank,
    title: "Страхование на пенсию",
    desc: "Накопительная программа, обеспечивающая стабильное будущее.",
  },
  {
    icon: GraduationCap,
    title: "Обучение и поддержка",
    desc: "Профессиональное обучение и помощь на каждом этапе работы.",
  },
];

const incomeWays = [
  "Личные продажи агента",
  "Обучение агентов и развитие агентской структуры",
  "Подарки от компании",
  "Специальные акции от компании",
];

export default function InsurancePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");

  return (
    <main>
      <Hero
        title="Страхование"
        highlight="жизни"
        subtitle="В случае непредвиденных событий обязательное страхование обеспечивает защиту от финансовых потерь."
        badge="Halyk-Life"
      />
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
                О компании
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                АО <span className="text-gradient">«Халық-Life»</span> — лидер страхования жизни в Республике Казахстан
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                В случае непредвиденных событий обязательное страхование обеспечивает защиту от финансовых потерь. Например, страхование жизни и здоровья помогает получить помощь или компенсировать затраты в случае непредвиденного несчастного случая.
              </p>
              <p className="text-white/60 leading-relaxed">
                АО «Халык-Life» было основано в ноябре 2005 года как дочерняя организация АО «Народный Банк Казахстана». Халык-Life является лидером в отрасли «Страхование жизни» в Республике Казахстан.
              </p>
            </div>

            <div className="aspect-[16/10] rounded-3xl border border-dashed border-[#1a6b1a]/40 bg-[#061506]/60 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-white/20" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Protection cards */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Финансовая защита{" "}
              <span className="text-gradient">необходима каждому!</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {protectionCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-7 card-hover"
              >
                <card.icon className="w-7 h-7 text-(--site-accent) mb-4" />
                <h3
                  className="text-xl md:text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {card.title}
                </h3>
                {card.desc && (
                  <p className="text-white/60 text-sm leading-relaxed mb-3">
                    {card.desc}
                  </p>
                )}
                {card.list && (
                  <ul className="space-y-2.5">
                    {card.list.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-white/70 text-sm leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--site-accent) shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {card.footer && (
                  <p className="text-white/45 text-xs leading-relaxed mt-3">
                    {card.footer}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Representative */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 p-6 md:p-8 grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center"
          >
            <div className="w-full md:w-72 aspect-[4/3] rounded-2xl border border-dashed border-[#1a6b1a]/40 bg-[#061506]/60 flex items-center justify-center shrink-0">
              <ImageIcon className="w-12 h-12 text-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="w-6 h-6 text-(--site-accent)" />
                <span className="text-(--site-accent) text-xs uppercase tracking-widest">
                  Представитель компании
                </span>
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Оразалинова Мадина Төлемысовна
              </h3>
              <p className="text-white/65 text-sm leading-relaxed mb-5">
                Представитель страховой компании «Халык-Life» и консультант по
                всем видам страхования на платформе oz-elim.kz.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Страховая памятка
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Become an agent */}
      <section className="px-6 py-16 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Станьте страховым{" "}
              <span className="text-gradient">агентом!</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {agentBenefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 overflow-hidden card-hover"
              >
                <div className="aspect-[4/3] border-b border-[#1a6b1a]/25 bg-[#061506]/60 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-white/20" />
                </div>
                <div className="p-6">
                  <b.icon className="w-7 h-7 text-(--site-accent) mb-3" />
                  <h4
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {b.title}
                  </h4>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent description */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-7">
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="w-6 h-6 text-(--site-accent)" />
                <h3
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Страховой агент
                </h3>
              </div>
              <p className="text-white/65 text-sm leading-relaxed">
                — это представитель компании, который по договору поручения
                занимается продажей страховых полисов, а также помогает клиенту
                в выборе программы и сборе документов.
              </p>
            </div>

            <div className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-7">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-(--site-accent)" />
                <h3
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  Миссия страхового агента
                </h3>
              </div>
              <p className="text-white/65 text-sm leading-relaxed">
                — обеспечить финансовую защиту каждой казахстанской семье и
                предоставить лучший сервис.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="aspect-square rounded-3xl border border-dashed border-[#1a6b1a]/40 bg-[#061506]/60 flex items-center justify-center"
          >
            <ImageIcon className="w-14 h-14 text-white/20" />
          </motion.div>
        </div>
      </section>

      {/* Company mission */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
              Миссия компании
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Миссия компании АО{" "}
              <span className="text-gradient">«Халық-Life»</span>
            </h2>
            <p className="text-white/65 leading-relaxed">
              Обеспечение финансовой защиты граждан Казахстана в случае
              причинения ущерба их жизни и здоровью, достойное служение
              интересам общества, улучшение качества их жизни, а также
              предоставление предпринимателям возможности использовать услуги
              страхования жизни для успешного развития их бизнеса.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Motto banner */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-(--site-accent)/30 bg-linear-to-br from-(--site-accent)/10 to-transparent p-8 md:p-10 text-center"
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Вы сами решаете, сколько будете работать{" "}
              <span className="text-gradient">и сколько зарабатывать!</span>
            </h3>
          </motion.div>
        </div>
      </section>

      {/* Cooperation + income ways */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <BadgeCheck className="w-6 h-6 text-(--site-accent)" />
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Сотрудничество с АО «Халық-Life»
              </h3>
            </div>
            <div className="aspect-[16/9] rounded-2xl border border-dashed border-[#1a6b1a]/40 bg-[#061506]/60 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-white/20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <Wallet className="w-6 h-6 text-(--site-accent)" />
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Способы получения дохода
              </h3>
            </div>
            <ul className="space-y-3">
              {incomeWays.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-white/75 text-sm"
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

      {/* Licenses */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 p-6 md:p-8 grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-center"
          >
            <div className="w-full md:w-80 aspect-[3/4] rounded-2xl border border-dashed border-[#1a6b1a]/40 bg-[#061506]/60 flex items-center justify-center shrink-0">
              <ImageIcon className="w-12 h-12 text-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-(--site-accent)" />
                <span className="text-(--site-accent) text-xs uppercase tracking-widest">
                  Документы
                </span>
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Лицензии и Сертификаты
              </h3>
              <p className="text-white/65 text-sm leading-relaxed mb-6">
                Компания осуществляет деятельность на страховом рынке в
                соответствии с лицензией, выданной Национальным Банком
                Республики Казахстан. АО «Халык-Life» имеет рейтинг финансовой
                устойчивости «B++» от международного рейтингового агентства AM
                Best, который является наивысшим среди всех казахстанских
                компаний по страхованию жизни.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Страховая лицензия
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application form */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/30 bg-[#0a2a0a]/40 overflow-hidden"
          >
            <div className="px-8 pt-8 pb-6 text-center border-b border-[#1a6b1a]/25">
              <h3
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Оставить заявку
              </h3>
              <p className="text-white/50 text-sm mt-3">
                Оставьте заявку, и наш представитель свяжется с вами для
                консультации.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="px-8 py-7 space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/45 text-xs uppercase tracking-widest mb-1.5 block">
                    ФИО
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя и фамилия"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-white placeholder-white/25 text-sm focus:outline-none focus:border-(--site-accent)/50"
                  />
                </div>
                <div>
                  <label className="text-white/45 text-xs uppercase tracking-widest mb-1.5 block">
                    Телефон / WhatsApp
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (000) 000-00-00"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-white placeholder-white/25 text-sm focus:outline-none focus:border-(--site-accent)/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/45 text-xs uppercase tracking-widest mb-1.5 block">
                  Комментарий
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Расскажите, какой вид страхования вас интересует..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0a2a0a]/80 border border-[#1a6b1a]/30 text-white placeholder-white/25 text-sm focus:outline-none focus:border-(--site-accent)/50 resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm flex items-center justify-center gap-2"
              >
                Отправить заявку
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
