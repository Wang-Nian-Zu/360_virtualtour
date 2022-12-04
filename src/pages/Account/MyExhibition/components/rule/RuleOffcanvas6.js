import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

const options = [
    {
        name: 'Enable both scrolling & backdrop',
        scroll: true,
        backdrop: true,
        placement: "end",
    },
];

function OffCanvasDetail({ name, ...props }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="outline-dark" size="sm" className="helpButton"
                style={{ width: '40px', height: '40px', borderRadius: "99em", lineHeight: "20px" }} onClick={handleShow}>
                <span style={{ fontSize: 20 }}>？</span>
            </Button>
            <Offcanvas show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>第六步</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <h5>預覽展場</h5>
                    <h6>預覽展場會呈現的樣貌。</h6>
                    <div className='Rule six'>
                        <ul>
                            <li>可測試各功能，如想新增修改，點選上一步修改。</li>
                            <li>確認沒問題，點選完成，展場便建立成功。</li>
                        </ul>
                    </div>
                    <h6>顯示錯誤</h6>
                    如在點選完成時，跳出建立展場失敗，代表已選擇的公開全景圖或展品被創作者修改。
                    需重新選擇全景圖或展品。
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

function RuleOffcanvas6({ show, handleShow }) {
    return (
        <>
            {options.map((props, idx) => (
                <OffCanvasDetail key={idx} {...props} />
            ))}
        </>
    );
}

export default RuleOffcanvas6;