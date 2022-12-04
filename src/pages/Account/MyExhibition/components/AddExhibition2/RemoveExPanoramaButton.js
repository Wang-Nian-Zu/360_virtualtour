import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const RemoveExPanoramaButton = (props) => {
    let history = useNavigate(); //use for Navigate on Previous
    const { index } = props;
    const { currentPage } = props;
    const { postsPerPage } = props;
    const { data } = props;
    const {setData} = props;
    const {moveSpotsArray} = props;
    const {setMoveSpotsArray} = props;
    const {infoSpotsArray} = props;
    const {setInfoSpotsArray} = props;
    const {customSpotsArray} = props;
    const {setCustomSpotsArray} = props;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleDelete = () => {    
        setShow(false); 
        var NewMyPanoramaList = data.myPanoramaList;
        var deleteFakeID = NewMyPanoramaList[index+((currentPage-1)*postsPerPage)].fakeID;
        var newMoveSpotsArray = moveSpotsArray;
        if(moveSpotsArray.length !== 0){
            for(let i = 0 ; i < newMoveSpotsArray.length;){
                if((newMoveSpotsArray[i].currentSceneID === deleteFakeID.toString())||(newMoveSpotsArray[i].destinationID === deleteFakeID.toString())){
                    newMoveSpotsArray.splice(i,1);  //刪除位於該全景圖的移動點 或是 有移動到此全景圖的移動點
                }else{
                    i++; //只有在沒有刪除元素時才對索引 i++
                }
            }
        }
        setMoveSpotsArray(newMoveSpotsArray);
        var newInfoSpotsArray = infoSpotsArray;
        if(infoSpotsArray.length !== 0){
            for(let i = 0 ; i < newInfoSpotsArray.length;){
                if(newInfoSpotsArray[i].currentSceneID === deleteFakeID.toString()){
                    newInfoSpotsArray.splice(i,1);  //刪除位於該全景圖的資訊點
                }else{
                    i++; //只有在沒有刪除元素時才對索引 i++
                }
            }
        }
        setInfoSpotsArray(newInfoSpotsArray);

        var newCustomSpotsArray = customSpotsArray;
        if(infoSpotsArray.length !== 0){
            for(let i = 0 ; i < newCustomSpotsArray.length;){
                if(newCustomSpotsArray[i].currentSceneID === deleteFakeID.toString()){
                    newCustomSpotsArray.splice(i,1);  //刪除位於該全景圖的客製化展品點
                }else{
                    i++; //只有在沒有刪除元素時才對索引 i++
                }
            }
        }
        setCustomSpotsArray(newCustomSpotsArray);

        NewMyPanoramaList.splice(index+((currentPage-1)*postsPerPage),1); //刪除位於myPanoramaList陣列index位置的展場
        if((NewMyPanoramaList.length === 0)||(deleteFakeID === data.firstScene)){//如果全景圖刪光了，或者初始場景被刪除了
            setData({...data, myPanoramaList: NewMyPanoramaList, firstScene: -1});//初始場景設回-1
        }else{
            setData({...data, myPanoramaList: NewMyPanoramaList});
        }
        alert("成功從展場移除此全景圖!");
    };
    const handleClick = () => {
        axios({ //isLogin()//先判斷是否登入，才能去紀錄使用者按下喜歡行為
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
        .then((res) => {
            if (res.data.Login) {//有登入
                setShow(true);
            } else {//未登入
                alert('Error: Session has been lost!!!');
                history('/loginRegister');
            }
        })
        .catch(console.error);
    }
    return (
        <>
            <div className="btn d-flex justify-content-end" style={{border:"none", fontSize:"20px", color:"#e38970"}} onClick={handleClick}>✕</div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>確認移除全景圖</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    你確定要從此展場移除這個全景圖嗎 ?
                    <span style={{ color: '#e38970' }}>&nbsp;(刪除之後將無法復原) </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete}>刪除</Button>
                    <Button className="cancel_btn" onClick={handleClose}>取消</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default RemoveExPanoramaButton;