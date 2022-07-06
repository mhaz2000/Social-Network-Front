function init() {
    fetch('http://localhost:4030/api/post/GetAllPosts', {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(result => {
                result.content.forEach(element => {
                    post = getData(element);
                    makePosts(post);
                });
            })
        }
    });
}

async function makePosts(input) {
    input.then(post => {
        container = document.getElementById('container');

        upperRow = document.createElement('div');
        upperRow.classList.add('row', 'j-center');

        postSection = document.createElement('div');
        postSection.classList.add('post');
        postSection.id = post.id;

        row = document.createElement('div');
        row.classList.add('row');
        row.addEventListener('click', navigateToUser);
        row.id = post.postOwnerId;


        profileImage = document.createElement('img');
        profileImage.classList.add('profile-image');
        profileImage.src = post.userAvatar ? URL.createObjectURL(post.userAvatar) : './images/unknow-user-image.png';

        postInfo = document.createElement('div');
        postInfo.classList.add('post-info');

        username = document.createElement('h4');
        username.innerHTML = (post.firstName || post.lastName) ? post.firstName + '' + post.lastName : post.username;

        time = document.createElement('p');
        time.innerHTML = post.time;

        imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.addEventListener('click', postDetail);


        postImage = document.createElement('img');
        postImage.classList.add('post-image');
        postImage.src = URL.createObjectURL(post.image);

        content = document.createElement('div');
        content.classList.add('content');
        content.addEventListener('click', postDetail);
        content.innerHTML = post.content;


        reactions = document.createElement('div');
        reactions.classList.add('reactions');

        likeComment = document.createElement('div');
        likeComment.classList.add('like-comment');

        comment = document.createElement('div');
        comment.classList.add('comment');

        icon = document.createElement('i');
        icon.classList.add('fa', 'fa-comment-o');

        commentSection = document.createElement('section');
        commentSection.classList.add('comment-count');
        commentSection.innerHTML = post.commentsCount;

        share = document.createElement('div');
        share.innerHTML = '<i class="fa fa-share-alt"></i><section>Share</section>';


        comment.appendChild(icon);
        comment.appendChild(commentSection);
        likeComment.appendChild(comment)
        reactions.appendChild(likeComment);
        reactions.appendChild(share);
        imageContainer.appendChild(postImage);
        postInfo.appendChild(username);
        postInfo.appendChild(time);
        row.appendChild(profileImage);
        row.appendChild(postInfo);
        postSection.appendChild(row);
        postSection.appendChild(imageContainer);
        postSection.appendChild(content);
        postSection.appendChild(reactions);
        upperRow.appendChild(postSection);
        container.appendChild(upperRow);
    });
}

async function getData(post) {
    image = await loadPostImage(post.image);
    userAvatar = null
    if (post.postOwnerAvatar)
        userAvatar = await loadPostImage(post.postOwnerAvatar);

    return {
        commentsCount: post.commentsCount,
        content: post.content,
        time: post.time,
        id: post.id,
        postOwnerId: post.postOwnerId,
        image: image,
        userAvatar: userAvatar,
        firstName: post.firstName,
        lastName: post.lastName,
        username: post.username
    }
}

function navigateToUser(event) {
    id = event.target.id || event.target.parentElement.id || event.target.parentElement.parentElement.id;
    location.replace('../my-profile.html?id=' + id);
}