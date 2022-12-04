import { Row, Col } from 'react-bootstrap';
import InfoCard from "./components/InfoCard.js";
import MyNavbar from '../components/MyNavbar';
import PanoramaTable from "./components/PanoramaTable.js";
import AddPanoramaButton from './components/AddPanoramaDropdown.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'
import MySearchBar from './components/MySearchBar.js';
import Dropdown from 'react-bootstrap/Dropdown';

const MyPanorama = () => {
    const [windowSize, setWindowSize] = useState(window.innerHeight + window.scrollY - 56);
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(window.innerHeight + window.scrollY - 56);
            // console.log(window.scrollY);
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            // 為了刪除之前的監聽事件
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const [exhibitiveNum, setExhibitiveNum] = useState(0);
    const [waitingNum, setWaitingNum] = useState(0);
    const [neverUsedNum, setNeverUsedNum] = useState(0);
    useEffect(() => {
        axios({
            method: "post",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyPanoramaStatistics",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                console.log(res);
                if (res.data.status === "valid") {
                    setExhibitiveNum(res.data.statistics.exhibitiveNum);
                    setWaitingNum(res.data.statistics.waitingNum);
                    setNeverUsedNum(res.data.statistics.neverUsedNum);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const [show, setShow] = useState(false);
    const [list, setList] = useState(null);
    const [searchTerm, setSearchTerm] = useState([]); // 搜尋後的list
    useEffect(() => {
        axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyPanoramaList",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                if (res.data.Login) {
                    setList(res.data.value); // 撈到我所有的全景圖資料
                    setSearchTerm(res.data.value);
                    setShow(true);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    function showNeverUsedPanorama() { // 列出尚未展出的全景圖
        var tryToFind = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status === "NeverUsed") {
                tryToFind.push(list[i]);
            }
        }
        setSearchTerm(tryToFind);
        document.getElementById("mySearchBar").value = "";
    }
    function showWaitingPanorama() { // 列出待展出的全景圖
        var tryToFind = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status === "waiting") {
                tryToFind.push(list[i]);
            }
        }
        setSearchTerm(tryToFind);
        document.getElementById("mySearchBar").value = "";
    }
    function showExhibitivePanorama() { // 列出展出中的全景圖
        var tryToFind = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status === "exhibitive") {
                tryToFind.push(list[i]);
            }
        }
        setSearchTerm(tryToFind);
        document.getElementById("mySearchBar").value = "";
    }
    function showAllPanorama() { // 列出所有全景圖
        var tryToFind = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status !== "") {
                tryToFind.push(list[i]);
            }
        }
        setSearchTerm(tryToFind);
        document.getElementById("mySearchBar").value = "";
    }
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const indexOfLastPost = currentPage * postsPerPage; // 1*5 2*5
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 5-5 10-5
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const totalPages = searchTerm.length;
    return (
        <div>
            <Row className='pt-0 me-0' style={{ height: windowSize }}>
                <Col md={2} className='navbar_menu'>
                    <MyNavbar />
                </Col>
                <Col className='d-flex flex-column m-3'>
                    <Row className='pt-0'><h1 className="text-center">全景圖管理</h1></Row>
                    <Row className='d-flex flex-row'>
                        <Col>
                            <InfoCard key="1" count1={neverUsedNum} count2={waitingNum} count3={exhibitiveNum} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={3} md={2}><AddPanoramaButton /></Col>
                        <Col xs={2} md={3}><MySearchBar list={list} setSearchTerm={setSearchTerm} paginate={paginate}/></Col>
                        <Col xs={7} md={7}>
                            <Dropdown>
                                <Dropdown.Toggle id="otherPanorama">
                                    篩選
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={showAllPanorama}>所有全景圖</Dropdown.Item>
                                    <Dropdown.Item onClick={showExhibitivePanorama}>展出中</Dropdown.Item>
                                    <Dropdown.Item onClick={showWaitingPanorama}>待展出</Dropdown.Item>
                                    <Dropdown.Item onClick={showNeverUsedPanorama}>尚未使用</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <PanoramaTable show={show} searchTerm={searchTerm} postsPerPage={postsPerPage} 
                        indexOfLastPost={indexOfLastPost} paginate={paginate} indexOfFirstPost={indexOfFirstPost} totalPages={totalPages}/>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default MyPanorama;

