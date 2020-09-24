let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

let oldtime = 0;
let elements = [];
let images = {
    tree: new Image(),
    alarm: new Image(),
    road: new Image(),
    house: new Image(),
    housered: new Image(),
    bike: new Image(),
    papers: new Image(),
    car1: new Image(),
    paper: new Image(),
};
let loadimages = function () {
    images.tree.src = "palm_tree.png";
    images.alarm.src = "alarm_clock.png";
    images.road.src = "road.png";
    images.house.src = "house.png";
    images.housered.src = "housered.png";
    images.bike.src = "bike.png";
    images.papers.src = "news2.png";
    images.car1.src = "car1.png";
    images.paper.src = "paper.png";
};
let game = {
    road: new element(images.road, 275, 0, 275, 600, 0, 0.05, "road"),
    road2: new element(images.road, 275, -599, 275, 600, 0, 0.05, "road2"),
    house1: new element(images.house, 640, 300, 151, 152, 0, 0.05, "house"),
    housered: new element(
        images.housered,
        640,
        0,
        151,
        152,
        0,
        0.05,
        "housered"
    ),
    bike: new element(images.bike, 266, 500, 50, 100, 0.06, 2, "bike"),
    papers: new element(images.papers, 534, 200, 50, 40, 0, 0.05, "papers"),
    car1: new element(images.car1, 340, -100, 50, 100, 0, 0.1, "car1"),
    canMove: true,
    canthrow: true,
};
let mouse = {
    x: 0,
    y: 0,
    down: false,
    dragging: false,

    mousemovehandler: function (ev) {
        let offset = canvas.getBoundingClientRect();
        mouse.x = ev.clientX - offset.left;
        mouse.y = ev.clientY - offset.top;
    },
    mousedownhandler: function (ev) {
        // todo
    },
};

let div1 = document.getElementById("div1");
let div3 = document.getElementById("div3");
let div2 = document.getElementById("div2");

let tl = new TimelineMax({ repeat: 0 });
let tl2 = new TimelineMax();
tl.from(div1, 1, { x: 0, y: 0, scale: 0.2, ease: Power2.easeOut });
loadimages();

window.addEventListener("load", function () {
    start();
});

