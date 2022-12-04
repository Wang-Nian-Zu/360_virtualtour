import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CheckboxItemCard from './CheckboxItemCard.js';
import { Button, Col, Row } from 'react-bootstrap';
const ChooseMyItem = (props) => {
    let history = useNavigate(); //use for Navigate on Previous
    const { setFailtxt } = props;
    const { checkedState } = props;
    const { setCheckedState } = props;
    const { myItemList } = props;
    const { setMyItemList } = props;
    const [showMyItemCard, setShowMyItemCard] = useState(false);
    const [fetchData, setFetchData] = useState(false);
    // 分頁
    const [count, setCount] = useState(1); // 總共有幾頁
    const [currentPage, setCurrentPage] = useState(1); // 第幾頁
    const [postsPerPage] = useState(6); // 每頁有幾個
    const indexOfLastPost = currentPage * postsPerPage; // 1*9 2*9
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 9-9 18-9
    useEffect(() => {
        if (!fetchData) {
            axios({
                method: "get",
                url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyItemList',
                dataType: "JSON",
                withCredentials: true
            })
                .then((res) => {
                    if (res.data.Login) {
                        setMyItemList(res.data.value);//自己抓到的全部全景圖
                        if (res.data.value.length > 0) {
                            setCheckedState(new Array(res.data.value.length).fill(false));//處理radio
                            setFailtxt("");
                        } else {
                            setCheckedState(new Array(res.data.value.length).fill(false));//處理radio
                            setFailtxt("注意: 自己的展品圖庫沒有任何全景圖");
                        }
                        setShowMyItemCard(true);
                        setFetchData(true);
                    } else {
                        alert("error ! session has been lost!");
                        history(`/loginRegister`);
                    }
                })
                .catch(console.error)
        }
    }, [history, setFailtxt, fetchData, setCheckedState, setMyItemList]);

    const handleReload = () => { //重新再跑一次ajax
        setFetchData(false);//設置成還未抓取資料
    }

    const handleAdd = () => {
        setCurrentPage(currentPage + 1);
    }
    const handlePre = () => {
        setCurrentPage(currentPage - 1);
    }
    useEffect(() => {
        if (fetchData) {
            setCount(Math.ceil(myItemList.length / 6));
        }
    }, [fetchData, myItemList]);
    useEffect(() => {
        if(count !== 0){
            if(currentPage > count ){ //當前頁面大於總共的頁面時，當前面變成總共的頁面
                setCurrentPage(count) ;
            }
        }
    }, [count, currentPage]);
    return (
        <>
            <Row>
                <Col>
                <Button variant="outline-secondary" onClick={handleReload}> 重新整理⟳ </Button>
                </Col>
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
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {
                    showMyItemCard && (
                        myItemList.slice(indexOfFirstPost, indexOfLastPost).map((item, index) => {
                            return (
                                <CheckboxItemCard key={item.iID} item={item} index={index} currentPage={currentPage}
                                postsPerPage={postsPerPage} checkedState={checkedState} setCheckedState={setCheckedState} />
                            )
                        })
                    )
                }
            </div>
        </>
    );
}
export default ChooseMyItem;