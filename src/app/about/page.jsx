"use client";
import { motion } from "framer-motion";
import Hero from "@/components/sections/Hero";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import {
  Users,
  Heart,
  Sprout,
  HandHeart,
  FileText,
  Building,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const teamPoints = [
  {
    icon: Users,
    text: "Наш коллектив — это команда профессионалов и единомышленников, объединённых общей идеей совместной работы в сфере внутреннего туризма Казахстана. У каждого из нас есть определённый опыт работы в разных сферах, умения, навыки и знания, которыми мы руководствуемся при планировании и достижении своих целей.",
  },
  {
    icon: Sprout,
    text: "Нашей общей целью является популяризация внутреннего туризма среди населения, продвижение услуг санаториев Казахстана и здорового образа жизни.",
  },
  {
    icon: Heart,
    text: "Дорогой друг! Если у тебя есть навыки, энергия и стремление развиваться — ты именно тот, кого мы ищем. Присоединяйся к нашей команде и реализуй свой потенциал в деле, которое вдохновляет. Зарабатывай, раскрывай себя и расти вместе с нами!",
  },
  {
    icon: HandHeart,
    text: "Приглашаем к сотрудничеству курортные комплексы, санатории, дома отдыха и гидов-экскурсоводов! Давайте вместе развивать внутренний туризм и формировать образ Казахстана как страны, где можно не только вдохновиться природой, узнать культуру, но и получить качественный отдых и оздоровление. Объединяя усилия — мы создаём ценность для гостей и усиливаем интерес к регионам нашей страны.",
  },
];

const requisites = [
  { label: "Наименование", value: "ТОО «OZELIM»" },
  { label: "БИН", value: "221140000992" },
  { label: "КБе", value: "17" },
  { label: "Номер счета", value: "KZ32722S000029456226" },
  { label: "Адрес", value: "Павлодар" },
  { label: "Банк", value: "АО «Kaspi Bank»" },
  { label: "БИК", value: "CASPKZKA" },
];

const documents = [
  { title: "Свидетельство о регистрации", note: "ЮЛ" },
  { title: "Подтверждение из e-gov", note: "Учёт" },
  { title: "Государственная регистрация", note: "ОЮЛ" },
  { title: "Сертификат МФЦА", note: "AFSA" },
];

const team = [
  {
    name: "Жангазы Еркеғали Жұмабайұлы",
    role: "Директор Ассоциации туристов Казахстана «Öz Elim»",
    desc: "Член общественного Совета Павлодарской области, бухгалтер-экономист, опыт работы в правоохранительных органах.",
  },
  {
    name: "Султанов Искандер Серикович",
    role: "Юрист Ассоциации",
    desc: "Автор инновационной методики управления человеческими ресурсами, директор юридической компании «GRT COMPANY».",
  },
  {
    name: "Оразалинова Мадина Төлемысовна",
    role: "Агент страховой компании «Халык-Life»",
    desc: "Консультант по всем видам страхования и финансовой грамотности.",
  },
  {
    name: "Какенова Сауле",
    role: "Учредитель Ассоциации",
    desc: "Эндаумент-фонд «Öz Elim», основатель на территории МФЦА. Автор разработчик автоматизированного подбора.",
  },
  {
    name: "Мукатаева Айгуль Куланбаевна",
    role: "Директор миграционно-визового консалтинга",
    desc: "Специалист по всем видам визовых услуг. Агент страховой компании «Nomad».",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Hero
        title="О нас"
        highlight="OzElim"
        subtitle="Команда профессионалов и единомышленников, развивающая внутренний туризм Казахстана."
        badge="Команда"
      />
      <MarqueeTicker />

      {/* Team intro */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-10 items-center mb-12"
          >
            <div>
              <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                Команда
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Центр притяжения{" "}
                <span className="text-gradient">профессионалов-единомышленников</span>
              </h2>
              <p className="text-white/65 leading-relaxed">
                Главный ресурс — это кадры. Наш коллектив, как команда
                профессионалов и единомышленников, преданных друг другу и общему
                делу, готовы к решению поставленных задач и достижению общей
                цели.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 aspect-video flex items-center justify-center">
              <Users className="w-20 h-20 text-(--site-accent)/40" />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {teamPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-(--site-accent)/15 border border-(--site-accent)/30 flex items-center justify-center shrink-0">
                  <p.icon className="w-5 h-5 text-(--site-accent)" />
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requisites */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-6 h-6 text-(--site-accent)" />
              <h3
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Реквизиты
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3 text-sm">
              {requisites.map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between gap-3 border-b border-[#1a6b1a]/15 pb-2"
                >
                  <span className="text-white/40">{r.label}</span>
                  <span className="text-white font-medium text-right">
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documents */}
      <section className="px-6 pb-16 bg-[#0a2a0a]/20">
        <div className="max-w-7xl mx-auto py-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-10"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Наши реквизиты
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {documents.map((doc, i) => (
              <motion.div
                key={doc.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-[#1a6b1a]/25 bg-[#061506]/60 p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-(--site-accent)" />
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-(--site-accent)/30 text-(--site-accent)">
                    {doc.note}
                  </span>
                </div>
                <div className="aspect-[3/4] rounded-xl border border-dashed border-[#1a6b1a]/40 bg-[#030f03]/60 flex items-center justify-center text-white/25 text-xs">
                  Документ
                </div>
                <div className="text-white text-sm font-medium leading-snug">
                  {doc.title}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our team */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-10"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Наша команда
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-3xl border border-[#1a6b1a]/25 bg-[#0a2a0a]/40 p-6 text-center card-hover"
              >
                <div className="w-24 h-24 rounded-full border border-(--site-accent)/30 bg-[#061506]/60 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-(--site-accent)/40" />
                </div>
                <h3
                  className="text-white font-bold text-lg mb-1"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {member.name}
                </h3>
                <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                  {member.role}
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-4">
                  {member.desc}
                </p>
                <button className="inline-flex items-center gap-1.5 text-(--site-accent) text-sm font-medium hover:gap-2 transition-all">
                  Перейти по ссылке
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-(--site-accent)/30 bg-linear-to-br from-(--site-accent)/10 to-transparent p-8 md:p-10 text-center"
          >
            <ShieldCheck className="w-10 h-10 text-(--site-accent) mx-auto mb-4" />
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Хотите присоединиться к команде?
            </h3>
            <p className="text-white/55 text-sm mb-6 max-w-xl mx-auto">
              Напишите нам — мы расскажем, как стать частью Ассоциации туристов
              Казахстана «OzElim».
            </p>
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-(--site-accent) to-(--site-accent-bright) text-(--site-on-accent) font-bold text-sm"
            >
              <Mail className="w-4 h-4" />
              Связаться с нами
            </Link>
          </motion.div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
