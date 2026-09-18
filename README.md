# F.Doc Design System Playbook

Моя тестовая дизайн-система и личный плейбук для проверки токенов, компонентов и подходов к реализации F.Doc в React и Storybook.

Это не официальная библиотека F.Doc и не production-пакет. Компоненты и токены здесь служат для экспериментов, сверки с Figma и подготовки решений для дальнейшей разработки.

## Команды

```bash
npm install
npm run dev
npm run storybook
npm test
npm run build
npm run build-storybook
npm run test:visual
```

## Input

Первый компонент собран по Figma node `491:16871`.

Поддерживаются размеры `medium`/`small`, состояния по взаимодействию, error, disabled, skeleton, label, description, caption, counter, слоты и очистка значения.

## ButtonIcon

Базовая кнопка с иконкой из локальной библиотеки проекта. Поддерживает размеры `xxsmall`–`giant`, отдельный `iconSize`, цветовые варианты, состояния и skeleton. Компонент подготовлен как основа для производных компонентов Input.
