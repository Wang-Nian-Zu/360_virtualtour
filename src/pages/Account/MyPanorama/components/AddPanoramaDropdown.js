import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import '../index.css';

function UpdatePanoramaModal(props) { // 上傳全景圖的表單資訊
    const { show } = props;
    const { setModalShow } = props;
    const [info, setInfo] = useState({ // 表單上的資訊
        panoramaName: "",
        imgLink: "",
        smallimgLink: ""
    })
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSmallImage, setSelectedSmallImage] = useState(null);
    const [failtxt, setFailtxt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (event) => {
        setInfo({ ...info, [event.target.name]: event.target.value }); // 更新表單資訊
    }
    const onImageChange = (event) => {
        setInfo({ ...info, [event.target.name]: event.target.value }); // 更新表單資訊
        setSelectedImage(event.target.files[0]); // 顯示圖片
    }
    const onSmallImageChange = (event) => {
        setInfo({ ...info, [event.target.name]: event.target.value }); // 更新表單資訊
        setSelectedSmallImage(event.target.files[0]); // 顯示圖片
    }
    const submitForm = (e) => {
        e.preventDefault();
        const sendData = new FormData();
        if ((selectedImage !== null) && (info.panoramaName !== "")) {
            setIsLoading(true);
            sendData.append('name', info.panoramaName);
            sendData.append('PanoramaImage', selectedImage, info.imgLink); // append(name, value, filename)
            if ((selectedSmallImage !== null)) { // 縮圖為可選擇上傳項目
                sendData.append('PanoramaSmallImage', selectedSmallImage, info.smallimgLink);
            }
            for (var pair of sendData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            axios({
                method: "post",
                url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=uploadMyPanorama",
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
                            smallimgLink: ""
                        });
                        setSelectedImage(null);
                        setSelectedSmallImage(null);
                        setModalShow(false);
                        setFailtxt("");
                        alert(res.data.cause);
                        window.location.reload();
                    } else {
                        setFailtxt("錯誤:" + res.data.cause);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            setFailtxt("錯誤: 全景圖名稱與檔案為必填項目，請勿空白");
        }
    }

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    從本機裝置上傳全景圖
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={submitForm}>
                    <Container>
                        <Row>
                            <Col>全景圖名稱 <span style={{ color: "red" }}> * </span></Col>
                            <Col>
                                <input type="text" name="panoramaName" className="form-control"
                                    onChange={handleChange} value={info.panoramaName} />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>全景圖片上傳 <span style={{ color: "red" }}> * </span></Col>
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
                                            <img alt=" not found " width={"250px"} src={URL.createObjectURL(selectedImage)} />
                                        </div>
                                        <div className='mt-3'>
                                            <Button className="remove_btn" onClick={() => {
                                                setInfo({ ...info, imgLink: "" });
                                                setSelectedImage(null);
                                            }}> 移除 </Button>
                                        </div>
                                    </div>
                                )
                            }
                        </Row>
                        <Row>
                            <Col>底部圖上傳(可選)</Col>
                            <Col>
                                <input type="file" name="smallimgLink" className="form-control"
                                    accept="image/*,.jpg,.png" onChange={onSmallImageChange} value={info.smallimgLink} />
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
                                )
                            }
                        </Row>
                        <Row>
                            {
                                (isLoading)&&(
                                    <Spinner className='text-center' animation="border" variant="dark" />
                                )
                            }       
                        </Row>
                        <Row>
                            <input type="submit" name="submit" value="上傳" className="update_btn" />
                        </Row>
                    </Container>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <p style={{ color: 'red' }}>{failtxt}</p>
                <Button className='cancel_btn' onClick={() => {
                    setInfo({
                        panoramaName: "",
                        imgLink: "",
                        smallimgLink: ""
                    });
                    setSelectedImage(null);
                    setSelectedSmallImage(null);
                    setModalShow(false);
                    setFailtxt("");
                }}> 取消 </Button>
            </Modal.Footer>
        </Modal>
    );
}

const AddPanoramaDropdown = () => {
    const [modal1Show, setModal1Show] = useState(false);
    return (
        <>
            <Button id="addPanorama" onClick={() => setModal1Show(true)}>從本機上傳</Button>

            <UpdatePanoramaModal
                show={modal1Show}
                setModalShow={setModal1Show}
            />
        </>
    )
}

export default AddPanoramaDropdown;