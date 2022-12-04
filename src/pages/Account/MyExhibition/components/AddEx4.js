import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Button, Dropdown } from 'react-bootstrap';
import ChooseScenePosition from './AddExhibition4/ChooseScenePosition';
import ExProgressBar from './ExProgressBar';
import './AddExhibition4/styles.css';
import RuleOffcanvas4 from './rule/RuleOffcanvas4';

const AddEx4 = (props) => {
    const now = 60;
    const { phase } = props;
    const { data } = props;
    const { setData } = props;
    const { setFailtxt } = props;
    const [chooseScene, setChooseScene] = useState("");//記錄在地圖標得xy值要存到哪張全景圖下
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [contextMenuShow, setContextMenuShow] = useState(false);
    const [markcontextMenuShow, setMarkContextMenuShow] = useState(false);
    const [removeMarkID, setRemoveMarkID] = useState("");
    const [firstIsLoad, setFirstIsLoad] = useState(false);//判斷是不是第一次load
    const [mapIsLoad, setMapIsLoad] = useState(false);//判斷map是否已經載入
    const myImgRef = useRef(); //可以拿到原生DOM的東西

    const handleContextMenu = useCallback((event) => {
        event.preventDefault(); //將原先取消原先右鍵會做的事件發生
        setAnchorPoint({ x: event.pageX, y: event.pageY });
        setContextMenuShow(true);
        setMarkContextMenuShow(false);
        return;
    }, []);

    const onFileChange = (event) => {
        if (((event.target.name === "mapImg")) && ((event.target.files[0].type === "image/png") || (event.target.files[0].type === "image/jpeg"))) {
            var newMyPanoramaList = data.myPanoramaList;//當展場平面圖換了，就要清除以前的所有標記點
            if (firstIsLoad) {//當第一次渲染平面圖已經完成
                for (let i = 0; i < data.myPanoramaList.length; i++) {
                    if ((newMyPanoramaList[i].mapX !== undefined) &&(newMyPanoramaList[i].mapY !== undefined) &&(newMyPanoramaList[i].mapX !== null) && (newMyPanoramaList[i].mapY !== null) && (newMyPanoramaList[i].mapX !== "") && (newMyPanoramaList[i].mapY !== "")) {
                        document.getElementById('mark' + newMyPanoramaList[i].fakeID).remove();
                        newMyPanoramaList[i].mapX = null;
                        newMyPanoramaList[i].mapY = null;
                    }
                }
            }
            setData({ ...data, [event.target.name]: event.target.value, [event.target.name + "File"]: event.target.files[0], myPanoramaList: newMyPanoramaList });
        } else {
            alert("圖片格式輸入錯誤!!!");
        }
    }
    useEffect(() => {
        if ((phase === 4) && (data.mapImgFile !== null)) {
            document.getElementById('mapImg').addEventListener('contextmenu', handleContextMenu)
            document.getElementById('mapImg').addEventListener("click", () => {
                setContextMenuShow(false); //關掉ContextMenu
                setMarkContextMenuShow(false); //關掉ContextMenu
            })
            setFirstIsLoad(true);
        }
    }, [data.mapImgFile, phase, handleContextMenu]);

    useEffect(() => {
        if (firstIsLoad && mapIsLoad) {
            for (let i = 0; i < data.myPanoramaList.length; i++) {
                if ((data.myPanoramaList[i].mapX !== undefined) && (data.myPanoramaList[i].mapY !== undefined) &&(data.myPanoramaList[i].mapX !== null) && (data.myPanoramaList[i].mapY !== null) && (data.myPanoramaList[i].mapX !== "") && (data.myPanoramaList[i].mapY !== "")) {
                    setupMark(data.myPanoramaList[i].fakeID, data.myPanoramaList[i].panoramaName, data.myPanoramaList[i].mapX, data.myPanoramaList[i].mapY);
                }
            }
        }
        function setupMark(id, name, mapX, mapY) { //設置初始的Mark位置
            var markDiv = document.createElement("div");
            markDiv.classList.add('custom-tooltip');
            markDiv.setAttribute("id", "mark" + id);
            var span = document.createElement("span");
            markDiv.appendChild(span);
            span.innerHTML = name;
            span.style.width = span.scrollWidth - 20 + 'px';
            span.style.marginLeft = (mapX * myImgRef.current.clientWidth) + 'px';
            span.style.marginTop = -(myImgRef.current.clientHeight) + (mapY * myImgRef.current.clientHeight) - 30 + 'px';
            var elem = document.createElement("img"); // 照片空間
            markDiv.appendChild(elem);
            elem.src = require('./AddExhibition4/images/mark.png');
            elem.style.position = "absolute";
            elem.setAttribute("width", "50px");
            var mapImgPosition = getPosition(document.getElementById('mapImg'));
            elem.style.left = mapImgPosition.x + (mapX * myImgRef.current.clientWidth) + "px";
            elem.style.top = mapImgPosition.y + (mapY * myImgRef.current.clientHeight) + "px";
            elem.addEventListener("contextmenu", (event) => {
                event.preventDefault(); //將原先取消原先右鍵會做的事件發生
                setRemoveMarkID(markDiv.getAttribute("id"));//設至準備要移除的mark ID
                setAnchorPoint({ x: event.pageX, y: event.pageY });
                setMarkContextMenuShow(true);
                setContextMenuShow(false);
                event.stopPropagation(); //將上層的監聽事件取消，阻擋bubble產生
            });
            document.getElementById("mapDiv").appendChild(markDiv);
        }
    }, [data.myPanoramaList, firstIsLoad, mapIsLoad, setFailtxt]);

    function putMark() { //設置平面圖標記
        if (chooseScene !== "") {
            var newPanoramaList = data.myPanoramaList;
            if (document.getElementById('mark' + chooseScene)) {
                // 找到到對應元素 
                document.getElementById('mark' + chooseScene).remove();//刪除就得mark
            }
            var markDiv = document.createElement("div");
            markDiv.classList.add('custom-tooltip');
            markDiv.setAttribute("id", "mark" + chooseScene);
            var span = document.createElement("span");
            markDiv.appendChild(span);
            var elem = document.createElement("img"); // 照片空間
            markDiv.appendChild(elem);
            elem.src = require('./AddExhibition4/images/mark.png');
            elem.style.position = "absolute";
            elem.setAttribute("width", "50px");
            elem.style.left = (anchorPoint.x - 25) + "px";
            elem.style.top = (anchorPoint.y - 55) + "px";
            elem.addEventListener("contextmenu", (event) => {
                event.preventDefault(); //將原先取消原先右鍵會做的事件發生
                setRemoveMarkID(markDiv.getAttribute("id"));//設至準備要移除的mark ID
                setAnchorPoint({ x: event.pageX, y: event.pageY });
                setMarkContextMenuShow(true);
                setContextMenuShow(false);
                event.stopPropagation(); //將上層的監聽事件取消，阻擋bubble產生
            });
            console.log(myImgRef.current.getBoundingClientRect().width);
            var mapImgPosition = getPosition(document.getElementById('mapImg'));
            for (let i = 0; i < data.myPanoramaList.length; i++) {
                if (newPanoramaList[i].fakeID.toString() === chooseScene) {
                    //myImgRef.current.clientWidth 圖片渲染網頁後的寬度
                    //myImgRef.current.clientHeight 圖片渲染網頁後的高度
                    var x = ((anchorPoint.x - mapImgPosition.x - 25) / myImgRef.current.clientWidth);
                    var y = ((anchorPoint.y - mapImgPosition.y - 55) / myImgRef.current.clientHeight);
                    newPanoramaList[i].mapX = roundToThree(x);
                    newPanoramaList[i].mapY = roundToThree(y);
                    span.innerHTML = newPanoramaList[i].panoramaName;
                    span.style.width = span.scrollWidth - 20 + 'px';
                    span.style.marginLeft = (newPanoramaList[i].mapX * myImgRef.current.clientWidth) + 'px';
                    span.style.marginTop = -(myImgRef.current.clientHeight) + (newPanoramaList[i].mapY * myImgRef.current.clientHeight) - 30 + "px";
                    break;
                }
            }
            document.getElementById("mapDiv").appendChild(markDiv);
            setData({ ...data, myPanoramaList: newPanoramaList });
            setFailtxt("");
        } else {
            setFailtxt("warning:請確實選擇要標記的全景圖!!");
        }
        setContextMenuShow(false);
    }
    function roundToThree(num) {
        return +(Math.round(num + "e+3") + "e-3");
    }
    function getPosition(element) { //計算傳入的元素靠近網頁最左上角的x、y距離
        var x = 0;
        var y = 0;
        while (element) {
            x += element.offsetLeft - element.scrollLeft + element.clientLeft;
            y += element.offsetTop - element.scrollLeft + element.clientTop;
            // 這邊有個重點，當父元素被下了 position 屬性之後他就會變成 offsetParent，所以這邊我們用迴圈不斷往上累加。
            element = element.offsetParent;
        }
        return { x: x, y: y };
    }
    function removeMark() {
        var newPanoramaList = data.myPanoramaList;
        for (let i = 0; i < data.myPanoramaList.length; i++) {
            var pID = "mark" + newPanoramaList[i].fakeID.toString();
            if (pID === removeMarkID) {
                newPanoramaList[i].mapX = null;
                newPanoramaList[i].mapY = null;
            }
        }
        setData({ ...data, myPanoramaList: newPanoramaList });
        document.getElementById(removeMarkID).remove();
        setMarkContextMenuShow(false);
    }

    return (
        <>
            <h2 className="text-center">四、展場平面圖設置</h2>
            <div className="helpRuleButton">
                <RuleOffcanvas4 />
            </div>
            <ExProgressBar now={now} />{/* 進度條 */}
            <Row className='d-flex justify-content-center'>
                <Row className='w-75'>
                    <Col>
                        <h5><span style={{ color: '#d78559' }}>| </span> 展場平面地圖上傳(可選) </h5>
                    </Col>
                    <Col>
                        <input type="file" name="mapImg" className="form-control" onChange={onFileChange} value={data.mapImg} accept="image/*,.jpg,.png" />
                    </Col>
                </Row>
                {
                    data.mapImgFile && (
                        <Row className='d-flex justify-content-center m-3'>
                            <Row className='w-100'>
                                <ChooseScenePosition data={data} chooseScene={chooseScene} setChooseScene={setChooseScene} />
                            </Row>
                            <Row className="w-75">
                                <Col>
                                    <div id="mapDiv">
                                        <img id="mapImg" alt="not found" width="800px"
                                            src={URL.createObjectURL(data.mapImgFile)}
                                            onLoad={() => {
                                                setMapIsLoad(true);
                                            }} ref={myImgRef} />
                                    </div>
                                </Col>
                                <Col>
                                    <Button className="remove_btn" onClick={() => {
                                        var newMyPanoramaList = data.myPanoramaList;
                                        for (let i = 0; i < data.myPanoramaList.length; i++) {
                                            newMyPanoramaList[i].mapX = null;
                                            newMyPanoramaList[i].mapY = null;
                                        }
                                        setData({ ...data, mapImg: "", mapImgFile: null, myPanoramaList: newMyPanoramaList });
                                        setFailtxt("");
                                        setContextMenuShow(false); //關掉ContextMenu
                                        setMarkContextMenuShow(false); //關掉ContextMenu
                                        setMapIsLoad(false);
                                        setChooseScene("");
                                    }}> 移除平面圖 </Button>
                                </Col>
                            </Row>
                        </Row>
                    )
                }
            </Row>
            {
                contextMenuShow ? (
                    <ul
                        className="menu"
                        style={{
                            top: anchorPoint.y,
                            left: anchorPoint.x
                        }}
                    >
                        <Dropdown.Item className="text-center" onClick={putMark}> 添加標記 </Dropdown.Item>
                    </ul>
                ) : (<> </>)
            }
            {
                markcontextMenuShow ? (
                    <ul
                        className="menu"
                        style={{
                            top: anchorPoint.y,
                            left: anchorPoint.x
                        }}
                    >
                        <Dropdown.Item className="text-center" onClick={removeMark}>刪除標記</Dropdown.Item>
                    </ul>
                ) : (<> </>)
            }
        </>
    );
}

export default AddEx4;