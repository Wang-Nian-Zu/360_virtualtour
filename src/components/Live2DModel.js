import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactLive2d from 'react-live2d';

function Live2DModel() {
    const { pathname } = useLocation();
    useEffect(() => {
        var live2D ;
        var live2Dcontainer;
        if((pathname === "/")||(pathname === "/virtualTour")){ //只有首頁可以出現看板娘
            live2D = document.getElementById('live2d');
            live2D.style.display = "";
            if(pathname === "/virtualTour"){
                live2Dcontainer = document.getElementById('live2d-container');
                live2Dcontainer.style.pointerEvents = "none";
            }
        }else{
            live2D = document.getElementById('live2d');
            live2D.style.display = "none";
            live2D.style.pointerEvents = "auto";
        }
    }, [pathname]);
    return (
        <>
            <ReactLive2d
                width={300}
                height={500}
                ModelList={['Hiyori', 'Haru']}
                color={"#ffefd5"}
                TouchDefault={['360°虛擬策展平台超棒(❁´◡`❁)~', 'Hello! 我們是專題第六組','滑鼠右鍵看看有甚麼神奇的事情發生^_^']}
                TouchBody={['歡迎參觀~', '想要知道更多優秀的策展人嗎?']}
                TouchHead={['好想拿最佳影片獎，可以投票給專題第六組嗎', '好想拿最佳海報獎，可以投票給專題第六組嗎']}
                menuList={["Mtab"]}
            />
        </>
    );
}

export default Live2DModel;