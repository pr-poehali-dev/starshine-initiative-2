import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const HOUSE_IMAGES = [
  "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/c33d56b2-d3ad-4770-9124-314909aa8be6.jpg",
  "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/4432e9fc-aad5-49a3-a41e-a9a974cd3b05.jpg",
  "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/a1fe31e3-d997-4f65-b2f3-c2c324427baa.jpg",
  "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/eb2ff9e6-b6db-47b6-b530-ed5a71602d79.jpg",
  "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/287fac50-e9d2-44de-b7f1-d0dd0596ba28.jpg",
  "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/58079e80-65a7-451c-bf4d-3d0b81e71f5a.jpg",
  "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/0fd454e4-58a9-47a5-9fc6-3f1fdddff95b.jpg",
  "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/dc58ab2d-4e67-4b58-9322-19fa4f8b03a0.jpg",
];

function ImageCarousel({ images, label }: { images: string[]; label: string }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, images.length]);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div
      className="group relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="aspect-[4/5] overflow-hidden relative">
        {images.map((img, i) => (
          <img
            key={img}
            src={img}
            alt={`${label} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
        >
          <Icon name="ChevronLeft" size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
        >
          <Icon name="ChevronRight" size={18} />
        </button>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white font-semibold text-lg uppercase tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function Promo() {
  const simpleProjects = [
    {
      img: "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/f7acd6bb-78da-46fe-b276-17b66de9a050.jpg",
      label: "Каркасная баня",
    },
    {
      img: "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/5512d57a-846e-48c7-b56a-a988f76c411c.jpg",
      label: "Дача",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-24 px-6" id="projects">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            Наши проекты
          </h2>
          <p className="text-neutral-500 text-sm uppercase tracking-wide hidden sm:block">
            Дома · Бани · Дачи
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageCarousel images={HOUSE_IMAGES} label="Каркасный дом" />

          {simpleProjects.map((p) => (
            <div key={p.label} className="group relative overflow-hidden">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-semibold text-lg uppercase tracking-wide">
                  {p.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-neutral-500 text-lg mt-12 max-w-2xl">
          Каждый проект — это история семьи. Мы строим пространство, в котором хочется жить,
          отдыхать и встречать гостей.
        </p>
      </div>
    </section>
  );
}
