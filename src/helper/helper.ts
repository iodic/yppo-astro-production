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

  if ('free' === status) {
    validation = true;
  }

  if ('logged' === status) {

  }

  if ('paid' === status) {

  }

  return validation;
}


export async function checkUser() {
  const headers = new Headers();
  headers.append('Cookie', '_your_app_session=jaoKTfnguC5%2FgghMY%2F2WIq8bAaAaBt1mHbR%2BVHe5GDWKknL2e9zDj4XnS1SB%2Fy37qK%2BHeEMs99WRZnj7gCf9R9F5oiyoztbguX2cIfDUX7Qn2VHMjwcZNcxANSCnH%2Bh%2FmYVlrUyRLPUftI76uMfuC8IOFfJMxx0gfUtG5Ql5ZmqU%2Bmxfhvd1j9N9Cdla8FQJkWQ%2Bs0a6%2Flnhemuq55hzL5U%2FiPnKQrr4A3uH%2Bq3%2FjW9ScD6CICKZKCY%2FD1KFzpieANGi1epRLIkTmdK5ryT1%2BveRUSkJ994KjrwBvohAG0%2B%2Bkatq1zo8qGgkVXDyT9ppDke4w7o9MDB5aZxtxBlCQTnhMK7xRi0grNti%2BbSOmph0qj5ZEHRsxgh1Io47hsq2vtqchNUnEEzI--V57iKDxyk9ynr%2F8V--gWPPJm2qLW2QfK%2B2z1%2FIxA%3D%3D');


  const response = await fetch("https://yppousers.websitetotal.com/auth/logged_in.json", {method: 'GET',
  headers: headers,});
  const data = await response.json();
  console.log(data);
  return data;
}

export async function isPaid() {
  const data = await checkUser();
  if ('paid' === data.plan) {
    return true;
  }
  return false;
}

export async function isLoggedIn() {
  const data = await checkUser();
  if (data.logged_in) {
    return true;
  }
  return false;
}
