import { useEffect, useState } from "react"
import SearchBar from './components/SearchBar.js';
import Footer from '../../components/footer.js';
import axios from 'axios';
import './index.css';
import BIRDS from "vanta/dist/vanta.birds.min";
import * as THREE from "three";

const Exhibition = () => {
    const [list, setList] = useState([]) // start with an empty array
    useEffect(() => {
        axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                if (res.data.Login) { //使用者有登入
                    axios({ //getExhibitionListLogin
                        method: "get",
                        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=LoginExhibitionList",//name
                        dataType: "JSON",
                        withCredentials: true
                    })
                        .then((res) => {
                            setList(res.data);
                        })
                } else {
                    //未登入用預設顯示策展者
                    //getList()
                    axios({
                        method: "get",
                        url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getExhibitionList',
                        dataType: "JSON",
                        withCredentials: true
                    })
                        .then((res) => {
                            setList(res.data);
                        })
                }
            })
            .catch(console.error);
    }, []) // empty dependencies array, this runs only once

    const [vantaEffect, setVantaEffect] = useState(0);
    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                BIRDS({
                    el: "#vanta",
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    backgroundColor: 0xffffe7,
                    color1: 0x917b49,
                    color2: 0x7c8e5a,
                    birdSize: 1.10,
                    wingSpan: 22.00,
                    speedLimit: 2.00,
                    separation: 44.00,
                    alignment: 78.00,
                    quantity: 3.00
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <div>
            <div id='vanta'></div>
            <div className="square border border-0 text-center p-1">
                <h1 className="activity"> 展場活動 </h1>
            </div>
            <div className="p-3">
                <SearchBar placeholder="搜尋展覽..." list={list} />
            </div>
            <Footer />
        </div>
    )
}

export default Exhibition;