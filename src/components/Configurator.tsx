import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";
import funcUrls from "../../backend/func2url.json";

const STEPS = [
  { id: "type", title: "Тип постройки" },
  { id: "size", title: "Площадь" },
  { id: "floors", title: "Этажность" },
  { id: "roof", title: "Тип крыши" },
  { id: "finish", title: "Отделка" },
];

const TYPES = [
  { value: "house", label: "Дом", description: "Жилой каркасный дом", modifier: 1.0, icon: "Home" },
  { value: "bath", label: "Баня", description: "Каркасная баня", modifier: 0.7, icon: "Flame" },
  { value: "dacha", label: "Дача", description: "Дачный домик", modifier: 0.75, icon: "Trees" },
];

const SIZES_HOUSE = [
  { value: 60, label: "60 м²", description: "Компактная", price: 1800000 },
  { value: 120, label: "120 м²", description: "Оптимальная", price: 2700000 },
  { value: 180, label: "180 м²", description: "Просторная", price: 3600000 },
  { value: 250, label: "250 м²", description: "Большая", price: 4500000 },
];

const SIZES_BATH = [
  { value: 20, label: "20 м²", description: "Компактная", price: 1800000 },
  { value: 40, label: "40 м²", description: "Оптимальная", price: 2700000 },
  { value: 60, label: "60 м²", description: "Просторная", price: 3600000 },
  { value: 100, label: "100 м²", description: "Большая", price: 4500000 },
];

const SIZES_DACHA = [
  { value: 20, label: "20 м²", description: "Компактная", price: 1800000 },
  { value: 40, label: "40 м²", description: "Оптимальная", price: 2700000 },
  { value: 60, label: "60 м²", description: "Просторная", price: 3600000 },
  { value: 100, label: "100 м²", description: "Большая", price: 4500000 },
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

interface OptionItem {
  value: string | number;
  label: string;
  description: string;
  price?: number;
  modifier?: number;
  icon?: string;
}

function getSizes(typeValue: string) {
  if (typeValue === "house") return SIZES_HOUSE;
  if (typeValue === "bath") return SIZES_BATH;
  return SIZES_DACHA;
}

export default function Configurator() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    type: TYPES[0],
    size: SIZES_HOUSE[1],
    floors: FLOORS[0],
    roof: ROOFS[0],
    finish: FINISHES[0],
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const totalPrice =
    config.size.price *
    config.type.modifier *
    config.floors.modifier *
    config.roof.modifier *
    config.finish.modifier;

  const totalSteps = STEPS.length;
  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Укажите имя и телефон");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch(funcUrls["send-order"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          type: config.type.label,
          size: config.size.label,
          floors: config.floors.label,
          roof: config.roof.label,
          finish: config.finish.label,
          price: formatPrice(totalPrice),
        }),
      });
      if (!res.ok) throw new Error("Ошибка отправки");
      setSent(true);
    } catch {
      setError("Не удалось отправить. Попробуйте позже.");
    } finally {
      setSending(false);
    }
  };

  const buildingLabel = config.type.value === "house" ? "постройку" : config.type.value === "bath" ? "баню" : "дачу";

  return (
    <section className="bg-neutral-100 py-16 sm:py-24 px-6" id="configurator">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 tracking-tight">
          Рассчитайте стоимость
        </h2>
        <p className="text-neutral-500 mb-10 text-lg">
          5 шагов — и вы узнаете примерную стоимость
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
            {step < totalSteps ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-sm uppercase tracking-wide text-neutral-500 mb-6">
                  Шаг {step + 1} из {totalSteps} — {STEPS[step].title}
                </h3>

                {step === 0 && (
                  <OptionGrid
                    options={TYPES}
                    selected={config.type.value}
                    onSelect={(opt) => {
                      const newType = opt as typeof config.type;
                      const newSizes = getSizes(String(newType.value));
                      setConfig({ ...config, type: newType, size: newSizes[1] });
                    }}
                    renderLabel={(opt) => (
                      <>
                        <Icon name={opt.icon || "Home"} size={28} className="mb-2 text-neutral-700" />
                        <span className="text-2xl font-bold">{opt.label}</span>
                        <span className="text-neutral-500">{opt.description}</span>
                      </>
                    )}
                  />
                )}

                {step === 1 && (
                  <OptionGrid
                    options={getSizes(String(config.type.value))}
                    selected={config.size.value}
                    onSelect={(opt) => setConfig({ ...config, size: opt as typeof config.size })}
                    renderLabel={(opt) => (
                      <>
                        <span className="text-2xl font-bold">{opt.label}</span>
                        <span className="text-neutral-500">{opt.description}</span>
                        <span className="text-sm text-neutral-400 mt-1">от {formatPrice((opt.price || 0) * config.type.modifier)}</span>
                      </>
                    )}
                  />
                )}

                {step === 2 && (
                  <OptionGrid
                    options={FLOORS}
                    selected={config.floors.value}
                    onSelect={(opt) => setConfig({ ...config, floors: opt as typeof config.floors })}
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
                    options={ROOFS}
                    selected={config.roof.value}
                    onSelect={(opt) => setConfig({ ...config, roof: opt as typeof config.roof })}
                    renderLabel={(opt) => (
                      <>
                        <span className="text-2xl font-bold">{opt.label}</span>
                        <span className="text-neutral-500">{opt.description}</span>
                      </>
                    )}
                  />
                )}

                {step === 4 && (
                  <OptionGrid
                    options={FINISHES}
                    selected={config.finish.value}
                    onSelect={(opt) => setConfig({ ...config, finish: opt as typeof config.finish })}
                    renderLabel={(opt) => (
                      <>
                        <span className="text-2xl font-bold">{opt.label}</span>
                        <span className="text-neutral-500">{opt.description}</span>
                      </>
                    )}
                  />
                )}
              </motion.div>
            ) : sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Check" size={32} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-neutral-900 mb-3">Заявка отправлена!</p>
                <p className="text-neutral-500 mb-8">Мы свяжемся с вами в ближайшее время</p>
                <button
                  onClick={() => { setStep(0); setSent(false); setName(""); setPhone(""); }}
                  className="text-sm uppercase tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Рассчитать снова
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="py-8"
              >
                <div className="text-center mb-10">
                  <p className="text-sm uppercase tracking-wide text-neutral-500 mb-4">
                    Ваша {buildingLabel}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <Tag icon={config.type.icon || "Home"} text={config.type.label} />
                    <Tag icon="Ruler" text={config.size.label} />
                    <Tag icon="Building" text={config.floors.label} />
                    <Tag icon="Home" text={config.roof.label} />
                    <Tag icon="Paintbrush" text={config.finish.label} />
                  </div>
                  <p className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-2 tracking-tight">
                    {formatPrice(totalPrice)}
                  </p>
                  <p className="text-neutral-500 mb-10">Примерная стоимость под ключ</p>
                </div>

                <div className="max-w-md mx-auto">
                  <p className="text-lg font-semibold text-neutral-900 mb-4 text-center">
                    Оставьте контакты — мы сделаем точный расчёт
                  </p>
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      placeholder="Телефон"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 outline-none transition-colors"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                      onClick={handleSubmit}
                      disabled={sending}
                      className="bg-neutral-900 text-white px-8 py-4 text-sm uppercase tracking-wide hover:bg-neutral-700 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? "Отправляем..." : "Получить точный расчёт"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step < totalSteps && (
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
              {step === totalSteps - 1 ? "Рассчитать" : "Далее"}
            </button>
          </div>
        )}

        {step === totalSteps && !sent && (
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