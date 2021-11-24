//image loading and cropping
document.addEventListener('DOMContentLoaded', () => {
const ratingControl = document.querySelector('.rating-control');
let ratingControlCount = 0;
(function() {
    const photoCanvas = document.getElementById('photo-canvas');
    const overlayCanvas = document.getElementById('overlay-canvas');
    const photoCtx = photoCanvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    const fileInput = document.getElementById('photo');
    const postFormData = document.getElementById('post-form-data');
    const rotateButton = document.getElementById('rotate-clockwise');
    const submitButton = document.getElementById('submitPost');

    overlayCtx.strokeStyle = "#0F0";

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
        const request = new XMLHttpRequest();
        let formData = new FormData(postFormData);
        request.open('POST', 'create');
        request.onload = function() {
           window.location = "../";
        };
        const imageData = photoCtx.getImageData(vertex[0].x, vertex[0].y, //copy rect from canvas
                                                vertex[1].x - vertex[0].x + 1, vertex[1].y - vertex[0].y + 1); 
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width =  imageData.width;
        tempCanvas.height =  imageData.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
        let imgURL;
        let imgFile;
        let imgBlob;
        tempCanvas.toBlob(async function(blob) {
        var newImg = document.createElement('img');
        imgFile = await new File([blob], 'fileName.png', {type:'image/png', lastModified:new Date()}); //blob to file object
        formData.append('file', imgFile);
        request.send(formData);

         // newImg.src = imgURL;
          ///postForm.appendChild(newImg);
        });
        //console.log(newFile);
        //formData.set('imageFile', "this is a fun time");
        // for (var key of formData.keys()) {
        //    console.log(key);
        // }
        // for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }
       

    });

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

    function scaleAndRenderImage(image, canvas) {
        photoCtx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
        photoCtx.save();
        photoCtx.translate(photoCanvas.width / 2, photoCanvas.height / 2);
        photoCtx.rotate(rotateImg * Math.PI / 180);
        if (image.width > image.height) {       //wide image
            imageScale = canvas.width / image.width;
            imageX = - (image.width / 2 * imageScale);//0;
            imageY = - (image.height / 2 * imageScale);//(canvas.height / 2) - (image.height / 2 * imageScale );
        } else {                                //tall image
            imageScale = canvas.height / image.height;
            imageX = - (image.width / 2 * imageScale);//(canvas.width / 2) - (image.width / 2 * imageScale);
            imageY = - (image.height / 2 * imageScale);//0;
        }
        photoCtx.drawImage(image, imageX, imageY, image.width * imageScale, image.height * imageScale);
        photoCtx.restore();
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
                        //photoCtx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);
                        rotateImg = 0;
                        scaleAndRenderImage(image, photoCanvas);
                        //scaleImageToFit(image, photoCanvas);
                        const imageData = photoCtx.getImageData(0, 0, 300, 300);
                    }
                }
            }
        }
    }

    function setFramePosition(x, y, x2, y2) {
        vertex[0].x = x;
        vertex[0].y = y;
        vertex[1].x = x2;
        vertex[1].y = y2;
        vertex[2].x = x2 - (x / 2);
        vertex[2].y = y2 - (y / 2);
        frameWidth = x2 - x + 1;
        frameHeight = y2 - y + 1;
    }

    function drawFrame() {
        overlayCtx.strokeRect(vertex[0].x, vertex[0].y, vertex[1].x - vertex[0].x, vertex[1].y - vertex[0].y);// frame
        overlayCtx.strokeRect(vertex[0].x, vertex[0].y, 10, 10);    // top left corner
        overlayCtx.strokeRect(vertex[1].x - 10, vertex[0].y, 10, 10);    // top right corner
        overlayCtx.strokeRect(vertex[0].x, vertex[1].y - 10, 10, 10);    // bottom left corner
        overlayCtx.strokeRect(vertex[1].x - 10, vertex[1].y - 10, 10, 10);  //bottom right corner
    }

    function inBounds(testX, testY, x1, y1, width, height) {
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;
        if (testX >= x1 && testX <= x2 && testY >= y1 && testY <= y2) {
            return true;
        } else {
            return false;
        }
    }

    function validateAndMove(deltaX, deltaY) {
        let oldX = trackX.x;
        let oldY = trackY.y;
        trackX.x = startX + deltaX; 
        trackY.y = startY + deltaY;
        if (vertex[0].x > (vertex[1].x - 20)) {
            trackX.x = oldX;
        } 
        if (vertex[0].y > (vertex[1].y - 20)) {
            trackY.y = oldY;
        }
    }
