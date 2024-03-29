/* eslint-disable import/no-unresolved */
import { Global, css } from "@emotion/react";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "../components/Layout";
import { AuthContextProvider } from "../context/AuthContext";
import { ThemeColorContextProvider } from "../context/ColorContext";
import ErrorBoundary from "../components/ErrorBoundary";
import type { AppProps } from "next/app";
const queryClient = new QueryClient();

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const GlobalStyles = css`
  * {
    box-sizing: border-box;
    cursor: none;
  }

  @media screen and (max-width: 950px) {
    * {
      cursor: initial;
    }
  }
  body {
    position: relative;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 1rem;
    background: #eeece5;
    color: #000000;
    font-weight: 500;
    text-align: justify;
    -webkit-font-smoothing: antialiased;
  }
  a {
    color: inherit;
    text-decoration: none;
    outline: none;
    &:link {
      text-decoration: none;
    }
    &:visited {
      text-decoration: none;
    }
    &:hover {
      text-decoration: none;
    }
    &:active {
      text-decoration: none;
    }
  }
  ::-moz-selection {
    color: white;
    background: black;
  }

  ::selection {
    color: white;
    background: black;
  }

  /* Toastify Style */
  .Toastify__toast {
    border-radius: 0 !important;
    font-family: "Source Sans Pro", sans-serif !important;
    color: black !important;
  }
  .Toastify__progress-bar {
    background: rgba(0, 0, 0, 0.3) !important;
  }

  /* Swiper.js Button Style */
  .swiper-button-next,
  .swiper-button-prev {
    color: #bbb6ac !important;
  }
`;

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <AuthContextProvider>
          <ThemeColorContextProvider>
            <Head>
              <title>The Healing Museum</title>
              <link
                rel="icon"
                href="/healing-museum-website-favicon-black.ico"
              />
              <link rel="preconnect" href="https://fonts.googleapis.com"></link>
              <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="true"
              ></link>
            </Head>
            <ChakraProvider>
              <Global styles={GlobalStyles} />
              <Layout>
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </Layout>
            </ChakraProvider>
          </ThemeColorContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);
