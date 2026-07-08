const waterCanvas = document.getElementById("water-canvas");
const gl = waterCanvas.getContext("webgl");


//---------- vertex shader
const vertexSrc = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position,0.0,1.0);
    }
`;

// ----------- Fragement shader
const fragmentSrc = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec3 u_baseColor;
    uniform vec4 u_ripples[12];
    uniform int u_rippleCount;
    
    void main() {
        vec2 uv = gl_FragCoord.xy;
        uv.y = u_resolution.y - uv.y;
        
        float height = 0.0;
        
        for (int i=0; i<12; i++) {
            if (i>= u_rippleCount) break;
            vec2 pos = u_ripples[i].xy;
            float startTime = u_ripples[i].z;
            float strength = u_ripples[i].w;
            float age = u_time - startTime;
            if (age <0.0 || age > 3.0) continue;
            
            float dist = distance(uv,pos);
            
            // the actual wave formula
            float wave = sin(dist * 0.1 - age * 5.0)
                    * exp(-age*1.5) //makes the wave weaker the older it is 
                    * exp(-dist * 0.02) //makes the wave weaker the further away from the center
                    * strength;
            height += wave;
        }
        // gentle constant motion
        float ambient = sin(uv.x * 0.02 + u_time * 0.5) * 0.015 // horizontal waves
                        + sin(uv.y * 0.03 - u_time * 0.3) * 0.015; //verticle waves
        height += ambient;
        vec3 color = u_baseColor + height * 0.2; // different colours at different heights of the waves

        gl_FragColor = vec4(color, 1.0);
    }
`;

//compiles shader from source text into something the gpu can use 
function compileShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
const fs = compileShader(gl,gl.FRAGMENT_SHADER,fragmentSrc);

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

const positions = new Float32Array([
    -1,-1,  1,-1,  -1,1,
    -1,1,   1,-1,   1,1
]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(posLoc);
gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false,0,0);

const u_resolution = gl.getUniformLocation(program, "u_resolution");
const u_time       = gl.getUniformLocation(program, "u_time");
const u_baseColor  = gl.getUniformLocation(program, "u_baseColor");
const u_ripples    = gl.getUniformLocation(program, "u_ripples");
const u_rippleCount= gl.getUniformLocation(program, "u_rippleCount");

gl.uniform2f(u_resolution, waterCanvas.width, waterCanvas.height);

const MAX_RIPPLES = 12;
let ripples = [];

function spawnRipple(x,y, strength=1.0) {
    ripples.push({x,y,startTime:performance.now()/1000,strength});
    if (ripples.length > MAX_RIPPLES) ripples.shift();
}

function hexToRGB(hex) {
    const n = parseInt(hex.replace("#", ""),16);
    return [((n >> 16) & 255) / 255,
            ((n >> 8) & 255) /  255,
            (n & 255) / 255];
}

const rippledata = new Float32Array(MAX_RIPPLES * 4);
function renderWater() {
    const now = performance.now() / 1000;
    for (let i=ripples.length - 1; i >= 0; i--) {
        if (now - ripples[i].startTime >= 3.0) {
            ripples.splice(i,1);
        }
    }

    const lake = LAKES.find(l => l.id === player.currentLakeId);
    const [r,g,b] = hexToRGB(lake.bgColour);

    gl.uniform3f(u_baseColor, r,g,b);
    gl.uniform1f(u_time, now);
    gl.uniform1i(u_rippleCount, ripples.length);

    rippledata.fill(0)
    ripples.forEach((rip, i) => {
        rippledata[i*4] = rip.x;
        rippledata[i*4+1]=rip.y;
        rippledata[i*4+2]=rip.startTime;
        rippledata[i*4+3] = rip.strength;
    });
    gl.uniform4fv(u_ripples,rippledata);
    gl.viewport(0,0,waterCanvas.width, waterCanvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}