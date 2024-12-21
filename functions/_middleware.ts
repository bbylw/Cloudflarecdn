export interface Env {
  TARGET_HOSTNAME: string;
}

export type Context = {
  request: Request;
  env: Env;
  next?: () => Promise<Response>;
}

export const onRequest = async (context: Context) => {
  const request = context.request;
  const url = new URL(request.url);
  
  const targetProtocol = url.protocol;
  url.hostname = context.env.TARGET_HOSTNAME;
  url.protocol = targetProtocol;
  
  const newHeaders = new Headers();
  
  const headersToKeep = [
    'accept',
    'accept-encoding',
    'accept-language',
    'user-agent',
    'content-type',
    'content-length',
    'range',
    'if-none-match',
    'if-modified-since',
    'cache-control',
    'pragma',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-ch-ua-platform'
  ];

  for (const header of headersToKeep) {
    const value = request.headers.get(header);
    if (value) {
      newHeaders.set(header, value);
    }
  }

  if (request.headers.get('origin')) {
    newHeaders.set('origin', `${targetProtocol}//${context.env.TARGET_HOSTNAME}`);
  }
  if (request.headers.get('referer')) {
    newHeaders.set('referer', `${targetProtocol}//${context.env.TARGET_HOSTNAME}${url.pathname}`);
  }
  
  const newRequest = new Request(url, {
    method: request.method,
    headers: newHeaders,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    redirect: 'manual'
  });

  const response = await fetch(newRequest);
  
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers()
  });

  response.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!['set-cookie', 'cf-ray', 'server', 'cf-cache-status', 'report-to', 'nel', 
        'alt-svc', 'x-robots-tag'].includes(lowerKey)) {
      newResponse.headers.set(key, value);
    }
  });

  const origin = request.headers.get('origin');
  if (origin) {
    newResponse.headers.set('access-control-allow-origin', origin);
    newResponse.headers.set('access-control-allow-credentials', 'true');
  }
  
  return newResponse;
} 