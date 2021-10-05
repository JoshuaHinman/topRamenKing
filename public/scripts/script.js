document.addEventListener('DOMContentLoaded', () => {
    console.log("Loaded");
    const popup = document.getElementById('popup')
    const imagePreview = document.getElementById('preview')

    const navbar = document.getElementById('navbar')
    const postForm = document.getElementById('postForm')
    const signupForm = document.getElementById('signupForm')
    const loginForm = document.getElementById('loginForm')
    const logoutForm = document.getElementById('logoutForm')
    const profileForm = document.getElementById('profileForm')

    const signinTab = document.getElementById('signinTab')
    const signupTab = document.getElementById('signupTab')
    const postTab = document.getElementById('postTab')
    const loginTab = document.getElementById('loginTab')
    const logoutTab = document.getElementById('logoutTab')
    const profileTab = document.getElementById('profileTab')

    const formArray = [ document.getElementById('postForm'),
                        document.getElementById('signupForm'),
                        document.getElementById('loginForm'),
                        document.getElementById('logoutForm'),
                        document.getElementById('profileForm')]

    let activeForm = null;

    const loggedIn = (document.querySelector('#logged-in span').textContent == 'true')

    function toggleLoginTabs() {
        if(loggedIn) {
            navbar.insertBefore(logoutTab, loginTab)
            loginTab.remove()
            navbar.insertBefore(profileTab, signupTab)
            signupTab.remove()
        } else {
            navbar.insertBefore(loginTab, logoutTab)
            logoutTab.remove()
            navbar.insertBefore(signupTab, profileTab)
            profileTab.remove()
        }
    }

    function hideForm(event) {
        event.preventDefault()
        const form = event.target.closest('form')
        form.remove()
        activeForm = null
    }

    function hideForms() {
        const forms = document.querySelectorAll('form')
        for (let i = 0; i < forms.length; i++) {
            forms[i].remove()
        }
        activeForm = null
    }

    function getForm(id) {
        let result = null
        formArray.forEach((form) => {
            if( form && form.getAttribute('id') === id) {
                result = form
            }
        })
        return result
    }

    function toggleForm(event) {
        event.preventDefault()
        console.log(event.target)
        const showForm = getForm(event.target.closest('li').dataset.form)
        if (activeForm) {
            activeForm.remove()
        }
        activeForm = showForm
        popup.appendChild(showForm)
    }

    Array.from(document.querySelectorAll('.menuTab')).
        forEach((button) => button.addEventListener('click', toggleForm))

    Array.from(document.querySelectorAll('.x-button')).
        forEach((button) => button.addEventListener('click', hideForm))

    logoutForm.addEventListener('submit', () => {
        fetch('users/logout')
            .then( ()=> {   logoutForm.remove()
                            loggedIn = !loggedIn
                            toggleLoginTabs()})
     })

    hideForms()
    toggleLoginTabs()
 
    //imagePreview.addEventListener()
})