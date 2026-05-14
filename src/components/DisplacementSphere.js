import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AmbientLight,
  DirectionalLight,
  LinearSRGBColorSpace,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
} from 'three';

const media = { mobile: 696, tablet: 1040 };

function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

function cleanMaterial(material) {
  material.dispose();
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose();
    }
  }
}

function cleanScene(scene) {
  if (!scene) return;
  scene.traverse((object) => {
    if (!object.isMesh) return;
    object.geometry?.dispose();
    const mat = object.material;
    if (!mat) return;
    if (Array.isArray(mat)) mat.forEach(cleanMaterial);
    else cleanMaterial(mat);
  });
}

function cleanRenderer(renderer) {
  renderer?.dispose();
}

function removeLights(lights) {
  for (const light of lights || []) {
    light.parent?.remove(light);
  }
}

function useInViewport(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

function useWindowSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));
  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

function publicPath(path) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  return `${base}${path}`;
}

export function DisplacementSphere() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const sphereRef = useRef();
  const uniformsRef = useRef();
  const lightsRef = useRef();
  const startRef = useRef(Date.now());
  const mouseRef = useRef(new Vector2(0.8, 0.5));
  const smoothRot = useRef({ x: 0, y: 0 });

  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    (async () => {
      const [vertexShader, fragmentShader] = await Promise.all([
        fetch(publicPath('/shaders/displacement-sphere-vertex.glsl')).then((r) =>
          r.text()
        ),
        fetch(publicPath('/shaders/displacement-sphere-fragment.glsl')).then((r) =>
          r.text()
        ),
      ]);
      if (cancelled || !vertexShader || !fragmentShader) return;

      const mouse = new Vector2(0.8, 0.5);
      mouseRef.current = mouse;
      startRef.current = Date.now();

      let renderer;
      try {
        renderer = new WebGLRenderer({
          canvas,
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        });
      } catch {
        return;
      }

      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(1);
      renderer.outputColorSpace = LinearSRGBColorSpace;

      const camera = new PerspectiveCamera(
        54,
        innerWidth / innerHeight,
        0.1,
        100
      );
      camera.position.z = 52;

      const scene = new Scene();
      const material = new MeshPhongMaterial();
      material.onBeforeCompile = (shader) => {
        uniformsRef.current = UniformsUtils.merge([
          shader.uniforms,
          { time: { type: 'f', value: 0 } },
        ]);
        shader.uniforms = uniformsRef.current;
        shader.vertexShader = vertexShader;
        shader.fragmentShader = fragmentShader;
      };

      const geometry = new SphereGeometry(32, 128, 128);
      const sphere = new Mesh(geometry, material);
      sphere.position.z = 0;
      sphere.modifier = Math.random();
      scene.add(sphere);

      const dirLight = new DirectionalLight(0xffffff, 2.0);
      const ambientLight = new AmbientLight(0xffffff, 0.4);
      dirLight.position.set(100, 100, 200);
      scene.add(dirLight, ambientLight);
      lightsRef.current = [dirLight, ambientLight];

      rendererRef.current = renderer;
      sceneRef.current = scene;
      cameraRef.current = camera;
      sphereRef.current = sphere;

      setReady(true);
      requestAnimationFrame(() => setVisible(true));
    })();

    return () => {
      cancelled = true;
      removeLights(lightsRef.current);
      lightsRef.current = null;
      cleanScene(sceneRef.current);
      cleanRenderer(rendererRef.current);
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      sphereRef.current = null;
      uniformsRef.current = null;
      setReady(false);
      setVisible(false);
    };
  }, []);

  const positionSphere = useCallback(() => {
    const sphere = sphereRef.current;
    const { width, height } = windowSize;
    if (!sphere || !width) return;
    if (width <= media.mobile) {
      sphere.position.set(14, 10, 0);
    } else if (width <= media.tablet) {
      sphere.position.set(18, 14, 0);
    } else {
      sphere.position.set(22, 16, 0);
    }
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!renderer || !camera) return;
    const adjustedHeight = height + height * 0.3;
    renderer.setSize(width, adjustedHeight);
    camera.aspect = width / adjustedHeight;
    camera.updateProjectionMatrix();
    if (reduceMotion) {
      renderer.render(sceneRef.current, camera);
    }
  }, [windowSize, reduceMotion]);

  useEffect(() => {
    if (!ready) return;
    positionSphere();
  }, [ready, positionSphere]);

  useEffect(() => {
    if (!ready || reduceMotion) return;
    const onMouseMove = throttle((event) => {
      mouseRef.current.set(
        event.clientX / window.innerWidth,
        event.clientY / window.innerHeight
      );
    }, 100);
    if (!isInViewport) return undefined;
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [ready, isInViewport, reduceMotion]);

  useEffect(() => {
    if (!ready) return undefined;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const sphere = sphereRef.current;
    if (!renderer || !scene || !camera || !sphere) return undefined;

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const uniforms = uniformsRef.current;
      if (uniforms) {
        uniforms.time.value = 0.00005 * (Date.now() - startRef.current);
      }
      const targetX = mouseRef.current.y / 2;
      const targetY = mouseRef.current.x / 2;
      smoothRot.current.x += (targetX - smoothRot.current.x) * 0.08;
      smoothRot.current.y += (targetY - smoothRot.current.y) * 0.08;
      sphere.rotation.z += 0.001;
      sphere.rotation.x = smoothRot.current.x;
      sphere.rotation.y = smoothRot.current.y;
      renderer.render(scene, camera);
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [ready, isInViewport, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="displacement-sphere-canvas"
      data-visible={visible ? 'true' : 'false'}
      aria-hidden
    />
  );
}
