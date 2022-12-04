import React, { useState, useEffect } from 'react';
import LikeButton from './components/LikeButton.js';
import axios from 'axios';
import Goto360button from './components/Goto360button.js';
import { useSearchParams } from "react-router-dom";
import { Carousel, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./index.css";
import { useNavigate } from "react-router-dom";
import BIRDS from "vanta/dist/vanta.birds.min";
import * as THREE from "three";

const DetailExhitbition = () => {
  const [data, setData] = useState("");
  let history = useNavigate();
  const [canView, setCanView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const param1 = searchParams.get('eID');
  useEffect(() => {
    if (param1 > 0) {
      axios({
        method: "get",
        url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=checkUserCanView&eID=' + param1,
        dataType: "JSON",
        withCredentials: true
      })
        .then((res) => {
          if (res.data.canView) {
            setCanView(true);
            axios({
              method: "get",
              url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getExhibitionData&eID=" + param1,
              dataType: "JSON",
              withCredentials: true
            })
              .then((res) => {
                setData(res.data);
              })
              .catch(console.error)
          } else {
            setCanView(false);
            alert('警告:展場未開放!!');
            history({ pathname: '/Exhibition' });
          }
        })
        .catch(console.error);
    }
  }, [param1, history, setSearchParams]);
  const [vantaEffect, setVantaEffect] = useState(0);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        BIRDS({
          el: "#vanta",
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0xffffe7,
          color1: 0x917b49,
          color2: 0x7c8e5a,
          birdSize: 1.10,
          wingSpan: 22.00,
          speedLimit: 2.00,
          separation: 44.00,
          alignment: 78.00,
          quantity: 3.00
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div>
      <div id='vanta'></div>
      <div className="square border border-0 text-center p-1">
        <h1 className="activity"> 展場活動 </h1>
      </div>
      {(canView) && (
        <div className="p-3">
          <Row>
            <Row className="p-3 pl-4">
              <Col sm={6} >
                <p ><Link to="/home"> 首頁 </Link> / <Link to="/exhibition"> 展場活動 </Link> /  {data.name}</p>
              </Col>
            </Row>
            <Row className="pl-4">
              <h1 className="display-4" style={{ color: "#99a074" }}><b> {data.name} </b> <LikeButton eID={data.eID} /></h1>
            </Row>
            <Row className="p-4">
              <hr className="text-center" style={{ borderTop: "2px solid black" }} />
            </Row>
            <Row>
              <Col xs={12} md={7}>
                <Carousel style={{ maxHeight: '400pt' }}>
                  <Carousel.Item className="try">
                    <img style={{ maxHeight: '400pt' }}
                      className="d-block w-100"
                      src={data.frontPicture}
                      alt="First slide" />
                  </Carousel.Item>
                  {
                    (data.picture2 !== "") && (
                      <Carousel.Item className="try">
                        <img style={{ maxHeight: '400pt' }}
                          className="d-block w-100"
                          src={data.picture2}
                          alt="Second slide" />
                      </Carousel.Item>
                    )
                  }
                  {
                    (data.picture3 !== "") && (
                      <Carousel.Item className="try">
                        <img style={{ maxHeight: '400pt' }}
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
            </Row>
          </Row>
        </div>
      )}

    </div >
  )
}

export default DetailExhitbition;