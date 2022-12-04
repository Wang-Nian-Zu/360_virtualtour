import React, { useEffect, useState } from "react"
import axios from 'axios';
import MyNavbar from './components/MyNavbar';
import { Form, Col, Row } from 'react-bootstrap';

const EditPwd = () => {
    const [windowSize, setWindowSize] = useState(window.innerHeight + window.scrollY - 56);
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(window.innerHeight + window.scrollY - 56);
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            // 為了刪除之前的監聽事件
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const [data, setData] = useState({
        oldpwd: "",
        newpwd: "",
        newpwdAgain: ""
    })
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    const submitForm = (e) => {
        e.preventDefault();
        const sendData = new FormData();
        sendData.append('oldpwd', data.oldpwd);
        sendData.append('newpwd', data.newpwd);
        sendData.append('newpwdAgain', data.newpwdAgain);

        console.log(sendData);
        axios({
            method: "post",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=EditPwd",
            dataType: "JSON",
            data: sendData,
            withCredentials: true
        })
            .then((res) => {
                if (res.data.status === 'invalid') {
                    //console.log(res.data);
                    alert(res.data.cause);
                } else {
                    //console.log(res.data);
                    alert(res.data.cause);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <Row className='pt-0 me-0' style={{ height: windowSize }}>
            <Col md={2} className='navbar_menu'>
                <MyNavbar />
            </Col>
            <Col className='d-flex flex-column m-3'>
                <Form onSubmit={submitForm}>
                    <Row className="pt-0 d-flex w-100">
                        <h1 className="text-center">更新密碼</h1>
                        <Row>
                            <h5><span style={{ color: '#d78559' }}>| </span> 舊密碼 </h5>
                            <Form.Control className="ms-4 w-75" type="password" name="oldpwd"
                                placeholder={`原始密碼`} onChange={handleChange} value={data.oldpwd} />
                        </Row>
                        <Row>
                            <h5><span style={{ color: '#d78559' }}>| </span> 新密碼 </h5>
                            <Form.Control className="ms-4 w-75" type="password" name="newpwd"
                                placeholder={`新密碼`} onChange={handleChange} value={data.newpwd} />
                        </Row>
                        <Row>
                            <h5><span style={{ color: '#d78559' }}>| </span> 再次輸入新密碼 </h5>
                            <Form.Control className="ms-4 w-75" type="password" name="newpwdAgain"
                                placeholder={`新密碼確認`} onChange={handleChange} value={data.newpwdAgain} />
                        </Row>
                        <div className="text-center p-3">
                            <button className="storage" type="submit" name="submit" value="更改密碼"> 更改密碼 </button>
                        </div>

                    </Row>
                </Form>
            </Col>
        </Row>
    );
}

export default EditPwd;