import { parseJwt } from "./auth";

export function sendAnalytics() {
  if (typeof localStorage !== "undefined") {
    const jwtToken = localStorage.getItem("yppo_user_auth");
    const jwt = jwtToken ? parseJwt(jwtToken) : null;

    if (jwt && jwt.user) {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          const dataToSend = {
            domain: jwt.user.domain,
            uri: window.location.href,
            ipAddress: data.ip
          };

          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://users.personalombuds.com/analytics', true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(dataToSend));

          xhr.onload = function() {
            if (xhr.status === 200) {
              console.log('Data sent successfully');
            } else {
              console.log('Error sending data');
            }
          };
        })
        .catch(error => {
          console.error('Error fetching IP address:', error);
        });
    } else {
      console.log('JWT token is missing or invalid');
    }
  }
}
