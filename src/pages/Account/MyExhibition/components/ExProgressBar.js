import { Row, Col, ProgressBar } from 'react-bootstrap';
import React from 'react';
import '../index.css';
const ExProgressBar = (props) => {
    const {now} = props;
    return(
        <>
            <Row style={{ marginBottom: "5px", marginTop: "20px" }}>
                <Col className="text-center" xs={4} md={2} style={{ lineHeight: "10px" }}><span>進度: {now}%</span></Col>
                <Col xs={14} md={10}>
                    <ProgressBar className='Bar' striped variant="bar" now={now} />
                </Col>
            </Row>
        </>
    );
}

export default ExProgressBar;