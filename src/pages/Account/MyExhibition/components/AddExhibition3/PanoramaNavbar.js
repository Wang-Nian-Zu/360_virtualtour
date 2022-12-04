import React from 'react';
import PanoramaButton from './PanramaButton.js';
import { Row, Col } from 'react-bootstrap';
import './index.css';

const PanoramaNavbar = (props) => {
    const { data } = props;
    const { phase } = props;
    const { setLocation } = props;
    const { moveSpotsArray } = props;
    return (
        <div className='moveSpotNavbar'>
            <Row className='p-2'>
                <Col md={2} className='moveSpot-container d-flex justify-content-center align-items-center'>
                    <h5 className='mb-0' style={{color:"#ffffff"}}> 所有展區 </h5>
                </Col>
                <Col>
                    <Row className='d-flex align-items-center'>
                        <Col>
                            {
                                (phase === 3) && (
                                    data.myPanoramaList.map((panorama, index) => {
                                        return (
                                            <PanoramaButton key={index} panorama={panorama} panoCount={data.myPanoramaList.length}
                                                setLocation={setLocation} moveSpotsArray={moveSpotsArray} />
                                        )
                                    })
                                )
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
export default PanoramaNavbar;