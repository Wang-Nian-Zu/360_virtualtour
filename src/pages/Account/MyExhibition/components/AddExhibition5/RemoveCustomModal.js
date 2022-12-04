import { Modal, Button } from 'react-bootstrap';
import ReactPannellum from "react-pannellum";

const RemoveCustomModal = (props) => {
    const { location } = props;
    const { customSpotsArray } = props;
    const { setCustomSpotsArray } = props;
    const { removeHotspotID } = props;
    const { customRemoveModalShow } = props;
    const { setCustomRemoveModalShow } = props;
    const handleDeleteHotspot = () => {
        ReactPannellum.removeHotSpot(removeHotspotID, location);
        //刪除CustomSpot Array中
        var newCustomSpotsArray = [...customSpotsArray];
        if (customSpotsArray.length !== 0) {
            for (let i = 0; i < newCustomSpotsArray.length; i++) {
                if (newCustomSpotsArray[i].id === removeHotspotID) {
                    newCustomSpotsArray.splice(i, 1);  //刪除資料array中客製化展品點
                    break;
                }
            }
        }
        setCustomSpotsArray(newCustomSpotsArray);
        //將彈出式視窗關閉
        setCustomRemoveModalShow(false);
    }
    return (
        <>
            <Modal
                show={customRemoveModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        刪除客製化展品點
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    你確定要從此展場移除此客製化展品點嗎 ?
                    <span style={{ color: '#e38970' }}>&nbsp;(刪除之後將無法復原) </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDeleteHotspot}>刪除</Button>
                    <Button className="cancel_btn" onClick={() => {
                        setCustomRemoveModalShow(false);
                    }}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default RemoveCustomModal;