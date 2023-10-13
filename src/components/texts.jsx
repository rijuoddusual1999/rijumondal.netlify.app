import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";

export const TextSection = ({ sceneOpacity, title, subtitle,  ...props }) => {
  const materialRef = useRef();
  const titlematerialRef = useRef();
  const [hovered, setHover] = useState(false);
  const { camera } = useThree();
  const linkURL = "https://www.google.com";

  const handleClick = () => {
    window.open(linkURL, "_blank"); // Open the link in a new tab/window
  };

  useFrame(() => {
    materialRef.current.opacity = sceneOpacity.current;
    titlematerialRef.current.opacity = sceneOpacity.current;
  });

  return (
    <>
      <group {...props}>
        <Text
          color={hovered ? "blue" : "white"}
          anchorX="right"
          anchorY="bottom"
          fontSize={1}
          maxWidth={3.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          onClick={handleClick}
        >
          {title}
          <meshStandardMaterial ref={titlematerialRef} />
        </Text>

        <Text
          color={hovered ? "blue" : "white"}
          anchorX="right"
          anchorY="top"
          fontSize={0.7}
          maxWidth={3.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          onClick={handleClick}
        >
          {subtitle}
          <meshStandardMaterial ref={materialRef} />
        </Text>
      </group>
    </>
  );
};
