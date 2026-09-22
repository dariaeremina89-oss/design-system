import type { MenuItem } from './Menu';
export const documentActions: MenuItem[] = [
  { id:'header', title:'Документ', variant:'header' },
  { id:'edit', title:'Редактировать', leadingIcon:'pencil' },
  { id:'copy', title:'Создать копию', description:'Сохранить содержимое в новом документе', leadingIcon:'copy', divider:true },
  { id:'disabled', title:'Отправить на подпись', description:'Добавьте получателя', disabled:true },
  { id:'download', title:'Скачать', helper:'PDF', trailingIcon:'arrow-chevron-right' },
];
