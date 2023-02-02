//FileName:		  model.js
//Programmers:  Dan Cliburn, Dean S., Chris S., Chris C.
//Date:			    11/17/2022
//Purpose:		  This file defines the code for our WebGL 2 model
//The "model" is all of the WebGL2 code that draws our graphics scene

//These variables can be accessed in any function
let gl;
let mat4;
// programs
let phongTexProgram, phongSpriteProgram, fogProgram, uiProgram;
// matrices
let projectionMatrix, viewMatrix, modelMatrix;
let projectionMatrixLoc, viewMatrixLoc, modelMatrixLoc;
// variables to control movement
let rotY,
  rotZ,
  eye = [],
  aim = [];
// textures
let crosshairTex,
  gunTex,
  winTex,
  loseTex,
  restartTex,
  floorTex,
  wallTex,
  targetTex,
  corpseTex;
// variables to control the gun's position
let offsetGun, offsetGunX, gunPos, gunRot;

//Given a canvas element, return the WebGL2 context
//This function is defined in section "Architecture Updates" of the textbook
function getGLContext(canvas) {
  return (
    canvas.getContext("webgl2") ||
    console.error("WebGL2 is not available in your browser.")
  );
}

//Given an id, extract the content's of a shader script from the DOM and return the compiled shader
//This function is defined in section "Time for Action: Rendering a Square" of the textbook
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === "shader.vert") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else if (script.type === "shader.frag") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else {
    return null;
  }
  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);
  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

//Load all of the shader programs
function initPrograms() {
  //Load, compile, and link the shader code for the phongTexProgram
  const vertexShader1 = getShader("phong-tex-vertex-shader");
  const fragmentShader1 = getShader("phong-tex-fragment-shader");
  phongTexProgram = gl.createProgram(); //create a program

  gl.attachShader(phongTexProgram, vertexShader1); //Attach the vertex shader to this program
  gl.attachShader(phongTexProgram, fragmentShader1); //Attach the fragment shader to this program
  gl.linkProgram(phongTexProgram);
  if (!gl.getProgramParameter(phongTexProgram, gl.LINK_STATUS)) {
    console.error("Could not initialize phong_tex_program shaders");
  }

  //Load, compile, and link the shader code for the pointSpriteProgram
  const vertexShader3 = getShader("point-sprite-vertex-shader");
  const fragmentShader3 = getShader("point-sprite-fragment-shader");
  phongSpriteProgram = gl.createProgram(); //create a program

  gl.attachShader(phongSpriteProgram, vertexShader3); //Attach the vertex shader to this program
  gl.attachShader(phongSpriteProgram, fragmentShader3); //Attach the fragment shader to this program
  gl.linkProgram(phongSpriteProgram);
  if (!gl.getProgramParameter(phongSpriteProgram, gl.LINK_STATUS)) {
    console.error("Could not initialize point_sprite_program shaders");
  }

  //Load, compile, and link the shader code for the fogProgram
  const vertexShader4 = getShader("fog-vertex-shader");
  const fragmentShader4 = getShader("fog-fragment-shader");
  fogProgram = gl.createProgram();

  gl.attachShader(fogProgram, vertexShader4);
  gl.attachShader(fogProgram, fragmentShader4);
  gl.linkProgram(fogProgram);
  if (!gl.getProgramParameter(fogProgram, gl.LINK_STATUS)) {
    console.error("Could not initialize fog_program shaders");
  }

  //Load, compile, and link the shader code for the uiProgram
  const vertexShader5 = getShader("ui-vertex-shader");
  const fragmentShader5 = getShader("ui-fragment-shader");
  uiProgram = gl.createProgram();
  gl.attachShader(uiProgram, vertexShader5);
  gl.attachShader(uiProgram, fragmentShader5);
  gl.linkProgram(uiProgram);
  if (!gl.getProgramParameter(uiProgram, gl.LINK_STATUS)) {
    console.error("Could not initialize ui_program shaders");
  }
}

//Find the locations of the matrices in the active shader program
function initMatrices(program) {
  modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
  viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
}

//Initialize the light for the active shader program
function initLights(program) {
  //find uniform variable locations for the light
  var globalAmbientLightLoc = gl.getUniformLocation(
    program,
    "globalAmbientLight"
  );
  var lightColorLoc = gl.getUniformLocation(program, "light_color");
  var lightPosLoc = gl.getUniformLocation(program, "light_position");

  //set up the light for the scene
  gl.uniform3f(globalAmbientLightLoc, 0.5, 0.5, 0.5); //minimum light level in the scene
  gl.uniform4f(lightColorLoc, 0.2, 0.2, 0.2, 1.0); //color of the light (in this case it is white)
  gl.uniform4f(lightPosLoc, 20.0, 20.0, 20.0, 1.0); //positional light since w = 1
}

