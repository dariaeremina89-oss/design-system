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
import {
  brandSafeDarkSurfaceRange,
  createBrandSafeColorTheme,
  getBrandSafeProfile,
} from '../styles/brand-safe-color-theme';
import { createColorTheme } from '../styles/color-theme';
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

function adjustmentLabel(adjustment:'unchanged'|'lightened'|'darkened') {
  if(adjustment==='unchanged') return 'Без изменения';
  return adjustment==='lightened'?'Осветлен минимально':'Затемнен минимально';
}

function Swatch({label,color,testId,focusBorder}:{label:string;color:string;testId?:string;focusBorder?:string}) {
  const foreground=contrastRatio(color,'#000000')>=contrastRatio(color,'#ffffff')?'#000000':'#ffffff';
  return <div className="fdoc-branding__swatch" style={{background:color,color:foreground,boxShadow:focusBorder?`inset 0 0 0 3px ${focusBorder}`:undefined}} data-testid={testId}>
    <Typography as="span" variant="body" strong>{label}</Typography>
    <Typography as="span" variant="caption">{color.toUpperCase()}</Typography>
  </div>;
}

function Palette({theme}:{theme:PrimaryTheme}) {
  return <div className="fdoc-branding__palette" role="group" aria-label="Primary palette">
    {primarySteps.map(step=>{
      const color=theme.palette[step];
      const foreground=contrastRatio(color,'#000000')>=contrastRatio(color,'#ffffff')?'#000000':'#ffffff';
      return <div
        key={step}
        className="fdoc-branding__swatch"
        style={{background:color,color:foreground}}
        data-primary-step={step}
        data-source={step===500||undefined}
      >
        <Typography as="span" variant="body" strong>{step}{step===500?' · Source':''}</Typography>
        <Typography as="span" variant="caption">{color.toUpperCase()}</Typography>
      </div>;
    })}
  </div>;
}

