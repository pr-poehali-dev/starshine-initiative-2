export default function Promo() {
  const projects = [
    {
      img: "https://cdn.poehali.dev/projects/58090770-2d8b-411b-ae58-ea3d1f85128a/files/c33d56b2-d3ad-4770-9124-314909aa8be6.jpg",
      label: "Каркасный дом",
    },
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
          {projects.map((p) => (
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