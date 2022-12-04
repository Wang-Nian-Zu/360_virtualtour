import React, { useState, useEffect } from 'react';
import PanoramaDiv from "./components/PanoramaDiv.js";
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Logo from "./components/textLogo.png";

const VirtualTour = () => {
    let history = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [props, setProps] = useState(0); //將攔截到的參數放在這邊，傳進Panorama標籤
    const [canView, setCanView] = useState(false);
    const param1 = searchParams.get('eID');
    useEffect(() => {
        setProps(param1);
        if (param1 > 0) {//阻擋那些想要靠改參數進入其他展場的人
            axios({
                method: "get",
                url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=checkUserCanViewPano&eID=' + param1,
                dataType: "JSON",
                withCredentials: true
            })
                .then((res) => {
                    if (res.data.canView) {
                        setCanView(true);
                    } else {
                        setCanView(false);
                        alert('警告:找不到此展場!!');
                        history({ pathname: '/Exhibition' });
                    }
                })
                .catch(console.error);
        }
    }, [param1, setSearchParams, setProps, history]) //裡面是放每次需要更新所用到的參數，所以放setData，就不能放data進去了，不然會造成無限迴圈
    return (
        <div className="virtualTour">
            <h1 className="text-center">
                <img src={Logo} alt="logo" width="350px" height="80px" />
            </h1>
            {
                (props > 0) && (canView) && (
                    <PanoramaDiv eID={props} />
                )
            }
        </div>
    )
}
export default VirtualTour;