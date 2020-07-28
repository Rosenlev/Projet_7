const fileField = document.querySelector('input[type=file]')
const myImage = document.querySelector('#image img')
const myUsername = document.getElementById('username')
const myEmail = document.getElementById('email')
const myPassword = document.getElementById('psw')
const updateBtn = document.getElementById('updatebtn')
const deleteBtn = document.getElementById('deletebtn')

const token = 'Bearer ' + sessionStorage.getItem('token') // Récupère le token stocké dans local storage
const urlMyProfile = 'http://localhost:4000/user/me' // Url de l'utilisateur connecté
// GET
// Récupère et affiche les données (username et email)
const getProfile = async () => {
   const data = await getData(urlMyProfile); // Récupère les données de l'utilisateur
   const { username, email } = data // 
   myImage.setAttribute('src', `${data.imageUrl}`)
   myUsername.value = username // Défini la valeur de l'input username
   myEmail.value = email // Défini la valeur de email
}
// Récupère les données de l'utilisateur
const getData = async (url) => {
    const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
})
    return await response.json();
}
getProfile()
// UPDATE
// Permet d'afficher l'image si nouveau fichier sélectionné
function readUrl(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
            const img = document.querySelector('#image img')
            img.src = e.target.result
        })
        reader.readAsDataURL(input.files[0]);
    }
}
fileField.addEventListener('change', function() {
    readUrl(this)
})
// Modifie la ou les donnée(s) de l'utilisateur et envoie au serveur
const updateData = async (url, formData) => {
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
// Gestionnaire d'évènement créé sur clic du bouton 'Modifier'
updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    let user = { // Donnée de l'utilisateur
        username: myUsername.value,
        email: myEmail.value,
        password: myPassword.value
    }
    console.log('it works')
    const formData = new FormData()
    if (fileField.files[0]) {
        formData.append('image', fileField.files[0])
        formData.append('user', JSON.stringify(user))  
    } else {
        formData.append('user', JSON.stringify(user))  
    }
      
    const data = await updateData(urlMyProfile, formData) // Modifie la ou les donnée(s) de l'utilisateur et envoie au serveur
    console.log(data.message)
})
// DELETE ACCOUNT
const deleteProfile = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    return await response.json();
}
deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const data = await deleteProfile(urlMyProfile);
    sessionStorage.clear();
    window.location = "signup.html";
})

// const getPostsFromUser = async () {

// }