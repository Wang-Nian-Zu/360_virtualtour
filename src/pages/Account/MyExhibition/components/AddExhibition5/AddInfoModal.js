import React from 'react';
import ReactPannellum from "react-pannellum";
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import "./styles.css";
const AddInfoModal = (props) => {
    const { infoAddModalShow } = props;
    const { setInfoAddModalShow } = props;
    const { failtxt } = props;
    const { setFailtxt } = props;
    const { infoSpot } = props;
    const { setInfoSpot } = props;
    const { fakeHotspotID } = props;
    const { setFakeHotspotID } = props;
    const { infoSpotsArray } = props; //展場的所有資訊點物件都存在這個陣列
    const { setInfoSpotsArray } = props;
    const { setInfoSpotUI } = props;
    const { showInfoDetail } = props;
    const onInfoChange = (event) => {
        var pass = true;
        if (event.target.name === "title") {
            if (event.target.value.length > 20) {
                pass = false;
                setFailtxt("warning: 主題名稱請勿超過20個字");
            }
        }
        if (pass) {
            setInfoSpot({ ...infoSpot, [event.target.name]: event.target.value });
            setFailtxt("");
        }
    }
    const submitInfoForm = (e) => {
        e.preventDefault();
        if ((infoSpot.title !== "") && (infoSpot.detailtxt !== "")) {
            let hs = {
                id: fakeHotspotID.toString() + "h",
                pitch: infoSpot.pitch,
                yaw: infoSpot.yaw,
                type: "info",
                scale: true,
                "createTooltipFunc": setInfoSpotUI,
                "createTooltipArgs": { "id": fakeHotspotID.toString() + "h", "txt": infoSpot.title },
                "clickHandlerFunc": showInfoDetail,
                "clickHandlerArgs": { "id": fakeHotspotID.toString() + "h", "title": infoSpot.title, "detailtxt": infoSpot.detailtxt }
            }
            ReactPannellum.addHotSpot(hs, infoSpot.currentSceneID);
            let newInfospot = { //用新的格式加入資訊點陣列中
                id: fakeHotspotID.toString() + "h",
                currentSceneID: infoSpot.currentSceneID,
                currentSceneName: infoSpot.currentSceneName,
                title: infoSpot.title,
                detailtxt: infoSpot.detailtxt,
                pitch: infoSpot.pitch,
                yaw: infoSpot.yaw
            }
            //存入前端收集的資料array中
            var newInfoSpotsArray = infoSpotsArray;
            newInfoSpotsArray = newInfoSpotsArray.concat(newInfospot);
            setInfoSpotsArray(newInfoSpotsArray);
            setFakeHotspotID(fakeHotspotID + 1);//增加fake hotspotID
            setFailtxt("");
            setInfoAddModalShow(false);
            setInfoSpot({
                id: "",
                currentSceneID: "",
                currentSceneName: "",
                title: "",
                detailtxt: "",
                pitch: 0,
                yaw: 0
            });
        } else {
            setFailtxt("warning: 必填欄位請勿空白!");
        }
    };

    return (
        <Modal
            show={infoAddModalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    新增一個資訊點
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form onSubmit={submitInfoForm}>
                    <Container>
                        <Row>
                            <Col>目前場景</Col>
                            <Col>
                                <input type="text" name="currentSceneName" className="form-control" value={infoSpot.currentSceneName} disabled />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>目前的Pitch</Col>
                            <Col>
                                <input type="text" name="pitch" className="form-control" value={infoSpot.pitch} disabled />
                            </Col>
                            <Col>目前的Yaw</Col>
                            <Col>
                                <input type="text" name="yaw" className="form-control" value={infoSpot.yaw} disabled />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>主題名稱(限20字)<span style={{ color: 'red' }}>*</span></Col>
                            <Col>
                                <input type="text" name="title" className="form-control" value={infoSpot.title} onChange={onInfoChange} />
                            </Col>
                        </Row>
                        <br />
                        <Row className='d-flex justify-content-center'>
                            <Col>敘述文字<span style={{ color: 'red' }}>*</span></Col>
                            <Col>
                                <textarea type="text" name="detailtxt" className="form-control" value={infoSpot.detailtxt} onChange={onInfoChange} />
                            </Col>
                            <Row>
                                <input type="submit" name="submit" value="加入資訊點" className="update_btn" />
                            </Row>
                        </Row>
                    </Container>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <p style={{ color: 'red' }}>{failtxt}</p>
                <Button className="cancel_btn" onClick={() => {
                    setFailtxt("");
                    setInfoAddModalShow(false);
                    setInfoSpot({ //存新增的移動點資料的表單
                        id: "",
                        currentSceneID: "",
                        currentSceneName: "",
                        title: "",
                        detailtxt: "",
                        pitch: 0,
                        yaw: 0
                    });
                }}>取消</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default AddInfoModal;