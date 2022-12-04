import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../index.css";

const DeleteMyExhibitionButton = (props) => {
    let history = useNavigate(); //use for Navigate on Previous
    const { eID } = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleDelete = () => {
        axios({ //isLogin()//先判斷是否登入，才能去紀錄使用者按下喜歡行為
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=deleteMyExhibition&eID=" + eID,
            dataType: "JSON",
            withCredentials: true
        })
        .then((res) => {
            console.log(res);
            setShow(false); //將Modal訊息隱藏
            if(res.data.isDelete){
                alert("成功刪除此展場!!!");
                window.location.reload();
            }else{
                alert("刪除失敗!!!");
            }
        })
        .catch(console.error);
    };
    const handleClick = () => {
        axios({ //isLogin()//先判斷是否登入，才能去紀錄使用者按下喜歡行為
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
        .then((res) => {
            if (res.data.Login) {//有登入
                setShow(true);
            } else {//未登入
                alert('Error: Session has been lost!!!');
                history('/loginRegister');
            }
        })
        .catch(console.error);
    }
    return (
        <>
            <Button variant="danger" onClick={handleClick} style={{ width: "50px", height: "50px", padding: "1pt 5pt" }}>刪除</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> 確認刪除展場 </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    你確定要刪除這個展場嗎?
                    <span style={{ color: '#e38970' }}>&nbsp;(刪除之後將無法復原) </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel_btn" onClick={handleClose}> 取消 </Button>
                    <Button className="delete_btn" onClick={handleDelete}> 刪除 </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default DeleteMyExhibitionButton;