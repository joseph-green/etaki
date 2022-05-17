import './_app.css';
import Head from 'next/head';

export default function BaseApp({ Component, pageProps}) {
  return [
          <Head>
            <link rel="shortcut icon" id='favicon' href="./favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>ETAKI</title>
          </Head>,
          <Component {...pageProps}/>]
}
