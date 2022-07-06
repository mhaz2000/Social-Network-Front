var fileId = '';
var isCurrentUser = true;

function getUser() {
    var friends = document.getElementById('friends');

    var email = document.getElementById('email');
    var name = document.getElementById('name');
    var description = document.getElementById('description');

    if (location.href.includes('?id=')) {
        userId = location.href.split('?id=')[1]
        url = 'http://localhost:4030/api/user?id=' + userId;
    } else
        url = 'http://localhost:4030/api/user';


    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                email.innerHTML = data.content.email;
                name.innerHTML = data.content.firstName || data.content.lastName ?
                    data.content.firstName + ' ' + data.content.lastName :
                    data.content.userName;

                setUserProfile(data.content.avatar);

                description.innerHTML = data.content.description || '';
                data.content.friends.forEach(element => {
                    makeFriends(element);
                });

                data.content.posts.forEach(element => {
                    makePosts({
                        id: element.id,
                        content: element.content,
                        image: element.image,
                        name: name.innerHTML,
                        time: element.time,
                        postOwnerAvatar: element.postOwnerAvatar
                    });
                });


                if (data.content.friends.length === 0) {
                    var noFriend = document.createElement('p');
                    noFriend.innerHTML = 'You have no friends!'
                    noFriend.style.color = '#adb5bd';
                    friends.appendChild(noFriend);
                }
            })
        } else {
            if (response.status == 401) {
                location.replace('../login.html');
            }
            response.json().then(data => {})
        }
    });
}


async function makeFriends(friendValue) {
    var friends = document.getElementById('friends');

    var friend = document.createElement('div');
    friend.classList.add('friend', 'd-flex');

    if (isCurrentUser) {
        var removeFriend = document.createElement('div');
        removeFriend.classList.add('remove-friend');
        removeFriend.innerHTML = 'remove friend';
        removeFriend.id = friendValue.id;
        removeFriend.addEventListener('click', removingFriend)
    }

    var friendInfo = document.createElement('div');
    friendInfo.classList.add('friend-info', 'd-flex');

    var image = document.createElement('img');
    image.classList.add('friend-image');
    if (friendValue.avatar) {
        result = await loadPostImage(friendValue.avatar)
        image.src = URL.createObjectURL(result);
    } else
        image.src = '../images/unknow-user-image.png';

    var name = document.createElement('h4');
    name.innerHTML = (friendValue.firstName || friendValue.lastName) ?
        friendValue.firstName + ' ' + friendValue.lastName : friendValue.username;


    friendInfo.appendChild(image);
    friendInfo.appendChild(name);
    friend.appendChild(friendInfo);
    if (isCurrentUser)
        friend.appendChild(removeFriend);
    friends.appendChild(friend);
}


async function makePosts(userPost) {
    var rightCol = document.getElementById('right-col');

    var post = document.createElement('div');
    post.classList.add('post');
    post.id = userPost.id;

    var row = document.createElement('div');
    row.classList.add('row', 'a-center');
    row.style.justifyContent = 'space-between'

    var userImage = document.createElement('img');
    userImage.classList.add('profile-image');
    if (userPost.postOwnerAvatar) {
        var imgResult = await loadPostImage(userPost.postOwnerAvatar);
        userImage.src = URL.createObjectURL(imgResult);
    } else
        userImage.src = './images/unknow-user-image.png';

    var userInfo = document.createElement('div');
    var name = document.createElement('h4');
    name.innerHTML = userPost.name;
    var time = document.createElement('p');
    time.innerHTML = userPost.time;

    var userGeneralInfo = document.createElement('div');
    userGeneralInfo.style.display = 'flex';

    if (isCurrentUser) {
        var deleteBtn = document.createElement('a');
        deleteBtn.classList.add('delete-post-btn');
        deleteBtn.innerHTML = 'Delete Post';
        deleteBtn.addEventListener('click', deletePost);
    }

    var imgContainer = document.createElement('div');
    imgContainer.classList.add('d-flex', 'j-center');
    imgContainer.addEventListener('click', postDetail);

    var postImage = document.createElement('img');

    var result = await loadPostImage(userPost.image);
    postImage.classList.add('post-image');
    postImage.src = URL.createObjectURL(result);


    var content = document.createElement('p');
    content.classList.add('content');
    content.innerText = userPost.content;
    content.addEventListener('click', postDetail);

    imgContainer.appendChild(postImage);
    userInfo.appendChild(name);
    userInfo.appendChild(time);

    userGeneralInfo.appendChild(userImage);
    userGeneralInfo.appendChild(userInfo);

    row.appendChild(userGeneralInfo);
    if (isCurrentUser)
        row.appendChild(deleteBtn);

    post.appendChild(row);
    post.appendChild(imgContainer);
    post.appendChild(content);

    rightCol.appendChild(post)
}


function post() {
    var content = document.getElementById('post-content');

    fetch('http://localhost:4030/api/post', {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        },
        body: JSON.stringify({
            content: content.value,
            image: fileId
        })
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                location.reload();
            })
        } else {
            response.json().then(data => {
                document.getElementById('message').innerHTML = data.message;
                document.getElementById('message').style.marginBottom = '10px';
            })
        }
    });
}


function deletePost(event) {
    var postId = event.target.parentElement.parentElement.id;

    fetch('http://localhost:4030/api/post/' + postId, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            response.json().then(data => {})
        }
    });
}

async function setUserProfile(id) {
    if (id) {
        var result = await loadPostImage(id);
        document.getElementById('user-profile').src = URL.createObjectURL(result);
    } else
        document.getElementById('user-profile').src = './images/unknow-user-image.png';

}


function checkUser() {
    if (location.href.includes('?id=')) {
        id = location.href.split('?id=')[1];
        fetch('http://localhost:4030/api/user/checkUser/' + id, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": document.cookie.split('=')[1]
            }
        }).then(response => {
            if (!response.ok) {
                btn = document.getElementById('follow-btn');
                document.getElementById('user-info-holder').removeChild(btn);


            } else {
                newPost = document.getElementById('new-post');
                document.getElementById('right-col').removeChild(newPost);
                isCurrentUser = false
            }
        });
    } else {
        btn = document.getElementById('follow-btn');
        document.getElementById('user-info-holder').removeChild(btn);
    }
}

function addFriend() {
    id = location.href.split('?id=')[1];

    fetch('http://localhost:4030/api/user/AddFriend/' + id, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            location.reload();
        }
    });
}

function removingFriend(event) {
    id = event.target.id;

    fetch('http://localhost:4030/api/user/removeFriend/' + id, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            location.reload();
        }
    });
}