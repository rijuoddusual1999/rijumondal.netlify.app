import { Float,OrbitControls,useScroll,Text } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import { Background } from "./background";
import { Airplane } from "./airplane";
import {Cloud} from "./cloud";
import * as THREE from 'three';
import { useMemo,useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TextSection } from "./texts";






const LINE_NB_POINTS = 1000;
const curvedistance = 25;

export const Experience = () => {


  const curvepoints = useMemo(() => 
    [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1*curvedistance),
      new THREE.Vector3(-5, 0, -2*curvedistance),
      new THREE.Vector3(-5, 0, -3*curvedistance),
      new THREE.Vector3(0, 0, -5*curvedistance),
      
    ],[]

  );

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      curvepoints,
      false,
      "catmullrom",
      0.5
    );
  }, []);






  const textSection = useMemo(() => {
    return[{
      position: new THREE.Vector3(
        curvepoints[0].x-2,
        curvepoints[0].y+0,
        curvepoints[0].z-4

      ),

      title: 'Hii I am Riju Mondal, A Fullstack Developer && QA Engineer'
    },
    {
      position: new THREE.Vector3(
        curvepoints[2].x+9,
        curvepoints[2].y+3,
        curvepoints[2].z

      ),

      title: 'Open Source Contribution',
      subtitle: '1.Grafana 2.Home-Assistant'
    },
    {
      position: new THREE.Vector3(
        curvepoints[3].x-1,
        curvepoints[3].y+4,
        curvepoints[3].z

      ),

      title: 'Projects',
      subtitle: '1.Movie Recomendation App 2.Parallax Website'
    },
    {
      position: new THREE.Vector3(
        curvepoints[4].x+7,
        curvepoints[4].y+3,
        curvepoints[4].z

      ),

      title: 'Profiles',
      subtitle: '1.Github   2.Leetcode 3.Linkedin'
    }

    ]
  },[])


  const clouds = useMemo(() => [
    {
      position: new THREE.Vector3(-10, 1, -13)
    },
    {
      position: new THREE.Vector3(-5, 4, -13),
      opacity: 0.3
    },
    {
      position: new THREE.Vector3(6, -0.2, -13),
      opacity: 0.3
    },
    {
      position: new THREE.Vector3(-8, -0.2, -17),
      opacity: 0.5
    },
    {
      position: new THREE.Vector3(2, 1, -58),
      opacity: 0.5
    },
    {
      position: new THREE.Vector3(7, 6, -15)
    },
    {
      position: new THREE.Vector3(2, 5, -20)
    },
    {
      position: new THREE.Vector3(-3, 8, -25)
    },
    {
      position: new THREE.Vector3(0, 1, -104)
    }
  ], []);
  
  
  














  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();
  


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
  const curve_ahead_camera = 0.007;
  const curve_ahead_airplane = 0.03;
  const max_bank_angle = 65;

  useFrame((_state, delta) => {

    
    



    const scrollOffset = Math.max(0,scroll.offset);

    const curPoint = curve.getPoint(scrollOffset);

    CameraGroup.current.position.lerp(curPoint, delta * 24);

    const lookAtpoint = curve.getPoint(Math.min(scrollOffset + curve_ahead_camera,1));


    const currentLookAt = CameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );

    const targetLookAt = new THREE.Vector3()
    .subVectors(curPoint,lookAtpoint)
    .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    CameraGroup.current.lookAt(
      CameraGroup.current.position.clone().add(lookAt)
    );



    const tangent = curve.getTangent(scrollOffset+ curve_ahead_airplane);


    const nonlerplookup = new THREE.Group();
    nonlerplookup.position.copy(curPoint);
    nonlerplookup.lookAt(nonlerplookup.position.clone().add(targetLookAt));


    tangent.applyAxisAngle(
      new THREE.Vector3(0,1,0),
      -nonlerplookup.rotation.y

    )
    

    let bankangle = Math.atan2(-tangent.z,tangent.x);
    bankangle = -Math.PI/2 + bankangle;

    let bankradiandegrees = (bankangle*180)/Math.PI;
    bankradiandegrees *= 15;

    if(bankradiandegrees<0){
      bankradiandegrees = Math.max(bankradiandegrees,-max_bank_angle);
    }
    else if(bankradiandegrees>0){
        bankradiandegrees = Math.min(bankradiandegrees,max_bank_angle);
    }


    bankangle = (bankradiandegrees*Math.PI)/180 ;





    const targetairplanequaternion = new THREE.Quaternion().setFromEuler(
         new THREE.Euler(
          airplane.current.rotation.x,
          airplane.current.rotation.y, 
          bankangle
         )

    )

   

    airplane.current.quaternion.slerp(targetairplanequaternion,delta*2);




  });


      
  
    
 

    

  const airplane = useRef();

  return (
    <>
      {/*<OrbitControls />*/}
      <group ref={CameraGroup} >
      <Background/>
      <PerspectiveCamera position={[0, 2, 12]} fov={30} makeDefault />
      <group ref={airplane}>
      <Float floatIntensity={2} speed={2}>
      <Airplane rotation-y={Math.PI / 1} scale={[0.2, 0.2, 0.2]} position-y={0.4} />
      </Float>
      </group>
      </group>
       
      {
        textSection.map((textSection,index) =>(

        <TextSection {...textSection} key={index}/>

        ))
        }
      
  
      
      
 

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


        {clouds.map((cloud, index) => (
        <Cloud {...cloud} key={index} />
      ))}
      
    </>
  );
};
