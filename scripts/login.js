function login() {
    var email = document.getElementById('email');
    var password = document.getElementById('password');


    error = hasError(email, password);
    document.getElementById('message').innerHTML = error;

    if (!error) {
        fetch('http://localhost:4030/api/user/loign', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    document.cookie = `token=Bearer ${data.content.authToken}`;
                    location.replace('../account-detail.html')
                })
            } else {
                response.json().then(data => {
                    document.getElementById('message').innerHTML = data.message;
                })
            }
        });
    }
}


function hasError(email, password) {
    var error = '';

    if (!email.value)
        error += '* Email can not be empty<br>';
    if (!password.value)
        error += '* Password can not be empty<br>';

    return error;
}

function clearMessages() {
    document.getElementById('message').innerHTML = '';
}

function load() {
    if (window.location.href.includes('isRegistered=true')) {
        document.getElementById('register-success').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('register-success').classList.toggle('fade');
        }, 1500);
    }
}