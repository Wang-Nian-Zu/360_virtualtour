import React, { useState, useEffect } from 'react';
import MyNavbar from '../components/MyNavbar';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import EditInfo from './EditInfo';
import './index.css';

function MyInfo() {
    const [windowSize, setWindowSize] = useState(window.innerHeight + window.scrollY - 56);
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(window.innerHeight + window.scrollY - 56);
            //console.log(window.scrollY);
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            // 為了刪除之前的監聽事件
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const [list, setList] = useState([]) // start with an empty array
    const [isShow, setIsShow] = useState(false); // 編輯我的資訊div
    const [isClose, setIsClose] = useState(true); // 我的資訊div
    const [buttonText, setButtonText] = useState("編輯");
    // const height = window.scrollY;
    // console.log(windowSize);
    //const editLabel = null;
    function handleClick() {
        setIsShow(!isShow);
        setIsClose(!isClose);
        if (isShow === false) {
            setButtonText("返回");
        } else {
            setButtonText("編輯");
        }

    }
    useEffect(() => {
        axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyInfo", // name
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                setList(res.data);
            })
            .catch(console.error);
    }, []) // empty dependencies array, this runs only once

    return (
        <div>
            <Row className='pt-0 me-0' style={{height:windowSize}}>
                <Col md={2} className='navbar_menu'>
                    <MyNavbar/>
                </Col>
                <Col className='d-flex flex-column m-3'>
                    {isClose && (
                        <Row className="pt-0 myInfo">
                            <h1 className='text-center'>我的基本資訊</h1>
                            <h5><span style={{ color: '#d78559' }}>| </span>大頭照</h5>
                            <img className='m-3' style={{ width: "250px" }} src={list.photo} alt={list.first_name}></img>
                            <h5><span style={{ color: '#d78559' }}>| </span>姓名</h5>
                            <p><b> &emsp;{list.first_name} {list.last_name} </b></p>
                            <h5><span style={{ color: '#d78559' }}>| </span>性別</h5>
                            <p>
                                {
                                    (list.gender === "male")
                                    ?(<b>&emsp;男</b>)
                                    :(<b>&emsp;女</b>)
                                }
                            </p>
                            <h5><span style={{ color: '#d78559' }}>| </span>介紹</h5>
                            <p><b> &emsp;{list.intro} </b></p>
                            <h5><span style={{ color: '#d78559' }}>| </span>訂閱人數</h5>
                            <p><b> &emsp;{list.SubCount} </b></p>
                        </Row>
                    )}
                    {isShow && (
                        <Row className="edit">
                            <EditInfo />
                        </Row>
                    )}
                    <div className="text-center p-3">
                        <button className="editInfo" onClick={handleClick} >{buttonText}</button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default MyInfo