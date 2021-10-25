document.addEventListener('DOMContentLoaded', () => {
    console.log("Loaded");
    const popup = document.getElementById('popup')
    const imagePreview = document.getElementById('preview')
    const rating = document.querySelector('.rating-control')
	let ratingControlCount = 0;


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
    document.getElementById('add-button').addEventListener('click', addNewSlider)
    document.getElementById('del-button').addEventListener('click', removeSlider)
    rating.remove()
    addNewSlider()

    hideForms()
    toggleLoginTabs()
 
    //imagePreview.addEventListener()

		
		function addNewSlider() {
			const newRating = rating.cloneNode(true)
			const selector = newRating.querySelector('.icon-selector')
			const slider = newRating.querySelector('.rating-slider')
			ratingControlCount += 1
			selector.addEventListener('input', (event) => setDisplay(event.target.parentNode))
			selector.name = selector.name + ratingControlCount
			slider.addEventListener('input', (event) => setDisplay(event.target.parentNode))
			slider.name = slider.name + ratingControlCount
			if (ratingControlCount > 1) {
				newRating.querySelector('label').style.opacity = 0;
			}
			document.querySelector('#add-del-controls').insertAdjacentElement('beforebegin', newRating)
			setDisplay(newRating)
			styleAddDeleteLabel(ratingControlCount) 
		}

		function removeSlider() {
			if (ratingControlCount > 1) {
				const sliders = document.querySelectorAll('.rating-control')
				sliders[sliders.length - 1].remove()
				ratingControlCount -= 1
				styleAddDeleteLabel(ratingControlCount)
			}
		}

		function setDisplay(parent) {
			console.log(parent)
			const icon = parent.querySelector('select').value
			const iconCount = parent.querySelector('.rating-slider').value
			const display = parent.querySelector('.rating-display')
			console.log(icon, iconCount, icon.repeat(iconCount))
			display.textContent = icon.repeat(iconCount)

			if (Math.floor(iconCount) < iconCount) { 					// if there's a trailing .5 star
				const leftHalf = document.createElement('span')
				const rightHalf = document.createElement('span')
				leftHalf.textContent = icon
				leftHalf.style.position = "relative"
				rightHalf.style.cssText = "position: absolute; height: 120%; width: 50%; background-color: whitesmoke; right: 0; opacity: 1; z-index: 1"
				leftHalf.appendChild(rightHalf)
				display.appendChild(leftHalf)
			}
		}

		function styleAddDeleteLabel(sliderCount) {
			const label = document.getElementById('add-del-label')
			const delButton = document.getElementById('del-button')

			if (ratingControlCount > 1) {
				label.textContent = "Add/Remove rating slider"
				delButton.style.visibility = "visible"
			} else {
				label.textContent = "Add another rating slider"
				delButton.style.visibility = "hidden"
			}
		}
		

})