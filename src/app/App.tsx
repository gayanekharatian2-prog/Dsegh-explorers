import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  Bus,
  Bike,
  Check,
  ChevronDown,
  Compass,
  Flame,
  Footprints,
  Mountain,
  MapPin,
  Snowflake,
  Thermometer,
  ArrowRight,
  Play,
  Pause,
  UtensilsCrossed,
  ChefHat,
  Users,
} from 'lucide-react';
import {
  type Lang,
  LANGS,
  COPY,
  getJourney,
  DSEGH_LAT,
  DSEGH_LON,
} from './translations';
import { CoverMediaBox, isCoverVideo } from './coverMedia';

/** Same order as `includedItems` in every language (transport → … → group). */
const INCLUDED_ITEM_ICONS: LucideIcon[] = [Bus, UtensilsCrossed, Flame, Bike, Footprints, ChefHat];

const grainStyle: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
};

function publicAsset(file: string) {
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${file.replace(/^\//, '')}`;
}

const heroVideoSrc = publicAsset('hero.mp4');

const STICKY_PHONE_TEL = '+37494990782';
const STICKY_PHONE_LABEL = '+374 (94) 990 782';

const REGISTRATION_EMAIL_TO = 'hakobianmels@gmail.com';

const DSEGH_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${DSEGH_LAT}%2C${DSEGH_LON}`;

/** Hero location + weather chips — match glass, size, and weight. */
const HERO_CHROME_PILL =
  'inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-semibold text-white/60 backdrop-blur-sm';

const METEO_QUERY =
  `latitude=${DSEGH_LAT}&longitude=${DSEGH_LON}` + '&current=temperature_2m&timezone=Asia%2FYerevan';

function meteoForecastUrls(): string[] {
  const direct = `https://api.open-meteo.com/v1/forecast?${METEO_QUERY}`;
  if (import.meta.env.DEV) return [`/open-meteo/v1/forecast?${METEO_QUERY}`, direct];
  return [direct];
}

function parseMeteoTemp(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null;
  const cur = (data as { current?: Record<string, unknown> }).current;
  if (!cur || typeof cur !== 'object') return null;
  const temp = Number(cur.temperature_2m);
  return Number.isFinite(temp) ? temp : null;
}

function normalizePhoneInput(value: string) {
  // Keep digits and common phone punctuation; drop letters/other symbols.
  return value.replace(/[^\d+()\-\s]/g, '');
}

function phoneHasEnoughDigits(value: string) {
  const digits = value.replace(/[^\d]/g, '');
  return digits.length >= 8;
}

function isEmailLike(value: string) {
  const v = value.trim();
  // intentionally simple; browser type=email also validates
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function sendRegistration(payload: {
  name: string;
  phone: string;
  email: string;
  message: string;
  userAgent?: string;
  page?: string;
}) {
  const sheetsWebAppUrl = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_GOOGLE_SHEETS_WEBAPP_URL;
  if (sheetsWebAppUrl) {
    // Apps Script web apps often don't send CORS headers.
    // `no-cors` allows the POST to succeed without JS-readable response.
    await fetch(sheetsWebAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return;
  }

  const subject = `Dsegh registration — ${payload.name}`;
  const body = [
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.page ? `Page: ${payload.page}` : null,
    '',
    payload.message ? `Message:\n${payload.message}` : 'Message: (none)',
  ].join('\n');

  window.location.href =
    `mailto:${encodeURIComponent(REGISTRATION_EMAIL_TO)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
}

type HeroWeatherState = { status: 'loading' } | { status: 'ok'; temp: number } | { status: 'error' };

function Tag({ children }: { children: ReactNode }) {
  return <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-700/70">{children}</p>;
}

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const v = localStorage.getItem('dsegh-lang');
    if (v === 'hy' || v === 'ru' || v === 'en') return v;
  } catch { /* ignore */ }
  const n = navigator.language?.toLowerCase() ?? '';
  if (n.startsWith('hy')) return 'hy';
  if (n.startsWith('ru')) return 'ru';
  return 'en';
}

export default function App() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [lang, setLang] = useState<Lang>(() => initialLang());
  const [heroWeather, setHeroWeather] = useState<HeroWeatherState>({ status: 'loading' });
  const [heroWeatherNonce, setHeroWeatherNonce] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [coverPick, setCoverPick] = useState(0);
  const [routeAutoplay, setRouteAutoplay] = useState(false);
  const agendaPillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const storyPointer = useRef<{ x: number; y: number; pid: number } | null>(null);

  const t = COPY[lang];
  const journey = getJourney(lang);

  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.45], [0, 80]);

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('dsegh-lang', lang); } catch { /* ignore */ }
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    setHeroWeather({ status: 'loading' });
    (async () => {
      for (const url of meteoForecastUrls()) {
        if (cancelled) return;
        try {
          const res = await fetch(url, { credentials: 'omit', mode: 'cors', headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(String(res.status));
          const json: unknown = await res.json();
          const temp = parseMeteoTemp(json);
          if (cancelled) return;
          if (temp !== null) {
            setHeroWeather({ status: 'ok', temp });
            return;
          }
        } catch { /* try next */ }
      }
      if (!cancelled) setHeroWeather({ status: 'error' });
    })();
    return () => {
      cancelled = true;
    };
  }, [heroWeatherNonce]);

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > window.innerHeight * 0.35);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setCoverPick(0);
  }, [activeStep]);

  useEffect(() => {
    agendaPillRefs.current[activeStep]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeStep]);

  useEffect(() => {
    if (!routeAutoplay) return;
    const id = window.setInterval(() => {
      setActiveStep((s) => (s >= journey.length - 1 ? 0 : s + 1));
    }, 5200);
    return () => window.clearInterval(id);
  }, [routeAutoplay, journey.length]);

  const canSubmit =
    formData.name.trim().length > 0 &&
    formData.phone.trim().length > 0 &&
    phoneHasEnoughDigits(formData.phone) &&
    formData.email.trim().length > 0 &&
    isEmailLike(formData.email);

  const submitCooldownMs = 12_000;
  const inCooldown = lastSubmittedAt !== null && Date.now() - lastSubmittedAt < submitCooldownMs;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!canSubmit || isSubmitting || inCooldown) return;

    setIsSubmitting(true);
    try {
      await sendRegistration({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        page: typeof location !== 'undefined' ? location.href : undefined,
      });
      setLastSubmittedAt(Date.now());
      setFormData({ name: '', phone: '', email: '', message: '' });
      alert(t.alertThanks);
    } catch {
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cur = journey[activeStep];
  const CurIcon = cur.icon;
  const rawCover = cur.covers[coverPick] ?? cur.covers[0];
  const heroCover = rawCover.startsWith('http') ? rawCover : publicAsset(rawCover);
  const legCount = journey.length;

  const goStoryPrev = () => setActiveStep((s) => Math.max(0, s - 1));
  const goStoryNext = () => setActiveStep((s) => Math.min(legCount - 1, s + 1));

  const onStoryPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    storyPointer.current = { x: e.clientX, y: e.clientY, pid: e.pointerId };
  };

  const onStoryPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const start = storyPointer.current;
    storyPointer.current = null;
    if (!start || start.pid !== e.pointerId) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width || 1;
    const tap = Math.abs(dx) < 14 && Math.abs(dy) < 14;

    if (tap) {
      const rx = (e.clientX - rect.left) / w;
      if (rx < 0.34) goStoryPrev();
      else if (rx > 0.66) goStoryNext();
      return;
    }

    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.1) {
      if (dx < 0) goStoryNext();
      else goStoryPrev();
    }
  };

  const onStoryPointerCancel = () => {
    storyPointer.current = null;
  };

  const onStoryKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goStoryPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goStoryNext();
    }
  };

  return (
    <div className="min-h-[100dvh] bg-stone-100 antialiased selection:bg-emerald-200 lg:bg-stone-400/15 lg:py-5">
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-lg bg-stone-50 text-[13px] leading-snug text-stone-900 lg:min-h-[calc(100dvh-2.5rem)] lg:overflow-x-clip lg:rounded-[2rem] lg:shadow-2xl lg:ring-1 lg:ring-stone-900/[0.06]">

      {/* ── HERO (stays dark — video background) ── */}
      <header className="relative min-h-[100dvh] overflow-hidden bg-stone-950">
        <motion.div className="absolute inset-0" style={{ y: heroParallax }}>
          <video src={heroVideoSrc} autoPlay loop muted playsInline preload="metadata" className="h-[120%] w-full object-cover" />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" style={grainStyle} aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-950/70 via-transparent to-stone-950/95" />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl flex-col px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pb-5">
          <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <a
                href={DSEGH_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${HERO_CHROME_PILL} min-w-0 max-w-[min(100%,11rem)] shrink uppercase tracking-[0.18em] transition hover:bg-white/10 hover:text-white/80 sm:max-w-[13rem]`}
                aria-label={t.heroLocationAria}
              >
                <MapPin className="h-3 w-3 shrink-0 text-white/50" strokeWidth={2.25} aria-hidden />
                <span className="truncate">{t.heroLocationShort}</span>
              </a>
              <div
                className={`${HERO_CHROME_PILL} shrink-0 normal-case tracking-normal`}
                role="status"
                aria-live="polite"
                aria-label={t.heroWeatherAria}
              >
                <Snowflake className="h-3 w-3 shrink-0 text-white/50" strokeWidth={2.25} aria-hidden />
                <Thermometer className="h-3 w-3 shrink-0 text-white/50" strokeWidth={2.25} aria-hidden />
                {heroWeather.status === 'loading' && <span className="tabular-nums text-white/45">…</span>}
                {heroWeather.status === 'error' && (
                  <button
                    type="button"
                    onClick={() => setHeroWeatherNonce((n) => n + 1)}
                    className="tabular-nums text-white/45 transition hover:text-white/70"
                    aria-label={t.heroWeatherRetry}
                  >
                    —
                  </button>
                )}
                {heroWeather.status === 'ok' && (
                  <span className="tabular-nums">{Math.round(heroWeather.temp)}°C</span>
                )}
              </div>
            </div>
            <div className="shrink-0" role="group" aria-label="Language">
              <div className="flex rounded-full border border-white/10 bg-white/5 p-0.5 backdrop-blur-md">
                {LANGS.map(({ id, short }) => (
                  <button key={id} type="button" onClick={() => setLang(id)} className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide transition ${lang === id ? 'bg-white text-stone-900' : 'text-white/50 hover:text-white'}`}>
                    {short}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto flex min-h-0 flex-1 flex-col justify-end pb-2 pt-1 sm:pb-4">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
              <h1 className="font-display text-[clamp(1.85rem,6.5vw,3.25rem)] font-bold leading-[0.95] tracking-tight text-white">
                {t.heroLine1}<br />
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">{t.heroLine2}</span>
              </h1>
              <p className="mt-3 max-w-xl text-pretty text-sm leading-snug text-white/60 sm:text-[15px] sm:leading-snug">{t.heroLead}</p>

              <div className="mt-5 w-fit max-w-full self-start">
                <div className="flex flex-wrap gap-2">
                  <motion.a href="#registration" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-stone-950 shadow-lg shadow-emerald-500/25 sm:px-6 sm:text-[13px]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {t.ctaReserve} <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </motion.a>
                  <a href="#itinerary" className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-medium text-white/80 backdrop-blur-sm hover:bg-white/10 transition sm:text-[13px]">
                    {t.ctaRoute}
                  </a>
                </div>

                <dl className="mt-4 grid w-full grid-cols-2 gap-1.5">
                  {[
                    { icon: Compass, t: t.statHours, d: t.statHoursSub },
                    { icon: Mountain, t: t.statChapters, d: t.statChaptersSub },
                    { icon: Users, t: t.statGroup, d: t.statGroupSub },
                    { icon: Bus, t: t.statYvn, d: t.statYvnSub },
                  ].map(({ icon: Icon, t: tt, d }) => (
                    <div key={tt} className="min-w-0 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 backdrop-blur-md">
                      <Icon className="mb-0.5 h-3 w-3 shrink-0 text-emerald-400/80" aria-hidden />
                      <dt className="truncate text-[11px] font-semibold leading-snug text-white/90">{tt}</dt>
                      <dd className="mt-1 break-words text-[9px] leading-snug text-white/40">{d}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </div>

          <motion.a href="#itinerary" className="mx-auto mt-5 flex flex-col items-center gap-1 text-white/30 sm:absolute sm:bottom-3 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2" animate={{ y: [0, 5, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} aria-label={t.scrollHint}>
            <ChevronDown className="h-6 w-6" />
          </motion.a>
        </div>
      </header>

      {/* ── ITINERARY — story-style agenda (glass panel + horizontal scroll) ── */}
      <section id="itinerary" className="scroll-mt-2 bg-stone-100 pb-6 pt-8 sm:pb-8">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-5">
          <Tag>{t.routeLabel}</Tag>
          <h2 className="font-display text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">{t.routeTitle}</h2>
          <p className="mx-auto mt-1 max-w-md whitespace-pre-line text-xs leading-snug text-stone-500">{t.routeIntro}</p>
        </div>

        <div className="mx-auto mt-6 max-w-lg px-4 sm:px-5">
          <div className="relative flex aspect-[9/16] max-h-[min(88dvh,820px)] w-full flex-col overflow-hidden rounded-[2rem] bg-stone-900 shadow-2xl ring-1 ring-black/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeStep}-${coverPick}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-0 z-0 h-full w-full"
              >
                <CoverMediaBox
                  src={heroCover}
                  className="h-full w-full object-cover"
                  preload="auto"
                  aria-hidden
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-stone-950/45 via-transparent to-stone-950/10" />

            {/* Top — story segments + counter + play (above tap/swipe layer) */}
            <div className="relative z-20 shrink-0 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <div className="flex gap-0.5">
                {journey.map((_, i) => (
                  <div
                    key={`seg-${i}`}
                    className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${i <= activeStep ? 'bg-white' : 'bg-white/25'}`}
                    aria-hidden
                  />
                ))}
              </div>
              <div className="mt-2.5 flex items-start justify-between gap-2">
                <span className="whitespace-nowrap rounded-full border border-white/15 bg-black/30 px-2 py-1 text-[11px] font-medium tabular-nums text-white backdrop-blur-md">
                  {activeStep + 1} / {journey.length}
                </span>
                <button
                  type="button"
                  onClick={() => setRouteAutoplay((v) => !v)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition hover:bg-black/45"
                  aria-pressed={routeAutoplay}
                  aria-label={routeAutoplay ? 'Pause itinerary' : 'Play itinerary'}
                >
                  {routeAutoplay ? <Pause className="h-3.5 w-3.5" fill="currentColor" /> : <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" />}
                </button>
              </div>
            </div>

            {/* Instagram-style: tap left/right edges or swipe on the photo (not on the glass strip) */}
            <div
              role="application"
              aria-roledescription="story"
              aria-label={t.routeStoryHint}
              tabIndex={0}
              className="relative z-10 min-h-[7.5rem] flex-1 touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35"
              onPointerDown={onStoryPointerDown}
              onPointerUp={onStoryPointerUp}
              onPointerCancel={onStoryPointerCancel}
              onKeyDown={onStoryKeyDown}
            />

            {/* Bottom — glass card + scroll-only agenda rail */}
            <div className="relative z-20 flex shrink-0 flex-col">
              <div className="mx-2.5 rounded-t-[1.35rem] border border-white/15 border-b-0 bg-stone-950/20 px-3 pb-3 pt-3.5 shadow-[0_-12px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm backdrop-saturate-150">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`panel-${activeStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <div className="flex gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 shadow-md shadow-emerald-950/35">
                        <CurIcon className="h-5 w-5 text-white" strokeWidth={1.75} aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          dir="ltr"
                          className="whitespace-nowrap font-display text-[clamp(1.25rem,4.5vw,1.65rem)] font-semibold leading-none tracking-tight text-white"
                        >
                          {cur.time}
                        </p>
                        <p className="mt-1 text-[12px] font-medium leading-tight text-white/90">{cur.label}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] leading-snug text-white/75">{cur.desc}</p>
                    <div className="mt-3 flex gap-1.5">
                      {[1, 0, 2].map((i) => {
                        const c = cur.covers[i] ?? cur.covers[0];
                        const src = c.startsWith('http') ? c : publicAsset(c);
                        return (
                        <button
                          key={`thumb-${activeStep}-${i}`}
                          type="button"
                          onClick={() => setCoverPick(i)}
                          className={`relative aspect-[4/3] flex-1 overflow-hidden rounded-xl bg-stone-800 transition-shadow ${
                            coverPick === i ? 'ring-[3px] ring-emerald-400' : 'ring-1 ring-white/15 opacity-90 hover:opacity-100'
                          }`}
                          aria-label={isCoverVideo(src) ? `Clip ${i + 1}` : `Photo ${i + 1}`}
                        >
                          <CoverMediaBox
                            src={src}
                            className="absolute inset-0 h-full w-full object-cover"
                            preload="metadata"
                            aria-hidden
                          />
                        </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="border-t border-white/10 bg-stone-950/20 px-2 py-2 backdrop-blur-sm">
                <div
                  dir="rtl"
                  className="hide-scrollbar flex gap-1.5 overflow-x-auto overflow-y-hidden pb-0.5 pl-2 pr-4"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                  aria-label={t.routeLabel}
                >
                  {[...journey].reverse().map((item, revIdx) => {
                    const i = journey.length - 1 - revIdx;
                    const StepIcon = item.icon;
                    const isActive = activeStep === i;
                    return (
                      <div
                        key={`${item.time}-${i}`}
                        ref={(el) => {
                          agendaPillRefs.current[i] = el;
                        }}
                        className={`flex shrink-0 cursor-default items-center gap-2 rounded-full border px-3.5 py-2 text-left text-[13px] font-semibold backdrop-blur-md ${
                          isActive
                            ? 'border-emerald-400/70 bg-white/20 text-white shadow-md shadow-black/20'
                            : 'border-white/15 bg-white/10 text-white/85'
                        }`}
                      >
                        <StepIcon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-white/45'}`} aria-hidden />
                        <span dir="ltr" className="tabular-nums">
                          {item.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INCLUDED + FAQ ── */}
      <section className="border-t border-stone-200 bg-stone-50 pt-8 pb-8 sm:pt-10 sm:pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 sm:px-8 sm:gap-12">
          <div>
            <Tag>{t.includedLabel}</Tag>
            <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">{t.includedTitle}</h2>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {t.includedItems.map((line, idx) => {
                const Icon = INCLUDED_ITEM_ICONS[idx] ?? Bus;
                return (
                  <li
                    key={line}
                    className="group flex gap-3 rounded-2xl border border-stone-200/80 bg-white/85 p-4 text-sm leading-snug text-stone-700 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden />
                    </span>
                    <span className="min-w-0 pt-0.5 font-medium leading-snug text-stone-700">{line}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <Tag>{t.faqLabel}</Tag>
            <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">{t.faqTitle}</h2>
            <div className="mt-6 space-y-2">
              {t.faqs.map(({ q, a }) => (
                <details key={q} className="group rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm open:shadow-md">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-stone-900 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-2">
                      {q}
                      <span className="text-stone-400 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-stone-500">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING + REGISTRATION ── */}
      <section id="registration" className="scroll-mt-2 border-t border-stone-200 bg-white pt-8 pb-[max(7rem,env(safe-area-inset-bottom))] sm:pt-10 sm:pb-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-3.5 text-white shadow-xl sm:rounded-2xl sm:px-5 sm:py-4 lg:col-span-12">
              <p className="text-center text-[8px] font-bold uppercase tracking-[0.22em] text-emerald-200/90 sm:text-[9px]">{t.priceLabel}</p>
              <div className="mt-3 flex flex-col items-stretch gap-3.5 sm:mt-3.5 sm:flex-row sm:gap-0 sm:py-0.5">
                <div className="flex flex-1 flex-col items-center justify-center px-1 text-center sm:px-2">
                  <p className="font-display text-[clamp(1.9rem,9vw,2.45rem)] font-bold leading-none tracking-tight text-white sm:text-[clamp(2.25rem,4.2vw,2.75rem)]">
                    25,000
                  </p>
                  <p className="mt-1.5 text-xs font-medium leading-none text-emerald-200/90 sm:text-sm">{t.priceSub}</p>
                </div>
                <div className="h-px w-full shrink-0 bg-white/25 sm:hidden" aria-hidden />
                <div className="hidden w-px shrink-0 self-stretch bg-white/25 sm:mx-1 sm:block" aria-hidden />
                <ul className="flex flex-1 flex-col justify-center gap-2 sm:min-w-0 sm:pl-1 sm:pr-0.5">
                  {t.priceHighlights.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-left">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-1 ring-white/10">
                        <Check className="h-2.5 w-2.5" strokeWidth={2.75} aria-hidden />
                      </span>
                      <span className="text-[11px] font-medium leading-snug text-white/95 sm:text-[12px]">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-7 shadow-inner sm:p-9 lg:col-span-12">
              <Tag>{t.regLabel}</Tag>
              <h2 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">{t.regTitle}</h2>
              <p className="mt-2 text-sm text-stone-500">{t.regPrivacy}</p>
              <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">{t.regName}</label>
                  <input id="name" required autoComplete="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-[15px] text-stone-900 outline-none placeholder:text-stone-300 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition" placeholder={t.regPhName} />
                </div>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">{t.regPhone}</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: normalizePhoneInput(e.target.value) })}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-[15px] text-stone-900 outline-none placeholder:text-stone-300 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition"
                      placeholder={t.regPhPhone}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">{t.regEmail}</label>
                    <input id="email" type="email" required autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-[15px] text-stone-900 outline-none placeholder:text-stone-300 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition" placeholder={t.regPhEmail} />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-400">{t.regMessage}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.regPhMessage}
                    className="min-h-[6.5rem] w-full resize-y rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-[15px] text-stone-900 outline-none placeholder:text-stone-300 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition"
                  />
                </div>
                <div>
                  <motion.button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || inCooldown}
                    className="w-full rounded-full bg-emerald-600 py-4 text-[15px] font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
                    whileHover={canSubmit && !isSubmitting && !inCooldown ? { scale: 1.01 } : undefined}
                    whileTap={canSubmit && !isSubmitting && !inCooldown ? { scale: 0.99 } : undefined}
                  >
                    {t.regSubmit}
                  </motion.button>
                  <p className="mt-4 text-center text-[13px] leading-relaxed text-stone-500">
                    {t.stickyContactLead}{' '}
                    <a
                      href={`tel:${STICKY_PHONE_TEL}`}
                      className="whitespace-nowrap font-semibold text-emerald-700 underline-offset-2 hover:underline"
                    >
                      {STICKY_PHONE_LABEL}
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
      </div>

      {/* ── Sticky CTA (width matches mobile column on desktop) ── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 transition-all duration-300 ${showStickyCta ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        aria-hidden={!showStickyCta}
      >
        <div className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-stone-200/90 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-stone-900">{t.stickyLine1}</p>
          </div>
          <a href="#registration" className="shrink-0 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition">
            {t.stickyBook}
          </a>
        </div>
      </div>
    </div>
  );
}
