import type { LucideIcon } from 'lucide-react';
import { Bus, Utensils, Church, Fish, Landmark, Soup, CableCar, Flame } from 'lucide-react';

export type Lang = 'en' | 'hy' | 'ru';

export const LANGS: { id: Lang; short: string; native: string }[] = [
  { id: 'hy', short: 'HY', native: 'Հայ' },
  { id: 'ru', short: 'RU', native: 'Рус' },
  { id: 'en', short: 'EN', native: 'EN' },
];

export type JourneyMeta = {
  time: string;
  icon: LucideIcon;
  covers: string[];
  /** Thumbnail left-to-right indices into `covers` (default [1, 0, 2]). */
  thumbOrder?: number[];
  /** Initial hero + selected thumb index (default 0). */
  defaultCover?: number;
};

const u = (id: string, w = 900) => `https://images.unsplash.com/${id}?w=${w}&q=80`;

/** Four themed frames per stop — shown as a mosaic in the itinerary. */
export const JOURNEY_META: JourneyMeta[] = [
  {
    time: '8:00',
    icon: Bus,
    covers: [
      '/itinerary-8am-1.png',
      '/itinerary-8am-2.mp4',
      '/itinerary-8am-3.mp4',
      '/itinerary-8am-1.png',
    ],
  },
  {
    time: '10:30–11:30',
    icon: Utensils,
    covers: [
      '/breakfast-2.png',
      '/breakfast-3.png',
      u('photo-1533089860892-a7c6f0a88666'),
      '/breakfast-2.png',
    ],
  },
  {
    time: '11:30–13:00',
    icon: Church,
    covers: [
      '/monastery-1.png',
      '/monastery-2.png',
      '/monastery-3.png',
      '/monastery-1.png',
    ],
  },
  {
    time: '13:00–14:30',
    icon: Fish,
    covers: [
      '/tsover-1.png',
      '/tsover-2.png',
      '/tsover-3.png',
      '/tsover-1.png',
    ],
  },
  {
    time: '14:30–15:00',
    icon: Landmark,
    thumbOrder: [0, 2, 1],
    defaultCover: 1,
    covers: [
      '/tumanyan-1.png',
      '/tumanyan-3.png',
      '/tumanyan-2.png',
      '/tumanyan-1.png',
    ],
  },
  {
    time: '15:00–16:00',
    icon: Soup,
    covers: [
      '/dzoreni-1.png',
      '/dzoreni-2.png',
      '/dzoreni-3.png',
      '/dzoreni-1.png',
    ],
  },
  {
    time: '16:00–18:00',
    icon: CableCar,
    covers: [
      '/activities-1.png',
      '/activities-2.png',
      '/activities-3.png',
      '/activities-1.png',
    ],
  },
  {
    time: '18:00–20:00',
    icon: Flame,
    covers: [
      '/campfire-2.png',
      '/campfire-1.png',
      '/campfire-3.png',
      '/campfire-2.png',
    ],
  },
  {
    time: '20:00',
    icon: Bus,
    covers: [
      '/itinerary-8pm-1.mp4',
      '/departure-2.png',
      '/itinerary-8pm-3.png',
      '/itinerary-8pm-1.mp4',
    ],
  },
];

type JourneyText = { label: string; desc: string };

