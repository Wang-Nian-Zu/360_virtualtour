import React from 'react';
import '../index.css';
import AddExPanoDropdown from './AddExhibition2/AddExPanoDropdown';
import ExPanoTable from './AddExhibition2/ExPanoTable';
import ExProgressBar from './ExProgressBar';
import { Row } from 'react-bootstrap';
import RuleOffcanvas2 from './rule/RuleOffcanvas2';

const AddEx2 = (props) => {
    const now = 20;
    const { data } = props; //表單資料
    const { setData } = props; //編輯表單資料
    const { setFailtxt } = props; //編輯錯誤提示文字
    const { fakeID } = props;
    const { setFakeID } = props;
    const { moveSpotsArray } = props;
    const { setMoveSpotsArray } = props;
    const { infoSpotsArray } = props;
    const { setInfoSpotsArray } = props;
    const { customSpotsArray } = props;
    const { setCustomSpotsArray } = props;
    return (
        <>
            <h2 className="text-center">二、準備全景圖</h2>
            <div className="helpRuleButton">
                <RuleOffcanvas2 />
            </div>
            <ExProgressBar now={now} />{/* 進度條 */}

            <Row>
                {/* 新增全景圖的下拉式按鈕 */}
                <AddExPanoDropdown data={data} setData={setData} fakeID={fakeID} setFakeID={setFakeID} />
            </Row>
            <br />
            <Row>
                <ExPanoTable data={data} setData={setData} setFailtxt={setFailtxt}
                    moveSpotsArray={moveSpotsArray} setMoveSpotsArray={setMoveSpotsArray}
                    infoSpotsArray={infoSpotsArray} setInfoSpotsArray={setInfoSpotsArray}
                    customSpotsArray={customSpotsArray} setCustomSpotsArray={setCustomSpotsArray}
                />
            </Row>
        </>
    );
}

export default AddEx2;