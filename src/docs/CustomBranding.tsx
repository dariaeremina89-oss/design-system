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
  const light=createColorTheme(seed??DEFAULT_PRIMARY,'light'),dark=createColorTheme(seed??DEFAULT_PRIMARY,'dark');
  const mappings=['--background-base-default','--text-base-default','--background-primary-default','--text-primary-default','--background-primary-secondary','--text-primary-secondary','--background-primary-inverse','--text-primary-inverse','--border-primary-focused','--background-success-secondary','--text-success-default-light'];
  const ratios=buttonStates.filter(state=>state!=='disabled').map(state=>{
    const background=`--background-primary-default${state==='hover'||state==='pressed'?'-'+state:''}`;
    return {state,text:contrastRatio(value('--text-primary-default'),value(background)),icon:contrastRatio(value('--icon-primary-default-light'),value(background))};
  });
  function update(next:string) {setDraft(next);const normalized=normalizeHex(next);if(normalized)applyPrimaryTheme(normalized);}
  const title=(text:string)=><Typography as="h2" variant="h3-heading" responsive>{text}</Typography>;
  return <div className="fdoc-branding">
    <Typography as="h1" variant="h1-heading" responsive>Custom Branding</Typography>
    <Typography responsive>Один цвет бренда, две темы. Введите Primary 500 — палитра и компоненты обновятся сразу.</Typography>
    <section className="fdoc-branding__panel" aria-label="Настройки темы">
      <div className="fdoc-branding__controls">
        <Input label="Primary 500 · HEX" aria-label="Primary 500 HEX" value={draft} onChange={event=>update(event.target.value)} error={invalid?'Введите HEX из 3 или 6 символов, например #2F26FF':undefined} spellCheck={false} autoComplete="off"/>
        <ButtonToggle aria-label="Цветовая тема" value={mode} onValueChange={next=>applyColorMode(next as 'light'|'dark')} options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]}/>
        <Button color="secondary" onClick={()=>{applyPrimaryTheme(null,true,'light');setDraft(DEFAULT_PRIMARY);}}>Сбросить к F.Doc</Button>
      </div>
      <div className="fdoc-branding__row" aria-label="Примеры цветов">
        {[['Синий','#2f26ff'],['Зеленый','#008567'],['Бордовый','#8b1245'],['Светлый','#f4e5fa'],['Темный','#171329']].map(([name,color])=><button key={color} type="button" className="fdoc-branding__preset" aria-label={`${name} ${color}`} onClick={()=>update(color)}><span aria-hidden="true" style={{background:color}}/>{name}</button>)}
      </div>
      <Typography variant="caption" responsive role="status">{seed?`Primary 500: ${seed.toUpperCase()}`:'Исходная палитра F.Doc'} · {mode==='dark'?'Dark':'Light'}. Тема применяется ко всем стори и сохраняется в этом браузере.</Typography>
    </section>

    <section>{title('Палитра Primary')}
      <div className="fdoc-branding__palette">{primarySteps.map(step=>{const color=value(`--primary-${step}`);const foreground=contrastRatio(color,'#000000')>=contrastRatio(color,'#ffffff')?'#000000':'#ffffff';return <div key={step} className="fdoc-branding__swatch" style={{background:color,color:foreground}} data-primary-step={step}><Typography as="span" variant="body" strong>{step}</Typography><Typography as="span" variant="caption">{color.toUpperCase()}</Typography></div>;})}</div>
      <Typography variant="caption" responsive>500 сохраняет введенный HEX точно. 25–400 — смесь с белым, 600–900 — с черным. Primary отделен от Yellow: предупреждения и другие палитры от клиентского цвета не меняются.</Typography>
    </section>

    <section>{title('Состояния компонентов')}
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Состояния Primary">
        <thead><tr><th scope="col">Компонент</th>{buttonStates.map(state=><th key={state} scope="col">{state[0].toUpperCase()+state.slice(1)}</th>)}</tr></thead>
        <tbody><tr><th scope="row">Button</th>{buttonStates.map(state=><td key={state}><Button state={state} iconLeft="plus" data-testid={`brand-button-${state}`}>Создать</Button></td>)}</tr>
          <tr><th scope="row">ButtonIcon</th>{buttonStates.map(state=><td key={state}><ButtonIcon state={state} icon="plus" aria-label={`Создать: ${state}`}/></td>)}</tr>
          <tr><th scope="row">Chips</th>{buttonStates.map(state=><td key={state}><Chips text="Выбрано" color="primary" interactive state={state}/></td>)}</tr>
        </tbody></table></div>
      <Typography variant="caption" responsive>На темной заливке используется светлый текст. Hover и Pressed выбираются так, чтобы один цвет текста оставался читаемым во всех активных состояниях.</Typography>
      <div className="fdoc-branding__row">{ratios.map(({state,text,icon})=><Typography key={state} as="span" variant="caption" data-testid={`contrast-${state}`}>{state}: текст {text.toFixed(2)}:1 · иконка {icon.toFixed(2)}:1</Typography>)}</div>
      {!seed&&mode==='light'&&<Typography variant="caption" responsive>Сейчас показаны исходные токены F.Doc. Расчет с проверкой контраста включается при вводе HEX или выборе пресета.</Typography>}
    </section>

    <section>{title('Семантика Light / Dark')}
      <Typography responsive>Один токен — разные оттенки для разных поверхностей. Здесь показаны соответствия для текущего Primary после расчета.</Typography>
      <div className="fdoc-branding__scroll"><table className="fdoc-branding__table" aria-label="Семантика Light и Dark">
        <thead><tr><th scope="col">Семантический токен</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
        <tbody>{mappings.map(token=><tr key={token}><th scope="row">{token}</th>{[light,dark].map(item=>{const color=item.variables[token]??original[token];return <td key={item.mode}><span className="fdoc-branding__color-dot" style={{background:color}} aria-hidden="true"/>{item.references[token]??semanticColorTokens.find(entry=>entry.token===token)?.reference}<br/>{color.toUpperCase()}</td>;})}</tr>)}</tbody>
      </table></div>
    </section>

    <section>{title('Живые примеры')}
      <div className="fdoc-branding__examples">
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Действия и выбор</Typography>
          <div className="fdoc-branding__row"><Button>Продолжить</Button><Button color="secondary">Отмена</Button><Button color="inverse-primary" data-testid="brand-inverse-primary">Inverse Primary</Button><Badge text="12"/></div>
          <ChipsGroup aria-label="Документы" defaultValue={['all']} options={[{value:'all',text:'Все'},{value:'draft',text:'Черновики'},{value:'sent',text:'Отправленные'}]}/>
          <div className="fdoc-branding__row"><Checkbox label="Выбрано" defaultChecked/><Radio label="Вариант" name="brand-radio" defaultChecked/><Switch label="Уведомления" defaultChecked/></div>
          <ProgressIndicator mode="determinate" value={64} aria-label="Загрузка документов"/>
          <ButtonLink color="primary" iconRight="arrow-chevron-right">Открыть документы</ButtonLink>
        </div>
        <div className="fdoc-branding__panel">
          <Typography variant="subtitle" strong>Поля и меню</Typography>
          <Input label="Название документа" placeholder="Введите название" caption="Подсказка под полем"/>
          <Select label="Статус документа" defaultValue="draft" options={[{value:'draft',label:'Черновик'},{value:'signed',label:'Подписан'}]}/>
          <Input label="Поле с ошибкой" defaultValue="Некорректное значение" error="Проверьте значение"/>
          <HoverActionExample/>
        </div>
      </div>
      <div className="fdoc-branding__panel">
        <Typography variant="subtitle" strong>Статусы сохраняют свои палитры</Typography>
        <div className="fdoc-branding__row">{(['success','error','warning','accent'] as const).map((color,index)=><Chips key={color} color={color} text={['Подписан','Ошибка','Внимание','Информация'][index]} data-testid={`brand-status-${color}`}/>)}</div>
        <Typography variant="caption" responsive>В Dark для статусов выбираются другие оттенки из тех же палитр. Изменение Primary их не перекрашивает.</Typography>
      </div>
    </section>

    <section>{title('Как устроен расчет')}
      <Typography responsive>Для каждого RGB-канала: светлый оттенок = round(C500 + (255 − C500) × k), темный = round(C500 × (1 − k)). Коэффициенты для 25, 50, 100, 200, 300, 400: 96%, 80%, 72%, 56%, 32%, 16%; для 600, 700, 800, 900: 16%, 32%, 56%, 72%.</Typography>
      <Typography responsive>Семантические названия сохраняются. Текст на Primary и его активных состояниях подбирается с контрастом не ниже 4.5:1, иконки — 3:1. Считается фактический контраст конечных HEX, без округления порога. Disabled проверяется отдельно от активных состояний. Это проверка заданных пар цветов, а не всех возможных наложений компонентов.</Typography>
      <Typography responsive>Light и Dark используют один Primary 500. В Dark меняются семантические соответствия фонов, текста, иконок и обводок; исходные Neutral, Success, Error, Warning и Accent не пересчитываются.</Typography>
      <Button color="secondary" onClick={()=>setExported(!exported)}>{exported?'Скрыть CSS':'Показать CSS темы'}</Button>
      {exported&&<pre className="fdoc-branding__code" tabIndex={0} aria-label="CSS темы">{theme?primaryThemeCss(theme):'/* Исходная Light-тема: подключите styles/tokens.css без переопределений. */'}</pre>}
      <Typography variant="caption" responsive>Для интеграции: createColorTheme(hex, mode) возвращает палитру, значения и связи токенов; primaryThemeCss(theme) формирует CSS для корня приложения, включая портальные меню. Для Dark F.Doc используется #FFDC00 без клиентского переопределения.</Typography>
      <Typography variant="caption" responsive>Методика контраста: <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">WCAG — Contrast Minimum</a>.</Typography>
    </section>
  </div>;
}
