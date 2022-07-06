var fileId = '';

function SendDetailAccount() {
    var email = document.getElementById('email');
    var postcode = document.getElementById('postcode');
    var address = document.getElementById('address');
    var country = document.getElementById('country');
    var phone = document.getElementById('phone');
    var lastName = document.getElementById('lastName');
    var firstName = document.getElementById('firstName');
    var townOrCity = document.getElementById('townOrCity');
    var description = document.getElementById('description');

    fetch('http://localhost:4030/api/user/UpdateUserInfo', {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        },
        body: JSON.stringify({
            email: email.value,
            postcode: postcode.value,
            address: address.value,
            country: country.value,
            phoneNumber: phone.value,
            lastName: lastName.value,
            firstName: firstName.value,
            townOrCity: townOrCity.value,
            description: description.value,
            avatar: fileId
        })
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                location.replace(location.href.split('?')[0] + '?isDataUpdated=true');
            })
        } else {
            response.json().then(data => {})
        }
    });
}


function getUserInfo() {
    if (location.href.includes('isDataUpdated=true')) {
        document.getElementById('update-success').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('update-success').classList.toggle('fade');
        }, 1500);

    }
    var email = document.getElementById('email');
    var postcode = document.getElementById('postcode');
    var address = document.getElementById('address');
    var country = document.getElementById('country');
    var phone = document.getElementById('phone');
    var lastName = document.getElementById('lastName');
    var firstName = document.getElementById('firstName');
    var townOrCity = document.getElementById('townOrCity');
    var description = document.getElementById('description');

    var displayName = document.getElementById('display-name');
    var displayLocation = document.getElementById('display-location');


    fetch('http://localhost:4030/api/user/GetUserDetail', {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                email.value = data.content.email === null ? '' : data.content.email;
                postcode.value = data.content.postcode === null ? '' : data.content.postcode;
                address.value = data.content.address === null ? '' : data.content.address;
                country.value = data.content.country === null ? '' : data.content.country;
                phone.value = data.content.phone === null ? '' : data.content.phoneNumber;
                lastName.value = data.content.lastName === null ? '' : data.content.lastName;
                firstName.value = data.content.firstName === null ? '' : data.content.firstName;
                townOrCity.value = data.content.townOrCity === null ? '' : data.content.townOrCity;
                description.value = data.content.description === null ? '' : data.content.description;

                if (data.content.avatar)
                    loadPostImage(data.content.avatar).then(img => {
                        document.getElementById('uploaded-image').src = URL.createObjectURL(img);
                    });
                else
                    document.getElementById('uploaded-image').src = './images/unknow-user-image.png';

                if (firstName.value || lastName.value)
                    displayName.innerHTML = firstName.value + " " + lastName.value;


                if (country.value || townOrCity.value)
                    displayLocation.innerHTML = country.value + " " + townOrCity.value

            })
        } else {
            if (response.status == 401) {
                location.replace('../login.html');
            }
            response.json().then(data => {})
        }
    });
}