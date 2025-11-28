import React, { useState } from 'react'

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
} from '@react-three/drei'
import DeviceData from '../../components/ui/devices/DeviceData'

const HostpitalBathroom3Dscene = ()=>{
const MockDeviceData = {
  name:'device1',
  location:'center'
}
const Room =(props: any)=> {
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
const Sink=(props: any)=> {
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
    const SelectToZoom =({ children }: any)=>{
        const api = useBounds()
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
const Box = (props: JSX.IntrinsicElements['mesh'])=>{

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
      {/* {
        isSelected &&<Html distanceFactor={10}>
        <div style={{
          position:'absolute',
          zIndex:'-1',
          height:"100",width:"120",backgroundColor:"red"}}>
          This box is selected
        </div>
      </Html>
      } */}
    </mesh>
  )
}
      return (
        <>
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
          <DeviceData {...MockDeviceData}/>
        </>
      )
}

export default HostpitalBathroom3Dscene