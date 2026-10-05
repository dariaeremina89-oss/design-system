export const componentDocSectionOrder = [
  'purpose',
  'anatomy',
  'api',
  'variants',
  'geometry',
  'behavior',
  'responsive',
  'accessibility',
  'checklist',
] as const;

export type ComponentDocSection = typeof componentDocSectionOrder[number];

export type ComponentDocSections = {
  purpose: string;
  anatomy?: string;
  api?: string;
  variants?: string;
  geometry?: string;
  behavior?: string;
  responsive?: string;
  accessibility?: string;
  checklist?: string | readonly string[];
};

const sectionTitles: Record<ComponentDocSection, string> = {
  purpose: 'Назначение и применение',
  anatomy: 'Состав и анатомия',
  api: 'API',
  variants: 'Варианты и состояния',
  geometry: 'Геометрия и токены',
  behavior: 'Поведение',
  responsive: 'Адаптив',
  accessibility: 'Доступность',
  checklist: 'Чеклист',
};

function renderValue(value: string | readonly string[]) {
  if (Array.isArray(value)) return value.map(item => `- ${item}`).join('\n');
  return value.trim();
}

/**
 * Единый каркас описаний компонентов Storybook.
 * Разделы опциональны, но всегда выводятся в одном порядке.
 */
export function componentDoc(sections: ComponentDocSections): string {
  return componentDocSectionOrder
    .flatMap(section => {
      const value = sections[section];
      if (!value || (Array.isArray(value) && value.length === 0)) return [];
      return [`### ${sectionTitles[section]}\n\n${renderValue(value)}`];
    })
    .join('\n\n');
}
