import React, { useState , useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "../index.css";


const LikeButton = (props) => {
  const {eID} = props ; // 這行很重要，不然會抓不到eID
  const [likes, setLikes] = useState(""); // 喜歡此展覽的有多少數量
  const [isClicked, setIsClicked] = useState(false); // 紀錄like button是否被按下
  const [likeTXT, setLikeTXT] = useState('Like');// like button現在是甚麼文字
  const [likeBootstrap, setLikeBootstrap] = useState("outline-danger"); // like button現在的CSS樣式
  
  useEffect(() => {
    axios({ // getExhibitionLikes(eID) // 抓like的數量
        method: "get",
        url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getExhibitionLikes&eID='+ eID,
        dataType: "JSON",
        withCredentials: true
    })
    .then((res) => {
        console.log(res);
        setLikes(res.data); // res.data = {likeCount : xx}
    })
    .catch(console.error);
    axios({ // isLogin() // 判斷使用者有無登入，才能去呈現之前使用者有無壓下按鈕
        method: "get",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
        dataType: "JSON",
        withCredentials: true
    })
    .then((res) => {
        console.log(res);
        if(res.data.Login){ // 使用者有登入
            axios({ // getLikeorNot(eID) 檢查使用者是否已經按下該展場的like button
                method: "get",
                url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getLikeorNot&eID="+eID,
                dataType: "JSON",
                withCredentials: true
            })
            .then((res) => {
                console.log(res);
                if(res.data.like){ // 表示按過愛心
                    setLikeTXT('Liked'); // 換成按過按鈕的UI
                    setLikeBootstrap('danger'); // 換成按過按鈕的UI
                    setIsClicked(true); // 這個是最重要的，紀錄該button已經壓下
                }
            })
        }
        // 未登入就沒差，用預設沒按過按鈕的UI就好
    })
    .catch(console.error);
  }, [eID]);

  const handleClick = () => { // 當like按鈕按下後
    axios({ // isLogin() // 先判斷是否登入，才能去紀錄使用者按下喜歡行為
        method: "get",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
        dataType: "JSON",
        withCredentials: true
    })
    .then((res) => {
        if(res.data.Login){ // 有登入
            if (isClicked) {
                setLikeTXT('Like');
                setLikeBootstrap('outline-danger');
                setLikes({
                    likeCount: likes.likeCount - 1
                });
                CancelLike(eID);
            }else{
                setLikeTXT('Liked');
                setLikeBootstrap('danger');
                setLikes({
                    likeCount: likes.likeCount + 1
                });
                AddLike(eID);
            }
            setIsClicked(!isClicked);
        }else{ // 未登入
            alert('目前為訪客模式，登入後才能按愛心')
        }
    })   
    .catch(console.error);
  };
  const AddLike = async(eID) => {
    axios({
        method: "get",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=AddLike&eID="+eID,
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
  const CancelLike = async(eID) => { 
    axios({
        method: "get",
        url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=CancelLike&eID="+eID,
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
    <>
        <Button variant={likeBootstrap} onClick={ handleClick }>
            <span className="likes-counter">{ `❤ ${likeTXT} | ${likes.likeCount}` }</span>
        </Button>
    </>
  )
};

export default LikeButton;