<?php
require('Model.php');

if(isset($_REQUEST['act'])){
    $act = $_REQUEST['act'];
}else{
    $act = '';
}

switch ($act) { //用switch語法，判斷act這個變數要做哪件事
    case "logout":
        $_SESSION["userID"] = "";
        $retArr = array();
        $retArr["sessionIsClean"] = true;
        echo json_encode($retArr);
        break;
    case "getUsername":
        $retArr = array();
        if(isset($_SESSION["userID"]) && $_SESSION["userID"] != "" ){
            $retArr["username"] = getUsername($_SESSION["userID"]);
        }else{
            $retArr["username"] = "Visitor";
        }
        echo json_encode($retArr);
        break;
    case "isLogin": //檢查使用者有沒有login
        $isLogin = array();
        $isLogin["Login"] = true;
        if( !isset($_SESSION["userID"]) || $_SESSION["userID"] === ''){ //session未定義或者是空值時
            $isLogin["Login"] = false; //表示沒有登入過
            echo json_encode($isLogin);
            break;
        }else{
            $isLogin["session"] = $_SESSION["userID"];
        }
        echo json_encode($isLogin);
        break;

    case "loginCheck": //檢查登入(用戶名不能重複且不能為空)
        $_SESSION["userID"] = ""; //將session清空
        $json = json_decode(file_get_contents("php://input")); //json_decode第二個參數加上true會變成返回陣列，否者返回物件
        $email = $json->email;
        $pwd = $json->password;
        $response = array();
        if ((isset($email))&(isset($pwd))&($email != "")&($pwd != "")) { //白手套的概念，先確認id大於一，再將它導入函數
            if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
                $response["status"] = "invalid";
                $response["cause"] = "{$email}: A valid email"."<br>";
                echo json_encode($response);
                break;
            }else if(loginCheck($email, $pwd)){
                $response["status"] = "valid";
                $response["cause"] = "登入成功!!!";
                $response["username"] = getUsername($_SESSION["userID"]);
                echo json_encode($response);
                break;
            }else{
                $response["status"] = "invalid";
                $response["cause"] = "用戶名或密碼錯誤";
                echo json_encode($response);
                break;
            }
        }else{
            $response["status"] = "invalid";
            $response["cause"] = "用戶名或密碼不能為空值";
            echo json_encode($response);
            break;
        }
        break;
    
    case "addMember": 
        $json = json_decode(file_get_contents("php://input")); //json_decode第二個參數加上true會變成返回陣列，否者返回物件
        
        $first_name = $json->first_name;
        $last_name = $json->last_name;
        $pwd = $json->password;
        $email = $json->email;
        $gender =$json->gender;
        $intro = $json->intro;
        $photo = $json->photo;
        
        $response = array();
        if ((isset($first_name))&(isset($last_name))&(isset($pwd))&(isset($email))&(isset($gender))&(isset($photo))&($first_name != "")&($last_name != "")&($pwd != "")&($email != "")&($gender != "")&($photo != "")) { 
            //防呆，一樣做簡單邏輯判斷，當title不是空的，再將它導入函數
            if(filter_var($email, FILTER_VALIDATE_EMAIL) != true){
                //$message = "輸入無效的電子郵件";
                $response['status']='invalid';
                $response['cause']='輸入無效的電子郵件';
                echo json_encode($response);
            }elseif(addMember($first_name,$last_name,$pwd,$email,$gender,$intro,$photo)){
                //$message = "註冊成功";
                $response['status']='valid';
                $response['cause']='註冊成功';
                echo json_encode($response);
            }else{
                //$message = "此用戶帳號已經被註冊過了";
                $response['status']='invalid';
                $response['cause']='此用戶電子郵件已經被註冊過了';
                echo json_encode($response);
            }
        }else{
            //$message = "表單不能有空值";
            $response['status']='invalid';
            $response['cause']='表單不能有空值';
            echo json_encode($response);
        }
        break;
//Exhibition-----------------------------------------------------------------------------------------------------
    case "getExhibitionList":
        $list = getExhibitionList(); // 從Model端得到未完成工作清單
        echo json_encode($list); //將陣列變成JSON字串傳回
        break; 

    case "getExhibitionData":
        if(isset($_REQUEST['eID'])){
            $eID = $_REQUEST['eID'];
        }else{
            $eID = '';
        }
        $data = getExhibitionData($eID); // 從Model端得到未完成工作清單
        echo json_encode($data); //將陣列變成JSON字串傳回
        break; 
        
    case "getExhibitionLikes":
        $eID = $_REQUEST['eID'];
        $list = getExLikeCount($eID);
        echo json_encode($list);
        break;
    
    case "getLikeorNot":
        $usr = $_SESSION["userID"];
        if(isset($_REQUEST['eID']) && isset($usr)){
            $eID = $_REQUEST['eID'];
            $list = getLikeorNot($eID, $usr); 
            echo json_encode($list);
        }else{
            $retArr=array();
            $retArr['like'] = false;
            echo json_encode($retArr);
        }
        break;

    case "AddLike":
        $usr = $_SESSION["userID"];
        if(isset($_REQUEST['eID'])){
            $eID = $_REQUEST['eID'];
            AddLike($usr,$eID); 
        }
        break;
    case "CancelLike":
        $usr = $_SESSION["userID"];
        if(isset($_REQUEST['eID'])){
            $eID = $_REQUEST['eID'];
            CancelLike($eID,$usr); 
        }
        break;
    case "checkIsYourEx":
        $eID = $_REQUEST['eID'];
        $list = array();
        $usr = $_SESSION["userID"];
        if(isset($eID) && $eID != ""){
            if(checkIsYourEx($usr,$eID)){
                $list["isYourEx"] = true;
            }else{
                $list["isYourEx"] = false;
            }
        }else{
            $list["isYourEx"] = false;
        }
        echo json_encode($list);
        break;
    case "checkUserCanView":
        $eID = $_REQUEST['eID'];
        $list = array();
        if(isset($eID) && $eID != ""){
            if(isset($_SESSION["userID"]) && $_SESSION["userID"] != ""){
                $usr = $_SESSION["userID"];
                $list = checkUserCanView($usr,$eID);
            }else{
                $list = checkVisitorCanView($eID);
            }
        }else{
            $list["canView"] = false;
        }
        echo json_encode($list);
        break;
    case "checkUserCanViewPano":
        $eID = $_REQUEST['eID'];
        $list = array();
        if(isset($eID) && $eID != ""){
            if(isset($_SESSION["userID"]) && $_SESSION["userID"] != ""){
                $usr = $_SESSION["userID"];
                $list = checkUserCanView($usr,$eID);
            }else{
                $list["canView"] = false;
            }
        }else{
            $list["canView"] = false;
        }
        echo json_encode($list);
        break;
    case "getFirstPanoramaData": //抓第一場景的全部資訊
        $eID = $_REQUEST['eID'];
        if(isset($eID) && $eID != ""){
            $list = getFirstPanoramaData($eID);
            echo json_encode($list);
            break;
        }
        $list = array();
        echo json_encode($list);
        break;
    case "getOtherPanoramaData": //抓其他場景的全部資訊
        $epID = $_REQUEST['epID'];
        if(isset($epID) && $epID != ""){
            $list = getOtherPanoramaData($epID);
            echo json_encode($list);
            break;
        }
        $list = array();
        echo json_encode($list);
        break;
    case "getAllPanoramaXY":
        $eID = $_REQUEST['eID'];
        if(isset($eID) && $eID != ""){
            $list = getAllPanoramaXY($eID);
            echo json_encode($list);
            break;
        }
        $list = array();
        echo json_encode($list);
        break;
//Curator---------------------------------------------------------------------------------------------
    case "getCuratorList":
        $list = getCuratorList(); // 從Model端得到未完成工作清單
        echo json_encode($list); //將陣列變成JSON字串傳回
        break; 
    case "getCuratorData":
        if(isset($_REQUEST["id"])){ 
            $id =$_REQUEST["id"];
        }else{
            $id = '';
        }
        echo json_encode(getCuratorData($id));
        break;
    case "getCuratorSubs":
        $id = $_REQUEST['id'];
        $list = getCuSubsCount($id);
        echo json_encode($list);
        break;
    case "SubscribeOrNot": //確認是否訂閱
        $usr = $_SESSION["userID"];
        if (isset($_REQUEST['id']) && isset($usr)) {
            $cid = $_REQUEST['id'];
            $list = SubscribeOrNot($cid, $usr);
            echo json_encode($list);
        } else {
            $retArr = array();
            $retArr['sub'] = false;
            echo json_encode($retArr);
        }
        break;
    case "subscribe":
        $cid = $_REQUEST["id"];
        $sid = $_SESSION["userID"];
        subscribe($sid, $cid);
        break;
    case "unSubscribe":
        $cid = $_REQUEST["id"];
        $sid = $_SESSION["userID"];
        unSubscribe($sid, $cid);
        break;
    case "CuratorEx"://未登入顯示策展者公開展覽
        $id = $_REQUEST['id'];
        $list = CuratorEx($id);
        echo json_encode($list);
        break;
    case "LoginCuratorEx"://登入顯示策展者展覽
        $id = $_REQUEST['id'];
        $usr = $_SESSION["userID"];
        $list = LoginCuratorEx($id,$usr);
        echo json_encode($list);
        break;
    case "LoginCuratorList"://登入後列策展人
        $usr = $_SESSION["userID"];//userID
        echo LoginCuratorList($usr);
        break;
        
    case "LoginExhibitionList"://登入後列展覽
        $usr = $_SESSION["userID"];//userID
        $list = LoginExhibitionList($usr);
        echo json_encode($list);
        break;
