"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { RequestFormDialog } from "@/components/request-form/request-form";

const PB = "https://ozelim-fly.fly.dev/api/files/v3zz8ifrbei7azq";

const DESTINATIONS = [
  {
    name: "Баянаул",
    region: "Павлодарская область",
    image: `${PB}/10jqnoye9k2l3vo/ed431b9cc68e9d94bd50b152e32a5087_b01_z297x0_y_0ASbfxwsQ6.jpg`,
    description:
      "Баянаульский национальный парк – уникальная природная зона, расположенная в Павлодарской области.",
  },
  {
    name: "Катон-Карагай",
    region: "Восточно-Казахстанская область",
    image: `${PB}/18qliwtrqulbny0/3fd5b6b9931732fa633e1977e8acece4_u_yag_oeax_bp_iXkH4N7H7Y.jpg`,
    description:
      "Катон-Карагайский национальный парк вошёл в список «зелёных» туристических направлений АЗ.",
  },
  {
    name: "Кольсай",
    region: "Алматинская область",
    image: `${PB}/kle68536quxavqi/2_1_z_ctv_nex8_qx_m9dUMoX8UP.jpg`,
    description:
      "Кольсайские озёра по праву входят в число самых красивых природных мест Казахстана.",
  },
  {
    name: "Каинды",
    region: "Алматинская область",
    image: `${PB}/9b29836mix32zdi/file_1431266397_971584406_qv3_wc_kz6_bk_zNJF0zYFr7.jpg`,
    description:
      "Озеро Каинды – одно из природных чудес Казахстана с затопленным еловым лесом.",
  },
  {
    name: "Туркестан",
    region: "Туркестанская область",
    image: `${PB}/bd3ndni9089gqec/scale_1200_as6f_rr_uksu_FsZYEGzedA.jpg`,
    description:
      "Туркестан — один из старейших городов Казахстана и духовная столица тюркского мира.",
  },
  {
    name: "Балхаш",
    region: "Карагандинская область",
    image: `${PB}/iglnil823o6f5sq/ag1rikcn_dczi_qzb_gj_y_3baVy5YwlH.jpg`,
    description:
      "Балхаш — бессточное полупресноводное озеро на юго-востоке Казахстана.",
  },
  {
    name: "Мечеть Бекет-Ата",
    region: "Мангистауская область",
    image: `${PB}/m3dclzyas7vd4v4/d377212197c25963245b9245c9db19c2_mpxdu_ia_ft_l_CwL7S3ARxB.jpg`,
    description:
      "Мечеть Бекет-Ата находится на границе плато Устюрт и является одним из главных мест паломничества.",
  },
  {
    name: "Актау",
    region: "Мангистауская область",
    image: `${PB}/2mb4dvbdy7o4wrz/255a0e82f653db18fc6c443398da4368_70_vu_jt_oe_pg_qAujSzknFE.jpg`,
    description:
      "Актау — самый романтичный город Казахстана на берегу Каспийского моря.",
  },
  {
    name: "Бухтарминское водохранилище",
    region: "Восточно-Казахстанская область",
    image: `${PB}/yrtqrt2adxsfafc/buhtarma_4_b0y_yjc4_vx_v_Y7URVTu7bt.jpg`,
    description:
      "Бухтарминское водохранилище входит в десятку крупнейших искусственных водоёмов мира.",
  },
  {
    name: "Капчагай",
    region: "Алматинская область",
    image: `${PB}/1elhgqd8h7g7asr/1702822577_0bb466f7_3bfb_23f2_589d_3272d242153c_iu7_brixs_zi_9eXww8Z7Qi.jpg`,
    description:
      "Капчагайское водохранилище — крупнейшее в Казахстане, переживает бурное развитие туризма.",
  },
  {
    name: "Астана",
    region: "Столица Казахстана",
    image: `${PB}/44063vc1np79l20/baiterek_1_8err5_q7ilk_kgK4dJ0CRh.jpg`,
    description:
      "Астана — город новых возможностей и центр притяжения активной, талантливой молодёжи.",
  },
  {
    name: "Зайсан",
    region: "Восточно-Казахстанская область",
    image: `${PB}/j3vnfmjo2g3o820/1200xauto_5b_wq_zppta_remp35l8_vk_zqkv_ij_ei8nz_p9_iuvafzcf_9_l14hdr_f65_lWhYK6ChDT.jpg`,
    description:
      "Озеро Зайсан потрясающей красоты расположилось на востоке Казахстана между трёх горных массивов.",
  },
  {
    name: "Алматы",
    region: "Алматинская область",
    image: `${PB}/bkz1etkh2106q2c/8a75fa6aa817669ee9405385c3ea2d35_e1554981926701_bgm0q0yspq.jpg`,
    description:
      "Алматы — бывшая столица и крупнейший город страны у подножия Заилийского Алатау.",
  },
  {
    name: "Медеу",
    region: "Алматинская область",
    image: `${PB}/8mpf820v3di5q6f/5bedd07aac233a07_n6qtcl5cio.jpeg`,
    description:
      "Медеу — высокогорный каток и любимое место зимнего отдыха для тысяч горожан.",
  },
  {
    name: "Коктобе",
    region: "Алматы",
    image: `${PB}/qv10y2v3m6x126v/kok_tobe_0219_2pdom7f3t9.jpg`,
    description:
      "Парк Кок-Тобе — место отдыха для всей семьи, царство кристально чистого воздуха.",
  },
  {
    name: "Мавзолей Ходжи Ахмеда Яссауи",
    region: "Туркестан",
    image: `${PB}/uvl85h7mh5346ew/photo_1647_sbrkky7f60.jpg`,
    description:
      "Памятник суфийскому поэту и философу XII века — объект Всемирного наследия ЮНЕСКО.",
  },
  {
    name: "Мавзолей Арыстан-Баб",
    region: "Туркестанская область",
    image: `${PB}/x804629z6t76h41/2df553ed33ae6bc6e0bb67ca68c3ef71_4k17sqk2pl.jpeg`,
    description:
      "Арыстан-Баб — наставник распространителя ислама Ходжи Ахмета Яссауи.",
  },
  {
    name: "Отырар",
    region: "Туркестанская область",
    image: `${PB}/htb890z8l663rqo/bf422f7e26faddfeb7b3b985f728e4c12_6t0nvscx2k.jpg`,
    description:
      "Отырар — один из древнейших городов Средней Азии и сокровищница тюркской культуры.",
  },
  {
    name: "Мавзолей Домалак ана",
    region: "Туркестанская область",
    image: `${PB}/w593g57q7m3o2hd/492760_original_0yiwj5185b.png`,
    description:
      "Домалак ана — одна из легендарных матерей казахского народа, третья жена батыра Байдибек.",
  },
  {
    name: "Дендропарк",
    region: "Шымкент",
    image: `${PB}/ib4rj2239ycghdc/dendropark2_u71j3iwdai.jpeg`,
    description:
      "Шымкентский Государственный дендропарк — уникальный во всей Центральной Азии.",
  },
  {
    name: "Древняя восточная баня",
    region: "Туркестан",
    image: `${PB}/0w6z8un1bsn5562/caption_uxgpjh5oeq.jpg`,
    description:
      "Баня для паломников, совершавших хадж к мавзолею Ходжи Ахмеда Яссауи.",
  },
  {
    name: "Сарыагаш",
    region: "Туркестанская область",
    image: `${PB}/0u9nlf472144i88/52cd2290_6490_4868_b6c0_e190a64462d5_znmbvhjtom.jpg`,
    description:
      "Восхитительный отдых в курортной зоне Сарыагаш с уникальными минеральными водами.",
  },
  {
    name: "Боровое",
    region: "Акмолинская область",
    image: `${PB}/5jl9xy0u877gso4/af95a7f1a202b95244ca0cb8b64fb931_pf48xq30ph.jpg`,
    description:
      "Огромные вековые деревья, каменные горные хребты и фантастические изгибы скал.",
  },
  {
    name: "Пещера Акмешит",
    region: "Туркестанская область",
    image: `${PB}/e5897454999znnf/05pechera_1uqd1fh330.jpg`,
    description:
      "Уникальное и загадочное место не только Туркестанской области, но и всего Казахстана.",
  },
  {
    name: "Бозжыра",
    region: "Мангистауская область",
    image: `${PB}/8t54810wg8ixs93/bozzhyra_one_day_tour_yc9mgi4jvd.jpg`,
    description:
      "Самая масштабная и впечатляющая достопримечательность всего Мангистау.",
  },
  {
    name: "Чарынский каньон",
    region: "Алматинская область",
    image: `${PB}/m7ik7os16d1sf3s/charynskiy_kanon_na_oblozhkujpeg2_ylar6r2bcb.jpg`,
    description:
      "Памятник природы из осадочных пород, возраст которых составляет около 12 миллионов лет.",
  },
  {
    name: "Алаколь",
    region: "Алматинская область",
    image: `${PB}/tjl99hy4p3p8409/62w1d3swwvd_59l1a0ln58.jpg`,
    description:
      "Огромное бессточное озеро со слабосолёной водой — популярный курорт у казахстанцев.",
  },
  {
    name: "Мечеть Шакпак ата",
    region: "Мангистауская область",
    image: `${PB}/q4091d6o7iqq7gw/shakpak_ata1_g6yp93oxf1.jpg`,
    description:
      "Подземная мечеть Шакпак-ата — один из важнейших религиозных памятников Мангистау.",
  },
  {
    name: "Шымбулак",
    region: "Алматинская область",
    image: `${PB}/g018m98n5b5ytd4/mx_higph_g_m0o76gaa1q.jpg`,
    description:
      "Популярный горнолыжный курорт близ Алма-Аты, расположенный на хребте Заилийский Алатау.",
  },
  {
    name: "Белуха",
    region: "Восточно-Казахстанская область",
    image: `${PB}/4kenttkc0yj6b58/beluha_6s7wl9o6ss.jpg`,
    description:
      "Высшая точка Алтайских гор (4509 м). Через массив Белухи проходит граница Казахстана и России.",
  },
  {
    name: "Этноаул в Туркестане",
    region: "Туркестан",
    image: `${PB}/ykp5t1tr9k9wtor/406c1225415a8832e94aa4d9713c1e96_kq2ockwo1m.jpg`,
    description:
      "Знакомство с традиционным бытом казахского народа в комплексе Х. А. Яссауи.",
  },
];

