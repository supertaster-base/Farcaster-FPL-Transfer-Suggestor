// pages/_app.js

import "@/styles/globals.css";   // ✅ Load Tailwind + global styles

export const config = {
  runtime: "nodejs",
};

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
