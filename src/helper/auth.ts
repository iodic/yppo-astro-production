export function handleAuthCallback(clientId: string, clientSecret: string, redirectUri: string, tokenUri: string) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");

  if (code) {
    exchangeCodeForToken(code, clientId, clientSecret, redirectUri, tokenUri);
  } else {
    console.error("Error: Authorization code not received.");
  }
}

export function exchangeCodeForToken(code: string, clientId: string, clientSecret: string, redirectUri: string, tokenUri: string) {
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  const body = `grant_type=authorization_code&code=${code}&redirect_uri=${encodedRedirectUri}&client_id=${clientId}&client_secret=${clientSecret}`;

  fetch(tokenUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Token received:", data);
      saveResponseInCookie(data);
      const userInfo = parseJwt(data.access_token);
      console.log(userInfo);
    })
    .catch((error) => {
      console.error("Error exchanging token:", error);
    });
}

export function saveResponseInCookie(response: any) {
  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));
  const expires = expirationDate.toUTCString();
  document.cookie = `yppoJWT=${JSON.stringify(response)}; expires=${expires}; path=/`;
}

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
