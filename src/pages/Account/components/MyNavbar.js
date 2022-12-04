import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './index.css';

const MyNavbar = () => {
    const history = useNavigate();
    useEffect(() => {
        axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyPhoto",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                if (res.data.Login === false) {
                    history('/loginRegister');
                }
            })
            .catch(console.error);
    }, [history]);
    return (
        <div>
            <Link to="/myInfo" className="btn myNavbar p-3 text-start"> 基本資訊 </Link>
            <Link to="/myExhibition" className="btn myNavbar p-3 text-start"> 我的展場 </Link>
            <Link to="/myItem" className="btn myNavbar p-3 text-start"> 展品管理 </Link>
            <Link to="/myPanorama" className="btn myNavbar p-3 text-start"> 全景圖管理 </Link>
            <Link to="/editPwd" className="btn myNavbar p-3 text-start"> 修改密碼 </Link>
        </div>
    )
}

export default MyNavbar