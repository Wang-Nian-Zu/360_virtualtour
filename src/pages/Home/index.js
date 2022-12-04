import React, { useState, useEffect } from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import OnExhibit from './components/OnExhibit.js';
import './index.css';
import ToBeExhibit from './components/ToBeExhibit.js';
import Slider from "react-slick";
import BIRDS from "vanta/dist/vanta.birds.min";
import * as THREE from "three";
import Footer from '../../components/footer.js';
import CuRank from './components/CuRank.js';
import ExRank from './components/ExRank.js';

const Home = () => {
    const [ingList, setingList] = useState([]);
    const [tobeList, setTobeList] = useState([]);
    const [bestCurator, setBestCurator] = useState([]);
    const [bestExhibiton, setBestExhibition] = useState([]);

    var value_1 = document.body.clientWidth;
    var appSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        draggable: 1,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    var webSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        draggable: 1,
        slidesToShow: 3,
        slidesToScroll: 3
    };


    useEffect(() => {
        axios({
            method: "get",
            url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getOnExhibit',
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                //console.log(res);
                setingList(res.data);
            })
            .catch(console.error);

        axios({
            method: "get",
            url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getToBeExhibit',
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                //console.log(res);
                setTobeList(res.data);
            })
            .catch(console.error);

        axios({
            method: "get",
            url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getBestCu',
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                //console.log(res);
                setBestCurator(res.data);
            })
            .catch(console.error);

        axios({
            method: "get",
            url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getBestEx',
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                //console.log(res);
                setBestExhibition(res.data);
            })
            .catch(console.error);
    }, []);

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
            <div>
                <Carousel>
                    <Carousel.Item className="carousel-inner-home">
                        <img
                            className="d-block w-100"
                            src='../backendPHP/HomeADs/1.png'
                            alt="First slide" />
                    </Carousel.Item>
                    <Carousel.Item className="carousel-inner-home">
                        <img
                            className="d-block w-100"
                            src='./backendPHP/HomeADs/2.png'
                            alt="Second slide" />
                    </Carousel.Item>
                    <Carousel.Item className="carousel-inner-home">
                        <img
                            className="d-block w-100"
                            src='../backendPHP/HomeADs/3.png'
                            alt="Third slide" />
                    </Carousel.Item>
                </Carousel>
            </div>
            <Row className='p-5 me-0 justify-content-center' >
                <h1><span style={{ color: '#e38970' }}>| </span>現正展出</h1>
                <Row>
                    { (value_1 < 720) ?
                        <Slider {...appSettings}>
                            {ingList.map((exhibition) => (
                                <div className='p-2' key={exhibition.eID} ><OnExhibit key={exhibition.eID} exhibition={exhibition} /></div>
                            ))}
                        </Slider> :
                        <Slider {...webSettings}>
                            {ingList.map((exhibition) => (
                                <div className='p-2' key={exhibition.eID} ><OnExhibit key={exhibition.eID} exhibition={exhibition} /></div>
                            ))}
                        </Slider>
                    }
                </Row>
            </Row>

            <Row className='p-5 me-0 justify-content-center'>
                <h1><span style={{ color: '#e38970' }}>| </span> 即將展出 </h1>
                <Row>
                    {value_1 < 720 ?
                        <Slider {...appSettings}>
                            {tobeList.map((exhibition) => (
                                <div className='p-2' key={exhibition.eID} ><ToBeExhibit key={exhibition.eID} exhibition={exhibition} /></div>
                            ))}
                        </Slider> :
                        <Slider {...webSettings}>
                            {tobeList.map((exhibition) => (
                                <div className='p-2' key={exhibition.eID} ><ToBeExhibit key={exhibition.eID} exhibition={exhibition} /></div>
                            ))}
                        </Slider>
                    }
                </Row>
            </Row>

            <Row className='p-5 me-0'>
                <h1><span style={{ color: '#e38970' }}>| </span> 發燒排行榜 </h1>
                <Row>
                    <Col className="d-flex flex-column justify-content-center">
                        <Row>
                            <h3 className='hotCurator pl-3'><span style={{ color: '#e38970' }}> ★ </span> 熱門策展人 </h3>
                        </Row>
                        <Row>
                            {bestCurator.map((subscribe, index) => (
                                <CuRank key={index} index={index} subscribe={subscribe} />)
                            )}
                        </Row>
                    </Col>
                    <Col className="d-flex flex-column justify-content-center">
                        <Row>
                            <h3 className='hotExhibit pl-3'><span style={{ color: '#e38970' }}> ★ </span> 熱門展覽 </h3>
                        </Row>
                        <Row>
                            {bestExhibiton.map((likes, idx) => (
                                <ExRank key={idx} idx={idx} likes={likes} />
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Row>

            <div className='p-5 me-0'>
                <h1><span style={{ color: '#e38970' }}>| </span> 建展教學 </h1>
                <Row className='d-flex justify-content-center'>
                    <Col lg='6'>
                        <div className='ratio ratio-16x9'>
                            <iframe width="560" height="315"
                                src="https://www.youtube.com/embed/2Z-qHc06ldg"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                        </div>
                    </Col>
                </Row>
            </div>
            <Footer />
        </div>
    )
}

export default Home;