export default function PopularResorts() {
  const trackRef = React.useRef(null);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-resort-card]");
    const step = card ? card.getBoundingClientRect().width + 24 : 320;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div className="max-w-3xl">
            <div className="text-(--site-accent) text-xs uppercase tracking-widest mb-2">
              Направления
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Популярные курортные направления Казахстана
            </h2>
            <p className="text-white/60 mt-3 leading-relaxed">
              От лазурных озёр Кольсай и древнего Туркестана до плато Устюрт и пиков Алтая — выберите место для своей следующей поездки.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Назад"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-(--site-accent) hover:border-(--site-accent) transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Вперёд"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-(--site-accent) hover:border-(--site-accent) transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {DESTINATIONS.map((d, i) => (
            <motion.article
              key={d.name}
              data-resort-card
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              className="group shrink-0 snap-start w-[280px] sm:w-[320px] rounded-3xl overflow-hidden border border-[#1a6b1a]/20 bg-[#0a2a0a]/40 hover:border-(--site-accent)/40 transition-all duration-500 card-hover"
            >
              <div className="relative h-56 overflow-hidden media-contrast">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 80vw, 320px"
                  priority={i < 3}
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#030f03]/85 via-[#030f03]/30 to-transparent" />

                <button
                  type="button"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-white/10 transition-all"
                  aria-label="В избранное"
                >
                  <Heart className="w-4 h-4" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <div className="flex items-center gap-1.5 text-(--site-accent) text-[11px] uppercase tracking-widest mb-1.5">
                    <MapPin className="w-3 h-3" />
                    {d.region}
                  </div>
                  <h3
                    className="text-white font-bold text-2xl drop-shadow-lg leading-tight"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {d.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <p className="text-sm text-white/60 leading-relaxed line-clamp-3 min-h-[60px]">
                  {d.description}
                </p>
                <RequestFormDialog
                  trigger={
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full px-4 py-2.5 rounded-full bg-linear-to-r from-(--site-accent)/20 to-(--site-accent-bright)/10 border border-(--site-accent)/30 text-(--site-accent) text-sm font-semibold hover:from-(--site-accent) hover:to-(--site-accent-bright) hover:text-(--site-on-accent) transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Оставить заявку
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  }
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
