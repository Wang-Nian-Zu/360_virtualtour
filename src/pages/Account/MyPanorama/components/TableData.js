import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DeleteMyPanoramaButton from './DeleteMyPanoramaButton.js';
import EditMyPanoramaButton from './EditMyPanoramaButton';
import LookMyPanoramaButton from './LookMyPanoramaButton.js';
import '../index.css';

const TableData = (props) => {
    const { panorama } = props;
    const { paginate } = props;
    return (
        <>
            <tr>
                <td>{panorama.name}</td>
                <td><LookMyPanoramaButton name={panorama.name} imgLink={panorama.imgLink} /></td>
                <td><LookMyPanoramaButton name={panorama.name} imgLink={panorama.smallimgLink} /></td>
                <td>
                    {panorama.status === "exhibitive" && <p style={{ color: "red" }}> 展出中 </p>}
                    {panorama.status === "waiting" && <p style={{ color: "orange" }}> 待展出 </p>}
                    {panorama.status === "NeverUsed" && <p style={{ color: "black" }}> 尚未使用 </p>}
                </td>
                <td>
                    {panorama.permission === "private" && <p> 私人 </p>}
                    {panorama.permission === "public" && <p> 公開 </p>}
                </td>
                <td>
                    <Row className="pt-0">
                        <Col>
                            <EditMyPanoramaButton pID={panorama.pID} panorama={panorama} />
                        </Col>
                        <Col>
                            <DeleteMyPanoramaButton pID={panorama.pID} paginate={paginate}/>
                        </Col>
                    </Row>
                </td>
            </tr>
        </>
    )
}
export default TableData;