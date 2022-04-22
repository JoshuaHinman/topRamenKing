//image loading and cropping
document.addEventListener('DOMContentLoaded', () => {
const ratingControl = document.querySelector('.rating-control');
let ratingControlCount = 0;
(function() {
    const photoCanvas = document.createElement('canvas');//   document.getElementById('photo-canvas');
    const croppedCanvas = document.getElementById('cropped-canvas');
    const croppedFrame = document.getElementById('cropped-frame');
    //const overlayCanvas = document.getElementById('overlay-canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    const photoCtx = photoCanvas.getContext('2d');
    //const overlayCtx = overlayCanvas.getContext('2d');
    const fileInput = document.getElementById('photo');
    const postFormData = document.getElementById('post-form-data');
    const rotateButton = document.getElementById('rotate-clockwise');
    const submitButton = document.getElementById('submitPost');
    let croppedImage;
    photoCanvas.width  = 800;
    photoCanvas.height = 800; 
    photoCanvas.style.width  = '800px';
    photoCanvas.style.height = '800px';

    let submitPost = false;
    
    //overlayCtx.strokeStyle = "#0F0";

    let frameWidth = 0;
    let frameHeight = 0;
    let vertex = [{x: 0, y: 0}, //top left corner
                  {x: 0, y: 0}, // bottom right corner
                  {x: 0, y: 0}]; // frame center
    let image = null;
    let imageScale = 0;
    let imageX = 0,
        imageY = 0;
    let rotateImg = 0;

    let dragging = false;
    let trackX,
        trackY;
    let startX,
        startY,
        startMouseX,
        startMouseY;

    submitButton.addEventListener('click', async function(event) {
        event.preventDefault();
        if (validateForm() == false) return;
        if (submitPost == false) {
            submitPost = true;
            const request = new XMLHttpRequest();
            let formData = new FormData(postFormData);
            const id = postFormData.dataset.id || '';
            request.open(postFormData.method, postFormData.action + id);
            console.log(postFormData.method, postFormData.action + id);
            request.onload = function() {
               window.location = "../";
               console.log(request.status)
            };
            
            let imgFile;
            croppedCanvas.toBlob(async function(blob) {
                var newImg = document.createElement('img');
                imgFile = await new File([blob], 'fileName.png', {type:'image/png', lastModified:new Date()}); //blob to file object
                formData.append('file', imgFile);
                request.send(formData);
            });
        }

    });

    function validateForm() {
        const title = document.querySelector('input[name="title"]');
        if (title.value.length < 1) {
            alert('Please add a title to your review');
            return false;
        }
        return true;
    }


    rotateButton.onclick = () => {
        if (image) {
            rotateImage();
            scaleAndRenderImage(image, photoCanvas);
        }
    }

    function rotateImage() {
        rotateImg += 90;
        if (rotateImg === 360) {
            rotateImg = 0;
        }
        console.log(rotateImg);
    };

    function setCanvasTransform() {
        photoCtx.resetTransform();
        photoCtx.translate(photoCanvas.width / 2, photoCanvas.height / 2);
        photoCtx.rotate(rotateImg * Math.PI / 180);
    }

    function scaleAndRenderImage(image, canvas) {
        let newImageSize;
        photoCtx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
        croppedCtx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
        setCanvasTransform();
        if (image.width > image.height) {       //wide image
            imageScale = canvas.width / image.width;
            newSize = image.height * imageScale;
            imageX = - (image.width / 2 * imageScale);
            imageY = - (image.height / 2 * imageScale);
        } else {                                //tall image
            imageScale = canvas.height / image.height;
            newSize = image.width * imageScale;
            imageX = - (image.width / 2 * imageScale);
            imageY = - (image.height / 2 * imageScale);
        }
        photoCtx.drawImage(image, imageX, imageY, image.width * imageScale, image.height * imageScale);
        photoCtx.resetTransform();
        croppedImage = photoCtx.getImageData((photoCanvas.width / 2) - (newSize / 2), (photoCanvas.height / 2) - (newSize / 2),
                                             newSize, newSize);
        croppedFrame.style.width  = (newSize + 4) + 'px';
        croppedFrame.style.height = (newSize + 4) + 'px';
        croppedCanvas.width  = newSize;
        croppedCanvas.height = newSize; 
        croppedCanvas.style.width  = newSize + 'px';
        croppedCanvas.style.height = newSize + 'px';
        croppedCtx.putImageData(croppedImage, 0, 0);
    }

    fileInput.onchange = function (event) {
        const files = event.target.files;
        const file = files[0];
        image = new Image();

        if (file.type.match('image.*')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (event) {
                if (event.target.readyState === FileReader.DONE) {
                    image.src = event.target.result;
                    image.onload = function (event) {
                        rotateImg = 0;
                        scaleAndRenderImage(image, photoCanvas);
                    }
                }
            }
        }
    }

    //**** functions for rating slider in post form
    function addNewSlider(icon, value) {
        const newRating = ratingControl.cloneNode(true);
        const selector = newRating.querySelector('.icon-selector');
        const slider = newRating.querySelector('.rating-slider');
        if (icon) selector.value = icon;
        if (value) slider.value = value;
        ratingControlCount += 1;
        selector.addEventListener('input', (event) => setDisplay(event.target.parentNode));
        selector.name = selector.name + ratingControlCount;
        slider.addEventListener('input', (event) => setDisplay(event.target.parentNode));
        slider.name = slider.name + ratingControlCount;
        if (ratingControlCount > 1) {
            newRating.querySelector('label').style.opacity = 0;
        }
        document.querySelector('#add-del-controls').insertAdjacentElement('beforebegin', newRating)
        setDisplay(newRating);
        styleAddDeleteLabel(ratingControlCount) ;
        return newRating;
    }

    function setDisplay(parent) {
        const icon = parent.querySelector('select').value;
        const iconCount = parent.querySelector('.rating-slider').value;
        const display = parent.querySelector('.rating-display');
        console.log(icon, iconCount, icon.repeat(iconCount));
        display.textContent = icon.repeat(iconCount);

        if (Math.floor(iconCount) < iconCount) {  // if there's a .5 star
            const leftHalf = document.createElement('span');
            const rightHalf = document.createElement('span');
            leftHalf.textContent = icon;
            leftHalf.style.position = "relative";
            rightHalf.style.cssText = "position: absolute; height: 125%; width: 45%; background-color: whitesmoke; right: 0; opacity: 1; z-index: 1";
            leftHalf.appendChild(rightHalf);
            display.appendChild(leftHalf);
        }
    }


    function removeSlider() {
        if (ratingControlCount > 1) {
            const sliders = document.querySelectorAll('.rating-control');
            sliders[sliders.length - 1].remove();
            ratingControlCount -= 1;
            styleAddDeleteLabel(ratingControlCount);
        }
    }

    function styleAddDeleteLabel(sliderCount) {
        const label = document.getElementById('add-del-label');
        const delButton = document.getElementById('del-button');

        if (ratingControlCount > 1) {
            label.textContent = "Add/Remove rating slider";
            delButton.style.visibility = "visible";
        } else {
            label.textContent = "Add another rating slider";
            delButton.style.visibility = "hidden";
        }
    }

    function initEditForm() {
        const ratings = document.getElementById('rating-string').dataset.rating.split(',')
        //set rating sliders
        ratings.forEach((rating) => {
            //extract icon , rating values
            let delimiter = 0;
            while( !rating[delimiter].match(/[0-9\.]/) ) delimiter++;
            const icon = rating.slice(0,delimiter);
            const value = parseFloat(rating.slice(delimiter));
            console.log(icon, value)

            //create slider, set values
            addNewSlider(icon, value);
        })
        copyImgToCanvas();
    }

    function copyImgToCanvas() {
        const tempImg = document.getElementById('temp-img');
        let attempt = 0;
        if (tempImg.complete) { //check if img loaded
            image = new Image();
            image.src = tempImg.src;
            image.onload = () => {
                rotateImg = 0;
                scaleAndRenderImage(image, photoCanvas);
            }
            tempImg.remove();
        } else if (attempt < 10) { //try 10 times
            attempt++;
            setInterval(() => {copyImgToCanvas}, 1000);
        }
    }

    document.getElementById('add-button').addEventListener('click', addNewSlider);
    document.getElementById('del-button').addEventListener('click', removeSlider);
    ratingControl.remove();


    if (document.getElementById('rating-string')) { // if editing
        initEditForm();
    } else {    // if new
        addNewSlider();
    }

    //setFramePosition(150, 150, 649, 649);
    //drawFrame();
})();//end of IIFE
});