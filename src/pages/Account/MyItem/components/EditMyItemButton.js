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
import { useNavigate } from "react-router-dom";

const EditMyItemButton = (props) => {
    const history = useNavigate();
    const { iID } = props;
    const { item } = props;
    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selected3D, setSelected3D] = useState(null);
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        iID: item.iID,
        name: item.name, // 使用後端撈出的資料當作初始值
        intro: item.intro,
        object3D: item.object3D,
        img2D: item.img2D,
        musicLink: item.musicLink,
        permission: item.permission,
        clearMusic:"false"
    });
    const [failtxt, setFailtxt] = useState("");
    const handleClose = () => {
        setData({
            iID: item.iID,
            name: item.name, // 使用後端撈出的資料當作初始值
            intro: item.intro,
            object3D: item.object3D,
            img2D: item.img2D,
            musicLink: item.musicLink,
            permission: item.permission,
            clearMusic:"false"
        });
        setSelectedImage(null);
        setSelected3D(null);
        setSelectedMusic(null);
        setFailtxt("");
        setShow(false);
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }
    const onImageChange = (event) => {
        //console.log(event.target.files[0]);
        setData({ ...data, [event.target.name]: event.target.value }); //更新表單資訊
        setSelectedImage(event.target.files[0]);//顯示圖片
    }
    const on3DChange = (event) => {
        //console.log(event.target.files[0]);
        setData({ ...data, [event.target.name]: event.target.value });//更新表單資訊
        setSelected3D(event.target.files[0]);//顯示圖片
    }
    const onMusicChange = (event) => {
        //console.log(event.target.files[0]);
        setSelectedMusic(event.target.files[0]);//顯示圖片
    }
    const handleClick = () => {
        axios({ // 先判斷是否登入
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                if (res.data.Login) { // 有登入
                    axios({ // 撈目前這個iID資料出來
                        method: "get",
                        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=checkItemAccess&iID=" + iID,
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
        setIsLoading(true);
        const sendData = new FormData();
        sendData.append('name', data.name);
        sendData.append('intro', data.intro);
        sendData.append('permission', data.permission);
        sendData.append('iID', data.iID);
        if (selectedImage !== null) {
            sendData.append('img2D', selectedImage, selectedImage.name);
        } else {
            sendData.append('img2D', data.img2D);
        }
        //3D
        if (selected3D !== null) {
            sendData.append('object3D', selected3D, selected3D.name);
        } else {
            sendData.append('object3D', data.object3D);
        }
        //musicLink
        if (selectedMusic !== null) {
            sendData.append('musicLink', selectedMusic, selectedMusic.name);
        } else if ((selectedMusic === null) && (data.clearMusic === "false")) {
            if(data.musicLink !== null){
                sendData.append('musicLink', data.musicLink);
            }else{
                sendData.append('musicLink', '');
            }
        }else{
            sendData.append('musicLink', '');
        }
        for (var pair of sendData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        axios({
            method: "post",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=EditItem",
            dataType: "JSON",
            data: sendData,
            withCredentials: true
        })
            .then((res) => {
                console.log(res);
                if (res.data.state === 'invalid') {
                    alert(res.data.cause);
                } else {
                    handleClose();
                    alert(res.data.cause);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <>
            <Button size="md" className="editItemButton" onClick={handleClick}> 編輯 </Button>
            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title> 編輯展品 </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitForm}>
                        <Container>
                            <Row className='pb-3'>
                                <Col> 展品名稱 <span style={{ color: "red" }}> * </span> </Col>
                                <Col>
                                    <input type="text" name="name" className="form-control"
                                        onChange={handleChange} value={data.name} />
                                </Col>
                            </Row>
                            <Row className='pb-3'>
                                <Col> 展品介紹 <span style={{ color: "red" }}> * </span> </Col>
                                <Col>
                                    <textarea name="intro" className="form-control"
                                        onChange={handleChange} value={data.intro} />
                                </Col>
                            </Row>
                            <Tabs
                                defaultActiveKey="originItemImg"
                                id="ImageTab"
                                className="mb-3">
                                <Tab eventKey="originItemImg" title="展品代表圖(原)">
                                    <Row>
                                        <Col> 展品代表圖 </Col>
                                        <Col>
                                            <img src={data.img2D} alt="not_found" style={{ width: "250px" }} />
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="editItemImg" title="上傳代表圖(更新)">
                                    <Row>
                                        <Col> 重新上傳展品代表圖 </Col>
                                        <Col>
                                            <input type="file" name="img2D" className="form-control"
                                                accept="image/*,.jpg,.png" onChange={onImageChange} />
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
                                                            setData({ ...data, img2D: null});
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
                                defaultActiveKey="originItemModel"
                                id="ModelTab"
                                className="mb-3">
                                <Tab eventKey="originItemModel" title="展品模型(原)">
                                    <Row>
                                        <Col> 展品模型 </Col>
                                        <Col>
                                            {data.object3D}
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="editItemModel" title="上傳模型(更新)">
                                    <Row>
                                        <Col> 重新上傳展品模型 </Col>
                                        <Col>
                                            <input type="file" name="object3D" className="form-control" onChange={on3DChange}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {
                                            selected3D && (
                                                <div>
                                                    <div className='mt-3'>
                                                        <Button className="remove_btn" onClick={() => {
                                                            setData({ ...data, object3Dx: "", object3D: null });
                                                            setSelected3D(null);
                                                        }}> 移除 </Button>
                                                    </div>
                                                </div>
                                            )}
                                    </Row>
                                </Tab>
                            </Tabs>
                            <br />
                            <Tabs
                                defaultActiveKey="originItemMusic"
                                id="Musictab"
                                className="mb-3">
                                <Tab eventKey="originItemMusic" title="展品音訊(原)">
                                    <Row>
                                        <Col> 展品音訊(可選) </Col>
                                        <Col>
                                            {
                                                (data.musicLink !== "")&& (
                                                    <>
                                                        <audio src={data.musicLink} controls></audio>
                                                        <Button className="remove_btn" onClick={() => {
                                                            setData({ ...data, musicLinkx: "", musicLink: '' });
                                                            setSelectedMusic(null);
                                                        }}> 移除音檔 </Button>
                                                    </>
                                                )
                                            }
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="editItemMusic" title="上傳音訊(更新)">
                                    <Row>
                                        <Col>重新上傳展品音訊</Col>
                                        <Col>
                                            <input type="file" name="musicLink" className="form-control"
                                                accept="audio/mpeg" onChange={onMusicChange} />
                                            <input type="checkbox" onChange={handleChange}
                                                name="clearMusic" value="true" /> &nbsp;清除原先導覽語音
                                        </Col>
                                    </Row>
                                    <Row>
                                        {
                                            selectedMusic
                                            && (
                                                <><audio src={URL.createObjectURL(selectedMusic)} controls></audio></>
                                            )}
                                    </Row>
                                </Tab>
                            </Tabs>
                            <br />
                            <Row>
                                <Col> 存取權限 </Col>
                                <Col>
                                    <select type="dropdown" name="permission" className="form-control mb-3" onChange={handleChange} value={data.permission}>
                                        <option value="public"> 公開 </option>
                                        <option value="private"> 私人 </option>
                                    </select>
                                </Col>
                            </Row>
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
                    <Button className='cancel_btn' onClick={handleClose}> 取消 </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default EditMyItemButton;