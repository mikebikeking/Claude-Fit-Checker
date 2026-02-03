import { useEffect, useRef } from 'react';
import * as THREE from 'three';
export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    // Scene Setup
    const scene = new THREE.Scene();
    // Camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3.5;
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    // Geometry - Icosahedron for a tech/crystal look
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    // Material - Glass/Crystal effect
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.2,
      thickness: 1.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      wireframe: true // Wireframe for tech aesthetic
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    // Inner glow mesh
    const innerGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x60a5fa, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0xa855f7, 2); // Purple accent
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.003;
      innerMesh.rotation.x -= 0.001;
      innerMesh.rotation.y -= 0.002;
      // Gentle floating
      const time = Date.now() * 0.001;
      mesh.position.y = Math.sin(time) * 0.1;
      renderer.render(scene, camera);
    };
    animate();
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, []);
  return (
    <div
      ref={containerRef}
      className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center opacity-80"
      aria-hidden="true" />);


}