import { Button, Modal, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CheckboxCard from './CheckboxCard';

const ChooseMySceneModal = (props) => {
    const { data } = props;
    const { setData } = props;
    const { chooseMyScene } = props;
    const { setChooseMyScene } = props;
    const { fakeID } = props;
    const { setFakeID } = props;
    const [checkedState, setCheckedState] = useState([]);//用陣列存複數個核取方塊
    const [show, setShow] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    let history = useNavigate(); //use for Navigate on Previous
    const [list, setList] = useState(null); // start with an empty array
    // 分頁
    const [count, setCount] = useState(1); // 總共有幾頁
    const [currentPage, setCurrentPage] = useState(1); // 第幾頁
    const [postsPerPage] = useState(4); // 每頁有幾個
    const indexOfLastPost = currentPage * postsPerPage; // 1*9 2*9
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 9-9 18-9

    useEffect(() => {
        if (!fetchData) {
            axios({
                method: "get",
                url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyPanoramaList',
                dataType: "JSON",
                withCredentials: true
            })
                .then((res) => {
                    console.log(res);
                    if (res.data.Login) {
                        setList(res.data.value);//自己抓到的全部全景圖
                        if (res.data.value.length > 0) {
                            setCheckedState(new Array(res.data.value.length).fill(false));//處理radio
                        } else {
                            setCheckedState(new Array(res.data.value.length).fill(false));//處理radio
                            setModalFailtxt("注意: 自己的全景圖庫沒有任何全景圖");
                        }
                        setShow(true);
                        setFetchData(true);
                    } else {
                        alert("error ! session has been lost!");
                        history(`/loginregister`);
                    }
                })
                .catch(console.error)
        }
    }, [history, fetchData]);

    useEffect(() => {
        console.log(checkedState);
    }, [checkedState]);

    const handleAdd = () => {
        setCurrentPage(currentPage + 1);
    }
    const handlePre = () => {
        setCurrentPage(currentPage - 1);
    }
    useEffect(() => {
        if (fetchData) {
            setCount(Math.ceil(list.length / 4));
        }
    }, [fetchData, list]);

    const [Modalfailtxt, setModalFailtxt] = useState("");
    const clearModal = () => {
        setCheckedState(new Array(list.length).fill(false));
        setModalFailtxt("");
        setShow(false);
    };
    const submitForm = (e) => {
        e.preventDefault();
        var myNewPanoramaList = data.myPanoramaList;
        var ExPanoramaData = {};
        var newFakeID = fakeID;
        for (let i = 0; i <= checkedState.length - 1; i++) {
            if (checkedState[i] === true) {
                ExPanoramaData = {};
                ExPanoramaData.fakeID = newFakeID;
                newFakeID += 1;
                ExPanoramaData.pID = list[i].pID;
                ExPanoramaData.panoramaName = list[i].name;
                ExPanoramaData.ownerID = list[i].ownerID;
                ExPanoramaData.authorName = list[i].authorName;
                ExPanoramaData.imgLink = list[i].imgLink;
                ExPanoramaData.smallimgLink = list[i].smallimgLink;
                ExPanoramaData.mapX = null;
                ExPanoramaData.mapY = null;
                ExPanoramaData.music = null;
                myNewPanoramaList = myNewPanoramaList.concat(ExPanoramaData);
            }
        }
        setFakeID(newFakeID);
        setData({ ...data, myPanoramaList: myNewPanoramaList });
        clearModal();
        setChooseMyScene(false);
    }
    const handleReload = () => { //重新再跑一次ajax
        setFetchData(false);//設置成還未抓取資料
    }
    return (
        <>
            {/* 2.選自己的全景圖庫的彈出式視窗 */}
            <Modal
                show={chooseMyScene}
                // 點擊背景時不自動關閉
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header>
                    <Modal.Title> 自己的全景圖庫 </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitForm}>
                        <div className='d-flex flex-column'>
                            <Row className="row-cols-1 row-cols-md-2 g-4">
                                {
                                    show && (
                                        list.slice(indexOfFirstPost, indexOfLastPost).map((panorama, index) => {
                                                return (
                                                    <div key={panorama.pID}>
                                                        <CheckboxCard key={panorama.pID} panorama={panorama} index={index} currentPage={currentPage}
                                                           postsPerPage={postsPerPage} checkedState={checkedState} setCheckedState={setCheckedState} />
                                                    </div>
                                                )
                                        })
                                    )
                                }
                            </Row>
                            <Row>
                                <p className='text-center pt-3'> {currentPage}/{count}頁 </p>
                            </Row>
                            <Row className='pt-2'>
                                <Col md={2} className='d-flex justify-content-start'>
                                    {
                                        (currentPage > 1) && (
                                            <Button variant="outline-secondary" onClick={handlePre}> 上一頁 </Button>
                                        )
                                    }
                                </Col>
                                <Col>
                                    <input type="submit" name="submit" value="新增至展場" className="update_btn w-100" />
                                </Col>
                                <Col md={2} className='d-flex justify-content-end'>
                                    {
                                        (currentPage < count) && (
                                            <Button variant="outline-secondary" onClick={handleAdd}> 下一頁 </Button>
                                        )
                                    }
                                </Col>
                            </Row>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleReload}> 重新整理⟳ </Button>
                    <p style={{ color: 'red' }}>{Modalfailtxt}</p>
                    <Button className="cancel_btn" onClick={() => {
                        clearModal();
                        setChooseMyScene(false);
                    }}> 取消 </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ChooseMySceneModal;