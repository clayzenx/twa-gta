import { Canvas } from '@react-three/fiber'
import { Fisheye, CameraControls, PerspectiveCamera, Environment } from '@react-three/drei'

export function GameCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 18.5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Fisheye zoom={0}>
        <CameraControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.6} />
        <ambientLight intensity={Math.PI / 2} />
        <Environment preset="city" background blur={1} />
        <PerspectiveCamera makeDefault position={[0, 0, 18.5]} />
      </Fisheye>
    </Canvas>
  );
}
