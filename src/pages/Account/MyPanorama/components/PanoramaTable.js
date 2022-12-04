import React from "react";
import Table from 'react-bootstrap/Table';
import TableData from './TableData.js';
import Pagination from './Pagination.js';
import { Col, Row } from 'react-bootstrap';
import '../index.css';

const PanoramaTable = ({ show, searchTerm, totalPages
    , postsPerPage, indexOfLastPost, paginate, indexOfFirstPost }) => {

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>全景圖名稱</th>
                        <th>預覽</th>
                        <th>全景縮圖</th>
                        <th>狀態</th>
                        <th>存取權限</th>
                        <th>管理功能</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        show && (
                            searchTerm.slice(indexOfFirstPost, indexOfLastPost).map((panorama) => {
                                return (
                                    <TableData key={panorama.pID} panorama={panorama} paginate={paginate}/>
                                )
                            })
                        )
                    }
                </tbody>
            </Table>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default PanoramaTable;