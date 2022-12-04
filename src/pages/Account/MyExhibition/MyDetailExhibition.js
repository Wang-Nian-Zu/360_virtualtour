import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Goto360button from './components/Goto360button.js';
import { Carousel, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import "./index.css";

const MyDetailExhibition = () => {
  let history = useNavigate();
  const [data, setData] = useState("");
  const [eIDisYours, setEIDisYours] = useState(false);
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
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getExhibitionData&eID=" + ary2[1],
            dataType: "JSON",
            withCredentials: true
          })
            .then((res) => {
              setData(res.data);
            })
            .catch(console.error)
          setEIDisYours(true);
        } else {
          alert("你沒有這個展場!!!");
          history({ pathname: '/myExhibition' });
        }
      })
      .catch(console.error);
  }, [history]);

  return (
    <div>
      <div className="square border border-0 text-center p-1">
        <h1 className="activity"> 預覽展場 </h1>
      </div>
      {
        (eIDisYours) && (
          <div className="p-3">
            <Row>
              <Row className="p-3 pl-4">
                <Col sm={6} >
                  <p >首頁 / 展場活動 / {data.name}</p>
                </Col>
              </Row>
              <Row className="pl-4">
                <h1 className="display-4" style={{ color: "#495561" }}><b> {data.name} </b></h1>
              </Row>
              <Row className="p-4">
                <hr className="text-center" style={{ borderTop: "2px solid black" }} />
              </Row>
              <Row>
                <Col xs={12} md={7}>
                  <Carousel>
                    <Carousel.Item className="try">
                      <img
                        className="d-block w-100"
                        src={data.frontPicture}
                        alt="First slide" />
                    </Carousel.Item>
                    {
                      (data.picture2 !== "") && (
                        <Carousel.Item className="try">
                          <img
                            className="d-block w-100"
                            src={data.picture2}
                            alt="Second slide" />
                        </Carousel.Item>
                      )
                    }
                    {
                      (data.picture3 !== "") && (
                        <Carousel.Item className="try">
                          <img
                            className="d-block w-100"
                            src={data.picture3}
                            alt="Third slide" />
                        </Carousel.Item>
                      )
                    }
                  </Carousel>
                </Col>
                <Col md={5}>
                  <h4 className='pb-2'><span style={{ color: '#d78559' }}>| </span><b> 開放時間</b></h4>
                  <h4 className='pb-2' style={{ color: '#99a074' }}> &emsp;{data.startTime} </h4>
                  <h4 className='pb-2'><span style={{ color: '#d78559' }}>| </span><b> 閉館時間</b></h4>
                  <h4 className='pb-2' style={{ color: '#99a074' }}> &emsp;{data.closeTime} </h4>
                  <h4 className='pb-2'><span style={{ color: '#d78559' }}>| </span><b> 策展人</b></h4>
                  <h4 className='pb-2' style={{ color: '#99a074' }}> &emsp;{data.first_name} {data.last_name} </h4>
                  <h4><span style={{ color: '#d78559' }}>| </span><b> 介紹</b></h4>
                  <div className='p-2'>
                    <p>{data.eIntro}</p>
                  </div>
                  <Goto360button eID={data.eID} />
                </Col>
                <Row className="me-0 d-flex justify-content-end">
                  <Link to={"/myExhibition"} style={{ width: "125px" }}>
                    <Button className="goback_btn" style={{ width: "125px" }}>
                      返回
                    </Button>
                  </Link>
                </Row>
              </Row>
            </Row>
          </div>
        )
      }

    </div >
  )
}

export default MyDetailExhibition;