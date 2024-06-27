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
  return true; // Temporary change for a demo.

  if ("free" === status) {
    return true;
  }

  if (typeof localStorage !== "undefined") {
    const jwtToken = localStorage.getItem('yppo_user_auth');
    const jwt = jwtToken ? parseJwt(jwtToken) : null;

    if (preview) {
      if (jwt && jwt.user) {
        if (jwt.preview_access) {
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
