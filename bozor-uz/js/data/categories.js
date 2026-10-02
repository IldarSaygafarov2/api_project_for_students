/* Category tree. Django version: GET /api/categories/ with same shape.
   `attrs` describes the extra filter/attribute fields specific to a
   category — used both by the catalog filter sidebar and the
   "add listing" wizard. */
const CATEGORIES = [
  {
    id: 'transport', name: 'Транспорт', icon: 'car',
    subs: ['Легковые автомобили', 'Мототехника', 'Спецтехника', 'Водный транспорт', 'Запчасти и аксессуары'],
    attrs: [
      { key: 'brand', label: 'Марка', type: 'select', options: ['Chevrolet','Lada (ВАЗ)','Toyota','Hyundai','Kia','Daewoo','BMW','Mercedes-Benz'] },
      { key: 'year', label: 'Год выпуска', type: 'number' },
      { key: 'mileage', label: 'Пробег, км', type: 'number' },
      { key: 'transmission', label: 'Коробка передач', type: 'select', options: ['Механика','Автомат','Вариатор'] },
    ],
  },
  {
    id: 'realty', name: 'Недвижимость', icon: 'home',
    subs: ['Продажа квартир', 'Аренда квартир', 'Дома и коттеджи', 'Коммерческая недвижимость', 'Земельные участки'],
    attrs: [
      { key: 'rooms', label: 'Количество комнат', type: 'select', options: ['1','2','3','4','5+'] },
      { key: 'area', label: 'Площадь, м²', type: 'number' },
      { key: 'floor', label: 'Этаж', type: 'number' },
    ],
  },
  {
    id: 'electronics', name: 'Электроника', icon: 'phoneCase',
    subs: ['Мобильные телефоны', 'Ноутбуки и компьютеры', 'Бытовая техника', 'ТВ, аудио и видео', 'Фото и видеотехника'],
    attrs: [
      { key: 'brand', label: 'Бренд', type: 'select', options: ['Apple','Samsung','Xiaomi','Huawei','Artel','LG'] },
      { key: 'condition', label: 'Состояние', type: 'select', options: ['Новое','Б/у'] },
    ],
  },
  {
    id: 'jobs', name: 'Работа', icon: 'briefcase',
    subs: ['Вакансии', 'Резюме', 'Услуги для бизнеса'],
    attrs: [
      { key: 'employment', label: 'Тип занятости', type: 'select', options: ['Полная занятость','Частичная занятость','Удалённо'] },
      { key: 'salary', label: 'Зарплата, сум', type: 'number' },
    ],
  },
  {
    id: 'services', name: 'Услуги', icon: 'wrench',
    subs: ['Ремонт и строительство', 'Красота и здоровье', 'Обучение и курсы', 'Организация мероприятий', 'Грузоперевозки'],
    attrs: [],
  },
  {
    id: 'personal', name: 'Личные вещи', icon: 'shirt',
    subs: ['Одежда', 'Обувь', 'Часы и аксессуары', 'Товары для детей'],
    attrs: [
      { key: 'size', label: 'Размер', type: 'text' },
      { key: 'condition', label: 'Состояние', type: 'select', options: ['Новое','Б/у'] },
    ],
  },
  {
    id: 'home-garden', name: 'Дом и сад', icon: 'sofa',
    subs: ['Мебель', 'Бытовая техника для дома', 'Растения', 'Инструменты'],
    attrs: [
      { key: 'condition', label: 'Состояние', type: 'select', options: ['Новое','Б/у'] },
    ],
  },
  {
    id: 'hobby', name: 'Хобби и спорт', icon: 'ball',
    subs: ['Спорттовары', 'Музыкальные инструменты', 'Книги', 'Животные'],
    attrs: [],
  },
];

function findCategory(id){ return CATEGORIES.find(c => c.id === id); }