const JOURNEY: Record<Lang, JourneyText[]> = {
  en: [
    { label: 'Departure from Yerevan', desc: 'Show your invitation postcard;) \nWe pick you up in the city center. Settle in - the mountain roads ahead are part of the experience.' },
    {
      label: 'Rural breakfast',
      desc: 'Welcome and settle in — the day starts here: fresh lavash, local cheese, garden honey and a strong coffee at a farmstead table with no roof, by but sky.',
    },
    {
      label: 'Hike to Bardzrakash Monastery',
      desc: 'Easy scenic trail through the forest.\n Along the way you will see the famous "Գիքորի աղբյուրը" (Gikor spring).',
    },
    {
      label: 'Zilling to “Tsover”, fishing',
      desc: 'Off-road ride through scenic forest paths. In "Tsover" lake you wll enjoy a peaceful fishing experience',
    },
    {
      label: 'Visit to the Hovhannes Tumanyan House-Museum',
      desc: 'Step into the childhood home of Armenia’s beloved poet. Explore rooms filled with personal artifacts, manuscripts, and the stories that shaped his legendary works.',
    },
    {
      label: 'Lunch at Dzoreni Restaurant',
      desc: 'Scenic open-air restaurant located right above the canyon. Taste traditional Armenian dishes with panoramic views of the canyon and sunset.',
    },
    {
      label: 'Free time & activities',
      desc:
        'Choose your own way to experience Dsegh.\nWhether you’re in the mood for something active, creative, or relaxing — there’s something for everyone:',
    },
    {
      label: 'Evening campfire & cocktails', 
      desc: 'End your day gathered around a cozy campfire at Alereks. Enjoy cocktails or herbal tea, grill sausages or marshmallows over the fire',
    },
    { label: 'Departure to Yerevan', desc: 'End of the pass — onward travel.' },
  ],
  hy: [
    {
      label: 'Մեկնում Երևանից',
      desc: 'Ցույց տվեք Դսեղի պոստքարտը։ Կհանդիպենք քաղաքի կենտրոնում: \nՀարմար տեղավորվեք, քանի որ լեռնային ճանապարհները փորձառության մի մասն են։',
    },
    {
      label: 'Գյուղական նախաճաշ',
      desc: 'Կհանդիպենք Ալերեքսում. վրանային ճամբար, որտեղ կհանգստանաք երկար ճանապարհից, կնախաճաշեք գյուղական ձևով՝ թարմ լավաշ, տեղական պանիր, այգու մեղր և թունդ սուրճ՝ բաց երկնքի տակ:',
    },
    {
      label: 'Արշավ դեպի Բարձրաքաշ Սուրբ Գրիգորի վանք',
      desc: 'Անտառային արահետ ձորի միջով, որը մեզ կհասցնի 13-րդ դարում կառուցված Բարձրաքաշ Սուրբ Գրիգորի վանք, որի ճանապարհին է հայտնի հայկական ֆիլմի Գիքորի աղբյուրը։',
    },
    {
      label: 'Զիլլինգ դեպի «Ծովեր»',
      desc: 'Արկածային զբոսանք դեպի գողտրիկ «Ծովեր» լիճ, որտեղ կզբաղվենք ձկնորսությամբ։',
    },
    {
      label: 'Հովհաննես Թումանյանի տուն-թանգարանի այց',
      desc: 'Այցելեք Հայաստանի սիրված բանաստեղծի մանկության տունը։ Ճանաչեք անձնական արժեքներ, ձեռագրություններ և պատմություններ, որոնք ձևավորել են նրա անմահ ստեղծագործությունները։',
    },
    {
      label: 'Ճաշ «Ձորենի» ռեստորանում։',
      desc: 'Գեղատեսիլ բացօթյա ռեստորան, որը գտնվում է Լոռվա կիրճի անմիջապես վերևում։ Համտեսեք ավանդական հայկական ուտեստներ՝ կիրճի և մայրամուտի աննկարագրելի տեսարաններով։',
    },
    {
      label: 'Ազատ ժամանց և փորձառություններ',
      desc: 'Բացահայտիր Դսեղը քո ձևով։ Անկախ նրանից՝ ուզում ես ակտիվ արկած, ստեղծագործ զբաղմունք կամ պարզապես պասիվ հանգիստ — այստեղ յուրաքանչյուրի համար ինչ-որ բան կա։',
    },
    {
      label: 'Երեկոյան խարույկ և կոկտեյլներ',
      desc: 'Ալերեքսում օրը ավարտվում է խարույկի շուրջ։ Վայելիր տարբեր համերի կոկտեյլներ կամ խոտաբույսերով թեյ, ջերմ միջավայրում խորովիր նրբերշիկներ նոր ընկերների հետ։',
    },
    { label: 'Վերադարձ դեպի Երևան', desc: 'Կհանդիպենք այլ առիթով' },
  ],
  ru: [
    {
      label: 'Отправление из Еревана',
      desc: 'Покажите пригласительную открытку ;)\nМы заберём вас в центре города. Устраивайтесь поудобнее — горные дороги впереди тоже часть приключения.',
    },
    {
      label: 'Деревенский завтрак',
      desc: 'Добро пожаловать — день начинается здесь: свежий лаваш, местный сыр, садовый мёд и крепкий кофе за фермерским столом без крыши — только небо.',
    },
    {
      label: 'Поход к монастырю Барdzракаш Св. Григория',
      desc: 'Живописная тропа через лес.\nПо пути вы увидите знаменитый «Гикори агбюр» (родник Гикора).',
    },
    {
      label: 'Зиллинг к озеру «Цовер», рыбалка',
      desc: 'Внедорожная поездка по живописным лесным тропам. На озере «Цовер» вас ждёт спокойная рыбалка.',
    },
    {
      label: 'Посещение дома-музея Ованнеса Туманяна',
      desc: 'Загляните в дом детства любимого армянского поэта. Личные вещи, рукописи и истории, из которых выросли его легендарные произведения.',
    },
    {
      label: 'Обед в ресторане «Дзорени»',
      desc: 'Живописный ресторан под открытым небом прямо над каньоном. Попробуйте традиционные армянские блюда с панорамным видом на каньон и закат.',
    },
    {
      label: 'Свободное время и активности',
      desc: 'Выберите свой способ узнать Дсех.\nХотите активностей, творчества или просто отдыха — здесь найдётся что-то для каждого.',
    },
    {
      label: 'Вечерний костёр и коктейли',
      desc: 'Завершите день у уютного костра в Алерексе. Коктейли или травяной чай, жарьте сосиски на огне в кругу новых друзей.',
    },
    { label: 'Возвращение в Ереван', desc: 'Конец маршрута — в путь обратно.' },
  ],
};

