import './App.css';
import React, { useState, useEffect, useRef } from "react";
import ReactPannellum from "react-pannellum";
import "./styles.css";
import { BsFillPlayCircleFill, BsFillPauseCircleFill } from 'react-icons/bs';

// Hot spot creation function
function setHotspot(hotSpotDiv, args) {
  hotSpotDiv.classList.add('custom-tooltip');
  var p = document.createElement("p");
  hotSpotDiv.appendChild(p);
  p.innerHTML = "<br/>歡迎來到";
  p.setAttribute("style", "font-size:16pt;font-weight:bold;");
  var p1 = document.createElement("p");
  hotSpotDiv.appendChild(p1);
  p1.setAttribute("style", "font-size: 16pt;");
  var elem = document.createElement("img");
  hotSpotDiv.appendChild(elem);
  elem.setAttribute("id", "webImg");
  elem.setAttribute("width", "450px");
  elem.setAttribute("style", "z-index:2");
  elem.src = args.img;
}
// Hot spot creation function
function setbottomHotspot(hotSpotDiv, args) {
  hotSpotDiv.classList.add('custom-tooltip');
  var elem = document.createElement("img");
  hotSpotDiv.appendChild(elem);
  elem.setAttribute("width", "1000px");
  elem.setAttribute("style", "z-index:2");
  elem.src = args.img;
}
//產生min到max之間的亂數
function getRandom(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
};

function setContextmenuHotspot(hotSpotDiv, args) {
  hotSpotDiv.classList.add('custom-tooltip');
  var elem = document.createElement("img");
  hotSpotDiv.appendChild(elem);
  elem.setAttribute("width", "100px");
  elem.setAttribute("style", "z-index:2");
  //會產生1~4之間的隨機亂數
  var random = getRandom(1,4);
  if(random % 2 === 0){
    elem.src = args.img;
  }else{
    elem.src = args.img2;
  }
}

// 加上 div
function setHTML(hotSpotDiv, args) { // 第一個框框
  hotSpotDiv.innerHTML +=
    `<div class="shape" style="background-color: rgba(255, 250, 212, 0.8); --secondaryTextColor: white;">
        <div class = "mainUI"
          style="font-weight: bold;">
        </div>
        <a class="btn" href="/home" role="button" style="pointer-events: auto;">了解更多⇲</a>
      </div>
      `;
}
function setHTML2(hotSpotDiv, args) { // 第二個框框
  hotSpotDiv.innerHTML +=
    `<div class="shape2" style="background-color: rgba(135, 206, 250, 0.8); --secondaryTextColor: white;">
        <div class = "mainUI"
          style="font-weight: bold;">
          <br/>
          360°虛擬策展平台<br/> <p id="intro">提供使用者參觀展覽、自行設置展覽功能<br/> 讓欣賞藝術、策展不再困難重重！</p>
        </div>
        <a class="btn" href="/exhibition" role="button" style="pointer-events: auto;">參觀展覽↪</a>
      </div>
      `;
}

function VirtualTourHomePage() {
  const [isplaying, setisplaying] = useState(false);
  const audioElem = useRef();
  // 播音檔
  useEffect(() => {
    // const audio = new Audio("green-piano.mp3");
    if (isplaying) {
      audioElem.current.play();
    }
    else {
      audioElem.current.pause();
    }
  }, [isplaying])

  const PlayPause = () => {
    setisplaying(!isplaying);
  }

  const handleOnContextmenu = event => {
    var arr = ReactPannellum.mouseEventToCoords(event) //Calculate panorama pitch and yaw from location of mouse event
    console.log(arr[0], arr[1])
    ReactPannellum.setPitch(arr[0])
    ReactPannellum.setYaw(arr[1])
    ReactPannellum.addHotSpot({ //新增一個hotspot點
      "pitch": arr[0],
      "yaw": arr[1],
      "cssClass": "custom-hotspot",
      "createTooltipFunc": setContextmenuHotspot, // 是一個js function，用來設置新的hotspot
      "createTooltipArgs": {"img": require("./components/images/ncnu.png"), "img2": require("./components/images/logo.png")},
      scale: true
    })
  };

  useEffect(() => {
    window.addEventListener('contextmenu', handleOnContextmenu);
    return () => {
      window.removeEventListener('contextmenu', handleOnContextmenu);
    };
  }, []);
  // const myImage = "https://pchen66.github.io/Panolens/examples/asset/textures/equirectangular/tunnel.jpg";
  const myImage = "./pottery.JPG";
  const config = { // 第一個場景
    showZoomCtrl: false, // 放大縮小的控制圖示按鈕，預設值是 true
    showControls: true, // 是否顯示控制圖示，預設值是 true
    compass: true,
    autoRotate: 0,
    autoLoad: true,
    hotSpots: [
      {
        yaw: 0,
        pitch: 0,
        cssClass: "divIcon",
        "createTooltipFunc": setHTML,
        scale: true
      },
      {
        yaw: 180,
        pitch: 0,
        cssClass: "divIcon",
        "createTooltipFunc": setHTML2,
        scale: true
      },
      {
        yaw: 0,
        pitch: 0,
        cssClass: "divIcon",
        "createTooltipFunc": setHotspot,
        "createTooltipArgs": {img: require('./components/images/textLogo.png')},
        scale: true
      }
    ]
  };
  const style = {
    width: "100%",
    height: "200%"
  }
  const panoramaIsLoad = () => {
    if(ReactPannellum.isOrientationSupported()){
      if(!ReactPannellum.isOrientationActive()){
        ReactPannellum.startOrientation();
        console.log('Device starts Orientation');
      }
    }else{
      let hs = {
        yaw: 90,
        pitch: -90,
        cssClass: "bottomIcon",
        "createTooltipFunc": setbottomHotspot,
        "createTooltipArgs": { img: require('./components/images/bottomLogo.png') },
        scale: true
      };
      ReactPannellum.addHotSpot(hs, "firstScene");
      console.log("not suppoet!!")
    }
  };
  return (
    <div className="pannellum" id="panoramaDiv">
      {/* 全景圖 */}
      <ReactPannellum
        id="panorama"
        sceneId="firstScene"
        imageSource={myImage}
        style={style}
        config={config}
        onPanoramaLoaded={panoramaIsLoad}
      >
        <div id="controlButton">
          <div id="music-toggle" className="pnlm-controls">
            <audio src="green-piano.mp3" ref={audioElem} />
            <div className="player_controls">
              {
                isplaying ?
                  <BsFillPauseCircleFill className='btn_action pp' onClick={PlayPause} /> :
                  <BsFillPlayCircleFill className='btn_action pp' onClick={PlayPause} />
              }
            </div>
          </div>
        </div>
      </ReactPannellum>
    </div>
  );
}
export default VirtualTourHomePage;