import { Container, Row, Col, Tab, Tabs, Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const EditExPanoramaButton = (props) => {
    let history = useNavigate(); //use for Navigate on Previous
    const { index } = props;
    const { currentPage } = props;
    const { postsPerPage } = props;
    const { panorama } = props;
    const { data } = props;
    const { setData } = props;
    const [info, setInfo] = useState({
        panoramaName: panorama.panoramaName,
        imgLink: "",
        smallimgLink: "",
        smallimgLinkFile: null,
        clearSmallImg: "false",
        music: "",
        musicFile: null,
        clearMusic: "false"
    });
    const [show, setShow] = useState(false); //控制彈出式視窗

    const [failtxt, setFailtxt] = useState("");
    const handleClose = () => {
        setInfo({
            panoramaName: panorama.panoramaName,
            imgLink: "",
            smallimgLink: "",
            smallimgLinkFile: null,
            clearSmallImg: "false",
            music: "",
            musicFile: null,
            clearMusic: "false"
        });
        setFailtxt("");
        setShow(false);
    };
    const onChange = (event) => {
        if (event.target.name === "panoramaName") {
            if (event.target.value.length > 15) {
                setFailtxt("warning:全景圖名稱太長");
            } else {
                setInfo({ ...info, [event.target.name]: event.target.value });//更新表單資訊
                setFailtxt("");
            }
        } else {
            setInfo({ ...info, [event.target.name]: event.target.value });//更新表單資訊
            setFailtxt("");
        }
    }
    const onFileChange = (event) => {
        if ((event.target.name === "smallimgLink") && ((event.target.files[0].type === "image/png") || (event.target.files[0].type === "image/jpeg"))) {
            setInfo({ ...info, [event.target.name]: event.target.value, [event.target.name + "File"]: event.target.files[0] });//顯示圖片
        } else if ((event.target.name === "music") && (event.target.files[0].type === "audio/mpeg")) {
            setInfo({ ...info, [event.target.name]: event.target.value, [event.target.name + "File"]: event.target.files[0] });//顯示影片
        } else {
            alert("格式輸入錯誤!!!");
        }
    }
    const handleClick = () => {
        axios({ //isLogin()//先判斷是否登入，才能去紀錄使用者按下喜歡行為
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                if (res.data.Login) {//有登入
                    setShow(true); //直接跳出彈跳式視窗
                } else {//未登入
                    alert('Error: Session has been lost!!!');
                    history('/loginRegister');
                }
            })
            .catch(console.error);
    }
    const submitForm = (e) => {
        e.preventDefault();
        var ExPanoramaData = {};
        if (info.panoramaName !== "") {
            ExPanoramaData.fakeID = panorama.fakeID;
            if(panorama.epID !== undefined){ //編輯展場才會用到
                ExPanoramaData.epID = panorama.epID;
            }else{
                ExPanoramaData.epID = undefined;
            }
            ExPanoramaData.pID = panorama.pID;
            ExPanoramaData.ownerID = panorama.ownerID;
            ExPanoramaData.authorName = panorama.authorName;
            ExPanoramaData.panoramaName = info.panoramaName;
            ExPanoramaData.imgLink = panorama.imgLink;
            ExPanoramaData.mapX = panorama.mapX;
            ExPanoramaData.mapY = panorama.mapY;
            if ((info.smallimgLinkFile !== null)) {//縮圖為可選擇上傳項目
                ExPanoramaData.smallimgLink = info.smallimgLinkFile;
            } else if ((info.smallimgLinkFile === null) && (info.clearSmallImg === "false")) {
                ExPanoramaData.smallimgLink = panorama.smallimgLink;
            } else {
                ExPanoramaData.smallimgLink = "";
            }
            if ((info.musicFile !== null)) {//導覽語音為可選擇上傳項目
                ExPanoramaData.music = info.musicFile;
            } else if ((info.musicFile === null) && (info.clearMusic === "false")) {
                ExPanoramaData.music = panorama.music;
            } else {
                ExPanoramaData.music = null;
            }
            var NewMyPanoramaList = data.myPanoramaList;
            NewMyPanoramaList.splice(index+((currentPage-1)*postsPerPage), 1, ExPanoramaData);
            handleClose();
            setData({ ...data, myPanoramaList: NewMyPanoramaList });
            //這裡splice方法第一個參數宣告要更換的物件在陣列的位置，並刪除他，然後換成ExPanoramaData物件

        } else {
            setFailtxt("*為必填選項，不能空白");
        }
    }
    return (
        <>
            <Button size="md" className="EditExPanoramaButton" onClick={handleClick}>編輯</Button>

            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>編輯全景圖</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitForm}>
                        <Container>
                            <Row>
                                <Col>全景圖名稱<span style={{ color: "red" }}>*</span></Col>
                                <Col>
                                    <input type="text" name="panoramaName" className="form-control"
                                        onChange={onChange} value={info.panoramaName} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>全景圖<span style={{ color: "red" }}>*</span></Col>
                                {
                                    (panorama.imgLink) &&
                                    (<Col><img src={panorama.imgLink} alt="img_not_found" style={{ width: "250px" }} /></Col>)
                                }
                            </Row>
                            <br />
                            <Tabs id="Smalltab" className="mb-3" >
                                {
                                    (panorama.smallimgLink !== "") && (
                                        <Tab eventKey="originSmallPano" title="底部圖(原)">
                                            <Row>
                                                <Col>底部圖(可選)</Col>
                                                {
                                                    (typeof panorama.smallimgLink === "object")
                                                        ? (<Col><img src={URL.createObjectURL(panorama.smallimgLink)} alt="not_found" style={{ width: "250px" }} /></Col>)
                                                        : (<Col><img src={panorama.smallimgLink} alt="not_found" style={{ width: "250px" }} /></Col>)
                                                }
                                            </Row>
                                        </Tab>
                                    )
                                }
                                <Tab eventKey="editSmallPano" title="上傳底部圖(更新)">
                                    <Row>
                                        <Col>重新上傳底部圖</Col>
                                        <Col>
                                            <input type="file" name="smallimgLink" className="form-control"
                                                accept="image/*,.jpg,.png" onChange={onFileChange} value={info.smallimgLink} />
                                            <input type="checkbox" onChange={onChange}
                                                name="clearSmallImg" value="true" /> &nbsp;清除原先底部圖
                                        </Col>
                                    </Row>
                                    <Row>
                                        {
                                            info.smallimgLinkFile && (
                                                <div>
                                                    <div>
                                                        <img alt="not found" width={"250px"} src={URL.createObjectURL(info.smallimgLinkFile)} />
                                                    </div>
                                                    <div className='mt-3'>
                                                        <Button variant="danger" onClick={() => {
                                                            setInfo({ ...info, smallimgLink: "", smallimgLinkFile: null });
                                                        }}> 移除 </Button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </Row>
                                </Tab>
                            </Tabs>
                            <br />
                            <Tabs id="MusicTab" className="mb-3">
                                {
                                    (panorama.music) && (
                                        (typeof panorama.music === "object")
                                            ? (
                                                <Tab eventKey="originMusic" title="導覽語音(原)">
                                                    <Row>
                                                        <Col>導覽語音(可選)</Col>
                                                        <Col><audio alt="not found" width={"250px"} src={URL.createObjectURL(panorama.music)} controls /></Col>
                                                    </Row>
                                                </Tab>
                                            )
                                            : (
                                                <Tab eventKey="originMusic" title="導覽語音(原)">
                                                    <Row>
                                                        <Col>導覽語音(可選)</Col>
                                                        <Col><audio alt="not found" width={"250px"} src={panorama.music} controls /></Col>
                                                    </Row>
                                                </Tab>
                                            )
                                    )
                                }
                                <Tab eventKey="editMusic" title="上傳導覽語音(更新)">
                                    <Row>
                                        <Col>上傳導覽語音(可選)</Col>
                                        <Col>
                                            <input type="file" name="music" className="form-control"
                                                accept="audio/mpeg" onChange={onFileChange} value={info.music} />
                                            <input type="checkbox" onChange={onChange}
                                                name="clearMusic" value="true" /> &nbsp;清除原先導覽語音
                                        </Col>
                                    </Row>
                                    <Row>
                                        {
                                            info.musicFile && (
                                                <div>
                                                    <div>
                                                        <audio alt="not found" width={"250px"} src={URL.createObjectURL(info.musicFile)} controls />
                                                    </div>
                                                    <div className='mt-3'>
                                                        <Button variant="danger" onClick={() => {
                                                            setInfo({ ...info, music: "", musicFile: null });
                                                        }}> 移除 </Button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </Row>
                                </Tab>
                            </Tabs>
                            <br />
                            <Row>
                                <input type="submit" name="submit" value="儲存更改" className="storage" />
                            </Row>
                        </Container>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{ color: 'red' }}>{failtxt}</p>
                    <Button className="cancel_btn" onClick={handleClose}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default EditExPanoramaButton;