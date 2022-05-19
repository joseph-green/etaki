import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {


    

    return (
        <Html lang='en'>
            <Head>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#000000" />
                <meta
                name="description"
                content="Web site created using create-react-app"
                />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="manifest" href="/manifest.json" />
                <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                crossOrigin="anonymous"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>

    )
}
