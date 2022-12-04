import React from 'react';
import Form from 'react-bootstrap/Form';
import "../index.css";
import { useNavigate } from 'react-router-dom';
const MySearchBar = ({ list, setSearchTerm, paginate }) => {
    let history = useNavigate();
    const handleSearchChange = (e) => {
        if (!e.target.value.toLowerCase()) {
            setSearchTerm(list); // 如果沒有輸入東西，就回傳全部的 list
            return;
        }
        // 如果 panoramaItem.name 裡面有包含輸入的值，則將符合的list抓出來
        const resultsArray = list.filter(panoramaItem => panoramaItem.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setSearchTerm(resultsArray);
        paginate(1);
        history("/myPanorama?p.1");
    }
    return (
        <>
        <Form className="d-flex">
            <Form.Control
                type="search"
                placeholder="搜尋..."
                className="me-2"
                aria-label="Search"
                onChange={handleSearchChange}
                id="mySearchBar"
            />
        </Form>
        </>
    )
}

export default MySearchBar;
