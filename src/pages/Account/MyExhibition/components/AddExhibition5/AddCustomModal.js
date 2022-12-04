import React , {useState} from 'react';
import ReactPannellum from "react-pannellum";
import { Container, Modal, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import ChooseMyItem from './ChooseMyItem.js';
import ChoosePublicItem from './ChoosePublicItem.js';

const AddCustomModal = (props) => {
    const { customAddModalShow } = props;
    const { setCustomAddModalShow } = props;
    const { failtxt } = props;
    const { setFailtxt } = props;
    const { customSpot } = props;
    const { setCustomSpot } = props;
    const { customSpotsArray } = props;
    const { setCustomSpotsArray } = props;
    const { fakeHotspotID } = props;
    const { setFakeHotspotID } = props;
    const { setCustomSpotUI } = props;
    const [method , setMethod] = useState("myItem");
    const [checkedState, setCheckedState] = useState([]);//用陣列存複數個核取方塊
    const [publicCheckedState, setPublicCheckedState] = useState([]);
    const [myItemList, setMyItemList] = useState(null); // start with an empty array
    const [publicItemList, setPublicItemList] = useState(null);
    const submitCustomForm = (e) => {
        e.preventDefault();
        var newCustomSpotsArray = customSpotsArray;
        var newCustomSpot = customSpot;
        var pass = false;
        if(method === "myItem"){
            for(let i=0;i<=checkedState.length-1;i++){
                if(checkedState[i] === true){
                    newCustomSpot.iID = myItemList[i].iID;
                    newCustomSpot.itemName = myItemList[i].name;
                    newCustomSpot.itemIntro = myItemList[i].intro;
                    newCustomSpot.ownerID = myItemList[i].ownerID;
                    newCustomSpot.authorName = myItemList[i].authorName;
                    newCustomSpot.imageLink =  myItemList[i].imgLink;
                    newCustomSpot.modelLink =  myItemList[i].modelLink;
                    newCustomSpot.musicLink =  myItemList[i].musicLink;
                    pass = true;
                    break;
                }
            }
        }else if(method === "PublicItem"){
            for(let i=0;i<=publicCheckedState.length-1;i++){
                if(publicCheckedState[i] === true){
                    newCustomSpot.iID =publicItemList[i].iID;
                    newCustomSpot.itemName = publicItemList[i].name;
                    newCustomSpot.itemIntro = publicItemList[i].intro;
                    newCustomSpot.ownerID = publicItemList[i].ownerID;
                    newCustomSpot.authorName = publicItemList[i].authorName;
                    newCustomSpot.imageLink =  publicItemList[i].imgLink;
                    newCustomSpot.modelLink =  publicItemList[i].modelLink;
                    newCustomSpot.musicLink =  publicItemList[i].musicLink;
                    pass = true;
                    break;
                }
            }
        }
        if(pass){
            newCustomSpot.id = fakeHotspotID + "h";
            newCustomSpot.pitch = customSpot.pitch;
            newCustomSpot.yaw = customSpot.yaw;
            newCustomSpot.imageWidth = customSpot.imageWidth;
            newCustomSpot.imageHeight = customSpot.imageHeight;
            newCustomSpot.currentSceneID = customSpot.currentSceneID;
            newCustomSpot.currentSceneName = customSpot.currentSceneName;
            newCustomSpotsArray = newCustomSpotsArray.concat(newCustomSpot);
            setCustomSpotsArray(newCustomSpotsArray);
            let hs = {
                id: fakeHotspotID.toString() + "h",
                pitch: customSpot.pitch,
                yaw: customSpot.yaw,
                scale: true,
                "createTooltipFunc": setCustomSpotUI,
                "createTooltipArgs": { "id": fakeHotspotID.toString()+"h","txt": newCustomSpot.itemName, "img":newCustomSpot.imageLink ,"customObject": newCustomSpot}
            }
            ReactPannellum.addHotSpot(hs, customSpot.currentSceneID);
            setFailtxt("");
            setFakeHotspotID(fakeHotspotID + 1);
            setCustomAddModalShow(false);
            setCustomSpot({ //存新增的客製化展品點資料的表單
                id: "",
                iID:"",
                currentSceneID: "",
                currentSceneName: "",
                pitch: 0,
                yaw: 0,
                itemName:"",
                itemIntro:"",
                ownerID:"",
                authorName:"",
                imageLink:"",
                imageWidth:"100px",
                imageHeight:"100px",
                modelLink:"",
                musicLink: ""
            });
            setMethod("myItem");
        }else{
            setFailtxt("注意: 請選擇一個展品放入");
        }
    }
    const openNewWindow = () => { //另外開一個視窗上傳本機展品
        let config = 'height=1000,width=1000';
        window.open('/myItem', 'Upload item from device', config);//開一個新視窗
    }
    const handleSelect= (eventkey) => {//選哪一種方式要記錄起來
        setMethod(eventkey);
    }
    return (
        <>
            <Modal
                show={customAddModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        新增一個客製化展品點
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={submitCustomForm}>
                        <Container>
                            <Row>
                                <Col>目前場景</Col>
                                <Col>
                                    <input type="text" name="currentSceneName" className="form-control" value={customSpot.currentSceneName} disabled />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>目前的Pitch</Col>
                                <Col>
                                    <input type="text" name="pitch" className="form-control" value={customSpot.pitch} disabled />
                                </Col>
                                <Col>目前的Yaw</Col>
                                <Col>
                                    <input type="text" name="yaw" className="form-control" value={customSpot.yaw} disabled />
                                </Col>
                            </Row>
                            <br />
                            <Row className='d-flex justify-content-center'>
                                <Button onClick={openNewWindow} className="update_btn" style={{width:"1000pt"}}> 另開視窗上傳展品 </Button>
                            </Row>
                            <br />
                            <Tabs defaultActiveKey="MyItem" id="tab" className="mb-3" onSelect={handleSelect} fill>
                                <Tab eventKey="MyItem" title="選擇自己的展品" >                     
                                    <ChooseMyItem myItemList={myItemList} setMyItemList = {setMyItemList} checkedState={checkedState}
                                    setCheckedState={setCheckedState} setFailtxt={setFailtxt} setCustomAddModalShow={setCustomAddModalShow}/>
                                </Tab>
                                <Tab eventKey="PublicItem" title="選擇公開的展品" >
                                    <ChoosePublicItem publicItemList={publicItemList} setPublicItemList = {setPublicItemList} publicCheckedState={publicCheckedState}
                                    setPublicCheckedState={setPublicCheckedState} setFailtxt={setFailtxt} setCustomAddModalShow={setCustomAddModalShow}/>
                                </Tab>
                            </Tabs>
                            <br />
                            <Row>
                                <input type="submit" name="submit" value="加入客製化展品點" className="update_btn" />
                            </Row>
                        </Container>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{ color: 'red' }}>{failtxt}</p>
                    <Button className="cancel_btn" onClick={() => {
                        setMethod("myItem");
                        setFailtxt("");
                        setCustomAddModalShow(false);
                        setCustomSpot({});
                    }}> 取消 </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default AddCustomModal;