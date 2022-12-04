import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const DeleteB = (props) => {
  const { id } = props; //這行很重要，不然會抓不到iID
  let history = useNavigate(); //use for Navigate on Previous
  const DelTXT = '刪除';//button現在是甚麼文字
  const DelBootstrap = "outline-danger"; //button現在的CSS樣式  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const { paginate } = props;
  const handleShow = () => {
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
  };
  const handleClick = () => { //當按鈕按下後
    axios({
      method: "get",
      url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=DeleteItem&iID=" + id,
      dataType: "JSON",
      withCredentials: true
    })
      .then((res) => {
        setShow(false);
        console.log(res.data);
        if (res.data.isDelete) {
          alert("成功刪除此展品! " + res.data.cause);
          paginate(1);
          history("/myItem?p.1");
          window.location.reload();//重整頁面
        } else {
          alert(res.data.cause);
        }

      })
      .catch(console.error);
  };

  return (
    <>
      <div className="btn DeleteMyPanoramaButton d-flex justify-content-end"
        style={{ border: "none", fontSize: "20px", color: "#e38970" }} onClick={handleShow}>✕</div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            確認刪除展品
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          你確定要刪除此展品嗎?
          <span style={{ color: '#e38970' }}>&nbsp;(刪除之後將無法復原) </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={DelBootstrap} className={`Delete-button`} onClick={handleClick}>
            <span className="Subs-counter">{` ${DelTXT}  `}</span>
          </Button>
          <Button className="cancel_btn" onClick={handleClose}>
            取消
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  )
};

export default DeleteB;