//---------------------------------------------------------------------------------------------
    //我的展場頁面
    case "getMyExhibitionList":
        $usr = $_SESSION["userID"];
        if(isset($usr) && $usr != ""){
            $list = getMyExhibitionList($usr);
            echo json_encode($list);
            break;
        }
        $list = array();
        echo json_encode($list);
        break;
    case "deleteMyExhibition":
        $list = array();
        $usr = $_SESSION["userID"];
        $eID = $_REQUEST['eID'];
        if(isset($eID) && isset($usr) && ($usr != "")){
            $list = deleteMyExhibition($usr,$eID);
            echo json_encode($list);
            break;
        }
        $list["isDelete"] = false;
        echo json_encode($list);
        break;
//--------------------------------------------------------------------------------------------
    case "getMyPhoto":
        $list = array();
        $list["Login"] = true;
        if( !isset($_SESSION["userID"]) || $_SESSION["userID"] === ''){ //session未定義或者是空值時
            $list["Login"] = false; //表示沒有登入過
            echo json_encode($list);
            break;
        }else{
            $usr = $_SESSION["userID"];
            $list["photo"] = getMyPhoto($usr);
        }
        echo json_encode($list);
        break;
    
    //以下新增、編輯展場頁面皆需要--------------------------------------------------
    case "getMyPanoramaList"://將屬於自己的全景圖都撈出來
        $response=array();
        if(!isset($_SESSION["userID"]) || $_SESSION["userID"] === ''){
            $response["Login"] = false;
        }else{
            $response["Login"] = true;
            $usr = $_SESSION["userID"];
            $response["value"] = getMyPanoramaList($usr);
        }
        echo json_encode($response);
        break;
    case "getPublicPanoramaList"://將所有公開的全景圖都撈出來
        $response=array();
        if(!isset($_SESSION["userID"]) || $_SESSION["userID"] === ''){
            $response["Login"] = false;
        }else{
            $response["Login"] = true;
            $response["value"] = getPublicPanoramaList();
        }
        echo json_encode($response);
        break;
    //以上新增、編輯展場頁面皆需要--------------------------------------------------
    case "deleteMyPanorama":
        $list = array();
        $usr = $_SESSION["userID"];
        $pID = $_REQUEST['pID'];
        if(isset($pID) && isset($usr) && ($usr != "")){
            $list = deleteMyPanorama($usr,$pID);
            echo json_encode($list);
            break;
        }
        $list["isDelete"] = false;
        $list["cause"] = "錯誤!!";
        echo json_encode($list);
        break;
    case "checkPanoramaAccess":
        $list = array();
        $usr = $_SESSION["userID"];
        $pID = $_REQUEST['pID'];
        if(isset($pID) && isset($usr) && ($usr != "")){
            $list = checkPanoramaAccess($usr,$pID);
            echo json_encode($list);
            break;
        }
        $list["access"] = false;
        $list["cause"] = "權限不足，無法編輯";
        echo json_encode($list);
        break;
    case "uploadMyPanorama":
        $response = array();
        if( (isset($_REQUEST["name"]))&(isset($_FILES["PanoramaImage"]))&(isset($_SESSION["userID"]))  ){
            $name = $_REQUEST["name"];//前端用formData加上POST傳值
            $imageType = $_FILES["PanoramaImage"]["type"];//他的副檔名，但是是用MIME格式紀錄image/png、image/jpeg、image/gif
            if(($imageType === 'image/png')||($imageType === 'image/jpeg')){
                if((isset($_FILES["PanoramaSmallImage"]))){
                    $imageType = $_FILES["PanoramaSmallImage"]["type"];
                    if(($imageType === 'image/png')||($imageType === 'image/jpeg')||($imageType === 'image/gif')){
                        $smallimgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["PanoramaSmallImage"]["name"], PATHINFO_EXTENSION);
                        $smallimgLink = "https://360.systemdynamics.tw/backendPHP/PanoramaSmallImg/".$smallimgFilename;
                        move_uploaded_file($_FILES["PanoramaSmallImage"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/PanoramaSmallImg/".$smallimgFilename);
                    }else{
                        $response['status']='invalid';
                        $response['cause']='底部圖格式錯誤，只能是.jpg/.jpeg/.png/.gif';
                        echo json_encode($response);
                        break;
                    }
                }else{
                    $smallimgLink = ""; //使用者沒上傳全景圖縮圖也沒差，把她設為空值就好
                }
                //上面有可能縮圖報錯，所以全景圖在上方先不要存，移動到這邊確定縮圖沒問題再存
                $imgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["PanoramaImage"]["name"], PATHINFO_EXTENSION);
                //uniqid是生成微分秒，裡面的參數就是你可以加上的前綴
                //因為有可能發生多使用者同時上傳全景圖，還是可能導致微分咬相同，所以特別再用userID當作前綴分開    
                $imgLink = "https://360.systemdynamics.tw/backendPHP/PanoramaImg/".$imgFilename;
                move_uploaded_file($_FILES["PanoramaImage"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/PanoramaImg/".$imgFilename);
                //move_uploaded_file(file,newloc) 解釋: file(必需。規定要移動的檔案) newloc(必需。規定檔案的新位置)
                // $FILES["file"]["name"]  客戶端電腦上文件的原始名稱。
                // $FILES["file"]["tmp_name"] 上傳文件儲存在伺服器上的臨時文件名。
                $usr = $_SESSION["userID"];
                if(uploadMyPanorama($name,$imgLink,$smallimgLink,$usr)){
                    $response['status']='valid';
                    $response['cause']='上傳成功!!!';
                }else{
                    $response['status']='invalid';
                    $response['cause']='上傳失敗!!!';
                }
            }else{
                $response['status']='invalid';
                $response['cause']='全景圖格式錯誤，只能是.jpg/.jpeg/.png/.gif';
            }
            echo json_encode($response);
        }else{
            $response['status']='invalid';
            $response['cause']='名稱或檔案不能為空';
            echo json_encode($response);
        }    
        break;
    case "updateMyPanorama":
        $response = array();
        $pID = $_REQUEST["pID"];
        if( (isset($_REQUEST["name"])) & (isset($_SESSION["userID"])) & (isset($pID)) & (isset($_REQUEST["permission"])) ){
            $name = $_REQUEST["name"];//前端用formData加上POST傳值
            if(isset($_FILES["PanoramaImage"])){
                $imageType = $_FILES["PanoramaImage"]["type"];//他的副檔名，但是是用MIME格式紀錄image/png、image/jpeg、image/gif
                if(($imageType === 'image/png')||($imageType === 'image/jpeg')){
                    $imgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["PanoramaImage"]["name"], PATHINFO_EXTENSION);
                    $imgLink = "https://360.systemdynamics.tw/backendPHP/PanoramaImg/".$imgFilename;
                }else{
                    $response['status']='invalid';
                    $response['cause']='全景圖格式錯誤，只能是.jpg/.jpeg/.png/.gif';
                    echo json_encode($response);
                    break;
                }
            }else{
                $imgLink = "";
            }
            if(isset($_FILES["PanoramaSmallImage"])){
                $imageType = $_FILES["PanoramaSmallImage"]["type"];
                if(($imageType === 'image/png')||($imageType === 'image/jpeg')||($imageType === 'image/gif')){
                    $smallimgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["PanoramaSmallImage"]["name"], PATHINFO_EXTENSION);
                    $smallimgLink = "https://360.systemdynamics.tw/backendPHP/PanoramaSmallImg/".$smallimgFilename;
                    move_uploaded_file($_FILES["PanoramaSmallImage"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/PanoramaSmallImg/".$smallimgFilename);
                }else{
                    $response['status']='invalid';
                    $response['cause']='底部圖格式錯誤，只能是.jpg/.jpeg/.png/.gif';
                    echo json_encode($response);
                    break;
                }
            }else{
                $smallimgLink = ""; //使用者沒上傳全景圖縮圖也沒差，把她設為空值就好
            }
            if($imgLink !== ""){//為甚麼要選擇在這裡才建立Server端的全景圖片是因為要等底部圖沒有報錯
                move_uploaded_file($_FILES["PanoramaImage"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/PanoramaImg/".$imgFilename);
            }
            $usr = $_SESSION["userID"];
            if($_REQUEST["clearSmallImg"] === "true"){
                $clearSmallImg = true;
            }else{
                $clearSmallImg = false;
            }
            $permission = $_REQUEST["permission"];
            updateMyPanorama($pID,$name,$imgLink,$smallimgLink,$usr,$clearSmallImg,$permission);
            $response['status']='valid';
            echo json_encode($response);
        }else{
            $response['status']='invalid';
            $response['cause']='錯誤';
            echo json_encode($response);
        }    
        break;
    case "getMyPanoramaStatistics":
        $response = array();
        if((isset($_SESSION["userID"])) && ($_SESSION["userID"] !== "")){
            $usr = $_SESSION["userID"];
            $response["statistics"] = getMyPanoramaStatistics($usr);
            $response["status"] = "valid";
        }else{
            $response["status"] ="invalid";
        }
        echo json_encode($response);
        break;
    //manage MyInfo
    case "getMyInfo"://myinfo
        $usr = $_SESSION["userID"];
        $list = getMyInfo($usr);
        echo json_encode($list);
        break;
     
    case "EditInfo"://編輯MyInfo
        $usr = $_SESSION["userID"];
        $first_name = $_REQUEST["first_name"];//前端用formData加上POST傳值
        $last_name = $_REQUEST["last_name"];
        $intro = $_REQUEST["intro"];
        $gender = $_REQUEST["gender"];
        $photoLink = $_REQUEST["photoLink"];
        $response = array();
        if ((isset($first_name)) &(isset($last_name)) & (isset($intro)) & (isset($gender)) & ($first_name != "") & ($last_name != "")& ($intro != "")& ($gender != "")) {
            if((isset($_FILES["photo"]))){
                $imgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["photo"]["name"], PATHINFO_EXTENSION);
                //uniqid是生成微分秒，裡面的參數就是你可以加上的前綴
                //因為有可能發生多使用者同時上傳全景圖，還是可能導致微分咬相同，所以特別再用userID當作前綴分開 
                $imgLink = "https://360.systemdynamics.tw/backendPHP/InfoImg/".$imgFilename;
                move_uploaded_file($_FILES["photo"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/InfoImg/".$imgFilename);
                //刪除資料夾的檔案
                DelInfoPic($usr);
            }else{
                $imgLink =$_REQUEST["photoLink"];
            }
            if (EditInfo($first_name, $intro, $imgLink, $last_name, $gender,$usr)) {
                $response['state'] = 'valid';
                $response['cause'] = '更新成功';
                echo json_encode($response);
            } else {
                $response['state'] = 'invalid';
                $response['cause'] = '更新失敗';
                echo json_encode($response);
            }
        } else {
            $response['state'] = 'invalid';
            $response['cause'] = '表單不能有空值';
            echo json_encode($response);
        }
        break;

        //ForgetPwd
        case "ForgetPwd":
            $json = json_decode(file_get_contents("php://input")); //json_decode第二個參數加上true會變成返回陣列，否者返回物件
            $email = $json->email;
            $newpwd = $json->newpwd;
            $newpwdAgain = $json->newpwdAgain;
            $response = array();
            if ((isset($email)) & (isset($newpwd)) & (isset($newpwdAgain)) & ($email != "") & ($newpwd != "") & ($newpwdAgain != "")) {
            //防呆，一樣做簡單邏輯判斷，當title不是空的，再將它導入函數
                if (filter_var($email, FILTER_VALIDATE_EMAIL) != true) {
                    $response['status'] = 'invalid';
                    $response['cause'] = '輸入無效的電子郵件';
                    echo json_encode($response);
                } elseif ($newpwd != $newpwdAgain){
                    $response['status'] = 'invalid';
                    $response['cause'] = '新密碼不相符';
                    echo json_encode($response);
                } elseif (ForgetPwd($email,$newpwd)) {
                    $response['status'] = 'valid';
                    $response['cause'] = '更改密碼成功';
                    echo json_encode($response);
                } else {
                    $response['status'] = 'invalid';
                    $response['cause'] = '此用戶電子郵件尚未註冊過';
                    echo json_encode($response);
                }
            } else {
                //$message = "表單不能有空值";
                $response['status'] = 'invalid';
                $response['cause'] = '表單不能有空值';
                echo json_encode($response);
            }
            break;
    //EditPwd
        case "EditPwd":        
            $usr = $_SESSION["userID"];
            $oldpwd = $_REQUEST["oldpwd"];
            $newpwd = $_REQUEST["newpwd"];
            $newpwdAgain = $_REQUEST["newpwdAgain"];
            $response = array();
            if ((isset($oldpwd)) & (isset($newpwd)) & (isset($newpwdAgain)) & ($oldpwd != "") & ($newpwd != "") & ($newpwdAgain != "")) {
                if ($newpwd != $newpwdAgain){
                    $response['status'] = 'invalid';
                    $response['cause'] = '新密碼不相符';
                    echo json_encode($response);
                } elseif (EditPwd($usr,$oldpwd,$newpwd)) {
                    $response['status'] = 'valid';
                    $response['cause'] = '更新密碼成功';
                    echo json_encode($response);
                } else {
                    $response['status'] = 'invalid';
                    $response['cause'] = '原始密碼錯誤';
                    echo json_encode($response);
                }
            } else {
                //$message = "表單不能有空值";
                $response['status'] = 'invalid';
                $response['cause'] = '表單不能有空值';
                echo json_encode($response);
            }
            break;
        //以下新增、編輯展場頁面皆需要--------------------------------------------------
        case "getMyItemList"://展品
            $usr = $_SESSION["userID"];
            $list = array();
            if(isset($usr)){
                $list["Login"] = true;
                $list["value"] = getMyItemList($usr);
            }
            echo json_encode($list);
            break;
        case "getPublicItemList":
            $usr = $_SESSION["userID"];
            $list = array();
            if(isset($usr)){
                $list["Login"] = true;
                $list["value"] = getPublicItemList();
            };
              echo json_encode($list);
              break;
        //以上新增、編輯展場頁面皆需要--------------------------------------------------
        case "addMyExhibition":
            $list = array();//最終回覆前端的表單物件
            if(isset($_SESSION["userID"])){
                $usr = $_SESSION["userID"];
                $list["Login"] = true;
            }else{
                $list["Login"] = false;
                $list["cause"] = "session過期或遺失，請重新登入";
                echo json_encode($list);
                break;
            }
            $pass = true; //可否存入資料庫及server資料夾，預設可以
            $name = $_REQUEST["exhibitionName"];
            $eIntro = $_REQUEST["eIntro"]; 
            $start_date = $_REQUEST["startTime"];
            $close_date = $_REQUEST["closeTime"];
            $firstScene = (int)$_REQUEST["firstScene"];//雖然本身是整數，但存在formdata傳過來變字串，所以要再把它變回來
            $permission = $_REQUEST["permission"];
            $frontPictureFiles  = null;
            if(isset($_FILES["frontPicture"])){
                $frontImgType = $_FILES["frontPicture"]["type"];
                if(($frontImgType === 'image/png')||($frontImgType === 'image/jpeg')){
                    $frontPictureFiles = $_FILES["frontPicture"];
                }else{
                    $pass = false;    
                }
            }else{
                $pass = false;    
            }
            $picture2Files = null;
            if(isset($_FILES["picture2"])){
                $picture2Type = $_FILES["picture2"]["type"];
                if(($picture2Type === 'image/png')||($picture2Type === 'image/jpeg')){
                    $picture2Files = $_FILES["picture2"];
                }else{
                    $pass = false;
                }
            }
            $picture3Files = null;
            if(isset($_FILES["picture3"])){
                $picture3Type = $_FILES["picture3"]["type"];
                if(($picture3Type=== 'image/png')||($picture3Type === 'image/jpeg')){
                    $picture3Files = $_FILES["picture3"];
                }else{
                    $pass = false;
                }
            }
            $mapImgFiles = null;
            if(isset($_FILES["mapImg"])){
                $mapImgType = $_FILES["mapImg"]["type"];
                if(($mapImgType=== 'image/png')||($mapImgType === 'image/jpeg')){
                    $mapImgFiles = $_FILES["mapImg"];
                }else{
                    $pass = false;
                }
            }
            //檢查是否有把非自己且非公開的全景圖做引用
            $illegal = false;
            $illegalPanoList = array();
            $myPanoramaList = json_decode($_REQUEST["myPanoramaList"],true);
            if(is_countable($myPanoramaList) && count($myPanoramaList) > 0){
                for($i = 0 ; $i < count($myPanoramaList) ; $i++) {
                    if($myPanoramaList[$i]['ownerID'] !== $usr ){
                        if(!checkPanoIsPublic($myPanoramaList[$i]['pID'])){
                            $illegal = true;
                            $illegalPanoList[] = $myPanoramaList[$i]['panoramaName'];
                        }
                    }
                }
            }
            //檢查是否有把非自己且非公開的展品做引用
            $illegalItemList = array();
            if($_REQUEST["CustomSpotsArray"] !== null){
                $customSpotsArray = json_decode($_REQUEST["CustomSpotsArray"],true);
                if(is_countable($customSpotsArray) && count($customSpotsArray) > 0){
                    for($i = 0 ; $i < count($customSpotsArray) ; $i++) {
                        if($customSpotsArray[$i]['ownerID'] !== $usr ){
                            if(!checkItemIsPublic($customSpotsArray[$i]['iID'])){
                                $illegal = true;
                                $illegalItemList[] = $customSpotsArray[$i]['itemName'];
                            }
                        }
                    }
                }
            }
            if($illegal){ //只要有引用到非法的
                $pass = false;
            }
            $list["illegal"] = $illegal;
            $list["illegalPanoList"] = $illegalPanoList;
            $list["illegalItemList"] = $illegalItemList;
            if($pass){//這個通過就可以存入DB且存入server資料夾中
                $time = '00:00:00';
                $start = date('Y-m-d H:i:s',strtotime($start_date . ' ' . $time));
                $close = date('Y-m-d H:i:s',strtotime($close_date . ' ' . $time));
                //封面圖
                $frontPictureFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["frontPicture"]["name"], PATHINFO_EXTENSION);
                $frontPictureLink = "https://360.systemdynamics.tw/backendPHP/ExFrontPicture/".$frontPictureFilename;
                move_uploaded_file($_FILES["frontPicture"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExFrontPicture/".$frontPictureFilename);
                if(isset($picture2Files)){
                    $picture2Filename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["picture2"]["name"], PATHINFO_EXTENSION);
                    $picture2Link = "https://360.systemdynamics.tw/backendPHP/ExPicture2/".$picture2Filename;
                    move_uploaded_file($_FILES["picture2"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExPicture2/".$picture2Filename);
                }else{
                    $picture2Link = "";
                }
                if(isset($picture3Files)){
                    $picture3Filename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["picture3"]["name"], PATHINFO_EXTENSION);
                    $picture3Link = "https://360.systemdynamics.tw/backendPHP/ExPicture3/".$picture3Filename;
                    move_uploaded_file($_FILES["picture3"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExPicture3/".$picture3Filename);
                }else{
                    $picture3Link = "";
                }
                if(isset($mapImgFiles)){
                    $mapImgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["mapImg"]["name"], PATHINFO_EXTENSION);
                    $mapImgLink = "https://360.systemdynamics.tw/backendPHP/ExMapImg/".$mapImgFilename;
                    move_uploaded_file($_FILES["mapImg"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExMapImg/".$mapImgFilename);
                }else{
                    $mapImgLink = "";
                }
                //新增展場
                $eID = addMyExhibition($name, $usr, $eIntro, $start, $close, $frontPictureLink, $permission, $mapImgLink, $picture2Link, $picture3Link); //新增展場
                $panoKeyArray = array();//存fakeID與epID的對應
                $myPanoramaList = json_decode($_REQUEST["myPanoramaList"],true);
                if(is_countable($myPanoramaList) && count($myPanoramaList) > 0){
                    for($i = 0 ; $i < count($myPanoramaList) ; $i++) {
                        $fakeID = $myPanoramaList[$i]['fakeID'];
                        $pID = $myPanoramaList[$i]['pID'];
                        $name = $myPanoramaList[$i]['panoramaName'] ;
                        $mapX = $myPanoramaList[$i]['mapX'];
                        $mapY = $myPanoramaList[$i]['mapY'];
                        if((gettype($myPanoramaList[$i]["smallimgLink"]) === "array")&&(sizeof($myPanoramaList[$i]['smallimgLink']) === 0)){
                            $index = "smallimg".$myPanoramaList[$i]['fakeID']  ;
                            $smallimgFiles =  $_FILES[$index];
                            $smallimgFilename = uniqid($_SESSION["userID"]).'.'.$smallimgFiles['name'];
                            $smallimgLink = "https://360.systemdynamics.tw/backendPHP/PanoramaSmallImg/".$smallimgFilename;
                            move_uploaded_file($smallimgFiles["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/PanoramaSmallImg/".$smallimgFilename);
                        }else{
                            $smallimgLink = $myPanoramaList[$i]['smallimgLink'];
                        }        
                        if((gettype($myPanoramaList[$i]['music']) === "array")&&(sizeof($myPanoramaList[$i]['music']) === 0)){
                            $index = "music".$myPanoramaList[$i]['fakeID']  ;
                            $musicFiles = $_FILES[$index];
                            $musicFilename = uniqid($_SESSION["userID"]).'.'.$musicFiles['name'];
                            $musicLink = "https://360.systemdynamics.tw/backendPHP/PanoramaMusic/".$musicFilename ;
                            move_uploaded_file($musicFiles["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/PanoramaMusic/".$musicFilename);
                        }else if($myPanoramaList[$i]["music"] === null){//不能傳null進入DB
                            $musicLink = "";
                        }else{
                            $musicLink=$myPanoramaList[$i]["music"];
                        }
                        $epID = addMyExPanorama($pID, $eID, $mapX, $mapY, $name, $smallimgLink, $musicLink);//加入展示中全景圖
                        $panoKeyArray[$fakeID] = $epID; //陣列的key是fakeID，而value則是真的資料庫的epID
                        if($fakeID === $firstScene){ //當此全景圖是展場的第一個全景圖
                            updateExfirstScene($eID, $epID);//更改該展場的第一張全景圖
                        }
                    }
                }
                //新增移動點
                if($_REQUEST["MoveSpotsArray"] !== null){
                    $moveSpotsArray = json_decode($_REQUEST["MoveSpotsArray"],true);
                    if(is_countable($moveSpotsArray) && count($moveSpotsArray) > 0){
                        for($i = 0 ; $i < count($moveSpotsArray) ; $i++) {
                            $epID = $panoKeyArray[$moveSpotsArray[$i]['currentSceneID']];
                            $nextScene = $panoKeyArray[$moveSpotsArray[$i]['destinationID']];
                            $pitch = $moveSpotsArray[$i]['pitch'];
                            $yaw = $moveSpotsArray[$i]['yaw'];
                            $type = $moveSpotsArray[$i]['clickHandlerFunc'];
                            addExMoveSpot($epID, $type ,$pitch, $yaw, $nextScene);
                        }
                    }
                }else{
                    $moveSpotsArray = null;
                }
                //新增資訊點
                if($_REQUEST["InfoSpotsArray"] !== null){
                    $infoSpotsArray = json_decode($_REQUEST["InfoSpotsArray"],true);
                    if(is_countable($infoSpotsArray) && count($infoSpotsArray) > 0){
                        for($i = 0 ; $i < count($infoSpotsArray) ; $i++) {
                            $epID = $panoKeyArray[$infoSpotsArray[$i]['currentSceneID']];
                            $pitch = $infoSpotsArray[$i]['pitch'];
                            $yaw = $infoSpotsArray[$i]['yaw'];
                            $title = $infoSpotsArray[$i]['title'];
                            $intro = $infoSpotsArray[$i]['detailtxt'];
                            addExInfoSpot($epID, $pitch, $yaw, $title, $intro);
                        }    
                    }
                }else{
                    $infoSpotsArray = null;
                }
                //新增客製化展品點
                if($_REQUEST["CustomSpotsArray"] !== null){
                    $customSpotsArray = json_decode($_REQUEST["CustomSpotsArray"],true);
                    if(is_countable($customSpotsArray) && count($customSpotsArray) > 0){
                        for($i = 0 ; $i < count($customSpotsArray) ; $i++) {
                            $epID = $panoKeyArray[$customSpotsArray[$i]['currentSceneID']];
                            $iID = $customSpotsArray[$i]['iID'];
                            $pitch = $customSpotsArray[$i]['pitch'];
                            $yaw = $customSpotsArray[$i]['yaw'];
                            $itemName = $customSpotsArray[$i]['itemName'];
                            $itemIntro = $customSpotsArray[$i]['itemIntro'];
                            $imageWidth = $customSpotsArray[$i]['imageWidth'];
                            $imageHeight= $customSpotsArray[$i]['imageHeight'];
                            if((gettype($customSpotsArray[$i]["imageLink"]) === "array")&&(sizeof($customSpotsArray[$i]['imageLink']) === 0)){
                                $index = "hotspotItemImage".$customSpotsArray[$i]['id']  ;
                                $imageFiles =  $_FILES[$index];
                                $imageFilename = uniqid($_SESSION["userID"]).'.'.$imageFiles['name'];
                                $imageLink= "https://360.systemdynamics.tw/backendPHP/ItemImg/".$imageFilename;
                                move_uploaded_file($imageFiles["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ItemImg/".$imageFilename);
                            }else{
                                $imageLink = $customSpotsArray[$i]["imageLink"];
                            }        
                            if((gettype($customSpotsArray[$i]['musicLink']) === "array")&&(sizeof($customSpotsArray[$i]['musicLink']) === 0)){
                                $index = "hotspotItemMusic".$customSpotsArray[$i]['id']  ;
                                $musicFiles = $_FILES[$index];
                                $musicFilename = uniqid($_SESSION["userID"]).'.'.$musicFiles['name'];
                                $musicLink = "https://360.systemdynamics.tw/backendPHP/ItemMusic/".$musicFilename ;
                                move_uploaded_file($musicFiles["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ItemMusic/".$musicFilename);
                            }else if($customSpotsArray[$i]["musicLink"] === null){
                                $musicLink="";
                            }else{
                                $musicLink=$customSpotsArray[$i]["musicLink"];
                            }
                            addExCustomSpot($iID, $epID,  $pitch, $yaw, $itemName, $itemIntro, $imageLink, $musicLink, $imageWidth, $imageHeight);
                        }
                    }    
                }else{
                    $customSpotsArray = null;
                }
                $list["cause"] = "成功建展!!";
            }else{
                $list["cause"] = "錯誤: 有檔案不符合格式或必填選項遺失，拒絕建展";
            }
            echo json_encode($list);
            break;
        // Home
         case "getOnExhibit"://正在展出中的展覽
            $list = getOnExhibit();
            echo json_encode($list);
            break;
        case "getToBeExhibit"://即將展出的展覽
            $list = getToBeExhibit();
            echo json_encode($list);
            break;
        case "getBestCu":
            $list = getBestCu();
            echo json_encode($list);
            break;
        case "getBestEx":
            $list = getBestEx();
            echo json_encode($list);
            break;
        //================編輯展場(待展中)==================
        case "getMyExPanoData": //拿eID展場的所有Data
            $list = array();
            $eID = $_GET["eID"];
            $usr = $_SESSION["userID"];
            if(($eID !== "" )&&($usr !== "")&&(isset($eID))&&(isset($usr))){
                $list = getMyExPanoData($eID, $usr);
            }
            echo json_encode($list);
            break;
        case "editMyExhibition": //編輯展場按下"完成"
            $list = array();//最終回覆前端的表單物件
            if(isset($_SESSION["userID"])){
                $usr = $_SESSION["userID"];
                $list["Login"] = true;
            }else{
                $list["Login"] = false;
                $list["cause"] = "session過期或遺失，請重新登入";
                echo json_encode($list);
                break;
            }
            $pass = true; //可否存入資料庫及server資料夾，預設可以
            $eID = (int)$_REQUEST["eID"];
            $name = $_REQUEST["exhibitionName"];
            $eIntro = $_REQUEST["eIntro"]; 
            $start_date = $_REQUEST["startTime"];
            $close_date = $_REQUEST["closeTime"];
            $permission = $_REQUEST["permission"];
            $firstScene = (int)$_REQUEST["firstScene"];
            $frontPictureLink = $_REQUEST["frontPictureLink"];
            $picture2Link = $_REQUEST["picture2Link"];
            $picture3Link = $_REQUEST["picture3Link"];
            $mapImgLink = $_REQUEST["mapImgLink"];
            //確認封面圖沒有問題
            $frontPictureFiles  = null;
            if($_REQUEST["frontPictureIsFile"] !== null){
                $frontPictureIsFile = $_REQUEST["frontPictureIsFile"];
                if($frontPictureIsFile === "true"){ //是File
                    $frontImgType = $_FILES["frontPicture"]["type"];
                    if(($frontImgType === 'image/png')||($frontImgType === 'image/jpeg')){
                        $frontPictureFiles = $_FILES["frontPicture"];
                    }else{ // 是網址路徑
                        $pass = false;    
                    }
                }
            }else{
                $pass = false;    
            }
            //確認封面圖2沒有問題
            $picture2Files = null;
            if($_REQUEST["picture2IsFile"] !== null){
                $picture2IsFile = $_REQUEST["picture2IsFile"];
                if($picture2IsFile === "true"){
                    $picture2Type = $_FILES["picture2"]["type"];
                    if(($picture2Type === 'image/png')||($picture2Type === 'image/jpeg')){
                        $picture2Files = $_FILES["picture2"];
                    }else{
                        $pass = false;
                    }
                }
            }
             //確認封面圖3沒有問題
            $picture3Files = null;
            if($_REQUEST["picture3IsFile"] !== null){
                $picture3IsFile = $_REQUEST["picture3IsFile"];
                if($picture3IsFile === "true"){
                    $picture3Type = $_FILES["picture3"]["type"];
                    if(($picture3Type=== 'image/png')||($picture3Type === 'image/jpeg')){
                        $picture3Files = $_FILES["picture3"];
                    }else{
                        $pass = false;
                    }
                }
            }
            //確認小地圖沒有問題
            $mapImgFiles = null;
            if($_REQUEST["mapImgIsFile"] !== null){
                $mapImgIsFile = $_REQUEST["mapImgIsFile"];
                if($mapImgIsFile === "true"){
                    $mapImgType = $_FILES["mapImg"]["type"];
                    if(( $mapImgType === 'image/png')||( $mapImgType  === 'image/jpeg')){
                        $mapImgFiles = $_FILES["mapImg"];
                    }else{
                        $pass = false;
                    }
                }
            }
            //檢查是否有把非自己且非公開的全景圖做引用
            $illegal = false;
            $illegalPanoList = array();
            $myPanoramaList = json_decode($_REQUEST["myPanoramaList"],true);
            if(is_countable($myPanoramaList) && count($myPanoramaList) > 0){
                for($i = 0 ; $i < count($myPanoramaList) ; $i++) {
                    if($myPanoramaList[$i]['ownerID'] !== $usr ){
                        if(!checkPanoIsPublic($myPanoramaList[$i]['pID'])){
                            $illegal = true;
                            $illegalPanoList[] = $myPanoramaList[$i]['panoramaName'];
                        }
                    }
                }
            }
            //檢查是否有把非自己且非公開的展品做引用
            $illegalItemList = array();
            if($_REQUEST["CustomSpotsArray"] !== null){
                $customSpotsArray = json_decode($_REQUEST["CustomSpotsArray"],true);
                if(is_countable($customSpotsArray) && count($customSpotsArray) > 0){
                    for($i = 0 ; $i < count($customSpotsArray) ; $i++) {
                        if($customSpotsArray[$i]['ownerID'] !== $usr ){
                            if(!checkItemIsPublic($customSpotsArray[$i]['iID'])){
                                $illegal = true;
                                $illegalItemList[] = $customSpotsArray[$i]['itemName'];
                            }
                        }
                    }
                }
            }
            if($illegal){ //只要有引用到非法的
                $pass = false;
            }
            $list["illegal"] = $illegal;
            $list["illegalPanoList"] = $illegalPanoList;
            $list["illegalItemList"] = $illegalItemList;
            if($pass){//這個通過就可以存入DB且存入server資料夾中
                $time = '00:00:00';
                $start = date('Y-m-d H:i:s',strtotime($start_date . ' ' . $time));
                $close = date('Y-m-d H:i:s',strtotime($close_date . ' ' . $time));
                //封面圖
                if($frontPictureIsFile === "true"){ //是File
                    $str = substr($frontPictureLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                    $filename = '.'.$str;
                    if(file_exists($filename)){
                        unlink($filename);//刪除文件
                    }
                    $frontPictureFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["frontPicture"]["name"], PATHINFO_EXTENSION);
                    $frontPictureLink = "https://360.systemdynamics.tw/backendPHP/ExFrontPicture/".$frontPictureFilename;
                    move_uploaded_file($_FILES["frontPicture"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExFrontPicture/".$frontPictureFilename);
                }else{ //不是File一定是是網址
                    $frontPictureLink = $_REQUEST["frontPictureLink"];
                }
                if($picture2IsFile === "true"){ //是File
                    if($picture2Link !== ""){//表示資料庫存的原路徑不是空的
                        $str = substr($picture2Link, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    if(isset($picture2Files)){ //新增檔案到server
                        $picture2Filename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["picture2"]["name"], PATHINFO_EXTENSION);
                        $picture2Link = "https://360.systemdynamics.tw/backendPHP/ExPicture2/".$picture2Filename;
                        move_uploaded_file($_FILES["picture2"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExPicture2/".$picture2Filename);
                    }
                }else if($picture2IsFile === ''){ //想清空該檔案
                    if($picture2Link !== ""){//表示資料庫存的原路徑不是空的
                        $str = substr($picture2Link, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    $picture2Link = '';
                }else{ //是網址
                    $picture2Link = $_REQUEST["picture2Link"];
                }
                if($picture3IsFile === "true"){ //是File
                    if($picture3Link !== ""){//表示資料庫存的原路徑不是空的
                        $str = substr($picture3Link, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    if(isset($picture3Files)){
                        $picture3Filename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["picture3"]["name"], PATHINFO_EXTENSION);
                        $picture3Link = "https://360.systemdynamics.tw/backendPHP/ExPicture3/".$picture3Filename;
                        move_uploaded_file($_FILES["picture3"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExPicture3/".$picture3Filename);
                    }
                }else if($picture3IsFile === ''){ //想清空該檔案
                    if($picture3Link !== ''){//表示資料庫存的原路徑不是空的
                        $str = substr($picture3Link, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    $picture3Link = '';
                }else{ //是網址
                    $picture3Link = $_REQUEST["picture3Link"];
                }
                if($mapImgIsFile === "true"){ //是File
                    if($mapImgLink !== ""){//表示資料庫存的原路徑不是空的
                        $str = substr($mapImgLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    if(isset($mapImgFiles)){ //新增檔案到server
                        $mapImgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["mapImg"]["name"], PATHINFO_EXTENSION);
                        $mapImgLink = "https://360.systemdynamics.tw/backendPHP/ExMapImg/".$mapImgFilename;
                        move_uploaded_file($_FILES["mapImg"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExMapImg/".$mapImgFilename);
                    }
                }else if($mapImgIsFile === ''){ //想清空該檔案
                    if($mapImgLink !== ""){//表示資料庫存的原路徑不是空的
                        $str = substr($mapImgLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    $mapImgLink = '';
                }else{ //是網址
                    $mapImgLink = $_REQUEST["mapImgLink"];
                }
                //編輯展場
                editMyExhibition($eID, $usr, $name, $eIntro, $start, $close, $frontPictureLink, $permission, $mapImgLink, $picture2Link, $picture3Link); 
                $panoKeyArray = array();//存fakeID與epID的對應
                $myPanoramaList = json_decode($_REQUEST["myPanoramaList"],true);//要先json decode
                if(is_countable($myPanoramaList) && count($myPanoramaList) > 0){
                    for($i = 0 ; $i < count($myPanoramaList) ; $i++) {
                        $fakeID = $myPanoramaList[$i]['fakeID'];
                        $pID = $myPanoramaList[$i]['pID'];
                        $name = $myPanoramaList[$i]['panoramaName'] ;
                        $mapX = $myPanoramaList[$i]['mapX'];
                        $mapY = $myPanoramaList[$i]['mapY'];
                        if((isset($myPanoramaList[$i]['epID']))&&($myPanoramaList[$i]['epID'] !== "")){
                            $epID = $myPanoramaList[$i]['epID'];
                        }else{
                            $epID = 0;
                        }
                        if((gettype($myPanoramaList[$i]["smallimgLink"]) === "array")&&(sizeof($myPanoramaList[$i]['smallimgLink']) === 0)){
                            $index = "smallimg".$myPanoramaList[$i]['fakeID']  ;
                            $smallimgFiles =  $_FILES[$index];
                            $smallimgFilename = uniqid($_SESSION["userID"]).'.'.$smallimgFiles['name'];
                            $smallimgLink = "https://360.systemdynamics.tw/backendPHP/PanoramaSmallImg/".$smallimgFilename;
                            move_uploaded_file($smallimgFiles["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/PanoramaSmallImg/".$smallimgFilename);
                            if($epID !== 0){//已經有epID的展場，sql指令改成用update
                                $deleteSmallImgLink = checkDeleteSmallImg($epID);//檢查資料庫是否有Link連結
                                if($deleteSmallImgLink !== ""){
                                    $str = substr($deleteSmallImgLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                                    $filename = '.'.$str;
                                    if(file_exists($filename)){
                                        unlink($filename);//刪除文件
                                    }
                                } 
                            }
                        }else{
                            $smallimgLink = $myPanoramaList[$i]['smallimgLink'];
                            if($smallimgLink === ''){//表示要清空，刪掉舊的
                                if($epID !== 0){//已經存在資料庫的展示中全景圖
                                    $deleteSmallImgLink = checkDeleteSmallImg($epID);//檢查資料庫是否有Link連結
                                    if($deleteSmallImgLink !== ""){
                                        $str = substr($deleteSmallImgLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                                        $filename = '.'.$str;
                                        if(file_exists($filename)){
                                            unlink($filename);//刪除文件
                                        }
                                    } 
                                }
                            }
                        }        
                        if((gettype($myPanoramaList[$i]['music']) === "array")&&(sizeof($myPanoramaList[$i]['music']) === 0)){
                            $index = "music".$myPanoramaList[$i]['fakeID']  ;
                            $musicFiles = $_FILES[$index];
                            $musicFilename = uniqid($_SESSION["userID"]).'.'.$musicFiles['name'];
                            $musicLink = "https://360.systemdynamics.tw/backendPHP/PanoramaMusic/".$musicFilename;
                            move_uploaded_file($musicFiles["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/PanoramaMusic/".$musicFilename);
                            if($epID !== 0){ //已經存在資料庫的展示中全景圖
                                $deleteMusicLink = checkDeleteMusic($epID);//檢查資料庫是否有Link連結
                                if($deleteMusicLink !== ""){
                                    $str = substr($deleteMusicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                                    $filename = '.'.$str;
                                    if(file_exists($filename)){
                                        unlink($filename);//刪除文件
                                    }
                                }
                            }
                        }else if($myPanoramaList[$i]["music"] === null){//不能傳null進入DB
                            $musicLink = "";
                            if($epID !== 0){ //已經存在資料庫的展示中全景圖
                                $deleteMusicLink = checkDeleteMusic($epID);//檢查資料庫是否有Link連結
                                if($deleteMusicLink !== ""){
                                    $str = substr($deleteMusicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                                    $filename = '.'.$str;
                                    if(file_exists($filename)){
                                        unlink($filename);//刪除文件
                                    }
                                }
                            }
                        }else{
                            $musicLink=$myPanoramaList[$i]["music"];
                        }
                        if($epID !== 0){//已經有epID的展場，sql指令改成用update
                            //先判斷需不需要刪掉Server端存的 PanoSmallimg 跟 Music    
                            editMyExPanorama($epID, $pID, $eID, $mapX, $mapY, $name, $smallimgLink, $musicLink);//更新展示中全景圖
                        }else{
                            $epID = addMyExPanorama($pID, $eID, $mapX, $mapY, $name, $smallimgLink, $musicLink);//加入展示中全景圖
                        }
                        $panoKeyArray[$fakeID] = $epID; //陣列的key是fakeID，而value則是真的資料庫的epID
                        if($fakeID === $firstScene){ //當此全景圖是展場的第一個全景圖
                            updateExfirstScene($eID, $epID);//更改該展場的第一張全景圖
                        }
                    }
                }
                //編輯/新增移動點
                if($_REQUEST["MoveSpotsArray"] !== null){
                    $moveSpotsArray = json_decode($_REQUEST["MoveSpotsArray"],true);
                    if(is_countable($moveSpotsArray) && count($moveSpotsArray) > 0){
                        for($i = 0 ; $i < count($moveSpotsArray) ; $i++) {
                            $epID = $panoKeyArray[$moveSpotsArray[$i]['currentSceneID']];
                            $nextScene = $panoKeyArray[$moveSpotsArray[$i]['destinationID']];
                            $pitch = $moveSpotsArray[$i]['pitch'];
                            $yaw = $moveSpotsArray[$i]['yaw'];
                            $type = $moveSpotsArray[$i]['clickHandlerFunc'];
                            if(isset($moveSpotsArray[$i]['msID'])&&($moveSpotsArray[$i]['msID'] !== "")){
                                $msID = $moveSpotsArray[$i]['msID'];
                                editExMoveSpot($msID, $epID, $type ,$pitch, $yaw, $nextScene);
                            }else{
                                addExMoveSpot($epID, $type ,$pitch, $yaw, $nextScene);
                            }
                        }
                    }
                }
                //編輯/新增資訊點
                if($_REQUEST["InfoSpotsArray"] !== null){
                    $infoSpotsArray = json_decode($_REQUEST["InfoSpotsArray"],true);
                    if(is_countable($infoSpotsArray) && count($infoSpotsArray) > 0){
                        for($i = 0 ; $i < count($infoSpotsArray) ; $i++) {
                            $epID = $panoKeyArray[$infoSpotsArray[$i]['currentSceneID']];
                            $pitch = $infoSpotsArray[$i]['pitch'];
                            $yaw = $infoSpotsArray[$i]['yaw'];
                            $title = $infoSpotsArray[$i]['title'];
                            $intro = $infoSpotsArray[$i]['detailtxt'];
                            if(isset($infoSpotsArray[$i]['isID'])&&($infoSpotsArray[$i]['isID'] !== "")){
                                $isID = $infoSpotsArray[$i]['isID'];
                                editExInfoSpot($isID, $epID, $pitch, $yaw, $title, $intro);
                            }else{
                                addExInfoSpot($epID, $pitch, $yaw, $title, $intro);
                            }
                        }    
                    }
                }
                //編輯/新增客製化展品點
                if($_REQUEST["CustomSpotsArray"] !== null){
                    $customSpotsArray = json_decode($_REQUEST["CustomSpotsArray"],true);
                    if(is_countable($customSpotsArray) && count($customSpotsArray) > 0){
                        for($i = 0 ; $i < count($customSpotsArray) ; $i++) {
                            $epID = $panoKeyArray[$customSpotsArray[$i]['currentSceneID']];
                            $iID = $customSpotsArray[$i]['iID'];
                            $pitch = $customSpotsArray[$i]['pitch'];
                            $yaw = $customSpotsArray[$i]['yaw'];
                            $itemName = $customSpotsArray[$i]['itemName'];
                            $itemIntro = $customSpotsArray[$i]['itemIntro'];
                            $imageWidth = $customSpotsArray[$i]['imageWidth'];
                            $imageHeight= $customSpotsArray[$i]['imageHeight'];
                            if(isset($customSpotsArray[$i]['csID'])&&($customSpotsArray[$i]['csID'] !== "")){
                                $csID = $customSpotsArray[$i]['csID'];
                            }else{
                                $csID = 0;
                            }
                            if((gettype($customSpotsArray[$i]["imageLink"]) === "array")&&(sizeof($customSpotsArray[$i]['imageLink']) === 0)){
                                $index = "hotspotItemImage".$customSpotsArray[$i]['id']  ;
                                $imageFiles =  $_FILES[$index];
                                $imageFilename = uniqid($_SESSION["userID"]).'.'.$imageFiles['name'];
                                $imageLink= "https://360.systemdynamics.tw/backendPHP/ItemImg/".$imageFilename;
                                move_uploaded_file($imageFiles["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ItemImg/".$imageFilename);
                                if($csID !== 0){
                                    $delete2DImgLink = checkDelete2DImg($csID);//檢查資料庫是否有Link連結
                                    if($delete2DImgLink !== ""){
                                        $str = substr($delete2DImgLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                                        $filename = '.'.$str;
                                        if(file_exists($filename)){
                                            unlink($filename);//刪除文件
                                        }
                                    }    
                                }
                            }else{
                                $imageLink = $customSpotsArray[$i]["imageLink"];
                                if($imageLink === ""){
                                    if($csID !== 0){ //資料庫有該客製化展品點
                                        $delete2DImgLink = checkDelete2DImg($csID);//檢查資料庫是否有Link連結
                                        if($delete2DImgLink !== ""){
                                            $str = substr($delete2DImgLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                                            $filename = '.'.$str;
                                            if(file_exists($filename)){
                                                unlink($filename);//刪除文件
                                            }
                                        } 
                                    }
                                }
                            }        
                            if((gettype($customSpotsArray[$i]['musicLink']) === "array")&&(sizeof($customSpotsArray[$i]['musicLink']) === 0)){
                                $index = "hotspotItemMusic".$customSpotsArray[$i]['id']  ;
                                $musicFiles = $_FILES[$index];
                                $musicFilename = uniqid($_SESSION["userID"]).'.'.$musicFiles['name'];
                                $musicLink = "https://360.systemdynamics.tw/backendPHP/ItemMusic/".$musicFilename ;
                                move_uploaded_file($musicFiles["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ItemMusic/".$musicFilename);
                                if($csID !== 0){ //資料庫有該客製化展品點
                                    $deleteMusicLink = checkDeleteItemMusic($csID);//檢查資料庫是否有Link連結
                                    if($deleteMusicLink !== ""){
                                        $str = substr($deleteMusicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                                        $filename = '.'.$str;
                                        if(file_exists($filename)){
                                            unlink($filename);//刪除文件
                                        }
                                    }
                                }
                            }else if($customSpotsArray[$i]["musicLink"] === null){
                                $musicLink = "";
                                if($csID !== 0){ //資料庫有該客製化展品點
                                    $deleteMusicLink = checkDeleteItemMusic($csID);//檢查資料庫是否有Link連結
                                    if($deleteMusicLink !== ""){
                                        $str = substr($deleteMusicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                                        $filename = '.'.$str;
                                        if(file_exists($filename)){
                                            unlink($filename);//刪除文件
                                        }
                                    }
                                }
                            }else{
                                $musicLink=$customSpotsArray[$i]["musicLink"];
                            }
                            if($csID !== 0){     
                                editExCustomSpot($csID, $iID, $epID, $pitch, $yaw, $itemName, $itemIntro, $imageLink, $musicLink, $imageWidth, $imageHeight);
                            }else{
                                addExCustomSpot($iID, $epID, $pitch, $yaw, $itemName, $itemIntro, $imageLink, $musicLink, $imageWidth, $imageHeight);
                            }
                        }
                    }    
                }
                $list["error"] = false;
                $list["cause"] = "更新展場成功!!";
            }else{
                $list["error"] = true;
                $list["cause"] = "錯誤: 有檔案不符合格式或必填選項遺失，拒絕編輯展場"; 
            }
            echo json_encode($list);
            break;
        //================編輯展場(展示中)==================
        case "getMyExData": //拿eID展場的所有Data
            $list = array();
            $eID = $_GET["eID"];
            $usr = $_SESSION["userID"];
            if(($eID !== "" )&&($usr !== "")&&(isset($eID))&&(isset($usr))){
                $list = getMyExData($eID, $usr);
            }
            echo json_encode($list);
            break;
        case "editMyExData": //拿eID編輯展場基本資訊
            $list = array();//最終回覆前端的表單物件
            if(isset($_SESSION["userID"])){
                $usr = $_SESSION["userID"];
                $list["Login"] = true;
            }else{
                $list["Login"] = false;
                $list["cause"] = "session過期或遺失，請重新登入";
                echo json_encode($list);
                break;
            }
            $pass = true; //可否存入資料庫及server資料夾，預設可以
            $name = $_REQUEST["exhibitionName"];
            $eIntro = $_REQUEST["eIntro"]; 
            $start_date = $_REQUEST["startTime"];
            $close_date = $_REQUEST["closeTime"];
            $permission = $_REQUEST["permission"];
            $frontPictureLink = $_REQUEST["frontPictureLink"];
            $picture2Link = $_REQUEST["picture2Link"];
            $picture3Link = $_REQUEST["picture3Link"];
            //確認封面圖沒有問題
            $frontPictureFiles  = null;
            if($_REQUEST["frontPictureIsFile"] !== null){
                $frontPictureIsFile = $_REQUEST["frontPictureIsFile"];
                if($frontPictureIsFile === "true"){ //是File
                    $frontImgType = $_FILES["frontPicture"]["type"];
                    if(($frontImgType === 'image/png')||($frontImgType === 'image/jpeg')){
                        $frontPictureFiles = $_FILES["frontPicture"];
                    }else{ // 是網址路徑
                        $pass = false;    
                    }
                }
            }else{
                $pass = false;    
            }
            //確認封面圖2沒有問題
            $picture2Files = null;
            if($_REQUEST["picture2IsFile"] !== null){
                $picture2IsFile = $_REQUEST["picture2IsFile"];
                if($picture2IsFile === "true"){
                    $picture2Type = $_FILES["picture2"]["type"];
                    if(($picture2Type === 'image/png')||($picture2Type === 'image/jpeg')){
                        $picture2Files = $_FILES["picture2"];
                    }else{
                        $pass = false;
                    }
                }
            }
             //確認封面圖3沒有問題
            $picture3Files = null;
            if($_REQUEST["picture3IsFile"] !== null){
                $picture3IsFile = $_REQUEST["picture3IsFile"];
                if($picture3IsFile === "true"){
                    $picture3Type = $_FILES["picture3"]["type"];
                    if(($picture3Type=== 'image/png')||($picture3Type === 'image/jpeg')){
                        $picture3Files = $_FILES["picture3"];
                    }else{
                        $pass = false;
                    }
                }
            }
            if($pass){//這個通過就可以存入DB且存入server資料夾中
                $time = '00:00:00';
                $start = date('Y-m-d H:i:s',strtotime($start_date . ' ' . $time));
                $close = date('Y-m-d H:i:s',strtotime($close_date . ' ' . $time));
                //封面圖
                if($frontPictureIsFile === "true"){ //是File
                    $str = substr($frontPictureLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                    $filename = '.'.$str;
                    if(file_exists($filename)){
                        unlink($filename);//刪除文件
                    }
                    $frontPictureFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["frontPicture"]["name"], PATHINFO_EXTENSION);
                    $frontPictureLink = "https://360.systemdynamics.tw/backendPHP/ExFrontPicture/".$frontPictureFilename;
                    move_uploaded_file($_FILES["frontPicture"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExFrontPicture/".$frontPictureFilename);
                }else{ //不是File一定是是網址
                    $frontPictureLink = $_REQUEST["frontPicture"];
                }
                if($picture2IsFile === "true"){ //是File
                    if($picture2Link !== ""){//表示資料庫存的原路徑不是空的
                        $str = substr($picture2Link, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    if(isset($picture2Files)){ //新增檔案到server
                        $picture2Filename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["picture2"]["name"], PATHINFO_EXTENSION);
                        $picture2Link = "https://360.systemdynamics.tw/backendPHP/ExPicture2/".$picture2Filename;
                        move_uploaded_file($_FILES["picture2"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExPicture2/".$picture2Filename);
                    }
                }else if($picture2IsFile === ''){ //想清空該檔案
                    if($picture2Link !== ""){//表示資料庫存的原路徑不是空的
                        $str = substr($picture2Link, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    $picture2Link = '';
                }else{ //是網址
                    $picture2Link = $_REQUEST["picture2"];
                }
                if($picture3IsFile === "true"){ //是File
                    if($picture3Link !== ""){//表示資料庫存的原路徑不是空的
                        $str = substr($picture3Link, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    if(isset($picture3Files)){
                        $picture3Filename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["picture3"]["name"], PATHINFO_EXTENSION);
                        $picture3Link = "https://360.systemdynamics.tw/backendPHP/ExPicture3/".$picture3Filename;
                        move_uploaded_file($_FILES["picture3"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ExPicture3/".$picture3Filename);
                    }
                }else if($picture3IsFile === ''){ //想清空該檔案
                    if($picture3Link !== ''){//表示資料庫存的原路徑不是空的
                        $str = substr($picture3Link, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }
                    }
                    $picture3Link = '';
                }else{ //是網址
                    $picture3Link = $_REQUEST["picture3"];
                }
                if(($_GET["eID"] !== "" )&&($usr !== "")&&(isset($_GET["eID"]))&&(isset($usr))){
                    $eID = $_GET["eID"];
                    editMyExData($eID, $usr, $name, $eIntro, $start, $close, $permission, $frontPictureLink, $picture2Link , $picture3Link );
                    $list["error"] = false;
                    $list["cause"] = "更新展場成功!!"; 
                }else{
                    $list["error"] = true;
                    $list["cause"] = "錯誤: 編輯展場未成功!!"; 
                }
            }else{
                $list["error"] = true;
                $list["cause"] = "錯誤: 部分檔案格式已經消失!!!"; 
            }
            echo json_encode($list);
            break;
        //=============== Manage Item ===================
        case "EditItem":
            $usr = $_SESSION["userID"];
            $name = $_REQUEST["name"];//前端用formData加上POST傳值
            $intro = $_REQUEST["intro"];
            $permission = $_REQUEST["permission"];
            $iID = $_REQUEST["iID"];
            $response = array();
            if ((isset($iID)) &(isset($name)) & (isset($intro)) & (isset($permission)) & ($name != "") & ($intro != "")& ($permission != "")& ($iID != "")) {
                if((isset($_FILES["img2D"]))){
                    $imgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["img2D"]["name"], PATHINFO_EXTENSION);
                        //uniqid是生成微分秒，裡面的參數就是你可以加上的前綴
                    //因為有可能發生多使用者同時上傳全景圖，還是可能導致微分咬相同，所以特別再用userID當作前綴分開 
                    $imgLink = "https://360.systemdynamics.tw/backendPHP/ItemImg/".$imgFilename;
                    move_uploaded_file($_FILES["img2D"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ItemImg/".$imgFilename);
                    //刪除資料夾的檔案
                    DelPic($iID);
                }else{
                    $imgLink =$_REQUEST["img2D"];
                }
                //3D
                if((isset($_FILES["object3D"]))){
                    $objFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["object3D"]["name"], PATHINFO_EXTENSION);
                    //uniqid是生成微分秒，裡面的參數就是你可以加上的前綴
                    //因為有可能發生多使用者同時上傳全景圖，還是可能導致微分咬相同，所以特別再用userID當作前綴分開 
                    $object3D = "https://360.systemdynamics.tw/backendPHP/Item3D/".$objFilename;
                       move_uploaded_file($_FILES["object3D"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/Item3D/".$objFilename);
                    //刪除資料夾的檔案
                        DelItem3D($iID);
                }else{
                    $object3D = $_REQUEST["object3D"];
                }
                //music
                if((isset($_FILES["musicLink"]))){
                    $musicFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["musicLink"]["name"], PATHINFO_EXTENSION);
                    //uniqid是生成微分秒，裡面的參數就是你可以加上的前綴
                    //因為有可能發生多使用者同時上傳全景圖，還是可能導致微分咬相同，所以特別再用userID當作前綴分開 
                    $musicLink = "https://360.systemdynamics.tw/backendPHP/ItemMusic/".$musicFilename;
                    move_uploaded_file($_FILES["musicLink"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ItemMusic/".$musicFilename);
                    //刪除資料夾的檔案
                    DelItemMusic($iID);
                }else{
                    $musicLink = $_REQUEST["musicLink"];
                }
            if($musicLink == "")
                DelItemMusic($iID);
            if($imgLink == "" | $object3D==""){//| $object3D==""
                $response['state'] = 'invalid';
                $response['cause'] = '表單不能有空值';
                echo json_encode($response);
            }elseif (EditItem($iID,$name, $intro, $imgLink, $object3D, $permission,$usr,$musicLink)) {
                $response['state'] = 'valid';
                $response['cause'] = '更新成功';
                echo json_encode($response);
            } else {
                $response['state'] = 'invalid';
                $response['cause'] = '已有此作品';
                echo json_encode($response);
            }
        } else {
            $response['state'] = 'invalid';
            $response['cause'] = '表單不能有空值';
            echo json_encode($response);
        }
        break;
    case "ShowItem"://展品
        if(isset($_REQUEST['iID'])){
            $iID = $_REQUEST['iID'];
        }else{
            $iID = '';
        }
        $list = ShowItem($iID);
        echo json_encode($list);
        break;
    case "get3D":
        if(isset($_REQUEST['iID'])){
            $iID = $_REQUEST['iID'];
        }else{
            $iID = '';
        }
        $list = get3D($iID);
        echo json_encode($list);
        break;
    case "AddItem":
        $response = array();
        $usr = $_SESSION["userID"];
        $name = $_REQUEST["name"];//前端用formData加上POST傳值
        $imageType = $_FILES["img2D"]["type"];//他的副檔名，但是是用MIME格式紀錄image/png、image/jpeg、image/gif
        $intro = $_REQUEST["intro"];
        $permission = $_REQUEST["permission"];
        $object3D = $_FILES["object3D"]["name"];
        if ((isset($name)) & (isset($intro)) & (isset($permission)) & ($name != "") & ($intro != "")& ($permission != "")) {//& (isset($object3D))  & ($object3D != "") 
            if(($imageType === 'image/png')||($imageType === 'image/jpeg')||($imageType === 'image/gif')){
            //上面有可能縮圖報錯，所以全景圖在上方先不要存，移動到這邊確定縮圖沒問題再存
                $imgFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["img2D"]["name"], PATHINFO_EXTENSION);
                //uniqid是生成微分秒，裡面的參數就是你可以加上的前綴
                //因為有可能發生多使用者同時上傳全景圖，還是可能導致微分咬相同，所以特別再用userID當作前綴分開 
                $imgLink = "https://360.systemdynamics.tw/backendPHP/ItemImg/".$imgFilename;
                move_uploaded_file($_FILES["img2D"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ItemImg/".$imgFilename);
                //move_uploaded_file(file,newloc) 解釋: file(必需。規定要移動的檔案) newloc(必需。規定檔案的新位置)
                // $FILES["file"]["name"]  客戶端電腦上文件的原始名稱。
                // $FILES["file"]["tmp_name"] 上傳文件儲存在伺服器上的臨時文件名。
                //3D
                if ((substr($object3D,-3)== 'obj')|| (substr($object3D,-3)== 'glb')){
                    $modelFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["object3D"]["name"], PATHINFO_EXTENSION);
                    $object3D = "https://360.systemdynamics.tw/backendPHP/Item3D/".$modelFilename;
                    move_uploaded_file($_FILES["object3D"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/Item3D/".$modelFilename);
                    if(isset($_FILES["musicLink"])){
                        $musicLinkType = $_FILES["musicLink"]["type"];
                        //musicLink
                        $musicFilename = uniqid($_SESSION["userID"]).'.'.pathinfo($_FILES["musicLink"]["name"], PATHINFO_EXTENSION);
                        $musicLink = "https://360.systemdynamics.tw/backendPHP/ItemMusic/".$musicFilename;
                        move_uploaded_file($_FILES["musicLink"]["tmp_name"], $_SERVER['DOCUMENT_ROOT']."/backendPHP/ItemMusic/".$musicFilename);
                    }else{
                        $musicLink="";
                    }
                    if(AddItem($name, $intro, $imgLink, $object3D, $permission,$usr,$musicLink)) {
                        $response['state'] = 'valid';
                        $response['cause'] = '新增成功';
                        echo json_encode($response);
                    } else {
                        $response['state'] = 'invalid';
                        $response['cause'] = '已有此作品';
                        echo json_encode($response);
                    }
                }else{
                    $response['state']='invalid';
                    $response['cause']='展品格式錯誤，只能是.obj/.glb';
                    echo json_encode($response);
                }    
            }else{
                $response['state']='invalid';
                $response['cause']='展品代表圖格式錯誤，只能是.jpg/.jpeg/.png/.gif';
                echo json_encode($response);
            }           
        } else {
            $response['state'] = 'invalid';
            $response['cause'] = '表單不能有空值';
            echo json_encode($response);
        }
        break;
    case "DeleteItem"://刪展品
        $list = array();
        $usr = $_SESSION["userID"];
        $iID = $_REQUEST['iID'];
        if(isset($iID) && isset($usr) && ($usr != "")){
            $list = DeleteItem($usr,$iID);
            echo json_encode($list);
            break;
        }
        $list["isDelete"] = false;
        $list["cause"] = "錯誤!!";
        echo json_encode($list);
        break;
    case "checkItemAccess":
        $list = array();
        $usr = $_SESSION["userID"];
        $iID = $_REQUEST['iID'];
        if (isset($iID) && isset($usr) && ($usr != "")){
            $list = checkItemAccess($usr,$iID);
            echo json_encode($list);
            break;
        }
        $list["access"] = false;
        $list["cause"] = "權限不足，無法編輯";
        echo json_encode($list);
        break;
    case "getItem"://展品
        $usr = $_SESSION["userID"];
        $list = getItem($usr);
        echo json_encode($list);
        break;
    case "getMyItemStatistics":
        $response = array();
        if((isset($_SESSION["userID"])) && ($_SESSION["userID"] !== "")){
            $usr = $_SESSION["userID"];
            $response["statistics"] = getMyItemStatistics($usr);
            $response["status"] = "valid";
        }else{
            $response["status"] ="invalid";
        }
        echo json_encode($response);
        break;
    default:
}
?>