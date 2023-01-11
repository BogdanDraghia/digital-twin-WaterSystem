import React, { useState } from 'react';
import './App.css';

import { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, useBounds, OrbitControls, ContactShadows, Edges } from '@react-three/drei'

function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)
  const [isSelected, setIsSelected] = useState(false)
  return (
    <mesh
      {...props}
      ref={ref}
      onPointerMove={(e) => (e.stopPropagation(), setIsSelected(true))}
      onPointerOut={(e) => setIsSelected(false)}
    >
      <boxGeometry args={[1, 1, 2]} />
      {isSelected &&
        <Edges color={"#0B2847"} />

      }
      <meshStandardMaterial color={isSelected ? "#6aa7e8" : "#B8D5F4"} />

    </mesh>
  )
}

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, -10, 80], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={['#f0f0f0']} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={0} />
      <pointLight position={[50, 100, 100]} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2}>
          <SelectToZoom>
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
            <Box position={[4.2, 0, 0]} />
          </SelectToZoom>
        </Bounds>
        <ContactShadows rotation-x={Math.PI / 2} position={[0, -35, 0]} opacity={0.2} width={200} height={200} blur={1} far={50} />
      </Suspense>
      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
    </Canvas>
  )
}


function SelectToZoom({ children }: any) {
  const api = useBounds()
  return (
    <group onClick={(e) => (e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit())} onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}>
      {children}
    </group>
  )
}