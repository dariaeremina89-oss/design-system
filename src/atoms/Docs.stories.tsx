import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page } from './atoms-helpers';

const meta = {
  title: 'Atoms/Docs',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Это моя тестовая дизайн-система и личный плейбук для проверки токенов, компонентов и подходов к реализации F.Doc в React и Storybook. Это не официальная библиотека F.Doc и не production-пакет.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TokenHierarchy: Story = {
  render: () => (
    <Page title="Тестовый плейбук дизайн-системы">
      <p className="fdoc-atoms__note">
        Это учебно-практическая реализация для проверки решений перед переносом в рабочие проекты. Она не является официальной дизайн-системой F.Doc.
      </p>
      <p className="fdoc-atoms__note">
        The token architecture has two levels. Components consume semantic tokens but are not a separate token level.
      </p>
      <div className="fdoc-atoms__layer-grid">
        <div className="fdoc-atoms__layer-card">
          <strong>1 · Primitive</strong>
          <code>--white-1000</code>
          <span>Base color value</span>
        </div>
        <div className="fdoc-atoms__layer-arrow">→</div>
        <div className="fdoc-atoms__layer-card">
          <strong>2 · Semantic</strong>
          <code>--background-base-default</code>
          <span>Alias → --white-1000</span>
        </div>
      </div>
      <pre className="fdoc-atoms__code">{`--background-base-default: var(--white-1000);`}</pre>
    </Page>
  ),
};
