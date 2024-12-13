# HydroPro - Система управления гидропонными установками

Полнофункциональная система для мониторинга и управления гидропонными установками с веб-интерфейсом.

## Структура проекта

```
hydropro/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── api/      # API клиенты и WebSocket
│   │   ├── components/
│   │   ├── contexts/ # React контексты
│   │   ├── hooks/    # Кастомные хуки
│   │   ├── pages/    # Компоненты страниц
│   │   ├── types/    # TypeScript типы
│   │   └── utils/    # Утилиты
│   └── public/
└── server/           # Express + Node.js backend
    ├── config/       # Конфигурация
    ├── controllers/  # Контроллеры
    ├── middleware/   # Middleware
    ├── models/       # Mongoose модели
    ├── routes/       # Маршруты API
    ├── services/     # Бизнес-логика
    └── utils/        # Утилиты
```

## Технологии

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Socket.io-client
- Chart.js
- React Router
- Lucide Icons

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Auth
- Socket.io
- Express Validator

## Запуск проекта

### Требования
- Node.js 18+
- MongoDB
- Git

### Frontend

```bash
# Установка зависимостей
cd frontend
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

### Backend

```bash
# Установка зависимостей
cd server
npm install

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл

# Запуск сервера разработки
npm run dev

# Запуск в продакшене
npm start
```

## Основные функции

### Аутентификация
- Регистрация по email
- Подтверждение через SMS
- JWT авторизация
- Восстановление пароля

### Управление системами
- Мониторинг показателей в реальном времени
- Графики и статистика
- Управление растениями
- Настройка параметров
- Уведомления о событиях

### Мониторинг
- Температура
- Влажность
- Уровень pH
- Уровень питательных веществ
- История изменений

### Растения
- Каталог растений
- Отслеживание роста
- Расписание ухода
- Прогнозы урожая

## API Endpoints

### Аутентификация
- POST /api/auth/register - Регистрация
- POST /api/auth/login - Вход
- POST /api/auth/verify-sms - Подтверждение SMS

### Системы
- GET /api/systems - Список систем
- POST /api/systems/rent - Аренда системы
- GET /api/systems/:id/metrics - Метрики системы
- PUT /api/systems/:id/metrics - Обновление метрик

### Растения
- POST /api/systems/:id/plants - Добавление растения
- PUT /api/plants/:id/status - Обновление статуса
- POST /api/plants/:id/growth - Данные роста
- POST /api/plants/:id/maintenance - Запись обслуживания

## WebSocket Events

### Client -> Server
- join_system - Подключение к системе
- update_metrics - Обновление метрик
- system_alert - Системное уведомление

### Server -> Client
- metrics_update - Обновление метрик
- system_alert - Уведомление о событии
- maintenance_required - Требуется обслуживание

## Разработка

### Структура компонентов

```
components/
├── auth/           # Компоненты аутентификации
├── dashboard/      # Компоненты дашборда
├── monitoring/     # Мониторинг и графики
├── plants/         # Управление растениями
└── ui/             # Базовые UI компоненты
```

### Стили
- Использование TailwindCSS
- Компонентный подход
- Адаптивный дизайн
- Темная тема

### Типизация
- Строгая типизация TypeScript
- Интерфейсы для всех сущностей
- Типы для API ответов

## Деплой

### Frontend
1. Сборка проекта: `npm run build`
2. Статические файлы из `dist/`

### Backend
1. Настройка переменных окружения
2. Установка зависимостей: `npm install --production`
3. Запуск: `npm start`

## Лицензия

MIT
