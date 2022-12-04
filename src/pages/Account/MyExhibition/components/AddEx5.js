import React from 'react';
import '../index.css';
import ExProgressBar from './ExProgressBar';
import Phase5Panorama from './AddExhibition5/Phase5Panorama.js';
import RuleOffcanvas5 from './rule/RuleOffcanvas5';

const AddEx5 = (props) => {
    const now = 80;
    const {phase} = props;
    const {data} = props;
    const {setData} = props;
    const { moveSpotsArray } = props;
    const { infoSpotsArray } = props;
    const { setInfoSpotsArray } = props;
    const { fakeHotspotID  } = props;
    const { setFakeHotspotID } = props;
    const { customSpotsArray } = props;
    const { setCustomSpotsArray } = props;
    return (
        <>
            <h2 className="text-center">五、設置資訊點、客製化展品點</h2>
            <div className="helpRuleButton">
                <RuleOffcanvas5 />
            </div>
            <ExProgressBar now = {now}/>{/* 進度條 */}
            <br/>
            <Phase5Panorama phase = {phase} data={data} setData= {setData} moveSpotsArray = {moveSpotsArray} 
            infoSpotsArray = {infoSpotsArray} setInfoSpotsArray = {setInfoSpotsArray}
            fakeHotspotID = {fakeHotspotID} setFakeHotspotID = {setFakeHotspotID} 
            customSpotsArray={customSpotsArray} setCustomSpotsArray = {setCustomSpotsArray} />
        </>
    );
}

export default AddEx5;