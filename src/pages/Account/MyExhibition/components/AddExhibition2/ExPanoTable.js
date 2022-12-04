import React, { useState , useEffect } from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import ExPanoTableData from "./ExPanoTableData.js";
const ExPanoTable = (props) => {
    const { data } = props;
    const { setData } = props;
    const { moveSpotsArray } = props;
    const { setMoveSpotsArray } = props;
    const { infoSpotsArray } = props;
    const { setInfoSpotsArray } = props;
    const { customSpotsArray } = props;
    const { setCustomSpotsArray } = props;
    // 分頁
    const count = Math.ceil(data.myPanoramaList.length / 7);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(7);
    const indexOfLastPost = currentPage * postsPerPage; // 1*7 2*7
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 7-7 14-7
    const handleAdd = () => {
        setCurrentPage(currentPage + 1);
    }
    const handlePre = () => {
        setCurrentPage(currentPage - 1);
    }
    //-----------------
    useEffect(() => {
        if(count !== 0){
            if(currentPage > count ){ //當前頁面大於總共的頁面時，當前面變成總共的頁面
                setCurrentPage(count) ;
            }
        }
    }, [count, currentPage]);
    //------------------
    return (
        <div>
            <Row className='d-flex pt-0 pb-3 w-25'>
                <Col md={2} className='d-flex justify-content-start'>
                    {
                        (currentPage > 1) && (
                            <button className="pre_btn" onClick={handlePre}> ◀ </button>
                        )
                    }
                    {
                        (currentPage <= 1) && (
                            <button className="pre_btn" onClick={handlePre} disabled> ◀ </button>
                        )
                    }
                </Col>
                <Col className='d-flex justify-content-center align-items-center'>
                    {
                        (count > 0) &&
                        (<p md={2}> {currentPage}/{count} 頁 </p>)
                    }
                </Col>
                <Col md={2} className='d-flex justify-content-start'>
                    {
                        (currentPage < count) && (
                            <button className="pre_btn" onClick={handleAdd}> ▶ </button>
                        )
                    }
                    {
                        (currentPage >= count) && (
                            <button className="pre_btn" onClick={handleAdd} disabled> ▶ </button>
                        )
                    }
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th width="120px"> 起始場景 <span style={{ color: "red" }}> * </span> </th>
                        <th> 全景圖名稱 </th>
                        <th> 作者 </th>
                        <th width="180px"> 全景圖預覽 </th>
                        <th width="180px"> 底部圖 </th>
                        <th> 語音(點擊編輯功能新增) </th>
                        <th width="180px"> 管理功能 </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (data.myPanoramaList.length > 0) && (
                            data.myPanoramaList.slice(indexOfFirstPost, indexOfLastPost).map((panorama, index) => {
                                console.log(panorama);
                                return (
                                    <ExPanoTableData key={index + ((currentPage - 1) * postsPerPage)} data={data} setData={setData}
                                        index={index} panorama={panorama} currentPage={currentPage} postsPerPage={postsPerPage}
                                        moveSpotsArray={moveSpotsArray} setMoveSpotsArray={setMoveSpotsArray}
                                        infoSpotsArray={infoSpotsArray} setInfoSpotsArray={setInfoSpotsArray}
                                        customSpotsArray={customSpotsArray} setCustomSpotsArray={setCustomSpotsArray}
                                    />
                                )
                            })
                        )
                    }
                </tbody>
            </Table>
        </div >
    )
}

export default ExPanoTable;