import React, { useState, useEffect, useCallback } from "react";
import ReactPannellum from "react-pannellum";
import "./styles.css"; //一定要加css不然跑不動
import { Modal, Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import PanoOption from './PanoOption.js';

const MovePannellumDiv = (props) => {
    const { data } = props;
    const { phase } = props;
    const { location } = props; //紀錄現在此時此刻應該load哪一張全景圖(string)
    const { setLocation } = props;
    const { fakeHotspotID } = props;
    const { setFakeHotspotID } = props;
    const { moveSpotsArray } = props; //展場的所有移動點物件都存在這個陣列
    const { setMoveSpotsArray } = props;
    const [sceneId, setSceneId] = useState("-1");
    const [style, setStyle] = useState({});
    const [config, setConfig] = useState({
        uiText: {
            loadButtonLabel: "Failed to<br>Load<br>Panorama"
        }
    });
    const [image, setImage] = useState("");
    const [firstSceneisLoad, setFirstSceneisLoad] = useState(false);
    useEffect(() => { //第一次跑useEffect是在畫面剛加載時，之後就不再跑此設置了
        if ((phase === 3) && (firstSceneisLoad !== true)) {//確保在階段三(裏頭至少有一張全景圖)
            var index = 0;
            for (let i = 0; i < data.myPanoramaList.length; i++) {
                if (data.myPanoramaList[i].fakeID === data.firstScene) {
                    index = i;
                }
            }
            setSceneId(data.firstScene.toString());
            /*設置初始場景 */
            setStyle({
                width: "100%",
                height: ""
            });
            var Hotspots = [];
            if (moveSpotsArray !== []) {//移動點陣列裡頭不為空
                Hotspots = transferHotspotObject(moveSpotsArray, data.firstScene.toString());
            }
            if((data.myPanoramaList[index].smallimgLink !== "")&&(data.myPanoramaList[index].smallimgLink !== null)){ //加入底部的熱點圖案
                var hotspot = {};
                hotspot["pitch"] = -90;
                hotspot["yaw"] = 90;
                hotspot["cssClass"] = "divIcon";
                hotspot["createTooltipFunc"] = setBottomIcon;
                hotspot["createTooltipArgs"] = { img: data.myPanoramaList[index].smallimgLink};
                Hotspots.push(hotspot);
            }
            setConfig({
                title: data.myPanoramaList[index].panoramaName,
                showZoomCtrl: false, // 放大縮小的控制圖示按鈕，預設值是 true
                showControls: false, // 是否顯示控制圖示，預設值是 true
                compass: true,
                autoRotate: 0,
                author : data.myPanoramaList[index].authorName,
                autoLoad: true,
                hotSpots: Hotspots
            });
            setImage(data.myPanoramaList[index].imgLink);
            setFirstSceneisLoad(true);
        }
        function transferHotspotObject(moveSpotsArray, firstSceneID) {
            var hotspots = [];
            for (let i = 0; i < moveSpotsArray.length; i++) {
                if (moveSpotsArray[i].currentSceneID === firstSceneID) {
                    var hotspot = {};
                    hotspot["id"] = moveSpotsArray[i].id;
                    hotspot["pitch"] = moveSpotsArray[i].pitch;
                    hotspot["yaw"] = moveSpotsArray[i].yaw;
                    hotspot["scale"] = true;
                    hotspot["type"] = "scene";
                    hotspot["clickHandlerArgs"] = {"sceneId": moveSpotsArray[i].destinationID,"pitch": moveSpotsArray[i].pitch, "yaw": moveSpotsArray[i].yaw};
                    if (moveSpotsArray[i].clickHandlerFunc === "ZoomIn") {
                        hotspot["clickHandlerFunc"] = CameraZoomIn;
                    } else {
                        hotspot["clickHandlerFunc"] = SceneFadeOut;
                    }
                    hotspot["createTooltipFunc"] = setMoveSpotUI;
                    hotspot["createTooltipArgs"] =  { "id": moveSpotsArray[i].id, "txt": moveSpotsArray[i].destinationName};
                    hotspots.push(hotspot); //物件加入陣列
                }
            }
            return hotspots;
        }
        function CameraZoomIn(event, handlerArg) {
            ReactPannellum.setPitch(handlerArg.pitch);
            ReactPannellum.setYaw(handlerArg.yaw);
            ReactPannellum.setHfov(ReactPannellum.getHfov() - 40);
            setTimeout(function () { // 場景轉換
                setLocation(handlerArg.sceneId);//ReactPannellum.loadScene(handlerArg.sceneId)
            }, 500);
        }
        function SceneFadeOut(event, handlerArg) {
            setLocation(handlerArg.sceneId);
        }
    }, [data, phase, setLocation, firstSceneisLoad, moveSpotsArray]);//data如果變了，會在觸發一次useEffect

    useEffect(() => {
        if ((ReactPannellum.getCurrentScene() !== null) && (firstSceneisLoad)) {
            for (let i = 0; i < data.myPanoramaList.length; i++) {
                //location如果是已經被刪掉的全景圖，就找不到了
                if ((data.myPanoramaList[i].fakeID === data.firstScene) && (data.myPanoramaList[i].fakeID.toString() === location)) {
                    if(ReactPannellum.getCurrentScene() !== location){
                        ReactPannellum.loadScene(location);
                    }
                } else {
                    if (data.myPanoramaList[i].fakeID.toString() === location) {
                        addPanorama(location, data.myPanoramaList[i], moveSpotsArray);
                    }
                }
            }
        };
        function addPanorama(sceneId, panorama, moveSpotsArray) {
            const PanoArray = ReactPannellum.getAllScenes();
            var isExist = false;
            if (PanoArray !== null) {
                PanoArray.forEach(function (obj, j) {
                    const arr = Object.keys(obj); //取出場景的key值，但他會回傳陣列
                    if (arr[0] === sceneId) { //如果已經有此場景
                        isExist = true;
                        if(ReactPannellum.getCurrentScene() !== sceneId){//如果現在的場景不等於現在viewer的位置
                            ReactPannellum.loadScene(sceneId);
                        }
                    }
                });
            }
            if (!isExist) {
                var Hotspots2 = transferHotspotObject(moveSpotsArray,sceneId);
                if((panorama.smallimgLink !== "")&&(panorama.smallimgLink !== null)){ //加入底部的熱點圖案
                    var hotspot = {};
                    hotspot["pitch"] = -90;
                    hotspot["yaw"] = 90;
                    hotspot["cssClass"] = "divIcon";
                    hotspot["createTooltipFunc"] = setBottomIcon;
                    hotspot["createTooltipArgs"] = { img: panorama.smallimgLink};
                    Hotspots2.push(hotspot);
                }
                var imageFile = panorama.imgLink; //現在不用判斷是否是object
                var authorName = panorama.authorName
                var name = panorama.panoramaName;
                var config2 = {
                    title: name,
                    imageSource: imageFile,
                    author: authorName,
                    showZoomCtrl: false, // 放大縮小的控制圖示按鈕，預設值是 true
                    showControls: false, // 是否顯示控制圖示，預設值是 true
                    compass: true,
                    autoRotate: 0,
                    autoLoad: true,
                    hotSpots: Hotspots2
                }
                ReactPannellum.addScene(sceneId, config2, () => { ReactPannellum.loadScene(sceneId) });
            }
        }
        function transferHotspotObject(moveSpotsArray, SceneID) {
            var hotspots = [];
            for (let i = 0; i < moveSpotsArray.length; i++) {
                if (moveSpotsArray[i].currentSceneID === SceneID) {
                    var hotspot = {};
                    hotspot["id"] = moveSpotsArray[i].id;
                    hotspot["pitch"] = moveSpotsArray[i].pitch;
                    hotspot["yaw"] = moveSpotsArray[i].yaw;
                    hotspot["scale"] = true;
                    hotspot["type"] = "scene";
                    hotspot["clickHandlerArgs"] = { "sceneId": moveSpotsArray[i].destinationID,"pitch": moveSpotsArray[i].pitch, "yaw": moveSpotsArray[i].yaw };
                    if (moveSpotsArray[i].clickHandlerFunc === "ZoomIn") {
                        hotspot["clickHandlerFunc"] = CameraZoomIn;
                    } else {
                        hotspot["clickHandlerFunc"] = SceneFadeOut;
                    }
                    hotspot["createTooltipFunc"] = setMoveSpotUI;
                    hotspot["createTooltipArgs"] =  { "id": moveSpotsArray[i].id, "txt": moveSpotsArray[i].destinationName};
                    hotspots.push(hotspot); //物件加入陣列
                }
            }
            return hotspots;
        }
        function CameraZoomIn(event, handlerArg) {
            ReactPannellum.setPitch(handlerArg.pitch);
            ReactPannellum.setYaw(handlerArg.yaw);
            ReactPannellum.setHfov(ReactPannellum.getHfov() - 40);
            setTimeout(function () { // 場景轉換
                setLocation(handlerArg.sceneId);//ReactPannellum.loadScene(handlerArg.sceneId)
            }, 500);
        }
        function SceneFadeOut(event, handlerArg) {
            console.log(handlerArg.sceneId);
            setLocation(handlerArg.sceneId);
        }
    }, [data, location, setLocation, firstSceneisLoad, moveSpotsArray])

    const [moveSpot, setMoveSpot] = useState({ //存新增的移動點資料的表單
        id: "",
        currentSceneID: location,
        currentSceneName: "",
        destinationID: "",
        destinationName:"",
        clickHandlerFunc: "FadeOut",
        clickHandlerArgs: { sceneId: location, pitch: 0, yaw: 0 },
        pitch: 0,
        yaw: 0
    });
    const onChange = (event) => {
        setMoveSpot({ ...moveSpot, [event.target.name]: event.target.value });
    }
    //----------------------------------------------------------------
    const [modalShow, setModalShow] = useState(false);//顯示新增移動點的彈出式視窗
    const [failtxt, setFailtxt] = useState("");
    const ShowAddModal = () => { //顯示新增移動點的彈出式視窗
        setModalShow(true);
        setContextMenuShow(false);
    }
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [contextMenuShow, setContextMenuShow] = useState(false);
    const handleContextMenu = useCallback((event) => {
        var currentsid = ReactPannellum.getCurrentScene();
        var currentPanoName = ReactPannellum.getConfig().title;
        var arr = ReactPannellum.mouseEventToCoords(event);
        setMoveSpot({ ...moveSpot,currentSceneID: currentsid, currentSceneName: currentPanoName, pitch: arr[0], yaw: arr[1] });
        setAnchorPoint({ x: event.pageX, y: event.pageY });
        setHotspotContextMenuShow(false); //要將移除資訊點關掉
        setContextMenuShow(true);
        return;
    }, [moveSpot]);
    //----------------------------------------------------------------
    //顯示右鍵刪除hotspot的菜單
    const [hotspotContextMenuShow, setHotspotContextMenuShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [removeHotspotID, setRemoveHotspotID] = useState(""); //要移除的熱點
    const ShowDeleteModal = () => {
        setDeleteModalShow(true);
        setHotspotContextMenuShow(false);
    }
    const handleDeleteHotspot = () => {
        ReactPannellum.removeHotSpot(removeHotspotID, location);
        //刪除MoveSpot Array中
        var newMoveSpotsArray = [...moveSpotsArray];
        //要這樣才會rerender array state (參考https://stackoverflow.com/questions/71185474/component-not-re-rendering-after-change-in-an-array-state-in-react)
        if(moveSpotsArray.length !== 0){
            for (let i = 0; i < newMoveSpotsArray.length; i++) {
                if (newMoveSpotsArray[i].id === removeHotspotID) {
                    newMoveSpotsArray.splice(i, 1);  //刪除資料array中移動點
                    break;
                }
            }
        }
        setMoveSpotsArray(newMoveSpotsArray);
        //將彈出式視窗關閉
        setDeleteModalShow(false);
    }
    //----------------------------------------------------------------
    const onPanoramaLoaded = () => {
        setContextMenuShow(false); //load新場景要將上一場景開的contextmenu關掉
        setHotspotContextMenuShow(false);//load新場景要將上一場景開的contextmenu關掉
        if(document.getElementById('panorama3')!==null){ //如果抓不到就不要跑document.getElementById('panorama3')
            document.getElementById('panorama3').addEventListener("contextmenu", handleContextMenu)
            document.getElementById('panorama3').addEventListener("click", () => {
                setContextMenuShow(false);
                setHotspotContextMenuShow(false);
            })
            document.getElementById('panorama3').addEventListener("drag", () => {
                setContextMenuShow(false);
                setHotspotContextMenuShow(false);
            })
        }
    }
    //--------------------------------------------------------------------------------------
    const submitForm = (e) => {
        e.preventDefault();
        var animation;
        if (moveSpot.clickHandlerFunc === "ZoomIn") {
            animation = CameraZoomIn;
        } else if (moveSpot.clickHandlerFunc === "FadeOut") {
            animation = SceneFadeOut;
        }
        var destName = "前往";
        if (moveSpot.destinationID !== "") {
            for (let i = 0; i < data.myPanoramaList.length; i++) {
                if (data.myPanoramaList[i].fakeID.toString() === moveSpot.destinationID) {
                    destName += data.myPanoramaList[i].panoramaName;//找出全景圖的名稱
                }
            }
            let hs = {
                id: fakeHotspotID.toString() + "h",
                pitch: moveSpot.pitch,
                yaw: moveSpot.yaw,
                type: "scene",
                scale: true,
                "createTooltipFunc": setMoveSpotUI,
                "createTooltipArgs": { "id": fakeHotspotID.toString()+"h", "txt": destName },
                "clickHandlerFunc": animation,
                "clickHandlerArgs": { sceneId: moveSpot.destinationID, pitch: moveSpot.pitch, yaw: moveSpot.yaw }
            }
            ReactPannellum.addHotSpot(hs, moveSpot.currentSceneID);
            let newMovespot = { //用新的格式加入移動點陣列中
                id: fakeHotspotID.toString() + "h",
                currentSceneID: moveSpot.currentSceneID,
                currentSceneName: moveSpot.currentSceneName,
                destinationID: moveSpot.destinationID,
                destinationName: destName ,
                clickHandlerFunc: moveSpot.clickHandlerFunc ,
                pitch: moveSpot.pitch,
                yaw: moveSpot.yaw 
            }
            //存入前端收集的資料array中
            var newMoveSpotsArray = moveSpotsArray;
            newMoveSpotsArray = newMoveSpotsArray.concat(newMovespot);
            setMoveSpotsArray(newMoveSpotsArray);
            //增加fake hotspotID
            setFakeHotspotID(fakeHotspotID + 1);
            setFailtxt("");
            setModalShow(false);
            setMoveSpot({ //存新增的移動點資料的表單
                id: "",
                currentSceneID: location,
                currentSceneName: "",
                destinationID: "",
                destinationName:"",
                clickHandlerFunc: "FadeOut",
                clickHandlerArgs: { sceneId: location, pitch: 0, yaw: 0 },
                pitch: 0,
                yaw: 0
            });
        } else {
            setFailtxt("請選擇一個目的地全景圖!!!");
        }
    };
    function setMoveSpotUI(hotSpotDiv, args) {
        hotSpotDiv.classList.add('custom-tooltip');
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.txt;
        hotSpotDiv.appendChild(span);
        hotSpotDiv.setAttribute("id", args.id);
        hotSpotDiv.addEventListener("contextmenu", (event) => {
            event.preventDefault(); //將原先取消原先右鍵會做的事件發生
            setRemoveHotspotID(hotSpotDiv.getAttribute("id"));
            setAnchorPoint({ x: event.pageX, y: event.pageY });
            setHotspotContextMenuShow(true);
            event.stopPropagation(); //將上層的監聽事件取消，阻擋bubble產生
        });
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 -10 + 'px';
        span.style.marginTop = -span.scrollHeight - 12 + 'px';
    }
    function CameraZoomIn(event, handlerArg) {
        ReactPannellum.setPitch(handlerArg.pitch);
        ReactPannellum.setYaw(handlerArg.yaw);
        ReactPannellum.setHfov(ReactPannellum.getHfov() - 40);
        setTimeout(function () { // 場景轉換
            setLocation(handlerArg.sceneId);//ReactPannellum.loadScene(handlerArg.sceneId)
        }, 500);
    }
    function SceneFadeOut(event, handlerArg) {
        setLocation(handlerArg.sceneId);
    }
    //============================縮圖當作遮住360圖片下方的破洞===========================================
    function setBottomIcon(hotSpotDiv, args){//縮圖加入Icon
        hotSpotDiv.classList.add('custom-tooltip');
        var img = document.createElement('img'); // 創建文字空間
        hotSpotDiv.appendChild(img);
        img.id = "0h";
        if(typeof args.img === "object"){
            img.src = URL.createObjectURL(args.img);
        }else{
            img.src = args.img;
        }
        img.setAttribute("width", 500);
    }
    //--------------------------------------------------------------------------------------
    return (
        <div className="pannellum" id="panorama3Div">
            {
                firstSceneisLoad
                    ? <ReactPannellum id="panorama3" imageSource={image} sceneId={sceneId} style={style} config={config} onPanoramaLoaded={onPanoramaLoaded} />
                    : <></>
            }
            {
                contextMenuShow ? (
                    <ul
                        className="menu"
                        style={{
                            top: anchorPoint.y,
                            left: anchorPoint.x
                        }}
                    >
                        <Dropdown.Item onClick={ShowAddModal}>新增移動點</Dropdown.Item>
                    </ul>
                ) : (<> </>)
            }
            {
                hotspotContextMenuShow ? (
                    <ul
                        className="menu"
                        style={{
                            top: anchorPoint.y,
                            left: anchorPoint.x
                        }}
                    >
                        <Dropdown.Item onClick={ShowDeleteModal}>刪除移動點</Dropdown.Item>
                    </ul>
                ) : (<> </>)
            }

            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        新增移動點
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form onSubmit={submitForm}>
                        <Container>
                            <Row>
                                <Col>目前場景</Col>
                                <Col>
                                    <input type="text" name="currentSceneName" className="form-control" value={moveSpot.currentSceneName} disabled />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>目前的Pitch</Col>
                                <Col>
                                    <input type="text" name="pitch" className="form-control" value={moveSpot.pitch} disabled />
                                </Col>
                                <Col>目前的Yaw</Col>
                                <Col>
                                    <input type="text" name="yaw" className="form-control" value={moveSpot.yaw} disabled />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>下一個場景</Col>
                                <Col>
                                    <select type="dropdown" name="destinationID" className="form-control mb-3" onChange={onChange} value={moveSpot.destinationID} required>
                                        <option>請選擇以下場景</option>
                                        {
                                            data.myPanoramaList.map((panorama) => {
                                                if(panorama.fakeID.toString() !== ReactPannellum.getCurrentScene()){
                                                    return (
                                                        <PanoOption key={panorama.fakeID} panorama={panorama} />
                                                    )
                                                }else{
                                                    return true;
                                                }
                                            })
                                        }
                                    </select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>移動特效</Col>
                                <Col>
                                    <select type="dropdown" name="clickHandlerFunc" className="form-control mb-3" onChange={onChange} value={moveSpot.clickHandlerFunc} required>
                                        <option value="FadeOut">淡入</option>
                                        <option value="ZoomIn">滑入</option>
                                    </select>
                                </Col>
                                <input type="submit" name="submit" value="新增至展場" className="update_btn w-100" />
                            </Row>
                        </Container>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{ color: 'red' }}>{failtxt}</p>
                    <Button className="cancel_btn" onClick={() => {
                        setFailtxt("");
                        setModalShow(false);
                        setMoveSpot({ //存新增的移動點資料的表單
                            id: "",
                            currentSceneID: location,
                            currentSceneName: "",
                            destinationID: "",
                            destinationName:"",
                            clickHandlerFunc: "FadeOut",
                            clickHandlerArgs: { sceneId: location, pitch: 0, yaw: 0 },
                            pitch: 0,
                            yaw: 0
                        });
                    }}>取消</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={deleteModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        刪除移動點
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    你確定要從此展場移除此移動點嗎 ?
                    <span style={{ color: '#e38970' }}>&nbsp;(刪除之後將無法復原) </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDeleteHotspot}>刪除</Button>
                    <Button className="cancel_btn" onClick={() => {
                        setDeleteModalShow(false);
                    }}>取消</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default MovePannellumDiv;
