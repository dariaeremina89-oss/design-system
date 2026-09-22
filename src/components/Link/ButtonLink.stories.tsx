import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonLink } from './Link';
import { Typography } from '../Typography/Typography';
import { componentDocs } from '../../docs/bulk-components';
const meta={title:'Components/Actions/ButtonLink',component:ButtonLink,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('ButtonLink')}}},args:{text:'Подробнее',iconRight:'arrow-chevron-right'},argTypes:{typography:{control:'radio',options:['fixed','inherit'],description:'Постоянный размер или типографика окружающего текста'},color:{control:'select',options:['base','primary','accent','neutral','inverse']},size:{control:'select',options:['small','medium','large','giant']},state:{control:'select',options:['default','hover','focused','pressed','disabled','skeleton']},decoration:{control:'select',options:['solid','dashed','dotted',null]}}} satisfies Meta<typeof ButtonLink>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Disabled:Story={args:{disabled:true}};
export const Skeleton:Story={args:{state:'skeleton'}};
export const States:Story={render:args=><div style={{overflowX:'auto',padding:8}}><table style={{borderSpacing:24}}><thead><tr><th>Color</th>{(['default','hover','focused','pressed','disabled','skeleton'] as const).map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{(['base','primary','accent','neutral','inverse'] as const).map(color=><tr key={color} style={{background:color==='inverse'?'var(--background-base-inverse)':undefined}}><th>{color}</th>{(['default','hover','focused','pressed','disabled','skeleton'] as const).map(state=><td key={state}><ButtonLink {...args} color={color} state={state} /></td>)}</tr>)}</tbody></table></div>};
export const Sizes:Story={render:args=><div style={{display:'flex',gap:24,alignItems:'center'}}>{(['small','medium','large','giant'] as const).map(size=><ButtonLink {...args} key={size} size={size}/>)}</div>};

export const InParagraph:Story={
 args:{typography:'inherit',iconRight:undefined},
 render:args=><div style={{maxWidth:480}}>
  <Typography data-testid="adaptive-paragraph" variant="subtitle" responsive strong style={{fontStyle:'italic'}}>
   Перед подписанием прочитайте <ButtonLink {...args} data-testid="paragraph-link">условия обработки документов и персональных данных</ButtonLink> и проверьте информацию.
  </Typography>
  <Typography variant="subtitle" responsive>
   <ButtonLink {...args} iconLeft="copy" iconRight="arrow-chevron-right" data-testid="paragraph-icon-link">Подробнее</ButtonLink>
  </Typography>
  <p>Самостоятельная ссылка: <ButtonLink size="large" iconRight="arrow-chevron-right" data-testid="fixed-link">Подробнее</ButtonLink></p>
 </div>
};

export const SkeletonSizes:Story={...Sizes,args:{state:"skeleton"}};
export const SkeletonInParagraph:Story={...InParagraph,args:{...InParagraph.args,state:"skeleton"}};
