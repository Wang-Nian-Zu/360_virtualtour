import { Modal, Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import ReactPannellum from "react-pannellum";
import React, { useState, useEffect } from 'react';
const EditCustomModal = (props) => {
    const { editHotspotID } = props;//要編輯的hotspotID
    const { setEditHotspotID } = props;
    const { customSpotsArray } = props;
    const { setCustomSpotsArray } = props;
    const { customEditModalShow } = props;
    const { setCustomEditModalShow } = props;
    const { failtxt } = props;
    const { setFailtxt } = props;
    const { setCustomSpotUI } = props;
    const [valueIsload, setValueIsload] = useState(false); //原來的展品值
    const [originValue, setOriginValue] = useState({}); //原來的展品值
    const [editValue, setEditValue] = useState({ //編輯後的展品值
        itemName: "",
        itemIntro: "",
        imageLink: "",
        imageLinkFile: null,
        musicLink: "",
        musicLinkFile: null,
        cleanMusic: false
    });
    useEffect(() => {
        if (customEditModalShow) {
            var itemName = "";
            var itemIntro = "";
            var originalobject = {};
            for (let i = 0; i < customSpotsArray.length; i++) {
                if (customSpotsArray[i].id === editHotspotID) {
                    originalobject = customSpotsArray[i];
                    itemName = customSpotsArray[i].itemName;
                    itemIntro = customSpotsArray[i].itemIntro;
                    break;
                }
            }
            setOriginValue(originalobject);//把原先該客製化展品點資訊先記錄起來
            setEditValue({
                itemName: itemName,
                itemIntro: itemIntro,
                imageLink: "",
                imageLinkFile: null,
                musicLink: "",
                musicLinkFile: null,
                cleanMusic: false
            });
            setValueIsload(true);
        }
    }, [customSpotsArray, editHotspotID, customEditModalShow]);

    const onCustomChange = (event) => {
        var pass = true;
        if (event.target.name === "itemName") {
            if (event.target.value.length > 20) {
                pass = false;
                setFailtxt("warning: 展品名稱不能超過20個字");
            }
        }
        if (pass) {
            setEditValue({ ...editValue, [event.target.name]: event.target.value });
            setFailtxt("");
        }
    }
    const onFileChange = (event) => {
        if ((event.target.name === "imageLink") && ((event.target.files[0].type === "image/png") || (event.target.files[0].type === "image/jpeg"))) {
            setEditValue({ ...editValue, [event.target.name]: event.target.value, [event.target.name + "File"]: event.target.files[0] });//顯示圖片
        } else if ((event.target.name === "musicLink") && (event.target.files[0].type === "audio/mpeg")) {
            setEditValue({ ...editValue, [event.target.name]: event.target.value, [event.target.name + "File"]: event.target.files[0] });//顯示語音
        } else {
            alert("格式輸入錯誤!!!");
        }
    }
    const submitCustomForm = (e) => {
        e.preventDefault();
        if ((editValue.itemName !== "") && (editValue.itemIntro !== "")) {
            var newCustomSpotsArray = customSpotsArray;
            for (let i = 0; i < customSpotsArray.length; i++) {
                if (customSpotsArray[i].id === editHotspotID) {
                    var imageFile = "";
                    if (editValue.imageLinkFile !== null) {
                        imageFile = editValue.imageLinkFile;
                    } else {
                        imageFile = originValue.imageLink;
                    }
                    var musicFile = "";
                    if (editValue.musicLinkFile !== null) {
                        musicFile = editValue.musicLinkFile;
                    } else if ((editValue.musicLinkFile === null) && (editValue.cleanMusic === false)) {
                        musicFile = originValue.musicLink;
                    } else {
                        musicFile = "";
                    }
                    let newCustomspot = { //用新的格式加入客製化展品點陣列中
                        id: editHotspotID,
                        iID: customSpotsArray[i].iID,
                        csID: customSpotsArray[i].csID, //編輯展場需要用
                        epID: customSpotsArray[i].epID, //編輯展場需要用
                        currentSceneID: customSpotsArray[i].currentSceneID,
                        currentSceneName: customSpotsArray[i].currentSceneName,
                        pitch: customSpotsArray[i].pitch,
                        yaw: customSpotsArray[i].yaw,
                        itemName: editValue.itemName,//有改變
                        itemIntro: editValue.itemIntro,//有改變
                        modelLink: customSpotsArray[i].modelLink,
                        imageLink: imageFile, //有改變
                        imageWidth: customSpotsArray[i].imageWidth,
                        imageHeight: customSpotsArray[i].imageHeight,
                        musicLink: musicFile, //有改變
                        ownerID: customSpotsArray[i].ownerID,
                        authorName: customSpotsArray[i].authorName
                    }
                    //存入前端收集的資料array中
                    newCustomSpotsArray.splice(i, 1, newCustomspot);
                    let hs = {
                        id: editHotspotID,
                        pitch: customSpotsArray[i].pitch,
                        yaw: customSpotsArray[i].yaw,
                        scale: true,
                        "createTooltipFunc": setCustomSpotUI,
                        "createTooltipArgs": { "id": customSpotsArray[i].id, "txt": editValue.itemName, "img": imageFile, "customObject": newCustomspot }
                    }
                    ReactPannellum.removeHotSpot(editHotspotID, customSpotsArray[i].currentSceneID);
                    ReactPannellum.addHotSpot(hs, customSpotsArray[i].currentSceneID);
                    setEditValue({
                        itemName: "",
                        itemIntro: "",
                        imageLink: "",
                        imageLinkFile: null,
                        musicLink: "",
                        musicLinkFile: null,
                        cleanMusic: false
                    });
                    break;
                }
            }
            setCustomSpotsArray(newCustomSpotsArray);
            setFailtxt("");
            setValueIsload(false);
            setCustomEditModalShow(false);
        } else {
            setFailtxt("warning: 必填欄位請勿空白!");
        }
    }
    return (
        <>
            {
                (valueIsload) && (
                    <Modal
                        show={customEditModalShow}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                編輯客製化展品點
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <form onSubmit={submitCustomForm}>
                                <Container>
                                    <Row>
                                        <Col>展品擁有者</Col>
                                        <Col>
                                            <input type="text" name="ownerID" className="form-control" value={originValue.authorName} disabled />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col>展品3D模型</Col>
                                        <Col>
                                            <textarea type="button" name="modelLink" className="form-control" value={originValue.modelLink} disabled />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col>展品名稱(限20字)<span style={{ color: 'red' }}>*</span></Col>
                                        <Col>
                                            <input type="text" name="itemName" className="form-control" value={editValue.itemName} onChange={onCustomChange} />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col>文字介紹<span style={{ color: 'red' }}>*</span></Col>
                                        <Col>
                                            <textarea type="text" name="itemIntro" className="form-control" value={editValue.itemIntro} onChange={onCustomChange} />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Tabs defaultActiveKey="originImage" id="tab" className="mb-3">
                                        <Tab eventKey="originImage" title="展品原圖">
                                            <Row>
                                                <Col>展品縮圖<span style={{ color: "red" }}>*</span></Col>
                                                {
                                                    ((typeof originValue.imageLink === "object") && (originValue.imageLink !== null))
                                                        ? (<Col><img src={URL.createObjectURL(originValue.imageLink)} alt="img_not_found" style={{ width: "250px" }} /></Col>)
                                                        : (<Col><img src={originValue.imageLink} alt="img_not_found" style={{ width: "250px" }} /></Col>)
                                                }
                                            </Row>
                                        </Tab>
                                        <Tab eventKey="editPano" title="上傳(更新)">
                                            <Row>
                                                <Col>重新上傳展品縮圖</Col>
                                                <Col>
                                                    <input type="file" name="imageLink" className="form-control"
                                                        accept="image/*,.jpg,.png" onChange={onFileChange} value={editValue.imageLink} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                {
                                                    editValue.imageLinkFile && (
                                                        <div>
                                                            <div>
                                                            <img alt="not found" width={"250px"} src={URL.createObjectURL(editValue.imageLinkFile)} />
                                                            </div>
                                                            <div className='mt-3'>
                                                            <Button variant="danger" onClick={() => {
                                                                setEditValue({ ...editValue, imageLink: "", imageLinkFile: null });
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
                                            originValue.musicLink && (
                                                <Tab eventKey="originMusic" title="導覽語音">
                                                    <Row>
                                                        <Col>導覽語音(可選)</Col>
                                                        {
                                                            ((typeof originValue.musicLink === "object") && (originValue.musicLink !== null))
                                                                ? (<Col><audio alt="not found" width={"250px"} src={URL.createObjectURL(originValue.musicLink)} controls /></Col>)
                                                                : (<Col><audio alt="not found" width={"250px"} src={originValue.musicLink} controls /></Col>)
                                                        }
                                                    </Row>
                                                </Tab>
                                            )
                                        }
                                        <Tab eventKey="editMusic" title="上傳導覽語音(更新)">
                                            <Row>
                                                <Col>上傳導覽語音</Col>
                                                <Col>
                                                    <input type="file" name="musicLink" className="form-control"
                                                        accept="audio/mpeg" onChange={onFileChange} value={editValue.musicLink} />
                                                    <input type="checkbox" onChange={onCustomChange} name="cleanMusic" value="true" /> &nbsp;清除原先導覽語音
                                                </Col>
                                            </Row>
                                            <Row>
                                                {
                                                    editValue.musicLinkFile && (
                                                        <div>
                                                            <div>
                                                                <audio alt="not found" width={"250px"} src={URL.createObjectURL(editValue.musicLinkFile)} controls />
                                                            </div>
                                                            <div className='mt-3'>
                                                                <Button variant="danger" onClick={() => {
                                                                    setEditValue({ ...editValue, musicLink: "", musicLinkFile: null });
                                                                }}> 移除 </Button>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </Row>
                                        </Tab>
                                    </Tabs>
                                    <Row>
                                        <input type="submit" name="submit" value="儲存編輯" className="update_btn" />
                                    </Row>
                                </Container>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <p style={{ color: 'red' }}>{failtxt}</p>
                            <Button className="cancel_btn" onClick={() => {
                                setValueIsload(false);
                                setCustomEditModalShow(false);
                                setFailtxt("");
                                setOriginValue({});
                                setEditValue({
                                    itemName: "",
                                    itemIntro: "",
                                    imageLink: "",
                                    imageLinkFile: null,
                                    musicLink: "",
                                    musicLinkFile: null,
                                    cleanMusic: false
                                });
                                setEditHotspotID("");
                            }}> 取消 </Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        </>
    );
}
export default EditCustomModal;