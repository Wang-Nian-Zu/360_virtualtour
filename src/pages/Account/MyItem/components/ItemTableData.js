import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import DeleteB from './DeleteB.js';
import EditMyItemButton from './EditMyItemButton';

const ItemTableData = (props) => {
    const { item } = props;
    const {paginate} = props;
    const [intro, setIntro] = useState('');
    const introLength = item.intro.length;
    const iIntro = item.intro;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    function handleShow() {
        setShow(true);
    }

    useEffect(() => {
        if (introLength > 50) {
            setIntro(iIntro.substring(0, 50) + '...'); //介紹文字不能超過五十個字
        } else {
            setIntro(iIntro);
        }
    }, [introLength, iIntro])

    const handleLoad = () => {
        //setShow(true);
        window.load3D(item.iID);
    }
    //判斷此展品是否在展出中

    return (
        <tr>
            <td> {item.name} </td>
            <td>
                <Button className="editItemButton" onClick={handleShow} size="md"> 查看 </Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>
                            預覽
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img className="card-img-top mb-2" src={item.img2D} alt={item.name} />
                        <br />
                        <h5> 介紹 </h5><p> {intro} </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="cancel_btn" onClick={handleClose}>
                            關閉
                        </Button>
                    </Modal.Footer>
                </Modal></td>
            <td>
                <Button size="md" type="button" className="btn editItemButton" data-bs-toggle="modal"
                    data-bs-target="#myModal" onClick={handleLoad}> 預覽 </Button>
            </td>
            <td>
                {item.status === "ItemUsed" && <p style={{ color: "red" }}> 展出中 </p>}
                {item.status === "waiting" && <p style={{ color: "orange" }}> 待展出 </p>}
                {item.status === "NeverUsed" && <p style={{ color: "black" }}> 尚未使用 </p>}
            </td>
            <td>
                {item.permission === "private" && <p> 私人 </p>}
                {item.permission === "public" && <p> 公開 </p>}
            </td>

            {
                (item.musicLink !== "" && item.musicLink !== null)
                    ? (<td><audio src={item.musicLink} controls></audio></td>)
                    : (<td></td>)
            }
            <td style={{ width: 80 }}>
                <Row className="pt-0">
                    <Col>
                        <EditMyItemButton item={item} iID={item.iID} />
                    </Col>
                    <Col>
                        <DeleteB id={item.iID} className="delete_btn" paginate={paginate}/>
                    </Col>
                </Row>
            </td>
        </tr>

    )
}
export default ItemTableData;