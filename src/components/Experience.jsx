import { Float,OrbitControls,useScroll,Text } from "@react-three/drei";
import { PerspectiveCamera } from "@react-three/drei";
import { Background } from "./background";
import { Airplane } from "./airplane";
import {Cloud} from "./cloud";
import * as THREE from 'three';
import { useEffect, useLayoutEffect, useMemo,useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TextSection } from "./texts";
import { usePlay } from "../context/play";
import { gsap } from "gsap";






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
      new THREE.Vector3(0, 0, -10*curvedistance),
      
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



  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();



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
      subtitle: '1.Debugging with Terry Davis    2.Hashmapping my proverty'
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
      position: new THREE.Vector3(-10, -3, -63)
    },
    {
      position: new THREE.Vector3(-5, -4, -33),
     
    },
    {
      position: new THREE.Vector3(6, -5, -33),
     
    },
    {
      position: new THREE.Vector3(-8, -8, -37),
      
    },
    {
      position: new THREE.Vector3(-7, 8, -58),
      
    },
    {
      position: new THREE.Vector3(9, 6, -15)
    },
    {
      position: new THREE.Vector3(2, 5, -20)
    },
    {
      position: new THREE.Vector3(-3, 8, -25)
    },
    {
      position: new THREE.Vector3(-6, 1, -104)
    }
  ], []);
  
  
  














  


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
  const lastScroll = useRef(0);
  const Camera = useRef();
  const curve_ahead_camera = 0.007;
  const curve_ahead_airplane = 0.03;
  const max_bank_angle = 65;
  const {play,setHasScroll,end,setEnd} = usePlay();

  useFrame((_state, delta) => {

   

    if (play && sceneOpacity.current < 1) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        1,
        delta * 0.5
      );
    }

    if (lastScroll.current <= 0 && scroll.offset > 0) {
      setHasScroll(true);
    }



    if (end && sceneOpacity.current > 0) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        0,
        delta
      );
    }

    if (end) {
      return;
    }

    
    lineMaterialRef.current.opacity = sceneOpacity.current;



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



    if (CameraGroup.current.position.z <curvepoints[curvepoints.length - 1].z + 100)
      
      
     {
      setEnd(true);
      planeOutTl.current.play();
    }





  });


      
  
    
 

    

  const airplane = useRef();


  const planeIn = useRef();
  const planeOutTl = useRef();
  const cameraRail = useRef(new THREE.Object3D());

  useLayoutEffect(()=>{
    planeIn.current = gsap.timeline();
    planeIn.current.pause();
    planeIn.current.from(airplane.current.position,{
      duration: 3,
      z:5,
      y: -2
    });

    planeOutTl.current = gsap.timeline();
    planeOutTl.current.pause();

    planeOutTl.current.to(
      airplane.current.position,
      {
        duration: 10,
        z: -250,
        y: 10,
      },
      0
    );
    planeOutTl.current.to(
      cameraRail.current.position,
      {
        duration: 8,
        y: 12,
      },
      0
    );
    planeOutTl.current.to(airplane.current.position, {
      duration: 1,
      z: -1000,
    });
    

  },[]);



  useEffect(() => {
    if (play) {
      planeIn.current.play();
    }
  }, [play]);





  return useMemo(()=>(
    <>
      {/*<OrbitControls />*/}
      <group ref={CameraGroup} >
      <Background/>
      <PerspectiveCamera ref={Camera} position={[0, 2, 12]} fov={30} makeDefault />
      <group ref={airplane}>
      <Float floatIntensity={2} speed={2}>
      <Airplane rotation-y={Math.PI / 1} scale={[0.2, 0.2, 0.2]} position-y={0.4} />
      </Float>
      </group>
      </group>
       
      {
        textSection.map((textSection,index) =>(

        <TextSection sceneOpacity={sceneOpacity} {...textSection} key={index}/>

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
          <meshStandardMaterial color={"white"} ref={lineMaterialRef}  transparent />
        </mesh>


        {clouds.map((cloud, index) => (
        <Cloud sceneOpacity={sceneOpacity} {...cloud} key={index} />
      ))}
      
    </>
  ), []) ;
};
