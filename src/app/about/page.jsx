"use client";
import { motion } from "framer-motion";
import Footer, { MarqueeTicker } from "@/components/sections/Footer";
import {
  Users,
  Heart,
  Sprout,
  HandHeart,
  FileText,
  Building,
} from "lucide-react";
import Image from "next/image";

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
  { title: "Свидетельство о регистрации", note: "ЮЛ", img: "/abt-1.jpg" },
  { title: "Подтверждение из e-gov", note: "Учёт", img: "/abt-2.jpg" },
  { title: "Государственная регистрация", note: "ОЮЛ", img: "/abt-3.jpg" },
  { title: "Сертификат МФЦА", note: "AFSA", img: "/abt-4.jpg" },
];

const team = [
  {
    name: "Жангазы Еркеғали Жұмабайұлы",
    role: "Руководитель Ассоциации туристов Казахстана",
    desc: "Член общественного Совета Павлодарской области, бухгалтер-экономист, опыт работы в правоохранительных органах.",
    img: "/erkegali.jpeg",
  },
  {
    name: "Султанов Искандер Серикович",
    role: "Юрист Ассоциации",
    desc: "Автор инновационной методики управления человеческими ресурсами, директор юридической компании «GRT COMPANY».",
    img: "/abt-isk.jpeg",
  },
  {
    name: "Оразалинова Мадина Төлемысовна",
    role: "Агент страховой компании «Халык-Life»",
    desc: "Консультант по всем видам страхования и финансовой грамотности.",
    img: "/abt-mad.jpeg",
  },
  {
    name: "Какенова Сауле",
    role: "Учредитель Ассоциации",
    desc: "Эндаумент-фонд «OzElim», основатель на территории МФЦА. Автор разработчик автоматизированного подбора.",
    img: "/abt-sau.jpg",
  },
  {
    name: "Мукатаева Айгуль Куланбаевна",
    role: "Директор миграционно-визового консалтинга",
    desc: "Специалист по всем видам визовых услуг. Агент страховой компании «Nomad».",
    img: "/abt-aig.jpeg",
  },
];

export default function AboutPage() {
  return (
    <main className="pt-20">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0f3d0f] z-[999] pointer-events-none" />
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
                className="text-4xl md:text-5xl font-bold text-app-fg mb-5 leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Центр притяжения{" "}
                <span className="text-gradient">профессионалов-единомышленников</span>
              </h2>
              <p className="text-app-subtle leading-relaxed">
                Главный ресурс — это кадры. Наш коллектив, как команда
                профессионалов и единомышленников, преданных друг другу и общему
                делу, готовы к решению поставленных задач и достижению общей
                цели.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden border border-[#1a6b1a]/25 aspect-video">
              <Image
                src="/abt-center.png"
                alt="Команда OzElim"
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
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
                <p className="text-app-subtle text-sm leading-relaxed">{p.text}</p>
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
                className="text-2xl md:text-3xl font-bold text-app-fg"
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
                  <span className="text-app-faint">{r.label}</span>
                  <span className="text-app-fg font-medium text-right">
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
            className="text-3xl md:text-4xl font-bold text-app-fg text-center mb-10"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Наши реквизиты
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {documents.map((doc, i) => (
              <motion.a
                key={doc.title}
                href={doc.img}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-[#1a6b1a]/25 bg-app-card p-5 flex flex-col gap-3 cursor-pointer hover:border-(--site-accent)/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-5 h-5 text-(--site-accent)" />
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-(--site-accent)/30 text-(--site-accent)">
                    {doc.note}
                  </span>
                </div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden">
                  <Image
                    src={doc.img}
                    alt={doc.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-app-fg text-sm font-medium leading-snug">
                  {doc.title}
                </div>
              </motion.a>
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
            className="text-3xl md:text-4xl font-bold text-app-fg text-center mb-10"
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
                <div className="w-48 h-48 rounded-full border border-(--site-accent)/30 bg-[#061506]/60 mx-auto mb-4 overflow-hidden">
                  <Image
                    src={member.img}
                    alt={member.name}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3
                  className="text-app-fg font-bold text-lg mb-1"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  {member.name}
                </h3>
                <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-3">
                  {member.role}
                </div>
                <p className="text-app-subtle text-sm leading-relaxed">
                  {member.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarqueeTicker />
      <Footer />
    </main>
  );
}
