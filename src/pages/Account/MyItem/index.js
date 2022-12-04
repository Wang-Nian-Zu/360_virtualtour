import { useEffect, useState } from "react"
import MyNavbar from '../components/MyNavbar';
import axios from 'axios';
import { Table, Button, Modal, Row, Col } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from './components/Pagination.js';
import AddItem from './components/AddItem';
import InfoCard from "./components/InfoCard.js";
import ItemTableData from "./components/ItemTableData.js";
import "./index.css";
import MySearchBar from "./components/MySearchBar";

const Item = () => {
    const [windowSize, setWindowSize] = useState(window.innerHeight - 56);
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(window.innerHeight - 56);
            console.log(window.scrollY);
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            // 為了刪除之前的監聽事件
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    const [modalShow, setModalShow] = useState(false);
    const handleClose = () => setModalShow(false);
    const handleShow = () => setModalShow(true);

    const [ItemUsedNum, setItemUsedNum] = useState(0);
    const [waitingNum, setWaitingNum] = useState(0);
    const [neverUsedNum, setNeverUsedNum] = useState(0);
    useEffect(() => {
        axios({
            method: "post",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyItemStatistics",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                if (res.data.status === "valid") {
                    setItemUsedNum(res.data.statistics.ItemUsedNum);
                    setWaitingNum(res.data.statistics.waitingNum);
                    setNeverUsedNum(res.data.statistics.neverUsedNum);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const [list, setList] = useState([]) // start with an empty array
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState([]); // 搜尋後的list
    useEffect(() => {
        axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getItem",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                // console.log(res.data);
                setList(res.data);
                setSearchTerm(res.data);
                setShow(true);
            })
            .catch(console.error);
    }, [])

    function showNeverUsedItem() { // 列出尚未展出的展品
        var tryToFind = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status === "NeverUsed") {
                tryToFind.push(list[i]);
            }
        }
        setSearchTerm(tryToFind);
    }
    function showWaitingItem() { // 列出待展出的展品
        var tryToFind = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status === "waiting") {
                tryToFind.push(list[i]);
            }
        }
        setSearchTerm(tryToFind);
    }
    function showExhibitiveItem() { // 列出展出中的展品
        var tryToFind = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status === "ItemUsed") {
                tryToFind.push(list[i]);
            }
        }
        setSearchTerm(tryToFind);
    }
    function showAllItem() { // 列出所有展品
        var tryToFind = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status !== "") {
                tryToFind.push(list[i]);
            }
        }
        setSearchTerm(tryToFind);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const indexOfLastPost = currentPage * postsPerPage; // 1*5 2*5
    const indexOfFirstPost = indexOfLastPost - postsPerPage; // 5-5 10-5
    const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
        <div>
            <Row className='pt-0 me-0' style={{ height: windowSize }}>
                <Col md={2} className='navbar_menu'>
                    <MyNavbar />
                </Col>
                <Col className='d-flex flex-column m-3'>
                    <Row className="pt-0"><h1 className="text-center "> 展品管理 </h1></Row>
                    <Row className='d-flex flex-row'>
                        <Col>
                            <InfoCard key="1" count1={neverUsedNum} count2={waitingNum} count3={ItemUsedNum} />
                        </Col>
                    </Row>
                    <br />

                    <Row>
                        <Col xs={3} md={2}>
                            <Button id="addItem" onClick={handleShow}>從本機上傳</Button>
                        </Col>
                        <Col xs={2} md={3}>
                            <MySearchBar list={list} setSearchTerm={setSearchTerm} />
                        </Col>
                        <Col xs={7} md={7}>
                            <Dropdown>
                                <Dropdown.Toggle id="otherItem">
                                    篩選
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={showAllItem}>所有展品</Dropdown.Item>
                                    <Dropdown.Item onClick={showExhibitiveItem}>展出中的展品</Dropdown.Item>
                                    <Dropdown.Item onClick={showWaitingItem}>待展出的展品</Dropdown.Item>
                                    <Dropdown.Item onClick={showNeverUsedItem}>尚未使用的展品</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Modal show={modalShow} size="lg">
                        <Modal.Header>
                            <Modal.Title>新增展品</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <AddItem />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="cancel_btn" onClick={handleClose}>
                                取消
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <br />
                    <Row>
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>展品名稱</th>
                                        <th >內容</th>
                                        <th>3D模型</th>
                                        <th width="180px">狀態</th>
                                        <th width="180px">存取權限</th>
                                        <th>語音</th>
                                        <th width="270px">管理功能</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        show && (
                                            searchTerm.slice(indexOfFirstPost, indexOfLastPost).map((item) => {
                                                return (
                                                    <ItemTableData key={item.iID} item={item} paginate={paginate}/>
                                                )
                                            })
                                        )
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Pagination
                                postsPerPage={postsPerPage}
                                totalPosts={list.length}
                                paginate={paginate}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>



    )
}

export default Item;