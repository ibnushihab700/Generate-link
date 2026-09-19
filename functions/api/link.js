export async function onRequestPost(context) {
    const { request, env } = context;
    const { url } = await request.json();

    if (!url) {
        return new Response(JSON.stringify({ error: "URL wajib diisi" }), { status: 400 });
    }

    // Generate ID acak 3-4 karakter saja (super pendek)
    const shortId = Math.random().toString(36).substring(2, 6);

    // Simpan ke database Cloudflare KV
    await env.LINK_DB.put(shortId, url);

    return new Response(JSON.stringify({ shortId }), {
        headers: { "Content-Type": "application/json" }
    });
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const urlParams = new URL(request.url).searchParams;
    const id = urlParams.get('r');

    if (!id) {
        return new Response(JSON.stringify({ error: "ID tidak ditemukan" }), { status: 400 });
    }

    // Ambil URL asli dari Cloudflare KV
    const targetUrl = await env.LINK_DB.get(id);

    return new Response(JSON.stringify({ targetUrl }), {
        headers: { "Content-Type": "application/json" }
    });
}
