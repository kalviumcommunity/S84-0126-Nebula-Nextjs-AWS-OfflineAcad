import '@testing-library/jest-dom';

// Next.js App Router route handlers import `next/server`, which expects
// WHATWG fetch globals (Request/Response/Headers) to exist.
// Jest's jsdom env doesn't always provide them, so we polyfill from undici.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const undici = require("undici");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g: any = globalThis;
g.Request = g.Request ?? undici.Request;
g.Response = g.Response ?? undici.Response;
g.Headers = g.Headers ?? undici.Headers;
