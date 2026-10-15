export const carouselDocs = `
### Назначение и применение
Carousel переключает связанные элементы внутри страницы: баннеры, галереи, отзывы, онбординг. Контент не входит в панель навигации. Для разделов страницы используйте Tabs, для страниц списка — Pagination. При количестве элементов меньше двух панель скрывается.

### Состав и анатомия
Previous и Next — существующие ButtonIcon 32 с иконками arrow-chevron-left/right 16. Между ними находится прокручиваемая группа кнопок Dot. Для горизонтальной области контента доступен отдельный CarouselViewport; можно подключить собственный контент через index и onIndexChange.

### API
| Параметр | Значение | Назначение |
| --- | --- | --- |
| count | number | Количество элементов |
| index | number | Управляемый индекс с 0 |
| defaultIndex | number = 0 | Начальная позиция в неуправляемом режиме |
| onIndexChange | (index: number) => void | Фактическая смена позиции |
| controlsId | string | ID связанной области контента |
| color | auto / secondary / inverse-light | auto учитывает тему |
| disabled | boolean = false | Отключает все кнопки |
| isLoading | boolean = false | Скелетон при первичной загрузке |

CarouselViewport принимает index, onIndexChange, disabled, id и children. Его index должен совпадать с индексом панели. CarouselDot поддерживает selected и state для демонстрации состояний.

### Варианты и состояния
Secondary в светлой теме; Inverse light в темной. Dot: Default, Hover, Focused, Pressed, Disabled, с выбором и без. Первый элемент отключает Previous, последний — Next. Циклического переключения и автопрокрутки нет.

Skeleton: цельная плашка 168 × 32, radius-full, background-base-skeleton, без кнопок и точек. Используется при первичной загрузке, в том числе пока количество элементов неизвестно; в узком контейнере сжимается до доступной ширины. Собран через общий компонент Skeleton.

### Геометрия и токены
Контейнер: без боковых отступов, кнопки стрелок стоят у краев, radius-full, background-base-secondary / background-base-inverse-light. Группа: padding space-8, gap space-8. Dot: elements-8 × elements-8, выбранный — elements-16 × elements-8. Прозрачная зона нажатия расширена по вертикали до 32 px.

Secondary: icon-base-inverse-secondary для обычной точки; icon-base-secondary для выбранной и Focused, суффиксы -hover/-pressed/-disabled для состояний. Focus: border-small и border-base-secondary-focused, без изменения размеров.

Inverse light: icon-base-inverse-secondary для обычной точки; icon-base-inverse для выбранной и Focused; icon-base-inverse-hover/-pressed/-disabled для состояний. Focus: border-base-inverse-focused.

В репозитории ранее не было transition-токенов. Добавлены transition-duration-normal (200ms) и transition-easing-standard (cubic-bezier(0.2, 0, 0, 1)). Ширина и цвет точек используют их одновременно; соседние точки плавно перемещаются в flex-потоке. При reduced motion переходы отключаются.

### Поведение
Нажатие выбранной точки ничего не меняет. Выбранная точка сохраняет DOM-узел при переключении. При более чем восьми точках прокручивается только группа индикаторов; стрелки остаются на месте, выбранная и сфокусированная точки видимы. Scrollbar скрыт.

В CarouselViewport контент следует за указателем. Порог переключения — 20% ширины, максимум 80 px, или скорость более 0.5 px/ms. Короткий drag возвращается назад; отмена жеста не переключает элемент. На границах применяется сопротивление. Вертикальное движение сохраняет прокрутку страницы. Повторный drag начинается с текущего положения перехода. Анимацию собственного контента задает потребитель.

### Адаптив
Горизонтальная компоновка сохраняется. При недостатке места сужается область индикаторов. Размеры и шрифты не уменьшаются. Swipe работает на области контента.

### Доступность
Кнопки связаны с контентом через aria-controls. Tab входит в группу на выбранной точке. Стрелки влево/вправо, Home/End перемещают только фокус; Enter/Space подтверждают выбор. aria-current отмечает текущую точку. Неактивные слайды CarouselViewport имеют inert и aria-hidden; смена позиции объявляется через aria-live.

### Чеклист
Проверьте переключение кнопками, точками, клавиатурой и свайпом; первый/последний элемент; короткий и отмененный drag; быстрые повторные действия; более восьми точек; узкую область; обе темы и reduced motion.

Источники: [Figma](https://www.figma.com/design/qfWNJqugbOC6RmiKKEv9Bb/F.Doc-Design-System?node-id=9881-8287), [описание](https://app.notion.com/p/2fe7ab6fc5d3809eaad0c758fb4e85e1), [референс Motion](https://examples.motion.dev/react/carousel-pagination-arrows). Боковые отступы панели убраны по уточнению. Отступы группы индикаторов и цвет выбранной точки Inverse light взяты из описания от 15.10.2026.
`;
