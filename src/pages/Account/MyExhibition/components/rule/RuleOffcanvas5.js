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
          <Offcanvas.Title>第五步</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h5>設置資訊點、客製化展品點</h5>
          <h6>※如不需要設置，可直接跳到下一個步驟。</h6>
          <div className='Rule five'>
            在想要的位置上按滑鼠右鍵，可選擇：
            <ul>
              <li>新增資訊點
                <ol>
                  <li>輸入名稱</li>
                  <li>輸入敘述文字</li>
                </ol>
              </li>
              <li>新增客製化展品點
                <img src={require('../ruleGif/customSpot.gif')} alt='customSpotGif' title='customSpotGif' width={330}></img>
                <ul>
                  <li>上傳展品
                    <ol>
                      <li>會跳出另外一個視窗，點選「新增展品」，即可上傳。<br />（展品狀態的區別為是否可讓其他人使用此展品。）</li>
                      <li>上傳後關閉視窗，點選「從自己的全景圖庫挑選」，即會顯示方才上傳之全景圖。</li>
                    </ol>
                  </li>
                  <li>選擇自己的展品
                    <ul>
                      <li>可從此帳號所擁有的展品中挑選需要的展品。</li>
                    </ul>
                  </li>
                  <li>選擇公開的展品
                    <ul>
                      <li>可使用其他人上傳的展品。</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>編輯資訊點
                <ul>
                  <li>
                    在需要更改的資訊點上方按滑鼠右鍵，即可編輯。
                  </li>
                </ul>
              </li>
              <li>編輯客製化展品點
                <ol>
                  <li>可用滑鼠拖移方式放大縮小展品點。</li>
                  <li>在需要更改的資訊點上方按滑鼠右鍵。</li>
                  <li>編輯名稱、介紹。</li>
                  <li>可更改預覽圖。</li>
                  <li>可新增導覽音訊。</li>
                </ol>
              </li>
              <li>刪除
                <ul>
                  <li>在想要刪除的資訊點、客製化展品點上方按滑鼠右鍵，即可刪除。</li>
                </ul>
              </li>
            </ul>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function RuleOffcanvas5({ show, handleShow }) {
  return (
    <>
      {options.map((props, idx) => (
        <OffCanvasDetail key={idx} {...props} />
      ))}
    </>
  );
}

export default RuleOffcanvas5;