function start() {
    div3.style.display = "none";
    div2.style.display = "none";
    div1.onclick = function () {
        div1.style.display = "none";
        div3.style.display = "block";
        start2();
    };
}
function start2() {
    tl2.from(div3, 1, { x: 0, y: 0, scale: 0.2, ease: Expo.easeOut });
    div3.onclick = function () {
        div3.style.display = "none";
        div2.style.visibility = "visible";
        div2.style.display = "block";
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        canvas.addEventListener("mousemove", mouse.mousemovehandler, false);
        canvas.addEventListener("mousedown", mouse.mousedownhandler, false);
        junction();
    };
}
// change to accept element parameter
function move(frametime) {
    if (isNaN(frametime)) {
        frametime = 1;
    } else {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].name === "paper") {
                if (elements[i].x < 800 && elements[i].x > 0) {
                    // todo remove when off screen
                    // elements[i].checkedge();
                    elements[i].y += frametime * elements[i].vy;
                    elements[i].x += frametime * elements[i].vx;
                } else elements.splice(i, 1);
            }
        }
        game.road.checkedge();
        game.road2.checkedge();
        game.house1.checkedge();
        game.housered.checkedge();
        game.papers.checkedge();
        game.car1.checkedge();
        game.road.y += frametime * game.road.vy;
        game.road2.y += frametime * game.road2.vy;
        game.house1.y += frametime * game.house1.vy;
        game.housered.y += frametime * game.housered.vy;
        game.papers.y += frametime * game.papers.vy;
        game.car1.y += frametime * game.car1.vy;
    }
    if (rightPressed && game.canMove && game.bike.x < 506) {
        TweenMax.to(game.bike, 0.3, { x: "+=80", onComplete: onComplete });
        game.canMove = false;
    }
    if (leftPressed && game.canMove && game.bike.x > 266) {
        TweenMax.to(game.bike, 0.3, { x: "-=80", onComplete: onComplete });
        game.canMove = false;
    }
    if (upPressed && game.canthrow) {
        game.canthrow = false;
        // console.log(elements.length);
        let paper1 = new element(
            images.paper,
            game.bike.x + game.bike.width / 2,
            game.bike.y + game.bike.height / 2,
            40,
            12,
            0.5,
            0.03,
            "paper"
        );
    }
    if (downPressed) {
        // todo
    }
    function onComplete() {
        game.canMove = true;
        //todo
    }
}
function draw() {
    ctx.drawImage(game.road.img, game.road.x, game.road.y);
    ctx.drawImage(game.road2.img, game.road2.x, game.road2.y);
    ctx.drawImage(game.house1.img, game.house1.x, game.house1.y);
    ctx.drawImage(game.housered.img, game.housered.x, game.housered.y);
    ctx.drawImage(
        game.papers.img,
        game.papers.x,
        game.papers.y,
        game.papers.width,
        game.papers.height
    );
    ctx.drawImage(
        game.car1.img,
        game.car1.x,
        game.car1.y,
        game.car1.width,
        game.car1.height
    );
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].name === "paper") {
            ctx.drawImage(
                elements[i].img,
                elements[i].x,
                elements[i].y,
                elements[i].width,
                elements[i].height
            );
        }
    }
    ctx.drawImage(
        game.bike.img,
        game.bike.x,
        game.bike.y,
        game.bike.width,
        game.bike.height
    );
}
function junction(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Arial";
    ctx.fillText("Mouse X: " + mouse.x + " Mouse Y: " + mouse.y, 10, 30);
    let thetime = timestamp;
    frametime = thetime - oldtime;
    oldtime = thetime;

    move(frametime);
    draw();
    requestAnimationFrame(junction);
}
function keyDownHandler(event) {
    if (event.keyCode == 39) {
        rightPressed = true;
    } else if (event.keyCode == 37) {
        leftPressed = true;
    }
    if (event.keyCode == 40) {
        downPressed = true;
    } else if (event.keyCode == 38) {
        upPressed = true;
    }
}
function keyUpHandler(event) {
    if (event.keyCode == 39) {
        rightPressed = false;
    } else if (event.keyCode == 37) {
        leftPressed = false;
    }
    if (event.keyCode == 40) {
        downPressed = false;
    } else if (event.keyCode == 38) {
        upPressed = false;
        game.canthrow = true;
    }
}
function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function randnum(max) {
    var rnd = Math.floor(Math.random() * max);
    return rnd;
}
function collisionResponse(boda, bodb) {
    let vCollision = { x: bodb.x - boda.x, y: bodb.y - boda.y };

    let distance = Math.sqrt(
        (bodb.x - boda.x) * (bodb.x - boda.x) +
            (bodb.y - boda.y) * (bodb.y - boda.y)
    );

    let vCollisionNorm = {
        x: vCollision.x / distance,
        y: vCollision.y / distance,
    };

    let vRelativeVelocity = {
        x: boda.xspeed - bodb.xspeed,
        y: boda.yspeed - bodb.yspeed,
    };
    let speed =
        vRelativeVelocity.x * vCollisionNorm.x +
        vRelativeVelocity.y * vCollisionNorm.y;

    boda.xspeed -= speed * vCollisionNorm.x;
    boda.yspeed -= speed * vCollisionNorm.y;
    bodb.xspeed += speed * vCollisionNorm.x;
    bodb.yspeed += speed * vCollisionNorm.y;
}
// add name property
function element(img, x, y, w, h, vx, vy, name) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.vx = vx;
    this.vy = vy;
    this.name = name;
    elements.push(this);
}
// note: expand level by subtracting y value to -1200 for example.
element.prototype.checkedge = function () {
    if (this.y > 600) this.y = -599;
    // console.log(this.name);
};
element.prototype.rightside = function () {
    let rside = this.x + this.width;
    return rside;
};
element.prototype.bottomside = function () {
    let bside = this.y + this.height;
    return bside;
};
