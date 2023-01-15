import React, { useState } from 'react'
import './App.css'

import { useRef, Suspense } from 'react'
import {
  Canvas
} from '@react-three/fiber'
import {
  Bounds,
  useBounds,
  OrbitControls,
  ContactShadows,
  Edges,
  useGLTF,
  Gltf
} from '@react-three/drei'
import Reset from './components/ui/navigation/ResetCamera'

function Room(props: any) {
  const node: any = useGLTF('roomtest1.glb', true)
  return (
    <Suspense fallback={null}>
      <mesh
        geometry={node.nodes.room.geometry}
        material={node.nodes.room.material}
        {...props}
        dispose={null}
      />
    </Suspense>
  )
}

function Sink(props: any) {
  const node: any = useGLTF('sink.glb', true)
  console.log(node)
  const ref = useRef<THREE.Mesh>(null!)
  const [isSelected, setIsSelected] =
    useState(false)
  return (
    <Suspense fallback={null}>
      <mesh
        ref={ref}
        onPointerMove={e => (
          e.stopPropagation(), setIsSelected(true)
        )}
        onPointerOut={e => setIsSelected(false)}
        geometry={node.nodes.Cube.geometry}
        material={node.nodes.Cube.material}
        {...props}
        dispose={null}
      >
        {isSelected && (
          <Edges color={'#0B2847'} />
        )}
      </mesh>
    </Suspense>
  )
}

function Box(
  props: JSX.IntrinsicElements['mesh']
) {
  const ref = useRef<THREE.Mesh>(null!)
  const [isSelected, setIsSelected] =
    useState(false)
  return (
    <mesh
      {...props}
      ref={ref}
      onPointerMove={e => (
        e.stopPropagation(), setIsSelected(true)
      )}
      onPointerOut={e => setIsSelected(false)}
    >
      <boxGeometry args={[1, 1, 2]} />
      {isSelected && <Edges color={'#0B2847'} />}
      <meshStandardMaterial
        color={isSelected ? '#6aa7e8' : '#B8D5F4'}
      />
    </mesh>
  )
}

export default function App() {
  return (
    <>
      <Reset />
      <Canvas
        shadows
        camera={{
          position: [0, -10, 80],
          fov: 50
        }}
        dpr={[1, 2]}
      >
        <color
          attach="background"
          args={['#f0f0f0']}
        />
        <ambientLight intensity={0.5} />
        {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} /> */}
        <pointLight position={[50, 100, 100]} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <SelectToZoom>
              <Box
                rotation={[0, 0, 0]}
                position={[-1, 0.095, 0.5]}
              />
              <Box
                rotation={[0, 1.55, 0]}
                position={[-2, 0.095, 2.96]}
              />
              <Room position={[0, 0, 0]} />
              <Sink
                position={[2, 0.2, 3.05]}
                scale={0.3}
                rotation={[0, -1.55, 0]}
              />
            </SelectToZoom>
          </Bounds>
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -35, 0]}
            opacity={0.2}
            width={200}
            height={200}
            blur={1}
            far={50}
          />
        </Suspense>
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.75}
        />
      </Canvas>
    </>
  )
}

function SelectToZoom({ children }: any) {
  const api = useBounds()
  console.log(api)
  return (
    <group
      onClick={e => (
        e.stopPropagation(),
        e.delta <= 2 &&
        api.refresh(e.object).fit()
      )}
      onPointerMissed={e =>
        e.button === 0 && api.refresh().fit()
      }
    >
      {children}
    </group>
  )
}
