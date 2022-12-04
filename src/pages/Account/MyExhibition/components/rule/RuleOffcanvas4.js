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
          <Offcanvas.Title>第四步</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h5>展場平面圖設置</h5>
          <h6>※如不需要設置，可直接跳到下一個步驟。</h6>
          <div className='Rule four'>
            上傳的圖片即為整個展場的小地圖。<br />
            在圖上設置各個場景的位置，供參觀者快速移動到想去的場景，並知道目前在哪個位置。<br />
            <br />
            左側顯示此展場的所有場景。灰色代表未設置，黃色代表已設置。<br />
          </div>
          <div className='Rule four'>
            {/* <br /> */}
            新增平面圖
            <img src={require('../ruleGif/smallMap.gif')} alt='smallMapGif' title='smallMapGif' width={330}></img>
            <ul>
              <li>設置標記
                <ol>
                  <li>選擇要設置的場景。</li>
                  <li>在圖片上挑一個想要的位置，按滑鼠右鍵，即可添加標記。</li>
                  <li>設置其他場景，需重複第二步驟。</li>
                </ol></li>
              <li>刪除
                <ul>
                  <li>在想要刪除的標記上方按滑鼠右鍵，即可刪除。</li>
                </ul>
              </li>
            </ul>
            移除平面圖
            <ul>
              <li>如決定不設置平面圖，請點選「移除平面圖」。</li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function RuleOffcanvas4({ show, handleShow }) {
  return (
    <>
      {options.map((props, idx) => (
        <OffCanvasDetail key={idx} {...props} />
      ))}
    </>
  );
}

export default RuleOffcanvas4;