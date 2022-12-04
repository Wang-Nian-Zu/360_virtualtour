import React, { useState } from 'react';
import { Row } from 'react-bootstrap';
import '../index.css';
import ExProgressBar from './ExProgressBar';
import PanoramaNavbar from './AddExhibition3/PanoramaNavbar.js';
import MovePannellumDiv from './AddExhibition3/MovePannellumDiv.js';
import RuleOffcanvas3 from './rule/RuleOffcanvas3';

const AddEx3 = (props) => {
    const now = 40;
    const { data } = props;
    const { setData } = props;
    const { phase } = props;
    const { fakeHotspotID } = props;
    const { setFakeHotspotID } = props;
    const { moveSpotsArray } = props;
    const { setMoveSpotsArray } = props;
    const [location, setLocation] = useState(data.firstScene.toString());//字串
    return (
        <>
            <h2 className="text-center">三、動線規劃</h2>
            <div className="helpRuleButton">
                <RuleOffcanvas3 />
            </div>
            <ExProgressBar now={now} /> {/* 進度條 */}
            <Row>
                <PanoramaNavbar data={data} setData={setData} setLocation={setLocation}
                    phase={phase} moveSpotsArray={moveSpotsArray} />
            </Row>
            <Row className='pt-3 pb-3'>
                {
                    <MovePannellumDiv phase={phase} data={data} setData={setData} location={location} setLocation={setLocation}
                        fakeHotspotID={fakeHotspotID} setFakeHotspotID={setFakeHotspotID}
                        moveSpotsArray={moveSpotsArray} setMoveSpotsArray={setMoveSpotsArray} />
                }
            </Row>

        </>
    );
}

export default AddEx3;