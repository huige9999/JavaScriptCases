# 放大镜功能实现思路

## 1. 简介

本文档描述了放大镜功能的实现思路，该功能通过在小图上创建一个可移动的“放大镜”区域，并在大图区域显示放大后的图像，从而实现放大镜效果。

## 2. HTML 结构

```html
<div class="small">
    <div class="move"></div>
</div>
<div class="big"></div>
```

*   `.small`：显示小图，包含可移动的 `.move` div。
*   `.move`：小图上的可移动区域，用于模拟放大镜。
*   `.big`：显示放大后的图像。

## 3. JavaScript 代码实现

### 3.1 初始化

使用立即执行函数 (IIFE) 创建独立作用域，并定义 `config` 对象存储配置信息。

```javascript
(function () {
    //配置
    var config = {
        smallBg: "images/mouse.jpg", // 小图背景路径
        bigBg: "images/mouseBigSize.jpg", //大图背景路径
        divBig: document.querySelector(".big"), //大图div dom元素
        divSmall: document.querySelector(".small"), //小图div dom元素
        divMove: document.querySelector(".small .move"), //可移动的div
        smallImgSize: { //小图尺寸
            width: 350,
            height: 350
        },
        divBigSize: { //大的div的尺寸
            width: 540,
            height: 540
        },
        bigImgSize: { //大图尺寸
            width: 800,
            height: 800
        }
    };
    //计算可移动的div的宽高
    config.moveSize = {
        width: config.divBigSize.width / config.bigImgSize.width * config.smallImgSize.width,
        height: config.divBigSize.height / config.bigImgSize.height * config.smallImgSize.height,
    };

    initDivBg();
    initMoveDiv();
    initDivSmallEvent();
```

### 3.2 初始化 div 背景

`initDivBg()` 函数用于设置小图和大图的背景图片。

```javascript
    function initDivBg() {
        config.divSmall.style.background = `url("${config.smallBg}") no-repeat left top/100% 100%`;
        config.divBig.style.background = `url("${config.bigBg}") no-repeat`;
    }
```

### 3.3 初始化可移动的 div

`initMoveDiv()` 函数用于设置可移动的 `.move` div 的尺寸。

```javascript
    function initMoveDiv() {
        config.divMove.style.width = config.moveSize.width + "px";
        config.divMove.style.height = config.moveSize.height + "px";
    }
```

### 3.4 初始化小图 div 的鼠标事件

`initDivSmallEvent()` 函数用于处理小图 div 的鼠标事件，实现放大镜效果。

```javascript
    function initDivSmallEvent() {
        config.divSmall.onmouseenter = function () {
            config.divMove.style.display = "block";
            config.divBig.style.display = "block";
        }
        config.divSmall.onmouseleave = function () {
            config.divMove.style.display = "none";
            config.divBig.style.display = "none";
        }

        config.divSmall.onmousemove = function (e) {
            var offset = getOffset(e);
            setPosition(offset);
            setBigBgPosition();
        }
```

*   `onmouseenter`：显示 `.move` div 和 `.big` div。
*   `onmouseleave`：隐藏 `.move` div 和 `.big` div。
*   `onmousemove`：
    *   `getOffset(e)`：获取鼠标在小图 div 中的坐标。
    *   `setPosition(offset)`：设置 `.move` div 的位置。
    *   `setBigBgPosition()`：设置大图的背景位置。

### 3.5 其他辅助函数

*   `getOffset(e)`：获取鼠标在小图 div 中的坐标。
*   `setPosition(offset)`：设置 `.move` div 的位置，并确保不超出小图范围。
*   `setBigBgPosition()`：设置大图的背景位置，实现放大效果。

## 4. 总结

该放大镜功能通过 JavaScript 动态控制 DOM 元素的显示和位置，实现了简单而有效的放大镜效果。