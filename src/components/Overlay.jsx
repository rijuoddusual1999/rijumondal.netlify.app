import { Loader, useProgress } from "@react-three/drei"

export const Overlay = () =>{
    
    const {progress} = useProgress();


    return(
        <div className="overlay">
            <div className={`loader ${progress === 100 ? "loader-disappear" : ""}`} />
            {progress === 100 && (
            <div className="intro">
                <h1 className="logo">rijumondal.tech</h1>
                <div className="scroll"><h3>Scroll to Experience</h3></div>
            </div>
            )}
        </div>
    )
}