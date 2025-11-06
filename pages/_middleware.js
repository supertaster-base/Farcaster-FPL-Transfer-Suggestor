// Force all routes to be dynamic (skip prerender)
export const config = {
  matcher: ["/((?!_next).*)"],
};

export default function middleware(req) {
  return;
}
