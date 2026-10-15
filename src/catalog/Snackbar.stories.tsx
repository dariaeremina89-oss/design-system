import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Snackbar, type SnackbarProps } from '../components/Snackbar/Snackbar';
import { SnackbarStack, type SnackbarItem } from '../components/Snackbar/SnackbarStack';
import { Button } from '../components/Button/Button';
import { Dialog } from '../components/Dialog/Dialog';
import { Link } from '../components/Link/Link';
import { snackbarDocs } from '../docs/snackbar';
import { qualityDocs } from '../docs/quality';

const meta = {
  title: 'Components/Elements/Snackbar', component: Snackbar, tags: ['autodocs', 'ready'],
  parameters: { layout: 'padded', docs: { description: { component: snackbarDocs + qualityDocs('Snackbar') } } },
  args: { text: 'Ссылка скопирована', type: 'default', size: 'small', direction: 'horizontal' },
  argTypes: { text: { control: 'text' }, type: { control: 'select', options: ['default', 'success', 'error'] },
    size: { control: 'select', options: ['small', 'medium'] }, direction: { control: 'select', options: ['horizontal', 'vertical'] },
    children: { control: false }, icon: { control: false }, onClose: { control: false }, closeLabel: { control: 'text' } },
} satisfies Meta<typeof Snackbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Types: Story = { render: args => <div style={{ display: 'grid', gap: 16 }}>{(['default', 'success', 'error'] as const).map((type, i) => <Snackbar {...args} key={type} type={type} text={['Ссылка скопирована', 'Сотрудник добавлен', 'Не удалось отправить данные'][i]} />)}</div> };
export const Sizes: Story = { render: args => <div style={{ display: 'grid', gap: 16 }}><Snackbar {...args} size="small" /><Snackbar {...args} size="medium" /></div> };
function Controlled({ action = false, close = false, ...args }: SnackbarProps & { action?: boolean; close?: boolean }) {
  const [open, setOpen] = useState(true);
  return <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
    <Button onClick={() => setOpen(true)}>Показать уведомление</Button>
    {open && <Snackbar {...args} onClose={close ? () => setOpen(false) : undefined}>
      {action && <Button size="small" color="inverse-primary" onClick={() => setOpen(false)}>Отменить</Button>}
    </Snackbar>}
  </div>;
}
export const WithAction: Story = { args: { text: 'Шаблон удален' }, render: args => <Controlled {...args} action /> };
export const WithClose: Story = { args: { text: 'Отчет формируется. Можно покинуть страницу' }, render: args => <Controlled {...args} close /> };
export const ActionAndClose: Story = { args: { size: 'medium', text: 'Шаблон перемещен в корзину' }, render: args => <Controlled {...args} action close /> };
export const Vertical: Story = { args: { direction: 'vertical', text: 'При отправке данных произошла ошибка. Повторите попытку', type: 'error' }, render: args => <Controlled {...args} action /> };
export const LongAction: Story = { args: { direction: 'vertical', text: 'Отчет сформирован', type: 'success', children: <Button size="small" color="inverse-primary">Посмотреть сформированный отчет</Button> } };
export const LongText: Story = { args: { type: 'error', direction: 'vertical', text: <>Не удалось выполнить действие. Попробуйте позже или обратитесь в техподдержку <Link href="mailto:support@fdoc.ru" color="inverse" typography="inherit">support@fdoc.ru</Link></> } };
export const UnbrokenText: Story = { args: { text: 'ОченьДлинноеНазваниеДокументаБезПробелов'.repeat(5), onClose: () => {} } };
export const CustomIcon: Story = { args: { icon: { name: 'info_circle' }, text: 'Начинаем подготовку отчета' } };
export const States: Story = { render: args => <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>{(['small', 'medium'] as const).map(size => <div key={size} style={{ display: 'grid', gap: 16, maxWidth: '100%' }}><strong>{size}</strong>{(['default', 'success', 'error'] as const).map(type => <Snackbar {...args} key={type} size={size} type={type} text="Результат действия" />)}<Snackbar {...args} size={size} direction="vertical" text="Шаблон перемещен в корзину"><Button size="small" color="inverse-primary">Отменить</Button></Snackbar></div>)}</div> };
function StackDemo({ label = 'Добавить уведомление', position = 'viewport' }: { label?: string; position?: 'container' | 'viewport' }) {
  const [items, setItems] = useState<SnackbarItem[]>([]);
  const next = useRef(0);
  const remove = (id: string) => setItems(current => current.filter(item => item.id !== id));
  return <div data-testid="snackbar-demo-container" style={position === 'container'
    ? { position: 'relative', height: 440, minWidth: 0, boxSizing: 'border-box', padding: 16, background: 'var(--background-base-secondary)', borderRadius: 'var(--radius-middle)' }
    : { minWidth: 0 }}>
    <Button onClick={() => { const id = String(++next.current); setItems(current => [...current, { id, text: `Шаблон ${id} удален`, children: <Button size="small" color="inverse-primary" onClick={() => remove(id)}>Отменить</Button> }]); }}>{label}</Button>
    <p>Скрывается через 5 секунд. Наведение и фокус приостанавливают таймер</p>
    <SnackbarStack items={items} onDismiss={remove} position={position} />
  </div>;
}
export const Stack: Story = { parameters: { docs: { description: { story: 'Стек страницы: 16 px от нижней границы области просмотра. Новые уведомления добавляются снизу, расстояние между ними 8 px.' } } }, render: () => <StackDemo /> };
export const InContainer: Story = { parameters: { docs: { description: { story: 'Стек внутри блока: 16 px от его нижнего края. Фон показывает границы контейнера.' } } }, render: () => <StackDemo position="container" /> };
export const InDialog: Story = { render: () => <DialogDemo /> };
function DialogDemo() {
  const [open, setOpen] = useState(false);
  return <><Button onClick={() => setOpen(true)}>Открыть диалог</Button><StackDemo label="Уведомление страницы" />
    <Dialog open={open} onClose={() => setOpen(false)} title="Работа с документами"><StackDemo label="Уведомление диалога" position="container" /></Dialog></>;
}
export const NarrowContainer: Story = { render: args => <div style={{ width: 288, maxWidth: '100%' }}><Snackbar {...args} size="medium" direction="vertical" text="Не удалось отправить документ. Повторите попытку" type="error"><Button size="small" color="inverse-primary">Отправить повторно</Button></Snackbar></div> };
