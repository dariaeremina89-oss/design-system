import { expect, test } from '@playwright/test';

test('library contains the expected component hierarchy and QA docs', async ({ request }) => {
  const response = await request.get('/index.json');
  expect(response.ok()).toBeTruthy();
  const index = await response.json();
  const entries = Object.values(index.entries) as { title: string; type: string; id: string }[];
  const titles = new Set(entries.map(entry => entry.title));
  for (const title of ["Components/Actions/Button","Components/Actions/ButtonFAB","Components/Actions/ButtonIcon","Components/Actions/ButtonLink","Components/Actions/ButtonToggle","Components/Actions/Link","Components/Inputs/CodeInput","Components/Inputs/Input","Components/Inputs/PhoneInput","Components/Inputs/PriceInput","Components/Inputs/Search","Components/Inputs/SingleFileInput","Components/Inputs/Textarea","Components/Selection/AsyncAutocomplete","Components/Selection/Autocomplete","Components/Selection/Checkbox","Components/Selection/CheckboxGroup","Components/Selection/Chips","Components/Selection/ChipsGroup","Components/Selection/Dropdown","Components/Selection/Multiselect","Components/Selection/Radio","Components/Selection/RadioGroup","Components/Selection/Select","Components/Selection/Switch","Components/Selection/SwitchGroup","Components/Navigation/Accordion","Components/Navigation/AccordionGroup","Components/Navigation/Breadcrumbs","Components/Navigation/Pagination","Components/Navigation/Tabs","Components/DateTime/Calendar","Components/DateTime/DatePicker","Components/DateTime/RangeCalendar","Components/Overlays/BottomSheet","Components/Overlays/Dialog","Components/Overlays/Tooltip","Components/Indicators/Badge","Components/Indicators/CircularProgress","Components/Indicators/LinearProgress","Components/Elements/Skeleton"]) {
    expect(titles.has(title), title).toBeTruthy();
  }
  expect([...titles].some(title => title.startsWith('Atoms/'))).toBeFalsy();
  for (const name of ['CircularProgress', 'LinearProgress', 'Badge']) {
    expect(entries.some(entry => entry.title === 'Components/Indicators/' + name && entry.type === 'docs')).toBeTruthy();
  }
});

test('Button Docs expose test coverage and selectors', async ({ page }) => {
  await page.goto('/iframe.html?id=components-buttons-button--docs&viewMode=docs');
  await expect(page.getByRole('heading', { name: 'Автотесты', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Селекторы для тестирования', exact: true })).toBeVisible();
});

