const container = document.getElementById('container')
const cardWidth = 170;
const cardHeight = 170;
const input = document.querySelector('input[type=text]');

function createWish(wish) {
 const div = document.createElement('div');
 div.className = 'paper';
 div.innerHTML = `<p>${wish}</p><span>X</span>`;
 div.style.background = `rgb(${getRandom(100,200)},${getRandom(100,200)},${getRandom(100,200)})})`
 const maxLeft = document.documentElement.clientWidth - cardWidth;
 const maxTop = document.documentElement.clientHeight - cardHeight - 80;
 div.style.left = getRandom(0, maxLeft) + "px";
 div.style.top = getRandom(0, maxTop) + "px";

 container.appendChild(div);
 function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
 }
}

input.onkeydown = function(e) {
    if(e.keyCode === 13) {
        if(!this.value) {
            alert('愿望内容不能为空!')
            return;
        }
        createWish(this.value);
        this.value = '';
    }
}