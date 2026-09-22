import { useState } from 'react';
import { Button } from '../Button/Button';
import { Dropdown, type DropdownProps } from './Dropdown';

/** One handler demonstrates the same action from the desktop trigger and touch menu. */
export function HoverActionExample({disabled=false,...props}:Partial<Omit<DropdownProps,'children'>>) {
  const [result,setResult]=useState({text:'',count:0});
  return <div style={{display:'grid',justifyItems:'start',gap:24}}>
    <Dropdown {...props} trigger="hover" disabled={disabled}
      primaryAction={{id:'download-pdf',title:'Скачать PDF'}}
      items={[{id:'download-docx',title:'Скачать DOCX'},{id:'download-archive',title:'Скачать архив'},{id:'unavailable',title:'Скачать с приложениями',disabled:true}]}
      onAction={item=>setResult(previous=>({text:String(item.title),count:previous.count+1}))}>
      <Button iconRight="arrow-chevron-down" disabled={disabled}>Скачать PDF</Button>
    </Dropdown>
    <p role="status" style={{margin:0}}>{result.text?`${result.text} — выполнено: ${result.count}`:'Действие еще не выполнено'}</p>
    <Button color="secondary">Следующая кнопка</Button>
  </div>;
}