export function getJourney(lang: Lang) {
  return JOURNEY_META.map((meta, i) => ({
    ...meta,
    ...JOURNEY[lang][i],
  }));
}

export type Copy = {
  metaPrice: string;
  heroLine1: string;
  heroLine2: string;
  heroLead: string;
  ctaReserve: string;
  ctaRoute: string;
  statHours: string;
  statHoursSub: string;
  statYvn: string;
  statYvnSub: string;
  statGroup: string;
  statGroupSub: string;
  statChapters: string;
  statChaptersSub: string;
  statsStopsLine: string;
  statsPriceLine: string;
  statsGuestsLine: string;
  whyLabel: string;
  whyTitle: string;
  whyP1: string;
  whyP2: string;
  quote: string;
  quoteBy: string;
  trust1: string;
  trust2: string;
  trust3: string;
  bentoLori: string;
  bentoLoriTitle: string;
  bentoHoursCap: string;
  bentoHoursSub: string;
  bentoMeals: string;
  bentoMonastery: string;
  bentoEveningLbl: string;
  bentoEveningTitle: string;
  bentoEveningSub: string;
  routeLabel: string;
  routeTitle: string;
  routeIntro: string;
  routeStoryHint: string;
  routeChapter: string;
  includedLabel: string;
  includedTitle: string;
  includedItems: string[];
  faqLabel: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  priceLabel: string;
  priceSub: string;
  /** Short list beside the price (same order in every language). */
  priceHighlights: string[];
  regLabel: string;
  regTitle: string;
  regPrivacy: string;
  regName: string;
  regPhone: string;
  regEmail: string;
  regMessage: string;
  regSubmit: string;
  regPhName: string;
  regPhPhone: string;
  regPhEmail: string;
  regPhMessage: string;
  stickyLine1: string;
  /** After registration submit; also used for the clickable phone (same number in all languages). */
  stickyContactLead: string;
  stickyBook: string;
  scrollHint: string;
  /** Short place name in the hero map pill (before language switcher). */
  heroLocationShort: string;
  heroLocationAria: string;
  heroWeatherAria: string;
  heroWeatherRetry: string;
  alertThanks: string;
};

