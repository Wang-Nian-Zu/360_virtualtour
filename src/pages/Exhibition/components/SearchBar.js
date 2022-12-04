import React, { useState } from "react";
import ExhibitionCard from './ExhibitionCard.js';
import Pagination from './Pagination.js';
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../index.css"

const SearchBar = ({ placeholder, list }) => {
    let history = useNavigate(); //use for Navigate on Previous
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(9);
    const indexOfLastPost = currentPage * postsPerPage; // 1*9 2*9
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 9-9 18-9
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const array = list.filter((item) =>
        // Object.values會從 object item 取值，join('') 會把值轉成字串，抓展覽的 name 去比對輸入搜尋欄的字
        Object.values(item.name).join('').toLowerCase().includes(searchTerm)
    )
    const searchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        paginate(1);
        history("/exhibition?p.1");
    }
    return (
        <div>
            <Row className="p-3">
                <Col sm={6} >
                    <p ><Link to="/home"> 首頁 </Link> / 展場活動</p>
                </Col>
                <Col sm={6} className="searchbarWidth d-flex">
                    <input
                        className="form-control input-lg"
                        placeholder={placeholder}
                        onChange={searchChange}
                    />
                </Col>
            </Row>
            <Row>
                {array.slice(indexOfFirstPost, indexOfLastPost).map((exhibition) => {
                    return (
                        <Col key={exhibition.eID} sm={4} className="p-3">
                            <ExhibitionCard key={exhibition.eID} exhibition={exhibition} />
                        </Col>
                    )
                })}
            </Row>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={array.length}
                        paginate={paginate}
                    />
                </Col>
            </Row>
        </div >
    );
}

export default SearchBar;