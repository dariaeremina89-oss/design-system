import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog, type DialogProps } from './Dialog';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Typography } from '../Typography/Typography';
import { qualityDocs } from '../../docs/quality';
import { coreDocs } from '../../docs/core-components';

function Example(args: DialogProps) {
  const [open, setOpen] = useState(false);
  return <><Typography variant="caption">{args.variant ?? 'basic'} · {args.size ?? 'small'}. Откройте диалог для проверки клавиатуры и фокуса.</Typography>
    <Button onClick={() => setOpen(true)}>Открыть диалог</Button>
    <Dialog {...args} open={open} onClose={() => setOpen(false)} footer={<><Button onClick={() => setOpen(false)}>Продолжить</Button><Button color="secondary" onClick={() => setOpen(false)}>Отмена</Button></>} />
  </>;
}
const meta = {
  title: 'Components/Overlays/Dialog', component: Dialog, tags: ['autodocs', 'ready'],
  parameters: { docs: { description: { component: coreDocs('Dialog') + qualityDocs('Dialog') } } },
  args: { open: false, onClose: () => {}, title: 'Отправить документ?', size: 'small', variant: 'basic', children: <Typography>Проверьте данные перед отправкой. После подтверждения документ станет доступен получателю.</Typography> },
  argTypes: {
    open: { control: 'boolean', description: 'Управляемое открытие; примеры используют кнопку.' },
    onClose: { description: 'Запрос закрытия: close-button, escape или backdrop.' },
    title: { control: 'text', description: 'Заголовок и доступное имя.' },
    size: { control: 'select', options: ['small','medium','large'] },
    variant: { control: 'select', options: ['basic','image','module','scroll'] },
    footerAlign: { control: 'select', options: ['left','center','edges'] },
    children: { control: false, description: 'Основной контент.' }, footer: { control: false, description: 'Действия из готовых компонентов.' },
    image: { control: false, description: 'Изображение для Image.' }, initialFocusRef: { control: false, description: 'Начальная цель фокуса.' },
    closeOnEscape: { control: 'boolean' }, closeOnBackdrop: { control: 'boolean' }, closeLabel: { control: 'text' },
    'aria-describedby': { control: 'text' }, 'data-testid': { control: 'text', description: 'Корень и префикс селекторов частей.' },
  }, render: args => <Example {...args} />,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Medium: Story = { args: { size: 'medium' } };
export const Large: Story = { args: { size: 'large' } };
export const Form: Story = { args: { variant: 'module', title: 'Данные документа', children: <><Input label="Название" defaultValue="Договор"/><Select label="Статус" options={[{value:'draft',label:'Черновик'},{value:'ready',label:'Готов'}]} /></> } };
export const Scroll: Story = { args: { variant: 'scroll', title: 'Условия отправки', children: Array.from({length:12},(_,i)=><Typography key={i}>Раздел {i+1}. Проверьте данные получателя и вложенные документы перед отправкой.</Typography>) } };
export const ExplicitClose: Story = { args: { closeOnBackdrop: false, closeOnEscape: false, title: 'Требуется решение', children: <Typography>Закройте окно кнопкой или выберите действие. Клик по фону и Escape отключены.</Typography> } };

function NestedExample() {
  const [parent, setParent] = useState(false), [child, setChild] = useState(false);
  return <><Typography variant="caption">Вложенное подтверждение: Escape закрывает только верхний Dialog.</Typography>
    <Button onClick={() => { setParent(true); setChild(true); }}>Открыть вложенные диалоги</Button>
    <Dialog open={parent} onClose={() => setParent(false)} title="Редактирование" footer={<Button onClick={() => setChild(true)}>Открыть подтверждение</Button>}>
      <Typography>Основная задача остается открытой после закрытия подтверждения.</Typography>
      <Dialog open={child} onClose={() => setChild(false)} title="Подтверждение" footer={<Button onClick={() => setChild(false)}>Подтвердить</Button>}><Typography>Подтвердите изменение.</Typography></Dialog>
    </Dialog>
  </>;
}
export const Nested: Story = { render: () => <NestedExample/> };
