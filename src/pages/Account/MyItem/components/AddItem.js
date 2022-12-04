import React, { useState } from 'react';
import { Form, Container, Row, Col, Button, Spinner} from 'react-bootstrap';
import axios from 'axios';

function AddItem() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selected3D, setSelected3D] = useState(null);
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        intro: "",
        img2D: "",
        object3D: "",
        musicLink: "",
        permission: "private",
    })
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        //console.log(data);
    }
    const onImageChange = (event) => {
        //console.log(event.target.files[0]);
        setData({ ...data, [event.target.name]: event.target.value }); //更新表單資訊
        setSelectedImage(event.target.files[0]);//顯示圖片
        //console.log(URL.createObjectURL(event.target.files[0]));
    }
    const on3DChange = (event) => {
        //console.log(event.target.files[0]);
        setData({ ...data, [event.target.name]: event.target.value });//更新表單資訊
        setSelected3D(event.target.files[0]);//顯示圖片
        console.log(event.target.files[0]);
        //console.log(URL.createObjectURL(event.target.files[0]));
    }
    const onMusicChange = (event) => {
        console.log(event.target.files[0]);
        setData({ ...data, [event.target.name]: event.target.value });//更新表單資訊
        setSelectedMusic(event.target.files[0]);//顯示圖片
        //console.log(URL.createObjectURL(event.target.files[0]));
    }
    const submitForm = (e) => {
        e.preventDefault();
        const sendData = new FormData();
        if ((selectedImage !== null) && (selected3D !== null) && (data.name !== null) && (data.intro !== null) && (data.permission !== null)) {
            setIsLoading(true);
            sendData.append('img2D', selectedImage, data.img2D); //append(name, value, filename)
            sendData.append('object3D', selected3D, data.object3D);

            if (selectedMusic !== null) {
                sendData.append('musicLink', selectedMusic, data.musicLink);
            } else {
                sendData.append('musicLink', null);
            }
            sendData.append('name', data.name);
            sendData.append('intro', data.intro);
            sendData.append('permission', data.permission);
            for (var pair of sendData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            axios({
                method: "post",
                url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=AddItem",
                dataType: "JSON",
                data: sendData,
                withCredentials: true
            })
                .then((res) => {
                    console.log(res.data);
                    if (res) {
                        if (res.data.state === 'invalid') {
                            alert(res.data.cause);
                        } else {
                            setSelectedImage(null);
                            setSelected3D(null);
                            alert(res.data.cause);
                            window.location.reload();
                        }
                    }
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                })
        } else {
            alert("表單除語音外不可有空值");
        }
    }
    return (
        <Form onSubmit={submitForm}>
            <Container>
                <Row className='pb-3'>
                    <Col> 展品名稱 <span style={{ color: "red" }}> * </span></Col>
                    <Col>
                        <Form.Control className="name col-md-6 mb-3" type="text" placeholder={`展品名稱`}
                            onChange={handleChange} name="name" value={data.name}></Form.Control>
                    </Col>
                </Row>
                <Row className='pb-3'>
                    <Col> 展品圖片上傳 <span style={{ color: "red" }}> * </span></Col>
                    <Col>
                        <Form.Control className="img2D mb-3" type="file" accept="image/*,.jpg,.png"
                            onChange={onImageChange} name="img2D" value={data.img2D}></Form.Control>
                    </Col>
                </Row>
                <Row>
                    {
                        selectedImage && (
                            <div>
                                <div>
                                    <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedImage)} />
                                </div>
                                <div className='mt-3 mb-3'>
                                    <Button className="remove_btn" onClick={() => {
                                        setData({ ...data, img2D: "" });
                                        setSelectedImage(null);
                                    }}> 移除 </Button>
                                </div>
                            </div>
                        )}
                </Row>
                <Row className='pb-3'>
                    <Col> 展品介紹 <span style={{ color: "red" }}> * </span></Col>
                    <Col>
                        <Form.Control className="intro mb-3" as="textarea" rows={3} placeholder={`展品介紹`}
                            onChange={handleChange} name="intro" value={data.intro}></Form.Control>
                    </Col>
                </Row>
                <Row className='pb-3'>
                    <Col> 3D模型 <span style={{ color: "red" }}> * </span></Col>
                    <Col>
                        <Form.Control className="object3D mb-3" type="file"
                            onChange={on3DChange} name="object3D" value={data.object3D}></Form.Control>
                    </Col>
                </Row>
                <Row>
                    {
                        selected3D && (
                            <div>
                                <Button className="remove_btn" onClick={() => {
                                    setData({ ...data, object3D: "" });
                                    setSelected3D(null);
                                }}> 移除 </Button>
                            </div>
                        )}
                </Row>
                <Row className='pb-3'>
                    <Col> 展品語音(可選) </Col>
                    <Col>
                        <Form.Control className="musicLink mb-3" type="file" placeholder={`展品語音`}
                            accept="audio/*" onChange={onMusicChange} name="musicLink" value={data.musicLink}></Form.Control>
                    </Col>
                </Row>
                <Row>
                    {
                        selectedMusic && (
                            <div>
                                <audio src={URL.createObjectURL(selectedMusic)} controls></audio>
                                <Button className="remove_btn" onClick={() => {
                                    setData({ ...data, musicLink: "" });
                                    setSelectedMusic(null);
                                }}> 移除 </Button>
                            </div>
                        )
                    }
                </Row>
                <Row className='pb-3'>
                    <Col> 存取權限 </Col>
                    <Col>
                        <Form.Check className="col-md-2" type="checkbox"
                            onChange={handleChange} name="permission" value="public" checked={data.permission === 'public'} label="公開"
                        ></Form.Check>
                        <Form.Check className="col-md-2" type="checkbox"
                            onChange={handleChange} name="permission" value="private" checked={data.permission === 'private'} label="私人"
                        ></Form.Check></Col>
                </Row>
                <Row>
                    {
                        (isLoading)&&(
                            <Spinner className='text-center' animation="border" variant="dark" />
                        )
                    }       
                </Row>
                <div className='text-center'>
                    <Button className='update_btn' type="submit" size="md" value="AddItem"> 確認 </Button>&nbsp;
                    <Button style={{ width: '90pt' }} variant="danger" size="md" onClick={
                        () => {
                            setData({
                                name: "",
                                intro: "",
                                img2D: "",
                                object3D: "",
                                musicLink: "",
                                permission: "private",
                            });
                            setSelectedImage(null);
                            setSelected3D(null);
                            setSelectedMusic(null);
                        }
                    }> 重置 </Button>
                </div>
            </Container >
        </Form >
    )
}

export default AddItem;