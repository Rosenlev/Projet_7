window.addEventListener('load', async () =>{
    // Fetches URL parameters
    const postId =  window.location.search.split('?')[1];
    const urlPost = `http://localhost:4000/post/${postId}`
    const urlProfile = `http://localhost:4000/user/me`
    const urlLike = `http://localhost:4000/post/${postId}/like`
    const urlComment = `http://localhost:4000/post/${postId}/comment`
    const urlComments = `http://localhost:4000/post/${postId}/comments`
    const token = 'Bearer ' + sessionStorage.getItem('token') // Fetches localStorage token

    let postUserId;
    let userId;


    // GET POST
    // Displays post
    const displayPost = async () => {
        try {
            const userData = await getData(urlProfile) // Fetches user's data
            userId = userData.id;
            const postData = await getData(urlPost) // Fetches post's data
            const {username, content, avatar, imageUrl } = postData
            postUserId = postData.userId
            const date = postData.updatedAt // Fetches post's time
            const postDate = convertDate(date) // Converts date into 24H format
            renderPost(username, avatar, imageUrl, content, postDate, postUserId, userId) //Display settings
            const likeData = await getData(urlLike) // Fetches like's data
            const { userIdLiked } = likeData
            await isLiked(userIdLiked) // Like function           
        } catch (err) {
            throw err;
        }
    }
    // Depending on user's status, renders the post
    const renderPost = (username, avatar, imageUrl, postContent, postDate, postUserId, userId) => {
        const section = document.getElementById('post');
        const article = document.createElement('article');
        if(imageUrl === null) { // there's no image in the post
            if ( postUserId === userId) { // user wrote the post
                article.innerHTML = `
                <div class="post">
                    <p class="username"><img src="${avatar}" id="avatar">${username}</p>
                    <form class="content">
                        <textarea>${postContent}</textarea>
                        <button type="submit" class="validbtn" id="btn">Modifier</button>
                        <div>
                            <i class="fas fa-heart"></i>
                        </div>  
                    </form>
                    <p class="date">${postDate}</p>
                    <i class="fas fa-times"></i>
                </div>`              
            } else { // someone else wrote the post
                article.innerHTML = `
                <div class="post">
                    <p class="username"><img src="${avatar}" id="avatar">${username}</p>
                    <div class="content">
                        <p>${postContent}</p>
                        <div>
                            <i class="fas fa-heart"></i>
                        </div>  
                    </div>
                    <p class="date">${postDate}</p>
                </div>
                ` 
            }
        } else { // there's a picture in the post
            if (postUserId === userId) { // user wrote the post
                article.innerHTML = `
                <div class="post">
                    <p class="username"><img src="${avatar}" id="avatar">${username}</p>
                    <form class="content">
                        <textarea>${postContent}</textarea>
                        <img src="${imageUrl}">
                        <input type="file" name="image">
                        <button type="submit" class="validbtn" id="btn">Modifier</button>  
                        <div>
                            <i class="fas fa-heart"></i>
                        </div>  
                    </form>
                    <p class="date">${postDate}</p>
                    <i class="fas fa-times"></i>
                </div>`
            } else { // someone else wrote the post
                article.innerHTML = `
                <div class="post">
                    <p class="username"><img src="${avatar}" id="avatar">${username}</p>
                    <div class="content">
                        <p>${postContent}</p>
                        <img src="${imageUrl}">
                        <div>
                            <i class="fas fa-heart"></i>
                        </div>  
                    </div>
                    <p class="date">${postDate}</p>
                </div>`
            }
        }
        section.appendChild(article)
    }
    //European date format
    const convertDate = (date) => {
        const engDate = date.split('T')[0].split('-')
        const hour = date.split('T')[1].split('.')[0]
        let frDate = []
        for( let i = engDate.length - 1 ; i >= 0; i-- ) {
            frDate.push(engDate[i])
        }
        frDate = frDate.join('-')
        const message = frDate + ', ' + hour
        return message
    }
    // CRUD
    // Fetches data
    const getData = async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': token
                }
            })
            return await response.json()
        } catch (err) {
            throw new Error
        }
    }
    // Sends data to server
    const postData = async (url, data) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                method: 'POST',
                body: JSON.stringify(data)
            })
            return await response.json()
        } catch (err) {
            throw err;
        }
    }
    // Updates data 
    const updateFormData = async (url, formData) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': token
                },
                method: 'PUT',
                body: formData
            })
            return await response.json();   
            // return response     
        } catch (err) {
            throw new Error(err)
        }
    }
    // Delete data
    const deleteData = async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                method: 'DELETE'
            })
            return await response.json()
        } catch (err) {
            throw err;
        }
    }
    // Like a post
    const isLiked = async (userIdLiked) => {
        try {
            const like = document.querySelector('.fa-heart')
            if (userIdLiked) like.classList.add('like')
            let liked;
            like.addEventListener('click', async () => {
                if (!userIdLiked) { // User hasn't liked a post yet
                    if (!like.className.includes('like')) { 
                        like.classList.add('like')
                        liked = { like: 1}
                        const data = await postData(urlLike, liked)
                        console.log(data.message)                
                    } else {
                        like.classList.remove('like')
                        const data = await deleteData(urlLike)
                        console.log(data.message)
                    }
                } else {
                        like.classList.remove('like')
                        const data = await deleteData(urlLike)
                        console.log(data.message)
                } 
            })
        } catch (er) {
            throw err
        }

    }
    await displayPost()
    if (postUserId === userId) { // User wrote the post


        // UPDATE POST
        // Displays image if a new file is selected
        const fileField = document.querySelector('input[type=file]')
        const content = document.querySelector('textarea')
        const updateBtn = document.getElementById('btn')
        const deleteBtn = document.querySelector('.fa-times')
        // Displays chosen picture
        if (fileField !== null) {
            function readUrl(input) {
                if (input.files && input.files[0]) {
                    const reader = new FileReader()
                    reader.addEventListener('load', (e) => {
                        const img = document.querySelector('.content img')
                        img.src = e.target.result
                    })
                    reader.readAsDataURL(input.files[0]);
                }
            }
            fileField.addEventListener('change', function() {
                readUrl(this)
            }) 
        }
        // Allows post modification by user
        updateBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            let post = { // User data
                content: content.value
            }
            const formData = new FormData()
            if (fileField !== null && fileField.files[0] ) {
                formData.append('image', fileField.files[0])
            } 
            formData.append('post', JSON.stringify(post))  
            await updateFormData(urlPost, formData) // Updates user's data and sends to server
            window.location.reload(true)
        }) 


        // DELETE POST
        // Deletes user's post
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await deleteData(urlPost);
            window.location = 'index.html';
        })         
    }
 

    // COMMENT  
    // Render comment form
    const renderCommentForm = () => {
        const section = document.getElementById('post');
        const form = document.createElement('form');
        form.setAttribute('id', 'comment');
        form.innerHTML = `
        <textarea cols="30" rows="1" placeholder="Votre commentaire..."></textarea>
        <i class="far fa-paper-plane"></i>`
        section.appendChild(form);        
    }
    // Render posted comments
    const renderComments = (avatar, username, commentDate, content) => {
        const section = document.getElementById('post')
        const div = document.createElement('div')
        div.setAttribute('class', 'comment')
        div.innerHTML += `
            <p class="username"><img src="${avatar}" id="avatar">${username} <span>${commentDate}</p>
            <div>
                <p>${content}</p>
            </div>
            <i class="fas fa-times"></i>
        ` 
        section.appendChild(div)
    }
    // Delete comments
    const deleteComment = async (url, id) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                method: 'DELETE',
                body: JSON.stringify(id)
            })
            return await response.json()
        } catch (err) {
            throw err;
        }
    }
    // Displays comments under a post
    const displayComment = async () => {
        renderCommentForm()
        const btn = document.querySelector('.fa-paper-plane') 
        // Creates a new comment
        btn.addEventListener('click', async () => { 
            const comment = document.querySelector('#comment textarea')      
            const commentContent = {
                content: comment.value
            }
            await postData(urlComment, commentContent) // 
            location.reload(true)
        })
        const comments = await getData(urlComments) // Fetches comments' data
        for(let i = 0; i < comments.length ; i++) { 
            const { avatar, username, content } = comments[i]
            const date = comments[i].updatedAt // Fetches post's date
            const commentDate = convertDate(date) // European date format
            const commentId = {id: comments[i].id}
            renderComments(avatar, username, commentDate, content)
            const deleteBtn = document.querySelectorAll('.comment .fa-times')
            deleteBtn[i].addEventListener('click', async (e) => {
                e.stopPropagation()
                if (postUserId === userId) {
                    await deleteComment(urlComment, commentId)
                    location.reload(true)                    
                } else {
                    console.log('You are not allowed to delete this comment.')
                }
            })
        }
    }
    displayComment()
})