import '../index.css';
import ExProgressBar from './ExProgressBar';
import Phase6Panorama from './AddExhibition6/Phase6Panorama';
import RuleOffcanvas6 from './rule/RuleOffcanvas6';

const AddEx6 = (props) => {
    const now = 100;
    const { data } = props;
    const { phase } = props;
    const { setFailtxt } = props;
    const { moveSpotsArray } = props;
    const { infoSpotsArray } = props;
    const { customSpotsArray } = props;
    return (
        <>
            <h2 className="text-center">六、預覽展場</h2>
            <div className="helpRuleButton">
                <RuleOffcanvas6 />
            </div>
            <ExProgressBar now={now} />{/* 進度條 */}
            <br />
            <Phase6Panorama data={data} phase={phase} setFailtxt={setFailtxt}
                moveSpotsArray={moveSpotsArray} infoSpotsArray={infoSpotsArray} customSpotsArray={customSpotsArray} />
        </>
    );
}
export default AddEx6;