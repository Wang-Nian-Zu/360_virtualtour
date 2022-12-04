import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Preview from "../images/preview.jpg";
import '../index.css';

const LookMyPanoramaButton = (props) => {
    let history = useNavigate(); //use for Navigate on Previous
    const { imgLink } = props;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
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
            <button className="LookMyPanoramaButton" onClick={handleClick}><img src={Preview} alt="查看" style={{ width: 20 }} /></button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>預覽</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={imgLink} alt="not_found" style={{ width: 450 }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel_btn" onClick={handleClose}>關閉</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default LookMyPanoramaButton;