//FileName:	    bullet.js
//Programmers:  Dan Cliburn, Dean S., Chris S., Chris C.
//Date:		    11/17/2022
//Purpose:      This file defines the code for drawing a bullet.

let bulletVAO;

function initBullet(gl) {
  //Vertex position data for the bullet
  const positions = [
    ...[0, 0, 0],
    ...[0, 1, 0],
    ...[1, 0, 0],
    ...[1, 1, 0], //4 front
    ...[1, 0, 1],
    ...[1, 1, 1],
    ...[0, 0, 1],
    ...[0, 1, 1], //8 left
    ...[0, 1, 0],
    ...[1, 1, 1],
    ...[1, 1, 0],
    ...[0, 0, 1],
    ...[0, 0, 0], //13 Top with top right
  ];
  //Set up Vertex Array Object for the bullet
  bulletVAO = gl.createVertexArray();
  gl.bindVertexArray(bulletVAO);

  //Set up the VBO for the vertex positions
  var vertexPB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0
  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function drawBullet(gl) {
  //bind the VAO for the bullet
  gl.bindVertexArray(bulletVAO);

  gl.vertexAttrib3f(1, 1, 1, 0); //use a static vertex attribute (location == 1) to set the color to yellow
  gl.vertexAttrib3f(2, 1, 1, 1); //use a static vertex attribute (location == 2) to set the normal vector
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 13); //bullet
  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
