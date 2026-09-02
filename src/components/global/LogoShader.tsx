"use client";

import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5; // Map -1..1 to 0..1
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_image;
uniform vec2 u_imageResolution;

varying vec2 v_uv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 uv) {
    float f = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 4; i++) {
        f += amp * noise(uv);
        uv = rot * uv * 2.0 + vec2(100.0);
        amp *= 0.5;
    }
    return f;
}

void main() {
    // === 1. COORDINATES ===
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 mouse = u_mouse.xy / u_resolution.xy;
    mouse.y = 1.0 - mouse.y; 

    // Aspect ratio correction for accurate distance
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);
    vec2 mouseAspect = vec2(mouse.x * aspect, mouse.y);
    
    float mouseDist = distance(uvAspect, mouseAspect);
    float cursorInfluence = smoothstep(0.4, 0.0, mouseDist); // Radius of cursor liquid effect

    // === 2. FLUID DYNAMICS (FBM) ===
    float t = u_time * 1.5;
    vec2 q = vec2(fbm(uv * 3.0 + t), fbm(uv * 3.0 + t * 0.8 + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(uv * 4.0 + 1.0 * q + t), fbm(uv * 4.0 + 1.0 * q + t * 0.9 + vec2(8.3, 2.8)));
    
    // The distortion vector to push pixels around
    vec2 fluidDistortion = (r - 0.5) * 2.0; 
    
    // === 3. FLUID BACKGROUND ===
    // Generate a beautiful, subtly moving fluid background (White to Light Blue)
    float bgNoise = fbm(uv * 5.0 + r);
    bgNoise = smoothstep(0.1, 0.8, bgNoise);
    vec3 bgColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.85, 0.92, 1.0), bgNoise); // White -> Ice Blue
    
    // Add vibrant blue when cursor hovers over background
    bgColor = mix(bgColor, vec3(0.4, 0.7, 1.0), cursorInfluence * 0.3);

    // === 4. LOGO UV MAPPING (Object-Fit: Contain) ===
    float imgAsp = u_imageResolution.x / u_imageResolution.y;
    // Prevent divide by zero if not loaded yet
    if (imgAsp == 0.0) imgAsp = 1.0; 
    
    vec2 uvMap = uv - 0.5;
    if (aspect > imgAsp) {
        uvMap.x *= aspect / imgAsp;
    } else {
        uvMap.y *= imgAsp / aspect;
    }
    
    // Scale down to add padding
    uvMap = uvMap * 1.8; 
    uvMap += 0.5;

    // Apply fluid distortion only when near cursor
    uvMap += fluidDistortion * cursorInfluence * 0.15;

    // === 5. COMPOSITING ===
    vec3 finalColor = bgColor;
    
    // Boundary check so texture doesn't repeat
    if (uvMap.x >= 0.0 && uvMap.x <= 1.0 && uvMap.y >= 0.0 && uvMap.y <= 1.0) {
        vec4 texColor = texture2D(u_image, vec2(uvMap.x, 1.0 - uvMap.y)); // Flip Y
        
        // Luma Keying: Make the white background of the PNG transparent!
        // White is rgb(1.0, 1.0, 1.0). If brightness is high, alpha goes to 0.
        float brightness = dot(texColor.rgb, vec3(0.3333));
        float logoAlpha = smoothstep(0.95, 0.85, brightness) * texColor.a; 
        
        // Blend logo over background
        finalColor = mix(bgColor, texColor.rgb, logoAlpha);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function LogoShader({ className, imageUrl = "/images/logo-weatso.webp" }: { className?: string, imageUrl?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // Default offscreen

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Create a full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const imageResolutionLocation = gl.getUniformLocation(program, "u_imageResolution");
    const imageSamplerLocation = gl.getUniformLocation(program, "u_image");

    let animationFrameId: number;
    let isVisible = false;
    let textureLoaded = false;
    let imgWidth = 1000.0; // Default safe value to prevent div by 0
    let imgHeight = 1000.0;

    // Load Texture
    const texture = gl.createTexture();
    const image = new window.Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      imgWidth = image.width;
      imgHeight = image.height;
      
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      textureLoaded = true;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = (time: number) => {
      if (!isVisible || !textureLoaded) {
        if (isVisible) animationFrameId = requestAnimationFrame(render);
        return;
      }

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseRef.current.x * (window.devicePixelRatio || 1), mouseRef.current.y * (window.devicePixelRatio || 1));
      gl.uniform1f(timeLocation, time * 0.001);
      
      gl.uniform2f(imageResolutionLocation, imgWidth, imgHeight);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(imageSamplerLocation, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            animationFrameId = requestAnimationFrame(render);
          }
        } else {
          isVisible = false;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
        }
      });
    }, { threshold: 0 });

    observer.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteTexture(texture);
    };
  }, [imageUrl]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block cursor-crosshair ${className || ""}`}
    />
  );
}
