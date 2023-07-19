export const removeQueries = (url: string) => {
  const idxToSlice = url.indexOf('?');
  if (idxToSlice > -1) {
    return url.slice(0, url.indexOf('?'));
  } else {
    return url;
  }
};

interface GetLastPathOptions {
  includeQueries: boolean;
}
export const getLastPath = (url: string, options?: GetLastPathOptions) => {
  let urlToReturn = url;
  let lastIdx = urlToReturn.lastIndexOf('/');
  if (lastIdx === urlToReturn.length - 1) {
    urlToReturn = urlToReturn.slice(0, lastIdx);
    lastIdx = urlToReturn.lastIndexOf('/');
  }
  if (urlToReturn.lastIndexOf('/') > -1) {
    const lastPath = urlToReturn.split('/').pop();

    if (lastPath)
      return options?.includeQueries ? lastPath : removeQueries(lastPath);
    return urlToReturn;
  }
  return urlToReturn;
};

interface ReturnUrl {
  delete: (name: string) => ReturnUrl;
  set: (name: string, value: string | number) => ReturnUrl;
  path: () => string;
  href: () => string;
}
export const handleUrl = (_href?: string | null): ReturnUrl => {
  const href = _href || window.location.href;
  const url = new URL(href);
  const urlSearchParams = new URLSearchParams(url.search);
  return {
    delete: (name: string) => {
      urlSearchParams.delete(name);
      const searchEncoded = urlSearchParams.toString();

      return handleUrl(
        `${url.origin}${url.pathname}${
          searchEncoded ? `?${decodeURIComponent(searchEncoded)}` : ''
        }`
      );
    },
    set: (name: string, value: string | number) => {
      urlSearchParams.set(name, String(value));
      const searchEncoded = urlSearchParams.toString();

      return handleUrl(
        `${url.origin}${url.pathname}${
          searchEncoded ? `?${decodeURIComponent(searchEncoded)}` : ''
        }`
      );
    },
    path: () => {
      return `${url.pathname}${url.search}`;
    },
    href: () => href,
  };
};
