import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import '../index.css';
import { useNavigate } from "react-router-dom";

const EditMyPanoramaButton = (props) => {
    let history = useNavigate(); // use for Navigate on Previous
    const { pID } = props;
    const { panorama } = props;
    const [info, setInfo] = useState({
        panoramaName: panorama.name, // 使用後端撈出的資料當作初始值
        imgLink: "",
        smallimgLink: "",
        clearSmallImg: "false",
        permission: panorama.permission
    });
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSmallImage, setSelectedSmallImage] = useState(null);
    const [failtxt, setFailtxt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleClose = () => {
        setInfo({
            panoramaName: panorama.name, // 使用後端撈出的資料當作初始值
            imgLink: "",
            smallimgLink: "",
            clearSmallImg: "false",
            permission: panorama.permission
        });
        setSelectedImage(null);
        setSelectedSmallImage(null);
        setFailtxt("");
        setShow(false);
    };
    const onChange = (event) => {
        setInfo({ ...info, [event.target.name]: event.target.value }); // 更新表單資訊
    }
    const onImageChange = (event) => {
        //console.log(event.target.files[0]);
        //console.log(URL.createObjectURL(event.target.files[0]));
        setInfo({ ...info, [event.target.name]: event.target.value }); // 更新表單資訊
        setSelectedImage(event.target.files[0]); // 顯示圖片
    }
    const onSmallImageChange = (event) => {
        //console.log(event.target.files[0]);
        //console.log(URL.createObjectURL(event.target.files[0]));
        setInfo({ ...info, [event.target.name]: event.target.value }); // 更新表單資訊
        setSelectedSmallImage(event.target.files[0]); // 顯示圖片
    }
    const handleClick = () => {
        axios({ // isLogin() // 先判斷是否登入，才能去紀錄使用者按下喜歡行為
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                if (res.data.Login) { // 有登入
                    axios({ // 撈目前這個pID資料出來
                        method: "get",
                        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=checkPanoramaAccess&pID=" + pID,
                        dataType: "JSON",
                        withCredentials: true
                    })
                        .then((res) => {
                            if (res.data.access) {
                                setShow(true);
                            } else {
                                alert(res.data.cause);
                                setShow(false);
                            }
                        })
                        .catch(console.error);
                } else { // 未登入
                    alert('Error: Session has been lost!!!');
                    history('/loginRegister');
                }
            })
            .catch(console.error);
    }
    const submitForm = (e) => {
        e.preventDefault();
        const sendData = new FormData();
        if (info.panoramaName !== "") {
            setIsLoading(true);
            sendData.append('name', info.panoramaName);
            if ((selectedImage !== null)) {
                sendData.append('PanoramaImage', selectedImage, info.imgLink);
            }
            if ((selectedSmallImage !== null)) { // 縮圖為可選擇上傳項目
                sendData.append('PanoramaSmallImage', selectedSmallImage, info.smallimgLink);
            }
            sendData.append('clearSmallImg', info.clearSmallImg);
            sendData.append('permission', info.permission);
            for (var pair of sendData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            axios({
                method: "post",
                url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=updateMyPanorama&pID=" + pID,
                dataType: "JSON",
                data: sendData,
                withCredentials: true
            })
                .then((res) => {
                    console.log(res);
                    if (res.data.status === "valid") {
                        setInfo({
                            panoramaName: "",
                            imgLink: "",
                            smallimgLink: "",
                            clearSmallImg: "false",
                            permission: "private"
                        });
                        setSelectedImage(null);
                        setSelectedSmallImage(null);
                        setFailtxt("");
                        alert("更新成功");
                        window.location.reload();
                    } else {
                        setFailtxt("錯誤:" + res.data.cause);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            setFailtxt("錯誤: 更新的全景圖名稱為必填項目，請勿空白");
        }
    }
    return (
        <>
            <Button size="md" className="EditMyPanoramaButton" onClick={handleClick}>編輯</Button>
            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title>編輯全景圖</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitForm}>
                        <Container>
                            <Row>
                                <Col>全景圖名稱</Col>
                                <Col>
                                    <input type="text" name="panoramaName" className="form-control"
                                        onChange={onChange} value={info.panoramaName} />
                                </Col>
                            </Row>
                            <br />
                            <Tabs
                                defaultActiveKey="originPano"
                                id="tab"
                                className="mb-3">
                                <Tab eventKey="originPano" title="全景圖(原圖)">
                                    <Row>
                                        <Col>全景圖片</Col>
                                        <Col>
                                            <img src={panorama.imgLink} alt="not_found" style={{ width: "250px" }} />
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="editPano" title="上傳全景圖(更新)">
                                    <Row>
                                        <Col>重新上傳全景圖片</Col>
                                        <Col>
                                            <input type="file" name="imgLink" className="form-control"
                                                accept="image/*,.jpg,.png" onChange={onImageChange} value={info.imgLink} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        {
                                            selectedImage && (
                                                <div>
                                                    <div>
                                                        <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedImage)} />
                                                    </div>
                                                    <div className='mt-3'>
                                                        <Button className="remove_btn" onClick={() => {
                                                            setInfo({ ...info, imgLink: "" });
                                                            setSelectedImage(null);
                                                        }}> 移除 </Button>
                                                    </div>
                                                </div>
                                            )}
                                    </Row>
                                </Tab>
                            </Tabs>
                            <br />
                            <Tabs
                                defaultActiveKey="originSmallPano"
                                id="Smalltab"
                                className="mb-3">
                                <Tab eventKey="originSmallPano" title="底部圖(原圖)">
                                    <Row>
                                        <Col>底部圖(可選)</Col>
                                        <Col>
                                        {
                                            (panorama.smallimgLink !== "")&&(panorama.smallimgLink !== null)&&
                                            (<img src={panorama.smallimgLink} alt="not_found" style={{ width: "250px" }}/>)
                                        }
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="editSmallPano" title="上傳底部圖(更新)">
                                    <Row>
                                        <Col>重新上傳底部圖</Col>
                                        <Col>
                                            <input type="file" name="smallimgLink" className="form-control"
                                                accept="image/*,.jpg,.png" onChange={onSmallImageChange} value={info.smallimgLink} />
                                            <input type="checkbox" onChange={onChange}
                                                name="clearSmallImg" value="true" /> &nbsp;清除原先底部圖
                                        </Col>
                                    </Row>
                                    <Row>
                                        {
                                            selectedSmallImage && (
                                                <div>
                                                    <div>
                                                        <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedSmallImage)} />
                                                    </div>
                                                    <div className='mt-3'>
                                                        <Button className="remove_btn" onClick={() => {
                                                            setInfo({ ...info, smallimgLink: "" });
                                                            setSelectedSmallImage(null);
                                                        }}> 移除 </Button>
                                                    </div>
                                                </div>
                                            )}
                                    </Row>
                                </Tab>
                            </Tabs>
                            <br />
                            <Row>
                                <Col>存取權限</Col>
                                <Col>
                                    <select type="dropdown" name="permission" className="form-control mb-3" onChange={onChange} value={info.permission}>
                                        <option value="public">公開</option>
                                        <option value="private">私人</option>
                                    </select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                {
                                    (isLoading)&&(
                                        <Spinner className='text-center' animation="border" variant="dark" />
                                    )
                                }       
                            </Row>
                            <Row>
                                <input type="submit" name="submit" value="儲存" className="storage" />
                            </Row>
                        </Container>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{ color: 'red' }}>{failtxt}</p>
                    <Button className='cancel_btn' onClick={handleClose}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default EditMyPanoramaButton;