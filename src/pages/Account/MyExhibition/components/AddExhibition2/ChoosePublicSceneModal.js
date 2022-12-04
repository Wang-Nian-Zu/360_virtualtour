import { Button, Modal, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CheckboxCard from './CheckboxCard';
const ChoosePublicSceneModal = (props) => {
    const { data } = props;
    const { setData } = props;
    const { fakeID } = props;
    const { setFakeID } = props;
    const { choosePublicScene } = props;
    const { setChoosePublicScene } = props;
    useEffect(() => {
        console.log(data);
    }, [data]);
    const [show, setShow] = useState(false); //卡片的呈現要在撈完資料之前
    const [fetchData, setFetchData] = useState(false);
    const [checkedState, setCheckedState] = useState([]);
    const [list, setList] = useState(null);
    const clearModal = () => {
        setCheckedState(new Array(list.length).fill(false));
        setModalFailtxt("");
        setShow(false);
    };
    const [Modalfailtxt, setModalFailtxt] = useState("");
    let history = useNavigate(); //use for Navigate on Previous
    // 分頁
    const [count, setCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4);
    const indexOfLastPost = currentPage * postsPerPage; // 1*9 2*9
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 9-9 18-9

    useEffect(() => {
        if (!fetchData) {
            axios({
                method: "get",
                url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getPublicPanoramaList',
                dataType: "JSON",
                withCredentials: true
            })
                .then((res) => {
                    console.log(res);
                    if (res.data.Login) {
                        setList(res.data.value);//自己抓到的全部全景圖
                        if (res.data.value.length > 0) {
                            setCheckedState(new Array(res.data.value.length).fill(false));
                        } else {
                            setCheckedState(new Array(res.data.value.length).fill(false));
                            setModalFailtxt("注意: 公開全景圖庫沒有任何全景圖");
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
        if (fetchData) {
            // 初始值取四個
            setCount(Math.ceil(list.length / 4));
        }
    }, [fetchData, list, count]);

    const handleAdd = () => {
        setCurrentPage(currentPage+1);
    }
    const handlePre = () => {
        setCurrentPage(currentPage-1);
    }

    const submitForm = (e) => {
        e.preventDefault();
        var myNewPanoramaList = data.myPanoramaList;
        var ExPanoramaData = {};
        var newFakeID = fakeID;
        for (let i = 0; i <= checkedState.length - 1; i++) {
            if (checkedState[i] === true) {
                ExPanoramaData = {};
                ExPanoramaData.fakeID = newFakeID; //加入fakeID
                newFakeID += 1;
                ExPanoramaData.pID = list[i].pID;
                ExPanoramaData.ownerID = list[i].ownerID;
                ExPanoramaData.authorName = list[i].authorName;
                ExPanoramaData.panoramaName = list[i].name;
                ExPanoramaData.imgLink = list[i].imgLink;
                ExPanoramaData.smallimgLink = list[i].smallimgLink;
                ExPanoramaData.mapX = null;
                ExPanoramaData.mapY = null;
                ExPanoramaData.music = null;
                myNewPanoramaList = myNewPanoramaList.concat(ExPanoramaData);//這裡不能用push要用concat
            }
        }
        setFakeID(newFakeID); //fakeID+1
        setData({ ...data, myPanoramaList: myNewPanoramaList });
        clearModal();
        setChoosePublicScene(false);
    }
    const handleReload = () => { //重新再跑一次ajax
        setFetchData(false);//設置成還未抓取資料
    }
    useEffect(() => {
        if(count !== 0){
            if(currentPage > count ){ //當前頁面大於總共的頁面時，當前面變成總共的頁面
                setCurrentPage(count) ;
            }
        }
    }, [count, currentPage]);
    return (
        <>
            {/* 3.選公開全景圖模板的彈出式視窗 */}
            <Modal
                show={choosePublicScene}
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header>
                    <Modal.Title>從公開全景圖庫挑選</Modal.Title>
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
                                    <input className="update_btn w-100" type="submit" name="submit" value="新增至展場" />
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
                        setChoosePublicScene(false);
                    }}>
                        取消
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ChoosePublicSceneModal;