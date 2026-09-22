import type { PropsWithChildren } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { themes } from 'storybook/theming';
import { useColorMode } from '../src/styles/use-primary-theme';

/** Keep Storybook's own Markdown and API tables readable alongside themed components. */
export function ThemeDocsContainer(props:PropsWithChildren<DocsContainerProps>) {
  const mode=useColorMode();
  return <DocsContainer {...props} theme={mode==='dark'?themes.dark:themes.light}/>;
}
