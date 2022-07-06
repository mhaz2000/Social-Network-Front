function getComments() {
    var id = location.href.split('?id=')[1];

    fetch('http://localhost:4030/api/comment/' + id, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            "Authorization": document.cookie.split('=')[1]
        }
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                data.content.forEach(element => {
                    getCommentData(element).then(t => {
                        makeComment(t);
                    });
                });
            })
        } else {
            response.json().then(data => {})
        }
    });
}

function sendComment() {
    var postId = location.href.split('?id=')[1];

    var commentContent = document.getElementById('comment').value.trim();
    console.log(commentContent);
    if (!commentContent)
        document.getElementById('message').innerHTML = 'Comment cannot be empty!';
    else {
        fetch('http://localhost:4030/api/comment', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": document.cookie.split('=')[1]
            },
            body: JSON.stringify({
                content: commentContent,
                postId: postId
            })
        }).then(response => {
            if (response.ok) {
                location.reload();
            } else {
                response.json().then(data => {})
            }
        });
    }
}


async function makeComment(comment) {
    commentSection = document.getElementById('comment-section');

    comments = document.createElement('div');
    comments.classList.add('comments');

    row = document.createElement('div');
    row.classList.add('row', 'user-comment-info');

    commentProfileImage = document.createElement('img');
    commentProfileImage.classList.add('comment-profile-image');
    if (comment.image)
        commentProfileImage.src = URL.createObjectURL(comment.image);
    else
        commentProfileImage.src = './images/unknow-user-image.png';

    userCommentInformation = document.createElement('div');
    userCommentInformation.classList.add('user-comment-info');

    commentUsername = document.createElement('h4');
    commentTime = document.createElement('p');
    commentUsername.innerHTML = (comment.firstName || comment.lastName) ? comment.firstName + ' ' + comment.lastName : comment.username
    commentTime.innerHTML = comment.time;


    commentContent = document.createElement('div');
    commentContent.classList.add('comment-content');
    commentContent.innerHTML = comment.content;

    reaction = document.createElement('div');
    reaction.classList.add('reactions', 'comment-reaction');

    likeComment = document.createElement('div');
    likeComment.classList.add('like-comment');


    like = document.createElement('div');
    like.classList.add('like');

    icon = document.createElement('i');
    // icon.classList.add('fa', 'fa-thumbs-o-up');

    likeCount = document.createElement('section');
    likeCount.classList.add('like-count');


    userCommentInformation.appendChild(commentUsername);
    userCommentInformation.appendChild(commentTime);
    row.appendChild(commentProfileImage);
    row.appendChild(userCommentInformation);
    // like.appendChild(icon);
    like.appendChild(likeCount);
    likeComment.appendChild(like);
    reaction.appendChild(likeComment);
    comments.appendChild(row);
    comments.appendChild(commentContent);
    comments.appendChild(reaction);
    commentSection.appendChild(comments);

}

function clearInput() {
    document.getElementById('message').innerHTML = '';
}

async function getCommentData(comment) {
    username = (comment.firstName || comment.lastName) ? comment.firstName + ' ' + comment.lastName : comment.userName;
    image = await loadPostImage(comment.avatar);

    return {
        username: username,
        image: image,
        time: comment.time,
        firstName: comment.firstName,
        lastName: comment.lastName,
        content: comment.content
    }

}