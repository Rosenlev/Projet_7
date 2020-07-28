const fileField = document.querySelector("#file")
const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('psw')
const btn = document.getElementById('btn')
const errorMessage = document.getElementById('error-message')

const url = 'http://localhost:4000/api/auth/signup'
let user = {}

const regexEmail = /.+@.+\..+/;

const isValidInput = (value) => value.length >= 2 ? true : false;
const isValidEmail = (value) => value.match(regexEmail) ? true : false; // Vérifie que la valeur donnée soit bien dans le format email
const isValidPassword = (value) => value.length > 7 // Vérifie que le valeur contient plus de 7 caractère

// Permet de vérifier les saisies utilisateurs
const formValidate = () => {
    if (isValidInput(username.value)) { 
        errorMessage.textContent = ""; 
        if(isValidEmail(email.value)) {
            errorMessage.textContent = "";
            if(isValidPassword(password.value)) {
                errorMessage.textContent = "";
                return user = {
                    username: username.value,
                    email: email.value,
                    password: password.value
                }
            } else {
                errorMessage.textContent = "Le mot de passe doit contenir au minimum 8 caractères !"
                password.focus();
                return false;
            }
        } else {
            errorMessage.textContent = "Merci de renseigner une adresse mail valide !";
            email.focus();
            return false;
        }
    } else {
        errorMessage.textContent = "Merci de renseigner votre nom d'utilisateur !"
        username.focus();
        return false;
    }
}
// Envoie données à l'api
const postData = async (url, formData) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        })
        return await response.json();        
    } catch (err) {
        throw new Error(err)
    }
}
// Permet d'afficher l'image
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
// Permet de créer un nouvel utilisateur
btn.addEventListener("click", async (e) => {
    try {
        e.preventDefault()
        const validForm = formValidate();
        const formData = new FormData()
        formData.append('image', fileField.files[0])
        formData.append('user', JSON.stringify(user))         
        if (validForm !== false ) {
            const data = await postData(url, formData); // Envoie données au serveur  
            if ( data.error ) {
                errorMessage.textContent = data.error
                return console.error(data.error)
            }
            window.location = `login.html`; // Redirige vers la page login        
        }
      
    } catch (err) {
        throw new Error(err)
    }
})