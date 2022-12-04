import React from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';

const CustomSpotModal = (props) => {
    const { customModalShow } = props;
    const { setCustomModalShow } = props;
    const { customValue } = props;
    return (
        <>
            <Modal
                show={customModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col className="text-center">
                                {
                                    (typeof customValue.imageLink === "object")
                                        ? (<img src={URL.createObjectURL(customValue.imageLink)} alt={"not_found_" + customValue.itemName} width="200px" />)
                                        : (<img src={customValue.imageLink} alt={"not_found_" + customValue.itemName} width="200px" />)
                                }

                            </Col>
                            <Col>
                                <h3>展品名稱: {customValue.itemName}</h3>
                                <br />
                                <h6 style={{color:"#99a074"}}>◈擁有人: {customValue.authorName}</h6>
                                <h6 style={{color:"#99a074"}}>◈隸屬展區: {customValue.currentSceneName}</h6>
                            </Col>
                        </Row>
                        <Row>
                            {
                                (customValue.musicLink !== "" && customValue.musicLink !== null)&&(
                                    (typeof customValue.musicLink === "object")
                                    ? (<><Col md={1}><h3>語音</h3></Col><Col><audio alt="not found" width={"250px"} src={URL.createObjectURL(customValue.musicLink)} controls /></Col></>)
                                    : (<><Col md={1}><h3>語音</h3></Col><Col><audio alt="not found" width={"250px"} src={customValue.musicLink} controls/></Col></>)
                                )
                            }
                        </Row>
                        <br />
                        <Row>
                            <Col md={1}><h3>介紹</h3></Col>
                            <Col>
                                <p>{customValue.itemIntro}</p>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel_btn" onClick={() => {
                        setCustomModalShow(false);
                    }}> 關閉 </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default CustomSpotModal; 