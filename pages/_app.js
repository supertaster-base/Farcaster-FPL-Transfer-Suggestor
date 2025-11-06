// pages/_app.js

import "../styles/globals.css";   // ✅ FIXED PATH

export const config = {
  runtime: "nodejs",
};

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
