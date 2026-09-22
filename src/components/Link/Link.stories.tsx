import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { Typography } from '../Typography/Typography';
import { componentDocs } from '../../docs/bulk-components';
const meta={title:'Components/Actions/Link',component:Link,tags:['autodocs','ready'],parameters:{layout:'padded',docs:{description:{component:componentDocs('Link')}}},args:{text:'Подробнее',iconRight:'arrow-chevron-right',href:'#details'},argTypes:{typography:{control:'radio',options:['fixed','inherit'],description:'Постоянный размер или типографика окружающего текста'},color:{control:'select',options:['base','primary','accent','neutral','inverse']},size:{control:'select',options:['small','medium','large','giant']},state:{control:'select',options:['default','hover','focused','pressed','disabled','skeleton']},decoration:{control:'select',options:['solid','dashed','dotted',null]}}} satisfies Meta<typeof Link>;
export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={};
export const Disabled:Story={args:{disabled:true}};
export const Skeleton:Story={args:{state:'skeleton'}};
export const States:Story={render:args=><div style={{overflowX:'auto',padding:8}}><table style={{borderSpacing:24}}><thead><tr><th>Color</th>{(['default','hover','focused','pressed','disabled','skeleton'] as const).map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{(['base','primary','accent','neutral','inverse'] as const).map(color=><tr key={color} style={{background:color==='inverse'?'var(--background-base-inverse)':undefined}}><th>{color}</th>{(['default','hover','focused','pressed','disabled','skeleton'] as const).map(state=><td key={state}><Link {...args} color={color} state={state} /></td>)}</tr>)}</tbody></table></div>};
export const Sizes:Story={render:args=><div style={{display:'flex',gap:24,alignItems:'center'}}>{(['small','medium','large','giant'] as const).map(size=><Link {...args} key={size} size={size}/>)}</div>};

export const InParagraph:Story={
 args:{typography:'inherit',iconRight:undefined},
 render:args=><div style={{maxWidth:480}}>
  <Typography data-testid="adaptive-paragraph" variant="subtitle" responsive strong style={{fontStyle:'italic'}}>
   Перед подписанием прочитайте <Link {...args} data-testid="paragraph-link">условия обработки документов и персональных данных</Link> и проверьте информацию.
  </Typography>
  <Typography variant="subtitle" responsive>
   <Link {...args} iconRight="arrow-chevron-right" data-testid="paragraph-icon-link">Подробнее</Link>
  </Typography>
  <p>Самостоятельная ссылка: <Link href='#details' size="large" data-testid="fixed-link">Подробнее</Link></p>
 </div>
};

export const SkeletonSizes:Story={...Sizes,args:{state:"skeleton"}};
export const SkeletonInParagraph:Story={...InParagraph,args:{...InParagraph.args,state:"skeleton"}};
