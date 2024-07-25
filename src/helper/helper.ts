import { parseJwt } from "./auth";

export function calculateReadTime(content: any) {
  if (content && Array.isArray(content) && content.length > 0) {
    let fullText = "";
    content.forEach((text) => {
      if (text && text.children && text.children[0] && text.children[0].text) {
        fullText += text.children[0].text + " ";
      }
    });
    if (fullText.trim()) {
      const wordsPerMinute = 180;
      const words = fullText.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return minutes + " min";
    } else {
      return "1 min";
    }
  } else {
    return "1 min";
  }
}

export async function checkStatus(status: string, preview: boolean) {
  if ("free" === status) {
    return true;
  }

  if (typeof localStorage !== "undefined") {
    const jwtToken = localStorage.getItem("yppo_user_auth");
    const jwt = jwtToken ? parseJwt(jwtToken) : null;

    if (jwt && jwt.user) {
      if (jwt.user.kind === "business" && jwt.user.preview_org !== true) {
        return true;
      }
    }

    if (preview) {
      if (jwt && jwt.user) {
        if (jwt.user.plan === "preview_access" || jwt.user.preview_org === true) {
          return true;
        }
      }
    }

    if ("logged" === status) {
      if (jwt && jwt.user) {
        return true;
      }
    }

    if ("paid" === status) {
      if (jwt && jwt.user) {
        return jwt.user.plan === "paid";
      }
    }
  }

  return false;
}

export async function returnStatusMsg() {
  if (typeof localStorage !== "undefined") {
    const jwtToken = localStorage.getItem("yppo_user_auth");
    const jwt = jwtToken ? parseJwt(jwtToken) : null;

    if (jwt?.user?.plan === "paid") {
      return "paid";
    }

    if (jwt?.user?.plan === "free") {
      return "free";
    }
  }

  return "logged-out";
}

(function() {
  if (typeof localStorage !== "undefined") {
    const jwtToken = localStorage.getItem("yppo_user_auth");
    const jwt = jwtToken ? parseJwt(jwtToken) : null;

    if (jwt && jwt.user) {
      const data = {
        domain: jwt.user.domain,
        uri: window.location.href,
        ipAddress: window.location.hostname
      };

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://users.personalombuds.com/analytics', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));

      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log('Data sent successfully');
        } else {
          console.log('Error sending data');
        }
      };
    } else {
      console.log('JWT token is missing or invalid');
    }
  }
})();
