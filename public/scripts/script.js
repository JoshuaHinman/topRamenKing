document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded");
    

    const logoutForm = document.getElementById('logoutForm');
    const formArray = [ logoutForm,
                        document.getElementById('signupForm'),
                        document.getElementById('loginForm'),
                        document.getElementById('profileForm')];

    let activeForm = null;

    const loggedIn = (document.querySelector('#logged-in span').textContent === 'true');

    //**** functions for toggling form modals
    function toggleLoginTabs() {
        const signupTab = document.getElementById('signupTab');
        const loginTab = document.getElementById('loginTab');
        const logoutTab = document.getElementById('logoutTab');
        const profileTab = document.getElementById('profileTab');
        const navbar = document.getElementById('navbar');

        if(loggedIn) {
            navbar.insertBefore(logoutTab, loginTab);
            loginTab.remove();
            navbar.insertBefore(profileTab, signupTab);
            signupTab.remove();
        } else {
            navbar.insertBefore(loginTab, logoutTab);
            logoutTab.remove();
            navbar.insertBefore(signupTab, profileTab);
            profileTab.remove();
        }
    }

    function hideForm(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        form.remove();
        activeForm = null;
    }

    function hideForms() {
        const forms = document.querySelectorAll('form');
        for (let i = 0; i < forms.length; i++) {
            forms[i].remove();
        }
        activeForm = null;
    }

    function getForm(id) {
        let result = null;
        formArray.forEach((form) => {
            if( form && form.getAttribute('id') === id) {
                result = form;
            }
        })
        return result;
    }

    function toggleForm(event) {
        event.preventDefault();
        console.log(event.target);
        const showForm = getForm(event.target.closest('.modal-tab').dataset.form);
        if (activeForm) {
            activeForm.remove();
        }
        activeForm = showForm;
        document.getElementById('popup').appendChild(showForm);
    }

    Array.from(document.querySelectorAll('.modal-tab')).
        forEach((button) => button.addEventListener('click', toggleForm));

    Array.from(document.querySelectorAll('.x-button')).
        forEach((button) => button.addEventListener('click', hideForm));

    logoutForm.addEventListener('submit', () => {
        fetch('users/logout')
            .then( ()=> {   logoutForm.remove()
                            loggedIn = !loggedIn
                            toggleLoginTabs()})
     });

    hideForms();
    toggleLoginTabs();


})