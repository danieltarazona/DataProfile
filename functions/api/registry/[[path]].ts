export const onRequest: PagesFunction<{ DATAKITREACTCORE: Fetcher }> = async (context) => {
    const { request, env, params } = context;
    const registry = env.DATAKITREACTCORE;

    if (!registry) {
        return new Response(JSON.stringify({ error: 'Registry binding DATAKITREACTCORE not found' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // params.path is an array for [[path]].ts
    const pathParts = params.path as string[] || [];
    const path = pathParts.join('/');

    const url = new URL(request.url);
    const targetUrl = `https://registry.internal/${path}${url.search}`;

    console.log(`Forwarding to registry: ${targetUrl}`);

    try {
        const response = await registry.fetch(targetUrl, {
            method: request.method,
            headers: request.headers,
            body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined
        });

        return new Response(response.body, {
            status: response.status,
            headers: response.headers
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
