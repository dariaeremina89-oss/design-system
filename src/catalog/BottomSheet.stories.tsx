import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomSheet, type BottomSheetProps } from '../components/BottomSheet/BottomSheet';
import { Button } from '../components/Button/Button';
import { Typography } from '../components/Typography/Typography';
import { bottomSheetDocs } from '../docs/bottom-sheet';
import { qualityDocs } from '../docs/quality';

function TextBlock({ center = false }: { center?: boolean }) {
  return <div style={{display:'grid',gap:8,width:'100%',justifyItems:center?'center':'stretch'}}>
    <Typography as="h2" variant="h3-heading">Заголовок Bottom Sheet</Typography>
    <Typography>Основной текст Bottom Sheet, возможно, в несколько строк.</Typography>
  </div>;
}

function Demo({ args, buttons = 2, children }: { args: BottomSheetProps; buttons?: 0 | 1 | 2; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const footer = buttons === 0 ? undefined : <>
    <Button size="large" fullWidth onClick={() => setOpen(false)}>Продолжить</Button>
    {buttons === 2 && <Button size="large" color="secondary" fullWidth onClick={() => setOpen(false)}>Отмена</Button>}
  </>;
  return <div style={{minHeight:560,padding:16,boxSizing:'border-box',background:'var(--background-base-secondary)'}}>
    <Typography variant="caption">Bottom Sheet используется в мобильном интерфейсе.</Typography>
    <div style={{marginTop:16}}><Button onClick={() => setOpen(true)}>Открыть Bottom Sheet</Button></div>
    <BottomSheet {...args} open={open} onClose={() => setOpen(false)} footer={footer}>
      {children ?? <TextBlock center={args.align === 'center'}/>}
    </BottomSheet>
  </div>;
}

const meta = {
  title: 'Components/Overlays/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs', 'ready'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: bottomSheetDocs + qualityDocs('BottomSheet') } },
  },
  args: {
    open: false,
    onClose: () => {},
    scrim: true,
    align: 'left',
    closeOnScrim: true,
    closeOnEscape: true,
    swipeToClose: true,
    'aria-label': 'Дополнительная информация',
  },
  argTypes: {
    open: { control: false },
    onClose: { description: 'Запрос закрытия: scrim, escape или swipe.' },
    scrim: { control: 'boolean' },
    align: { control: 'radio', options: ['left', 'center'] },
    closeOnScrim: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    swipeToClose: { control: 'boolean' },
    children: { control: false },
    footer: { control: false },
    initialFocusRef: { control: false },
    'aria-label': { control: 'text' },
    'aria-labelledby': { control: 'text' },
    'aria-describedby': { control: 'text' },
    'data-testid': { control: 'text' },
  },
  render: args => <Demo args={args} />,
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Centered: Story = { args: { align: 'center' } };
export const OneButton: Story = { render: args => <Demo args={args} buttons={1} /> };
export const WithoutButtons: Story = { render: args => <Demo args={args} buttons={0} /> };

export const Scroll: Story = {
  render: args => <Demo args={args}>
    <TextBlock />
    {Array.from({length:12},(_,i)=><Typography key={i}>Дополнительный блок {i+1}. Контент прокручивается независимо от Handle и кнопок.</Typography>)}
  </Demo>,
  parameters: { storyCheck: 'При переполнении Content скроллится внутри, Handle и Buttons остаются на месте, Scrollbar появляется справа у края.' },
};

function NoScrimDemo(args: BottomSheetProps) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  return <div style={{minHeight:560,padding:16,boxSizing:'border-box',background:'var(--background-base-secondary)'}}>
    <Button onClick={() => setOpen(true)}>Открыть Bottom Sheet</Button>
    <div style={{marginTop:16}}><Button color="secondary" onClick={() => setCount(value => value + 1)}>Фоновое действие {count}</Button></div>
    <BottomSheet {...args} open={open} scrim={false} onClose={() => setOpen(false)}><TextBlock /></BottomSheet>
  </div>;
}
export const WithoutScrim: Story = {
  args: { scrim: false },
  render: args => <NoScrimDemo {...args} />,
  parameters: { storyCheck: 'Без Scrim фон остается доступным для взаимодействия.' },
};
