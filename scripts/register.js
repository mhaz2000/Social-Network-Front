function register() {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var matchPassword = document.getElementById('matchPassword');

    error = hasError(name, email, password, matchPassword);
    document.getElementById('message').innerHTML = error;

    if (!error) {
        fetch('http://localhost:4030/api/user/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value
            })
        }).then(response => {
            if (response.ok) {
                response.json().then(() => {
                    location.replace('http://127.0.0.1:5500/login.html?isRegistered=true')
                })
            } else {
                response.json().then(data => {
                    document.getElementById('message').innerHTML = data.message;
                })
            }
        });
    }
}


function hasError(name, email, password, matchPassword) {
    var error = '';

    if (!name.value)
        error += '* Name can not be empty<br>';
    if (!email.value)
        error += '* Email can not be empty<br>';
    if (!password.value)
        error += '* Password can not be empty<br>';
    if (password.value !== matchPassword.value)
        error += '* Password is not match<br>';

    return error;
}

function clearMessages() {
    document.getElementById('message').innerHTML = '';
}