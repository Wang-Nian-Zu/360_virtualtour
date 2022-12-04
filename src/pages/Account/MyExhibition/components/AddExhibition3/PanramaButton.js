import React , {useState, useEffect} from 'react';
import { Button } from 'react-bootstrap';
import './index.css';
const PanoramaButton = (props) => {
    const {panoCount} = props; // 這個展場中全景圖的數量
    const { panorama } = props;
    const { setLocation } = props;
    const { moveSpotsArray } = props;
    const [isOK , setIsOK] = useState(false);
    useEffect(() => {
        var OK = false;
        for(let i = 0 ; i < moveSpotsArray.length ; i++){
            if (panorama.fakeID.toString() === moveSpotsArray[i].currentSceneID) {
                OK = true;
            }
        }
        setIsOK(OK);
    }, [moveSpotsArray,panorama.fakeID]);
    const changePanorama = () => {
        setLocation(panorama.fakeID.toString());
    };
    return (
        <>
            <Button onClick={changePanorama} className="move_btn me-2 mb-2">
                {panorama.panoramaName}
                &nbsp;
                {
                    (!isOK && panoCount > 1)/*當此場景沒有移動點且此展場全景圖的數量大於一時*/
                        ? (<span style={{ color: "red" }}>？</span>)
                        : (<span style={{ color: "green" }}>✔️</span>)
                }
            </Button>
        </>
    );
}
export default PanoramaButton;