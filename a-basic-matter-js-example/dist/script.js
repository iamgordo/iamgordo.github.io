var boxes = [];

var game = {
  cycle: 0,
  width: 800,
  height: 800,
  bodythruportal: 0,
  useableballs: 0,
};
let scrnoutput = document.getElementById("output");

let div2;
document.addEventListener("DOMContentLoaded", myFunction);

function myFunction() {
  div2 = document.getElementById("div2");
  div2.style.visibility = "visible";
  div2.addEventListener("click", function (e) {
    begin();
  });
}
// div2.style.visibility = "visible";
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;
Events = Matter.Events;

function begin() {
  div2.removeEventListener("click", function (e) {});
  div2.style.visibility = "hidden";
  div2.scrollIntoView();
  var keys = [];
  document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    e.preventDefault();
  });
  document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
  });

  var engine = Engine.create();

  var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      background: "rgba(255, 0, 0, 0.0)",
      wireframeBackground: "#222",
      enabled: true,
      wireframes: false,
      showAngleIndicator: false,
    },
  });

  var mouseConstraint = Matter.MouseConstraint.create(engine, {
    //Create Constraint
    element: document.body,
    // offset: { x: -100, y: -20 },
    constraint: {
      render: {
        visible: true,
      },
      stiffness: 0.8,
    },
  });
  World.add(engine.world, mouseConstraint);

  for (var i = 0; i < 20; i++) {
    game.useableballs += 1;
    let rndx = Math.random() * 600 + 70;
    var boxA = Bodies.circle(30, 20 + i * 6, 8, {
      friction: 0.001,
      frictionAir: 0.001,
      // frictionStatic: 0.005,
      restitution: 0.6,
      usable: true,
      render: {
        strokeStyle: "black",
        lineWidth: 2,
      },
    });
    boxes.push(boxA);
    World.add(engine.world, [boxA]);
  }
  let offset = -5;
  World.add(engine.world, [
    Bodies.rectangle(400, -offset, game.width * 2 + 2 * offset, 50, {
      isStatic: true,
      friction: 0.001,
      frictionAir: 0.00001,
    }),
    Bodies.rectangle(65, 250, game.width / 2 + 2 * offset, 10, {
      isStatic: true,
      friction: 0.001,
      angle: 1.565,
    }),
    Bodies.rectangle(50, 440, 50, 20, {
      isStatic: true,
      friction: 0.0001,
    }),
    // Bodies.rectangle(280, 340, game.width / 1.5 + 2 * offset, 10, {
    //   isStatic: true,
    //   friction: 0.0001,
    //   angle: 0.12,
    // }),
    Bodies.rectangle(
      400,
      game.height + offset,
      game.width * 2 + 2 * offset,
      50,
      {
        isStatic: true,
        friction: 0.001,
      }
    ),
    Bodies.rectangle(
      game.width + offset,
      300,
      50,
      game.height * 2 + 2 * offset,
      {
        isStatic: true,
      }
    ),
    Bodies.rectangle(-offset, 300, 50, game.height * 2 + 2 * offset, {
      isStatic: true,
    }),
  ]);
  let portal = Bodies.rectangle(700, 550, 40, 20, {
    isSensor: true,
    isStatic: true,
    render: {
      sprite: {
        texture: "./img/portal.png",
      },
    },
  });
  var ballA = Bodies.circle(380, 100, 21, {
    // isStatic: true,
    restitution: 0.8,
    friction: 0.00001,
    render: {
      sprite: {
        texture: "./img/ball.png",
      },
    },
  });
  var gun = Bodies.rectangle(80, 499, 98, 61, {
    restitution: 0.8,
    friction: 0.00001,
    isStatic: true,
    isSensor: true,
    render: {
      sprite: {
        texture: "./img/gun.png",
      },
    },
  });
  var housing = Bodies.rectangle(46, 512, 120, 100, {
    restitution: 0.8,
    friction: 0.001,
    isStatic: true,
    render: {
      sprite: {
        texture: "./img/gunhousing.png",
      },
    },
  });
  var ballB = Bodies.circle(460, 100, 25, {
    isStatic: true,
    restitution: 0.9,
    friction: 0.01,
    frictionAir: 0.001,
    frictionStatic: 0.005,
    // density: 0.9,
    render: {
      sprite: {
        texture: "./img/mycircle.png",
      },
    },
  });

  var ground = Bodies.rectangle(400, 580, 910, 60, { isStatic: true });

  World.add(engine.world, [ballA, gun, housing, ballB, ground, portal]);
  Engine.run(engine);

  Render.run(render);
  Events.on(engine, "collisionStart", function (event) {
    let pairs = event.pairs;
    for (let i = 0, j = pairs.length; i != j; ++i) {
      let pair = pairs[i];
      let bodA = pair.bodyA.label;
      let bodB = pair.bodyB.label;
      if (pair.bodyB === portal) {
        game.useableballs += 1;
        scrnoutput.innerHTML = game.useableballs;
        pair.bodyA.usable = true;
        Matter.Body.setPosition(pair.bodyA, { x: 40, y: 20 });
        Matter.Body.setVelocity(pair.bodyA, { x: 0, y: 0 });
      }
    }
  });
  Events.on(engine, "beforeTick", function (event) {
    if (keys[39]) {
      ballA.force = {
        x: 0.005,
        y: 0,
      };
    }
    if (keys[37]) {
      ballA.force = {
        x: -0.005,
        y: 0,
      };
    }
    if (keys[40]) {
      if (gun.angle < 0.6) {
        Matter.Body.rotate(gun, Math.PI / 88);
        let gunangle = Math.round((gun.angle * 180) / Math.PI);
      }
    }
    if (keys[38]) {
      if (gun.angle > -1) {
        Matter.Body.rotate(gun, -Math.PI / 88);
        let gunangle = Math.round((gun.angle * 180) / Math.PI);
      }
    }
    if (keys[32]) {
      keys[32] = false;
      shootBall(boxes.length);
    }
  });

  function shootBall(length) {
    if (game.useableballs > 0) {
      let whichball = Math.round(Math.random() * length);
      if (boxes[whichball] && boxes[whichball].usable) {
        boxes[whichball].usable = false;
        let vx = Math.cos(gun.angle) * 0.012;
        let vy = Math.sin(gun.angle) * 0.012;
        Matter.Body.setPosition(boxes[whichball], {
          x: 95 + vx * 3,
          y: 500 + vy * 780,
        });
        boxes[whichball].force = {
          x: vx,
          y: vy,
        };
        game.useableballs -= 1;
        scrnoutput.innerHTML = game.useableballs;
      } else if (boxes.length > 0) shootBall(boxes.length);
    }
  }
}
