/* Regions of Uzbekistan. In the Django version this will come from
   GET /api/regions/ — keep the same shape: {id, name, citiesCount}. */
const REGIONS = [
  { id: 'tashkent-city', name: 'Ташкент город' },
  { id: 'tashkent-region', name: 'Ташкентская область' },
  { id: 'andijan', name: 'Андижанская область' },
  { id: 'bukhara', name: 'Бухарская область' },
  { id: 'jizzakh', name: 'Джизакская область' },
  { id: 'kashkadarya', name: 'Кашкадарьинская область' },
  { id: 'navoiy', name: 'Навоийская область' },
  { id: 'namangan', name: 'Наманганская область' },
  { id: 'samarkand', name: 'Самаркандская область' },
  { id: 'surkhandarya', name: 'Сурхандарьинская область' },
  { id: 'syrdarya', name: 'Сырдарьинская область' },
  { id: 'fergana', name: 'Ферганская область' },
  { id: 'khorezm', name: 'Хорезмская область' },
  { id: 'karakalpakstan', name: 'Республика Каракалпакстан' },
];

function regionName(id){
  const r = REGIONS.find(r => r.id === id);
  return r ? r.name : id;
}
