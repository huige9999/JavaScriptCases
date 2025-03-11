(function () {
  const config = {
    smallBg: "images/mouse.jpg", // 小图背景路径
    bigBg: "images/mouseBigSize.jpg", //大图背景路径
    divBig: document.querySelector(".big"), //大图div dom元素
    divSmall: document.querySelector(".small"), //小图div dom元素
    divMove: document.querySelector(".small .move"), //可移动的div
    smallImgSize: {
      //小图尺寸
      width: 350,
      height: 350,
    },
    divBigSize: {
      //大的div的尺寸
      width: 540,
      height: 540,
    },
    bigImgSize: {
      //大图尺寸
      width: 800,
      height: 800,
    },
  };
})();