``
    overlayCanvas.addEventListener('mousemove', function (event) {
        const canvasRect = event.target.getBoundingClientRect();
        let mouseX = event.clientX - canvasRect.left;
        let mouseY = event.clientY - canvasRect.top;
        if (dragging) {
            overlayCtx.clearRect(vertex[0].x - 10, vertex[0].y - 10, vertex[1].x + 10, vertex[1].y + 10);
            let deltaX = mouseX - startMouseX;
            let deltaY = mouseY - startMouseY;
            validateAndMove(deltaX, deltaY);
            drawFrame();
        }
    });

    overlayCanvas.addEventListener('mouseup', endDragging);

    overlayCanvas.addEventListener('mouseout', endDragging);

    overlayCanvas.addEventListener('mousedown', function (event) {
        const canvasRect = event.target.getBoundingClientRect();
        let mouseX = event.clientX - canvasRect.left;
        let mouseY = event.clientY - canvasRect.top;
        if (inBounds(mouseX, mouseY, vertex[0].x, vertex[0].y, 10, 10)) {    //top left corner 
            startDragging(vertex[0], vertex[0], mouseX, mouseY);
        } else if (inBounds(mouseX, mouseY, vertex[1].x - 10, vertex[0].y, 10, 10)) {   //top right corner
            startDragging(vertex[1], vertex[0], mouseX, mouseY);
        } else if (inBounds(mouseX, mouseY, vertex[0].x, vertex[1].y - 10, 10, 10)) {   //bottom left corner
            startDragging(vertex[0], vertex[1], mouseX, mouseY);
        } else if (inBounds(mouseX, mouseY, vertex[1].x - 10, vertex[1].y - 10, 10, 10)) {   //bottom right corner
            startDragging(vertex[1], vertex[1],mouseX, mouseY);
        }
    });

    function startDragging(vertexX, vertexY, mouseX, mouseY) {
        dragging = true;
        trackX = vertexX;
        trackY = vertexY;
        startX = trackX.x;
        startY = trackY.y;
        startMouseX = mouseX;
        startMouseY = mouseY;
    }

    function endDragging() {
        dragging = false;
        console.log('dragging: ', dragging);
    }

    //image upload preview
    function imagePreview() {
        console.log('preview...');
        const preview = document.getElementById('img-preview');
        const file = document.getElementById('image-file').files[0];
        console.log(preview, file);
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            preview.src = reader.result;
            console.log('loaded');
        });

        if (file) {
            console.log('file present');
            reader.readAsDataURL(file);
        }
    }
        

         //**** functions for rating slider in post form
    function addNewSlider() {
        const newRating = ratingControl.cloneNode(true);
        const selector = newRating.querySelector('.icon-selector');
        const slider = newRating.querySelector('.rating-slider');
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
    }

    function removeSlider() {
        if (ratingControlCount > 1) {
            const sliders = document.querySelectorAll('.rating-control');
            sliders[sliders.length - 1].remove();
            ratingControlCount -= 1;
            styleAddDeleteLabel(ratingControlCount);
        }
    }

    function setDisplay(parent) {
        const icon = parent.querySelector('select').value;
        const iconCount = parent.querySelector('.rating-slider').value;
        const display = parent.querySelector('.rating-display');
        console.log(icon, iconCount, icon.repeat(iconCount));
        display.textContent = icon.repeat(iconCount);

        if (Math.floor(iconCount) < iconCount) {                    // if there's a trailing .5 star
            const leftHalf = document.createElement('span');
            const rightHalf = document.createElement('span');
            leftHalf.textContent = icon;
            leftHalf.style.position = "relative";
            rightHalf.style.cssText = "position: absolute; height: 125%; width: 45%; background-color: whitesmoke; right: 0; opacity: 1; z-index: 1";
            leftHalf.appendChild(rightHalf);
            display.appendChild(leftHalf);
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

    document.getElementById('add-button').addEventListener('click', addNewSlider);
    document.getElementById('del-button').addEventListener('click', removeSlider);
    ratingControl.remove();

    addNewSlider();

    setFramePosition(150, 150, 649, 649);
    drawFrame();
})();//end of IIFE
});