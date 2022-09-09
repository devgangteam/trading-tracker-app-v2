import { AppProps } from 'next/app';
import Head from 'next/head';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { UserProvider } from '@auth0/nextjs-auth0';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>();

  useEffect(() => toggleColorScheme(localStorage.getItem('colorScheme') as ColorScheme || 'light'), []);
  useEffect(() => colorScheme && localStorage.setItem('colorScheme', colorScheme), [colorScheme]);

  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <UserProvider>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme || 'light'} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme }}
        >
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </ColorSchemeProvider>
    </UserProvider>
  );
}