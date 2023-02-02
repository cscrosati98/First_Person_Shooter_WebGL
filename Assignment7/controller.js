//FileName:	    controller.js
//Programmers:  Dan Cliburn, Dean S., Chris S., Chris C.
//Date:		      11/17/2022
//Purpose:		  This file defines the code for our controller
//The "controller" runs the program and handles events.

alert(
  "Hit 25 or more targets to win the game!\n- Use 'WASD' or the arrow keys to control the player movement\n- Use your mouse to look around\n- Press 'space' to shoot the gun\n- Hit 'f' to enter Fullscreen Mode \n- Click the left mouse button to lock the aim/cursor\n- Hold down 'shift' to aim down the sights of the gun \n- Press 'R' to reset the game.\n"
);

let model;
let view; //the "view" is our Canvas
let timer;
let game;
let screen;

function checkKey(event) {
  switch (event.keyCode) {
    // left arrow / 'A' key
    case 37:
    case 65: {
      updateEyeX(-0.4); //defined in model.js
      break;
    }

    // up arrow / 'W' key
    case 38:
    case 87: {
      updateEye(0.4); //defined in model.js
      break;
    }

    // right arrow / 'D' key
    case 39:
    case 68: {
      updateEyeX(0.4); //defined in model.js
      break;
    }

    // down arrow / 'S' key
    case 40:
    case 83: {
      updateEye(-0.4); //defined in model.js
      break;
    }

    // 'Space' key
    case 32: {
      game.fireBullet(
        new Vector3(...eye),
        new Vector3(...smult(2, norm(sub(aim, eye))))
      );
      break;
    }

    // 'R' key
    case 82: {
      resetModel();
      game = new Game();
      break;
    }
  }
  //redraw the scene so that we can see changes
  drawModel(); //defined in model.js
}

function checkMouse(event) {
  var x = event.movementX;
  var y = event.movementY;
  updateRotY(x / 80);
  updateRotZ(y / 80);

  drawModel();
}
function lockChangeAlert() {
  if (
    document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas
  ) {
    console.log("The pointer lock status is now locked");
  } else {
    console.log("The pointer lock status is now unlocked");
  }
}

function toggleFullScreen() {
  if (canvas.requestFullscreen) {
    screen.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) {
    screen.mozRequestFullScreen(); // Firefox
  } else if (canvas.webkitRequestFullscreen) {
    screen.webkitRequestFullscreen(); // Safari
  } else if (canvas.msRequestFullscreen) {
    screen.msRequestFullscreen(); // IE/Edge
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function controller() {
  //set up the view and the model
  screen = document.getElementById("screen");
  view = initView(); //initView is defined in view.js
  model = initModel(view); //initModel is defined in model.js
  game = new Game();

  if (model) {
    timer = setInterval(() => {
      game.update();
      drawModel();
    }, 100);

    screen.requestPointerLock =
      screen.requestPointerLock || screen.mozRequestPointerLock;
    document.exitPointerLock =
      document.exitPointerLock || document.mozExitPointerLock;
    screen.addEventListener("mousemove", checkMouse, true);
    window.onkeydown = checkKey; //call checkKey whenever a key is pressed
    screen.onclick = () => {
      screen.requestPointerLock();
    };
    document.addEventListener("pointerlockchange", lockChangeAlert, false);
    document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

    document.addEventListener(
      "keyup",
      function (event) {
        if (event.key === "f") {
          toggleFullScreen();
        }
      },
      false
    );

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key === "Shift") {
          aimDownSights(true);
        }
      },
      false
    );

    document.addEventListener(
      "keyup",
      function (event) {
        if (event.key === "Shift") {
          aimDownSights(false);
        }
      },
      false
    );

    drawModel(); // defined in model.js
  } else {
    alert("Could not initialize the view and model");
  }
}
