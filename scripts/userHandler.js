function getUser(id) {
    return fetch('http://localhost:4030/api/user/GetUserDetail?id=' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            response.json().then(data => {})
        }
    });
}


function navigateToUser(event) {
    id = event.target.id || event.target.parentElement.id || event.target.parentElement.parentElement.id;
    location.replace('../my-profile.html?id=' + id);
}