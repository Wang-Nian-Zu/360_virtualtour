import React, { useState } from 'react';
import './index.css';
import { useNavigate } from "react-router-dom";
import { Form, Col, Row } from 'react-bootstrap';
import axios from 'axios';



function Register() {
    let history = useNavigate(); //use for Navigate on Previous
    const [data, setData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        gender: "male",
        intro: ""
    })
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        //console.log(data);
    }
    const submitForm = (e) => {
        e.preventDefault();
        var sex ="";
        if(data.gender==="male"){
            sex = "../backendPHP/UsrImg/male.jpg";
        }else{
            sex = "../backendPHP/UsrImg/female.jpg";
        }
        const sendData = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            password: data.password,
            gender: data.gender,
            intro: data.intro,
            photo: sex
        };
        console.log(sendData);
        axios({
            method: "post",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=addMember",
            dataType: "JSON",
            data: sendData,
            withCredentials: true
        })
            .then((res) => {
                console.log(res);
                if (res) {
                    if (res.data.status === 'invalid') {
                        alert(res.data.cause);
                    } else {
                        alert(res.data.cause);
                        window.location.reload();
                        history(`/loginregister`);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <Form onSubmit={submitForm}>
            <div className='row d-flex justify-content-center'>
                <Row>
                    <Col sm={4}>
                        <h5><span style={{ color: '#d78559' }}>| </span> 姓氏 </h5>
                    </Col>
                    <Col>
                        <Form.Control className="username mb-3" type="text" placeholder={`姓氏`}
                            onChange={handleChange} name="first_name" value={data.first_name}></Form.Control>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <h5><span style={{ color: '#d78559' }}>| </span> 名字 </h5>
                    </Col>
                    <Col>
                        <Form.Control className="username mb-3" type="text" placeholder={`名字`}
                            onChange={handleChange} name="last_name" value={data.last_name}></Form.Control>
                    </Col>
                </Row>
                <div className='row d-flex w-100 mb-3'>
                    <h5 className="form-check-label col-md-4"><span style={{ color: '#d78559' }}>| </span> 性別 </h5>
                    <Form.Check className="col-md-4" type="checkbox"
                        onChange={handleChange} name="gender" value="male" checked={data.gender === 'male'} label="男"
                    ></Form.Check>
                    <Form.Check className="col-md-4" type="checkbox"
                        onChange={handleChange} name="gender" value="female" checked={data.gender === 'female'} label="女"
                    ></Form.Check>
                </div>
                <Row>
                    <Col sm={4}>
                        <h5><span style={{ color: '#d78559' }}>| </span> 電子郵件 </h5>
                    </Col>
                    <Col>
                        <Form.Control className="email mb-3" type="email" placeholder={`電子郵件`}
                            onChange={handleChange} name="email" value={data.email}></Form.Control>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <h5><span style={{ color: '#d78559' }}>| </span> 密碼 </h5>
                    </Col>
                    <Col>
                        <Form.Control className="password mb-3" type="password" placeholder={`密碼`}
                            onChange={handleChange} name="password" value={data.password}></Form.Control>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <h5><span style={{ color: '#d78559' }}>| </span> 確認密碼 </h5>
                    </Col>
                    <Col>
                        <Form.Control className="checkpassword mb-3" type="password" placeholder={`確認密碼`}
                            onChange={handleChange} value={data.check_password}></Form.Control>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <h5><span style={{ color: '#d78559' }}>| </span> 介紹 </h5>
                    </Col>
                    <Col>
                        <Form.Control className="intro mb-3" as="textarea" rows={3} placeholder={`介紹`}
                            onChange={handleChange} name="intro" value={data.intro}></Form.Control>
                    </Col>
                </Row>
            </div>
            <button className="check_btn m-3" type="submit" value="Register">確認</button>
        </Form>
    )
}

export default Register