export function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

export function getClientId(): string {
  return "bis6Y4b7REyhK-tt1-n98hG2ZnnlYZfNgKTWVWpUSbU";
}

export function getClientSecret(): string {
  return "weFWPtH6tBwgvyXCurj75CXH1qnQvBP2rQoQLFssNbU";
}

export function getRedirectUri(): string {
  return "https://dev.personalombuds.com/callback/";
}

export function getTokenUri(): string {
  return "https://users.personalombuds.com/oauth/token";
}

export function getBaseUri(): string {
  return "https://users.personalombuds.com";
}
