window.addEventListener('load', async () =>{
    // Recupere les paramètres de l'url
    const postId =  window.location.search.split('?')[1];
    const urlPost = `http://localhost:4000/post/${postId}`
    const urlProfile = `http://localhost:4000/user/me`
    const urlLike = `http://localhost:4000/post/${postId}/like`
    const urlComment = `http://localhost:4000/post/${postId}/comment`
    const urlComments = `http://localhost:4000/post/${postId}/comments`
    const token = 'Bearer ' + sessionStorage.getItem('token') // Récupère le token stocké dans local storage

    let postUserId;
    let userId;


    // GET POST
    // Permet d'afficher le post
    const displayPost = async () => {
        try {
            const userData = await getData(urlProfile) // Récupère les données de l'utilisateur
            userId = userData.id;
            const postData = await getData(urlPost) // Récupère les données du post
            const {username, content, avatar, imageUrl } = postData
            postUserId = postData.userId
            const date = postData.updatedAt // Récupère la date du post actuel
            const postDate = convertDate(date) // Convertis la date en format français
            renderPost(username, avatar, imageUrl, content, postDate, postUserId, userId) //Rend visuellement le post
            const likeData = await getData(urlLike) // Récupère les données du like
            const { userIdLiked } = likeData
            await isLiked(userIdLiked) // Permet d'aimer un post            
        } catch (err) {
            throw err;
        }
    }
    // Selon status de l'utilisateur , permet de rendre visuellement le post
    const renderPost = (username, avatar, imageUrl, postContent, postDate, postUserId, userId) => {
        const section = document.getElementById('post');
        const article = document.createElement('article');
        if(imageUrl === null) { // le post ne possède pas d'image 
            if ( postUserId === userId) { // l'utilisateur est celui qui a écrit le post
                article.innerHTML = `
                <div class="post">
                    <p class="username"><img src="${avatar}" id="avatar">${username}</p>
                    <form class="content">
                        <textarea>${postContent}</textarea>
                        <button type="submit" class="validbtn" id="btn">Modifier</button>
                        <div>
                            <i class="far fa-thumbs-up"></i>
                        </div>  
                    </form>
                    <p class="date">${postDate}</p>
                    <i class="fas fa-times"></i>
                </div>`              
            } else { // l'utilisateur n'est pas celui qui a écrit le post
                article.innerHTML = `
                <div class="post">
                    <p class="username"><img src="${avatar}" id="avatar">${username}</p>
                    <div class="content">
                        <p>${postContent}</p>
                        <div>
                            <i class="far fa-thumbs-up"></i>
                        </div>  
                    </div>
                    <p class="date">${postDate}</p>
                </div>
                ` 
            }
        } else { // le post possède une image
            if (postUserId === userId) { // l'utilisateur est celui qui a écrit le post
                article.innerHTML = `
                <div class="post">
                    <p class="username"><img src="${avatar}" id="avatar">${username}</p>
                    <form class="content">
                        <textarea>${postContent}</textarea>
                        <img src="${imageUrl}">
                        <input type="file" name="image">
                        <button type="submit" class="validbtn" id="btn">Modifier</button>  
                        <div>
                            <i class="far fa-thumbs-up"></i>
                        </div>  
                    </form>
                    <p class="date">${postDate}</p>
                    <i class="fas fa-times"></i>
                </div>`
            } else { // l'utilisateur n'est pas celui qui a écrit le post
                article.innerHTML = `
                <div class="post">
                    <p class="username"><img src="${avatar}" id="avatar">${username}</p>
                    <div class="content">
                        <p>${postContent}</p>
                        <img src="${imageUrl}">
                        <div>
                            <i class="far fa-thumbs-up"></i>
                        </div>  
                    </div>
                    <p class="date">${postDate}</p>
                </div>`
            }
        }
        section.appendChild(article)
    }
    // Convertir date en format français
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
    // CRUD OPERATION
    // Récupère données
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
    // Envoie données au serveur
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
    // Modifie la ou les donnée(s) 
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
    // Supprime donnée
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
    // Permet d'aimer un post
    const isLiked = async (userIdLiked) => {
        try {
            const like = document.querySelector('.fa-thumbs-up')
            if (userIdLiked) like.classList.add('like')
            let liked;
            like.addEventListener('click', async () => {
                if (!userIdLiked) { // L'utilisateur n'a pas encore aimé le post
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
    if (postUserId === userId) { // L'utilisateur a créé le post


        // UPDATE POST
        // Permet d'afficher l'image si nouveau fichier sélectionné
        const fileField = document.querySelector('input[type=file]')
        const content = document.querySelector('textarea')
        const updateBtn = document.getElementById('btn')
        const deleteBtn = document.querySelector('.fa-times')
        // Affiche image selectionnée
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
        // Permet de modifier le post de l'utilisateur
        updateBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            let post = { // Donnée de l'utilisateur
                content: content.value
            }
            const formData = new FormData()
            if (fileField !== null && fileField.files[0] ) {
                formData.append('image', fileField.files[0])
            } 
            formData.append('post', JSON.stringify(post))  
            await updateFormData(urlPost, formData) // Modifie la ou les donnée(s) de l'utilisateur et envoie au serveur
            window.location.reload(true)
        }) 


        // DELETE POST
        // Permet de supprimer le post de l'utilisateur
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await deleteData(urlPost);
            window.location = 'index.html';
        })         
    }
 

    // COMMENT  
    // Rend visuellement le formulaire pour créer un commentaire
    const renderCommentForm = () => {
        const section = document.getElementById('post');
        const form = document.createElement('form');
        form.setAttribute('id', 'comment');
        form.innerHTML = `
        <textarea cols="30" rows="1" placeholder="Votre commentaire..."></textarea>
        <i class="far fa-paper-plane"></i>`
        section.appendChild(form);        
    }
    // Rend visuellement les commentaires postés
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
    // Supprime commentaire
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
    // Permet d'afficher les différents commentaires
    const displayComment = async () => {
        renderCommentForm()
        const btn = document.querySelector('.fa-paper-plane') 
        // Permet de créer un nouveau commentaire
        btn.addEventListener('click', async () => { 
            const comment = document.querySelector('#comment textarea')      
            const commentContent = {
                content: comment.value
            }
            await postData(urlComment, commentContent) // 
            location.reload(true)
        })
        const comments = await getData(urlComments) // Récupére les données des différents commentaires
        for(let i = 0; i < comments.length ; i++) { 
            const { avatar, username, content } = comments[i]
            const date = comments[i].updatedAt // Récupère la date du post actuel
            const commentDate = convertDate(date) // Convertis la date en format français
            const commentId = {id: comments[i].id}
            renderComments(avatar, username, commentDate, content)
            const deleteBtn = document.querySelectorAll('.comment .fa-times')
            deleteBtn[i].addEventListener('click', async (e) => {
                e.stopPropagation()
                if (postUserId === userId) {
                    await deleteComment(urlComment, commentId)
                    location.reload(true)                    
                } else {
                    console.log('You can not delete this comment!')
                }
            })
        }
    }
    displayComment()
})