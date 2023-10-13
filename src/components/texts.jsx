import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";

export const TextSection = ({ sceneOpacity, title, subtitle, ...props }) => {
  const titleMaterialRef = useRef();
  const subtitleMaterialRef = useRef();
  const [titleHovered, setTitleHover] = useState(false);
  const [subtitleHovered, setSubtitleHover] = useState(false);
  const { camera } = useThree();
  
  const subtitleLinkURL = "https://www.google.com"; // Change the link for the subtitle as needed

  const handleTitleClick = () => {
    window.open(titleLinkURL, "_blank");
  };

  const handleSubtitleClick = () => {
    window.open(subtitleLinkURL, "_blank");
  };

  useFrame(() => {
    titleMaterialRef.current.opacity = sceneOpacity.current;
    subtitleMaterialRef.current.opacity = sceneOpacity.current;
  });

  return (
    <>
      <group {...props}>
        <Text
          color={titleHovered ? "blue" : "white"}
          anchorX="right"
          anchorY="bottom"
          fontSize={1}
          maxWidth={3.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
        >
          {title}
          <meshStandardMaterial ref={titleMaterialRef} />
        </Text>

        <Text
          color={subtitleHovered ? "red" : "white"}
          anchorX="right"
          anchorY="top"
          fontSize={0.7}
          maxWidth={3.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
          onPointerOver={() => setSubtitleHover(true)}
          onPointerOut={() => setSubtitleHover(false)}
          onClick={handleSubtitleClick}
        >
          {subtitle}
          <meshStandardMaterial ref={subtitleMaterialRef} />
        </Text>
      </group>
    </>
  );
};
