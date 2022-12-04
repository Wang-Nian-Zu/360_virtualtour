import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import ReactPannellum from "react-pannellum";
import React, { useState, useEffect } from 'react';
const EditInfoModal = (props) => {
    const { editHotspotID } = props;//要編輯的hotspotID
    const { setEditHotspotID } = props;
    const { infoSpotsArray } = props;
    const { setInfoSpotsArray } = props;
    const { infoEditModalShow } = props;
    const { setInfoEditModalShow } = props;
    const { failtxt } = props;
    const { setFailtxt } = props;
    const { setInfoSpotUI } = props;
    const { showInfoDetail } = props;
    const [editInfo, setEditInfo] = useState({
        title: "",
        detailtxt: ""
    });
    useEffect(() => {
        var InfoTitle = "";
        var InfoDetailtxt = "";
        for (let i = 0; i < infoSpotsArray.length; i++) {
            if (infoSpotsArray[i].id === editHotspotID) {
                InfoTitle = infoSpotsArray[i].title;
                InfoDetailtxt = infoSpotsArray[i].detailtxt;
                break;
            }
        }
        setEditInfo({ title: InfoTitle, detailtxt: InfoDetailtxt });
    }, [infoSpotsArray, editHotspotID]);

    const onInfoChange = (event) => {
        var pass = true;
        if (event.target.name === "title") {
            if (event.target.value.length > 20) {
                pass = false;
                setFailtxt("warning: 主題名稱請勿超過20個字");
            }
        }
        if (pass) {
            setEditInfo({ ...editInfo, [event.target.name]: event.target.value });
            setFailtxt("");
        }
    }
    const submitInfoForm = (e) => {
        e.preventDefault();
        if ((editInfo.title !== "") && (editInfo.detailtxt !== "")) {
            var newInfoSpotsArray = infoSpotsArray;
            for (let i = 0; i < infoSpotsArray.length; i++) {
                if (infoSpotsArray[i].id === editHotspotID) {
                    let hs = {
                        id: editHotspotID,
                        pitch: infoSpotsArray[i].pitch,
                        yaw: infoSpotsArray[i].yaw,
                        type: "info",
                        scale: true,
                        "createTooltipFunc": setInfoSpotUI,
                        "createTooltipArgs": { "id": infoSpotsArray[i].id, "txt": editInfo.title },
                        "clickHandlerFunc": showInfoDetail,
                        "clickHandlerArgs": { "id": infoSpotsArray[i].id, "title": editInfo.title, "detailtxt": editInfo.detailtxt }
                    }
                    ReactPannellum.removeHotSpot(editHotspotID, infoSpotsArray[i].currentSceneID);
                    ReactPannellum.addHotSpot(hs, infoSpotsArray[i].currentSceneID);
                    let newInfospot = { //用新的格式加入資訊點陣列中
                        id: editHotspotID,
                        isID: infoSpotsArray[i].isID, //給編輯展場做使用
                        epID: infoSpotsArray[i].epID, //給編輯展場做使用
                        currentSceneID: infoSpotsArray[i].currentSceneID,
                        currentSceneName: infoSpotsArray[i].currentSceneName,
                        title: editInfo.title,
                        detailtxt: editInfo.detailtxt,
                        pitch: infoSpotsArray[i].pitch,
                        yaw: infoSpotsArray[i].yaw
                    }
                    //存入前端收集的資料array中
                    newInfoSpotsArray.splice(i, 1, newInfospot);
                    break;
                }
            }
            setInfoSpotsArray(newInfoSpotsArray);
            setFailtxt("");
            setInfoEditModalShow(false);
        } else {
            setFailtxt("warning: 必填欄位請勿空白!");
        }
    }
    return (
        <>
            <Modal
                show={infoEditModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        編輯資訊點
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form onSubmit={submitInfoForm}>
                        <Container>
                            <Row>
                                <Col>主題名稱(限20字)<span style={{ color: 'red' }}>*</span></Col>
                                <Col>
                                    <input type="text" name="title" className="form-control" value={editInfo.title} onChange={onInfoChange} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>敘述文字<span style={{ color: 'red' }}>*</span></Col>
                                <Col>
                                    <textarea type="text" name="detailtxt" className="form-control" value={editInfo.detailtxt} onChange={onInfoChange} />
                                </Col>
                            </Row>
                            <Row className='d-flex justify-content-center'>
                                <input type="submit" name="submit" value="儲存編輯" className="update_btn" />
                            </Row>
                        </Container>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{ color: 'red' }}>{failtxt}</p>
                    <Button className="cancel_btn" onClick={() => {
                        setFailtxt("");
                        setInfoEditModalShow(false);
                        setEditHotspotID("");
                    }}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default EditInfoModal;