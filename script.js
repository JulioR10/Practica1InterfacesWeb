let game = {
  elem: document.getElementById("game"),
  width: null,
  height: null,
  show: function () {
    var computedStyles = window.getComputedStyle(this.elem);
    this.width = parseInt(computedStyles.getPropertyValue("width"));
    this.height = parseInt(computedStyles.getPropertyValue("height"));
  },
};

let bola = {
  elem: document.getElementById("bola"),
  x: parseInt(
    window
      .getComputedStyle(document.getElementById("bola"), null)
      .getPropertyValue("left"),
    10
  ),
  y: parseInt(
    window
      .getComputedStyle(document.getElementById("bola"), null)
      .getPropertyValue("top"),
    10
  ),
  r:
    parseInt(
      window
        .getComputedStyle(document.getElementById("bola"), null)
        .getPropertyValue("width"),
      10
    ) / 2,
  height: parseInt(
    window
      .getComputedStyle(document.getElementById("bola"), null)
      .getPropertyValue("height"),
    10
  ),
  width: parseInt(
    window
      .getComputedStyle(document.getElementById("bola"), null)
      .getPropertyValue("width"),
    10
  ),
  dx: 5,
  dy: -6,
  move: function () {
    this.x += this.dx;
    this.y += this.dy;
  },
  show: function () {
    this.elem.style.left = this.x + "px";
    this.elem.style.top = this.y + "px";
  },
};

function bolaMove() {
  if (bola.x <= 0 || bola.x >= game.width - 2 * bola.r) {
    bola.dx *= -1;
  }
  if (bola.y <= 0 || colisiones(bola, barra)) {
    bola.dy *= -1;
  } else if (bola.y >= game.height - 2 * bola.r) {
    gameOver(false);
  }
  for (let i = 0; i < bricks.arr.length; i++) {
    let brick = bricks.arr[i];
    if (brick.status === 1 && colisiones(bola, brick)) {
      brick.status = 0;
      bola.dy *= -1.05;
      bola.dx *= 1.05;
    }
  }
  if (bricks.arr.every((brick) => brick.status === 0)) {
    gameOver(true);
  }
  bola.move();
  bola.show();
  bricks.show();
}

let barra = new (function () {
  this.elem = document.getElementById("barra");
  this.width = null;
  this.height = null;
  this.x = null;
  this.y = null;
  this.show = function () {
    var computedStyles = window.getComputedStyle(this.elem);
    this.width = parseInt(computedStyles.getPropertyValue("width"));
    this.height = parseInt(computedStyles.getPropertyValue("height"));
    this.y = parseInt(computedStyles.getPropertyValue("top"));
    this.elem.style.left = this.x + "px";
    this.elem.style.top = this.y + "px";
  };
  this.updateX = function (newX) {
    this.x = newX;
    this.show();
  };
})();
window.addEventListener("keydown", function (e) {
  if (e.keyCode === 37 && barra.x > 0) {
    barra.updateX(barra.x - 20);
  } else if (e.keyCode === 39 && barra.x + barra.width < game.width) {
    barra.updateX(barra.x + 20);
  }
});

let bricks = {
  arr: [],
  row: 3,
  col: 6,
  margin: 1,
  create: function () {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        this.arr.push(new Brick(i, j));
      }
    }
  },
  show: function () {
    for (let i = 0; i < this.arr.length; i++) {
      let brick = this.arr[i];
      brick.show();
    }
  },
};

function Brick(i, j) {
  this.elem = document.createElement("div");
  this.elem.setAttribute("id", "b" + i + j);
  game.elem.appendChild(this.elem);

  this.width = (game.width - (bricks.col + 1) * bricks.margin) / bricks.col;
  this.height = this.width / 4;
  this.x = (j + 1) * bricks.margin + j * this.width;
  this.y = (i + 1) * bricks.margin + i * this.height;
  this.color = "#f00";
  this.status = 1;

  this.show = function () {
    this.elem.style.width = this.width + "px";
    this.elem.style.height = this.height + "px";
    this.elem.style.left = this.x + "px";
    this.elem.style.top = this.y + "px";
    this.elem.style.background = this.color;
    if (this.status === 0) {
      this.elem.style.display = "none";
    }
  };
}

game.show();
bricks.create();
bricks.show();
barra.show();
start();

bola.y = barra.y - 2.01 * bola.r;
setInterval(bolaMove, 40);

function colisiones(obj1, obj2) {
  return (
    obj1.y <= obj2.y + obj2.height &&
    obj1.y + obj1.height >= obj2.y &&
    obj1.x + obj1.width >= obj2.x &&
    obj1.x <= obj2.x + obj2.width
  );
}

function start() {
  barra.x = rand(0, game.width - barra.width);
  let sign = rand(0, 1) ? -1 : 1;
  bola.dx = (sign * rand(40, 60)) / 10;
  bola.x = barra.x + barra.width / 2 - bola.r;
}

function gameOver(x) {
  if (x == true) {
    message = "Ganaste";
  } else {
    message = "Perdiste";
  }
  alert(message);
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
