import { Float,OrbitControls,useScroll,Text } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import { Background } from "./background";
import { Airplane } from "./airplane";
import {Cloud} from "./cloud";
import * as THREE from 'three';
import { useMemo,useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BrowserRouter as  Link } from 'react-router-dom';





const LINE_NB_POINTS = 12000;

export const Experience = () => {

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(-2, 0, -20),
        new THREE.Vector3(-3, 0, -30),
        new THREE.Vector3(0, 0, -40),
        new THREE.Vector3(5, 0, -50),
        new THREE.Vector3(7, 0, -60),
        new THREE.Vector3(5, 0, -70),
        new THREE.Vector3(0, 0, -80),
        new THREE.Vector3(0, 0, -90),
        new THREE.Vector3(0, 0, -100),
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);


  


  const linepoints = useMemo(() =>{
    return curve.getPoints(LINE_NB_POINTS)

  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(0, 0.2);

    return shape;
  }, [curve]);

  
  const CameraGroup = useRef();
  const scroll = useScroll();
   

  useFrame((_state, delta) => {
    const curPointIndex = Math.min(
      Math.round(scroll.offset * linepoints.length),
      linepoints.length - 1
    )
    const curPoint = linepoints[curPointIndex];
    const pointAhead = linepoints[Math.min(curPointIndex + 1), linepoints.length-1];

    const xDisplacement = (pointAhead.x - curPoint.x) * 80;

    const angleRotation =
      (xDisplacement < 0 ? 1 : -1) *
      Math.min(Math.abs(xDisplacement), Math.PI / 6);

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angleRotation
      )
    );
    const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        CameraGroup.current.rotation.x,
        angleRotation,
        CameraGroup.current.rotation.z
      )
    );

    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 6);
    CameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 6);


    CameraGroup.current.position.lerp(curPoint, delta*14);
  });
  

  const airplane = useRef();

  return (
    <>
      {/*<OrbitControls enableZoom ={false}/>*/}
      <group ref={CameraGroup} >
      <Background/>
      <PerspectiveCamera position={[0, 2, 12]} fov={30} makeDefault />
      <group ref={airplane}>
      <Float floatIntensity={2} speed={2}>
      <Airplane rotation-y={Math.PI / 1} scale={[0.2, 0.2, 0.2]} position-y={0.4} />
      </Float>
      </group>
      </group>

      <group position={[2,2,3]}>
      <Text
      color = "white"
      anchorX = {"left"}
      anchorY = {"middle"}
      fontSize ={.5}
      maxWidth = {2.5}
      font={"/Fonts/Fuggles/Fuggles-Regular.ttf"}
      >
        Hii I am Riju Mondal{"\n"}
        A Full Stack Developer and QA Engineer
      </Text>
      </group> 


      <group position={[-2,3,-40]} >
        <Text
          color="white"
          anchorX="right"
          anchorY="middle"
          fontSize={1}
          maxWidth={2.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
        >
          Projects{"\n"}
          1.Movie Recommendation App
          2.Parallax Website

        </Text>
            
      </group>



      <group position={[4,3,-70]} >
        <Text
          color="white"
          anchorX="right"
          anchorY="middle"
          fontSize={1}
          maxWidth={2.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
        >
          Open Source Contribution{"\n"}
          1.Cal.com
          2.Home-Assistant

        </Text>
            
      </group>



      
      <group position={[4,3,-100]} >
        <Text
          color="white"
          anchorX="right"
          anchorY="middle"
          fontSize={1}
          maxWidth={2.5}
          font="/Fonts/Fuggles/Fuggles-Regular.ttf"
        >
          Profile{"\n"}
          1.Leetcode
          2.Linkedin
          3.Github

        </Text>
            
      </group>
      
      
      
 

        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial color={"white"} opacity={0.7} transparent />
        </mesh>


      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 1, -3]} />
      <Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[1.5, 4, -2]} />
      <Cloud
        opacity={0.7}
        scale={[0.3, 0.3, 0.4]}
        rotation-y={Math.PI / 9}
        position={[2, -0.2, -5]}
      />
      <Cloud
        opacity={0.7}
        scale={[0.4, 0.4, 0.4]}
        rotation-y={Math.PI / 9}
        position={[1, -0.2, -12]}
      />
      <Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[-1, 1, -53]} />
      <Cloud opacity={0.7} scale={[0.8, 0.8, 0.8]} position={[-4, 6, -10]} />
      <Cloud opacity={0.5} scale={[0.8, 0.8, 0.8]} position={[-12, 5, -15]} />
      <Cloud opacity={0.5} scale={[0.8, 0.8, 0.8]} position={[-15, 8, -20]} />
      <Cloud opacity={0.3} scale={[0.8, 0.8, 0.8]} position={[0, 1, -100]} />

      
    </>
  );
};
