//FileName:		gun.js
//Programmer:	Chris
//Date:			  10/14/2022
//Purpose:		This file defines the code for the gun

//This variables can be accessed in any function
let VAO, vertexPB;

//Set up the buffer and VAO we need for rendering the gun
function initGun(gl) {
  //Vertex position data for the gun
  const positions = [
    //gun outline
    ...[1.0, 1.5, 0.25], //v0
    ...[1.0, 1.5, 0.0], //v1
    ...[-1.0, 1.5, 0.25], //v2
    ...[-1.0, 1.5, 0.0], //v3
    ...[-1, 1.1, 0.25], //v4
    ...[-1, 1.1, 0], //v5
    ...[-0.75, 1.05, 0.25], //v6
    ...[-0.75, 1.05, 0], //v7
    ...[-1, 0.0, 0.25], //v8
    ...[-1, 0, 0], //v9
    ...[-0.5, 0, 0.25], //v10
    ...[-0.5, 0, 0], //v11
    ...[-0.3, 0.75, 0.25], //v12
    ...[-0.3, 0.75, 0], //v13
    ...[0, 0.9, 0.25], //v14
    ...[0, 0.9, 0], //v15
    ...[0.05, 1.1, 0.25], //v16
    ...[0.05, 1.1, 0], //v17
    ...[1, 1.1, 0.25], //v18
    ...[1, 1.1, 0], //v19
    ...[1, 1.5, 0.25], //v20
    ...[1, 1.5, 0], //v21 //gun fill
    ...[1, 1.1, 0], //v22
    ...[-1, 1.1, 0], //v23
    ...[-1, 1.5, 0], //v24
    ...[1, 1.5, 0], //v25//top slide fill
    ...[-1, 1.1, 0], //v26
    ...[-0.75, 1.05, 0], //v27
    ...[-0.3, 1.1, 0], //v28
    ...[-1, 0, 0], //v29
    ...[-0.2, 1.1, 0], //v30
    ...[-0.5, 0, 0], //v31
    ...[-0.2, 1.1, 0.25], //v32
    ...[-0.2, 1.1, 0.25], //v33
    ...[-1, 0, 0.25], //v34
    ...[-0.5, 0, 0.25], //v35
    ...[-0.75, 1.5, 0.25], //v36
    ...[-0.75, 1.5, 0.25], //v37
    ...[-1, 1.1, 0.25], //v38
    ...[1, 1.1, 0.25], //v39
    ...[1, 1.5, 0.25], //v40
    ...[-1, 1.5, 0.25], //v41
  ];
  const tex_coords = [
    ...[1.5, 0.25], //v0
    ...[1.5, 0.0], //v1
    ...[1.5, 0.25], //v2
    ...[1.5, 0.0], //v3
    ...[1.1, 0.25], //v4
    ...[1.1, 0], //v5
    ...[1.05, 0.25], //v6
    ...[1.05, 0], //v7
    ...[0.0, 0.25], //v8
    ...[0, 0], //v9
    ...[0, 0.25], //v10
    ...[0, 0], //v11
    ...[0.75, 0.25], //v12
    ...[0.75, 0], //v13
    ...[0.9, 0.25], //v14
    ...[0.9, 0], //v15
    ...[1.1, 0.25], //v16
    ...[1.1, 0], //v17
    ...[1.1, 0.25], //v18
    ...[1.1, 0], //v19
    ...[1.5, 0.25], //v20
    ...[1.5, 0], //v21 //gun fill
    ...[1.1, 0], //v22
    ...[1.1, 0], //v23
    ...[1.5, 0], //v24
    ...[1.5, 0], //v25//top slide fill
    ...[1.1, 0], //v26
    ...[1.05, 0], //v27
    ...[1.1, 0], //v28
    ...[0, 0], //v29
    ...[1.1, 0], //v30
    ...[0, 0], //v31
    ...[1.1, 0.25], //v32
    ...[1.1, 0.25], //v33
    ...[0, 0.25], //v34
    ...[0, 0.25], //v35
    ...[1.5, 0.25], //v36
    ...[1.5, 0.25], //v37
    ...[1.1, 0.25], //v38
    ...[1.1, 0.25], //v39
    ...[1.5, 0.25], //v40
    ...[1.5, 0.25], //v41
  ];
  //Set up Vertex Array Object
  VAO = gl.createVertexArray();
  gl.bindVertexArray(VAO);

  //Set up the VBO for the gun vertex positions
  vertexPB = gl.createBuffer();
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

function drawGun(gl) {
  //Bind the VAO for our gun
  gl.bindVertexArray(VAO);

  gl.vertexAttrib1f(3, 1); //use a static vertex attribute (location == 3) to set shininess for all polygons to 1.0

  //all triangles and points will have the same normal vector, so we will set it once with a static vertex attribute
  gl.vertexAttrib3f(2, 1, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 42);

  //Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
