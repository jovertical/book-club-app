interface ErrorPayload {
  error: string;
  message: string;
  statusCode?: number;
  [key: string]: unknown;
}

const send = async <T>(path: string, options: RequestInit) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_API_CLIENT_TOKEN}`, // TODO: this shouldn't be exposed here
      ...options.headers,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      ...(json as Partial<ErrorPayload>),
    };
  }

  return {
    ok: true,
    data: ('data' in json ? json.data : json) as T,
  };
};

export const get = <Body>(
  path: string,
  query: Record<string, string> = {},
  options: Omit<RequestInit, 'method'> = {},
) => {
  return send<Body>(path + '?' + new URLSearchParams(query), {
    method: 'GET',
    ...options,
  });
};

export const post = <Body>(
  path: string,
  data?: Record<string, unknown>,
  options: Omit<RequestInit, 'method' | 'body'> = {},
) => {
  return send<Body>(path, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
};
