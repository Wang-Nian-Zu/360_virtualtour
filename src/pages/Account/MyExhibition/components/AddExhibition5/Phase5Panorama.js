import React, { useState, useEffect, useCallback } from 'react';
import ReactPannellum from "react-pannellum";
import "./styles.css"; //一定要加css不然跑不動
import { Dropdown } from 'react-bootstrap';
import AddInfoModal from './AddInfoModal';
import RemoveInfoModal from './RemoveInfoModal';
import EditInfoModal from './EditInfoModal';
import InfoSpotModal from './InfoSpotModal';
import AddCustomModal from './AddCustomModal';
import RemoveCustomModal from './RemoveCustomModal';
import EditCustomModal from './EditCustomModal';

const Phase5Panorama = (props) => {
    const { data } = props;
    const { phase } = props;
    const { fakeHotspotID } = props;
    const { setFakeHotspotID } = props;
    const { moveSpotsArray } = props; //展場的所有移動點物件都存在這個陣列
    const { infoSpotsArray } = props; //展場的所有資訊點物件都存在這個陣列
    const { setInfoSpotsArray } = props;
    const { customSpotsArray } = props;
    const { setCustomSpotsArray } = props;
    const [location, setLocation] = useState(data.firstScene.toString());//字串，紀錄現在人在哪一張全景圖
    const [sceneId, setSceneId] = useState("-1");
    const [style, setStyle] = useState({});
    const [config, setConfig] = useState({
        uiText: {
            loadButtonLabel: "Failed to<br>Load<br>Panorama"
        }
    });
    const [image, setImage] = useState("");
    const [firstSceneisLoad, setFirstSceneisLoad] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [failtxt, setFailtxt] = useState("");
    const [removeHotspotID, setRemoveHotspotID] = useState(""); //要移除的熱點
    const [contextMenuShow, setContextMenuShow] = useState(false);
    //資訊點===========================================================================
    const [info, setInfo] = useState({});//存資訊點彈出式視窗中的值
    const [infoContextMenuShow, setInfoContextMenuShow] = useState(false);
    const [infoModalShow, setInfoModalShow] = useState(false);//顯示新增資訊點的彈出式視窗
    const [infoAddModalShow, setInfoAddModalShow] = useState(false);//顯示新增資訊點的彈出式視窗
    const [infoEditModalShow, setInfoEditModalShow] = useState(false);//顯示編輯資訊點的彈出式視窗
    const [infoRemoveModalShow, setInfoRemoveModalShow] = useState(false);
    const [infoSpot, setInfoSpot] = useState({ //存新增的移動點資料的表單
        id: "",
        currentSceneID: location,
        currentSceneName: "",
        title: "",
        detailtxt: "",
        pitch: 0,
        yaw: 0
    });
    //客製化展品點============================================================================
    const [customContextMenuShow, setCustomContextMenuShow] = useState(false);
    const [customAddModalShow, setCustomAddModalShow] = useState(false);
    const [customEditModalShow, setCustomEditModalShow] = useState(false);
    const [customRemoveModalShow, setCustomRemoveModalShow] = useState(false);
    const [customSpot, setCustomSpot] = useState({ //存新增的客製化展品點資料的表單
        id: "",
        currentSceneID: location,
        currentSceneName: "",
        pitch: 0,
        yaw: 0,
        itemName: "",
        itemIntro: "",
        permission: "private",
        ownerID: "",
        imageLink: "",
        imageWidth:"100px",
        imageHeight:"100px",
        modelLink: "",
        musicLink: ""
    });
    const [imgSize, setImgSize] = useState({
        id: null,
        width: null,
        height: null       
    });
    //---------------------------------------------------------------------
    const handleContextMenu = useCallback((event) => {
        var currentsid = ReactPannellum.getCurrentScene();
        var currentPanoName = ReactPannellum.getConfig().title;//場景名稱
        var arr = ReactPannellum.mouseEventToCoords(event);
        setInfoSpot({ ...infoSpot, currentSceneID: currentsid, currentSceneName: currentPanoName, pitch: arr[0], yaw: arr[1] });
        setCustomSpot({ ...customSpot, currentSceneID: currentsid, currentSceneName: currentPanoName, pitch: arr[0], yaw: arr[1] });
        setAnchorPoint({ x: event.pageX, y: event.pageY });
        setInfoContextMenuShow(false); //要將移除資訊點關掉
        setContextMenuShow(true);
        return;
    }, [infoSpot, customSpot]);

    useEffect(() => { //第一次跑useEffect是在畫面剛加載時，之後就不再跑此設置了
        if ((phase === 5) && (firstSceneisLoad !== true)) {//確保在階段三(裏頭至少有一張全景圖)
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
            if (moveSpotsArray !== [] || infoSpotsArray !== [] || customSpotsArray !== []) {//移動點陣列裡頭不為空
                Hotspots = transferHotspotObject(moveSpotsArray, infoSpotsArray, customSpotsArray, data.firstScene.toString());
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
                author: data.myPanoramaList[index].authorName,
                showZoomCtrl: false, // 放大縮小的控制圖示按鈕，預設值是 true
                showControls: false, // 是否顯示控制圖示，預設值是 true
                compass: true,
                autoRotate: 0,
                autoLoad: true,
                hotSpots: Hotspots
            });
            setImage(data.myPanoramaList[index].imgLink);
            setFirstSceneisLoad(true);
        }
        function transferHotspotObject(moveSpotsArray, infoSpotsArray, customSpotsArray, firstSceneID) {
            var hotspots = [];
            if (moveSpotsArray !== []) {//當移動點陣列不是空的
                for (let i = 0; i < moveSpotsArray.length; i++) {
                    if (moveSpotsArray[i].currentSceneID === firstSceneID) {
                        var hotspot = {};
                        hotspot["id"] = moveSpotsArray[i].id;
                        hotspot["pitch"] = moveSpotsArray[i].pitch;
                        hotspot["yaw"] = moveSpotsArray[i].yaw;
                        hotspot["scale"] = true;
                        hotspot["type"] = "scene";
                        hotspot["clickHandlerArgs"] = { "sceneId": moveSpotsArray[i].destinationID, "pitch": moveSpotsArray[i].pitch, "yaw": moveSpotsArray[i].yaw };
                        if (moveSpotsArray[i].clickHandlerFunc === "ZoomIn") {
                            hotspot["clickHandlerFunc"] = CameraZoomIn;
                        } else {
                            hotspot["clickHandlerFunc"] = SceneFadeOut;
                        }
                        hotspot["createTooltipFunc"] = setMoveSpotUI;
                        hotspot["createTooltipArgs"] = { "id": moveSpotsArray[i].id, "txt": moveSpotsArray[i].destinationName };
                        hotspots.push(hotspot); //物件加入陣列
                    }
                }
            }
            if (infoSpotsArray !== []) {//當資訊點陣列不是空的
                for (let i = 0; i < infoSpotsArray.length; i++) {
                    if (infoSpotsArray[i].currentSceneID === firstSceneID) {
                        var hotspot2 = {};
                        hotspot2["id"] = infoSpotsArray[i].id;
                        hotspot2["pitch"] = infoSpotsArray[i].pitch;
                        hotspot2["yaw"] = infoSpotsArray[i].yaw;
                        hotspot2["scale"] = true;
                        hotspot2["type"] = "info";
                        hotspot2["createTooltipFunc"] = setInfoSpotUI;
                        hotspot2["createTooltipArgs"] = { "id": infoSpotsArray[i].id, "txt": infoSpotsArray[i].title };
                        hotspot2["clickHandlerFunc"] = showInfoDetail;
                        hotspot2["clickHandlerArgs"] = { "id": infoSpotsArray[i].id, "title": infoSpotsArray[i].title, "detailtxt": infoSpotsArray[i].detailtxt };
                        hotspots.push(hotspot2); //物件加入陣列
                    }
                }
            }
            if (customSpotsArray !== []) {
                for (let i = 0; i < customSpotsArray.length; i++) {
                    if (customSpotsArray[i].currentSceneID === firstSceneID) {
                        var hotspot3 = {};
                        hotspot3["id"] = customSpotsArray[i].id;
                        hotspot3["pitch"] = customSpotsArray[i].pitch;
                        hotspot3["yaw"] = customSpotsArray[i].yaw;
                        hotspot3["scale"] = true;
                        hotspot3["createTooltipFunc"] = setCustomSpotUI;
                        hotspot3["createTooltipArgs"] = { "id": customSpotsArray[i].id, "txt": customSpotsArray[i].itemName, "img": customSpotsArray[i].imageLink, "customObject": customSpotsArray[i] };
                        hotspots.push(hotspot3); //物件加入陣列
                    }
                }
            }
            return hotspots;
        }
    }, [data, phase, firstSceneisLoad, moveSpotsArray, infoSpotsArray, customSpotsArray]);//data如果變了，會在觸發一次useEffect

    useEffect(() => {
        if ((ReactPannellum.getCurrentScene() !== null) && (firstSceneisLoad)) {
            for (let i = 0; i < data.myPanoramaList.length; i++) {
                //location如果是已經被刪掉的全景圖，就找不到了
                if ((data.myPanoramaList[i].fakeID === data.firstScene) && (data.myPanoramaList[i].fakeID.toString() === location)) {
                    if (ReactPannellum.getCurrentScene() !== location) {
                        ReactPannellum.loadScene(location);
                    }
                } else {
                    if (data.myPanoramaList[i].fakeID.toString() === location) {
                        addPanorama(location, data.myPanoramaList[i], moveSpotsArray, infoSpotsArray, customSpotsArray);
                    }
                }
            }
        }
        return;
        function addPanorama(sceneId, panorama, moveSpotsArray, infoSpotsArray, customSpotsArray) {
            const PanoArray = ReactPannellum.getAllScenes();
            var isExist = false;
            if (PanoArray !== null) {
                PanoArray.forEach(function (obj, j) {
                    const arr = Object.keys(obj); //取出場景的key值，但他會回傳陣列
                    if (arr[0] === sceneId) { //如果已經有此場景
                        isExist = true;
                        if (ReactPannellum.getCurrentScene() !== sceneId) {//如果現在的場景不等於現在viewer的位置
                            ReactPannellum.loadScene(sceneId);
                        }
                    }
                });
            }
            if (!isExist) {
                var Hotspots2 = transferHotspotObject(moveSpotsArray, infoSpotsArray, customSpotsArray, sceneId);
                if((panorama.smallimgLink !== "")&&(panorama.smallimgLink !== null)){ //加入底部的熱點圖案
                    var hotspot = {};
                    hotspot["pitch"] = -90;
                    hotspot["yaw"] = 90;
                    hotspot["cssClass"] = "divIcon";
                    hotspot["createTooltipFunc"] = setBottomIcon;
                    hotspot["createTooltipArgs"] = { img: panorama.smallimgLink};
                    Hotspots2.push(hotspot);
                }
                var imageFile = panorama.imgLink;
                var name = panorama.panoramaName;
                var config2 = {
                    title: name,
                    imageSource: imageFile,
                    author: panorama.authorName,
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
        function transferHotspotObject(moveSpotsArray, infoSpotsArray, customSpotsArray, firstSceneID) {
            var hotspots = [];
            if (moveSpotsArray !== []) {//當移動點陣列不是空的
                for (let i = 0; i < moveSpotsArray.length; i++) {
                    if (moveSpotsArray[i].currentSceneID === firstSceneID) {
                        var hotspot = {};
                        hotspot["id"] = moveSpotsArray[i].id;
                        hotspot["pitch"] = moveSpotsArray[i].pitch;
                        hotspot["yaw"] = moveSpotsArray[i].yaw;
                        hotspot["scale"] = true;
                        hotspot["type"] = "scene";
                        hotspot["clickHandlerArgs"] = { "sceneId": moveSpotsArray[i].destinationID, "pitch": moveSpotsArray[i].pitch, "yaw": moveSpotsArray[i].yaw };
                        if (moveSpotsArray[i].clickHandlerFunc === "ZoomIn") {
                            hotspot["clickHandlerFunc"] = CameraZoomIn;
                        } else {
                            hotspot["clickHandlerFunc"] = SceneFadeOut;
                        }
                        hotspot["createTooltipFunc"] = setMoveSpotUI;
                        hotspot["createTooltipArgs"] = { "id": moveSpotsArray[i].id, "txt": moveSpotsArray[i].destinationName };
                        hotspots.push(hotspot); //物件加入陣列
                    }
                }
            }
            if (infoSpotsArray !== []) {//當資訊點陣列不是空的
                for (let i = 0; i < infoSpotsArray.length; i++) {
                    if (infoSpotsArray[i].currentSceneID === firstSceneID) {
                        var hotspot2 = {};
                        hotspot2["id"] = infoSpotsArray[i].id;
                        hotspot2["pitch"] = infoSpotsArray[i].pitch;
                        hotspot2["yaw"] = infoSpotsArray[i].yaw;
                        hotspot2["scale"] = true;
                        hotspot2["type"] = "info";
                        hotspot2["createTooltipFunc"] = setInfoSpotUI;
                        hotspot2["createTooltipArgs"] = { "id": infoSpotsArray[i].id, "txt": infoSpotsArray[i].title };
                        hotspot2["clickHandlerFunc"] = showInfoDetail;
                        hotspot2["clickHandlerArgs"] = { "id": infoSpotsArray[i].id, "title": infoSpotsArray[i].title, "detailtxt": infoSpotsArray[i].detailtxt };
                        hotspots.push(hotspot2); //物件加入陣列
                    }
                }
            }
            if (customSpotsArray !== []) {//當客製化展品點陣列不是空的
                for (let i = 0; i < customSpotsArray.length; i++) {
                    if (customSpotsArray[i].currentSceneID === firstSceneID) {
                        var hotspot3 = {};
                        hotspot3["id"] = customSpotsArray[i].id;
                        hotspot3["pitch"] = customSpotsArray[i].pitch;
                        hotspot3["yaw"] = customSpotsArray[i].yaw;
                        hotspot3["scale"] = true;
                        hotspot3["createTooltipFunc"] = setCustomSpotUI;
                        hotspot3["createTooltipArgs"] = { "id": customSpotsArray[i].id, "txt": customSpotsArray[i].itemName, "img": customSpotsArray[i].imageLink, "customObject": customSpotsArray[i] };
                        hotspots.push(hotspot3); //物件加入陣列
                    }
                }
            }
            return hotspots;
        }
    }, [data, location, firstSceneisLoad, moveSpotsArray, infoSpotsArray, customSpotsArray])

    const onPanoramaLoaded = () => { //當全景圖載入完成
        setContextMenuShow(false); //load新場景要將上一場景開的contextmenu關掉
        setInfoContextMenuShow(false);
        setCustomContextMenuShow(false);
        document.getElementById('panorama').addEventListener("contextmenu", handleContextMenu)
        document.getElementById('panorama').addEventListener("click", () => {
            setContextMenuShow(false);
            setInfoContextMenuShow(false);
            setCustomContextMenuShow(false);
        })
        document.getElementById('panorama').addEventListener("drag", () => {
            setContextMenuShow(false);
            setInfoContextMenuShow(false);
            setCustomContextMenuShow(false);
        })
    }
    /*=====================InfoSpot 資訊點============================ */
    const setInfoSpotUI = (hotSpotDiv, args) => {
        hotSpotDiv.classList.add('custom-tooltip');
        hotSpotDiv.setAttribute("id", args.id);
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.txt;
        hotSpotDiv.appendChild(span);
        hotSpotDiv.addEventListener("contextmenu", (event) => {
            event.preventDefault(); //將原先取消原先右鍵會做的事件發生
            setRemoveHotspotID(hotSpotDiv.getAttribute("id")); //設定要刪除/編輯的資訊點
            setAnchorPoint({ x: event.pageX, y: event.pageY });
            setInfoContextMenuShow(true);
            event.stopPropagation(); //將上層的監聽事件取消，阻擋bubble產生
        });
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 - 10 + 'px';
        span.style.marginTop = -span.scrollHeight - 12 + 'px';
    }
    const ShowAddInfoModal = () => { //顯示新增資訊點的彈出式視窗
        setInfoAddModalShow(true);
        setContextMenuShow(false);
    }
    const ShowRemoveInfoModal = () => { //顯示刪除資訊點的彈出式視窗
        setInfoRemoveModalShow(true);
        setInfoContextMenuShow(false);
    }
    const ShowEditInfoModal = () => { //顯示編輯資訊點的彈出式視窗
        setInfoEditModalShow(true);
        setInfoContextMenuShow(false);
    }
    function showInfoDetail(event, handlerArg) { //點擊資訊點的的彈出式視窗畫面
        setInfo({ title: handlerArg.title, detailtxt: handlerArg.detailtxt });
        setInfoModalShow(true);
    }
    /*=====================MoveSpot 移動點============================ */
    function setMoveSpotUI(hotSpotDiv, args) {
        hotSpotDiv.classList.add('custom-tooltip');
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.txt;
        hotSpotDiv.appendChild(span);
        hotSpotDiv.setAttribute("id", args.id);
        hotSpotDiv.addEventListener("contextmenu", (event) => {
            event.preventDefault(); //將原先取消原先右鍵會做的事件發生
            event.stopPropagation(); //將上層的監聽事件取消，阻擋bubble產生
        });
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 - 10 + 'px';
        span.style.marginTop = -span.scrollHeight - 12 + 'px';
    }
    function CameraZoomIn(event, handlerArg) { //相機滑入進入場景
        ReactPannellum.setPitch(handlerArg.pitch);
        ReactPannellum.setYaw(handlerArg.yaw);
        ReactPannellum.setHfov(ReactPannellum.getHfov() - 40);
        setTimeout(function () { // 場景轉換
            setLocation(handlerArg.sceneId);//ReactPannellum.loadScene(handlerArg.sceneId)
        }, 500);
    }
    function SceneFadeOut(event, handlerArg) {//淡入移動場景
        setLocation(handlerArg.sceneId);
    }
    /*=====================CustomSpot 客製化點(展品)============================ */
    const ShowAddCustomModal = () => {
        setCustomAddModalShow(true);
        setContextMenuShow(false);
    };
    const ShowRemoveCustomModal = () => { //顯示刪除資訊點的彈出式視窗
        setCustomRemoveModalShow(true);
        setCustomContextMenuShow(false);
    }
    const ShowEditCustomModal = () => {
        setCustomEditModalShow(true);
        setCustomContextMenuShow(false);
    };
    const setCustomSpotUI = (hotSpotDiv, args) => {
        hotSpotDiv.classList.add('custom-tooltip');
        hotSpotDiv.setAttribute("id", args.id);
        var fa = document.createElement('div');
        fa.setAttribute("id", "father");
        hotSpotDiv.appendChild(fa);
        var box = document.createElement('div');
        box.setAttribute("id", "custombox");
        box.setAttribute("style", "width:"+args.customObject.imageWidth+";height:"+args.customObject.imageHeight+";");
        fa.appendChild(box);
        var scale = document.createElement('div');
        scale.setAttribute("id", "scale");
        box.appendChild(scale);
        var img = document.createElement('img');
        if (typeof args.img === "object") { //有可能是File或者是URL
            img.src = URL.createObjectURL(args.img);
        } else {
            img.src = args.img;
        }
        img.setAttribute("id", "hotspotImg");
        img.setAttribute("data-bs-toggle", "modal");
        img.setAttribute("data-bs-target", "#testModal");
        img.addEventListener("click", function () {
            window.ExItem(args.customObject.itemName, args.customObject.authorName, args.customObject.currentSceneName, args.customObject.itemIntro, args.customObject.musicLink, args.customObject.modelLink);
        });
        box.appendChild(img);
        fa.style.marginLeft = -(img.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
        fa.style.marginTop = -img.scrollHeight/2 + 'px';
        scale.onmousedown = function (e) {
            // 阻止冒泡,避免缩放時觸發移动事件
            e.stopPropagation();
            e.preventDefault();
            var pos = {
                'w': box.offsetWidth,
                'h': box.offsetHeight,
                'x': e.clientX,
                'y': e.clientY
            };
            fa.onmousemove = function (ev) {
                ev.preventDefault();
                // 設置圖片的最小缩放為30*30
                var w = Math.max(30, ev.clientX - pos.x + pos.w);
                var h = Math.max(30, ev.clientY - pos.y + pos.h);
                // 設置圖片的最大寬高
                w = w >= fa.offsetWidth - box.offsetLeft ? fa.offsetWidth - box.offsetLeft : w;
                h = h >= fa.offsetHeight - box.offsetTop ? fa.offsetHeight - box.offsetTop : h;
                box.style.width = w + 'px';
                box.style.height = h + 'px';
            }
            fa.onmouseleave = function () {
                setImgSize({id:args.id, width: box.style.width, height: box.style.height, customObject: args.customObject});
                fa.onmousemove = null;
                fa.onmouseup = null;
            }
            fa.onmouseup = function () {
                setImgSize({id:args.id, width: box.style.width, height: box.style.height, customObject: args.customObject});
                fa.onmousemove = null;
                fa.onmouseup = null;
            }
        }
        //------------------------------------------------------------------------
        hotSpotDiv.addEventListener("contextmenu", (event) => {
            event.preventDefault(); //將原先取消原先右鍵會做的事件發生
            setRemoveHotspotID(hotSpotDiv.getAttribute("id")); //設定要刪除/編輯的客製化展品點
            setAnchorPoint({ x: event.pageX, y: event.pageY });
            setCustomContextMenuShow(true);
            event.stopPropagation(); //將上層的監聽事件取消，阻擋bubble產生
        });
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.txt;
        box.appendChild(span);
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - img.offsetWidth)/2 - img.offsetWidth  + 'px';
        span.style.marginTop = -span.scrollHeight + 'px';
    };
    //===========================縮圖當作遮住360圖片下方的破洞========================================
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
    useEffect(() => {
        if((imgSize.id !== null)&&(imgSize.width !== null)&&(imgSize.height !== null)){
            var newCustomSpotsArray = customSpotsArray;
            var newCustomspot = imgSize.customObject;
            newCustomspot.imageWidth = imgSize.width;
            newCustomspot.imageHeight = imgSize.height;
            for(let i = 0 ; i < customSpotsArray.length ; i++){
                if(customSpotsArray[i].id === imgSize.id){
                    newCustomSpotsArray.splice(i, 1, newCustomspot);
                }
            }
            setImgSize({ //先將size給清空，避免待會觸發這個useEffect重新跑
                id:null,
                width:null,
                height:null
            });
            setCustomSpotsArray(newCustomSpotsArray);
        }
    },[imgSize, customSpotsArray,setCustomSpotsArray])
    return (
        <>
            <div className="pannellum" id="panorama5Div">
                {
                    firstSceneisLoad
                        ? <ReactPannellum id="panorama" imageSource={image} sceneId={sceneId} style={style} config={config} onPanoramaLoaded={onPanoramaLoaded} />
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
                            <Dropdown.Item onClick={ShowAddInfoModal}>新增資訊點</Dropdown.Item>
                            <Dropdown.Item onClick={ShowAddCustomModal}>新增客製化展品點</Dropdown.Item>
                        </ul>
                    ) : (<> </>)
                }
                {
                    infoContextMenuShow ? (
                        <ul
                            className="menu"
                            style={{
                                top: anchorPoint.y,
                                left: anchorPoint.x
                            }}
                        >
                            <Dropdown.Item onClick={ShowEditInfoModal}>編輯資訊點</Dropdown.Item>
                            <Dropdown.Item onClick={ShowRemoveInfoModal}>刪除資訊點</Dropdown.Item>
                        </ul>
                    ) : (<> </>)
                }
                {
                    customContextMenuShow ? (
                        <ul
                            className="menu"
                            style={{
                                top: anchorPoint.y,
                                left: anchorPoint.x
                            }}
                        >
                            <Dropdown.Item onClick={ShowEditCustomModal}>編輯客製化展品點</Dropdown.Item>
                            <Dropdown.Item onClick={ShowRemoveCustomModal}>刪除客製化展品點</Dropdown.Item>
                        </ul>
                    ) : (<> </>)
                }
                {/*新增資訊點的彈出式視窗 */}
                <AddInfoModal infoAddModalShow={infoAddModalShow} setInfoAddModalShow={setInfoAddModalShow}
                    infoSpot={infoSpot} setInfoSpot={setInfoSpot} failtxt={failtxt} setFailtxt={setFailtxt}
                    infoSpotsArray={infoSpotsArray} setInfoSpotsArray={setInfoSpotsArray}
                    fakeHotspotID={fakeHotspotID} setFakeHotspotID={setFakeHotspotID}
                    setInfoSpotUI={setInfoSpotUI} showInfoDetail={showInfoDetail} />
                {/*點擊資訊點的彈出式視窗 */}
                <InfoSpotModal infoModalShow={infoModalShow} setInfoModalShow={setInfoModalShow}
                    title={info.title} detailtxt={info.detailtxt} />
                {/*右鍵資訊點後，點選刪除時，彈出式視窗 */}
                <RemoveInfoModal removeHotspotID={removeHotspotID} infoRemoveModalShow={infoRemoveModalShow}
                    setInfoRemoveModalShow={setInfoRemoveModalShow} location={location} infoSpotsArray={infoSpotsArray}
                    setInfoSpotsArray={setInfoSpotsArray} />
                {/*右鍵資訊點後，點選編輯時，彈出式視窗 */}
                <EditInfoModal infoEditModalShow={infoEditModalShow} setInfoEditModalShow={setInfoEditModalShow}
                    editHotspotID={removeHotspotID} setEditHotspotID={setRemoveHotspotID}
                    infoSpotsArray={infoSpotsArray} setInfoSpotsArray={setInfoSpotsArray}
                    failtxt={failtxt} setFailtxt={setFailtxt} setInfoSpotUI={setInfoSpotUI} showInfoDetail={showInfoDetail} />
                {/*新增客製化展品點的彈出式視窗 */}
                <AddCustomModal customAddModalShow={customAddModalShow} setCustomAddModalShow={setCustomAddModalShow}
                    customSpot={customSpot} setCustomSpot={setCustomSpot} failtxt={failtxt} setFailtxt={setFailtxt}
                    fakeHotspotID={fakeHotspotID} setFakeHotspotID={setFakeHotspotID}
                    customSpotsArray={customSpotsArray} setCustomSpotsArray={setCustomSpotsArray}
                    setCustomSpotUI={setCustomSpotUI} />
                
                {/*編輯客製化展品點的彈出式視窗*/}
                <EditCustomModal customEditModalShow={customEditModalShow} setCustomEditModalShow={setCustomEditModalShow}
                    customSpotsArray={customSpotsArray} setCustomSpotsArray={setCustomSpotsArray}
                    editHotspotID={removeHotspotID} setEditHotspotID={setRemoveHotspotID} failtxt={failtxt} setFailtxt={setFailtxt}
                    setCustomSpotUI={setCustomSpotUI} />
                {/*刪除客製化展品點的彈出式視窗*/}
                <RemoveCustomModal removeHotspotID={removeHotspotID} location={location}
                    customRemoveModalShow={customRemoveModalShow} setCustomRemoveModalShow={setCustomRemoveModalShow}
                    customSpotsArray={customSpotsArray} setCustomSpotsArray={setCustomSpotsArray} />
            </div>
        </>
    );
}
export default Phase5Panorama;
/*
 const setCustomSpotUI = (hotSpotDiv, args) => {
        hotSpotDiv.classList.add('custom-tooltip');
        hotSpotDiv.setAttribute("id", args.id);
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.txt;
        hotSpotDiv.appendChild(span);
        var img = document.createElement('img');
        if (typeof args.img === "object") { //有可能是File或者是URL
            img.src = URL.createObjectURL(args.img);
        } else {
            img.src = args.img;
        }
        img.setAttribute("width", "100px");
        img.setAttribute("data-bs-toggle", "modal");
        img.setAttribute("data-bs-target", "#testModal");
        img.addEventListener("click", function () {
            window.ExItem(args.customObject.itemName, args.customObject.authorName, args.customObject.currentSceneName, args.customObject.itemIntro, args.customObject.musicLink, args.customObject.modelLink);
        });
        img.style.marginLeft = -(img.scrollWidth - hotSpotDiv.offsetWidth) / 2 - 50 + 'px';
        img.style.marginTop = img.scrollHeight - 40 + 'px';
        hotSpotDiv.appendChild(img);
        hotSpotDiv.addEventListener("contextmenu", (event) => {
            event.preventDefault(); //將原先取消原先右鍵會做的事件發生
            setRemoveHotspotID(hotSpotDiv.getAttribute("id")); //設定要刪除/編輯的客製化展品點
            setAnchorPoint({ x: event.pageX, y: event.pageY });
            setCustomContextMenuShow(true);
            event.stopPropagation(); //將上層的監聽事件取消，阻擋bubble產生
        });
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
        span.style.marginTop = -span.scrollHeight - 50 + 'px';
    };
 */