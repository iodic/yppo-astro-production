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
  return "A0USaYg7dVEdtVPztz5TBThpbOwk9xCqXKx2p9g0zwo";
}

export function getClientSecret(): string {
  return "B05vhMaEQvDLaS01NySCvjVzhZU5PlgwYhraiIP1lgw";
}

export function getRedirectUri(): string {
  return "https://yppo.websitetotal.com/callback/";
}

export function getTokenUri(): string {
  return "https://yppousers.websitetotal.com/oauth/token";
}

export function getBaseUri(): string {
  return "https://yppousers.websitetotal.com";
}
