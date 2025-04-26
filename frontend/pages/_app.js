// frontend/pages/_app.js
import { SessionProvider } from "next-auth/react";
import BaseTemplate from "../components/BaseTemplate";
import Script from "next/script";

import '../styles/globals.css';
import '../styles/resetstyle.css';
import '../styles/sidepanel.css';
import '../styles/rightpanel.css';
import '../styles/blogposts.css';
import '../styles/downpanel.css';
import '../styles/notification.css';
import '../styles/register.css';
import '../styles/login.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      {/* Load gtag.js */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5G5Z9JDLVV"
        strategy="afterInteractive"
      />
      {/* Initialize Google Analytics */}
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5G5Z9JDLVV', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      <SessionProvider session={session}>
        <BaseTemplate>
          <Component {...pageProps} />
        </BaseTemplate>
      </SessionProvider>
    </>
  );
}

export default MyApp;
