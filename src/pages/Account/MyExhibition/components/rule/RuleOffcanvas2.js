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
                    <Offcanvas.Title>二、準備全景圖</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='Rule two'>
                        <b>一、新增全景圖</b>
                        <ul>
                            <li>
                                從本機上傳全景圖
                                <img src={require('../ruleGif/fromLocalHost.gif')} alt='fromlocalhostGif' title='fromlocalhostGif' width={330}></img>
                                <ol>
                                    <li>會跳出一個視窗，點選「新增全景圖」，即可上傳。</li>
                                    <li>上傳後關閉視窗，點選「從自己的全景圖庫挑選」，即會顯示方才上傳之全景圖。</li>
                                </ol>
                            </li>
                            <li>
                                從自己的全景圖庫挑選
                                <img src={require('../ruleGif/fromMyPanorama.gif')} alt='fromMyPanoramaGif' title='fromMyPanoramaGif' width={330}></img>
                                <ul>
                                    <li>可從此帳號所擁有的全景圖中挑選需要的全景圖。一次可勾選多張。</li>
                                </ul>
                            </li>
                            <li>
                                從公開全景圖庫挑選
                                <ul>
                                    <li>可使用其他人上傳的全景圖。</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div className='Rule two'>
                        <b>二、選擇起始場景</b><br />
                        起始場景：進入360虛擬展覽時，出現的第一張全景圖。
                    </div>
                    <div className='Rule two'>
                        <b>三、編輯、刪除</b><br />
                        選擇全景圖後，可編輯全景圖名稱、新增全景圖語音/音樂。
                        亦可刪除已選擇之全景圖。<br />
                        <img src={require('../ruleGif/choosePanoMusic.gif')} alt='choosePanoMusicGif' title='choosePanoMusicGif' width={300}></img>
                        <ul>
                            <li>導覽語音
                                <ol>
                                    <li>初次選擇音檔：選擇想放的檔案。</li>
                                    <li>已設置過音檔但想更換：點選「上傳導覽音訊（更新）」，選擇欲更換之檔案。</li>
                                    <li>移除音檔：如不想放音檔了，勾選「清除原先導覽語音」。</li>
                                </ol>
                            </li>
                        </ul>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

function RuleOffcanvas2({ show, handleShow }) {
    return (
        <>
            {options.map((props, idx) => (
                <OffCanvasDetail key={idx} {...props} />
            ))}
        </>
    );
}

export default RuleOffcanvas2;