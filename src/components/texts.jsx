import { Text } from "@react-three/drei";


export const TextSection = ({title,subtitle,...props}) =>{

    return(
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
            </Text>
            </group>

</>
      
    )

}