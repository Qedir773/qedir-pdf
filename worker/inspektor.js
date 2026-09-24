const INSPEKTOR_ORIGIN = "https://sandybrown-jellyfish-512142.hostingersite.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/inspektor" && !url.pathname.startsWith("/inspektor/")) {
      return env.ASSETS.fetch(request);
    }

    const upstreamUrl = new URL(url.pathname + url.search, INSPEKTOR_ORIGIN);
    const upstreamRequest = new Request(upstreamUrl, request);
    upstreamRequest.headers.set("X-Forwarded-Host", url.host);
    upstreamRequest.headers.set("X-Forwarded-Proto", url.protocol.slice(0, -1));

    const upstreamResponse = await fetch(upstreamRequest, { redirect: "manual" });
    const responseHeaders = new Headers(upstreamResponse.headers);
    const location = responseHeaders.get("Location");
    if (location) {
      const redirectUrl = new URL(location, upstreamUrl);
      if (redirectUrl.origin === INSPEKTOR_ORIGIN) {
        redirectUrl.protocol = url.protocol;
        redirectUrl.host = url.host;
        responseHeaders.set("Location", redirectUrl.toString());
      }
    }
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  },
};
