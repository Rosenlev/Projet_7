const fileField = document.querySelector('input[type=file]')
const myImage = document.querySelector('#image img')
const myUsername = document.getElementById('username')
const myEmail = document.getElementById('email')
const myPassword = document.getElementById('psw')
const updateBtn = document.getElementById('updatebtn')
const deleteBtn = document.getElementById('deletebtn')

const token = 'Bearer ' + sessionStorage.getItem('token') // Fetches token in localStorage
const urlMyProfile = 'http://localhost:4000/user/me' // URL of connected user
// GET
// Fetches and displays username and mail
const getProfile = async () => {
   const data = await getData(urlMyProfile); // Fetches user's data
   const { username, email } = data // 
   myImage.setAttribute('src', `${data.imageUrl}`)
   myUsername.value = username // Defines username input's value
   myEmail.value = email // Defines email value
}
// Fetches user's data
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
// Displays picture if the file is selected
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
// Updates and sends user's data to server
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
// Event listener for the Update button
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