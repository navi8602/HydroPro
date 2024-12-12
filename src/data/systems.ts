import { HydroponicSystem, RentalPeriod } from '../types/system';

export const RENTAL_PERIODS: RentalPeriod[] = [
  { months: 3, discount: 0 },
  { months: 6, discount: 0.1 }, // 10% скидка
  { months: 12, discount: 0.2 }, // 20% скидка
];

export const HYDROPONIC_SYSTEMS: HydroponicSystem[] = [
  {
    id: 'hydropro-2000',
    name: 'HydroPro 2000',
    model: 'HP-2000',
    description: 'Компактная система для начинающих. Идеально подходит для выращивания зелени и небольших овощей.',
    capacity: 8,
    dimensions: {
      width: 60,
      height: 150,
      depth: 30
    },
    features: [
      'Автоматический полив',
      'LED освещение',
      'Базовый контроль pH',
      'Таймер освещения'
    ],
    monthlyPrice: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1558449907-39bb080974df',
    specifications: {
      powerConsumption: 100,
      waterCapacity: 20,
      lightingType: 'LED полного спектра',
      automationLevel: 'basic'
    }
  },
  {
    id: 'hydropro-3000',
    name: 'HydroPro 3000',
    model: 'HP-3000',
    description: 'Продвинутая система для опытных пользователей. Расширенные возможности контроля и автоматизации.',
    capacity: 12,
    dimensions: {
      width: 80,
      height: 180,
      depth: 40
    },
    features: [
      'Умный полив с датчиками',
      'Регулируемое LED освещение',
      'Автоматический контроль pH и EC',
      'Мобильное приложение',
      'Климат-контроль'
    ],
    monthlyPrice: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1558449907-39bb080974df',
    specifications: {
      powerConsumption: 180,
      waterCapacity: 40,
      lightingType: 'Регулируемый LED',
      automationLevel: 'advanced'
    }
  },
  {
    id: 'hydropro-4000',
    name: 'HydroPro 4000',
    model: 'HP-4000',
    description: 'Профессиональная система с максимальной автоматизацией и контролем. Для серьезного домашнего выращивания.',
    capacity: 16,
    dimensions: {
      width: 100,
      height: 200,
      depth: 50
    },
    features: [
      'Полная автоматизация',
      'Профессиональное LED освещение',
      'Автоматическая корректировка питательного раствора',
      'Удаленный мониторинг',
      'Интеграция с умным домом',
      'Анализ урожайности'
    ],
    monthlyPrice: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1558449907-39bb080974df',
    specifications: {
      powerConsumption: 250,
      waterCapacity: 60,
      lightingType: 'Профессиональный LED',
      automationLevel: 'professional'
    }
  }
];