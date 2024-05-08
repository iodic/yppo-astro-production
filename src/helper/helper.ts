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

export async function checkStatus(status: string) {
  let validation: boolean = false;

  if ("free" === status) {
    validation = true;
  }

  if ("logged" === status) {
    validation = false;
  }

  if ("paid" === status) {
    validation = false;
  }

  return validation;
}
