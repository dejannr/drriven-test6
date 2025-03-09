// frontend/pages/_app.js
import { SessionProvider } from "next-auth/react";
import BaseTemplate from "../components/BaseTemplate"; // import your layout
import '../styles/globals.css';
import '../styles/resetstyle.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <BaseTemplate>
        <Component {...pageProps} />
      </BaseTemplate>
    </SessionProvider>
  );
}

export default MyApp;
