import { Button, Row, Col } from 'react-bootstrap';
import '../index.css';
import React from 'react';
import ExProgressBar from './ExProgressBar';
import RuleOffcanvas1 from './rule/RuleOffcanvas1';

const AddEx1 = (props) => {
  const now = 0;
  const { data } = props;
  const { setData } = props;
  const onChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  }
  const onFileChange = (event) => {
    if (((event.target.files[0].type === "image/png") || (event.target.files[0].type === "image/jpeg"))) {
      setData({ ...data, [event.target.name]: event.target.value, [event.target.name + "File"]: event.target.files[0] });//顯示圖片
    } else {
      alert("格式輸入錯誤!!!");
    }
  }
  return (
    <div>
      <h2 className="text-center">一、展場資訊</h2>
      <div className="helpRuleButton">
        <RuleOffcanvas1 />
      </div>
      <ExProgressBar now={now} />{/* 進度條 */}
      <Row className='d-flex justify-content-center m-3'>
        <Row className='w-75'>
          <Col>
            <h5><span style={{ color: '#d78559' }}>| </span> 展場名稱 <span style={{ color: "red" }}>*</span></h5>
          </Col>
          <Col className='w-50'>
            <input type="text" name="exhibitionName" className="form-control mb-2" placeholder={`展場名稱`} onChange={onChange} value={data.exhibitionName} />
          </Col>
        </Row>
        <Row className='w-75'>
          <Col>
            <h5><span style={{ color: '#d78559' }}>| </span> 展場描述 <span style={{ color: "red" }}>*</span></h5>
          </Col>
          <Col className='w-75'>
            <textarea type="textarea" name="eIntro" className="form-control mb-2" placeholder={`展場描述`} onChange={onChange} value={data.eIntro} />
          </Col>
        </Row>
        <Row className='w-75'>
          <Col>
            <h5><span style={{ color: '#d78559' }}>| </span> 開放時間 <span style={{ color: "red" }}>*</span></h5>
          </Col>
          <Col>
            <input type="date" name="startTime" className="form-control mb-2" onChange={onChange} value={data.startTime} />
          </Col>
        </Row>
        <Row className='w-75'>
          <Col>
            <h5><span style={{ color: '#d78559' }}>| </span> 結束時間 <span style={{ color: "red" }}>*</span></h5>
          </Col>
          <Col>
            <input type="date" name="closeTime" className="form-control mb-2" onChange={onChange} value={data.closeTime} />
          </Col>
        </Row>
        <Row className='w-75'>
          <Col>
            <h5><span style={{ color: '#d78559' }}>| </span> 權限管理 <span style={{ color: "red" }}>*</span></h5>
          </Col>
          <Col>
            <select type="dropdown" name="permission" className="form-control mb-2" onChange={onChange} value={data.permission}>
              <option> 請選擇以下權限 </option>
              <option value="public"> 公開 </option>
              <option value="private"> 私人 </option>
              <option value="subscribeOnly"> 只限訂閱者 </option>
            </select>
          </Col>
        </Row>
        <Row className='w-75'>
          <Col>
            <h5><span style={{ color: '#d78559' }}>| </span> 展場封面圖 <span style={{ color: "red" }}>*</span></h5>
          </Col>
          <Col>
            <input type="file" name="frontPicture" className="form-control mb-2" onChange={onFileChange} accept="image/*,.jpg,.png" value={data.frontPicture} />
            {
              data.frontPictureFile && (
                <Row className='d-flex p-0'>                  
                    <img alt="not found" className="mb-2" width={"250px"} src={URL.createObjectURL(data.frontPictureFile)} />                                    
                    <Button className="remove_btn" onClick={() => {
                      setData({ ...data, frontPicture: "", frontPictureFile: null });
                    }}> 移除 </Button>                  
                </Row>
              )}
          </Col>
        </Row>
        <Row className='w-75'>
          <Col>
            <h5><span style={{ color: '#d78559' }}>| </span> 展場封面圖2 </h5>
          </Col>
          <Col>
            <input type="file" name="picture2" className="form-control mb-2" onChange={onFileChange} value={data.picture2} accept="image/*,.jpg,.png" />
            {
              data.picture2File && (
                <Row className='d-flex p-0'>
                    <img src={URL.createObjectURL(data.picture2File)} className="mb-2" width={"250px"} alt="not found" />
                    <Button className='remove_btn' onClick={() => {
                      setData({ ...data, picture2: "", picture2File: null });
                    }}> 移除 </Button>
                </Row>
              )
            }
          </Col>
        </Row>
        <Row className='w-75'>
          <Col>
            <h5><span style={{ color: '#d78559' }}>| </span> 展場封面圖3 </h5>
          </Col>
          <Col>
            <input type="file" name="picture3" className="form-control mb-2" onChange={onFileChange} value={data.picture3} accept="image/*,.jpg,.png" />
            {
              data.picture3File && (
                <Row className='d-flex p-0'>
                    <img src={URL.createObjectURL(data.picture3File)} className="mb-2" width={"250px"} alt="not found" />
                    <Button className='remove_btn' onClick={() => {
                      setData({ ...data, picture3: "", picture3File: null });
                    }}> 移除 </Button>
                </Row>
              )
            }
          </Col>
        </Row>
      </Row>
    </div>
  );
}

export default AddEx1;

