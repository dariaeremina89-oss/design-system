import { useEffect, useState } from 'react';
import { Button } from '../components/Button/Button';
import { ButtonIcon } from '../components/ButtonIcon/ButtonIcon';
import { ButtonToggle } from '../components/ButtonToggle/ButtonToggle';
import { Input } from '../components/Input/Input';
import { Badge } from '../components/Badge/Badge';
import { Chips } from '../components/Chips/Chips';
import { ChipsGroup } from '../components/Chips/ChipsGroup';
import { Checkbox, Radio, Switch } from '../components/SelectionControl/SelectionControl';
import { ProgressIndicator } from '../components/ProgressIndicator/ProgressIndicator';
import { Typography } from '../components/Typography/Typography';
import { Highlight } from '../components/Highlight/Highlight';
import { Select } from '../components/Select/Select';
import { ButtonLink } from '../components/Link/Link';
import { HoverActionExample } from '../components/Menu/dropdown-examples';
import { contrastRatio, DEFAULT_PRIMARY, normalizeHex, primarySteps, primaryThemeCss } from '../styles/primary-theme';
import { createColorTheme } from '../styles/color-theme';
import { applyColorMode, applyPrimaryTheme, getPrimaryTheme } from '../styles/primary-theme-store';
import { useColorMode, usePrimarySeed } from '../styles/use-primary-theme';
import { primitiveColorTokens, semanticColorTokens } from '../styles/token-catalog';
import './custom-branding.css';