export function CustomBrandingBrandSafe() {
  const restoreSeed=useRef(getPrimarySeed());
  const restoreMode=useRef(getColorMode());
  const [seed,setSeed]=useState(restoreSeed.current??DEFAULT_PRIMARY);
  const [draft,setDraft]=useState(seed);
  const [mode,setMode]=useState<ColorMode>('dark');
  const appliedKeys=useRef<string[]>([]);

  const current=useMemo(()=>createColorTheme(seed,mode),[seed,mode]);
  const brandSafe=useMemo(()=>createBrandSafeColorTheme(seed,mode),[seed,mode]);
  const profile=useMemo(()=>getBrandSafeProfile(seed),[seed]);

  useEffect(()=>{
    const root=document.documentElement;
    for(const key of appliedKeys.current) root.style.removeProperty(key);
    for(const [key,tokenValue] of Object.entries(brandSafe.variables)) root.style.setProperty(key,tokenValue);
    appliedKeys.current=Object.keys(brandSafe.variables);
    root.dataset.colorMode=mode;
    root.style.colorScheme=mode;
  },[brandSafe,mode]);

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

  const light=createBrandSafeColorTheme(seed,'light');
  const dark=createBrandSafeColorTheme(seed,'dark');

  return <div className="fdoc-branding sb-unstyled">
    <Typography as="h1" variant="h1-heading" responsive>Custom Branding · Brand-safe</Typography>
    <Typography responsive>
      Экспериментальная схема вместо Tonal. Введенный HEX остается главным брендовым цветом и всегда сохраняется точно как Primary 500. Light использует его без изменений. Dark тоже сначала пытается оставить тот же HEX и корректирует только lightness, если цвет слишком темный или слишком яркий для основной темной поверхности.
    </Typography>

    <section className="fdoc-branding__panel" aria-label="Настройки Brand-safe темы">
      <div className="fdoc-branding__controls">
        <Input
          label="Primary HEX"
          aria-label="Primary HEX"
          value={draft}
          onChange={event=>update(event.target.value)}
          error={normalizeHex(draft)?undefined:'Введите HEX из 3 или 6 символов, например #2F26FF'}
          spellCheck={false}
          autoComplete="off"
        />
        <ButtonToggle
          aria-label="Цветовая тема Brand-safe"
          value={mode}
          onValueChange={next=>setMode(next as ColorMode)}
          options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]}
        />
        <Button color="secondary" onClick={()=>update(DEFAULT_PRIMARY)}>F.Doc</Button>
      </div>
      <div className="fdoc-branding__row" aria-label="Пресеты Brand-safe">
        {presets.map(([name,color])=><button
          key={color}
          type="button"
          className="fdoc-branding__preset"
          aria-label={`${name} ${color}`}
          onClick={()=>update(color)}
        ><span aria-hidden="true" style={{background:color}}/>{name}</button>)}
      </div>
      <Typography variant="caption" responsive role="status">
        Primary 500: {seed.toUpperCase()} · Dark Default: {profile.darkDefault.toUpperCase()} · {adjustmentLabel(profile.adjustment)} · ΔL {profile.deltaLightness>=0?'+':''}{profile.deltaLightness.toFixed(3)}.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Что происходит с введенным HEX</Typography>
      <div className="fdoc-branding__examples">
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Brand Source</Typography>
          <div className="fdoc-branding__color-strip fdoc-branding__color-strip--source" data-testid="brand-safe-source-strip"><Swatch label="Primary 500" color={seed}/></div>
          <Typography variant="caption" responsive>Этот HEX не пересчитывается и остается точным значением Primary 500.</Typography>
        </div>
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Dark Primary states</Typography>
          <div className="fdoc-branding__color-strip fdoc-branding__color-strip--states" data-testid="brand-safe-states-strip">
            <Swatch label="Default" color={profile.darkDefault} testId="brand-safe-dark-default"/>
            <Swatch label={`Hover · ${Math.round(profile.hoverOpacity*100)}%`} color={profile.darkHover}/>
            <Swatch label="Focus" color={profile.darkDefault} focusBorder={profile.focusBorder} testId="brand-safe-focus"/>
            <Swatch label={`Pressed · ${Math.round(profile.pressedOpacity*100)}%`} color={profile.darkPressed}/>
          </div>
          <Typography variant="caption" responsive data-testid="brand-safe-adjustment">
            {adjustmentLabel(profile.adjustment)}. Source contrast {profile.sourceContrast.toFixed(2)}:1 → Default {profile.defaultContrast.toFixed(2)}:1. Text: {profile.foreground.toUpperCase()}. Interaction overlay: {profile.interactionOverlay.toUpperCase()}. Hover {Math.round(profile.hoverOpacity*100)}%, Pressed {Math.round(profile.pressedOpacity*100)}%.
          </Typography>
        </div>
      </div>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Предсказуемое правило Dark</Typography>
      <Typography responsive>
        Сначала проверяется точный введенный HEX на background-base-default. Если его контраст с темной поверхностью находится между {brandSafeDarkSurfaceRange.min}:1 и {brandSafeDarkSurfaceRange.max}:1, цвет вообще не меняется. Это значит, что нормальный зеленый, синий или другой уже подходящий бренд остается ровно тем, что ввел клиент.
      </Typography>
      <Typography responsive>
        Если цвет выходит за диапазон, меняется только OKLCH lightness до ближайшей границы. Hue сохраняется, chroma остается максимально исходной и уменьшается только при выходе за sRGB. Алгоритм не ищет ступень 200, 500 или 600 и не перестраивает бренд под заранее выбранный тон.
      </Typography>
      <Typography responsive>
        Hover и Pressed больше не зависят от цвета текста. Сначала для Default отдельно выбирается наиболее читаемый Text — черный или белый. Затем черный и белый interaction overlay проверяются независимо: какой позволяет сохранить целевые 8% для Hover и 12% для Pressed и дает более заметное Pressed-состояние, тот и используется. Если даже у него целевая opacity ломает контраст текста 4.5:1 или слишком сближает состояние с Dark Base, opacity уменьшается до максимального безопасного значения.
      </Typography>
      <Typography responsive>
        Focus не меняет заливку вообще: остается тот же Default. Состояние показывается только focus-обводкой по системному токену border-primary-focused. Поэтому Hover / Pressed отвечают за изменение поверхности, а Focus — только за клавиатурный фокус.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Primary palette остается брендовой</Typography>
      <Typography responsive>
        Растяжка 25–900 здесь оставлена такой же, как в текущем Custom Branding, поэтому можно сравнивать только новую Dark-коррекцию. 500 всегда точно совпадает с введенным HEX; Brand-safe Default может быть отдельным семантическим цветом между ступенями.
      </Typography>
      <Palette theme={brandSafe}/>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Текущая логика vs Brand-safe · {mode==='dark'?'Dark':'Light'}</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Сравнение Primary логики">
        <thead><tr><th scope="col">Token</th><th scope="col">Текущий</th><th scope="col">Brand-safe</th></tr></thead>
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
          <td>{brandSafe.references[token]??'—'} · {value(brandSafe,token).toUpperCase()}</td>
        </tr>)}</tbody>
      </table></div>
      <Typography variant="caption" responsive>
        На этом эксперименте Secondary / Tertiary / Inverse пока оставлены из текущей логики. Меняется только основная брендовая заливка и ее Default / Hover / Pressed, чтобы отдельно оценить сохранность клиентского HEX.
      </Typography>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Живые компоненты · Brand-safe</Typography>
      <div className="fdoc-branding__examples">
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Primary и выбор</Typography>
          <div className="fdoc-branding__row">
            <Button data-testid="brand-safe-primary-button">Продолжить</Button>
            <Button color="secondary">Отмена</Button>
            <Button color="inverse-primary">Inverse Primary</Button>
            <ButtonIcon color="tertiary" icon="plus" aria-label="Добавить"/>
          </div>
          <ChipsGroup aria-label="Документы Brand-safe" defaultValue={['all']} options={[{value:'all',text:'Все'},{value:'draft',text:'Черновики'},{value:'sent',text:'Отправленные'}]}/>
          <div className="fdoc-branding__row"><Checkbox label="Выбрано" defaultChecked/><Radio label="Вариант" name="brand-safe-radio" defaultChecked/><Switch label="Уведомления" defaultChecked/></div>
          <ProgressIndicator mode="determinate" value={64} aria-label="Загрузка Brand-safe"/>
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
      <Typography as="h2" variant="h3-heading" responsive>Как меняются наши пресеты</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Brand-safe пресеты">
        <thead><tr><th scope="col">Primary HEX</th><th scope="col">Light Default</th><th scope="col">Dark Default</th><th scope="col">Изменение</th></tr></thead>
        <tbody>{presets.map(([name,color])=>{
          const item=getBrandSafeProfile(color);
          return <tr key={color}>
            <th scope="row">{name}<br/>{color.toUpperCase()}</th>
            <td><span className="fdoc-branding__color-dot" style={{background:value(createBrandSafeColorTheme(color,'light'),'--background-primary-default')}}/>{value(createBrandSafeColorTheme(color,'light'),'--background-primary-default').toUpperCase()}</td>
            <td><span className="fdoc-branding__color-dot" style={{background:item.darkDefault}}/>{item.darkDefault.toUpperCase()}</td>
            <td>{adjustmentLabel(item.adjustment)} · ΔL {item.deltaLightness>=0?'+':''}{item.deltaLightness.toFixed(3)}</td>
          </tr>;
        })}</tbody>
      </table></div>
    </section>

    <section>
      <Typography as="h2" variant="h3-heading" responsive>Light остается без изменений</Typography>
      <Typography responsive>
        В Light Brand-safe полностью повторяет текущую логику: background-primary-default = Primary 500 = введенный HEX. Эксперимент касается только того, насколько мало нужно изменить основной брендовый цвет для Dark.
      </Typography>
      <Typography variant="caption" responsive data-testid="brand-safe-light-default">
        Light Default {value(light,'--background-primary-default').toUpperCase()} · Dark Default {value(dark,'--background-primary-default').toUpperCase()}.
      </Typography>
    </section>
  </div>;
}