export const COPY: Record<Lang, Copy> = {
  en: {
    metaPrice: '25,000 AMD',
    heroLine1: 'Let me take you',
    heroLine2: 'to Dsegh',
    heroLead:
      'Explore Dsegh — where every place tells a story',
    ctaReserve: 'Book Your Spot',
    ctaRoute: 'Explore the Day Plan',
    statHours: 'Guided by locals',
    statHoursSub: 'Travel with people who know every corner',
    statYvn: 'Door-to-door transport',
    statYvnSub: 'Pickup and return from Yerevan',
    statGroup: 'Group of 20',
    statGroupSub: 'Meet people who travel like you do',
    statChapters: 'All-inclusive experience',
    statChaptersSub: 'Hiking, food, biking, horse riding & more',
    statsStopsLine: 'stops from dawn to city lights',
    statsPriceLine: 'AMD per person, all-in style',
    statsGuestsLine: 'guests hosted in past seasons',
    whyLabel: 'Why this trip exists',
    whyTitle: 'Dsegh is not a checkbox — it is a rhythm.',
    whyP1:
      'Most “day tours” rush you through sights. This one is built like a long lunch with friends who happen to know every bend in the road: where the light hits the monastery wall, which table at Dzoreni catches the sunset, and when to stop for coffee so nobody feels hurried.',
    whyP2:
      'You are not buying a bus seat. You are buying a curated day — logistics, timing, translations, and awkward silences handled — so your attention stays on stone, water, and the people who live here.',
    quote:
      'If I only had one day to show someone Armenia outside Yerevan — this is the day I would choose.',
    quoteBy: '— host note',
    trust1: 'Licensed transport & insured activities',
    trust2: 'Village partners paid fairly',
    trust3: 'Direct line after you book',
    bentoLori: 'Lori region',
    bentoLoriTitle: 'Mountains first, everything else follows.',
    bentoHoursCap: '11+',
    bentoHoursSub: 'hours of landscape, food, and unplanned conversations',
    bentoMeals: 'Two real meals, not gas-station snacks.',
    bentoMonastery: 'Monastery hike · forest air · stone under your palm',
    bentoEveningLbl: 'Evening',
    bentoEveningTitle: 'Bonfire, cocktails, stars.',
    bentoEveningSub: 'The day softens here — no schedule, just warmth.',
    routeLabel: 'The route',
    routeTitle: 'Your day — scene by scene',
    routeIntro:
      'From village breakfast to mountain views — your full journey.\nTap the sides to see what awaits you.',
    routeStoryHint:
      'Itinerary story: tap the left or right side of the photo, or swipe horizontally. Arrow keys work when this area is focused.',
    routeChapter: 'Chapter',
    includedLabel: 'Included',
    includedTitle: 'What the ticket covers',
    includedItems: [
      'Round-trip transportation',
      'Village breakfast & lunch',
      'Evening campfire with snacks & drinks',
      'Horseback riding & cycling',
      'Guided nature walks & monastery trails',
      'Cheese-making masterclass',
    ],
    faqLabel: 'Frequently asked questions',
    faqTitle: 'Before you pack',
    faqs: [
      {
        q: 'What should I bring?',
        a: 'Layers for mountain weather, comfortable shoes for the monastery hike, sunscreen, and a phone with space for photos you will actually look at again.',
      },
      {
        q: 'Can I arrive late or leave early?',
        a: 'Yes — that’s absolutely fine! Just let us know in advance so we can plan accordingly and make sure everything runs smoothly for you and the group.',
      },
      {
        q: 'Where exactly is pickup?',
        a: 'We confirm the exact place the week of your trip — usually downtown Yerevan between 8:45 and 9:00.',
      },
      {
        q: 'Are allergies and dietary preferences accommodated?',
        a: 'Tell us when you register. Village kitchens are flexible — we have handled vegetarian, vegan, and gluten-aware menus before.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Plans change — we get it! Just let us know in advance. You can cancel up to 5 days before the tour for a full refund. For later cancellations, a 50% fee usually applies.',
      },
    ],
    priceLabel: 'Per person',
    priceSub: 'AMD',
    priceHighlights: [
      'Round-trip transport from Yerevan',
      'Breakfast, lunch & tastings',
      'All guided activities',
      'Evening bonfire & cocktail',
    ],
    regLabel: 'Registration',
    regTitle: 'Book Your Spot',
    regPrivacy: 'We wll confirm the details and payment via email or phone.',
    regName: 'Name & surname',
    regPhone: 'Phone',
    regEmail: 'Email',
    regMessage: 'Message (optional)',
    regSubmit: 'Submit registration',
    regPhName: 'Ani Sargsyan',
    regPhPhone: '+374 …',
    regPhEmail: 'you@…',
    regPhMessage: 'Questions, dietary needs, pickup preferences, or anything else…',
    stickyLine1: '25,000 AMD / person · Dsegh full day',
    stickyContactLead: 'Have any questions? Feel free to contact us at',
    stickyBook: 'Book',
    scrollHint: 'Continue',
    heroLocationShort: 'Dsegh',
    heroLocationAria: 'Open Dsegh on Google Maps',
    heroWeatherAria: 'Current temperature in Dsegh',
    heroWeatherRetry: 'Retry weather',
    alertThanks: 'Thank you for registering! We will contact you soon.',
  },
  hy: {
    metaPrice: '25,000 դրամ',
    heroLine1: 'Արի գնանք',
    heroLine2: 'Դսեղ',
    heroLead:
      'Բացահայտիր Դսեղը՝ վայր, որտեղ ամեն անկյուն պատմություն ունի',
    ctaReserve: 'Ամրագրիր քո տեղը',
    ctaRoute: 'Բացահայտիր երթուղին',
    statHours: 'Ճամփորդիր լոռեցիների ուղեկցությամբ',
    statHoursSub: 'Ճանապարհորդիր նրանց հետ, ովքեր ճանաչում են Դսեղի ամեն անկյունը',
    statYvn: 'Երկկողմանի փոխադրում',
    statYvnSub: 'Մեկնում և վերադարձ Երևանից',
    statGroup: 'Մինչև 20 հոգանոց խումբ',
    statGroupSub: 'Հանդիպիր մարդկանց, ովքեր ճամփորդում են քեզ նման',
    statChapters: 'Լիարժեք արկածային փորձառություն',
    statChaptersSub: 'Արշավներ, համեղ ուտեստներ, հեծանվավարություն, ձիավարություն և ավելին',
    statsStopsLine: 'կայան արևածագից մինչև քաղաքի լույսեր',
    statsPriceLine: 'դրամ մեկ անձի համար, ներառյալ հիմնականը',
    statsGuestsLine: 'հյուրեր նախորդ մրցաշրջաններում',
    whyLabel: 'Ինչու է սա գոյություն ունենում',
    whyTitle: 'Դսեղը վանդակ չէ — ռիթմ է։',
    whyP1:
      'Շատ «օրվա տուրեր» քեզ շտապեցնում են կետերով։ Սա կառուցված է ինչպես երկար ճաշ ընկերների հետ, որոնք ճանաչում են յուրաքանչյուր շրջադարձը՝ որտեղ է լույսը հարվածում վանքի պատին, որ սեղանն է «Ձորենիում» բռնում մայրամուտը, և երբ կանգ առնել սուրճի համար, որ ոչ ոք չշտապի։',
    whyP2:
      'Դու չես գնում ավտոբուսի տեղ։ Դու գնում ես մեկ ընտրովի օր՝ լոգիստիկա, ժամանակացույց, թարգմանություններ և լծված լռություններ մեր կողմից, որ քո ուշադրությունը մնա քարի, ջրի և այստեղ ապրող մարդկանց վրա։',
    quote:
      'Եթե միայն մի օր ունենայի ցույց տալու Հայաստանը Երևանից դուրս — սա այն օրն է, որը կընտրեի։',
    quoteBy: '— հյուրընկալի նշում',
    trust1: 'Թույլատրված տրանսպորտ և ապահովագրված գործողություններ',
    trust2: 'Գյուղական գործընկերներն արդար են վճարվում',
    trust3: 'Ուղիղ կապ ամրագրումից հետո',
    bentoLori: 'Լոռու մարզ',
    bentoLoriTitle: 'Սկզբում լեռները, մնացածը հետևում է։',
    bentoHoursCap: '11+',
    bentoHoursSub: 'ժամ բնապատկերի, կերակուրի և չպլանավորված խոսակցությունների',
    bentoMeals: 'Երկու իրական կերակուր, ոչ բենզինակայանային սնունդ։',
    bentoMonastery: 'Վանքային արահետ · անտառային օդ · քար ձեռքիդ տակ',
    bentoEveningLbl: 'Երեկո',
    bentoEveningTitle: 'Կրակ, կոկտեյլներ, աստղեր։',
    bentoEveningSub: 'Օրը այստեղ է մեղմվում — առանց ժամանակացույցի, միայն ջերմություն։',
    routeLabel: 'Երթուղին և տևողությունը',
    routeTitle: 'Օրվա տրամադրությունը',
    routeIntro:
      'Գյուղական նախաճաշից մինչև լեռնային տեսարաններ՝ քո ամբողջ ճանապարհը մեկ օրում։ \n Թերթիր ավելին բացահայտելու համար…',
    routeStoryHint:
      'Երթուղու պատմություն. հպեք լուսանկարի ձախ կամ աջ կողմը, կամ սահեցրեք հորիզոնական։ Սլաքները աշխատում են ֆոկուսի ժամանակ։',
    routeChapter: 'Գլուխ',
    includedLabel: 'Ներառված',
    includedTitle: 'Ինչ է ներառված',
    includedItems: [
      'Երկկողմանի տրանսպորտ (Երևան-Դսեղ-Երևան)',
      'Գյուղական ճաշ և նախաճաշ',
      'Երեկոյան խարույկ՝ և հյուրասիրությամբ',
      'Ձիավարություն և հեծանվավարություն',
      'Բնության ուղեկցվող արշավներ և վանական արահետներ',
      'Պանրագործության վարպետաց դաս',
    ],
    faqLabel: 'Հաճախ տրվող հարցեր',
    faqTitle: 'Մինչ ճամփորդությունը',
    faqs: [
      {
        q: 'Ի՞նչ վերցնեմ ինձ հետ',
        a: 'Տաք հագուստ Լոռվա փոփոխական եղանակի համար, հարմար կոշիկներ՝ հարմարավետ կոշիկներ վանք արշավի ու փորձառությունների համար, արևապաշտպան միջոց և հեռախոսդ՝ այն լուսանկարների համար, որոնք դուք վստահաբար կրկին նայելու եք։',
      },
      {
        q: 'Կարո՞ղ եմ ուշ ժամանել կամ շուտ հեռանալ կամ գալ իմ մեքենայով',
        a: 'Այո, դա բացարձակապես նորմալ է։ Պարզապես նախապես տեղյակ պահեք մեզ, որպեսզի կարողանանք համապատասխան պլանավորել և համոզվել, որ ամեն ինչ հարթ կընթանա Ձեզ և խմբի համար։',
      },
      {
        q: 'Որտեղից ենք մեկնում։',
        a: 'Հանդիպման ճշգրիտ վայրը հաստատվում է շաբաթվա ընթացքում՝ սովորաբար Երևանի կենտրոնում, 8:45–9:00։',
      },
      {
        q: 'Սնունդը հարմարեցնու՞մ ենք ալերգիաներին ու նախընտրություններին։',
        a: 'Տեղեկացրու մեզ գրանցման պահին։ Գյուղական խոհանոցը ճկուն է՝ մենք նախկինում կազմակերպել ենք նաև բուսակեր, վեգան և գլյուտեն չպարունակող մենյուներ։',
      },
      {
        q: 'Ի՞նչ անել, եթե ամրագրելուց հետո պլանները փոխվել են։',
        a: 'Պլանները փոխվում են՝ մենք դա հասկանում ենք։ Պարզապես նախապես տեղեկացրու մեզ։ \nԴու կարող ես չեղարկել տուրը մինչև 5 օր առաջ՝ ամբողջ գումարի վերադարձի համար, սակայն ավելի ուշ չեղարկումների դեպքում սովորաբար պահվում է 50% կանխավճար։',
      },
    ],
    priceLabel: 'Մեկ անձի համար',
    priceSub: 'դրամ',
    priceHighlights: [
      'Երկկողմանի տրանսպորտ',
      'Գյուղական նախաճաշ, ճաշ և համտեսներ',
      'Լիարժեք արկածային փորձառություն',
      'Երեկոյան խարույկ և կոկտեյլներ',
    ],
    regLabel: 'Գրանցում',
    regTitle: 'Ամրագրիր քո տեղը',
    regPrivacy: 'Մենք կկապվենք Ձեզ հետ մանրամասները քննարկելու և վճարումը հաստատելու համար',
    regName: 'Անուն ազգանուն',
    regPhone: 'Հեռախոսահամար',
    regEmail: 'Էլ․ փոստ',
    regMessage: 'Հաղորդագրություն (ըստ ցանկության)',
    regSubmit: 'Ուղարկել գրանցումը',
    regPhName: 'Անի Սարգսյան',
    regPhPhone: '+374 …',
    regPhEmail: 'you@…',
    regPhMessage: 'Հարցեր, սննդի նախընտրություններ, pickup, այլ նշումներ…',
    stickyLine1: '25,000 դրամ / անձ · Դսեղ ամբողջ օր',
    stickyContactLead: 'Ունե՞ք հարցեր — կարող եք կապվել՝',
    stickyBook: 'Ամրագրել',
    scrollHint: 'Շարունակել',
    heroLocationShort: 'Դսեղ',
    heroLocationAria: 'Բացել Դսեղը Google Maps-ում',
    heroWeatherAria: 'Դսեղի ներկայիս ջերմաստիճանը',
    heroWeatherRetry: 'Կրկին փորձել',
    alertThanks: 'Շնորհակալություն գրանցման համար։ Շուտով կկապվենք։',
  },
  ru: {
    metaPrice: '25 000 драм',
    heroLine1: 'Давай отвезу тебя',
    heroLine2: 'в Дсех',
    heroLead:
      'Открой Дсех — место, где за каждым углом своя история',
    ctaReserve: 'Забронировать место',
    ctaRoute: 'Смотреть маршрут дня',
    statHours: 'С местными гидами',
    statHoursSub: 'Путешествуйте с людьми, которые знают каждый уголок',
    statYvn: 'Трансфер от двери до двери',
    statYvnSub: 'Отправление и возврат из Еревана',
    statGroup: 'Группа до 20 человек',
    statGroupSub: 'Знакомьтесь с людьми, которые путешествуют как вы',
    statChapters: 'Полный комплект впечатлений',
    statChaptersSub: 'Походы, еда, велосипед, верховая езда и многое другое',
    statsStopsLine: 'остановок от рассвета до городских огней',
    statsPriceLine: 'драм на человека, всё включено',
    statsGuestsLine: 'гостей приняли в прошлых сезонах',
    whyLabel: 'Зачем существует этот тур',
    whyTitle: 'Дсех — не галочка в списке, это ритм.',
    whyP1:
      'Большинство «однодневок» гонят по точкам. Этот день устроен как долгий обед с друзьями, которые знают каждый поворот: где свет ложится на стену монастыря, какой столик в «Дзорени» ловит закат и когда остановиться на кофе, чтобы никто не торопился.',
    whyP2:
      'Вы покупаете не место в автобусе. Вы покупаете собранный день — логистику, время, переводы и неловкие паузы мы берём на себя, чтобы ваше внимание осталось на камне, воде и людях, которые здесь живут.',
    quote:
      'Если бы у меня был только один день, чтобы показать Армению за пределами Еревана — я бы выбрал этот.',
    quoteBy: '— заметка организатора',
    trust1: 'Лицензированный транспорт и застрахованные активности',
    trust2: 'Справедливая оплата деревенским партнёрам',
    trust3: 'Прямая связь после бронирования',
    bentoLori: 'Регион Лори',
    bentoLoriTitle: 'Сначала горы — остальное следует за ними.',
    bentoHoursCap: '11+',
    bentoHoursSub: 'часов пейзажа, еды и незапланированных разговоров',
    bentoMeals: 'Два настоящих приёма пищи, а не перекус на заправке.',
    bentoMonastery: 'Тропа к монастырю · лесной воздух · камень под ладонью',
    bentoEveningLbl: 'Вечер',
    bentoEveningTitle: 'Костёр, коктейли, звёзды.',
    bentoEveningSub: 'День смягчается здесь — без расписания, только тепло.',
    routeLabel: 'Маршрут и длительность',
    routeTitle: 'Настроение дня',
    routeIntro:
      'От деревенского завтрака до горных видов — весь ваш маршрут за один день.\nЛистайте, чтобы узнать больше…',
    routeStoryHint:
      'История маршрута: нажмите левую или правую часть фото или проведите горизонтально. Стрелки работают в фокусе.',
    routeChapter: 'Глава',
    includedLabel: 'Включено',
    includedTitle: 'Что входит в стоимость',
    includedItems: [
      'Трансфер туда-обратно (Ереван – Дсех – Ереван)',
      'Деревенский завтрак и обед',
      'Вечерний костёр с угощениями и напитками',
      'Верховая езда и велопрогулки',
      'Пешие прогулки с гидом и тропы к монастырю',
      'Мастер-класс по сыроварению',
    ],
    faqLabel: 'Часто задаваемые вопросы',
    faqTitle: 'Перед поездкой',
    faqs: [
      {
        q: 'Что взять с собой?',
        a: 'Тёплую одежду для переменчивой горной погоды, удобную обувь для похода к монастырю, солнцезащитный крем и телефон — для фотографий, которые вы точно будете пересматривать.',
      },
      {
        q: 'Могу ли я приехать позже или уехать раньше?',
        a: 'Да, это абсолютно нормально! Просто предупредите нас заранее, чтобы мы могли всё спланировать и обеспечить комфорт для вас и группы.',
      },
      {
        q: 'Где именно встреча?',
        a: 'Точное место подтверждаем на неделе поездки — обычно центр Еревана, 8:45–9:00.',
      },
      {
        q: 'Учитываете ли вы аллергии и диетические предпочтения?',
        a: 'Сообщите нам при регистрации. Деревенская кухня гибкая — мы уже организовывали вегетарианское, веганское и безглютеновое меню.',
      },
      {
        q: 'Какова политика отмены?',
        a: 'Планы меняются — мы понимаем! Просто предупредите нас заранее. Вы можете отменить тур до 5 дней — полный возврат. При более поздней отмене обычно удерживается 50%.',
      },
    ],
    priceLabel: 'На человека',
    priceSub: 'драм',
    priceHighlights: [
      'Трансфер туда-обратно из Еревана',
      'Завтрак, обед и дегустации',
      'Все активности с гидом',
      'Вечерний костёр и коктейли',
    ],
    regLabel: 'Регистрация',
    regTitle: 'Забронировать место',
    regPrivacy: 'Мы свяжемся с вами для уточнения деталей и подтверждения оплаты.',
    regName: 'Имя и фамилия',
    regPhone: 'Номер телефона',
    regEmail: 'Эл. почта',
    regMessage: 'Сообщение (по желанию)',
    regSubmit: 'Отправить заявку',
    regPhName: 'Ани Саргсян',
    regPhPhone: '+374 …',
    regPhEmail: 'you@…',
    regPhMessage: 'Вопросы, диета, предпочтения по посадке или что угодно…',
    stickyLine1: '25 000 драм / чел. · Дсех на целый день',
    stickyContactLead: 'Есть вопросы? Свяжитесь с нами:',
    stickyBook: 'Забронировать',
    scrollHint: 'Дальше',
    heroLocationShort: 'Дсех',
    heroLocationAria: 'Открыть Дсех в Google Картах',
    heroWeatherAria: 'Текущая температура в Дсехе',
    heroWeatherRetry: 'Повторить',
    alertThanks: 'Спасибо за регистрацию! Мы скоро свяжемся с вами.',
  },
};

/** Dsegh, Lori — map anchor */
export const DSEGH_LAT = 40.9897;
export const DSEGH_LON = 44.6517;
