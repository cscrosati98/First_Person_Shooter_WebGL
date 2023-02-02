//FileName:	    room.js
//Programmers:  Chris S.
//Date:		    11/17/2022
//Purpose:		This file defines the code for drawing the room.

let groundVAO, roofVAO, wallVAO1, wallVAO2, wallVAO3, wallVAO4;

//Set up the buffer and VAO we need for rendering the ground
function initGround(gl) {
  //Vertex position data for the ground
  const positions = [
    ...[-20.0, 0.0, -20.0], //base
    ...[-20.0, 0.0, 20.0],
    ...[20.0, 0.0, -20.0],
    ...[20.0, 0.0, 20.0],
  ];
  const tex_coords = [...[0.0, 0.0], ...[0.0, 5], ...[5, 0.0], ...[5, 5]];
  //Set up Vertex Array Object for the ground
  groundVAO = gl.createVertexArray();
  gl.bindVertexArray(groundVAO);

  //Set up the VBO for the vertex positions
  var vertexPB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  var tcBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
  gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(4);
  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//Set up the buffer and VAO we need for rendering the roof
function initRoof(gl) {
  //Vertex position data for the roof
  const positions = [
    ...[-20.0, 20, -20.0], //base
    ...[-20.0, 20, 20.0],
    ...[20.0, 20, -20.0],
    ...[20.0, 20, 20.0],
  ];
  const tex_coords = [...[0.0, 0.0], ...[0.0, 5], ...[5, 0.0], ...[5, 5]];
  //Set up Vertex Array Object for the roof
  roofVAO = gl.createVertexArray();
  gl.bindVertexArray(roofVAO);

  //Set up the VBO for the vertex positions
  var vertexPB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  var tcBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
  gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(4);
  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//Set up the buffer and VAO we need for rendering the walls
function initWall(gl) {
  //Vertex position data for the wall
  const pos1 = [
    ...[-20.0, 20.0, -20.0], //back
    ...[-20.0, 0.0, -20.0],
    ...[20.0, 20.0, -20.0],
    ...[20.0, 0.0, -20.0],
  ];
  const pos2 = [
    ...[20.0, 20.0, 20.0], //front
    ...[20.0, 0.0, 20.0],
    ...[-20.0, 20.0, 20.0],
    ...[-20.0, 0.0, 20.0],
  ];
  const pos3 = [
    ...[20.0, 20.0, -20.0], //right
    ...[20.0, 0.0, -20.0],
    ...[20.0, 20.0, 20.0],
    ...[20.0, 0.0, 20.0],
  ];
  const pos4 = [
    ...[-20.0, 20.0, 20.0], //left
    ...[-20.0, 0.0, 20.0],
    ...[-20.0, 20.0, -20.0],
    ...[-20.0, 0.0, -20.0],
  ];
  const tex_coords = [...[0.0, 0.0], ...[0.0, 1.5], ...[3, 0.0], ...[3, 1.5]];
  //Set up Vertex Array Object for the wall
  wallVAO1 = gl.createVertexArray();
  gl.bindVertexArray(wallVAO1);

  //Set up the VBO for the vertex positions
  var vertexPB1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos1), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  var tcBuffer1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
  gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(4);

  wallVAO2 = gl.createVertexArray();
  gl.bindVertexArray(wallVAO2);

  //Set up the VBO for the vertex positions
  var vertexPB2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos2), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

  var tcBuffer2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
  gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(4);

  wallVAO3 = gl.createVertexArray();
  gl.bindVertexArray(wallVAO3);

  //Set up the VBO for the vertex positions
  var vertexPB3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB3);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos3), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0
  var tcBuffer3 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer3);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
  gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(4);
  ////////////
  wallVAO4 = gl.createVertexArray();
  gl.bindVertexArray(wallVAO4);

  //Set up the VBO for the vertex positions
  var vertexPB4 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB4);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos4), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0
  var tcBuffer4 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tcBuffer4);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);
  gl.vertexAttribPointer(4, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(4);
  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//We call drawGround to render the ground model
function drawGround(gl) {
  //bind the VAO for the ground
  gl.bindVertexArray(groundVAO);

  gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
  gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //floor
  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//We call drawGround to render the roof model
function drawRoof(gl) {
  //bind the VAO for the roof
  gl.bindVertexArray(roofVAO);

  gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
  gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //floor
  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

//We call drawGround to render the walls
function drawWall(gl, side) {
  switch (side) {
    case 1: {
      gl.bindVertexArray(wallVAO1);
      gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
      gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //wall
      break;
    }
    case 2: {
      gl.bindVertexArray(wallVAO2);
      gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
      gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //wall
      break;
    }
    case 3: {
      gl.bindVertexArray(wallVAO3);
      gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
      gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //wall
      break;
    }
    case 4: {
      gl.bindVertexArray(wallVAO4);
      gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
      gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //wall
      break;
    }
  }
}
