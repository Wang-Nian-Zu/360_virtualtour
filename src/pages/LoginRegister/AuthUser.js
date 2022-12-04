import { useState, useEffect } from "react";
import axios from 'axios';

function useAuth() {
    
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState("訪客");

    const isAuth = async () => {
        axios({
            method: "get",
            url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin",
            dataType: "JSON",
            withCredentials: true
        })
        .then((res) => {
            if (res.data.Login) { //有登入
                setAuth(true);
                axios({
                    method: "get",
                    url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=getUsername",
                    dataType: "JSON",
                    withCredentials: true
                })
                .then((res) =>{
                    //console.log(res.data);
                    setUser(res.data.username);
                })
                .catch(console.error);
            } else {//未登入
                setAuth(false);
            }
        })
        .catch(console.error);
    }

    useEffect(() => {
        //console.log(auth);
        isAuth();
    }, [auth])

    return {
        auth: auth,
        user: user
    }
}
export default useAuth;