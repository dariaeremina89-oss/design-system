import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { componentDocs } from './bulk-components';
import { coreComponentDocs } from './core-components';
import { selectionDocs } from './selection-components';
import { dropzoneDocs, multipleFileInputDocs, singleFileInputDocs } from './file-upload';
import { fileRowDocs } from './file-row';
import { chipsDocs, chipsGroupDocs } from './chips';

const orderedHeadings = [
  'Назначение и применение',
  'Состав и анатомия',
  'API',
  'Варианты и состояния',
  'Геометрия и токены',
  'Поведение',
  'Адаптив',
  'Доступность',
  'Чеклист',
] as const;

const bulkNames = [
  'Autocomplete', 'AsyncAutocomplete', 'Highlight', 'Icon', 'InfoBlock', 'Multiselect', 'PhoneInput',
  'Checkbox', 'Radio', 'Switch', 'CheckboxGroup', 'RadioGroup', 'SwitchGroup',
  'Link', 'ButtonLink', 'ButtonToggle', 'Divider', 'Tooltip', 'Accordion', 'AccordionGroup',
  'Breadcrumbs', 'Tabs', 'Pagination',
] as const;

const selectionNames = ['Search', 'ItemRow', 'Menu', 'Dropdown', 'Select'] as const;

const allDocs: Array<[string, string]> = [
  ...Object.entries(coreComponentDocs),
  ...bulkNames.map(name => [name, componentDocs(name)] as [string, string]),
  ...selectionNames.map(name => [name, selectionDocs(name)] as [string, string]),
  ['Dropzone', dropzoneDocs],
  ['SingleFileInput', singleFileInputDocs],
  ['MultipleFileInput', multipleFileInputDocs],
  ['FileRow', fileRowDocs],
  ['Chips', chipsDocs],
  ['ChipsGroup', chipsGroupDocs],
];

function headings(markdown: string) {
  return [...markdown.matchAll(/^###\s+(.+)$/gm)].map(match => match[1].trim());
}

function storyFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return storyFiles(path);
    return entry.isFile() && entry.name.endsWith('.stories.tsx') ? [path] : [];
  });
}

describe('component documentation structure', () => {
  for (const [name, markdown] of allDocs) {
    it(`${name} follows the shared section order`, () => {
      const found = headings(markdown);
      expect(found[0]).toBe('Назначение и применение');
      expect(markdown).not.toMatch(/[ёЁ]/);
      expect(markdown).not.toMatch(/^##\s+/m);

      let lastIndex = -1;
      const seen = new Set<string>();
      for (const heading of found) {
        const index = orderedHeadings.indexOf(heading as typeof orderedHeadings[number]);
        expect(index, `${name}: unexpected heading "${heading}"`).toBeGreaterThanOrEqual(0);
        expect(index, `${name}: heading order for "${heading}"`).toBeGreaterThan(lastIndex);
        expect(seen.has(heading), `${name}: duplicate heading "${heading}"`).toBe(false);
        seen.add(heading);
        lastIndex = index;
      }
    });
  }

  it('component descriptions are not authored as raw markdown inside stories', () => {
    const files = storyFiles(join(process.cwd(), 'src/components'));
    const offenders = files.filter(path => {
      const source = readFileSync(path, 'utf8');
      return /description\s*:\s*\{\s*component\s*:\s*`/s.test(source)
        || /const\s+description\s*=\s*`/.test(source);
    });
    expect(offenders).toEqual([]);
  });
});