const original:Record<string,string>=Object.fromEntries([...primitiveColorTokens,...semanticColorTokens].map(item=>[item.token,item.value]));
const originalReferences:Record<string,string>=Object.fromEntries(semanticColorTokens.map(item=>[item.token,item.reference]));
const buttonStates=['default','hover','pressed','focused','disabled'] as const;
export function CustomBranding() {
  const seed=usePrimarySeed(),mode=useColorMode();
  const [draft,setDraft]=useState(seed??DEFAULT_PRIMARY);
  const [exported,setExported]=useState(false);
  useEffect(()=>{if(normalizeHex(draft)!==seed)setDraft(seed??DEFAULT_PRIMARY);setExported(false);},[seed]);
  const theme=getPrimaryTheme();
  const value=(token:string)=>theme?.variables[token]??original[token];
  const valid=normalizeHex(draft);
  const invalid=!valid;
  const light=seed?createColorTheme(seed,'light'):{mode:'light' as const,variables:original,references:originalReferences};
  const dark=createColorTheme(seed??DEFAULT_PRIMARY,'dark');
  const mappings=['--background-base-default','--text-base-default','--background-primary-default','--text-primary-default','--background-primary-secondary','--text-primary-secondary','--background-primary-inverse','--text-primary-inverse','--border-primary-focused','--background-success-secondary','--text-success-default-light'];
  const ratios=buttonStates.filter(state=>state!=='disabled').map(state=>{
    const background=`--background-primary-default${state==='hover'||state==='pressed'?'-'+state:''}`;
    return {state,text:contrastRatio(value('--text-primary-default'),value(background)),icon:contrastRatio(value('--icon-primary-default-light'),value(background))};
  });
  function update(next:string) {setDraft(next);const normalized=normalizeHex(next);if(normalized)applyPrimaryTheme(normalized);}
  const title=(text:string)=><Typography as="h2" variant="h3-heading" responsive>{text}</Typography>;
  return <div className="fdoc-branding sb-unstyled">
    <Typography as="h1" variant="h1-heading" responsive>Custom Branding</Typography>
    <Typography responsive>Клиентский HEX меняет только Primary. Переключение Light / Dark меняет семантику всей системы: Base, Primary, статусы, фоны, тексты, иконки и обводки. Обе темы доступны и для исходного желтого F.Doc, и для клиентского цвета.</Typography>
    <section className="fdoc-branding__panel" aria-label="Настройки темы">
      <div className="fdoc-branding__controls">
        <Input label="Primary 500 · HEX" aria-label="Primary 500 HEX" value={draft} onChange={event=>update(event.target.value)} error={invalid?'Введите HEX из 3 или 6 символов, например #2F26FF':undefined} spellCheck={false} autoComplete="off"/>
        <ButtonToggle aria-label="Цветовая тема" value={mode} onValueChange={next=>applyColorMode(next as 'light'|'dark')} options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]}/>
        <Button color="secondary" onClick={()=>{applyPrimaryTheme(null,true,mode);setDraft(DEFAULT_PRIMARY);}}>Сбросить к F.Doc</Button>
      </div>
      <div className="fdoc-branding__row" aria-label="Примеры цветов">
        {[['Синий','#2f26ff'],['Зеленый','#008567'],['Бордовый','#8b1245'],['Светлый Primary','#f4e5fa'],['Темный Primary','#171329']].map(([name,color])=><button key={color} type="button" className="fdoc-branding__preset" aria-label={`${name} ${color}`} onClick={()=>update(color)}><span aria-hidden="true" style={{background:color}}/>{name}</button>)}
      </div>
      <Typography variant="caption" responsive role="status">{seed?`Primary 500: ${seed.toUpperCase()}`:'Исходная палитра F.Doc'} · {mode==='dark'?'Dark':'Light'}. Primary 500 и его примитивная растяжка не меняются между темами; меняются семантические роли вокруг них. Тема применяется ко всем стори и сохраняется в этом браузере.</Typography>
    </section>

    <Typography responsive data-testid="brand-highlight"><Highlight highlight="договор">Найденный договор подсвечен цветом Accent.</Highlight></Typography>

    <section>{title('Палитра Primary')}
      <div className="fdoc-branding__palette" role="group" data-color-mode={mode} aria-label={`Палитра Primary · ${mode === 'dark' ? 'Dark' : 'Light'}`}>{primarySteps.map(step=>{const color=value(`--primary-${step}`);const foreground=contrastRatio(color,'#000000')>=contrastRatio(color,'#ffffff')?'#000000':'#ffffff';return <div key={step} className="fdoc-branding__swatch" style={{background:color,color:foreground}} data-primary-step={step}><Typography as="span" variant="body" strong>{step}</Typography><Typography as="span" variant="caption">{color.toUpperCase()}</Typography></div>;})}</div>
      <Typography variant="caption" responsive>500 сохраняет введенный HEX точно. 25–400 — смесь с белым, 600–900 — с черным. Растяжка общая для Light и Dark и при переключении темы не меняется. Меняются ссылки семантических токенов на ее ступени. Клиентский Primary не пересчитывает Neutral, Green, Red, Orange и Purple.</Typography>
    </section>

    <section>{title('Состояния компонентов')}
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Состояния Primary">
        <thead><tr><th scope="col">Компонент</th>{buttonStates.map(state=><th key={state} scope="col">{state[0].toUpperCase()+state.slice(1)}</th>)}</tr></thead>
        <tbody><tr><th scope="row">Button</th>{buttonStates.map(state=><td key={state}><Button state={state} iconLeft="plus" data-testid={`brand-button-${state}`}>Создать</Button></td>)}</tr>
          <tr><th scope="row">ButtonIcon</th>{buttonStates.map(state=><td key={state}><ButtonIcon state={state} icon="plus" aria-label={`Создать: ${state}`}/></td>)}</tr>
          <tr><th scope="row">Chips</th>{buttonStates.map(state=><td key={state}><Chips text="Выбрано" color="primary" interactive state={state}/></td>)}</tr>
        </tbody></table></div>
      <Typography variant="caption" responsive>Направление контраста определяется по заливке: сравниваем ее контраст с белым и черным, выбираем сторону с большим значением. Hover и Pressed выбираются так, чтобы один цвет текста оставался читаемым во всех активных состояниях.</Typography>
      <div className="fdoc-branding__row">{ratios.map(({state,text,icon})=><Typography key={state} as="span" variant="caption" data-testid={`contrast-${state}`}>{state}: текст {text.toFixed(2)}:1 · иконка {icon.toFixed(2)}:1</Typography>)}</div>
      {!seed&&mode==='light'&&<Typography variant="caption" responsive>Сейчас показаны исходные токены F.Doc. Расчет с проверкой контраста включается при вводе HEX или выборе пресета.</Typography>}
    </section>

    <section>{title('Когда нужно светлое содержимое')}
      <Typography responsive>Название темы не определяет цвет текста на брендовой кнопке. Сначала сравниваем контраст Primary 500 с белым и черным. Если белый дает больший контраст, выбираем светлую сторону растяжки, иначе темную. Затем подбираем на выбранной стороне ближайшую допустимую ступень: от 25 для светлого содержимого и от 900 для темного, с порогом 4.5:1. При необходимости доступны крайние точки 0 (белый) и 1000 (черный).</Typography>
      <Typography responsive>Например, у зеленого бренда #008567 черный дает {contrastRatio('#008567','#000000').toFixed(2)}:1, белый — {contrastRatio('#008567','#ffffff').toFixed(2)}:1. Поэтому выбирается белый. Разница небольшая: при неизменной заливке 500 никакой цвет текста не даст здесь 7:1. Порог 4.5:1 — минимальная проверка, а не обещание высокого визуального контраста. Для большего запаса понадобится изменить сам брендовый HEX или разрешить отдельную более темную заливку кнопки.</Typography>
      <Typography responsive>Hover / Pressed усиливают выбранное направление: 600 / 700 со светлым содержимым, 400 / 300 с темным. Цвет текста остается одним во всех активных состояниях. Inverse — отдельная семантическая роль противоположной поверхности; переключение Light / Dark и выбор светлого текста на Primary 500 — разные решения.</Typography>
    </section>

    <section>{title('Что рассчитывается автоматически')}
      <Typography responsive>Фронт передает два значения: цвет клиента в HEX и тему Light или Dark. Генератор сам строит растяжку и назначает цвета семантическим токенам. Вручную подбирать оттенки для каждого клиента не нужно.</Typography>
      <Typography responsive>Растяжка — набор доступных оттенков. Семантический токен — назначение цвета в интерфейсе. Например, background-primary-secondary означает мягкую брендовую подложку, а text-primary-secondary — цветное содержимое на обычных и брендовых подложках. Компонент использует эти имена, а тема определяет, какие оттенки за ними стоят.</Typography>
      <ol>
        <li>HEX становится Primary 500. Из него строятся общие для Light и Dark ступени 25–900. При смене темы эти оттенки остаются прежними.</li>
        <li>Для каждой темы назначаются поверхности. Например, background-primary-secondary берет 25 в Light и 900 в Dark: светлая подложка сменяется темной.</li>
        <li>Для ролей с автоматическим подбором задается начальная ступень и список фонов, на которых цвет должен читаться. Для text-primary-secondary начальная ступень — 500, порог контраста — 4.5:1.</li>
        <li>Генератор проверяет кандидатов из общей растяжки и выбирает ближайшую к начальной ступень, которая проходит порог на всех заданных фонах. Если 500 не подходит, проверяются другие ступени; итогом может стать, например, 900 в Light и 500 в Dark.</li>
        <li>Результат записывается в CSS-переменные приложения. Компоненты получают новые цвета через прежние семантические имена.</li>
      </ol>
      <Typography responsive>Начальные ступени, фоны и пороги — правила дизайн-системы, заданные в коде один раз. Итоговые ссылки и HEX — автоматический результат для введенного цвета и выбранной темы. Поэтому «подбор от 500» не означает «всегда использовать 500».</Typography>
    </section>

    <section>{title('Правила семантики Light / Dark')}
      <Typography responsive>Сначала выбирается схема поверхностей темы: светлая или темная. Затем назначаются фоны Primary, после них — читаемое содержимое и обводки. Это правила цветовых ролей, общие для Button, Chips, полей и других компонентов. Компоненты продолжают использовать прежние семантические имена.</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Правила переключения семантики">
        <thead><tr><th scope="col">Роль / токены</th><th scope="col">Light</th><th scope="col">Dark</th><th scope="col">Правило</th></tr></thead>
        <tbody>
          <tr><th scope="row">background-primary-default</th><td>500</td><td>Автоподбор ступени</td><td>Primary 500 остается исходным HEX в палитре. В Dark семантическая заливка выбирает подходящую ступень той же растяжки, чтобы не быть слишком яркой или слишком темной на темной поверхности.</td></tr>
          <tr><th scope="row">background-primary-secondary</th><td>25 / 50 / 100</td><td>900 / 800 / 700*</td><td>Подложка под цветное содержимое: светлая в Light, темная в Dark.</td></tr>
          <tr><th scope="row">background-primary-tertiary</th><td>200 / 100 / 50</td><td>800 / 900 / 800</td><td>Дополнительная подложка использует ту же пару text/icon-primary-secondary.</td></tr>
          <tr><th scope="row">text/icon-primary-secondary</th><td>Подбор от 500 на светлых поверхностях</td><td>Подбор от 500 на темных поверхностях</td><td>Одна ступень на Default / Hover / Pressed. Текст: минимум 4.5:1, иконки: 3:1.</td></tr>
          <tr><th scope="row">text/icon-primary-default</th><td>Подбор содержимого на Primary 500</td><td>Подбор содержимого на выбранной Dark-заливке</td><td>Для Default / Hover / Pressed используется одно направление содержимого. Текст проходит минимум 4.5:1, иконки — 3:1 на всех трех активных состояниях.</td></tr>
          <tr><th scope="row">background-primary-default-hover / pressed</th><td>400 / 300 при темном содержимом; 600 / 700 при светлом</td><td>Соседние ступени от выбранного Dark Default</td><td>В Dark направление выбирается вместе с Default так, чтобы один цвет содержимого оставался читаемым во всех активных состояниях.</td></tr>
          <tr><th scope="row">background-primary-inverse</th><td>900 / 800 / 700*</td><td>50 / 100 / 200*</td><td>Инверсная заливка: темная в Light, светлая в Dark.</td></tr>
          <tr><th scope="row">text/icon-primary-inverse</th><td>Подбор от 25</td><td>Подбор от 900</td><td>Контраст проверяется со всеми активными фонами Primary Inverse.</td></tr>
          <tr><th scope="row">text/icon-primary-inverse-light</th><td>Подбор от 500 на темных Base Inverse</td><td>Подбор от 500 на светлых Base Inverse</td><td>Содержимое на инверсной базовой поверхности; это отдельная роль от содержимого на Primary Inverse.</td></tr>
          <tr><th scope="row">border-primary-focused</th><td>Подбор от 500</td><td>Подбор от 500</td><td>Цвет icon-primary-secondary текущей темы, прозрачность 16%. Проверка 3:1 относится к исходному цвету иконки; итоговый ореол не заявляется как контраст 3:1.</td></tr>
          <tr><th scope="row">transparent-background-primary</th><td colSpan={2}>Цвет icon-primary-secondary текущей темы с прозрачностью 8% / 16% / 24%</td><td>Hover / Focused / Pressed. Это прозрачный слой поверх поверхности, а не новая растяжка.</td></tr>
        </tbody>
      </table></div>
      <Typography variant="caption" responsive>Тройки ступеней в таблице означают Default / Hover / Pressed. * — номинальная ступень Pressed: при недостаточном контрасте выбирается ближайшая допустимая. В остальных строках «подбор от» тоже обозначает начальную ступень, а не гарантированный итоговый номер.</Typography>
      <Typography responsive>Для secondary проверяются Base Default / Secondary / Tertiary и брендовые подложки. В Light это White 1000 / Neutral 25 / Neutral 100 и Primary 100 / 200; в Dark — Neutral 900 / 800 / 700 и Primary 900 / 800. Значения Base берутся из принятой схемы темы, цвета Primary — из общей растяжки.</Typography>
      <Typography responsive>Фокусные ореолы сохраняют прозрачность 16%. В Dark Base использует White 16%, Base Inverse — Neutral 16%, статусы — прозрачный цвет собственной палитры. Переключение темы не превращает полупрозрачный слой в сплошную обводку. Контраст такого слоя зависит от поверхности под ним и требует отдельной проверки видимости фокуса.</Typography>
      <Typography responsive>Disabled рассчитывается отдельно: стартовая ступень содержимого — 600, внутренний порог — 3:1. Это правило библиотеки, а не обязательный порог WCAG для недоступных элементов. Фоны Primary Default Disabled остаются 100, Inverse Disabled — 500; Secondary / Tertiary Disabled в Light используют 25 / 50, в Dark — 900 / 900.</Typography>
      <Typography responsive>Клиентский HEX меняет только Primary. Dark также переключает базовые и статусные роли: например, background-base-default с White 1000 на Neutral 900, text-base-default с Neutral 900 на White 1000; подложки статусов переходят к темным ступеням собственных палитр. Success остается Green, Error — Red, Warning — Orange, Accent — Purple.</Typography>
      <Typography variant="caption" responsive>Без клиентского переопределения исходная Light-тема F.Doc использует опубликованные токены без перерасчета семантики. Расчет с проверкой контраста применяется после ввода HEX, выбора пресета и в Dark. В таблице «Итоговая семантика Light / Dark» исходная колонка Light поэтому может отличаться от результата генератора для #FFDC00 — и это ожидаемо.</Typography>
    </section>


    <section>{title('Итоговая семантика Light / Dark')}
      <Typography responsive>Имя токена и его назначение сохраняются, а тема определяет его фактический референс и HEX. Для исходного F.Doc колонка Light показывает опубликованные токены без перерасчета; Dark строится поверх той же Primary-растяжки по правилам темной темы. После ввода клиентского HEX обе колонки рассчитываются генератором. Сам Primary 500 остается исходным HEX, но background-primary-default в Dark может ссылаться на другую ступень.</Typography>
      <Typography responsive>Как читать таблицу: слева — постоянное имя, которое использует компонент. В колонке темы первая строка — ссылка на выбранный токен, вторая — его фактический HEX. Запись background-primary-secondary → primary-900 означает: «для этой подложки взять цвет ступени 900». Это смена ссылки, а не изменение самой ступени 900.</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Семантика Light и Dark">
        <thead><tr><th scope="col">Семантический токен</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
        <tbody>{mappings.map(token=><tr key={token}><th scope="row">{token}</th>{[light,dark].map(item=>{const color=item.variables[token]??original[token];return <td key={item.mode}><span className="fdoc-branding__color-dot" style={{background:color}} aria-hidden="true"/>{item.references[token]??semanticColorTokens.find(entry=>entry.token===token)?.reference}<br/>{color.toUpperCase()}</td>;})}</tr>)}</tbody>
      </table></div>
    </section>

    <section>{title('Base и статусы: меняется тема, а не бренд')}
      <Typography responsive>Примитивные палитры Neutral, Green, Red, Orange и Purple не пересчитываются из клиентского HEX. При смене бренда их значения сохраняются. При смене Light / Dark меняются уже семантические роли Base и статусов: обычные подложки становятся темными, содержимое на них светлеет, инверсные поверхности становятся светлыми. Success остается Green, Error — Red, Warning — Orange, Accent — Purple.</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Семантика Base и статусов">
        <thead><tr><th scope="col">Роль</th><th scope="col">Light: подложка / содержимое</th><th scope="col">Dark: подложка / содержимое</th></tr></thead>
        <tbody>{[
          ['Base','--background-base-default','--text-base-default'],
          ['Base Secondary','--background-base-secondary','--text-base-secondary'],
          ['Base Inverse','--background-base-inverse','--text-base-inverse'],
          ['Base Inverse light','--background-base-inverse-light','--text-base-inverse'],
          ...['success','error','warning','accent'].flatMap(role=>[
            [role+' Default text on Base','--background-base-default',`--text-${role}-default`],
            [role+' Secondary',`--background-${role}-secondary`,`--text-${role}-secondary`],
            [role+' Inverse',`--background-${role}-inverse`,`--text-${role}-inverse`],
          ]),
        ].map(([label,bg,fg])=><tr key={label}><th scope="row">{label}</th>{[light,dark].map(item=><td key={item.mode}>{[bg,fg].map(token=><div key={token}>{token}: {item.references[token]??semanticColorTokens.find(entry=>entry.token===token)?.reference} · {(item.variables[token]??original[token]).toUpperCase()}</div>)}</td>)}</tr>)}</tbody>
      </table></div>
      <Typography variant="caption" responsive>Таблица показывает Default каждой роли. Насыщенные статусные заливки Default сохраняют свои опорные цвета. У Primary опорным остается только примитив 500; семантический background-primary-default в Dark может перейти на другую ступень. Текст, иконки, Secondary / Tertiary / Inverse, состояния и Base также получают Dark-ссылки. Полупрозрачные фокусные ореолы сохраняют 16%.</Typography>
    </section>

    <section>{title('Пример: подложка и текст для текущего HEX')}
      <Typography responsive>Ниже показан результат генератора для введенного цвета. В обеих темах компонент использует одну пару имен: background-primary-secondary и text-primary-secondary. Меняются выбранные ступени. При выборе другого HEX эта таблица пересчитывается автоматически.</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Пример чтения семантической пары">
        <thead><tr><th scope="col">Тема</th><th scope="col">Подложка</th><th scope="col">Текст</th><th scope="col">Контраст этой пары</th></tr></thead>
        <tbody>{[light,dark].map(item=><tr key={item.mode}><th scope="row">{item.mode==='light'?'Light':'Dark'}</th><td>{item.references['--background-primary-secondary']}<br/>{item.variables['--background-primary-secondary'].toUpperCase()}</td><td>{item.references['--text-primary-secondary']}<br/>{item.variables['--text-primary-secondary'].toUpperCase()}</td><td>{contrastRatio(item.variables['--text-primary-secondary'],item.variables['--background-primary-secondary']).toFixed(2)}:1 · минимум 4.5:1</td></tr>)}</tbody>
      </table></div>
      <Typography variant="caption" responsive>Здесь показана одна пара в Default. Алгоритм дополнительно учитывает другие предусмотренные поверхности и активные состояния. Значение на экране округляется до двух знаков; решение о прохождении порога принимается без этого округления.</Typography>
    </section>

    <section>{title('Живые примеры')}
      <div className="fdoc-branding__examples">
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Действия и выбор</Typography>
          <div className="fdoc-branding__row"><Button data-testid="brand-primary-action">Продолжить</Button><Button color="secondary" data-testid="brand-secondary-action">Отмена</Button><Button color="inverse-primary" data-testid="brand-inverse-primary">Inverse Primary</Button><ButtonIcon color="inverse-light" icon="plus" aria-label="Inverse light" data-testid="brand-inverse-light-action"/><Badge text="12"/></div>
          <ChipsGroup aria-label="Документы" defaultValue={['all']} options={[{value:'all',text:'Все'},{value:'draft',text:'Черновики'},{value:'sent',text:'Отправленные'}]}/>
          <div className="fdoc-branding__row"><Checkbox label="Выбрано" defaultChecked/><Radio label="Вариант" name="brand-radio" defaultChecked/><Switch label="Уведомления" defaultChecked/></div>
          <ProgressIndicator mode="determinate" value={64} aria-label="Загрузка документов"/>
          <ButtonLink color="primary" iconRight="arrow-chevron-right">Открыть документы</ButtonLink>
        </div>
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Поля и меню</Typography>
          <Input label="Название документа" placeholder="Введите название" caption="Подсказка под полем" data-testid="brand-input"/>
          <Select label="Статус документа" defaultValue="draft" options={[{value:'draft',label:'Черновик'},{value:'signed',label:'Подписан'}]}/>
          <Input label="Поле с ошибкой" defaultValue="Некорректное значение" error="Проверьте значение"/>
          <HoverActionExample/>
        </div>
      </div>
      <div className="fdoc-branding__panel">
        <Typography variant="subtitle" strong>Статусы сохраняют свои палитры</Typography>
        <div className="fdoc-branding__row">{(['success','error','warning','accent'] as const).map((color,index)=><Chips key={color} color={color} text={['Подписан','Ошибка','Внимание','Информация'][index]} data-testid={`brand-status-${color}`}/>)}</div>
        <Typography variant="caption" responsive>В Dark меняются семантические ссылки текста, иконок, мягких и инверсных поверхностей статусов, но сами Green / Red / Orange / Purple остаются теми же примитивными палитрами. Изменение Primary их не перекрашивает.</Typography>
      </div>
    </section>

    <section>{title('Как устроен расчет')}
      <Typography responsive>Для каждого RGB-канала: светлый оттенок = round(C500 + (255 − C500) × k), темный = round(C500 × (1 − k)). Общие коэффициенты для 25, 50, 100, 200, 300, 400: 96%, 80%, 72%, 56%, 32%, 16%; для 600, 700, 800, 900: 16%, 32%, 56%, 72%. Эти коэффициенты задают растяжку; пригодность каждой ступени для конкретной роли проверяется отдельно по контрасту.</Typography>
      <Typography responsive>Для ролей с автоматическим подбором после выбора светлой или темной стороны действует правило: берем номинальную ступень роли, проверяем все ее пары с фонами и выбираем ближайшую ступень, которая проходит порог контраста. Близость — минимальная разница номеров ступеней; при равенстве выбирается меньший номер. Белый 0 и черный 1000 служат крайними точками. Отдельных поправок под Button, Chips или другие компоненты нет.</Typography>

      <Typography responsive>В Light Primary Default использует 500. В Dark генератор перебирает тройки соседних ступеней и выбирает Default, который различим на background-base-default минимум на 3:1 и позволяет использовать одно содержимое с контрастом текста минимум 4.5:1 на Default / Hover / Pressed. Среди подходящих вариантов выбирается заливка, ближайшая к целевому контрасту около 4:1 с темной поверхностью, а при равенстве — ближе к 500. Поэтому светлый Primary обычно уходит темнее, а слишком темный — светлее.</Typography>
      <Typography responsive>Семантические названия сохраняются. Текст на Primary и его активных состояниях подбирается с контрастом не ниже 4.5:1, иконки — 3:1. Считается фактический контраст конечных HEX, без округления порога. Disabled проверяется отдельно от активных состояний. Это проверка заданных пар цветов, а не всех возможных наложений компонентов.</Typography>
      <Typography responsive>Все примитивы Primary одинаковы в Light и Dark. Переключение темы меняет только семантические соответствия. Neutral и статусные палитры тоже сохраняют исходные значения; Dark выбирает другие ступени для их фонов, текста, иконок и обводок.</Typography>
      <Button color="secondary" onClick={()=>setExported(!exported)}>{exported?'Скрыть CSS':'Показать CSS темы'}</Button>
      {exported&&<pre className="fdoc-branding__code" tabIndex={0} aria-label="CSS темы">{theme?primaryThemeCss(theme):'/* Исходная Light-тема: подключите styles/tokens.css без переопределений. */'}</pre>}
      <Typography variant="caption" responsive>Для интеграции: createColorTheme(hex, mode) возвращает палитру, значения и связи токенов; primaryThemeCss(theme) формирует CSS для корня приложения, включая портальные меню. Для Dark F.Doc используется #FFDC00 без клиентского переопределения.</Typography>
      <Typography variant="caption" responsive>Методика контраста: <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">WCAG — Contrast Minimum</a>.</Typography>
    </section>

    <section>{title('Как проверяется результат')}
      <Typography responsive>Цвет проверяется в паре с фоном, а не сам по себе. Генератор берет конечные HEX, рассчитывает относительную яркость каждого цвета и делит яркость более светлого цвета с добавлением 0.05 на яркость более темного с добавлением 0.05. Получается коэффициент контраста: например, 7:1.</Typography>
      <ul>
        <li>Для текста в предусмотренных активных сочетаниях требуется минимум 4.5:1, для иконок — 3:1. Основная иконка на заливке Primary использует цвет текста и проходит его более строгий порог.</li>
        <li>Содержимое остается читаемым на Default, Hover и Pressed. Если для роли задано несколько поверхностей, кандидат должен подходить ко всем, а не только к фону страницы.</li>
        <li>При подборе кандидаты сортируются по разнице номеров с начальной ступенью. Например, от 500 сначала проверяется 500, затем 400 и 600, затем 300 и 700. При равной разнице первым идет меньший номер. Дополнительные крайние точки — белый 0 и черный 1000.</li>
        <li>Для Disabled действует отдельный внутренний порог 3:1. Фокусный ореол сохраняет 16% прозрачности; его итоговая видимость зависит от поверхности и не гарантируется проверкой непрозрачного цвета.</li>
        <li>Автотесты проверяют предусмотренные цветовые пары на 312 HEX в обеих темах, сохранение Primary 500, общую растяжку и прозрачность фокуса. Браузерные тесты проверяют применение значений к компонентам, переключение темы и экспорт CSS.</li>
      </ul>
      <Typography responsive>Проверяются конкретные сочетания из правил библиотеки. Произвольный фон, изображение под компонентом или дополнительная прозрачность требуют отдельной проверки. У белого, черного и очень близких к ним HEX некоторые ступени могут совпасть: контраст текста и различимость состояний — разные проверки.</Typography>
      <Typography responsive>Для проверки вручную введи HEX или выбери пресет, сравни Light и Dark, затем посмотри таблицу семантики и живые компоненты в состояниях. Растяжка должна оставаться одинаковой, фоны и содержимое должны соответствовать выбранной теме, а фокус — сохранять прозрачность. Кнопка «Показать CSS темы» ниже открывает итоговые переменные.</Typography>
    </section>

    <section>{title('Как подключить автоматику на фронте')}
      <Typography responsive>Передайте в разработку генератор вместе с базовыми токенами, стилями компонентов и тестами. Основные файлы: <a href="https://github.com/dariaeremina89-oss/design-system/blob/main/src/styles/primary-theme.ts">primary-theme.ts</a> — растяжка и Primary-семантика; <a href="https://github.com/dariaeremina89-oss/design-system/blob/main/src/styles/color-theme.ts">color-theme.ts</a> — тема всей системы; <a href="https://github.com/dariaeremina89-oss/design-system/blob/main/src/styles/contrast-policy.ts">contrast-policy.ts</a> — правила подбора; <a href="https://github.com/dariaeremina89-oss/design-system/blob/main/src/styles/primary-theme.test.ts">primary-theme.test.ts</a> — проверки. Таблицы на этой странице объясняют код; вручную переносить их для каждого клиента не нужно.</Typography>
      <Typography responsive>После подключения исходников или сборки библиотеки и базовых стилей вызов выглядит так. При смене HEX или темы заменяйте содержимое одного и того же style-элемента: так от предыдущей темы не останутся лишние переопределения.</Typography>
      <pre className="fdoc-branding__code" tabIndex={0} aria-label="Пример подключения генератора">{`import { createColorTheme, primaryThemeCss } from '@fdoc/design-system';

const themeStyle = document.createElement('style');
document.head.append(themeStyle);

function setBrandTheme(hex: string, mode: 'light' | 'dark') {
  const theme = createColorTheme(hex, mode);
  themeStyle.textContent = primaryThemeCss(theme);
  return theme;
}

setBrandTheme('#2F26FF', 'light');
// При переключении темы:
setBrandTheme('#2F26FF', 'dark');`}</pre>
      <Typography responsive>В результате palette содержит общую растяжку, references — ссылки семантических токенов на выбранные цвета, variables — готовые значения. primaryThemeCss формирует CSS для :root, чтобы тема действовала и на портальные меню. Компоненты используют var(--background-primary-secondary), var(--text-primary-secondary) и другие семантические имена вместо конкретных номеров ступеней.</Typography>
      <Typography responsive>Генератор принимает непрозрачный HEX из 3 или 6 символов. Некорректный ввод вызывает ошибку: фронт должен показать ошибку поля и сохранить предыдущую корректную тему. Если для заданных правил не найдена подходящая ступень, расчет тоже завершается ошибкой. Проверки на 312 цветах подтверждают проверенные сценарии, но не служат обещанием для всех возможных наложений интерфейса.</Typography>
      <Typography variant="caption" responsive>Функции сами не сохраняют настройки клиента: хранение HEX и режима, восстановление при входе и вызов генератора при изменении настраиваются в приложении. В Storybook это делает отдельный слой настроек темы. Генератор не зависит от React; при переносе на другой стек нужно сохранить правила и прогнать те же тесты.</Typography>
    </section>


  </div>;
}
