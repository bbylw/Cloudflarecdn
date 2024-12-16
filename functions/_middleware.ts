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
  
  url.hostname = context.env.TARGET_HOSTNAME;
  
  const newRequest = new Request(url, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    redirect: 'manual'
  });

  return fetch(newRequest);
} 