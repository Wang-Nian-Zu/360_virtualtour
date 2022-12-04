import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const InfoSpotModal = (props) => {
    const {infoModalShow} = props;
    const {setInfoModalShow} = props;
    const {title} = props;
    const {detailtxt} = props
    return (
        <>
            <Modal
                show={infoModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{detailtxt}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={() => {
                        setInfoModalShow(false);
                    }}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default InfoSpotModal;