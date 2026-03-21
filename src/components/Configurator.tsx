import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";

const STEPS = [
  { id: "size", title: "Площадь дома" },
  { id: "floors", title: "Этажность" },
  { id: "roof", title: "Тип крыши" },
  { id: "finish", title: "Отделка" },
];

const SIZES = [
  { value: 60, label: "60 м²", description: "Компактный", price: 1800000 },
  { value: 90, label: "90 м²", description: "Оптимальный", price: 2700000 },
  { value: 120, label: "120 м²", description: "Просторный", price: 3600000 },
  { value: 150, label: "150 м²", description: "Большой", price: 4500000 },
];

const FLOORS = [
  { value: 1, label: "1 этаж", description: "Всё на одном уровне", modifier: 1.0 },
  { value: 2, label: "2 этажа", description: "Больше места на участке", modifier: 0.95 },
  { value: "1.5", label: "1.5 этажа", description: "С мансардой", modifier: 0.9 },
];

const ROOFS = [
  { value: "gable", label: "Двускатная", description: "Классика", modifier: 1.0 },
  { value: "hip", label: "Четырёхскатная", description: "Максимум защиты", modifier: 1.15 },
  { value: "flat", label: "Плоская", description: "Современный стиль", modifier: 1.1 },
];

const FINISHES = [
  { value: "basic", label: "Базовая", description: "Под чистовую отделку", modifier: 1.0 },
  { value: "standard", label: "Стандарт", description: "Готова к жизни", modifier: 1.25 },
  { value: "premium", label: "Премиум", description: "Дизайнерское решение", modifier: 1.5 },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(price / 1000) * 1000) + " ₽";
}

export default function Configurator() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    size: SIZES[1],
    floors: FLOORS[0],
    roof: ROOFS[0],
    finish: FINISHES[0],
  });

  const totalPrice =
    config.size.price *
    config.floors.modifier *
    config.roof.modifier *
    config.finish.modifier;

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <section className="bg-neutral-100 py-16 sm:py-24 px-6" id="configurator">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 tracking-tight">
          Соберите свой дом
        </h2>
        <p className="text-neutral-500 mb-10 text-lg">
          4 шага — и вы узнаете примерную стоимость
        </p>

        <div className="flex gap-2 mb-10">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                i <= step ? "bg-neutral-900" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>

        <div className="min-h-[340px] relative">
          <AnimatePresence mode="wait">
            {step < STEPS.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-sm uppercase tracking-wide text-neutral-500 mb-6">
                  Шаг {step + 1} из {STEPS.length} — {STEPS[step].title}
                </h3>

                {step === 0 && (
                  <OptionGrid
                    options={SIZES}
                    selected={config.size.value}
                    onSelect={(opt) => setConfig({ ...config, size: opt })}
                    renderLabel={(opt) => (
                      <>
                        <span className="text-2xl font-bold">{opt.label}</span>
                        <span className="text-neutral-500">{opt.description}</span>
                        <span className="text-sm text-neutral-400 mt-1">от {formatPrice(opt.price)}</span>
                      </>
                    )}
                  />
                )}

                {step === 1 && (
                  <OptionGrid
                    options={FLOORS}
                    selected={config.floors.value}
                    onSelect={(opt) => setConfig({ ...config, floors: opt })}
                    renderLabel={(opt) => (
                      <>
                        <span className="text-2xl font-bold">{opt.label}</span>
                        <span className="text-neutral-500">{opt.description}</span>
                      </>
                    )}
                  />
                )}

                {step === 2 && (
                  <OptionGrid
                    options={ROOFS}
                    selected={config.roof.value}
                    onSelect={(opt) => setConfig({ ...config, roof: opt })}
                    renderLabel={(opt) => (
                      <>
                        <span className="text-2xl font-bold">{opt.label}</span>
                        <span className="text-neutral-500">{opt.description}</span>
                      </>
                    )}
                  />
                )}

                {step === 3 && (
                  <OptionGrid
                    options={FINISHES}
                    selected={config.finish.value}
                    onSelect={(opt) => setConfig({ ...config, finish: opt })}
                    renderLabel={(opt) => (
                      <>
                        <span className="text-2xl font-bold">{opt.label}</span>
                        <span className="text-neutral-500">{opt.description}</span>
                      </>
                    )}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-8"
              >
                <p className="text-sm uppercase tracking-wide text-neutral-500 mb-4">
                  Ваш дом
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  <Tag icon="Ruler" text={config.size.label} />
                  <Tag icon="Building" text={config.floors.label} />
                  <Tag icon="Home" text={config.roof.label} />
                  <Tag icon="Paintbrush" text={config.finish.label} />
                </div>
                <p className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-2 tracking-tight">
                  {formatPrice(totalPrice)}
                </p>
                <p className="text-neutral-500 mb-8">Примерная стоимость под ключ</p>
                <button className="bg-neutral-900 text-white px-8 py-4 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors duration-300 cursor-pointer">
                  Получить точный расчёт
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step < STEPS.length && (
          <div className="flex justify-between mt-8">
            <button
              onClick={prev}
              disabled={step === 0}
              className="text-sm uppercase tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Назад
            </button>
            <button
              onClick={next}
              className="bg-neutral-900 text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors duration-300 cursor-pointer"
            >
              {step === STEPS.length - 1 ? "Рассчитать" : "Далее"}
            </button>
          </div>
        )}

        {step === STEPS.length && (
          <div className="text-center mt-4">
            <button
              onClick={() => setStep(0)}
              className="text-sm uppercase tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Начать заново
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

interface OptionItem {
  value: string | number;
  label: string;
  description: string;
  price?: number;
  modifier?: number;
}

function OptionGrid({
  options,
  selected,
  onSelect,
  renderLabel,
}: {
  options: OptionItem[];
  selected: string | number;
  onSelect: (opt: OptionItem) => void;
  renderLabel: (opt: OptionItem) => React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt)}
          className={`p-6 border-2 text-left flex flex-col gap-1 transition-all duration-300 cursor-pointer ${
            selected === opt.value
              ? "border-neutral-900 bg-white shadow-lg"
              : "border-neutral-200 bg-white hover:border-neutral-400"
          }`}
        >
          {renderLabel(opt)}
        </button>
      ))}
    </div>
  );
}

function Tag({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 border border-neutral-200">
      <Icon name={icon} size={16} />
      <span className="text-sm">{text}</span>
    </div>
  );
}