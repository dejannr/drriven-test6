// frontend/pages/_app.js
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import '../styles/resetstyle.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
