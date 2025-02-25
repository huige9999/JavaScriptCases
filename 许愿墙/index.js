const container = document.getElementById('container')
const cardWidth = 170;
const cardHeight = 170;
const input = document.querySelector('input[type=text]');
let zIndex = 1;

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


/**
 * 拖拽
 */

window.onmousedown = function(e) {
    const div = getMoveDiv(e.target);
    if(!div) {
        return;
    }
    div.style.zIndex = zIndex++;
    const cStyle = getComputedStyle(div);
    const divLeft = parseFloat(cStyle.left);
    const divTop = parseFloat(cStyle.top);
    const mLeft = e.pageX;
    const mTop = e.pageY;

    window.onmousemove = function(e) {
        // 计算出卡片新的坐标
        const offsetMLeft = e.pageX - mLeft;
        const offfsetMTop = e.pageY - mTop;

        const divNewLeft = divLeft + offsetMLeft;
        const divNewTop = divTop + offfsetMTop;

        // 边界判断
        if(divNewLeft < 0) {
            divNewLeft = 0;
        }
        if(divNewLeft > document.documentElement.clientWidth - cardWidth) {
            divNewLeft = document.documentElement.clientWidth - cardWidth;
        }
        if(divNewTop < 0) {
            divNewTop = 0;
        }
        if(divNewTop > document.documentElement.clientHeight - cardHeight - 80) {
            divNewTop = document.documentElement.clientHeight - cardHeight - 80;
        }

        div.style.left = divNewLeft + 'px';
        div.style.top = divNewTop + 'px';
    }

    window.onmouseup = window.onmouseleave = function () {
        window.onmousemove = null;
    }

}

/**
 * 点X关闭
 */
window.onclick = function(e) {
    if(e.target.parentElement && e.target.parentElement.className === 'paper' && e.target.tagName === 'SPAN') {
        e.target.parentElement.remove();
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

/**
 * 拿到待移动的div
 */
function getMoveDiv(dom) {
    if(dom.className === 'paper') {
        return dom;
    } else if(dom.parentElement && dom.parentElement.className === 'paper' && dom.tagName === 'P') {
        return dom.parentElement;
    }
}

const testArr = ['一夜暴富','岁岁平安','年年有余'];
testArr.forEach(item => createWish(item));