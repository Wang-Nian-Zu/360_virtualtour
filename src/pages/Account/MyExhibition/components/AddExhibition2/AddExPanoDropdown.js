import { Dropdown } from 'react-bootstrap';
import React, { useState } from 'react';
//import UploadExPanoramaModal from './UploadExPanoramaModal';
import ChooseMySceneModal from './ChooseMySceneModal';
import ChoosePublicSceneModal from './ChoosePublicSceneModal';


const AddExPanoDropdown = (props) => {
    const {data} = props;
    const { setData } = props;
    const { fakeID } = props;
    const { setFakeID } = props;
    
    //const [uploadNewScene, setUploadNewScene] = useState(false); // 上傳全景圖
    const handleShow1 = () => {
        let config = 'height=1000,width=1000';
        window.open('/myPanorama', 'Upload item from device', config);//開一個新視窗
    };
   
    const [chooseMyScene, setChooseMyScene] = useState(false); // 選自己全景圖庫
    const handleShow2 = () => setChooseMyScene(true);

    const [choosePublicScene, setChoosePublicScene] = useState(false); // 選公開全景圖庫
    const handleShow3 = () => setChoosePublicScene(true);
    
    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle id="addPanorama" className="mb-3">
                    新增全景圖
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={handleShow1}>從本機上傳全景圖</Dropdown.Item>
                    <Dropdown.Item onClick={handleShow2}>從自己的全景圖庫挑選</Dropdown.Item>
                    <Dropdown.Item onClick={handleShow3}>從公開全景圖庫挑選</Dropdown.Item>
                </Dropdown.Menu>
                <p>※至多新增 20 張全景圖</p>
            </Dropdown>
            {
                /*(uploadNewScene)&&(<UploadExPanoramaModal data={data} setData={setData} fakeID = {fakeID} setFakeID = {setFakeID}
                    uploadNewScene={uploadNewScene} setUploadNewScene={setUploadNewScene} />)*/
            }
            {
                (chooseMyScene)&&(<ChooseMySceneModal data={data} setData={setData} fakeID = {fakeID} setFakeID = {setFakeID}
                    chooseMyScene={chooseMyScene} setChooseMyScene={setChooseMyScene} />)
            }
            {
                (choosePublicScene)&&(<ChoosePublicSceneModal data={data} setData={setData} fakeID = {fakeID} setFakeID = {setFakeID}
                    choosePublicScene={choosePublicScene} setChoosePublicScene={setChoosePublicScene} />)
            }
        </div>
    );
}

export default AddExPanoDropdown;