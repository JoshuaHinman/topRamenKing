document.addEventListener('DOMContentLoaded', ()=> {
    let page = 1;
    let last = null;
    const loadingBar = document.querySelector('.loading-bar');
    const searchResults = loadingBar.dataset.search;
    let lastReview = document.querySelector('main > div:last-of-type');
    const reviewTemplate = Handlebars.compile(document.getElementById('review').innerHTML);
    const observer = new IntersectionObserver(loadMoreReviews);
    if (searchResults !== 'true') observer.observe(lastReview);

    async function loadMoreReviews(nodeArr) {
        if (nodeArr[0].isIntersecting && page != last) {
            loadingBar.style.display = 'block'; //show loading... message
            page += 1;

            let reviews = await fetch(`/reviews/page/${page}`)
                            .then(res => res.json());
            if (reviews.length === 0) page -= 1;
            if (reviews.length < 4) last = page;
            renderReviews(reviews);

            //set new observer
            observer.unobserve(lastReview);
            lastReview = document.querySelector('main > div:last-of-type');
            observer.observe(lastReview);

            loadingBar.style.display = 'none';
        }
    }

    function renderReviews(arr) {
        let parentNode = document.querySelector('main');
        const login = document.getElementById('logged-in').dataset.id;
        arr.forEach((review) => {
            parentNode.insertAdjacentHTML('beforeend', reviewTemplate(review));

            //remove edit button from review if login name doesnt match review's username or yoshie
            if (login !== review.userid.username && login !== 'yoshie') { 
                parentNode.lastElementChild.lastElementChild.remove();
            }

            //set img src
            let imgSrc = `data:image/${review.image[0].contentType};base64, ${review.image[0].data.toString('base64')}`
            parentNode.lastElementChild.firstElementChild.firstElementChild.src = imgSrc;

            //add rating
            let ratingsNode = parentNode.lastElementChild.getElementsByClassName('rating')[0];
            renderRatings(review.ratings, ratingsNode);
        })
    }

    function renderRatings(ratings, parentNode) { //takes ratings array
        for( let i = 0; i < ratings.length; i++) {
            const icon = ratings[i].icon;
            const rating = ratings[i].rating;
            let newRating = document.createElement('div');
            newRating.classList.add('rating');
            newRating.textContent = (icon + ' ').repeat(rating);

            if (Math.floor(rating) < rating) {   // if there's a .5 star
                const leftHalf = document.createElement('span');
                const rightHalf = document.createElement('span');
                leftHalf.textContent = icon;
                leftHalf.style.position = "relative";
                rightHalf.style.cssText = "position: absolute; height: 125%; width: 45%; background-color: whitesmoke; right: 0; opacity: 1; z-index: 1";
                leftHalf.appendChild(rightHalf);
                newRating.appendChild(leftHalf);
            }
            parentNode.appendChild(newRating);
        }
    }
});