//This function was written to assist with changing the active shader program and binding uniform locations to correct values
function changeShaderProgram(program, lights, projection, view, model) {
  gl.useProgram(program); //set the active shader program

  if (lights == 1) initLights(program); //set up lights to work with this shader program if lights == 1

  initMatrices(program); //set up matrices to work with this shader program, then update to current values
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projection);
  gl.uniformMatrix4fv(viewMatrixLoc, false, view);
  gl.uniformMatrix4fv(modelMatrixLoc, false, model);
}

//initialize all of the buffers we need for our program
function initBuffers() {
  // defined in room.js
  initGround(gl);
  initRoof(gl);
  initWall(gl);
  // defined in texsquare.js
  initTexSquare(gl);
  // defined in gun.js
  initGun(gl);
  // defined in bullet.js
  initBullet(gl);
}

function initTex(id, tex) {
  var Image = document.getElementById(id);

  //create a texture object, bind an image to the texture object, and define texture filtering modes
  tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );

  return tex;
}

//Initialize textures to be used in the program
function initTextures() {
  // These images are loaded in index.html
  floorTex = initTex("floor", floorTex);
  wallTex = initTex("wall", wallTex);
  crosshairTex = initTex("crosshair", crosshairTex);
  targetTex = initTex("target", targetTex);
  gunTex = initTex("gun", gunTex);
  winTex = initTex("win", winTex);
  loseTex = initTex("lose", loseTex);
  restartTex = initTex("restart", restartTex);
  corpseTex = initTex("corpse", corpseTex);

  gl.bindTexture(gl.TEXTURE_2D, null);
}

