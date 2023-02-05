import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content="The Healing Museum" />
        <meta
          property="og:description"
          content="Bringing you closer to the world of modern art!"
        />
        <meta
          property="og:image"
          content="https://the-healing-museum-makoto357.vercel.app/en/api/og"
        />

        <meta
          property="og:url"
          content="https://the-healing-museum-makoto357.vercel.app/en"
        />

        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="3194496490802957" />

        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modal-root"></div>
      </body>
    </Html>
  );
}
