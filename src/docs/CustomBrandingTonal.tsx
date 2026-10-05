import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '../components/Badge/Badge';
import { Button } from '../components/Button/Button';
import { ButtonIcon } from '../components/ButtonIcon/ButtonIcon';
import { ButtonToggle } from '../components/ButtonToggle/ButtonToggle';
import { Chips } from '../components/Chips/Chips';
import { ChipsGroup } from '../components/Chips/ChipsGroup';
import { Input } from '../components/Input/Input';
import { ButtonLink } from '../components/Link/Link';
import { ProgressIndicator } from '../components/ProgressIndicator/ProgressIndicator';
import { Select } from '../components/Select/Select';
import { Checkbox, Radio, Switch } from '../components/SelectionControl/SelectionControl';
import { Typography } from '../components/Typography/Typography';
import { createColorTheme } from '../styles/color-theme';
import {
  createTonalColorTheme,
  getTonalProfile,
  tonalLightness,
  tonalPrimaryMapping,
} from '../styles/tonal-color-theme';
import {
  DEFAULT_PRIMARY,
  normalizeHex,
  primarySteps,
  type ColorMode,
  type PrimaryTheme,
} from '../styles/primary-theme';
import {
  applyPrimaryTheme,
  getColorMode,
  getPrimarySeed,
} from '../styles/primary-theme-store';
import { semanticColorTokens } from '../styles/token-catalog';
import './custom-branding.css';

const presets=[
  ['F.Doc','#ffdc00'],
  ['Синий','#2f26ff'],
  ['Зеленый','#008567'],
  ['Бордовый','#8b1245'],
  ['Светлый','#f4e5fa'],
  ['Темный','#171329'],
] as const;

const original:Record<string,string>=Object.fromEntries(semanticColorTokens.map(item=>[item.token,item.value]));

function value(theme:PrimaryTheme,token:string) {
  return theme.variables[token]??original[token]??'—';
}

function activeStep(theme:PrimaryTheme,token='--background-primary-default') {
  const match=theme.references[token]?.match(/--primary-(\d+)$/);
  return match?Number(match[1]):null;
}

function Palette({title,theme,testId}:{title:string;theme:PrimaryTheme;testId:string}) {
  const active=activeStep(theme);
  return <div className="fdoc-branding__panel" data-testid={testId}>
    <Typography variant="subtitle" strong>{title}</Typography>
    <div className="fdoc-branding__palette" role="group" aria-label={title}>
      {primarySteps.map(step=>{
        const color=theme.palette[step];
        const foreground=step<=400?'#000000':'#ffffff';
        return <div
          key={step}
          className="fdoc-branding__swatch"
          style={{background:color,color:foreground}}
          data-primary-step={step}
          data-active={step===active||undefined}
        >
          <Typography as="span" variant="body" strong>{step}{step===active?' · Default':''}</Typography>
          <Typography as="span" variant="caption">{color.toUpperCase()}</Typography>
        </div>;
      })}
    </div>
  </div>;
}

function mappingText(mode:ColorMode,family:keyof typeof tonalPrimaryMapping.light) {
  const item=tonalPrimaryMapping[mode][family];
  return `${item.base} / ${item.hover} / ${item.pressed}`;
}

