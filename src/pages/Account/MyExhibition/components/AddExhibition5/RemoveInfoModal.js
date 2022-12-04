import { Modal, Button } from 'react-bootstrap';
import ReactPannellum from "react-pannellum";

const RemoveInfoModal = (props) => {
    const { location } = props;
    const { infoSpotsArray } = props;
    const { setInfoSpotsArray } = props;
    const { removeHotspotID } = props;
    const { infoRemoveModalShow } = props;
    const { setInfoRemoveModalShow } = props;
    const handleDeleteHotspot = () => {
        ReactPannellum.removeHotSpot(removeHotspotID, location);
        //刪除MoveSpot Array中
        var newInfoSpotsArray = [...infoSpotsArray];
        if (infoSpotsArray.length !== 0) {
            for (let i = 0; i < newInfoSpotsArray.length; i++) {
                if (newInfoSpotsArray[i].id === removeHotspotID) {
                    newInfoSpotsArray.splice(i, 1);  //刪除資料array中移動點
                    break;
                }
            }
        }
        setInfoSpotsArray(newInfoSpotsArray);
        //將彈出式視窗關閉
        setInfoRemoveModalShow(false);
    }
    return (
        <>
            <Modal
                show={infoRemoveModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        刪除資訊點
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    你確定要從此展場移除此資訊點嗎 ?
                    <span style={{ color: '#e38970' }}>&nbsp;(刪除之後將無法復原) </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDeleteHotspot}>刪除</Button>
                    <Button className="cancel_btn" onClick={() => {
                        setInfoRemoveModalShow(false);
                    }}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default RemoveInfoModal;