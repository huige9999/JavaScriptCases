const gameConfig = {
  width: 500,
  height: 500,
  dom: document.querySelector("#game"),
  imgSrc: "./img/lol.png",
  columns: 3,
  rows: 3,
  isGameOver: false,
};

gameConfig.pieceWidth = gameConfig.width / gameConfig.columns;
gameConfig.pieceHeight = gameConfig.height / gameConfig.rows;

class Block {
  constructor(left, top, visible) {
    this.trueLeft = left;
    this.trueTop = top;
    this.left = left;
    this.top = top;
    this.visible = visible;
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.width = gameConfig.pieceWidth + "px";
    this.dom.style.height = gameConfig.pieceHeight + "px";
    this.dom.style.border = "1px solid #fff";
    this.dom.style.boxSizing = "border-box";
    this.dom.style.background = `url(${gameConfig.imgSrc}) -${this.trueLeft}px -${this.trueTop}px`;
    if (!this.visible) {
      this.dom.style.display = "none";
    }
    gameConfig.dom.appendChild(this.dom);
    this.show();
  }

  /**
   * 根据当前的left、top值更新dom的位置
   */
  show() {
    this.dom.style.left = this.left + "px";
    this.dom.style.top = this.top + "px";
  }

  isRight() {
    return (
      this.trueLeft === this.left &&
      this.trueTop === this.top
    );

  }
}

const blocks = [];

function init() {
  // 1.初始化游戏容器
  initGameContainer();
  // 2.初始化小方块
  // 2.1 创建小方块
  createBlocks();
  // 2.2 随机排序
  shuffle();
  // 3. 注册事件
  regEvent();

  /**
   * 初始化游戏容器
   * 设置宽高、边框、定位等
   */
  function initGameContainer() {
    gameConfig.dom.style.width = gameConfig.width + "px";
    gameConfig.dom.style.height = gameConfig.height + "px";
    gameConfig.dom.style.border = "2px solid #ccc";
    gameConfig.dom.style.position = "relative";
  }

  /**
   * 创建小方块数组
   * 按行、列循环依次创建每个小方块
   */
  function createBlocks() {
    for (let i = 0; i < gameConfig.rows; i++) {
      for (let j = 0; j < gameConfig.columns; j++) {
        // 创建小方块
        const visible =
          i === gameConfig.rows - 1 && j === gameConfig.columns - 1
            ? false
            : true;
        const b = new Block(
          j * gameConfig.pieceWidth,
          i * gameConfig.pieceHeight,
          visible
        );
        // 将小方块添加到数组中
        blocks.push(b);
      }
    }
  }

  /**
   * 打乱小方块的位置
   * 遍历每个小方块(除了最后一个看不到的)，和随机索引的小方块交换位置
   */
  function shuffle() {
    blocks.forEach((block) => {
      if (block.visible) {
        const randomIndex = getRandomIndex(0, blocks.length - 1);
        exchange(block, blocks[randomIndex]);
      }
    });
  }

  /**
   * 交换两个小方块的位置
   * @param {Block} b1
   * @param {Block} b2
   */
  function exchange(b1, b2) {
    let temp = b1.left;
    b1.left = b2.left;
    b2.left = temp;

    temp = b1.top;
    b1.top = b2.top;
    b2.top = temp;

    b1.show();
    b2.show();
  }

  /**
   * 得到随机索引
   * 假设希望得到[0,8),传0,8
   */
  function getRandomIndex(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * 注册事件
   */
  function regEvent() {
    const emptyBlock = blocks.find((block) => !block.visible);
    blocks.forEach((block) => {
      block.dom.onclick = function () {
        if(canExchange(block,emptyBlock)) {
          exchange(block,emptyBlock);
          isWin();
        }
      };
    });
  }

  /**
   * 判断当前小方块是否可以交换
   */
  function canExchange(b, emptyB) {
    if (b === emptyB) {
      return false;
    }
    if (
      (b.top === emptyB.top &&
        Math.abs(b.left - emptyB.left) === gameConfig.pieceWidth) ||
      (b.left === emptyB.left &&
        Math.abs(b.top - emptyB.top) === gameConfig.pieceHeight)
    ) {
      return true;
    }
    return false;
  }

  /**
   * 判断是否游戏结束
   * 结束即：每个方块当前的位置和真实位置相等
   */
  function isWin() {
    const rightBlocks = blocks.filter((block) => block.isRight());
    if (rightBlocks.length === blocks.length) {
      alert("游戏结束");
    }
  }
}

init();