export function CustomBrandingTonal() {
  const restoreSeed=useRef(getPrimarySeed());
  const restoreMode=useRef(getColorMode());
  const [seed,setSeed]=useState(restoreSeed.current??DEFAULT_PRIMARY);
  const [draft,setDraft]=useState(seed);
  const [mode,setMode]=useState<ColorMode>('dark');
  const appliedKeys=useRef<string[]>([]);

  const current=useMemo(()=>createColorTheme(seed,mode),[seed,mode]);
  const tonal=useMemo(()=>createTonalColorTheme(seed,mode),[seed,mode]);
  const profile=useMemo(()=>getTonalProfile(seed),[seed]);

  useEffect(()=>{
    const root=document.documentElement;
    for(const key of appliedKeys.current) root.style.removeProperty(key);
    for(const [key,tokenValue] of Object.entries(tonal.variables)) root.style.setProperty(key,tokenValue);
    appliedKeys.current=Object.keys(tonal.variables);
    root.dataset.colorMode=mode;
    root.style.colorScheme=mode;
  },[tonal,mode]);

  useEffect(()=>()=> {
    const root=document.documentElement;
    for(const key of appliedKeys.current) root.style.removeProperty(key);
    applyPrimaryTheme(restoreSeed.current,false,restoreMode.current);
  },[]);

  function update(next:string) {
    setDraft(next);
    const normalized=normalizeHex(next);
    if(normalized) setSeed(normalized);
  }

  return <div className="fdoc-branding sb-unstyled">
    <Typography as="h1" variant="h1-heading" responsive>Custom Branding · Tonal</Typography>
    <Typography responsive>
      Вторая экспериментальная схема. Текущий Custom Branding не изменяется. Здесь введенный HEX считается Brand Source, а не обязательным Primary 500. Из Brand Source строится одна perceptual tonal palette, общая для Light и Dark. Темы отличаются только фиксированными semantic mappings.
    </Typography>

    <section className="fdoc-branding__panel" aria-label="Настройки Tonal темы">
      <div className="fdoc-branding__controls">
        <Input
          label="Brand Source HEX"
          aria-label="Brand Source HEX"
          value={draft}
          onChange={event=>update(event.target.value)}
          error={normalizeHex(draft)?undefined:'Введите HEX из 3 или 6 символов, например #2F26FF'}
          spellCheck={false}
          autoComplete="off"
        />
        <ButtonToggle
          aria-label="Цветовая тема Tonal"
          value={mode}
          onValueChange={next=>setMode(next as ColorMode)}
          options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]}
        />
        <Button color="secondary" onClick={()=>update(DEFAULT_PRIMARY)}>F.Doc</Button>
      </div>
      <div className="fdoc-branding__row" aria-label="Пресеты Tonal">
        {presets.map(([name,color])=><button
          key={color}
          type="button"
          className="fdoc-branding__preset"
          aria-label={`${name} ${color}`}
          onClick={()=>update(color)}
        ><span aria-hidden="true" style={{background:color}}/>{name}</button>)}
      </div>
      <Typography variant="caption" responsive role="status">
        Brand Source: {seed.toUpperCase()} · ближайшая по lightness ступень tonal palette: {profile.closestStep} · {profile.closestColor.toUpperCase()}. Source хранится отдельно и не обязан совпадать со ступенью палитры.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Главное отличие от текущей логики</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Сравнение архитектуры">
        <thead><tr><th scope="col">Параметр</th><th scope="col">Текущая</th><th scope="col">Tonal</th></tr></thead>
        <tbody>
          <tr><th scope="row">Введенный HEX</th><td>Считается Primary 500</td><td>Отдельный Brand Source</td></tr>
          <tr><th scope="row">Палитра Light / Dark</th><td>Одна RGB-растяжка вокруг введенного 500</td><td>Одна perceptual palette с фиксированной lightness каждой ступени</td></tr>
          <tr><th scope="row">Primary Default</th><td>Dark может искать разные ступени в зависимости от HEX</td><td>Light всегда 600, Dark всегда 200</td></tr>
          <tr><th scope="row">Hover / Pressed</th><td>Выбираются вокруг найденного Default</td><td>Light 700 / 800, Dark 100 / 300</td></tr>
          <tr><th scope="row">Контраст</th><td>Участвует в выборе самой Primary-заливки</td><td>Проверяет содержимое и borders; палитру и роли не перестраивает</td></tr>
        </tbody>
      </table></div>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Одна tonal palette для обеих тем</Typography>
      <Typography responsive>
        Hue берется из Brand Source. Chroma сохраняется максимально возможной и уменьшается только при выходе за sRGB. Lightness ступеней фиксирована, поэтому одинаковый номер имеет примерно одну визуальную роль независимо от того, ввели синий, желтый или бордовый.
      </Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Lightness tonal palette">
        <thead><tr><th scope="col">Ступень</th>{primarySteps.map(step=><th key={step} scope="col">{step}</th>)}</tr></thead>
        <tbody><tr><th scope="row">OKLCH L</th>{primarySteps.map(step=><td key={step}>{tonalLightness[step].toFixed(2)}</td>)}</tr></tbody>
      </table></div>
      <Palette title="Tonal palette" theme={tonal} testId="tonal-brand-palette"/>
      <Typography variant="caption" responsive data-testid="tonal-active-default">
        {mode==='light'?'Light':'Dark'} Primary Default → {tonal.references['--background-primary-default']} · {value(tonal,'--background-primary-default').toUpperCase()}.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Фиксированная таблица semantic mappings</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Tonal semantic mappings">
        <thead><tr><th scope="col">Роль</th><th scope="col">Light Default / Hover / Pressed</th><th scope="col">Dark Default / Hover / Pressed</th></tr></thead>
        <tbody>
          {(['default','secondary','tertiary','inverse'] as const).map(family=><tr key={family}>
            <th scope="row">Primary {family}</th>
            <td>{mappingText('light',family)}</td>
            <td>{mappingText('dark',family)}</td>
          </tr>)}
        </tbody>
      </table></div>
      <Typography variant="caption" responsive>
        Contrast fallback может выбрать соседнюю ступень для текста, иконки или border, если запланированная пара не проходит порог. Но сам background mapping остается фиксированным и предсказуемым.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Текущая логика vs Tonal · {mode==='dark'?'Dark':'Light'}</Typography>
      <div className="fdoc-branding__examples">
        <Palette title="Текущая растяжка" theme={current} testId="current-brand-palette"/>
        <Palette title="Tonal palette" theme={tonal} testId="tonal-brand-palette-compare"/>
      </div>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Сравнение Primary токенов">
        <thead><tr><th scope="col">Token</th><th scope="col">Текущий</th><th scope="col">Tonal</th></tr></thead>
        <tbody>{[
          '--background-primary-default',
          '--background-primary-default-hover',
          '--background-primary-default-pressed',
          '--background-primary-secondary',
          '--background-primary-tertiary',
          '--background-primary-inverse',
          '--text-primary-default',
          '--text-primary-secondary',
          '--text-primary-inverse',
        ].map(token=><tr key={token}>
          <th scope="row">{token}</th>
          <td>{current.references[token]??'—'} · {value(current,token).toUpperCase()}</td>
          <td>{tonal.references[token]??'—'} · {value(tonal,token).toUpperCase()}</td>
        </tr>)}</tbody>
      </table></div>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Живые компоненты · Tonal</Typography>
      <div className="fdoc-branding__examples">
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Primary и выбор</Typography>
          <div className="fdoc-branding__row">
            <Button data-testid="tonal-primary-button">Продолжить</Button>
            <Button color="secondary">Отмена</Button>
            <Button color="inverse-primary">Inverse Primary</Button>
            <ButtonIcon color="tertiary" icon="plus" aria-label="Добавить"/>
          </div>
          <ChipsGroup aria-label="Документы Tonal" defaultValue={['all']} options={[{value:'all',text:'Все'},{value:'draft',text:'Черновики'},{value:'sent',text:'Отправленные'}]}/>
          <div className="fdoc-branding__row"><Checkbox label="Выбрано" defaultChecked/><Radio label="Вариант" name="tonal-radio" defaultChecked/><Switch label="Уведомления" defaultChecked/></div>
          <ProgressIndicator mode="determinate" value={64} aria-label="Загрузка Tonal"/>
          <ButtonLink color="primary" iconRight="arrow-chevron-right">Открыть документы</ButtonLink>
        </div>
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Поля и статусы</Typography>
          <Input label="Название документа" placeholder="Введите название" caption="Подсказка под полем"/>
          <Select label="Статус документа" defaultValue="draft" options={[{value:'draft',label:'Черновик'},{value:'signed',label:'Подписан'}]}/>
          <Input label="Поле с ошибкой" defaultValue="Некорректное значение" error="Проверьте значение"/>
          <div className="fdoc-branding__row">
            {(['success','error','warning','accent'] as const).map((color,index)=><Chips key={color} color={color} text={['Подписан','Ошибка','Внимание','Информация'][index]}/>)}
          </div>
          <Badge text="12"/>
        </div>
      </div>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Пресеты: одинаковые роли, разные hue</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Tonal пресеты">
        <thead><tr><th scope="col">Brand Source</th><th scope="col">Tonal 600 · Light Default</th><th scope="col">Tonal 200 · Dark Default</th></tr></thead>
        <tbody>{presets.map(([name,color])=>{
          const light=createTonalColorTheme(color,'light');
          const dark=createTonalColorTheme(color,'dark');
          return <tr key={color}>
            <th scope="row">{name}<br/>{color.toUpperCase()}</th>
            <td><span className="fdoc-branding__color-dot" style={{background:value(light,'--background-primary-default')}}/>{value(light,'--background-primary-default').toUpperCase()}</td>
            <td><span className="fdoc-branding__color-dot" style={{background:value(dark,'--background-primary-default')}}/>{value(dark,'--background-primary-default').toUpperCase()}</td>
          </tr>;
        })}</tbody>
      </table></div>
    </section>
  </div>;
}
