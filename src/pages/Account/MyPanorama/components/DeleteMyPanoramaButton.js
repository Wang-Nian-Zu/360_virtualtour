import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../index.css';

const DeleteMyPanoramaButton = (props) => {
    let history = useNavigate(); //use for Navigate on Previous
    const { pID } = props;
    const { paginate } = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleDelete = () => {
        axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=deleteMyPanorama&pID=" + pID,
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                setShow(false); //將 Modal 訊息隱藏
                console.log(res);
                if (res.data.isDelete) {
                    alert("成功刪除此全景圖! " + res.data.cause);
                    paginate(1);
                    history("/myPanorama?p.1");
                    window.location.reload();
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
            <div className="btn deletePanoramaBtn d-flex justify-content-end"
                style={{ border: "none", fontSize: "20px", color: "#e38970" }} onClick={handleClick}>✕</div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>確認刪除全景圖</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    你確定要刪除這個全景圖(ID: {pID})嗎? ?
                    (注意:刪除之後將無法復原)
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel_btn" onClick={handleClose}>取消</Button>
                    <Button className="delete_btn" onClick={handleDelete}>刪除</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default DeleteMyPanoramaButton;