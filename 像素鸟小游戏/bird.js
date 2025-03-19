/**
 * 得到一个计时器对象
 */
function getTimer(duration, thisArg, callback) {
  var timer = null;
  return {
    start: function () {
      if (timer) {
        return;
      }
      this.timer = setInterval(callback.bind(thisArg), duration);
    },
    stop: function () {
      clearInterval(this.timer);
      this.timer = null;
    },
  };
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

// 游戏对象
var game = {
  dom: document.querySelector(".game"),
  overDom: document.querySelector(".game .over"),
  isPause: true,
  isOver: false,
  start: function () {
    sky.timer.start();
    land.timer.start();
    bird.swingTimer.start();
    bird.dropTimer.start();
    pipeManager.produceTimer.start();
    pipeManager.moveTimer.start();
    hitManager.timer.start();
    this.isPause = false;
  },
  stop: function () {
    sky.timer.stop();
    land.timer.stop();
    bird.swingTimer.stop();
    bird.dropTimer.stop();
    pipeManager.produceTimer.stop();
    pipeManager.moveTimer.stop();
    hitManager.timer.stop();
    this.isPause = true;
  },
};

game.width = game.dom.clientWidth; // 面板宽度
game.height = game.dom.clientHeight;

// 天空对象
var sky = {
  left: 0,
  dom: document.querySelector(".game .sky"),
};

sky.timer = getTimer(16, sky, function () {
  this.left -= 1;
  if (this.left === -game.width) {
    this.left = 0;
  }
  this.dom.style.left = this.left + "px";
});

// 大地对象
var land = {
  left: 0,
  dom: document.querySelector(".game .land"),
};
land.height = land.dom.clientHeight;
land.top = game.height - land.height;

land.timer = getTimer(8, land, function () {
  this.left -= 1;
  if (this.left === -game.width) {
    this.left = 0;
  }
  this.dom.style.left = this.left + "px";
});

// 鸟对象
var bird = {
  left: 150,
  top: 150,
  width: 33,
  height: 26,
  swingIndex: 0,
  dom: document.querySelector(".game .bird"),
  //   v: 0.1, // 假设是匀速的
  v0: 0.1, // 初速度
  a: 0.002, // 加速度
  t: 16, // 时间间隔
  show() {
    if (this.swingIndex === 0) {
      this.dom.style.backgroundPosition = "-8px -10px";
    } else if (this.swingIndex === 1) {
      this.dom.style.backgroundPosition = "-60px -10px";
    } else {
      this.dom.style.backgroundPosition = "-113px -10px";
    }
    this.dom.style.left = this.left + "px";
    this.dom.style.top = this.top + "px";
  },
  setTop(top) {
    if (top < 0) {
      top = 0;
    } else if (top > land.top - this.height) {
      top = land.top - this.height;
    }
    this.top = top;
    this.show();
  },
  jump() {
    this.v0 = -0.5; // 设置向上的初速度
  },
};

bird.swingTimer = getTimer(100, bird, function () {
  this.swingIndex = (this.swingIndex + 1) % 3;
  this.show();
});
bird.dropTimer = getTimer(bird.t, bird, function () {
  // 计算移动距离
  var dis = this.v0 * this.t + 0.5 * this.a * this.t * this.t;
  this.setTop(this.top + dis);

  // 更新初速度
  this.v0 += this.a * this.t;
});
bird.show();

/**
 * 柱子的构造函数
 * @param {'up' | 'down'} direction 方向
 */
function Pipe(direction, height) {
  this.width = Pipe.width;
  this.height = height;
  this.left = game.width;
  // 纵坐标
  if (direction === "up") {
    this.top = 0; // 上管道的 top 值为 0
  } else {
    this.top = land.top - this.height; // 下管道的 top 值为地面高度减去管道高度
  }
  this.dom = document.createElement("div");
  this.dom.className = "pipe " + direction;
  this.dom.style.height = this.height + "px";
  this.dom.style.top = this.top + "px";
  this.show();
  game.dom.appendChild(this.dom);
}
Pipe.prototype.show = function () {
  this.dom.style.left = this.left + "px";
};

Pipe.width = 52;

/**
 * 一对柱子的构造函数
 */
function PipePair() {
  var minHeight = 60;
  var gap = 150;
  var maxHeight = land.top - minHeight - gap;
  var h = getRandom(minHeight, maxHeight);
  this.up = new Pipe("up", h);
  this.down = new Pipe("down", land.top - h - gap);
  this.left = this.up.left;
}

/**
 * 显示一对柱子
 */
PipePair.prototype.show = function () {
  this.up.left = this.left;
  this.down.left = this.left;
  this.up.show();
  this.down.show();
};

PipePair.prototype.remove = function () {
  this.up.dom.remove();
  this.down.dom.remove();
};

// 柱子管理器
var pipeManager = {
  pairs: [],
};

pipeManager.produceTimer = getTimer(1000, pipeManager, function () {
  this.pairs.push(new PipePair());
});

pipeManager.moveTimer = getTimer(16, pipeManager, function () {
  for (var i = 0; i < this.pairs.length; i++) {
    var pair = this.pairs[i];
    pair.left -= 2;
    if (pair.left < -Pipe.width) {
      pair.remove();
      this.pairs.splice(i, 1);
      i--;
    } else {
      pair.show();
    }
  }
});

// 碰撞检测器
var hitManager = {
  // 检测是否碰撞 true: 碰撞 false: 没有碰撞
  validate: function () {
    if (bird.top >= land.top - bird.height) {
      return true;
    }
    for (var i = 0; i < pipeManager.pairs.length; i++) {
      var pair = pipeManager.pairs[i];
      if (
        this.validateBirdAndPipe(pair.up) ||
        this.validateBirdAndPipe(pair.down)
      ) {
        return true;
      }
    }

    return false;
  },
  // 验证某个柱子和鸟是否碰撞
  validateBirdAndPipe(pipe) {
    //bird  pipe
    var bx = bird.left + bird.width / 2; //小鸟中心点x
    var by = bird.top + bird.height / 2; //小鸟中心点y
    var px = pipe.left + pipe.width / 2; //柱子中心点x
    var py = pipe.top + pipe.height / 2; //柱子中心点y
    // 发生相交
    if (
      Math.abs(px - bx) <= (bird.width + pipe.width) / 2 &&
      Math.abs(py - by) <= (bird.height + pipe.height) / 2
    ) {
      return true;
    } else {
      return false;
    }
  },
};

hitManager.timer = getTimer(16, hitManager, function () {
  // 检测是否碰撞
  if (this.validate()) {
    game.stop();
    game.overDom.style.display = "block";
    game.isOver = true;
  }
});

// 注册事件
window.onkeydown = function (e) {
  if (e.key === "Enter") {
    if (game.isOver) {
      window.location.reload();
      return;
    }
    if (game.isPause) {
      game.start();
    } else {
      game.stop();
    }
  } else if (e.key === " ") {
    bird.jump();
  }
};
