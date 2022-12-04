import React, {useState} from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ForgetPwd= () => {
    let history = useNavigate(); //use for Navigate on Previous
    const [data, setData] = useState({
        email:"",
        newpwd:"",
        newpwdAgain:""
    })
    const handleChange=(e)=>{
        setData({ ...data , [e.target.name]: e.target.value});   
    }
    const submitForm = (e)=>{
        e.preventDefault();
        const sendData = {
            email: data.email,
            newpwd: data.newpwd,
            newpwdAgain: data.newpwdAgain
        };
        console.log(sendData);
        axios.post('https://360.systemdynamics.tw/backendPHP/Control.php?act=ForgetPwd',sendData)//change
        .then((res) => {
            if(res.data.status === 'invalid'){
                alert(res.data.cause);
            }else{
                alert(res.data.cause);
                history(`/loginRegister`);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    return(
        <div className = "main-box">
            <form onSubmit={submitForm}>
                <div className="row d-flex w-100">
                    <div className="col-md-12 text-center"><h1>𝕱𝖔𝖗𝖌𝖊𝖙 𝖕𝖆𝖘𝖘𝖜𝖔𝖗𝖉</h1></div>
                </div>

                <div className="row d-flex w-100">
                    <div className="col-md-6 col-lg-4">email:</div>
                    <div className="col-md-6 col-lg-8">
                        <input type="email" name="email" className = "form-control" placeholder={`電子郵件`}
                        onChange={handleChange} value={data.email}
                        />
                    </div>
                </div>

                <div className="row d-flex w-100">
                    <div className="col-md-6 col-lg-4">new password:</div>
                    <div className="col-md-6 col-lg-8">
                        <input type="password" name="newpwd" className = "form-control" placeholder={`新密碼`}
                        onChange={handleChange} value={data.newpwd}
                        />
                    </div>
                </div>
                
                <div className="row d-flex w-100">
                    <div className="col-md-6 col-lg-4">new password(Again):</div>
                    <div className="col-md-6 col-lg-8">
                        <input type="password" name="newpwdAgain" className = "form-control" placeholder={`新密碼確認`}
                        onChange={handleChange} value={data.newpwdAgain}
                        />
                    </div>
                </div>

                <div className="row d-flex w-100">
                    <div className="col-md-12 text-center">
                        <input type="submit" name="submit" value = "更改密碼" className = "btn btn-outline-info"/>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ForgetPwd;