import { Row, Col, Button } from 'react-bootstrap';
import MyNavbar from '../components/MyNavbar';
import './index.css';
import React, { useState, useEffect } from 'react';
import EditExForm from './components/EditExForm';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const EditExhitbitiveExPage = () => {
  const [windowSize, setWindowSize] = useState(window.innerHeight - 56);
  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(window.innerHeight + window.scrollY - 56);
      console.log(window.scrollY);
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      // 為了刪除之前的監聽事件
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  let history = useNavigate();
  const [data, setData] = useState({
    eID: -1,
    exhibitionName: "",
    eIntro: "",
    startTime: "",
    closeTime: "",
    frontPicture: "",
    picture2: "",
    picture3: "",
    permission: "",
    frontPictureFile: null,
    picture2File: null,
    picture3File: null,
    frontPictureLink: "", //存資料庫撈回來的原路徑
    picture2Link: "", //存資料庫撈回來的原路徑
    picture3Link: "", //存資料庫撈回來的原路徑
  });
  const [failtxt, setFailtxt] = useState(""); //失敗報錯，印出原因
  const [leaveModalShow, setLeaveModalShow] = useState(false);//離開的彈出式視窗顯示控制
  const cancelProgress = () => {
    setLeaveModalShow(true);
  }
  const handleLeave = () => {
    history('/myExhibition');
  }
  const handleClose = () => {
    setLeaveModalShow(false);
  }
  useEffect(() => {
    var url = window.location.href;
    var ary1 = url.split('?');
    var ary2 = ary1[1].split('=');
    axios({
      method: "get",
      url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=checkIsYourEx&eID=' + ary2[1],
      dataType: "JSON",
      withCredentials: true
    })
      .then((res) => {
        if (res.data.isYourEx) {
          axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyExData&eID=" + ary2[1],
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
          })
            .then((res) => {
              changePHPobjectToJS(res.data);
            })
            .catch((error) => {
              console.log(error);
            })
        } else {
          alert("你沒有這個展場!!!");
          history({ pathname: '/myExhibition' });
        }
      })
      .catch(console.error);
    function changePHPobjectToJS(phpObject) {
      //此展場所有基本資訊
      var exData = {
        eID: phpObject.eID,
        exhibitionName: phpObject.exhibitionName,
        eIntro: phpObject.eIntro,
        startTime: phpObject.startTime,
        closeTime: phpObject.closeTime,
        frontPicture: "",
        picture2: "",
        picture3: "",
        permission: phpObject.permission,
        frontPictureFile: phpObject.frontPicture,
        picture2File: phpObject.picture2,
        picture3File: phpObject.picture3,
        frontPictureLink: phpObject.frontPicture, //存資料庫撈回來的原路徑
        picture2Link: phpObject.picture2, //存資料庫撈回來的原路徑
        picture3Link: phpObject.picture3, //存資料庫撈回來的原路徑
      };
      setData(exData);
    }
  }, [history]);

  const editMyExhibition = (e) => { //當按下完成後將表單所有資料送入後端
    e.preventDefault();
    const sendData = new FormData();
    if ((data.eID !== -1) && (data.exhibitionName !== "") && (data.eIntro !== "") && (data.startTime !== "")
      && (data.closeTime !== "") && (data.frontPictureFile !== null) && (data.frontPictureFile !== "")) {
      sendData.append('exhibitionName', data.exhibitionName);
      sendData.append('eIntro', data.eIntro);
      sendData.append('startTime', data.startTime);
      sendData.append('closeTime', data.closeTime);
      sendData.append('permission', data.permission);
      sendData.append('frontPictureLink', data.frontPictureLink);//存資料庫撈回來的原路徑
      sendData.append('picture2Link', data.picture2Link);
      sendData.append('picture3Link', data.picture3Link);
      if (typeof data.frontPictureFile === "string") {
        sendData.append('frontPictureIsFile', false);
        sendData.append('frontPicture', data.frontPictureFile);
      } else {
        sendData.append('frontPictureIsFile', true);
        sendData.append('frontPicture', data.frontPictureFile, data.frontPictureFile.name);
      }
      if ((data.picture2File !== "") && (data.picture2File !== null)) {
        if (typeof data.picture2File === "string") {
          sendData.append('picture2IsFile', false);
          sendData.append('picture2', data.picture2);
        } else {
          sendData.append('picture2IsFile', true);
          sendData.append('picture2', data.picture2File, data.picture2File.name);
        }
      } else {
        sendData.append('picture2IsFile', '');
        sendData.append('picture2', '');
      }
      if ((data.picture3File !== "") && (data.picture3File !== null)) {
        if (typeof data.picture3File === "string") {
          sendData.append('picture3IsFile', false);
          sendData.append('picture3', data.picture3);
        } else {
          sendData.append('picture3IsFile', true);
          sendData.append('picture3', data.picture3File, data.picture3File.name);
        }
      } else {
        sendData.append('picture3IsFile', '');
        sendData.append('picture3', '');
      }
      for (var pair of sendData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      axios({
        method: "post",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=editMyExData&eID=" + data.eID,
        data: sendData,
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((res) => {
          console.log(res);
          if (res.data.Login === true) {
            if (!res.data.error) {
              setFailtxt("");
              alert(res.data.cause);
              history('/MyExhibition');
            } else {
              setFailtxt("錯誤:" + res.data.cause);
            }
          } else {
            alert('session has losted !!');
            history('/MyExhibition');
          }
        })
        .catch((error) => {
          console.log(error);
        })
    } else {
      setFailtxt("警告: 必選項請一定要填!!");
    }
  }
  return (
    <div>
      <Row className='pt-0 me-0' style={{ height: windowSize }}>
        <Col md={2} className='navbar_menu'>
          <MyNavbar />
        </Col>
        <Col className='d-flex flex-column m-3'>
          <h1 className="text-center">編輯展示中展場</h1>
          <EditExForm data={data} setData={setData} setFailtxt={setFailtxt} />
          <Row>
            <span className="text-center" style={{ color: 'red' }}>{failtxt}</span>
            {
              <Col className='d-flex justify-content-end mt-3'>
                <Button onClick={cancelProgress} className="cancel_btn me-3">取消</Button>
                <Button onClick={editMyExhibition} className="finish_btn">完成</Button>
              </Col>
            }
          </Row>
        </Col>
      </Row>
      <Modal
        show={leaveModalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>確定要離開編輯展場嗎?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "red" }}>您若離開所有編輯紀錄將會消失</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleLeave}>離開</Button>
          <Button className="cancel_btn" onClick={handleClose}>取消</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditExhitbitiveExPage;

/*===================編輯展場 全部的資料結構=============================
[data , setData] = 
{
    exhibitionName: "",
    eIntro: "",
    startTime: "",
    closeTime: "",
    frontPicture: "",
    picture2: "",
    picture3: "",
    permission: "",
    frontPictureFile:null,
    picture2File:null,
    picture3File:null,
}
*/