//We call drawModel to render to our canvas
function drawModel() {
  //Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //define the view orientation transformation matrix based on current values for eye, aim, and up
  const up = [0.0, 1.0, 0];
  viewMatrix = mat4.lookAt(viewMatrix, eye, aim, up); //calculate the view orientation matrix

  // Set the active shader program to the fogProgram, then bind uniform variables and update matrices for this shader
  changeShaderProgram(
    fogProgram,
    1,
    projectionMatrix,
    viewMatrix,
    mat4.identity(modelMatrix)
  );
  const fogColorLoc = gl.getUniformLocation(fogProgram, "fogColor");
  gl.uniform4f(fogColorLoc, 0.1, 0, 0.1, 0.5);

  // Draw all of the bullets
  for (const bullet of game.bullets) {
    const vec = [bullet.position.x, bullet.position.y, bullet.position.z];
    modelMatrix = mat4.translate(modelMatrix, mat4.identity(modelMatrix), vec);
    modelMatrix = mat4.scale(modelMatrix, modelMatrix, [0.03, 0.05, 0.03]);
    // Add a small visual offset
    var vec1 = [-1.1, -0.05, 1.2];
    modelMatrix = mat4.translate(modelMatrix, modelMatrix, vec1);
    gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix); //send the updated model matrix to the shaders
    drawBullet(gl);
  }

  // Set active shader program to phongTexProgram, then bind uniform variables and update matrices for this shader
  changeShaderProgram(
    phongTexProgram,
    1,
    projectionMatrix,
    viewMatrix,
    mat4.identity(modelMatrix)
  );
  var samplerLoc = gl.getUniformLocation(phongTexProgram, "tex_image"); //bind samplerLoc for this shader
  gl.activeTexture(gl.TEXTURE0); //Set the current texture number
  gl.uniform1i(samplerLoc, 0); //tell shaders that the sample variable should be associated with gl.TEXTURE0

  // Draw the ground
  gl.bindTexture(gl.TEXTURE_2D, floorTex); //use the floorTex for this square
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  drawGround(gl); //draw the model of the ground, defined in ground.js

  // Draw the roof
  gl.bindTexture(gl.TEXTURE_2D, floorTex); //use the floorTex for this square
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  drawRoof(gl); //draw the model of the ground, defined in ground.js

  // Draw the walls
  gl.bindTexture(gl.TEXTURE_2D, wallTex); //use the wallTex for this square
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  drawWall(gl, 1);

  gl.bindTexture(gl.TEXTURE_2D, wallTex); //use the wallTex for this square
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  drawWall(gl, 2);

  gl.bindTexture(gl.TEXTURE_2D, wallTex); //use the wallTex for this square
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  drawWall(gl, 3);

  gl.bindTexture(gl.TEXTURE_2D, wallTex); //use the v for this square
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  drawWall(gl, 4);

  // Draw the gun
  var div_value = 1.2;
  var scale_amount = [1, 1, 1];
  const rotate_axis = [0.0, 1.0, 0.0];
  const rotate_axis1 = [0.0, 0.0, 1.0];
  const rotate_axis2 = [1.0, 0.0, 0.0];
  modelMatrix = mat4.translate(modelMatrix, mat4.identity(modelMatrix), eye);
  modelMatrix = mat4.scale(modelMatrix, modelMatrix, scale_amount);
  modelMatrix = mat4.rotate(modelMatrix, modelMatrix, -0.1 - rotY, rotate_axis); //NOTE: angle in radians
  modelMatrix = mat4.rotate(
    modelMatrix,
    modelMatrix,
    -rotZ / div_value,
    rotate_axis1
  ); //NOTE: angle in radians
  modelMatrix = mat4.translate(modelMatrix, modelMatrix, gunPos);
  modelMatrix = mat4.rotate(modelMatrix, modelMatrix, gunRot, rotate_axis); //NOTE: angle in radians
  gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix); //send the updated model matrix to the shaders
  gl.bindTexture(gl.TEXTURE_2D, gunTex); //use the gunTex for this square
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  drawGun(gl); //defined in gun.js

  // Activate and bind uniform variables for the pointSpriteProgram shader
  changeShaderProgram(
    phongSpriteProgram,
    0,
    projectionMatrix,
    viewMatrix,
    mat4.identity(modelMatrix)
  );

  samplerLoc = gl.getUniformLocation(phongSpriteProgram, "tex_image"); //bind samplerLoc for this shader

  // scatter some corpses around the room
  for (const corpse of game.corpses) {
    modelMatrix = mat4.translate(modelMatrix, mat4.identity(modelMatrix), [
      corpse.x,
      corpse.y,
      corpse.z,
    ]);
    gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
    gl.bindTexture(gl.TEXTURE_2D, corpseTex);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  // Draw all of the active targets.
  for (const target of game.targets.filter(
    (target) => target.state === TargetState.ACTIVE
  )) {
    const vec = [target.position.x, target.position.y, target.position.z];
    modelMatrix = mat4.translate(modelMatrix, mat4.identity(modelMatrix), vec);
    gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix);
    gl.bindTexture(gl.TEXTURE_2D, targetTex);
    gl.drawArrays(gl.POINTS, 0, 1); //draw one point sprite at (0,5.0,0)
  }

  // Draw the crosshair
  modelMatrix = mat4.translate(modelMatrix, mat4.identity(modelMatrix), eye);
  modelMatrix = mat4.rotate(modelMatrix, modelMatrix, -0.1 - rotY, rotate_axis); //NOTE: angle in radians
  modelMatrix = mat4.rotate(
    modelMatrix,
    modelMatrix,
    -rotZ / div_value,
    rotate_axis1
  ); //NOTE: angle in radians
  modelMatrix = mat4.rotate(
    modelMatrix,
    modelMatrix,
    -rotZ / div_value,
    rotate_axis2
  ); //NOTE: angle in radians
  var vec1 = [1, 0, -0.11];
  modelMatrix = mat4.translate(modelMatrix, modelMatrix, vec1);
  gl.uniformMatrix4fv(modelMatrixLoc, false, modelMatrix); //send the updated model matrix to the shaders
  gl.bindTexture(gl.TEXTURE_2D, crosshairTex);
  // Draw a point sprite at (0, 0, 0)
  gl.vertexAttrib3f(0, 0, 0, 0);
  gl.drawArrays(gl.POINTS, 0, 1);

  // Setup 2D program
  gl.useProgram(uiProgram);

  if (game.state === GameState.WIN) {
    gl.bindTexture(gl.TEXTURE_2D, winTex);
    // Draw a point sprite at (0, 0, 0)
    gl.vertexAttrib3f(0, 0, 0, 0); //use a static vertex attribute (location == 0) to set the position to (0, 0, 0, 0)
    gl.drawArrays(gl.POINTS, 0, 1);
  } else if (game.state === GameState.LOSE) {
    gl.bindTexture(gl.TEXTURE_2D, loseTex);
    // Draw a point sprite at (0, 0, 0)
    gl.vertexAttrib3f(0, 0, 0, 0); //use a static vertex attribute (location == 0) to set the position to (0, 0, 0, 0)
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  if (game.state === GameState.WIN || game.state === GameState.LOSE) {
    gl.bindTexture(gl.TEXTURE_2D, restartTex);
    // Draw a point sprite at (0, 0.5, 0)
    gl.vertexAttrib3f(0, 0, 0.5, 0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  // Update the score
  document.getElementById("score").innerHTML = game.targets.filter(
    (target) => target.state === TargetState.HIT
  ).length;

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//return the WebGL context to the caller
function initModel(view) {
  gl = getGLContext(view);
  if (gl) {
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    //turn on the depth test
    gl.enable(gl.DEPTH_TEST);

    //load the shader programs
    initPrograms();

    //Define mat4
    mat4 = glMatrix.mat4;

    // Create matrices then define the projection transformation matrix here since it never changes
    modelMatrix = mat4.create();
    viewMatrix = mat4.create();
    projectionMatrix = mat4.create();
    projectionMatrix = mat4.frustum(
      projectionMatrix,
      -0.1,
      0.1,
      -0.1,
      0.1,
      0.1,
      50.0
    );

    // create buffers for all the objects we want to render and load textures we will use
    initBuffers();
    initTextures();

    //initialize movement variables
    gunPos = [2.25, -1.5, 0.8];
    gunRot = 0;
    rotY = 3.14159 / 2.0; //initial angle is PI/2 (90 degrees) which is looking down the positive z axis
    rotZ = 0;
    offsetGun = 0.1;
    offsetGunX = 0.1;
    div_value = 1.2;
    eye = [0.0, 5.0, -10.0];
    aim = [0.0, 0.0, 0.0];
    updateEye(0.1); //will set aim to be looking down the positive z-axis

    return gl;
  }
  return null;
}

function updateEye(offset) {
  offsetGun = offsetGun + offset;

  if (eye[2] < 16.9 && eye[2] > -16.9 && eye[0] > -16.9 && eye[0] < 16.9) {
    eye[0] += Math.cos(rotY) * offset;
    eye[2] += Math.sin(rotY) * offset;
  } else if (eye[2] >= 16.9) {
    eye[2] = 16.89;
  } else if (eye[2] <= -16.9) {
    eye[2] = -16.89;
  } else if (eye[0] >= 16.9) {
    eye[0] = 16.89;
  } else if (eye[0] <= -16.9) {
    eye[0] = -16.89;
  }

  //Adjust the aim position from the new eye position
  aim[0] = eye[0] + Math.cos(rotY);
  //aim[1] = eye[1] + -rotZ;
  aim[2] = eye[2] + Math.sin(rotY);
}

function updateEyeX(offset) {
  offsetGunX = offsetGunX + offset;

  if (eye[2] < 16.9 && eye[2] > -16.9 && eye[0] > -16.9 && eye[0] < 16.9) {
    eye[0] += Math.sin(-rotY) * offset;
    eye[2] += Math.cos(-rotY) * offset;
  } else if (eye[2] >= 16.9) {
    eye[2] = 16.89;
  } else if (eye[2] <= -16.9) {
    eye[2] = -16.89;
  } else if (eye[0] >= 16.9) {
    eye[0] = 16.89;
  } else if (eye[0] <= -16.9) {
    eye[0] = -16.89;
  }

  //Adjust the aim position from the new eye position
  aim[0] = eye[0] + Math.cos(rotY);
  //aim[1] = eye[1] + -rotZ;
  aim[2] = eye[2] + Math.sin(rotY);
}

function updateRotY(offset) {
  rotY = rotY + offset;

  //Adjust the aim position based on the new rotY
  aim[0] = eye[0] + Math.cos(rotY);
  aim[2] = eye[2] + Math.sin(rotY);
}

function updateRotZ(offset) {
  rotZ = rotZ + offset;
  //     //Adjust the aim position based on the new rotZ
  if (rotZ > -2.5 && rotZ < 2.5) {
    aim[1] = eye[1] + -rotZ;
    //rotZ = rotZ + offset;
  } else if (rotZ <= -2.5) {
    rotZ = -2.49;
  } else {
    rotZ = 2.49;
  }
}

function aimDownSights(check) {
  if (check) {
    gunPos = [1.6, -2, -0.2];
    gunRot = 0.1;
  } else {
    gunPos = [2.25, -1.5, 0.8];
    gunRot = 0;
  }
}

function resetModel() {
  rotY = 3.14159 / 2.0;
  rotZ = 0;
  eye[0] = 0.0;
  eye[1] = 5.0;
  eye[2] = -10.0;
  updateRotY(0.0);
  updateRotZ(0.0);
  offsetGun = 0.1;
  offsetGunX = 0.1;
  gunPos = [2.25, -1.5, 0.8];
  gunRot = 0;
  div_value = 1.2;
}
