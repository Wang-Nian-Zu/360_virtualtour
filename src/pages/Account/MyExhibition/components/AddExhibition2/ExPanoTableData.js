import React, { useEffect, useState } from 'react';
import RemoveExPanoramaButton from './RemoveExPanoramaButton.js';
import EditExPanoramaButton from './EditExPanoramaButton.js';
import LookMyPanoramaButton from './LookMyPanoramaButton.js';
import { Row, Col } from 'react-bootstrap';

const ExPanoTableData = (props) => {
    const { data } = props;
    const { setData } = props;
    const { index } = props;
    const { currentPage } = props;
    const { postsPerPage } = props;
    const { panorama } = props;
    const { moveSpotsArray } = props;
    const { setMoveSpotsArray } = props;
    const { infoSpotsArray } = props;
    const { setInfoSpotsArray } = props;
    const { customSpotsArray } = props;
    const { setCustomSpotsArray } = props;
    const chooseFirstScene = (event) => {
        setData({ ...data, [event.target.name]: Number(event.target.value) });
    };
    const [ischeck, setIscheck] = useState(false);
    useEffect(() => {
        if (panorama.fakeID === data.firstScene) {
            setIscheck(true);
        } else {
            setIscheck(false);
        }
    }, [panorama, data]);
    const test = () => {
        console.log(panorama);
    }
    return (
        <>
            <tr>
                <td>
                    <input type="radio" name="firstScene" value={panorama.fakeID}
                        onChange={chooseFirstScene} checked={ischeck} onClick={test} />
                </td>
                <td>{panorama.panoramaName}</td>
                <td>{panorama.authorName}</td>
                <td><LookMyPanoramaButton name={panorama.panoramaName} method={panorama.method} img={panorama.imgLink} /></td>
                <td>
                    {
                        panorama.smallimgLink && (
                            <div>
                                <LookMyPanoramaButton name={panorama.panoramaName} method={panorama.method} img={panorama.smallimgLink} />
                            </div>
                        )
                    }
                </td>
                <td>
                    {
                        panorama.music && (
                            (typeof panorama.music === "object")
                                ? (
                                    <div>
                                        <audio alt="not found" width={"250px"} src={URL.createObjectURL(panorama.music)} controls />
                                    </div>
                                )
                                : (
                                    <div>
                                        <audio alt="not found" width={"250px"} src={panorama.music} controls />
                                    </div>
                                )
                        )
                    }
                </td>
                <td>
                    <Row className="pt-0">
                        <Col>
                            <EditExPanoramaButton index={index} currentPage={currentPage} postsPerPage={postsPerPage}
                                panorama={panorama} data={data} setData={setData} />
                        </Col>
                        <Col>
                            <RemoveExPanoramaButton index={index} currentPage={currentPage} postsPerPage={postsPerPage}
                                data={data} setData={setData}
                                moveSpotsArray={moveSpotsArray} setMoveSpotsArray={setMoveSpotsArray}
                                infoSpotsArray={infoSpotsArray} setInfoSpotsArray={setInfoSpotsArray}
                                customSpotsArray={customSpotsArray} setCustomSpotsArray={setCustomSpotsArray} />
                        </Col>
                    </Row>
                </td>
            </tr>
        </>
    )
}
export default ExPanoTableData;
/*
<tr>
                                        <th scope="row">
                                            <Form.Check className="col-md-2" type="radio"
                                                name="first_scene" value="male">
                                            </Form.Check>
                                        </th>
                                        <td>swimming pool <button className="LookSceneButton"><img src={Preview} alt="查看" style={{ width: 20 }} /></button></td>
                                        <td><button type="button" class="btn btn-outline-primary">編輯</button><button type="button" class="btn btn-outline-danger">刪除</button></td>
                                    </tr>
*/