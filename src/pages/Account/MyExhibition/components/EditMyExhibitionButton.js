import React from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../index.css";

const EditMyExhibitionButton=(props)=>{
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
                history({pathname:'/editExPage',search: `eID=${eID}`});
            }else{//未登入
                alert('Error: Session has been lost!!!');
                history('/loginRegister');
            }
        })   
        .catch(console.error);
    }
    return(
        <>
        <button className="editInfo" onClick={handleClick} style={{ width: "50px", height: "50px" }}>編輯</button>
        </>
    )
}
export default EditMyExhibitionButton;