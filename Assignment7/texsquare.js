//FileName:		texsquare.js
//Programmer:	Dan Cliburn
//Date:			9/22/2020
//Purpose:		This file defines the code for a textured square

//These variables can be accessed in any function
let texsquareVAO;

//Set up the buffers and VAO we need for rendering squares with textures
function initTexSquare(gl)
{
    //Vertex position data for the cube
    const positions = [ -1.0, 1.0, 0.0,     //top left of front face
                        -1.0, -1.0, 0.0,    //bottom left of front face
                        1.0, 1.0, 0.0,      //top right of front face
                        1.0, -1.0, 0.0 ];     //bottom right of front face
    const tex_coords = [0.0, 0.0,
                        0.0, 1.0,
                        1.0, 0.0,
                        1.0, 1.0 ];
    
    //Set up Vertex Array Object
    texsquareVAO = gl.createVertexArray();
    gl.bindVertexArray(texsquareVAO);

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

//We call drawTexSquare to render to our square
function drawTexSquare(gl, color, shininess) 
{  
    //bind the VAO for the cube
    gl.bindVertexArray(texsquareVAO);
 
    gl.vertexAttrib3f(1, color[0], color[1], color[2]); //use a static vertex attribute (location == 1) to set the color
    gl.vertexAttrib3f(2, 0, 0, 1); //use a static vertex attribute (location == 2) to set the normal vector
    gl.vertexAttrib1f(3, shininess); //use a static vertex attribute (location == 3) to set shininess
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}