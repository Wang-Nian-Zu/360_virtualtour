import { useEffect, useState } from "react"
import axios from "axios";
import SearchBar from './components/SearchBar.js';
import Footer from '../../components/footer.js';
import BIRDS from "vanta/dist/vanta.birds.min";
import * as THREE from "three";

const Curator = () => {
    const [list, setList] = useState([]) // start with an empty array
    useEffect(() => {
        //isLogin() //判斷使用者有無登入，才能去顯示有訂閱的策展者
        axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                console.log(res);
                if (res.data.Login) { //使用者有登入
                    axios({ //SubscribeCurator
                        method: "get",
                        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=LoginCuratorList",
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
                        url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getCuratorList',
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
                <h1 className="activity"> 策展人 </h1>
            </div>
            <div className="p-3">
                <SearchBar placeholder="搜尋策展人..." list={list} />
            </div>
            <Footer/>
        </div>
    )
}

export default Curator;