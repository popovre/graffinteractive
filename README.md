# Приложение для общения и просмотра изображений

## Запуск Client

Для запуска приложения выполните следующие шаги:

1. Откройте терминал в директории `~graffinteractive/client`.
2. Выполните следующие команды:

   - `pnpm i`
   - `pnpm dev`

## Запуск Server

Для запуска приложения выполните следующие шаги:

1. Откройте терминал в директории `~graffinteractive/server`.
2. Выполните следующие команды:
   - `pnpm i`
   - `pnpm start`

## Стэк технологий

1. Client

- React (Veet)
- TypeScript
- Rest API, WebSocket

2. Server

- node Express
- TypeScript

## Обмен сообщениями

Обмен между Менеджером и Клиентами осуществляется посредством **express-ws** - websocket. Менеджеры могут:

- Наблюдать за всеми клиентами в сети.
- Писать в чат, если клиент офлайн.
- При подключении клиент получит все отправленные сообщения.