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
          <Offcanvas.Title>一、展場資訊</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='Rule one'>
            需填寫內容包含：
            <ol>
              <li>展場名稱</li>
              <li>展場描述</li>
              <li>開放時間</li>
              <li>結束時間</li>
              <li>權限管理（管理哪些人可以看到此展覽）</li>
              <li>封面圖（會顯示在「展場」頁面的圖，至多可選3張）</li>
            </ol>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function RuleOffcanvas1({ show, handleShow }) {
  return (
    <>
      {options.map((props, idx) => (
        <OffCanvasDetail key={idx} {...props} />
      ))}
    </>
  );
}

export default RuleOffcanvas1;