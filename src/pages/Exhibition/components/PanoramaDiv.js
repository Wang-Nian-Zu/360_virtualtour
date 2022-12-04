import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import ReactPannellum from "react-pannellum";
import { Link } from 'react-router-dom';
import InfoSpotModal from './ViewPanorama/InfoSpotModal';
import ExhibitionMap from "./ViewPanorama/ExhibitionMap";
import "./ViewPanorama/testExStyles.css";
import { Row, Button } from "react-bootstrap";

const PanoramaDiv = (props) => {
    const { eID } = props; //eID
    const vmenuRef = useRef(); //可以拿到原生DOM的東西
    const [sceneId, setSceneId] = useState(""); //每個場景都有一個獨立的sceneId
    const [style, setStyle] = useState({});
    const [infoModalShow, setInfoModalShow] = useState(false);
    const [location, setLocation] = useState(""); //string，紀錄現在觀眾在哪一個場景ID
    const [info, setInfo] = useState({ title: "", intro: "" });
    //----------------------------------------------------------
    const [mapImgLink, setMapImgLink] = useState("");
    const [mapIsLoad, setMapIsLoad] = useState(false);
    const [mapXYArray, setMapXYArray] = useState("");
    const [menuIcon, setMenuIcon] = useState("◀");
    //----------------------------------------------------------
    const [config, setConfig] = useState({
        uiText: {
            loadButtonLabel: "Failed to<br>Load<br>Panorama"
        }
    });
    const [image, setImage] = useState("");
    const [firstSceneisLoad, setFirstSceneisLoad] = useState(false);
    const [exhibitionName, setExhibitionName] = useState("");// 展覽名稱
    //全景圖音檔----------------------------------------------------------
    const [pMusic, setPMusic] = useState("");
    const [pMusicList, setPMusicList] = useState({});
    //音檔 Menu----------------------------------------------------------
    const [musicMenuIcon, setMusicMenuIcon] = useState("▲");
    const exVmenuRef = useRef(); //可以拿到原生DOM的東西
    useEffect(() => {
        if (firstSceneisLoad) {
            if (pMusic !== "") {
                document.getElementById("pMusicUpPanel").onclick = showMusicMenu;
                var sMenu = document.getElementById("pMusicControls");
                sMenu.style.bottom = "-70px";
                var panelIcon = document.getElementById("pMusicUpPanel");
                panelIcon.style.height = exVmenuRef.current.clientHeight + 'px';
                return;
            }
        }
        function hideMusicMenu() {
            var pos = parseInt(sMenu.style.bottom);
            pos -= 2;
            sMenu.style.bottom = pos + "px";
            if (pos > -70) {
                window.setTimeout(hideMusicMenu, 5);
            }
            if (pos === -70) {
                setMusicMenuIcon("▲");
                document.getElementById("pMusicUpPanel").onclick = showMusicMenu;
            }
        }
        function showMusicMenu() {
            var pos = parseInt(sMenu.style.bottom);
            pos += 2;
            sMenu.style.bottom = pos + "px";
            if (pos < 0)
                window.setTimeout(showMusicMenu, 5);
            if (pos === 0) {
                setMusicMenuIcon("▼");
                document.getElementById("pMusicUpPanel").onclick = hideMusicMenu;
            }
        }
    }, [firstSceneisLoad, pMusic]);

    useEffect(() => {
        if ((firstSceneisLoad) && (mapIsLoad)) {
            document.getElementById("pMapRightPanel").onclick = hideMenu;
            var sMenu = document.getElementById("pMapSlidingMenu");
            sMenu.style.left = "0px";
            var panelIcon = document.getElementById("pMapRightPanel");
            panelIcon.style.height = vmenuRef.current.clientHeight + 'px';
            return;
        }
        function hideMenu() {
            var pos = parseInt(sMenu.style.left);
            pos -= 4;
            sMenu.style.left = pos + "px";
            if (pos > -500) {
                window.setTimeout(hideMenu, 5);
            }
            if (pos === -500) {
                setMenuIcon("▶");
                document.getElementById("pMapRightPanel").onclick = showMenu;
            }
        }
        function showMenu() {
            var pos = parseInt(sMenu.style.left);
            pos += 4;
            sMenu.style.left = pos + "px";
            if (pos < 0)
                window.setTimeout(showMenu, 5);
            if (pos === 0) {
                setMenuIcon("◀");
                document.getElementById("pMapRightPanel").onclick = hideMenu;
            }
        }
    }, [firstSceneisLoad, mapIsLoad]);
    useEffect(() => { //第一次跑useEffect是在畫面剛加載時，當時props都還沒有傳eID參數進來
        if ((eID > 0) && (firstSceneisLoad === false)) { //因為上一個檔案預設如果還沒接到eID就是0，所以我們就寫一個if擋掉eID還沒定義時的情況
            axios({
                method: "get",
                url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getFirstPanoramaData&eID=' + eID,
                dataType: "JSON",
                withCredentials: true
            })
                .then((res) => {
                    console.log(res);
                    const jsHotspots = changeHotspotObject(res.data.firstConfig.hotspots);
                    if (res.data.firstConfig.smallimgLink !== "") { //加入底部的熱點圖案
                        var hotspot = {};
                        hotspot["pitch"] = -90;
                        hotspot["yaw"] = 90;
                        hotspot["cssClass"] = "divIcon";
                        hotspot["createTooltipFunc"] = setBottomIcon;
                        hotspot["createTooltipArgs"] = { img: res.data.firstConfig.smallimgLink };
                        jsHotspots.push(hotspot);
                    }
                    setConfig({
                        showZoomCtrl: false, // 放大縮小的控制圖示按鈕，預設值是 true
                        showControls: true, // 是否顯示控制圖示，預設值是 true
                        compass: true,
                        autoRotate: 0,
                        autoLoad: true,
                        title: res.data.firstConfig.name,
                        author: res.data.firstConfig.authorName,
                        hotSpots: jsHotspots
                    });
                    setStyle({
                        width: "100%",
                        height: "150%"
                    });
                    setImage(res.data.firstConfig.imgLink);
                    setSceneId(res.data.firstConfig.sceneId);
                    var currentPMusic = {};
                    if ((res.data.firstConfig.musicLink !== "") && (res.data.firstConfig.musicLink !== null)) {
                        currentPMusic[res.data.firstConfig.sceneId] = res.data.firstConfig.musicLink;
                        setPMusicList(currentPMusic);
                        setPMusic(res.data.firstConfig.musicLink);
                    } else {
                        currentPMusic[res.data.firstConfig.sceneId] = "";
                    }
                    setExhibitionName(res.data.exhibitionName);
                    setLocation(res.data.firstConfig.sceneId);
                    if ((res.data.mapImg !== "") && (res.data.mapImg !== null)) {
                        setMapImgLink(res.data.mapImg);
                        axios({
                            method: "get",
                            url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getAllPanoramaXY&eID=' + eID,
                            dataType: "JSON",
                            withCredentials: true
                        })
                            .then((res) => {
                                console.log(res);
                                setMapXYArray(res.data);//抓所有場景在map X跟Y的值
                            })
                            .catch(console.error);
                    }
                    setFirstSceneisLoad(true);
                })
                .catch(console.error);
            function changeHotspotObject(phpHotspots) { //將php hotspot object 轉換成 js hotspot object
                var hotspots = [];
                phpHotspots.forEach(function (obj, i) {
                    var hotspot = {};
                    hotspot["pitch"] = obj.pitch;
                    hotspot["yaw"] = obj.yaw;
                    hotspot["scale"] = true;
                    if (obj.type === "scene") { //移動點hotspot
                        hotspot["type"] = "scene";
                        hotspot["createTooltipFunc"] = setMoveSpotUI;
                        hotspot["createTooltipArgs"] = { txt: "前往" + obj.destinationName };
                        hotspot["clickHandlerArgs"] = obj.clickHandlerArgs;
                        if (obj.clickHandlerFunc === "CameraZoomIn") {
                            hotspot["clickHandlerFunc"] = CameraZoomIn;
                        } else {
                            hotspot["clickHandlerFunc"] = SceneFadeOut;
                        }
                    } else if (obj.type === "info") { //資訊hotspot
                        hotspot["clickHandlerFunc"] = clickInfoSpot;
                        hotspot["clickHandlerArgs"] = { title: obj.title, intro: obj.intro };
                        hotspot["type"] = "info";
                        hotspot["text"] = obj.title;
                    } else { //客製化hotspot
                        hotspot["cssClass"] = "custom-hotspot";
                        hotspot["createTooltipFunc"] = setCustomSpotUI;
                        hotspot["createTooltipArgs"] = obj.createTooltipArgs;
                    }
                    hotspots.push(hotspot); //物件加入陣列
                });
                return hotspots;
            }
        }
    }, [eID, firstSceneisLoad]);//eID如果變了，會在觸發一次useEffect

    useEffect(() => {
        if ((location !== "") && (firstSceneisLoad) && (ReactPannellum.getCurrentScene() !== null)) {
            const PanoArray = ReactPannellum.getAllScenes();
            var isExist = false; //有沒有在場景列表中
            if (PanoArray !== null) {
                PanoArray.forEach(function (obj, i) {
                    const arr = Object.keys(obj); //取出場景的key值，但他會回傳陣列
                    if ((arr[0] === location)) { //如果已經有此場景
                        isExist = true;
                        if (ReactPannellum.getCurrentScene() !== location) {//如果現在的場景不等於現在viewer的位置
                            ReactPannellum.loadScene(location);
                        }
                    }
                });
            }
            if ((!isExist) && (location !== sceneId)) {//如果現在的位置在第一場景，就不能新增展場
                addPanorama(location);
            }
        }
        function addPanorama(sceneId) {
            var sID = Number(sceneId);//先從字串轉成整數
            axios({
                method: "get",
                url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getOtherPanoramaData&epID=' + sID,
                dataType: "JSON",
                withCredentials: true
            })
                .then((res) => {
                    if (res.data.config !== []) {
                        const jsHotspots2 = changeHotspotObject(res.data.config.hotspots);
                        if (res.data.config.smallimgLink !== "") { //加入底部的熱點圖案
                            var hotspot = {};
                            hotspot["pitch"] = -90;
                            hotspot["yaw"] = 90;
                            hotspot["cssClass"] = "divIcon";
                            hotspot["createTooltipFunc"] = setBottomIcon;
                            hotspot["createTooltipArgs"] = { img: res.data.config.smallimgLink };
                            jsHotspots2.push(hotspot);
                        }
                        const config2 = {
                            imageSource: res.data.config.imgLink,
                            showZoomCtrl: false, // 放大縮小的控制圖示按鈕，預設值是 true
                            showControls: true, // 是否顯示控制圖示，預設值是 true
                            compass: true,
                            autoLoad: true,
                            title: res.data.config.name,
                            author: res.data.config.authorName,
                            hotSpots: jsHotspots2
                        }
                        var currentPMusic = pMusicList;
                        if ((res.data.config.musicLink !== "") && (res.data.config.musicLink !== null)) {
                            currentPMusic[res.data.sceneId] = res.data.config.musicLink;
                            setPMusicList(currentPMusic);
                            setPMusic(res.data.config.musicLink);
                        } else {
                            currentPMusic[res.data.sceneId] = "";
                        }
                        ReactPannellum.addScene(res.data.sceneId, config2, () => { ReactPannellum.loadScene(res.data.sceneId) });
                    }
                })
                .catch(console.error);
        };
        function changeHotspotObject(phpHotspots) { //將php hotspot object 轉換成 js hotspot object
            var hotspots = [];
            phpHotspots.forEach(function (obj, i) {
                var hotspot = {};
                hotspot["pitch"] = obj.pitch;
                hotspot["yaw"] = obj.yaw;
                hotspot["scale"] = true;
                if (obj.type === "scene") { //移動點hotspot
                    hotspot["type"] = "scene";
                    hotspot["createTooltipFunc"] = setMoveSpotUI;
                    hotspot["createTooltipArgs"] = { txt: "前往" + obj.destinationName };
                    hotspot["clickHandlerArgs"] = obj.clickHandlerArgs;
                    if (obj.clickHandlerFunc === "CameraZoomIn") {
                        hotspot["clickHandlerFunc"] = CameraZoomIn;
                    } else {
                        hotspot["clickHandlerFunc"] = SceneFadeOut;
                    }
                } else if (obj.type === "info") { //資訊hotspot
                    hotspot["clickHandlerFunc"] = clickInfoSpot;
                    hotspot["clickHandlerArgs"] = { title: obj.title, intro: obj.intro };
                    hotspot["type"] = "info";
                    hotspot["text"] = obj.title;
                } else { //客製化hotspot
                    hotspot["cssClass"] = "custom-hotspot";
                    hotspot["createTooltipFunc"] = setCustomSpotUI;
                    hotspot["createTooltipArgs"] = obj.createTooltipArgs;
                }
                hotspots.push(hotspot); //物件加入陣列
            });
            return hotspots;
        }
    }, [firstSceneisLoad, mapIsLoad, location, sceneId, pMusicList]);

    useEffect(() => {
        if ((location !== "") && (firstSceneisLoad) && (ReactPannellum.getCurrentScene() !== null)) {
            var currentPMusic = pMusicList;
            console.log(currentPMusic);
            if ((currentPMusic !== null)) {
                if (currentPMusic[location] === undefined) {
                    setPMusic("");
                } else {
                    setPMusic(currentPMusic[location]);
                }
            }
        }
    }, [firstSceneisLoad, mapIsLoad, sceneId, location, pMusicList]);

    function CameraZoomIn(event, handlerArg) { //移動時由遠拉近特效
        ReactPannellum.setPitch(handlerArg.pitch);
        ReactPannellum.setYaw(handlerArg.yaw);
        ReactPannellum.setHfov(ReactPannellum.getHfov() - 40);
        setTimeout(function () { // 場景轉換
            setLocation(handlerArg.sceneId);//ReactPannellum.loadScene(handlerArg.sceneId)
        }, 500);
    };
    function SceneFadeOut(event, handlerArg) { //移動時淡出特效
        setLocation(handlerArg.sceneId.toString());
    };
    function clickInfoSpot(event, handlerArg) {
        setInfoModalShow(true);
        setInfo({ title: handlerArg.title, intro: handlerArg.intro });
    }
    function setBottomIcon(hotSpotDiv, args) {//縮圖加入Icon
        hotSpotDiv.classList.add('custom-tooltip');
        var img = document.createElement('img'); // 創建文字空間
        hotSpotDiv.appendChild(img);
        img.id = "0h";
        img.src = args.img;
        img.setAttribute("width", 500);
    }
    function setCustomSpotUI(hotSpotDiv, args) {
        hotSpotDiv.classList.add('custom-tooltip');
        var elem = document.createElement("img"); // 照片空間
        hotSpotDiv.appendChild(elem);
        elem.setAttribute("width", args.imageWidth);
        elem.setAttribute("height", args.imageHeight);
        elem.setAttribute("data-bs-toggle", "modal");
        elem.setAttribute("data-bs-target", "#testModal");
        elem.src = args.img;
        elem.addEventListener("click", function () {
            if (document.getElementById("pMusicA") !== null) {
                var panoMusic = document.getElementById("pMusicA");
                panoMusic.pause();
            }
            window.ExItem(args.itemName, args.authorName, args.currentSceneName, args.itemIntro, args.musicLink, args.modelLink);
        });
        elem.style.marginLeft = -(elem.scrollWidth - hotSpotDiv.offsetWidth) / 2 - 50 + 'px';
        elem.style.marginTop = elem.scrollHeight - 40 + 'px';
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.itemName;
        hotSpotDiv.appendChild(span);
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 + 'px';
        span.style.marginTop = -(span.scrollHeight - hotSpotDiv.offsetHeight) / 2 + 'px';
    }
    function setMoveSpotUI(hotSpotDiv, args) {
        hotSpotDiv.classList.add('custom-tooltip');
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.txt;
        hotSpotDiv.appendChild(span);
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 - 10 + 'px';
        span.style.marginTop = -span.scrollHeight - 12 + 'px';
    };
    return (
        <>
            <div className="pannellum" id="panoramaDiv">
                {
                    (firstSceneisLoad)
                    && (
                        <>
                            <ReactPannellum id="panorama" imageSource={image} sceneId={sceneId} style={style} config={config}>
                                {(mapImgLink !== "") && (
                                    <div id="pMapControls">
                                        <div id="pMapSlidingMenu" className="pMapSlidingMenu">
                                            <div id="pMapmenu" className="pMapmenu" ref={vmenuRef}>
                                                <span style={{ color: '#424242', fontWeight: 'bold' }}>展場平面地圖</span>
                                                <br />
                                                <ExhibitionMap mapImgLink={mapImgLink} mapXYArray={mapXYArray} mapIsLoad={mapIsLoad}
                                                    setMapIsLoad={setMapIsLoad} location={location} setLocation={setLocation} />
                                                <span style={{ color: 'red', fontWeight: 'bold' }}>(紅:現在位置)</span>
                                                <span style={{ color: 'green', fontWeight: 'bold' }}>(綠:可移動位置)</span>
                                            </div>
                                            <div id="pMapRightPanel">
                                                <span id="menuIcon" >&nbsp;{menuIcon}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {(pMusic !== "") && (
                                    <div id="pMusicControls">
                                        <div id="pMusicSlidingMenu" className="pMusicSlidingMenu">
                                            <div id="pMusicUpPanel">
                                                <span id="musicMenuIcon" >{musicMenuIcon}</span>
                                            </div>
                                            <div id="pMusicVmenu" className="pMusicVmenu" ref={exVmenuRef}>
                                                <span id="pMusicName" style={{ color: 'black', fontWeight: 'bold' }}>{exhibitionName}</span>
                                                <br />
                                                <audio id="pMusicA" alt="pMusicAudio" src={pMusic} controls />
                                                <br />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </ReactPannellum>
                            <Row className="d-flex justify-content-center pe-0">
                                <Button className="storage" style={{width:"250px"}}>
                                    <Link to={"/detailExhibition?eID=" + eID} style={{color:"#ffffff"}}>返回展場資訊</Link></Button>
                            </Row>
                        </>
                    )
                }
            </div>
            {/*點擊資訊點的彈出式視窗 */}
            <InfoSpotModal infoModalShow={infoModalShow} setInfoModalShow={setInfoModalShow}
                title={info.title} intro={info.intro} />
        </>
    )
}
export default PanoramaDiv;
