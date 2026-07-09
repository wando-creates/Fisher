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
    
    vec2 hash22(vec2 p) {
        float n = sin(dot(p, vec2(41.0, 289.0)));
        return fract(vec2(262144.0, 32768.0) * n);
    }

    float voronoiEdges(vec2 uv) {
        vec2 cellId = floor(uv);
        vec2 f = fract(uv);
        
        float minDist1 = 4.0;
        float minDist2 = 4.0;
        
        for (int y = -1; y <= 1; y++) {
            for (int x = -1; x<=1; x++) {
                vec2 neighbor = vec2(float(x), float(y));
                vec2 point = hash22(cellId + neighbor);
                vec2 diff = neighbor + point - f;
                float dist = length(diff);
                
                if (dist <minDist1) {
                    minDist2 = minDist1;
                    minDist1 = dist;
                } else if (dist < minDist2) {
                    minDist2 = dist;
                }
            }
        }
        return minDist2 - minDist1;
    }
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
            float radius = age * 80.0;
            float ringWidth = 12.0;

            float edgeDist = abs(dist - radius);
            float ring = smoothstep(ringWidth, 0.0, edgeDist);
            ring *= (1.0 - age/2.0) * strength;
            height += ring;
        }
        height = clamp(height, 0.0, 1.0);
        // gentle constant motion
        float ambient = sin(uv.x * 0.02 + u_time * 0.8) * 0.001; // horizontal waves
                        + sin(uv.y * 0.03 - u_time * 0.8) * 0.001; //verticle waves

        vec2 distortion = vec2(height, height) * 2.0;
        vec2 causticUV = (uv+distortion) * 0.01 + vec2(u_time * 0.06, u_time * 0.02);
        float edge = voronoiEdges(causticUV);
        float mesh = smoothstep(0.05, 0.0, edge);

        float meshBrightness = 0.15 + abs(height) * 0.4;
        vec3 causticColor = u_baseColor + mesh * meshBrightness;

        height += ambient;
        vec3 color = causticColor + height * 0.1; // different colours at different heights of the waves

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
    gl.uniform2f(u_resolution, waterCanvas.width, waterCanvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}