/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

export function Cloud({ sceneOpacity,opacity, ...props }) {
  const { nodes, materials } = useGLTF("./models/cloud/model.glb");

  const materialRef = useRef();
  
  useFrame(()=>{
    materialRef.current.opacity = sceneOpacity.current;
  })

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Node.geometry}>
        <meshStandardMaterial
           ref={materialRef}
          {...materials["lambert2SG.001"]}
          transparent
          opacity={opacity}
          
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("./models/cloud/model.glb");