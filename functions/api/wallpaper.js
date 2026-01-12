export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const params = url.searchParams;
    const source = params.get('source');
    const action = params.get('action');

    if (source === 'self') {
        const apiUrl = 'https://bed.awovkj.com/random?type=img';
        return fetchAndProxy(apiUrl, false);
    } else if (source === '360') {
        if (action === 'categories') {
            const apiUrl = 'http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&from=360chrome&cid=36&start=0&count=8';
            return fetchAndProxy(apiUrl, true);
        } else if (action === 'list') {
            const cid = params.get('cid') || '36';
            const start = params.get('start') || '0';
            const count = params.get('count') || '8';
            const apiUrl = `http://cdn.apc.360.cn/index.php?c=WallPaper&a=getAppsByCategory&from=360chrome&cid=${cid}&start=${start}&count=${count}`;
            return fetchAndProxy(apiUrl, true);
        }
    } else if (source === 'bing') {
        const country = params.get('country') || '';
        let bingUrl = '';
        if (country === 'spotlight') {
            bingUrl = 'https://peapix.com/spotlight/feed?n=7';
        } else {
            bingUrl = `https://peapix.com/bing/feed?n=7&country=${country}`;
        }
        return fetchAndProxy(bingUrl, true);
    }

    return new Response(JSON.stringify({ code: 400, message: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
    });
}

async function fetchAndProxy(url, isJson = true) {
    try {
        const response = await fetch(url);
        
        if (isJson) {
            const data = await response.json();
            return new Response(JSON.stringify({ code: 200, data: data }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } else {
            const data = await response.text();
            return new Response(JSON.stringify({ code: 200, data: data }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ code: 500, message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
