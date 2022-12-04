import React, { useEffect, useRef } from 'react';
import './styles.css';
const ExhibitionMap = (props) => {
    const { data } = props;
    const { mapIsLoad } = props;
    const { setMapIsLoad } = props;
    const { location } = props;
    const { setLocation } = props;
    const myImgRef = useRef();
    useEffect(() => {
        if (mapIsLoad) {
            for (let i = 0; i < data.myPanoramaList.length; i++) {
                if ((data.myPanoramaList[i].mapX !== undefined) && (data.myPanoramaList[i].mapY !== undefined) && (data.myPanoramaList[i].mapX !== "") && (data.myPanoramaList[i].mapY !== "")) {
                    setupMark(data.myPanoramaList[i].fakeID, data.myPanoramaList[i].panoramaName, data.myPanoramaList[i].mapX, data.myPanoramaList[i].mapY);
                }
            }
        }
        return;
        function setupMark(id, name, mapX, mapY) { //設置初始的Mark位置
            if (document.getElementById('mark' + id.toString())) { //先將原本的mark刪除
                document.getElementById('mark' + id.toString()).remove();//刪除就得mark
            }
            var elem = document.createElement("img"); // 照片空間
            if (location === id.toString()) {
                elem.src = require('./images/markhere.png');
            } else {
                elem.src = require('./images/mark.png');
            }
            var markDiv = document.createElement("div");
            markDiv.classList.add('custom-tooltip');
            markDiv.setAttribute("id", "mark" + id);
            markDiv.appendChild(elem);
            elem.addEventListener("click", (event) => {
                event.preventDefault(); //將原先取消原先右鍵會做的事件發生
                setLocation(id.toString());//移動場景
                event.stopPropagation(); //將上層的監聽事件取消，阻擋bubble產生
            });
            elem.style.position = "absolute";
            elem.setAttribute("width", myImgRef.current.clientWidth / 10); //"25px"
            elem.style.left = (mapX * myImgRef.current.clientWidth) + "px";
            elem.style.top = (mapY * myImgRef.current.clientHeight) + 30 + "px";//這裡的30是人工手動調整的
            var span = document.createElement("span");
            markDiv.appendChild(span);
            span.innerHTML = name;
            span.style.position = "absolute";
            span.style.width = span.scrollWidth-100 + 'px';
            span.style.marginLeft = (mapX * myImgRef.current.clientWidth)-100+'px';
            span.style.marginTop = -(myImgRef.current.clientHeight)+(mapY*myImgRef.current.clientHeight)-30+ 'px';
            document.getElementById("mapDiv").appendChild(markDiv);
        }
    }, [data.myPanoramaList, mapIsLoad, location, setLocation]);

    return (
        <>
            <div id="mapDiv">
                <img id="mapImg" alt="not found" width="250px"
                    src={URL.createObjectURL(data.mapImgFile)} style={{maxHeight:"260px"}}
                    onLoad={() => { setMapIsLoad(true); }} ref={myImgRef} />
            </div>
        </>
    );
}

export default ExhibitionMap;