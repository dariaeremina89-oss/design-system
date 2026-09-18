import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton as SkeletonBlock } from '../components/Skeleton/Skeleton';
import { Page } from './atoms-helpers';

const meta = {
  title: 'Atoms/Skeleton',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Общий атом загрузочного состояния. Skeleton поддерживает текстовые строки по типографическим стилям, блоки, круги и иконки; анимация и базовый цвет задаются централизованно. Используется только там, где интерфейс действительно ждет данные, и не является интерактивным элементом.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const textSizes = [
  'h0-heading',
  'h1-heading',
  'h2-heading',
  'h3-heading',
  'subtitle',
  'body',
  'caption',
  'overline',
] as const;

export const States: Story = {
  render: () => (
    <Page title="Skeleton">
      <div className="fdoc-atoms__section">
        {textSizes.map((textSize) => (
          <div key={textSize} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SkeletonBlock width="280px" shape="text" textSize={textSize} />
            <code>{textSize}</code>
          </div>
        ))}
        <SkeletonBlock width="100%" height="56px" />
        <SkeletonBlock width="48px" height="48px" shape="circle" />
        <SkeletonBlock width="24px" height="24px" shape="icon" />
      </div>
    </Page>
  ),
};
