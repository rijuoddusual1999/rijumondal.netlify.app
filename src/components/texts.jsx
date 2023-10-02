import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

export const TextSection = ({ sceneOpacity, title, subtitle, ...props }) => {
   const materialRef = useRef();
   const titlematerialRef = useRef();

  useFrame(() => {
    materialRef.current.opacity = sceneOpacity.current;
    titlematerialRef.current.opacity = sceneOpacity.current;
  });

  return (
    <>
      <group {...props}>
        <Text
          color="white"
          anchorX="right"
          anchorY="bottom"
          fontSize={1}
          maxWidth={3.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
        >
          {title}
        <meshStandardMaterial
           ref={titlematerialRef}
          
        />
        </Text>

        <Text
          color="white"
          anchorX="right"
          anchorY="top"
          fontSize={0.7}
          maxWidth={3.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
        >
          {subtitle}
        <meshStandardMaterial
           ref={materialRef}
          
        />
        </Text>
      </group>
    </>
  );
};
