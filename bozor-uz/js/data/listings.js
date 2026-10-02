/* Mock listings. Django version: GET /api/listings/?category=&region=&... .
   Keep this exact shape server-side (or adapt api.js mapListing()) so the
   rest of the frontend needs no changes. */

const SELLERS = [
  { id: 'u1', name: 'Аброр Тошматов', regionId: 'tashkent-city', registered: '2022-03-11', rating: 4.8, reviews: 34, phone: '+998 90 123-45-67' },
  { id: 'u2', name: 'Дилноза Каримова', regionId: 'samarkand', registered: '2023-06-02', rating: 4.6, reviews: 12, phone: '+998 91 234-56-78' },
  { id: 'u3', name: 'AutoPark Tashkent (авто-салон)', regionId: 'tashkent-city', registered: '2020-01-19', rating: 4.9, reviews: 210, phone: '+998 71 200-10-10' },
  { id: 'u4', name: 'Бекзод Юсупов', regionId: 'fergana', registered: '2024-02-15', rating: 4.3, reviews: 6, phone: '+998 93 345-67-89' },
  { id: 'u5', name: 'TechnoMart', regionId: 'tashkent-city', registered: '2019-11-05', rating: 4.7, reviews: 540, phone: '+998 78 150-50-50' },
  { id: 'u6', name: 'Нилуфар Раҳимова', regionId: 'bukhara', registered: '2023-09-23', rating: 5.0, reviews: 9, phone: '+998 94 456-78-90' },
  { id: 'u7', name: 'Жасур Эргашев', regionId: 'namangan', registered: '2021-07-30', rating: 4.5, reviews: 28, phone: '+998 90 567-89-01' },
  { id: 'u8', name: 'Строй-Сервис Хорезм', regionId: 'khorezm', registered: '2022-12-08', rating: 4.4, reviews: 17, phone: '+998 91 678-90-12' },
];

function seller(id){ return SELLERS.find(s => s.id === id); }
function imgs(seed, n){ return Array.from({length:n}, (_,i)=>`https://picsum.photos/seed/${seed}${i}/900/675`); }

