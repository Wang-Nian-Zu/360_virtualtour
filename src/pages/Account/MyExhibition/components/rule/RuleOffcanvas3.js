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
          <Offcanvas.Title>三、動線規劃</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='Rule three'>
            此步驟為各個全景圖的場景轉換（從這個場景轉換到那個場景）。<br />
            展場內如有兩個以上（包含兩個）的場景，則每個場景必須至少有一個移動點，至多不限。<br />
            <br />
            上方列出此展場的所有場景。
            <ul>
              <li>問號：場景尚未設置移動點。</li>
              <li>打勾：場景已設置移動點至少一個移動點。<br />
                （若此展場只有一個場景，則預設為打勾，不需設置移動點）
              </li>
            </ul>
          </div>
          <div className='Rule three'>
            <h6>設置移動點</h6>
            <img src={require('../ruleGif/moveSpot.gif')} alt='moveSpotGif' title='moveSpotGif' width={330}></img>
            <ul>
              <li>新增：
                <ol>
                  <li>在想要的位置上按滑鼠右鍵。</li>
                  <li>點選「新增移動點」。</li>
                  <li>選擇會移動到哪個場景，以及移動特效。</li>
                  <li>點選「加入移動點」，即完成。</li>
                </ol>
              </li>
              <li>刪除：
                <ul>
                  <li>
                    在已經設置好的移動點上方，按滑鼠右鍵，即可刪除。
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function RuleOffcanvas3({ show, handleShow }) {
  return (
    <>
      {options.map((props, idx) => (
        <OffCanvasDetail key={idx} {...props} />
      ))}
    </>
  );
}

export default RuleOffcanvas3;