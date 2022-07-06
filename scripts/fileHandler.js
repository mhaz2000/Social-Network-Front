function loadPostImage(id) {
    return fetch('http://localhost:4030/api/file/' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            return response.blob();
        } else {
            response.json().then(data => {})
        }
    });
}

function upload() {
    var fileInput = document.getElementById('file');

    if (fileInput.value) {
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append("file", file);

        fetch('http://localhost:4030/api/file', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Authorization": document.cookie.split('=')[1]
            },
            body: file,
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    document.getElementById('uploaded-image').src = URL.createObjectURL(file);
                    fileId = data.content;
                })
            } else {
                response.json().then(data => {})
            }
        });
    }
}


function loadPostImageAsync(id) {
    return fetch('http://localhost:4030/api/file/' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            return response.blob();
        } else {
            response.json().then(data => {})
        }
    });
}