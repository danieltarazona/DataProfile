export const onRequest: PagesFunction = async () => {
    return new Response("Hello from Cloudflare Functions!");
};
