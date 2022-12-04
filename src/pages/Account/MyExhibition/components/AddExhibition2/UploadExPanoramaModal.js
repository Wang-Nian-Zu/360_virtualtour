/*

目前沒有用到這個js了，想說還是保存一下

*/
import { Button, Modal} from 'react-bootstrap';
import React, { useState,useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const UploadExPanoramaModal = (props) => {
    const { data } = props;
    const { setData } = props;
    const {fakeID} = props;
    const {setFakeID} = props;
    const {uploadNewScene} = props;
    const {setUploadNewScene} = props;
    useEffect(() => {
        console.log(data);
    }, [data]);
    const [Modalfailtxt, setModalFailtxt] = useState(""); 
    const [exPanorama, setExPanorama] = useState({ //先暫存單一全景圖資訊
        panoramaName: "",
        imgLink: "",
        imgLinkFile: null,
        smallimgLink: "",
        smallimgLinkFile: null,
        music: "",
        musicFile: null
    });
    const handleChange = (event) => {
        setExPanorama({ ...exPanorama, [event.target.name]: event.target.value });//更新表單資訊
    }
    const onFileChange = (event) => {
        if (((event.target.name === "imgLink") || (event.target.name === "smallimgLink")) && ((event.target.files[0].type === "image/png") || (event.target.files[0].type === "image/jpeg"))) {
            setExPanorama({ ...exPanorama, [event.target.name]: event.target.value, [event.target.name + "File"]: event.target.files[0] });//顯示圖片
        } else if ((event.target.name === "music") && (event.target.files[0].type === "audio/mpeg")) {
            setExPanorama({ ...exPanorama, [event.target.name]: event.target.value, [event.target.name + "File"]: event.target.files[0] });//顯示影片
        } else {
            alert("格式輸入錯誤!!!");
        }
    }
    const submitForm = (e) => {
        e.preventDefault();
        var ExPanoramaData = {};
        if ((exPanorama.imgLinkFile !== null) && (exPanorama.panoramaName !== "")) {
            ExPanoramaData.fakeID = fakeID ;
            setFakeID(fakeID+1);
            ExPanoramaData.method = "UploadFromDevice";//紀錄此全景圖是用本機上傳方式
            ExPanoramaData.panoramaName = exPanorama.panoramaName;
            ExPanoramaData.imgLink =  exPanorama.imgLinkFile; //append(name, value, filename)
            if ((exPanorama.smallimgLinkFile !== null)) {//縮圖為可選擇上傳項目
                ExPanoramaData.smallimgLink =  exPanorama.smallimgLinkFile;
            }else{
                ExPanoramaData.smallimgLink = null;
            }
            if ((exPanorama.musicFile !== null)) {//導覽語音為可選擇上傳項目
                ExPanoramaData.music =  exPanorama.musicFile;
            }else{
                ExPanoramaData.music = null;
            }
            setData({ ...data, myPanoramaList: data.myPanoramaList.concat(ExPanoramaData)});
            //這裡要用concat()，不能用push
            clearModal();
            setUploadNewScene(false);
        } else {
            setModalFailtxt("*為必填選項，不能空白");
        }
    }
    const clearModal = () => {
        setExPanorama({
            panoramaName: "",
            imgLink: "",
            imgLinkFile: null,
            smallimgLink: "",
            smallimgLinkFile: null,
            music: "",
            musicFile: null
        });
        setModalFailtxt("");
    }
    return (
        <>
            {/* 1.本機上傳全景圖的彈出式視窗 */}
            < Modal
                show={uploadNewScene}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    從本機裝置上傳全景圖
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form onSubmit={submitForm}>
                    <Container>
                        <Row>
                            <Col>全景圖名稱<span style={{ color: "red" }}>*</span></Col>
                            <Col>
                                <input type="text" name="panoramaName" className="form-control"
                                    onChange={handleChange} value={exPanorama.panoramaName} />
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>全景圖片上傳<span style={{ color: "red" }}>*</span></Col>
                            <Col>
                                <input type="file" name="imgLink" className="form-control"
                                    accept="image/*,.jpg,.png" onChange={onFileChange} value={exPanorama.imgLink} />
                            </Col>
                        </Row>
                        <Row>
                            {
                                exPanorama.imgLinkFile && (
                                    <div><img alt="not found" width={"250px"} src={URL.createObjectURL(exPanorama.imgLinkFile)} />
                                        <br />
                                        <Button variant="danger" onClick={() => {
                                            setExPanorama({ ...exPanorama, imgLink: "", imgLinkFile: null });
                                        }}>Remove</Button>
                                    </div>
                                )
                            }
                        </Row>
                        <Row>
                            <Col>底部圖上傳(可選)</Col>
                            <Col>
                                <input type="file" name="smallimgLink" className="form-control"
                                    accept="image/*,.jpg,.png" onChange={onFileChange} value={exPanorama.smallimgLink} />
                            </Col>
                        </Row>
                        <Row>
                            {
                                exPanorama.smallimgLinkFile && (
                                    <div><img alt="not found" width={"250px"} src={URL.createObjectURL(exPanorama.smallimgLinkFile)} />
                                        <br />
                                        <Button variant="danger" onClick={() => {
                                            setExPanorama({ ...exPanorama, smallimgLink: "", smallimgLinkFile: null });
                                        }}>Remove</Button>
                                    </div>
                                )
                            }
                        </Row>
                        <Row>
                            <Col>上傳導覽語音(可選)</Col>
                            <Col>
                                <input type="file" name="music" className="form-control"
                                    accept="audio/mpeg" onChange={onFileChange} value={exPanorama.music} />
                            </Col>
                        </Row>
                        <Row>
                            {
                                exPanorama.musicFile && (
                                    <div><audio alt="not found" width={"250px"} src={URL.createObjectURL(exPanorama.musicFile)} controls />
                                        <br />
                                        <Button variant="danger" onClick={() => {
                                            setExPanorama({ ...exPanorama, music: "", musicFile: null });
                                        }}>Remove</Button>
                                    </div>
                                )
                            }
                        </Row>
                        <Row>
                            <input type="submit" name="submit" value="新增至展場" className="btn btn-info" />
                        </Row>
                    </Container>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <p style={{ color: 'red' }}>{Modalfailtxt}</p>
                <Button className="cancel_btn" onClick={() => {
                    clearModal();
                    setUploadNewScene(false);
                }}>關閉</Button>
            </Modal.Footer>
        </Modal >
</>
    );
}
export default UploadExPanoramaModal;