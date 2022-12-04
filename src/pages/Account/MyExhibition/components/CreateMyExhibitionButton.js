import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../index.css";

const CreateMyExhibitionButton=()=>{
    let history = useNavigate(); //use for Navigate on Previous

    const handleClick = () => {
        axios({ //isLogin()//先判斷是否登入，才能去紀錄使用者按下喜歡行為
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
        .then((res) => {
            if(res.data.Login){//有登入
                history({pathname:'/addExPage'});//到新增展場的第一頁
            }else{//未登入
                alert('Error: Session has been lost!!!');
                history('/loginRegister');
            }
        })   
        .catch(console.error);
    }
    return(
        <div style={{ textAlign: 'right' }}>
            <Button variant="outline-dark" size="sm" className="CreateMyExhibitionButton" onClick={handleClick}>
                <span style={{ fontSize: 40 }}>+</span>
                <div className="content">
                    新增展場
                </div>
            </Button>
        </div>
    )
}
export default CreateMyExhibitionButton;