const LISTINGS = [
  {
    id: 1, title: 'Chevrolet Cobalt, 2021, белый, идеальное состояние',
    price: 128000000, currency: 'UZS', negotiable: true,
    category: 'transport', sub: 'Легковые автомобили', regionId: 'tashkent-city', city: 'Ташкент, Юнусабадский р-н',
    createdAt: '2026-08-27T09:10:00', promoted: true, views: 341,
    images: imgs('cobalt', 6),
    description: 'Продаю Chevrolet Cobalt 2021 года выпуска. Один хозяин, вся история обслуживания на руках, не бита, не крашена. Полная комплектация: климат-контроль, подогрев сидений, датчики парковки. Резина зима/лето в комплекте.',
    attrs: { brand: 'Chevrolet', year: 2021, mileage: 42000, transmission: 'Автомат' },
    sellerId: 'u3', condition: 'Б/у',
  },
  {
    id: 2, title: '2-комнатная квартира в новостройке, Мирзо-Улугбекский р-н',
    price: 420000000, currency: 'UZS', negotiable: true,
    category: 'realty', sub: 'Продажа квартир', regionId: 'tashkent-city', city: 'Ташкент, Мирзо-Улугбекский р-н',
    createdAt: '2026-08-28T14:22:00', promoted: true, views: 512,
    images: imgs('flat1', 8),
    description: 'Просторная 2-комнатная квартира 64 м² в новом доме бизнес-класса. Свободная планировка, авторская отделка, панорамные окна. Рядом школа, детский сад, парк. Документы готовы, возможна ипотека.',
    attrs: { rooms: '2', area: 64, floor: 7 },
    sellerId: 'u1', condition: 'Новое',
  },
  {
    id: 3, title: 'iPhone 14 Pro 128GB, Deep Purple',
    price: 9800000, currency: 'UZS', negotiable: false,
    category: 'electronics', sub: 'Мобильные телефоны', regionId: 'tashkent-city', city: 'Ташкент, Чиланзарский р-н',
    createdAt: '2026-08-29T08:05:00', promoted: false, views: 220,
    images: imgs('iphone', 5),
    description: 'iPhone 14 Pro, 128 ГБ, цвет Deep Purple. Батарея 91%, комплект полный (коробка, кабель). Всегда с чехлом и стеклом, царапин нет. Причина продажи — перехожу на другую модель.',
    attrs: { brand: 'Apple', condition: 'Б/у' },
    sellerId: 'u5', condition: 'Б/у',
  },
  {
    id: 4, title: 'Ноутбук ASUS VivoBook 15, Ryzen 5, 16GB/512GB',
    price: 7200000, currency: 'UZS', negotiable: true,
    category: 'electronics', sub: 'Ноутбуки и компьютеры', regionId: 'samarkand', city: 'Самарканд',
    createdAt: '2026-08-26T18:40:00', promoted: false, views: 98,
    images: imgs('laptop', 4),
    description: 'Новый ноутбук ASUS VivoBook 15, не распакован. Процессор Ryzen 5 7530U, 16 ГБ ОЗУ, SSD 512 ГБ. Идеально для учёбы и офисной работы. Гарантия магазина 12 месяцев.',
    attrs: { brand: 'Asus', condition: 'Новое' },
    sellerId: 'u2', condition: 'Новое',
  },
  {
    id: 5, title: 'Требуется менеджер по продажам, з/п от 5 000 000 сум',
    price: 5000000, currency: 'UZS', negotiable: false,
    category: 'jobs', sub: 'Вакансии', regionId: 'tashkent-city', city: 'Ташкент, Яккасарайский р-н',
    createdAt: '2026-08-28T11:00:00', promoted: false, views: 410,
    images: imgs('office', 3),
    description: 'В строительную компанию требуется менеджер по продажам. Обязанности: работа с входящими заявками, ведение клиентской базы, консультации. График 5/2, оформление по ТК. Опыт от 1 года приветствуется.',
    attrs: { employment: 'Полная занятость', salary: 5000000 },
    sellerId: 'u1', condition: null,
  },
  {
    id: 6, title: 'Ремонт квартир под ключ, дизайн-проект в подарок',
    price: 1500000, currency: 'UZS', negotiable: true,
    category: 'services', sub: 'Ремонт и строительство', regionId: 'khorezm', city: 'Ургенч',
    createdAt: '2026-08-25T10:15:00', promoted: false, views: 76,
    images: imgs('remont', 5),
    description: 'Выполняем ремонт квартир и домов любой сложности: электрика, сантехника, штукатурка, поклейка обоев, укладка плитки. Бригада с опытом более 8 лет, работаем по договору с гарантией.',
    attrs: {}, sellerId: 'u8', condition: null,
  },
  {
    id: 7, title: 'Мужская куртка зимняя, размер L, новая',
    price: 320000, currency: 'UZS', negotiable: true,
    category: 'personal', sub: 'Одежда', regionId: 'fergana', city: 'Фергана',
    createdAt: '2026-08-29T07:30:00', promoted: false, views: 44,
    images: imgs('jacket', 4),
    description: 'Мужская зимняя куртка, размер L, новая, с бирками. Тёплый утеплитель, водоотталкивающая ткань. Покупалась про запас, не подошёл размер.',
    attrs: { size: 'L', condition: 'Новое' }, sellerId: 'u4', condition: 'Новое',
  },
  {
    id: 8, title: 'Угловой диван "Прага", раскладной, кожзам',
    price: 3400000, currency: 'UZS', negotiable: true,
    category: 'home-garden', sub: 'Мебель', regionId: 'tashkent-region', city: 'Нурафшон',
    createdAt: '2026-08-24T16:50:00', promoted: false, views: 133,
    images: imgs('sofa', 5),
    description: 'Угловой диван "Прага" в отличном состоянии, механизм еврокнижка, есть бельевой ящик. Обивка — качественный кожзам, легко чистится. Самовывоз или доставка по городу за отдельную плату.',
    attrs: { condition: 'Б/у' }, sellerId: 'u6', condition: 'Б/у',
  },
  {
    id: 9, title: 'Велосипед горный Trek Marlin 5, 27.5"',
    price: 4100000, currency: 'UZS', negotiable: true,
    category: 'hobby', sub: 'Спорттовары', regionId: 'namangan', city: 'Наманган',
    createdAt: '2026-08-27T13:20:00', promoted: false, views: 61,
    images: imgs('bike', 4),
    description: 'Горный велосипед Trek Marlin 5, колёса 27.5 дюймов, 21 скорость. Использовался один сезон, техническое состояние отличное, недавно прошёл ТО.',
    attrs: {}, sellerId: 'u7', condition: 'Б/у',
  },
  {
    id: 10, title: 'Toyota Camry 70, 2019, чёрный, полный привод',
    price: 259000000, currency: 'UZS', negotiable: true,
    category: 'transport', sub: 'Легковые автомобили', regionId: 'tashkent-city', city: 'Ташкент, Сергелийский р-н',
    createdAt: '2026-08-23T12:00:00', promoted: true, views: 890,
    images: imgs('camry', 7),
    description: 'Toyota Camry 70 2019 г.в. в отличном состоянии. Один владелец, вся сервисная история у официального дилера. Комплектация Prestige: панорамная крыша, вентиляция сидений, камера 360°.',
    attrs: { brand: 'Toyota', year: 2019, mileage: 61000, transmission: 'Автомат' },
    sellerId: 'u3', condition: 'Б/у',
  },
  {
    id: 11, title: '1-комнатная квартира в аренду, центр города',
    price: 3200000, currency: 'UZS', negotiable: true,
    category: 'realty', sub: 'Аренда квартир', regionId: 'tashkent-city', city: 'Ташкент, Шайхантахурский р-н',
    createdAt: '2026-08-29T09:45:00', promoted: false, views: 275,
    images: imgs('rentflat', 6),
    description: 'Сдаётся уютная 1-комнатная квартира в центре, с ремонтом и всей необходимой техникой. Рядом метро, рынок, школа. Оплата помесячно, залог за 1 месяц.',
    attrs: { rooms: '1', area: 38, floor: 3 },
    sellerId: 'u1', condition: null,
  },
  {
    id: 12, title: 'Samsung Galaxy S23 Ultra 256GB',
    price: 11500000, currency: 'UZS', negotiable: false,
    category: 'electronics', sub: 'Мобильные телефоны', regionId: 'bukhara', city: 'Бухара',
    createdAt: '2026-08-28T19:10:00', promoted: false, views: 156,
    images: imgs('s23', 5),
    description: 'Samsung Galaxy S23 Ultra, 256 ГБ, в идеальном состоянии, всегда в чехле и с плёнкой. В комплекте оригинальная зарядка и коробка. Гарантия магазина ещё 5 месяцев.',
    attrs: { brand: 'Samsung', condition: 'Б/у' },
    sellerId: 'u6', condition: 'Б/у',
  },
  {
    id: 13, title: 'Стиральная машина Artel 7кг, новая, гарантия',
    price: 2650000, currency: 'UZS', negotiable: false,
    category: 'electronics', sub: 'Бытовая техника', regionId: 'tashkent-city', city: 'Ташкент, Мирабадский р-н',
    createdAt: '2026-08-22T15:35:00', promoted: false, views: 302,
    images: imgs('washer', 4),
    description: 'Стиральная машина Artel загрузкой 7 кг. Новая, в заводской упаковке, официальная гарантия 3 года. Доставка по Ташкенту в день заказа.',
    attrs: { brand: 'Artel', condition: 'Новое' }, sellerId: 'u5', condition: 'Новое',
  },
  {
    id: 14, title: 'Требуется репетитор по математике для 9 класса',
    price: 100000, currency: 'UZS', negotiable: true,
    category: 'services', sub: 'Обучение и курсы', regionId: 'andijan', city: 'Андижан',
    createdAt: '2026-08-29T06:20:00', promoted: false, views: 39,
    images: imgs('tutor', 2),
    description: 'Ищем репетитора по математике для подготовки к выпускным экзаменам, 2-3 раза в неделю. Оплата за занятие (60 минут). Возможен онлайн-формат.',
    attrs: {}, sellerId: 'u4', condition: null,
  },
  {
    id: 15, title: 'Детская коляска 2 в 1, зима-лето',
    price: 1450000, currency: 'UZS', negotiable: true,
    category: 'personal', sub: 'Товары для детей', regionId: 'jizzakh', city: 'Джизак',
    createdAt: '2026-08-27T17:05:00', promoted: false, views: 58,
    images: imgs('stroller', 4),
    description: 'Детская коляска-трансформер 2 в 1, комплект люлька + прогулочный блок, дождевик и сумка в подарок. Состояние хорошее, использовалась аккуратно.',
    attrs: { condition: 'Б/у' }, sellerId: 'u2', condition: 'Б/у',
  },
  {
    id: 16, title: 'Земельный участок 6 соток под строительство',
    price: 185000000, currency: 'UZS', negotiable: true,
    category: 'realty', sub: 'Земельные участки', regionId: 'tashkent-region', city: 'Кибрайский р-н',
    createdAt: '2026-08-21T10:00:00', promoted: false, views: 190,
    images: imgs('land', 5),
    description: 'Участок 6 соток с документами (кадастр), ровный, коммуникации рядом (газ, свет, вода на границе участка). Хороший подъезд, тихий район, до города 20 минут.',
    attrs: { area: 600 }, sellerId: 'u1', condition: null,
  },
  {
    id: 17, title: 'Хиджаб-платье летнее, размер M-L',
    price: 180000, currency: 'UZS', negotiable: false,
    category: 'personal', sub: 'Одежда', regionId: 'namangan', city: 'Наманган',
    createdAt: '2026-08-26T09:40:00', promoted: false, views: 21,
    images: imgs('dress', 3),
    description: 'Лёгкое летнее платье, размер M-L, дышащая ткань, приятный оттенок мяты. Надевала пару раз, состояние отличное.',
    attrs: { size: 'M-L', condition: 'Б/у' }, sellerId: 'u7', condition: 'Б/у',
  },
  {
    id: 18, title: 'Хёндай Соната, 2020, серебристый',
    price: 176000000, currency: 'UZS', negotiable: true,
    category: 'transport', sub: 'Легковые автомобили', regionId: 'fergana', city: 'Фергана',
    createdAt: '2026-08-29T11:11:00', promoted: false, views: 245,
    images: imgs('sonata', 6),
    description: 'Hyundai Sonata 2020 года, второй владелец, полная сервисная история. Кожаный салон, климат-контроль, круиз-контроль. Возможен обмен с моей доплатой.',
    attrs: { brand: 'Hyundai', year: 2020, mileage: 55000, transmission: 'Автомат' },
    sellerId: 'u4', condition: 'Б/у',
  },
  {
    id: 19, title: 'Игровая приставка PlayStation 5 + 2 геймпада',
    price: 6900000, currency: 'UZS', negotiable: true,
    category: 'electronics', sub: 'ТВ, аудио и видео', regionId: 'tashkent-city', city: 'Ташкент, Алмазарский р-н',
    createdAt: '2026-08-25T20:15:00', promoted: true, views: 470,
    images: imgs('ps5', 4),
    description: 'PlayStation 5 (дисковая версия), в комплекте 2 оригинальных геймпада DualSense и 3 диска. Всё работает исправно, поводов для беспокойства нет.',
    attrs: { brand: 'Sony', condition: 'Б/у' }, sellerId: 'u5', condition: 'Б/у',
  },
  {
    id: 20, title: 'Ремонт и настройка компьютеров с выездом',
    price: 80000, currency: 'UZS', negotiable: true,
    category: 'services', sub: 'Ремонт и строительство', regionId: 'tashkent-city', city: 'Ташкент, Юнусабадский р-н',
    createdAt: '2026-08-24T14:00:00', promoted: false, views: 88,
    images: imgs('pcrepair', 2),
    description: 'Выполняю ремонт, чистку и настройку компьютеров и ноутбуков любой сложности с выездом на дом или в офис. Установка ОС, драйверов, антивируса. Опыт работы 6 лет.',
    attrs: {}, sellerId: 'u7', condition: null,
  },
  {
    id: 21, title: 'Дом 120 м² с участком 4 сотки, Бухара',
    price: 610000000, currency: 'UZS', negotiable: true,
    category: 'realty', sub: 'Дома и коттеджи', regionId: 'bukhara', city: 'Бухара',
    createdAt: '2026-08-20T09:00:00', promoted: false, views: 320,
    images: imgs('house', 8),
    description: 'Одноэтажный дом 120 м² на участке 4 сотки. Отдельный въезд, гараж, сад с плодовыми деревьями. Все коммуникации центральные, документы в порядке.',
    attrs: { rooms: '4', area: 120, floor: 1 },
    sellerId: 'u6', condition: 'Б/у',
  },
  {
    id: 22, title: 'Гитара акустическая Yamaha F310, новая',
    price: 1350000, currency: 'UZS', negotiable: false,
    category: 'hobby', sub: 'Музыкальные инструменты', regionId: 'tashkent-city', city: 'Ташкент, Шайхантахурский р-н',
    createdAt: '2026-08-28T08:50:00', promoted: false, views: 67,
    images: imgs('guitar', 4),
    description: 'Акустическая гитара Yamaha F310, новая в упаковке, чехол в комплекте. Отличный вариант для начинающих музыкантов.',
    attrs: {}, sellerId: 'u5', condition: 'Новое',
  },
  {
    id: 23, title: 'Кроссовки Nike Air Max, 42 размер, оригинал',
    price: 650000, currency: 'UZS', negotiable: true,
    category: 'personal', sub: 'Обувь', regionId: 'samarkand', city: 'Самарканд',
    createdAt: '2026-08-27T12:35:00', promoted: false, views: 54,
    images: imgs('nike', 4),
    description: 'Кроссовки Nike Air Max, размер 42, оригинал, чек и коробка сохранены. Надевал 2-3 раза, состояние почти новое.',
    attrs: { size: '42', condition: 'Б/у' }, sellerId: 'u2', condition: 'Б/у',
  },
  {
    id: 24, title: 'Коммерческое помещение 85 м² под магазин, 1-я линия',
    price: 5200000, currency: 'UZS', negotiable: true,
    category: 'realty', sub: 'Коммерческая недвижимость', regionId: 'tashkent-city', city: 'Ташкент, Мирзо-Улугбекский р-н',
    createdAt: '2026-08-19T13:40:00', promoted: false, views: 140,
    images: imgs('shop', 5),
    description: 'Сдаётся в аренду помещение 85 м² на первой линии с высокой проходимостью, отдельный вход, витринные окна. Подходит под магазин, салон или офис.',
    attrs: { area: 85, floor: 1 },
    sellerId: 'u1', condition: null,
  },
];

function getListingById(id){ return LISTINGS.find(l => Number(l.id) === Number(id)); }

/* ---------------------------------------------------------
   Demo-only persistence overlay.
   Because this is a static multi-page site, each page load re-runs
   this file and rebuilds LISTINGS from scratch. Without this step,
   a listing created or edited in add-listing.html would "disappear"
   the moment the browser navigates to the next page. We patch that
   here by merging in anything saved to localStorage by api.js.
   None of this is needed once Django is the source of truth — the
   backend's database naturally persists across page loads.
   --------------------------------------------------------- */
(function applyPersistedListingsOverlay(){
  try {
    const extra = JSON.parse(localStorage.getItem('bozor_user_listings') || '[]');
    extra.forEach(item => {
      const idx = LISTINGS.findIndex(l => l.id === item.id);
      if (idx > -1) LISTINGS[idx] = item; else LISTINGS.push(item);
    });
    const deleted = JSON.parse(localStorage.getItem('bozor_deleted_listings') || '[]');
    for (let i = LISTINGS.length - 1; i >= 0; i--){
      if (deleted.includes(LISTINGS[i].id)) LISTINGS.splice(i, 1);
    }
  } catch { /* ignore malformed localStorage state */ }
})();
