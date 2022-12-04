import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import "./index.css"

const ChooseScenePosition = (props) => {
    const { data } = props;
    const { chooseScene } = props;
    const { setChooseScene } = props;
    const onChange = (event) => {
        setChooseScene(event.target.value);
    }
    return (
        <>
            <Row className="w-100">
                <Col md={3}>
                    <select type="dropdown" name="whichScene" className="mb-3" onChange={onChange} value={chooseScene} required>
                        <option value="">選擇要標記的展區</option>
                        {
                            data.myPanoramaList.map((panorama) => {
                                return (<option key={panorama.fakeID} value={panorama.fakeID.toString()}>{panorama.panoramaName}</option>);
                            })
                        }
                    </select>
                    <p>※在下方平面地圖點擊右鍵標記展區位置</p>
                </Col>
                <Col>
                    <Row className='d-flex flex-row align-items-center pt-0'>
                        <Col>
                            {
                                data.myPanoramaList.map((panorama) => {
                                    if ((panorama.mapX === null) && (panorama.mapY === null)) {
                                        return (
                                            <Button className="okpano_btn me-2 mb-2" key={panorama.fakeID}>
                                                {panorama.panoramaName}
                                                {/* x: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; y: */}
                                            </Button>
                                        )
                                    }else{
                                        if ((panorama.mapX > -1) && (panorama.mapY > -1) && (panorama.mapX !== null) && (panorama.mapY !== null)) {
                                            return (
                                                <Button className="checkpano_btn me-2 mb-2" key={panorama.fakeID}>
                                                    {panorama.panoramaName}
                                                    {/* x:{panorama.mapX}<br/>y:{panorama.mapY} */}
                                                </Button>
                                            );
                                        } else {
                                            return (
                                                <Button className="okpano_btn me-2 mb-2" key={panorama.fakeID}>
                                                    {panorama.panoramaName}
                                                    {/* x: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; y: */}
                                                </Button>
                                            )
                                        }
                                    }
                                    
                                })
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
export default ChooseScenePosition;