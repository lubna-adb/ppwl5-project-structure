export const htmlResponse = (html: string): Response => {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

export const redirect = (url: string): Response => {
  return new Response(null, {
    status: 302,
    headers: { Location: url },
  });
};