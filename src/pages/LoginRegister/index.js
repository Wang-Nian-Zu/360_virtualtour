import React, { useState, useEffect } from 'react';
import Register from './Register';
import './index.css';
import { Container, Tab, Tabs, Form, Col } from 'react-bootstrap';
import { useNavigate} from "react-router-dom";
import axios from 'axios';
import BIRDS from "vanta/dist/vanta.birds.min";
import * as THREE from "three";

function LoginRegister() {
    let history = useNavigate(); //use for Navigate on Previous
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    const submitForm = (e) => {
        //modelURL = "hello";
        e.preventDefault();
        const sendData = {
            email: data.email,
            password: data.password
        };
        console.log(sendData);
        axios({
            method: "post",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=loginCheck",
            dataType: "JSON",
            data: sendData,
            withCredentials: true
        })
            .then((res) => {
                if (res.data.status === 'invalid') {
                    alert(res.data.cause);
                } else {
                    alert(res.data.cause);
                    history(`/`);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

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
            <Container className='windowContain pt-0 justify-content-center h-100 mx-auto'>
                <Tabs
                    defaultActiveKey="login"
                    id="tab"
                    className="mb-3 pt-5"
                    justify
                >
                    <Tab eventKey="login" title="登入" >
                        <Form onSubmit={submitForm}>
                            <div className='row d-flex w-100'>
                                <Col sm={4}>
                                    <h5><span style={{ color: '#d78559' }}>| </span> 電子郵件 </h5>
                                </Col>
                                <Col>
                                    <Form.Control className="email mb-3" placeholder={`電子郵件`} type="email"
                                        onChange={handleChange} name="email" value={data.email}></Form.Control>
                                </Col>
                            </div>
                            <div className='row d-flex w-100'>
                                <Col sm={4}>
                                    <h5><span style={{ color: '#d78559' }}>| </span> 密碼 </h5>
                                </Col>
                                <Col>
                                    <Form.Control className="password mb-3" placeholder={`密碼`} type="password"
                                        onChange={handleChange} name="password" value={data.password}></Form.Control>
                                </Col>
                            </div>
                            <button className="check_btn m-3" type="submit" value="Login">確認</button>
                            {/* <Link className='p-2' to={"/forgetPwd"}>忘記密碼</Link> */}
                        </Form>
                    </Tab>
                    <Tab eventKey="register" title="註冊">
                        <Register />
                    </Tab>
                </Tabs>
            </Container>
        </div>
    )
}

export default LoginRegister