import React from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Button} from "react-bootstrap";

const Goto360button=(props)=>{
    let history = useNavigate(); //use for Navigate on Previous
    const {eID} = props;
    
    const handleClick = () => {
        axios({ //isLogin()//先判斷是否登入，才能去紀錄使用者按下喜歡行為
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
        .then((res) => {
            if(res.data.Login){//有登入
                history({pathname:'/myVirtualTour', search:`eID=${eID}`});
            }else{//未登入
                alert('目前為訪客模式，登入後才能進入360虛擬展場')
            }
        })   
        .catch(console.error);
    }
    return(
        <>
        <Button className="goto360" onClick={handleClick}> 前往360導覽頁面 </Button>
        </>
    )
}
export default Goto360button;