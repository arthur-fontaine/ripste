const response = await fetch('http://localhost:3000/auth/oauth2/authorize', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    }),
})

console.log(response.status);
const data = await response.json();
console.log(data);