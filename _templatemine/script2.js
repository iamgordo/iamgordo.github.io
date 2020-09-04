let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

let oldtime = 0;
let images = {
    tree: new Image(),
    alarm: new Image(),
    ship: new Image(),
    ball1: new Image(),
};
let loadimages = function () {
    images.tree.src = "palm_tree.png";
    images.alarm.src = "alarm_clock.png";
    images.ship.src = "ship5.png";
    images.ball1.src = "globe.png";
};
let game = {
    entities: [],
    balls: [],
    rotation: 0,
    planet: { x: 150, y: 150, dangle: 0 },
};
let mouse = {
    x: 0,
    y: 0,
    down: false,
    dragging: false,
    angle: 0,

    mousemovehandler: function (ev) {
        let offset = canvas.getBoundingClientRect();
        mouse.x = ev.clientX - offset.left;
        mouse.y = ev.clientY - offset.top;
        var angle = Math.atan2(mouse.y - 300, mouse.x - 300);
        mouse.angle = angle;
    },
    mousedownhandler: function (ev) {
        // todo
    },
};

let div1 = document.getElementById("div1");
let div3 = document.getElementById("div3");
let div2 = document.getElementById("div2");

let tl = new TimelineMax();
let tl2 = new TimelineMax();
let tl3 = new TimelineMax();
tl.to(div1, 1.5, { x: 0, y: 0, rotation: 360, ease: Power2.easeOut });

window.addEventListener("load", function () {
    loadimages();
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
    tl2.to(div3, 1.5, { x: 0, y: 0, rotation: -360, ease: Expo.easeOut });
    div3.onclick = function () {
        div3.style.display = "none";
        div2.style.display = "block";
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        canvas.addEventListener("mousemove", mouse.mousemovehandler, false);
        canvas.addEventListener("mousedown", mouse.mousedownhandler, false);
        let player = new entity(
            images.ship,
            canvas.width / 2,
            canvas.height / 2,
            0,
            0,
            50,
            50,
            0
        );
        tl3.to(images.ball1, 1.5, {
            x: 150,
            y: 150,
            ease: Power1.easeIn,
            onUpdate: getValue,
            onUpdateParams: ["{self}"],
            onComplete: function () {
                junction();
            },
        });
        function getValue(tween) {
            ctx.clearRect(0, 0, 800, 600);
            var element = tween.target;
            ctx.drawImage(
                images.ball1,
                element._gsTransform.x,
                element._gsTransform.y,
                20,
                20
            );
        }
    };
}
// frametime is generating large numbers when focus is lost?
function move(frametime) {
    let timepassed = frametime;
    if (rightPressed) game.rotation += 0.05;
    if (leftPressed) game.rotation -= 0.05;
}
function draw() {
    let rotcoord = myrotate(
        350,
        275,
        game.planet.x,
        game.planet.y,
        game.planet.dangle
    );
    game.planet.dangle += 2;
    ctx.drawImage(images.ball1, rotcoord.x, rotcoord.y, 20, 20);
    for (let i = 0; i < game.entities.length; i++) {
        let thisentity = game.entities[i];
        ctx.save();
        ctx.translate(
            thisentity.x - thisentity.width,
            thisentity.y - thisentity.height
        );
        ctx.rotate(game.rotation);
        ctx.translate(
            -thisentity.x + thisentity.width / 2,
            -thisentity.y + thisentity.height / 2
        );
        ctx.drawImage(
            thisentity.img,
            thisentity.x - thisentity.width,
            thisentity.y - thisentity.height,
            thisentity.width,
            thisentity.height
        );
        ctx.restore();
    }
}
function junction(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffffff";
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
let entity = function (img, x, y, vx, vy, width, height, angle) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = width;
    this.height = height;
    this.angle = angle;

    game.entities.push(this);
};
function myrotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = cos * (x - cx) + sin * (y - cy) + cx,
        ny = cos * (y - cy) - sin * (x - cx) + cy;
    let coords = { x: nx, y: ny };
    return coords;
}
