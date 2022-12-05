import React, { useState, useEffect } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import "./index.css";

const EditInfo = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [state, setState] = useState([]); // 原本的基本資料
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    intro: "",
    gender: "",
    photo: ""
  });
  const [closeImg, setcloseImg] = useState(true); // 換掉原本的大頭照
  useEffect(() => {
    axios({
      method: "get",
      url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyInfo",
      dataType: "JSON",
      withCredentials: true
    })
      .then((res) => {
        setData(res.data);
        setState(res.data);
      })
      .catch(console.error);
  }, []);

  // 將表單輸入資料更新為當前輸入值
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  // 將當前大頭照改成上傳的大頭照(預覽)
  const onImageChange = (event) => {
    setSelectedImage(event.target.files[0]); // 顯示圖片
    setcloseImg(false);
    setData({ ...data, [event.target.name]: event.target.value }); // 更新表單資訊
  }

  // reset 鍵
  const clearChange = () => {
    removeImageChange();
    setData(state);
  }

  // 移除上傳照片
  const removeImageChange = () => {
    setData({ ...data, photo_new: "" });
    setSelectedImage('');
    setcloseImg(true);
  }

  // 送出表單
  const submitForm = (e) => {
    e.preventDefault();
    const sendData = new FormData();
    sendData.append('photoLink', data.photo);
    sendData.append('first_name', data.first_name);
    sendData.append('last_name', data.last_name);
    sendData.append('intro', data.intro);
    sendData.append('gender', data.gender);
    if ((selectedImage !== '')) {
      sendData.append('photo', selectedImage, data.photo_new);
    }
    axios({
      method: "post",
      url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=EditInfo",
      dataType: "JSON",
      data: sendData,
      withCredentials: true
    })
      .then((res) => {
        console.log(res);
        if (res.data.state === 'invalid') {
          alert(res.data.cause);
        } else {
          setSelectedImage('');
          alert(res.data.cause);
          window.location.reload();
          //window.location.replace("http://localhost:3000/myinfo");
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }
  return (
    <Form onSubmit={submitForm}>
      <Row className='d-flex'>
        <h1 className='text-center'>編輯我的基本資訊</h1>
        <Row>
          <h5><span style={{ color: '#d78559' }}>| </span>大頭照</h5>
          <Col sm={3}>
            <Form.Control className="photo ms-3" style={{ width: '200px' }} type="file" placeholder={`代表圖`}
              accept="image/*,.jpg,.png" onChange={onImageChange} name="photo_new" value={data.photo_new || ''}></Form.Control>
          </Col>
          <Col sm={9}>
            {
              selectedImage && (
                <>
                    <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedImage)} />
                    <Button variant="danger" onClick={removeImageChange}>移除相片</Button>
                </>
              )
            }
            {closeImg && (<img width={"250px"} src={data.photo || ''} alt={data.first_name} />)}
          </Col>
        </Row>
        <Row>
          <h5><span style={{ color: '#d78559' }}>| </span> 姓氏 </h5>
          <Form.Control className="first_name ms-4 w-75" type="text" placeholder={`姓氏`}
            onChange={handleChange} name="first_name" value={data.first_name}></Form.Control>
        </Row>

        <Row>
          <h5><span style={{ color: '#d78559' }}>| </span> 名字 </h5>
          <Form.Control className="last_name ms-4 w-75" type="text" rows={3} placeholder={`名字`}
            onChange={handleChange} name="last_name" value={data.last_name}></Form.Control>
        </Row>

        <Row>
          <h5><span style={{ color: '#d78559' }}>| </span> 性別 </h5>
          <Form.Check className="ms-4 col-md-2" type="checkbox"
            onChange={handleChange} name="gender" value="male" checked={data.gender === 'male'} label="男"
          ></Form.Check>
          <Form.Check className="ms-4 col-md-2" type="checkbox"
            onChange={handleChange} name="gender" value="female" checked={data.gender === 'female'} label="女"
          ></Form.Check>
        </Row>

        <Row>
          <h5><span style={{ color: '#d78559' }}>| </span>介紹 </h5>
          <Form.Control className="intro ms-4 w-75" as="textarea" placeholder={`介紹`}
            onChange={handleChange} name="intro" value={data.intro}>
          </Form.Control>
        </Row>
      </Row>
      <Row>
        <Col>
          <Button className="storage" type="submit" size="md" value="EditInfo" >儲存</Button>
        </Col>
        <Col>
          <Button style={{ width: '90pt' }} className="remove_btn" onClick={clearChange} size="md" >重置</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default EditInfo;