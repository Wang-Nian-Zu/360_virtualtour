import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyPanoramaDiv from "./components/MyPanoramaDiv.js";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logo from "./textLogo.png";

const MyVirtualTour = () => {
    let history = useNavigate(); //use for Navigate on Previous
    const [searchParams, setSearchParams] = useSearchParams();
    const [props, setProps] = useState(0); //將攔截到的參數放在這邊，傳進Panorama標籤
    const [eIDisYours, setEIDisYours] = useState(false);
    const param1 = searchParams.get('eID');
    useEffect(() => {
        setEIDisYours(false);
        setProps(param1);
    }, [param1, setProps])

    useEffect(() => {
        if (props > 0) {
            axios({
                method: "get",
                url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=checkIsYourEx&eID=' + props,
                dataType: "JSON",
                withCredentials: true
            })
                .then((res) => {
                    if (res.data.isYourEx) {
                        setEIDisYours(true);
                    } else {
                        alert("你沒有這個展場!!!");
                        history({ pathname: '/myExhibition' });
                    }
                })
                .catch(console.error);
        }
    }, [props, history, setSearchParams])

    return (
        <div className="virtualTour">
            <h1 className="text-center">
                <img src={Logo} alt="logo" width="350px" height="80px" />
            </h1>
            {
                (eIDisYours) && (props > 0)
                    ? (<MyPanoramaDiv eID={props} eIDisYours={eIDisYours} />)
                    : (<></>)
            }
        </div>
    )
}
export default MyVirtualTour;