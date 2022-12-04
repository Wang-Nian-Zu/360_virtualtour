import React, { useState , useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "../index.css";

const SubscribeB = (props) => {
  const {id} = props ;
  const [Subs, setSubs] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [SubTXT, setSubTXT] = useState('Subscribe');
  const [SubBootstrap, setSubBootstrap] = useState("outline-success");
  useEffect(() => {
    axios({
        method: "get",
        url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getCuratorSubs&id='+ id,
        dataType: "JSON",
        withCredentials: true
    })
    .then((res) => {
        setSubs(res.data);
    })
    .catch(console.error);
    // isLogin() // 判斷使用者有無登入，才能去呈現之前使用者有無壓下按鈕
    axios({
        method: "get",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
        dataType: "JSON",
        withCredentials: true
    })
    .then((res) => {
        if(res.data.Login){ //使用者有登入
            axios({ //getLikeorNot(eID)
                method: "get",
                url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=SubscribeOrNot&id=" + id,
                dataType: "JSON",
                withCredentials: true
            })
            .then((res) => {
                if(res.data.sub){ // 表示按過訂閱
                    setSubTXT('Subscribed'); // 換成按過按鈕的UI
                    setSubBootstrap('success'); // 換成按過按鈕的UI
                    setIsClicked(true); // 這個是最重要的，紀錄該button已經壓下
                }
            })
        }
        // 未登入就沒差，用預設沒按過按鈕的UI就好
    })
    .catch(console.error);
  }, [id]);

  const handleClick = () => { // 當按鈕按下後
    // isLogin() // 先判斷是否登入，才能去紀錄使用者按下訂閱行為
    axios({
        method: "get",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
        dataType: "JSON",
        withCredentials: true
    })
    .then((res) => {
        if(res.data.Login){ // 有登入
            if (isClicked) {
                setSubTXT('Subscribe');
                setSubBootstrap('outline-success');
                setSubs({
                    SubCount: Subs.SubCount - 1
                });
                unSubscribe(id)
            }else{
                setSubTXT('Subscribed');
                setSubBootstrap('success');
                setSubs({
                    SubCount: Subs.SubCount + 1
                });
                subscribe(id)
            }
            setIsClicked(!isClicked);
        }else{ // 未登入
            alert('目前為訪客模式，登入後才能按愛心')
        }
    })   
    .catch(console.error);
  };
  const subscribe = async(id) => {
    axios({
        method: "get",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=subscribe&id="+id,
        dataType: "JSON",
        withCredentials: true
    })
    .then((res) => {
        return res;
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const unSubscribe = async(id) => { 
    axios({
        method: "get",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=unSubscribe&id="+id,
        dataType: "JSON",
        withCredentials: true
    })
    .then((res) => {
        return res;
    })
    .catch((error) => {
        console.log(error);
    });
  }

  return (
        <div className='p-2'>
        {/* <p> 訂閱人數 : {Subs.SubCount}</p> */}
        <Button variant={SubBootstrap} className={ `Subscribe-button` } onClick={ handleClick }>{ ` ${SubTXT} | ${Subs.SubCount} ` }</Button>
        </div>
  )
};

export default SubscribeB;