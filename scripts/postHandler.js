function postDetail(event) {
    id = event.target.parentElement.id || event.target.parentElement.parentElement.id;
    location.replace('/post-detail.html?id=' + id);
}


function getPost() {
    id = location.href.split('?id=')[1];
    fetch('http://localhost:4030/api/post/' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                getUserInfo(data.content.postOwnerId, data.content.time, data.content.currentUserAvatar,
                    data.content.postOwnerAvatar, data.content.postOwnerFirstName, data.content.postOwnerLastName,
                    data.content.postOwnerUsername);
                loadPostImage(data.content.image).then(img => {
                    document.getElementById('post-image').src = URL.createObjectURL(img);
                    getComments();
                });

                document.getElementById('content').innerHTML = data.content.content
            })
        } else {
            response.json().then(data => {})
        }
    });

    // getComments();
}

function getUserInfo(id, createdTime, userAvatar, postOwnerAvatar, postOwnerFirstName, postOwnerLastName,
    postOwnerUsername) {
    fetch('http://localhost:4030/api/user/GetUserDetail?userId=' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                userImage = document.getElementById('add-comment-user-image');
                postUserImage = document.getElementById('post-owner-image');

                userCommentInfo = document.getElementById('user-comment-info');
                postInfo = document.getElementById('post-info');

                userName = document.createElement('h4');
                commentUserName = document.createElement('h4');

                userName.innerHTML = (postOwnerFirstName || postOwnerLastName) ?
                    postOwnerFirstName + ' ' + postOwnerLastName : postOwnerUsername;

                commentUserName.innerHTML = (data.content.firstName || data.content.lastName) ?
                    data.content.firstName + ' ' + data.content.lastName : data.content.username;

                time = document.createElement('p');
                time.innerHTML = createdTime;

                if (userAvatar)
                    loadPostImage(userAvatar).then(img => {
                        userImage.src = URL.createObjectURL(img);
                    });
                else
                    userImage.src = './images/unknow-user-image.png';

                if (postOwnerAvatar)
                    loadPostImage(postOwnerAvatar).then(img => {
                        postUserImage.src = URL.createObjectURL(img);
                    });
                else
                    postUserImage.src = './images/unknow-user-image.png';


                postInfo.appendChild(userName);
                postInfo.appendChild(time);
                userCommentInfo.appendChild(commentUserName)
            });
        }
    });
}