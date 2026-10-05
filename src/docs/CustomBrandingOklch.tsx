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
  createOklchColorTheme,
  getOklchDarkBrandProfile,
} from '../styles/oklch-color-theme';
import {
  contrastRatio,
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
import './custom-branding.css';

const presets=[
  ['F.Doc','#ffdc00'],
  ['Синий','#2f26ff'],
  ['Зеленый','#008567'],
  ['Бордовый','#8b1245'],
  ['Светлый','#f4e5fa'],
  ['Темный','#171329'],
] as const;

const semanticRows=[
  ['Primary Default','--background-primary-default','--text-primary-default'],
  ['Primary Secondary','--background-primary-secondary','--text-primary-secondary'],
  ['Primary Tertiary','--background-primary-tertiary','--text-primary-secondary'],
  ['Primary Inverse','--background-primary-inverse','--text-primary-inverse'],
] as const;

function activeStep(theme:PrimaryTheme,token='--background-primary-default') {
  const reference=theme.references[token]??'';
  const match=reference.match(/--primary-(\d+)$/);
  return match?Number(match[1]):null;
}

function Palette({label,theme,testId}:{label:string;theme:PrimaryTheme;testId:string}) {
  const active=activeStep(theme);
  return <div className="fdoc-branding__panel" data-testid={testId}>
    <Typography variant="subtitle" strong>{label}</Typography>
    <div className="fdoc-branding__palette" role="group" aria-label={label}>
      {primarySteps.map(step=>{
        const color=theme.palette[step];
        const foreground=contrastRatio(color,'#000000')>=contrastRatio(color,'#ffffff')?'#000000':'#ffffff';
        return <div
          key={step}
          className="fdoc-branding__swatch"
          style={{background:color,color:foreground}}
          data-primary-step={step}
          data-active={active===step||undefined}
        >
          <Typography as="span" variant="body" strong>{step}{active===step?' · Default':''}</Typography>
          <Typography as="span" variant="caption">{color.toUpperCase()}</Typography>
        </div>;
      })}
    </div>
  </div>;
}

function semanticValue(theme:PrimaryTheme,token:string) {
  return theme.variables[token]??'—';
}

export function CustomBrandingOklch() {
  const restoreSeed=useRef(getPrimarySeed());
  const restoreMode=useRef(getColorMode());
  const [seed,setSeed]=useState(restoreSeed.current??DEFAULT_PRIMARY);
  const [draft,setDraft]=useState(seed);
  const [mode,setMode]=useState<ColorMode>('dark');
  const appliedKeys=useRef<string[]>([]);

  const current=useMemo(()=>createColorTheme(seed,mode),[seed,mode]);
  const experiment=useMemo(()=>createOklchColorTheme(seed,mode),[seed,mode]);
  const profile=useMemo(()=>getOklchDarkBrandProfile(seed),[seed]);

  useEffect(()=>{
    const root=document.documentElement;
    for(const key of appliedKeys.current) root.style.removeProperty(key);
    for(const [key,value] of Object.entries(experiment.variables)) root.style.setProperty(key,value);
    appliedKeys.current=Object.keys(experiment.variables);
    root.dataset.colorMode=mode;
    root.style.colorScheme=mode;
  },[experiment,mode]);

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

  const baseBackground=semanticValue(experiment,'--background-base-default');
  const currentDefault=semanticValue(current,'--background-primary-default');
  const experimentDefault=semanticValue(experiment,'--background-primary-default');

  return <div className="fdoc-branding sb-unstyled">
    <Typography as="h1" variant="h1-heading" responsive>Custom Branding · OKLCH</Typography>
    <Typography responsive>
      Экспериментальная страница для сравнения с текущим Custom Branding. Light намеренно остается таким же, как в основной версии. В Dark меняется только построение Primary: исходный HEX переводится в OKLCH, hue сохраняется, chroma уменьшается только при выходе за sRGB, а lightness адаптируется под темную тему.
    </Typography>

    <section className="fdoc-branding__panel" aria-label="Настройки OKLCH темы">
      <div className="fdoc-branding__controls">
        <Input
          label="Brand HEX"
          aria-label="Brand HEX"
          value={draft}
          onChange={event=>update(event.target.value)}
          error={normalizeHex(draft)?undefined:'Введите HEX из 3 или 6 символов, например #2F26FF'}
          spellCheck={false}
          autoComplete="off"
        />
        <ButtonToggle
          aria-label="Цветовая тема OKLCH"
          value={mode}
          onValueChange={next=>setMode(next as ColorMode)}
          options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]}
        />
        <Button color="secondary" onClick={()=>{setSeed(DEFAULT_PRIMARY);setDraft(DEFAULT_PRIMARY);}}>F.Doc</Button>
      </div>
      <div className="fdoc-branding__row" aria-label="Примеры OKLCH цветов">
        {presets.map(([name,color])=><button
          key={color}
          type="button"
          className="fdoc-branding__preset"
          aria-label={`${name} ${color}`}
          onClick={()=>update(color)}
        ><span aria-hidden="true" style={{background:color}}/>{name}</button>)}
      </div>
      <Typography variant="caption" responsive role="status">
        Brand HEX: {seed.toUpperCase()} · {mode==='dark'?'Dark':'Light'}. Изменения на этой странице не заменяют текущий генератор и не сохраняются как настройки библиотеки.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Что именно отличается</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Сравнение алгоритмов">
        <thead><tr><th scope="col">Параметр</th><th scope="col">Текущая логика</th><th scope="col">OKLCH</th></tr></thead>
        <tbody>
          <tr><th scope="row">Введенный HEX</th><td>{seed.toUpperCase()} = Primary 500 в обеих темах</td><td>{seed.toUpperCase()} = брендовый источник; в Dark Primary 500 может адаптироваться</td></tr>
          <tr><th scope="row">Dark Primary 500</th><td>{createColorTheme(seed,'dark').palette[500].toUpperCase()}</td><td data-testid="oklch-dark-500">{createOklchColorTheme(seed,'dark').palette[500].toUpperCase()}</td></tr>
          <tr><th scope="row">Dark Default</th><td>{createColorTheme(seed,'dark').references['--background-primary-default']} · {createColorTheme(seed,'dark').variables['--background-primary-default'].toUpperCase()}</td><td>{createOklchColorTheme(seed,'dark').references['--background-primary-default']} · {createOklchColorTheme(seed,'dark').variables['--background-primary-default'].toUpperCase()}</td></tr>
          <tr><th scope="row">Hue</th><td>Меняется косвенно при RGB-смешивании с белым/черным</td><td>{profile.source.h.toFixed(1)}° → {profile.dark500.h.toFixed(1)}°</td></tr>
          <tr><th scope="row">Chroma</th><td>Уменьшается вместе с RGB-смешиванием</td><td>{profile.source.c.toFixed(3)} → {profile.dark500.c.toFixed(3)}; уменьшается только при необходимости попасть в sRGB</td></tr>
          <tr><th scope="row">Lightness Dark 500</th><td>Не меняется как часть общей растяжки</td><td>{profile.source.l.toFixed(3)} → {profile.dark500.l.toFixed(3)}; диапазон 0.62–0.78</td></tr>
        </tbody>
      </table></div>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Растяжки для текущего режима</Typography>
      <Typography responsive>
        В Light две версии совпадают. В Dark слева остается общая RGB-растяжка текущей версии, справа строится отдельная перцептуальная растяжка. В OKLCH семантический Primary Default всегда остается на 500, Hover — 400, Pressed — 600.
      </Typography>
      <div className="fdoc-branding__examples">
        <Palette label={`Текущая · ${mode==='dark'?'Dark':'Light'}`} theme={current} testId="current-brand-palette"/>
        <Palette label={`OKLCH · ${mode==='dark'?'Dark':'Light'}`} theme={experiment} testId="oklch-brand-palette"/>
      </div>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Семантика Primary</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Сравнение Primary семантики">
        <thead><tr><th scope="col">Роль</th><th scope="col">Текущая</th><th scope="col">OKLCH</th></tr></thead>
        <tbody>{semanticRows.map(([label,bg,fg])=><tr key={label}>
          <th scope="row">{label}</th>
          <td>{current.references[bg]} · {semanticValue(current,bg).toUpperCase()}<br/>{current.references[fg]} · {semanticValue(current,fg).toUpperCase()}</td>
          <td>{experiment.references[bg]} · {semanticValue(experiment,bg).toUpperCase()}<br/>{experiment.references[fg]} · {semanticValue(experiment,fg).toUpperCase()}</td>
        </tr>)}</tbody>
      </table></div>
      <Typography variant="caption" responsive>
        Для OKLCH Dark контраст Default с основным темным фоном сейчас {contrastRatio(experimentDefault,baseBackground).toFixed(2)}:1. В текущей версии — {contrastRatio(currentDefault,semanticValue(current,'--background-base-default')).toFixed(2)}:1.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Живые компоненты · OKLCH</Typography>
      <div className="fdoc-branding__examples">
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Действия и выбор</Typography>
          <div className="fdoc-branding__row">
            <Button data-testid="oklch-primary-button">Продолжить</Button>
            <Button color="secondary">Отмена</Button>
            <Button color="inverse-primary">Inverse Primary</Button>
            <ButtonIcon color="tertiary" icon="plus" aria-label="Добавить"/>
          </div>
          <ChipsGroup aria-label="Документы OKLCH" defaultValue={['all']} options={[{value:'all',text:'Все'},{value:'draft',text:'Черновики'},{value:'sent',text:'Отправленные'}]}/>
          <div className="fdoc-branding__row"><Checkbox label="Выбрано" defaultChecked/><Radio label="Вариант" name="oklch-radio" defaultChecked/><Switch label="Уведомления" defaultChecked/></div>
          <ProgressIndicator mode="determinate" value={64} aria-label="Загрузка OKLCH"/>
          <ButtonLink color="primary" iconRight="arrow-chevron-right">Открыть документы</ButtonLink>
        </div>
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Поля и меню</Typography>
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
      <Typography as="h2" variant="h3-heading" responsive>Предсказуемое правило OKLCH Dark</Typography>
      <Typography responsive>
        Введенный HEX сначала переводится в OKLCH. Hue сохраняется. Chroma сохраняется максимально возможной и уменьшается только если такой цвет не помещается в sRGB. Для Dark lightness исходного цвета ограничивается диапазоном 0.62–0.78: слишком темный бренд становится светлее, слишком светлый — темнее, а уже подходящий остается близким к исходному.
      </Typography>
      <Typography responsive>
        Получившийся Dark 500 становится Primary Default. Hover всегда 400 с lightness примерно на 0.05 выше, Pressed всегда 600 примерно на 0.03 ниже. Остальные ступени тоже задаются фиксированными изменениями lightness относительно 500. Поэтому номер семантической ступени не прыгает между 200, 500 и 600 в зависимости от HEX: меняется сама Dark-растяжка.
      </Typography>
      <Typography responsive>
        Контраст текста и иконок проверяется уже после gamut mapping. Base и статусные палитры на этой экспериментальной странице остаются такими же, как в текущей Dark-теме, чтобы сравнение касалось именно Primary.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Быстрое сравнение пресетов в Dark</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Сравнение пресетов в Dark">
        <thead><tr><th scope="col">HEX</th><th scope="col">Текущий Dark Default</th><th scope="col">OKLCH Dark Default</th></tr></thead>
        <tbody>{presets.map(([name,color])=>{
          const oldTheme=createColorTheme(color,'dark');
          const newTheme=createOklchColorTheme(color,'dark');
          return <tr key={color}><th scope="row">{name}<br/>{color.toUpperCase()}</th>
            <td><span className="fdoc-branding__color-dot" style={{background:oldTheme.variables['--background-primary-default']}}/>{oldTheme.references['--background-primary-default']} · {oldTheme.variables['--background-primary-default'].toUpperCase()}</td>
            <td><span className="fdoc-branding__color-dot" style={{background:newTheme.variables['--background-primary-default']}}/>--primary-500 · {newTheme.variables['--background-primary-default'].toUpperCase()}</td>
          </tr>;
        })}</tbody>
      </table></div>
    </section>
  </div>;
}
