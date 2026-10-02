import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { componentQuality } from './quality';

const root = process.cwd();

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap(name => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe('component quality documentation', () => {
  it('keeps every quality contract connected to real tests and selectors', () => {
    for (const [name, item] of Object.entries(componentQuality) as Array<[string, { unit: string; browser?: string; selectors: Array<[string, string]> }]>) {
      expect(item.selectors.length, `${name}: selectors`).toBeGreaterThan(0);
      expect(existsSync(join(root, item.unit)), `${name}: ${item.unit}`).toBe(true);
      if (item.browser) {
        expect(existsSync(join(root, item.browser)), `${name}: ${item.browser}`).toBe(true);
      }
    }
  });

  it('keeps every component autodocs story documented with API and quality docs', () => {
    const stories = walk(join(root, 'src/components'))
      .filter(path => path.endsWith('.stories.tsx'));

    const failures: string[] = [];

    for (const path of stories) {
      const source = readFileSync(path, 'utf8');
      if (!source.includes('autodocs')) continue;

      const file = relative(root, path);
      const usesSharedProgressMeta = source.includes("from './progress-examples'");

      if (!usesSharedProgressMeta && !source.includes('qualityDocs(')) {
        failures.push(`${file}: missing qualityDocs`);
      }
      if (!usesSharedProgressMeta && !/description\s*:\s*\{\s*component\s*:/.test(source)) {
        failures.push(`${file}: missing component description`);
      }
      if (!/argTypes\s*:/.test(source)) {
        failures.push(`${file}: missing argTypes/API`);
      }
    }

    const sharedProgress = readFileSync(join(root, 'src/components/ProgressIndicator/progress-examples.tsx'), 'utf8');
    if (!sharedProgress.includes("qualityDocs('ProgressIndicator')")) {
      failures.push('src/components/ProgressIndicator/progress-examples.tsx: missing qualityDocs');
    }
    if (!/description\s*:\s*\{\s*component\s*:/.test(sharedProgress)) {
      failures.push('src/components/ProgressIndicator/progress-examples.tsx: missing component description');
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });
});
