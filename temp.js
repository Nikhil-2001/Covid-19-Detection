const conFile = document.querySelector('.con-input-file')
const img1 = document.querySelector('.img-1')
const img2 = document.querySelector('.img-2')
const img3 = document.querySelector('.img-3')
const imgFile = document.querySelector('.bg')
const input = document.querySelector('.input')
let one = false

const btn = document.querySelector("#hidebtn");
btn.addEventListener("click", function(){
    const inf = document.querySelector(".info_prediction");
    inf.style.display = "block";
    const element = document.querySelector(".buttonhide");
    element.scrollIntoView();       
})
function dropHandler(evt) {
    console.log('File(s) dropped');
    conFile.classList.remove('drop')
    anime({
        targets: '.img-1',
        left: `200px`,
        top: `200px`,
        duration: 400
    })
    anime({
        targets: '.img-2',
        left: `200px`,
        top: `200px`,
        duration: 600
    })
    anime({
        targets: '.img-3',
        left: `200px`,
        top: `200px`,
        duration: 800
    })
}

function dragOverHandler(evt) {
    anime({
        targets: '.img-1',
        left: `${evt.layerX}px`,
        top: `${evt.layerY}px`,
        duration: 200
    })
    anime({
        targets: '.img-2',
        left: `${evt.layerX}px`,
        top: `${evt.layerY}px`,
        duration: 300
    })
    anime({
        targets: '.img-3',
        left: `${evt.layerX}px`,
        top: `${evt.layerY}px`,
        duration: 400
    })
    conFile.classList.add('drop')
    evt.preventDefault();
}

function dragLeave(evt) {
    conFile.classList.remove('drop')
    setTimeout(() => {
        anime({
            targets: '.img-1',
            left: `200px`,
            top: `200px`,
            duration: 400,
        })
        anime({
            targets: '.img-2',
            left: `200px`,
            top: `200px`,
            duration: 600,
        })
        anime({
            targets: '.img-3',
            left: `200px`,
            top: `200px`,
            duration: 800,
        })
    }, 50);
}

function dragEnter(evt) {
    conFile.classList.add('drop')
}

function processFile(event) {
    function getBase64(file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
            imgFile.src = reader.result
            conFile.classList.add('hasFile')
        }
    }

    const file = event.target.files[0]
    getBase64(file)
    const btn = document.querySelector("#hidebtn");
    btn.style.display = "flex";
    document.querySelector("#imageFile").style.pointerEvents = "none";
    document.querySelector(".input").style.cursor = "default";
}

function handleClickRemove() {
    conFile.classList.remove('hasFile')
    setTimeout(() => {
        imgFile.src = ''
    }, 250);
    input.type = 'text'
    input.type = 'file'
    document.querySelector("#hidebtn").style.display = "none";
    document.querySelector(".info_prediction").style.display = "none";
    document.querySelector("#imageFile").style.pointerEvents = "all";
    document.querySelector("#imageFile").style.cursor = "pointer";
}