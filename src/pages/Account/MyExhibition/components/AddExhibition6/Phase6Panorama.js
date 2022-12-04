import React, { useState, useEffect, useRef } from 'react';
import ReactPannellum from "react-pannellum";
import "./styles.css"; //一定要加css不然跑不動
import InfoSpotModal from './InfoSpotModal';
import ExhibitionMap from './ExhibitionMap';
const Phase6Panorama = (props) => {
    const { data } = props;
    const { phase } = props;
    const { moveSpotsArray } = props; //展場的所有移動點物件都存在這個陣列
    const { infoSpotsArray } = props; //展場的所有資訊點物件都存在這個陣列
    const { customSpotsArray } = props;
    const [location, setLocation] = useState(data.firstScene.toString());//字串，紀錄現在人在哪一張全景圖
    const [sceneId, setSceneId] = useState("-1");
    const [style, setStyle] = useState({});
    const [config, setConfig] = useState({
        uiText: {
            loadButtonLabel: "Failed to<br>Load<br>Panorama"
        }
    });
    const [image, setImage] = useState("");
    const [mapLink, setMapLink] = useState("");
    const [firstSceneisLoad, setFirstSceneisLoad] = useState(false);
    //資訊點===========================================================================
    const [info, setInfo] = useState({});//存資訊點彈出式視窗中的值
    const [infoModalShow, setInfoModalShow] = useState(false);//顯示新增資訊點的彈出式視窗
    //小地圖sliding Menu
    const [menuIcon, setMenuIcon] = useState("◀");
    const vmenuRef = useRef(); //可以拿到原生DOM的東西
    const [mapIsLoad, setMapIsLoad] = useState(false);
    useEffect(() => {
        if (firstSceneisLoad && mapIsLoad) {
            document.getElementById("rightPanel").onclick = hideMenu;
            var sMenu = document.getElementById("slidingMenu");
            sMenu.style.left = "0px";
            var panelIcon = document.getElementById("rightPanel");
            panelIcon.style.height = vmenuRef.current.clientHeight + 'px';
            return;
        }
        function hideMenu() {
            var pos = parseInt(sMenu.style.left);
            pos -= 2;
            sMenu.style.left = pos + "px";
            if (pos > -250) {
                window.setTimeout(hideMenu, 5);
            }
            if (pos === -250) {
                setMenuIcon("▶");
                document.getElementById("rightPanel").onclick = showMenu;
            }
        }
        function showMenu() {
            var pos = parseInt(sMenu.style.left);
            pos += 2;
            sMenu.style.left = pos + "px";
            if (pos < 0)
                window.setTimeout(showMenu, 5);
            if (pos === 0) {
                setMenuIcon("◀");
                document.getElementById("rightPanel").onclick = hideMenu;
            }
        }
    }, [firstSceneisLoad, mapIsLoad]);

    //全景圖音檔
    const [pMusic, setPMusic] = useState("");
    const [pMusicList, setPMusicList] = useState({});
    //音檔 Menu===========================================================================
    const [musicMenuIcon, setMusicMenuIcon] = useState("▲");
    const exVmenuRef = useRef();
    useEffect(() => {
        if (firstSceneisLoad) {
            if (pMusic !== "") {
                document.getElementById("addPMusicUpPanel").onclick = showMusicMenu;
                var sMenu = document.getElementById("addPMusicControls");
                sMenu.style.bottom = "-50px";
                var panelIcon = document.getElementById("addPMusicUpPanel");
                panelIcon.style.height = exVmenuRef.current.clientHeight + 'px';
                return;
            }
        }
        function hideMusicMenu() {
            var pos = parseInt(sMenu.style.bottom);
            pos -= 2;
            sMenu.style.bottom = pos + "px";
            if (pos > -50) {
                window.setTimeout(hideMusicMenu, 5);
            }
            if (pos === -50) {
                setMusicMenuIcon("▲");
                document.getElementById("addPMusicUpPanel").onclick = showMusicMenu;
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
                document.getElementById("addPMusicUpPanel").onclick = hideMusicMenu;
            }
        }
    }, [firstSceneisLoad, pMusic]);

    useEffect(() => { //第一次跑useEffect是在畫面剛加載時，之後就不再跑此設置了
        if ((phase === 6) && (firstSceneisLoad !== true)) {//確保在階段三(裏頭至少有一張全景圖)
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
            if (data.mapImgFile !== null) {
                setMapLink(data.mapImgFile);
            }
            var currentPMusic = {};
            if (data.myPanoramaList[index].music !== null) {
                if (typeof data.myPanoramaList[index].music === "object") { //有可能是File或者是URL
                    currentPMusic[data.firstScene.toString()] = URL.createObjectURL(data.myPanoramaList[index].music);
                    setPMusicList(currentPMusic);
                    setPMusic(URL.createObjectURL(data.myPanoramaList[index].music));
                } else {
                    currentPMusic[data.firstScene.toString()] = data.myPanoramaList[index].music;
                    setPMusicList(currentPMusic);
                    setPMusic(data.myPanoramaList[index].music);
                }
            } else {
                currentPMusic[data.firstScene.toString()] = "";
                setPMusic("");
            }
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
        };
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
                var currentPMusic = pMusicList;
                if ((panorama.music !== "") && (panorama.music !== null)) {
                    if (typeof panorama.music === "object") {
                        currentPMusic[sceneId] = URL.createObjectURL(panorama.music);
                        setPMusicList(currentPMusic);
                        setPMusic(URL.createObjectURL(panorama.music));
                    } else {
                        currentPMusic[sceneId] = panorama.music;
                        setPMusicList(currentPMusic);
                        setPMusic(panorama.music);
                    }
                } else {
                    currentPMusic[sceneId] = "";
                    setPMusic("");
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
    }, [data, location, firstSceneisLoad, moveSpotsArray, infoSpotsArray, customSpotsArray, pMusicList])
    // 抓音樂===================================================================================================
    useEffect(() => {
        if ((location !== "") && (firstSceneisLoad) && (ReactPannellum.getCurrentScene() !== null)) {
            var currentPMusic = pMusicList;
            if (currentPMusic !== null) {
                // console.log(currentPMusic[location]);
                if ((currentPMusic[location] === undefined)) {
                    setPMusic("");
                } else {
                    setPMusic(currentPMusic[location]);
                }
            }
        }
    }, [firstSceneisLoad, mapIsLoad, sceneId, location, pMusicList]);
    /*=====================InfoSpot 資訊點============================ */
    const setInfoSpotUI = (hotSpotDiv, args) => {
        hotSpotDiv.classList.add('custom-tooltip');
        hotSpotDiv.setAttribute("id", args.id);
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.txt;
        hotSpotDiv.appendChild(span);
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - hotSpotDiv.offsetWidth) / 2 - 10 + 'px';
        span.style.marginTop = -span.scrollHeight - 12 + 'px';
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
    const setCustomSpotUI = (hotSpotDiv, args) => {
        hotSpotDiv.classList.add('custom-tooltip');
        hotSpotDiv.setAttribute("id", args.id);
        var img = document.createElement('img');
        if (typeof args.img === "object") { //有可能是File或者是URL
            img.src = URL.createObjectURL(args.img);
        } else {
            img.src = args.img;
        }
        img.setAttribute("width", args.customObject.imageWidth);
        img.setAttribute("height", args.customObject.imageHeight);
        img.setAttribute("data-bs-toggle", "modal");
        img.setAttribute("data-bs-target", "#testModal");
        img.addEventListener("click", function () {
            console.log(document.getElementById("pMusicA"));
            if(document.getElementById("pMusicA") !== null){
                var panoMusic = document.getElementById("pMusicA");
                panoMusic.pause();
            }
            window.ExItem(args.customObject.itemName, args.customObject.authorName, args.customObject.currentSceneName, args.customObject.itemIntro, args.customObject.musicLink, args.customObject.modelLink);
        });
        img.style.marginLeft = -(img.scrollWidth - hotSpotDiv.offsetWidth) / 2 - 50 + 'px';
        img.style.marginTop = img.scrollHeight - 40 + 'px';
        hotSpotDiv.appendChild(img);
        var span = document.createElement('span'); // 創建文字空間
        span.innerHTML = args.txt;
        hotSpotDiv.appendChild(span);
        span.style.width = span.scrollWidth - 20 + 'px';
        span.style.marginLeft = -(span.scrollWidth - img.offsetWidth) / 2 - img.offsetWidth + 'px';
        span.style.marginTop = -span.scrollHeight - 50 + 'px';
    };
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
    return (
        <>
            <div className="pannellum" id="panorama6Div">
                {
                    firstSceneisLoad
                    && (<ReactPannellum id="panorama" imageSource={image} sceneId={sceneId} style={style} config={config}>
                        <div id="controls">
                            {(data.mapImgFile) && (
                                <div id="slidingMenu" className="slidingMenu">
                                    <div id="vmenu" className="vmenu" ref={vmenuRef}>
                                        <span style={{ color: '#424242', fontWeight: 'bold' }}>展場平面地圖</span>
                                        <br />
                                        <ExhibitionMap data={data} mapLink={mapLink} mapIsLoad={mapIsLoad}
                                            setMapIsLoad={setMapIsLoad} location={location} setLocation={setLocation} />
                                        <span style={{ color: 'red', fontWeight: 'bold' }}>(紅:現在位置)</span>
                                        <span style={{ color: 'green', fontWeight: 'bold' }}>(綠:可移動位置)</span>
                                    </div>
                                    <div id="rightPanel">
                                        <span id="menuIcon" >&nbsp;{menuIcon}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(pMusic !== "") && (
                            <div id="addPMusicControls">
                                <div id="addPMusicSlidingMenu" className="addPMusicSlidingMenu">
                                    <div id="addPMusicUpPanel">
                                        <span id="musicMenuIcon" >{musicMenuIcon}</span>
                                    </div>
                                    <div id="addPMusicVmenu" className="addPMusicVmenu" ref={exVmenuRef}>
                                        <span id="addPMusicName" style={{ color: 'black', fontWeight: 'bold' }}>{data.exhibitionName}</span>
                                        <br />
                                        <audio id="pMusicA" alt="pMusicAudio" src={pMusic} controls />
                                        <br />
                                    </div>
                                </div>
                            </div>
                        )}
                    </ReactPannellum>)
                }
                {/*點擊資訊點的彈出式視窗 */}
                <InfoSpotModal infoModalShow={infoModalShow} setInfoModalShow={setInfoModalShow}
                    title={info.title} detailtxt={info.detailtxt} />
            </div>
        </>
    );
}
export default Phase6Panorama;