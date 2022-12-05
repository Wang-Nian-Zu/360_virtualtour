<?php
require_once("dbconfig.php");
//加入新使用者
function addMember($first_name,$last_name,$pwd,$email,$gender,$intro,$photo) {
    $pwdHash=password_hash($pwd, PASSWORD_DEFAULT); //將密碼hash
    global $db;
    $sql = "SELECT email FROM user WHERE email = ? ;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    if($rs = mysqli_fetch_assoc($result)){ //檢查用戶的電子郵件有無重複
        return false;
    }else{//看有沒有抓到result那張select出來的表 
        $sql2 = "INSERT INTO user (first_name, last_name, email, password, gender , intro , photo) VALUES (?, ?, ?, ?, ?, ?, ?)"; //sql指令的insert語法
        $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
        mysqli_stmt_bind_param($stmt2, "sssssss", $first_name, $last_name , $email, $pwdHash, $gender, $intro,$photo); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt2);  //執行SQL
        return true;
    }
}
function loginCheck($email,$pwd){
    global $db;
    $sql = "SELECT * FROM user WHERE email = ? ;"; 
    //先寫一個sql指令，將使用者輸入的值?，用PASSWORD加密過，在跟password欄位比較是否相同
    //盡量用statement物件($stat)會比較安全
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_bind_param($stmt,"s",$email);//將使用者輸入的password，用字串的形式，去bind到$sql指令的?
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    while($rs = mysqli_fetch_assoc($result)){ //看有沒有抓到result那張select出來的表 
        $correct_pwd = $rs['password'];//將密碼取出
        if(password_verify($pwd,$correct_pwd)){ //之後再比較相同用戶名欄位
            $_SESSION["userID"] = $rs['id'];
            return true;
        }else{
            $_SESSION["userID"] = '';
        }
    }  
    return false;
}
function getUsername($userID){
    global $db;
    $sql = "SELECT * FROM user WHERE id = ? ;"; 
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_bind_param($stmt,"i",$userID);//將使用者輸入的password，用字串的形式，去bind到$sql指令的?
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    if($rs = mysqli_fetch_assoc($result)){ 
        $ret = $rs["last_name"];
    }
    return $ret;
}
function getExhibitionList(){
    global $db;
    $sql = "SELECT * from `exhibition` INNER JOIN `user` ON `exhibition`.`creatorID` = `user`.`id` WHERE `permission` = 'public' AND  NOW() < `closeTime`;"; 
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    while($rs = mysqli_fetch_assoc($result)){
        $tArr=array(); //一維陣列存下面個欄位變數
        $tArr['eID']=$rs['eID'];
        $tArr['name']=$rs['name'];
        $tArr['creatorID']=$rs['creatorID'];
        $tArr['eIntro']=$rs['eIntro'];
        $tArr['frontPicture']=$rs['frontPicture'];
        $tArr['first_name']=$rs['first_name'];
        $tArr['last_name']=$rs['last_name'];
        $retArr[] = $tArr;
    }
    return $retArr;//最後是回傳一個二維陣列
}

function getExhibitionData($eID) {
    global $db;
    $sql = "SELECT * FROM `exhibition` INNER JOIN `user` ON `exhibition`.`creatorID` = `user`.`id` WHERE `exhibition`.`eID` = ? ;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$eID);
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $tArr=array(); 
    if($rs = mysqli_fetch_assoc($result)){
        $tArr['eID']=$rs['eID'];
        $tArr['name']=$rs['name'];
        $tArr['creatorID']=$rs['creatorID'];
        $tArr['eIntro']=$rs['eIntro'];
        $tArr['frontPicture']=$rs['frontPicture'];
        $tArr['startTime']=$rs['startTime'];
        $tArr['closeTime']=$rs['closeTime'];
        $tArr['first_name']=$rs['first_name'];
        $tArr['last_name']=$rs['last_name'];
        $tArr['permission']=$rs['permission'];
        $tArr['picture2']=$rs['picture2'];
        $tArr['picture3']=$rs['picture3'];
    }
    return $tArr; 
}
function LoginExhibitionList($usr){//登入後顯示展覽
    global $db;
    $sql = "SELECT * FROM user INNER JOIN exhibition ON exhibition.creatorID=user.id
           LEFT JOIN subscribe ON subscribe.`creator`=exhibition.creatorID  
          WHERE NOW()<exhibition.closeTime
          AND (exhibition.permission='public' OR (exhibition.permission='subscribeOnly' AND  subscribe.`subscriber`=? AND subscribe.`status`='true' ))
          GROUP BY exhibition.eID
          ORDER BY  case when subscribe.status is null then 1 else 0 end,subscribe.status;"; 
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_bind_param($stmt, "i", $usr);
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    while($rs = mysqli_fetch_assoc($result)){
        $tArr=array(); //一維陣列存下面個欄位變數
        $tArr['eID']=$rs['eID'];
        $tArr['name']=$rs['name'];
        $tArr['creatorID']=$rs['creatorID'];
        $tArr['eIntro']=$rs['eIntro'];
        $tArr['frontPicture']=$rs['frontPicture'];
        $tArr['first_name']=$rs['first_name'];
        $tArr['last_name']=$rs['last_name'];
        $retArr[] = $tArr;
    }
    return $retArr;//最後是回傳一個二維陣列
}
//---------------------------------------------------------------------------------------
function getCuratorList(){//顯示公開策展人
    global $db;
    $sql = "SELECT * FROM user INNER JOIN exhibition ON exhibition.creatorID=user.id GROUP BY user.id;"; //WHERE exhibition.permission='public' && NOW()>exhibition.startTime && NOW()<exhibition.closeTime 
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    while($rs = mysqli_fetch_assoc($result)){
        $tArr=array(); //一維陣列存下面個欄位變數
        $tArr['id']=$rs['id'];
        $tArr['name']=$rs['name'];
        $tArr['creatorID']=$rs['creatorID'];
        $tArr['intro']=$rs['intro'];
        $tArr['photo']=$rs['photo'];
        $tArr['first_name']=$rs['first_name'];
        $tArr['last_name']=$rs['last_name'];
        $retArr[] = $tArr;
    }
    return $retArr;//最後是回傳一個二維陣列
}
//new
function LoginCuratorList($usr) {//登入後顯示有訂閱的策展者
    global $db;   
    //訂閱的
    $sql="SELECT * FROM user INNER JOIN exhibition ON exhibition.creatorID=user.id
          LEFT JOIN subscribe ON subscribe.`creator`=exhibition.creatorID  
          WHERE subscribe.`subscriber`=? AND subscribe.`status`='true' 
          GROUP BY exhibition.creatorID";// NOW()>exhibition.startTime && NOW()<exhibition.closeTime AND 
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "i", $usr);  
    mysqli_stmt_execute($stmt); //執行SQL
    $result = mysqli_stmt_get_result($stmt);
    $rows = array();//宣告空陣列
    while($r = mysqli_fetch_assoc($result)) {//用欄位名稱當助標 抓出一筆       
        $temp=array();
        $temp['id']=$r['id'];
        $temp['intro']=$r['intro'];
        $temp['photo']=$r['photo'];
        $temp['last_name']=$r['last_name'];
        $temp['first_name']=$r['first_name'];  
        $rows[] = $temp;
    }  
    //除了訂閱的
    $sql_query="SELECT * FROM user INNER JOIN exhibition ON exhibition.creatorID=user.id 
            where exhibition.creatorID not in 
               (SELECT exhibition.creatorID FROM user INNER JOIN exhibition ON exhibition.creatorID=user.id
                LEFT JOIN subscribe ON subscribe.`creator`=exhibition.creatorID  
                WHERE subscribe.`subscriber`=? AND subscribe.`status`='true' GROUP BY exhibition.creatorID)
            GROUP BY exhibition.creatorID";// NOW()>exhibition.startTime && NOW()<exhibition.closeTime AND 
    $stmt = mysqli_prepare($db, $sql_query); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "i", $usr);  
    mysqli_stmt_execute($stmt); //執行SQL
    $data = mysqli_stmt_get_result($stmt);
    while($r = mysqli_fetch_assoc($data)) {//用欄位名稱當助標 抓出一筆       
        $temp=array();
        $temp['id']=$r['id'];
        $temp['intro']=$r['intro'];
        $temp['photo']=$r['photo'];
        $temp['last_name']=$r['last_name'];
        $temp['first_name']=$r['first_name'];  
        $rows[] = $temp;
    }
    return json_encode($rows);//json_encode轉成符合json的字串
}

function getCuratorData($id) {
    global $db;
    $sql = "SELECT * FROM `user` INNER JOIN `exhibition` ON `exhibition`.`creatorID` = `user`.`id` WHERE `user`.`id` = ? ;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$id);
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $tArr=array(); 
    while($rs = mysqli_fetch_assoc($result)){
        $tArr['id']=$rs['id'];
        //$tArr['name']=$rs['name'];
        $tArr['creatorID']=$rs['creatorID'];
        $tArr['intro']=$rs['intro'];
        $tArr['photo']=$rs['photo'];
        $tArr['first_name']=$rs['first_name'];
        $tArr['last_name']=$rs['last_name'];
        $sql_query = "SELECT * FROM `exhibition` WHERE `creatorID`='".$rs['id']."' && exhibition.permission='public' && NOW()>exhibition.startTime && NOW()<exhibition.closeTime;";
        $data = mysqli_query($db,$sql_query) or die("Query Fail! ".mysqli_error($db));
        $V=1;
        while($row=mysqli_fetch_assoc($data)){
            $tArr["exhibition".$V]=$row['name'];
            $V=$V+1;
        }
    }
    
    return $tArr;
}
function getCuSubsCount($id){ //subscribe數量
    global $db;
    $sql = "SELECT count(*) AS SubCount FROM `subscribe` WHERE `subscribe`.`creator` = ? AND `status` = 'true' ;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array();
    if($rs = mysqli_fetch_assoc($result)){
        $retArr["SubCount"] = $rs["SubCount"];
    }
    return $retArr;
}

function SubscribeOrNot($cid, $usr){
    global $db;
    $sql = "SELECT * FROM `subscribe` WHERE `subscriber`='".$usr."' && `creator`='".$cid."' && `status`='true';"; 
    $data = mysqli_query($db,$sql) or die("Query Fail! ".mysqli_error($db));
    $numRow = mysqli_num_rows($data);
    $retArr=array();
    if ($numRow ==0) {
        $retArr['sub'] = false;
    }else{
        $retArr['sub'] = true;
    }
    return $retArr;
}

function subscribe($sid,$cid){  
        global $db;
        
        $sql_query = "SELECT * FROM `subscribe` WHERE `subscriber`='".$sid."' && `creator`='".$cid."' && `status`='false';";
        $data = mysqli_query($db,$sql_query) or die("Query Fail! ".mysqli_error($db));
        $numRow = mysqli_num_rows($data);
        if ($numRow ==0){ 
            $sql="INSERT INTO subscribe (subscriber, creator) VALUES (?, ?)"; 
            $stmt = mysqli_prepare($db, $sql); //prepare sql statement
            mysqli_stmt_bind_param($stmt, "ii", $sid, $cid);
            mysqli_stmt_execute($stmt);  //執行SQL
        }else{
            $sql="UPDATE `subscribe` SET `status`='true' WHERE subscriber=? && creator=? ;"; 
            $stmt = mysqli_prepare($db, $sql); //prepare sql statement
            mysqli_stmt_bind_param($stmt, "ii", $sid, $cid);
            mysqli_stmt_execute($stmt);  //執行SQL
        }
        echo "subscribe success";
}
    
function unSubscribe($sid,$cid){
        global $db;
        $sql="UPDATE `subscribe` SET `status`='false' WHERE subscriber=? && creator=? ;"; 
        $stmt = mysqli_prepare($db, $sql); //prepare sql statement
        mysqli_stmt_bind_param($stmt, "ii", $sid, $cid);
        mysqli_stmt_execute($stmt);  //執行SQL
        //"<script type='text/javascript'>alert('成功退訂');location.href='".$_SERVER["HTTP_REFERER"]."';</script>"
        echo "unsubscribe!";
}
function CuratorEx($id){//沒登入顯示策展者公開展覽
    global $db;
    $sql_query = "SELECT * FROM `exhibition` WHERE `creatorID`='".$id."' && exhibition.permission='public' ORDER BY exhibition.createTime DESC;";// && NOW()>exhibition.startTime && NOW()<exhibition.closeTime
    $data = mysqli_query($db,$sql_query) or die("Query Fail! ".mysqli_error($db));
    $tArr=array(); 
    while($row=mysqli_fetch_assoc($data)){ 
        $temp=array();
        $temp["exhibition"]=$row['name'];  
        $temp["eID"]=$row['eID'];
        $temp["frontPicture"]=$row['frontPicture'];
        $temp["createTime"]=$row['createTime'];
        $temp["startTime"]=$row['startTime'];
        $temp["closeTime"]=$row['closeTime'];
        $tArr[] = $temp;
    }    
    return $tArr;
}

function LoginCuratorEx($id,$usr){//登入顯示策展者展覽(詳細)
    global $db;
    $sql_query = "SELECT * FROM `exhibition` LEFT JOIN subscribe ON subscribe.`creator`=exhibition.creatorID WHERE `creatorID`='".$id."'  
     && (exhibition.permission='public' OR (exhibition.permission='subscribeOnly' AND  subscribe.`subscriber`='".$usr."' AND subscribe.`status`='true' ))
     GROUP BY exhibition.eID ORDER BY exhibition.createTime DESC;";//&& NOW()>exhibition.startTime && NOW()<exhibition.closeTime 
    $data = mysqli_query($db,$sql_query) or die("Query Fail! ".mysqli_error($db));
    $tArr=array(); 
    while($row=mysqli_fetch_assoc($data)){ 
        $temp=array();
        $temp["exhibition"]=$row['name'];  
        $temp["eID"]=$row['eID'];
        $temp["createTime"]=$row['createTime'];
        $temp["frontPicture"]=$row['frontPicture'];
        $temp["startTime"]=$row['startTime'];
        $temp["closeTime"]=$row['closeTime'];
        $tArr[] = $temp;
    }    
    return $tArr;
}
//---------------------------------------------------------------------------------------
function getExLikeCount($eID){
    global $db;
    $sql = "SELECT count(*) AS likeCount FROM `likes` WHERE `likes`.`eID` = ? AND `status` = 'true' ;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$eID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array();
    if($rs = mysqli_fetch_assoc($result)){
        $retArr["likeCount"] = $rs["likeCount"];
    }
    return $retArr;
}

function getLikeorNot($eID,$userID){ //確認有沒有按愛心
    global $db;
    $sql = "SELECT * FROM `likes` WHERE `likes`.`userID` = ? AND `likes`.`eID` = ? ;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$userID,$eID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array();
    if($rs = mysqli_fetch_assoc($result)){
        if($rs['status'] === 'true'){//表示你有按愛心
            $retArr['like'] = true;
        }else{//表示你沒有按愛心
            $retArr['like'] = false;
        }
    }else{//沒有抓到資料，表示使用者完全沒按過該展覽喜歡
        $retArr['like'] = false; //表示你沒有按愛心
    }
    return $retArr;
}
function AddLike($userID,$eID){
    global $db;
    $sql = "SELECT * FROM `likes` WHERE `likes`.`userID` = ? AND `likes`.`eID` = ? ;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$userID,$eID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if($rs = mysqli_fetch_assoc($result)){//如果有撈到資料，就將該資料改個狀態就好
        $sql2 = "UPDATE `likes` SET `status` = 'true' WHERE `likes`.`userID` = ? AND `likes`.`eID` = ? ;"; 
        $stmt2 = mysqli_prepare($db, $sql2);
        mysqli_stmt_bind_param($stmt2,"ii",$userID,$eID);
        mysqli_stmt_execute($stmt2);
        echo "update done !!!";
    }else{//如果撈不到資料，就自己新增一個
        $sql3 = "INSERT INTO `likes` (`userID`,`eID`,`status`) VALUES (? , ? , true);"; 
        $stmt3 = mysqli_prepare($db, $sql3);
        mysqli_stmt_bind_param($stmt3,"ii",$userID,$eID);
        mysqli_stmt_execute($stmt3);
        echo "insert done !!!";
    }
}
function CancelLike($eID,$userID){
    global $db;
    $sql = "UPDATE `likes` SET `status` = 'false' WHERE `likes`.`userID` = ? AND `likes`.`eID` = ? ;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$userID,$eID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    echo "update done !!!";
}
function checkIsYourEx($usr,$eID){
    global $db;
    $sql = "SELECT `exhibition`.`creatorID` FROM `exhibition` WHERE `exhibition`.`eID` = ? ;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$eID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if($rs = mysqli_fetch_assoc($result)){
        if($rs["creatorID"] === $usr){
            return true;
        }
    }
    return false;
}
function checkUserCanView($usr,$eID){
    global $db;
    $sql = "SELECT * FROM `exhibition` WHERE `exhibition`.`eID` = ?;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$eID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $retArr = array();
    if($rs = mysqli_fetch_assoc($result)){
        date_default_timezone_set('Asia/taipei');
        $now   = new DateTime();
        $start   = new DateTime($rs["startTime"]);
        $close   = new DateTime($rs["closeTime"]);
        if(($rs['permission'] !== "private") AND ($start <= $now) AND ($close > $now) ){
            if($rs['permission'] === "subscribeOnly"){
                if($rs['creatorID'] === $usr){
                    $retArr["canView"] = true;
                }else{
                    $sql2 = "SELECT *, count(*) AS `haveSubscribed` FROM `subscribe` WHERE `subscribe`.`subscriber` = ? AND `subscribe`.`creator` = ?;"; 
                    $stmt2 = mysqli_prepare($db, $sql2);
                    mysqli_stmt_bind_param($stmt2,"ii",$usr, $rs["creatorID"]);
                    mysqli_stmt_execute($stmt2);
                    $result2 = mysqli_stmt_get_result($stmt2);
                    if($rs2 = mysqli_fetch_assoc($result2)){
                        if($rs2["haveSubscribed"] > 0){
                            $retArr["canView"] = true;
                        }else{
                            $retArr["canView"] = false;
                        }
                    }
                }
            }else{
                $retArr["canView"] = true;
            }
        }else{
            $retArr["canView"] = false;
        }
    }
    return $retArr;
}
function checkVisitorCanView($eID){
    global $db;
    $sql = "SELECT * FROM `exhibition` WHERE `exhibition`.`eID` = ?;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$eID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $retArr = array();
    $retArr["canView"] = false;
    if($rs = mysqli_fetch_assoc($result)){
        date_default_timezone_set('Asia/taipei');
        $now   = new DateTime();
        $start   = new DateTime($rs["startTime"]);
        $close   = new DateTime($rs["closeTime"]);
        if(($rs['permission'] === "public") AND ($start <= $now) AND ($close > $now) ){
            $retArr["canView"] = true;
        }
    }
    return $retArr;
}
function getFirstPanoramaData($eID){ //撈展場的第一場景資訊
    global $db;
    $sql = "SELECT * FROM `exhibition` INNER JOIN `exhibitivepanorama`
    ON `exhibitivepanorama`.`epID` = `exhibition`.`firstScene`  
    WHERE `exhibition`.`eID` = ? AND `exhibitivepanorama`.`eID` = ? ;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$eID,$eID); 
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $retArr = array(); //創建一個陣列，將所有要傳到前端的東西都丟進來
    if($rs = mysqli_fetch_assoc($result)){
        $retArr["exhibitionName"] = $rs["name"];
        $retArr["mapImg"] = $rs["mapImg"];
        $creatorID = $rs["creatorID"];//去撈策展人用的id
        $firstScene = $rs["firstScene"];//去撈第一個場景資訊
        $firstConfig = array();//將第一個場景的全部config存入這個陣列，後續再存到retArr中
        $sql = "SELECT * FROM `exhibitivepanorama` 
            INNER JOIN `panorama` ON `exhibitivepanorama`.`pID` = `panorama`.`pID`  
            INNER JOIN `user` ON `panorama`.`ownerID` = `user`.`id`  
            WHERE `exhibitivepanorama`.`epID` = ? ;";
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$firstScene); 
        mysqli_stmt_execute($stmt);  
        $result = mysqli_stmt_get_result($stmt);
        if($rs2 = mysqli_fetch_assoc($result)){
            $firstConfig["sceneId"] = (string)$firstScene;
            $firstConfig["firstpID"] = $rs2["pID"];
            $firstConfig["firstmapX"] = $rs2["mapX"];
            $firstConfig["firstmapY"] = $rs2["mapY"];
            $firstConfig["name"] = $rs2["epName"]; //展示中的全景圖名稱
            if(($rs2["thumbnailLink"] !== NULL)&&($rs2["thumbnailLink"] !== "")){
                $firstConfig["smallimgLink"] =$rs2["thumbnailLink"];
            }else{
                $firstConfig["smallimgLink"] =$rs2["smallimgLink"];
            }
            $firstConfig["musicLink"] = $rs2["musicLink"];
            $firstConfig["imgLink"] = $rs2["imgLink"];
            $firstConfig["authorName"] = $rs2["first_name"].' '.$rs2["last_name"]; //展示中的全景圖是哪一位作者
            $hotspot = array(); // 裝場景一的所有hotspots
            //資訊 熱點
            $sql = "select * from `infospot` where `infospot`.`epID` = ? ;";
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"i",$firstScene); 
            mysqli_stmt_execute($stmt);  
            $result = mysqli_stmt_get_result($stmt);
            while($rs3 = mysqli_fetch_assoc($result)){
                $tArr = array();
                $tArr["type"] = "info";
                $tArr["pitch"] = $rs3["pitch"];
                $tArr["yaw"] = $rs3["yaw"];
                $tArr["title"] = $rs3["title"];
                $tArr["intro"] = $rs3["intro"];
                $tArr["scale"] = true;
                $hotspot[] = $tArr;
            }
            //移動 熱點
            $sql = "SELECT * FROM `movespot` INNER JOIN `exhibitivepanorama` ON `exhibitivepanorama`.`epID` = `movespot`.`nextScene`  
            where `movespot`.`epID` = ? ;";
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"i",$firstScene); 
            mysqli_stmt_execute($stmt);  
            $result = mysqli_stmt_get_result($stmt);
            while($rs4 = mysqli_fetch_assoc($result)){
                $tArr = array(); //存該movespot裡面的所有參數
                $argsArr = array(); //存clickHandlerArgs裡面的所有參數
                if($rs4["type"] === "ZoomIn"){
                    $tArr["clickHandlerFunc"] = "CameraZoomIn"; 
                    $argsArr["pitch"] = $rs4["pitch"];
                    $argsArr["yaw"] = $rs4["yaw"];
                    $argsArr["sceneId"] = (string)$rs4["nextScene"];
                    $tArr["clickHandlerArgs"] = $argsArr; //將要傳入function的參數準備好
                }elseif($rs4["type"] ==="FadeOut"){
                    $tArr["clickHandlerFunc"] = "SceneFadeOut";
                    $argsArr["sceneId"] = (string)$rs4["nextScene"];
                    $tArr["clickHandlerArgs"] = $argsArr; //將要傳入function的參數準備好
                }
                $tArr["type"] = "scene";
                $tArr["pitch"] = $rs4["pitch"];
                $tArr["yaw"] = $rs4["yaw"];
                $tArr["destinationName"] = $rs4["epName"];
                $tArr["scale"] = true;
                $hotspot[] = $tArr;
            }
            //客製化 熱點
            $sql = "SELECT *, `customspot`.`name` AS `itemName` ,`customspot`.`intro` AS `itemIntro`
            ,`customspot`.`musicLink` AS `CmusicLink` FROM  `customspot` INNER JOIN `item` ON `customspot`.`iID` = `item`.`iID` 
            INNER JOIN `user` ON `item`.`ownerID` = `user`.`id` WHERE `customspot`.`epID` = ?";
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"i",$firstScene); 
            mysqli_stmt_execute($stmt);  
            $result = mysqli_stmt_get_result($stmt);
            while($rs5 = mysqli_fetch_assoc($result)){
                $tArr = array();
                $tArr["type"] = "custom";
                $tArr["pitch"] = $rs5["pitch"];
                $tArr["yaw"] = $rs5["yaw"];
                $tArr["scale"] = true;
                $tArr["iID"] = $rs5["iID"];
                $Args = array();
                $Args["id"] = $rs5["csID"];
                $Args["authorName"] = $rs5["first_name"].' '.$rs5["last_name"];
                $Args["itemName"] = $rs5["itemName"];
                $Args["itemIntro"] = $rs5["itemIntro"];
                $Args["currentSceneName"] = $firstConfig["name"];
                $Args["img"] = $rs5["imageLink"];
                $Args["imageWidth"] = $rs5["imageWidth"];
                $Args["imageHeight"] = $rs5["imageHeight"];
                $Args["ownerID"] = $rs5["ownerID"];
                $Args["musicLink"] = $rs5["CmusicLink"];
                $Args["modelLink"] = $rs5["3DobjectLink"];
                $tArr["createTooltipArgs"] = $Args;
                $hotspot[] = $tArr;
            }
            $firstConfig["hotspots"] = $hotspot;
        }
        $retArr["firstConfig"] = $firstConfig;
   }
   return $retArr;
}

function getOtherPanoramaData($epID){
    global $db;
    $sql = "SELECT * FROM `exhibitivepanorama` 
    INNER JOIN `panorama` ON `exhibitivepanorama`.`pID` = `panorama`.`pID`  
    INNER JOIN `user` ON `panorama`.`ownerID` = `user`.`id`  
    WHERE `exhibitivepanorama`.`epID` = ? ;";

    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$epID); 
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $retArr = array();
    $retArr["sceneId"] = (string)$epID; //就是該展場場景的ID
    $config = array();
    if($rs = mysqli_fetch_assoc($result)){
        $config["pID"] = $rs["pID"];
        $config["mapX"] = $rs["mapX"];
        $config["mapY"] = $rs["mapY"];
        $config["name"] = $rs["epName"]; //展示中的全景圖名稱
        if(($rs["thumbnailLink"] !== NULL)&&($rs["thumbnailLink"] !== "")){
            $config["smallimgLink"] =$rs["thumbnailLink"];
        }else{
            $config["smallimgLink"] =$rs["smallimgLink"];
        }
        $config["musicLink"] = $rs["musicLink"];
        $config["imgLink"] = $rs["imgLink"];
        $config["authorName"] = $rs["first_name"].' '.$rs["last_name"]; //展示中的全景圖是哪一位作者
        $hotspot = array(); // 裝場景一的所有hotspots
        //【資訊】熱點
        $sql = "select * from `infospot` where `infospot`.`epID` = ? ;";
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$epID); 
        mysqli_stmt_execute($stmt);  
        $result = mysqli_stmt_get_result($stmt);
        while($rs2 = mysqli_fetch_assoc($result)){
            $tArr = array();
            $tArr["type"] = "info";
            $tArr["pitch"] = $rs2["pitch"];
            $tArr["yaw"] = $rs2["yaw"];
            $tArr["title"] = $rs2["title"];
            $tArr["intro"] = $rs2["intro"];
            $tArr["scale"] = true;
            $hotspot[] = $tArr;
        }
        //【移動】熱點
        $sql = "SELECT * FROM `movespot` INNER JOIN `exhibitivepanorama` ON `exhibitivepanorama`.`epID` = `movespot`.`nextScene`  
        where `movespot`.`epID` = ? ;";
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$epID); 
        mysqli_stmt_execute($stmt);  
        $result = mysqli_stmt_get_result($stmt);
        while($rs3 = mysqli_fetch_assoc($result)){
            $tArr = array(); //存該movespot裡面的所有參數
            $argsArr = array(); //存clickHandlerArgs裡面的所有參數
            if($rs3["type"] === "ZoomIn"){
                $tArr["clickHandlerFunc"] = "CameraZoomIn"; 
                $argsArr["pitch"] = $rs3["pitch"];
                $argsArr["yaw"] = $rs3["yaw"];
                $argsArr["sceneId"] = (string)$rs3["nextScene"];
                $tArr["clickHandlerArgs"] = $argsArr; //將要傳入function的參數準備好
            }elseif($rs3["type"] ==="FadeOut"){
                $tArr["clickHandlerFunc"] = "SceneFadeOut"; 
                $argsArr["sceneId"] = (string)$rs3["nextScene"];
                $tArr["clickHandlerArgs"] = $argsArr; //將要傳入function的參數準備好
            }
            $tArr["type"] = "scene";
            $tArr["pitch"] = $rs3["pitch"];
            $tArr["yaw"] = $rs3["yaw"];
            $tArr["destinationName"] = $rs3["epName"];
            $tArr["scale"] = true;
            $hotspot[] = $tArr;
        }
        //【客製化展品】熱點
        $sql = "SELECT *, `customspot`.`name` AS `itemName` ,`customspot`.`intro` AS `itemIntro`
        ,`customspot`.`musicLink` AS `CmusicLink`
        FROM  `customspot` INNER JOIN `item` ON `customspot`.`iID` = `item`.`iID` 
        INNER JOIN `user` ON `item`.`ownerID` = `user`.`id` WHERE `customspot`.`epID` = ?;";
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$epID); 
        mysqli_stmt_execute($stmt);  
        $result = mysqli_stmt_get_result($stmt);
        while($rs4 = mysqli_fetch_assoc($result)){
            $tArr = array();
            $tArr["type"] = "custom";
            $tArr["pitch"] = $rs4["pitch"];
            $tArr["yaw"] = $rs4["yaw"];
            $tArr["scale"] = true;
            $tArr["iID"] = $rs4["iID"];
            $Args = array();
            $Args["id"] = $rs4["csID"];
            $Args["authorName"] = $rs4["first_name"].' '.$rs4["last_name"];
            $Args["itemName"] = $rs4["itemName"];
            $Args["itemIntro"] = $rs4["itemIntro"];
            $Args["currentSceneName"] = $config["name"];
            $Args["img"] = $rs4["2DimgLink"];
            $Args["imageWidth"] = $rs4["imageWidth"];
            $Args["imageHeight"] = $rs4["imageHeight"];
            $Args["ownerID"] = $rs4["ownerID"];
            $Args["musicLink"] = $rs4["CmusicLink"];
            $Args["modelLink"] = $rs4["3DobjectLink"];
            $tArr["createTooltipArgs"] = $Args;
            $hotspot[] = $tArr;
        }
        $config["hotspots"] = $hotspot;
    }
    $retArr["config"] = $config;
    return $retArr;
}
function getAllPanoramaXY($eID){
    global $db;
    $retArr = array();
    $sql = "SELECT * FROM `exhibitivepanorama` WHERE `exhibitivepanorama`.`eID` = ?";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$eID); 
    mysqli_stmt_execute($stmt);  
    $result = mysqli_stmt_get_result($stmt);
    while($rs = mysqli_fetch_assoc($result)){
        $ret = array();
        $ret["id"] = $rs["epID"];
        $ret["name"] = $rs["epName"];
        $ret["mapX"] = $rs["mapX"];
        $ret["mapY"] = $rs["mapY"];
        $retArr[] = $ret;
    }
    return $retArr;
}
function getMyPhoto($usr){
    global $db;
    $sql = "SELECT * , count(*) AS total  FROM `user` WHERE `user`.`id` = ?"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt,"i", $usr); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    $ret = "";
    if($rs["total"] !== 0){
        $ret = $rs["photo"];
    }
    return $ret;
}

function uploadMyPanorama($name,$imgLink,$smallimgLink,$usr){
    if(($usr!="")&&(isset($usr))){
        global $db;
        $sql = "INSERT INTO panorama (`name`, `imgLink`, `smallimgLink`, `ownerID`) VALUES (?, ?, ?, ?)"; //sql指令的insert語法
        $stmt = mysqli_prepare($db, $sql); //prepare sql statement
        mysqli_stmt_bind_param($stmt, "sssi", $name, $imgLink, $smallimgLink, $usr); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt);  //執行SQL
        return true;
    }else{
        return false;
    }
}
function deleteMyPanorama($usr,$pID){
    $retArr = array();
    $retArr["cause"] = "!!";
    global $db;
    $sql = "SELECT * , count(*) as total FROM `panorama` 
            INNER JOIN `exhibitivepanorama` ON `panorama`.`pID` =  `exhibitivepanorama`.`pID` 
            WHERE `panorama`.`pID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$pID); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    if($rs["total"] > 0){
        $retArr["isDelete"] = false;//全景圖刪除失敗
        $retArr["cause"] = "場景有被其他展場使用，所以無法刪除";
        return $retArr;
    }
    //刪除server端的全景圖片
    $imgURL = $rs["imgLink"];
    $smallimgURL= $rs["smallimgLink"];
    $str = substr($imgURL, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
    $filename = '.'.$str; //  . + /PanoramaImg/heiufuiwef.jpg
    if(file_exists($filename)){
        unlink($filename);//刪除全景圖文件
        if(($smallimgURL !== "")&&(isset($smallimgURL))){//如果縮圖不為空
            $str = substr($smallimgURL, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
            $filename = '.'.$str;
            if(file_exists($filename)){
                unlink($filename);//刪除底部圖文件
            }else{
                $retArr["cause"] = " 警告: 伺服器沒有找到該底部圖";
            }
        }
    }else{
        $retArr["cause"] = " 警告: 伺服器沒有找到該全景圖";
    }
    $sql = "DELETE FROM `panorama` where `panorama`.`pID` = ? AND `panorama`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$pID,$usr); 
    mysqli_stmt_execute($stmt);
    $retArr["isDelete"] = true;//全景圖刪除成功
    return $retArr;
}
function checkPanoramaAccess($usr,$pID){
    $retArr = array();
    global $db;
    $sql = "SELECT * , count(*) as total FROM `panorama` INNER JOIN `exhibitivepanorama` ON `panorama`.`pID` =  `exhibitivepanorama`.`pID` WHERE `panorama`.`pID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$pID); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    if($rs["total"] > 0){
        $sql2="SELECT * FROM `panorama` INNER JOIN `exhibitivepanorama` 
            ON `panorama`.`pID` = `exhibitivepanorama`.`pID` 
            RIGHT JOIN `exhibition` ON `exhibitivepanorama`.`eID` = `exhibition`.`eID` 
            WHERE `panorama`.`pID` = ?; "; //撈出我的一張全景圖被那些展場所使用的資料
        $stmt2 = mysqli_prepare($db, $sql2);
        mysqli_stmt_bind_param($stmt2,"i", $rs["pID"]); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        $now   = new DateTime();
        while($rs2 = mysqli_fetch_assoc($result2)){
            $start  = new DateTime($rs2['startTime']);
            $close  = new DateTime($rs2['closeTime']);
            if(($rs2['permission'] !== "private") AND ($start <= $now) AND ($close > $now) ){//展示中判斷式
                $retArr["access"] = false;
                $retArr["cause"] = "場景展示中，無法編輯";
                return $retArr;
            }
        }    
    }
    $sql = "SELECT *  , count(*) as total FROM `panorama` WHERE `panorama`.`pID` = ? AND `panorama`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$pID,$usr); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    if($rs["total"] > 0){
        $retArr["access"] = true;
    }else{
        $retArr["access"] = false;
        $retArr["cause"] = "權限不足，無法編輯";
    }
    return $retArr;
}
function updateMyPanorama($pID,$name,$imgLink,$smallimgLink,$usr,$clearSmallImg,$permission){ //更新我的全景圖
    global $db;
    if(($clearSmallImg === false)&&($smallimgLink === "")){ //當使用者決定清除原先的縮圖以及他沒有給新的底部圖
        if($imgLink === ""){
            $sql = "UPDATE `panorama` SET `name`= ? , `permission` = ? WHERE `pID` = ? AND `ownerID` = ? ;";  
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"ssii",$name,$permission,$pID,$usr); 
            mysqli_stmt_execute($stmt); 
            return true;
        }else{
            deleteMyPanoramaFile($pID,$usr); //先刪除伺服器存放的全景圖片
            $sql = "UPDATE `panorama` SET `name`= ? , `imgLink` = ? , `permission` = ? WHERE `pID` = ? AND `ownerID` = ? ;";  
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"sssii",$name,$imgLink,$permission,$pID,$usr); 
            mysqli_stmt_execute($stmt); 
        }
    }else{//非上述情況，一律先刪除底部圖
        deleteMySmallPanoFile($pID,$usr);
        //-------------------------------------------------------------
        if($imgLink === ""){
            $sql = "UPDATE `panorama` SET `name`= ? , `smallimgLink` = ? , `permission` = ? WHERE `pID` = ? AND `ownerID` = ? ;";  
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"sssii",$name,$smallimgLink,$permission,$pID,$usr); 
            mysqli_stmt_execute($stmt); 
        }else{
            deleteMyPanoramaFile($pID,$usr); //先刪除伺服器存放的全景圖片
            $sql = "UPDATE `panorama` SET `name`= ? , `imgLink` = ? , `smallimgLink` = ? , `permission` = ? WHERE `pID` = ? AND `ownerID` = ? ;";  
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"ssssii",$name,$imgLink,$smallimgLink,$permission,$pID,$usr); 
            mysqli_stmt_execute($stmt); 
        }
    }
    return false;
}
function deleteMyPanoramaFile($pID,$usr){
    global $db;
    $sql = "SELECT * FROM `panorama` WHERE `panorama`.`pID` = ? AND `panorama`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$pID,$usr); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    if(isset($rs["imgLink"]) && $rs["imgLink"] !== ""){
        $OriginimgURL = $rs["imgLink"];
        $str = substr($OriginimgURL, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
        $filename = '.'.$str;
        if(file_exists($filename)){
            unlink($filename);//刪除底部圖文件
        }
    }
}
function deleteMySmallPanoFile($pID,$usr){
    global $db;
    $sql = "SELECT * FROM `panorama` WHERE `panorama`.`pID` = ? AND `panorama`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$pID,$usr); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    if(isset($rs["smallimgLink"]) && $rs["smallimgLink"] !== ""){
        $OriginSmallimgURL = $rs["smallimgLink"];
        $str = substr($OriginSmallimgURL, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
        $filename = '.'.$str;
        if(file_exists($filename)){
            unlink($filename);//刪除底部圖文件
        }
    }
}
function getMyPanoramaStatistics($usr){
    $retArr = array();
    $retArr["exhibitiveNum"] = 0;
    $retArr["waitingNum"] = 0;
    $retArr["neverUsedNum"] = 0;
    global $db;
    //先抓出所有被使用的全景圖
    $sql = "SELECT *  FROM `panorama` WHERE  `panorama`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$usr); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    while($rs = mysqli_fetch_assoc($result)){
        //你的每個全景圖個別有多少展場在使用，個別列出那些展場
        $sql2 = "SELECT * , count(*) as total FROM `panorama` INNER JOIN `exhibitivepanorama` ON `panorama`.`pID` =  `exhibitivepanorama`.`pID` WHERE `panorama`.`pID` = ?";  
        $stmt2 = mysqli_prepare($db, $sql2);
        mysqli_stmt_bind_param($stmt2,"i",$rs["pID"]); 
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        $rs2 = mysqli_fetch_assoc($result2);
        if($rs2["total"] > 0){
            //這些展場有沒有至少一個在展出中的
            $sql3="SELECT * FROM `panorama` INNER JOIN `exhibitivepanorama` 
                ON `panorama`.`pID` = `exhibitivepanorama`.`pID` 
                RIGHT JOIN `exhibition` ON `exhibitivepanorama`.`eID` = `exhibition`.`eID` 
                WHERE `panorama`.`pID` = ?; "; //撈出我的一張全景圖被那些展場所使用的資料
            $stmt3 = mysqli_prepare($db, $sql3);
            mysqli_stmt_bind_param($stmt3,"i", $rs2["pID"]); //bind parameters with variables(將變數bind到sql指令的問號中)
            mysqli_stmt_execute($stmt3); 
            $result3 = mysqli_stmt_get_result($stmt3);
            $now   = new DateTime();
            $breakloop = false;
            while($rs3 = mysqli_fetch_assoc($result3)){
                $start  = new DateTime($rs3['startTime']);
                $close  = new DateTime($rs3['closeTime']);
                if(($rs3['permission'] !== "private") AND ($start <= $now) AND ($close > $now) ){//展示中判斷式
                    $retArr["exhibitiveNum"] += 1 ; //這個全景圖已經至少在一個展場展示中
                    $breakloop = true;
                    break;
                }
            }    
            if($breakloop === false){
                $retArr["waitingNum"] += 1 ;
            }
        }
    }
    $sql = "SELECT count(*) as total  FROM `panorama` WHERE  `panorama`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$usr); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    if($rs = mysqli_fetch_assoc($result)) {
        $retArr["neverUsedNum"] = $rs["total"] - $retArr["waitingNum"] - $retArr["exhibitiveNum"];
    }
    return $retArr;
}
function getMyInfo($usr){//get my info
    global $db;
    $sql = "select * from user where id = ?;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$usr);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $tArr=array(); 
    if($rs = mysqli_fetch_assoc($result)){
        $tArr['first_name']=$rs['first_name'];
         $tArr['last_name']=$rs['last_name'];
         $tArr['intro']=$rs['intro'];
         $tArr['gender']=$rs['gender'];
         $tArr['photo']=$rs['photo'];
    }
    //subscriber數量
    $sql_query="SELECT  count(*) as SubCount FROM subscribe WHERE creator =? AND status='true';";
    $stmt = mysqli_prepare($db, $sql_query); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "i", $usr);  
    mysqli_stmt_execute($stmt); //執行SQL
    $data = mysqli_stmt_get_result($stmt);
    if($r = mysqli_fetch_assoc($data)) {//用欄位名稱當助標 抓出一筆       
        $tArr['SubCount']=$r['SubCount'];
    }    
    return $tArr;
}

function DelInfoPic($usr){
    global $db;
       $sql2 = "select photo from user where id = ?;"; 
       $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
       mysqli_stmt_bind_param($stmt2, "i",$usr); //bind parameters with variables(將變數bind到sql指令的問號中)
       mysqli_stmt_execute($stmt2);
       $result = mysqli_stmt_get_result($stmt2);
       if($rs = mysqli_fetch_assoc($result)){ 
           $imgLink = $rs["photo"];
           $d=substr($imgLink, 41,7);
           $file=substr($imgLink, 49);
           $fileName=substr($imgLink, 41);
           if($od=opendir($d)){ //$d是目錄名
               while(($f=readdir($od))!==false){ //讀取目錄內檔案
                   if($f===$file)
                       unlink($fileName);
                   /*else
                       echo"資料夾內沒有此檔案";     */                     
               }
           }           
       }
   }
function EditInfo($first_name, $intro, $imgLink, $last_name, $gender,$usr) {
    global $db;
    $sql2 = "update user set first_name =?,`intro`=?,`photo`=?,`last_name`=?,`gender`=?  where id=?;"; //sql指令的insert語法
        $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
        mysqli_stmt_bind_param($stmt2, "sssssi",$first_name, $intro,$imgLink,$last_name,$gender,$usr); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt2);  //執行SQL
        return true;
}
//ForgetPwd
function ForgetPwd($email,$newpwd) {
    $pwdHash=password_hash($newpwd, PASSWORD_DEFAULT); //將密碼hash
    global $db;
    $sql = "SELECT email FROM user WHERE email = ? ;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    if($rs = mysqli_fetch_assoc($result)){ //檢查用戶的電子郵件有無重複
        $sql2 = "UPDATE user SET `password`=?  WHERE email=?;"; //sql指令的insert語法
        $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
        mysqli_stmt_bind_param($stmt2, "ss", $pwdHash, $email); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt2);  //執行SQL
        return true;
    }else{//看有沒有抓到result那張select出來的表         
        return false;
    }
}
//EditPwd
function EditPwd($usr,$oldpwd,$newpwd) {
    $pwdHash=password_hash($newpwd, PASSWORD_DEFAULT); //將密碼hash
    global $db;
    $sql = "SELECT password FROM user WHERE id=?;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt, "i", $usr);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    $rs = mysqli_fetch_assoc($result);
    $correct_pwd = $rs['password'];//將密碼取出
    if(password_verify($oldpwd,$correct_pwd)){
        $sql2 = "UPDATE user SET `password`=?  WHERE id=?;"; //sql指令的insert語法
        $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
        mysqli_stmt_bind_param($stmt2, "si", $pwdHash, $usr); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt2);  //執行SQL
        return true;
    }else{//看有沒有抓到result那張select出來的表         
        return false;
    }
}
//以下是新增展場會用到的Model---------------------------------------------------------------------------------------------------
function getMyPanoramaList($usr){
    global $db;
    $sql = "SELECT * FROM `panorama` WHERE `panorama`.`ownerID` = ?"; 
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt,"i", $usr); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $retArr = array();
    while($rs = mysqli_fetch_assoc($result)){
        $tArr = array();
        $tArr["pID"] = $rs["pID"];
        $tArr["name"] = $rs["name"];
        $tArr["imgLink"] = $rs["imgLink"];
        $tArr["smallimgLink"] = $rs["smallimgLink"];
        $tArr["ownerID"] = $rs["ownerID"];
        $tArr["permission"] = $rs["permission"];
        //查詢該全景圖的作者的姓名
        $sql2 = "SELECT `user`.first_name, `user`.last_name FROM `panorama` INNER JOIN `user` ON `panorama`.`ownerID` = `user`.`id` 
        WHERE `panorama`.`pID` = ?";
        $stmt2 = mysqli_prepare($db, $sql2); 
        mysqli_stmt_bind_param($stmt2,"i", $rs["pID"]);
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        if($rs2 = mysqli_fetch_assoc($result2)){
            $tArr["authorName"] = $rs2["first_name"]." ".$rs2["last_name"];
        }
        //查詢該全景圖的被多少展場引用
        $sql3 = "SELECT `exhibitivepanorama`.`epID`, `exhibitivepanorama`.`pID` , count(*) as total 
                 FROM `panorama` INNER JOIN `exhibitivepanorama` ON `panorama`.`pID` = `exhibitivepanorama`.`pID` 
                 WHERE `panorama`.`pID` = ?";
        $stmt3 = mysqli_prepare($db, $sql3); //prepare sql statement
        mysqli_stmt_bind_param($stmt3,"i", $rs["pID"]); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt3); 
        $result3 = mysqli_stmt_get_result($stmt3);
        $rs3 = mysqli_fetch_assoc($result3);
        if($rs3["total"] !== 0){
            $sql4="SELECT * FROM `panorama` INNER JOIN `exhibitivepanorama` 
            ON `panorama`.`pID` = `exhibitivepanorama`.`pID` 
            RIGHT JOIN `exhibition` ON `exhibitivepanorama`.`eID` = `exhibition`.`eID` 
            WHERE `panorama`.`pID` = ?; "; //撈出我的一張全景圖被那些展場所使用的資料
            $stmt4 = mysqli_prepare($db, $sql4);
            mysqli_stmt_bind_param($stmt4,"i", $rs3["pID"]); //(將變數bind到sql指令的問號中)
            mysqli_stmt_execute($stmt4); 
            $result4 = mysqli_stmt_get_result($stmt4);
            $tArr["status"] = "waiting"; 
            $now   = new DateTime();
            while($rs4 = mysqli_fetch_assoc($result4)){
                $start  = new DateTime($rs4['startTime']);
                $close  = new DateTime($rs4['closeTime']);
                if(($rs4['permission'] !== "private") AND ($start <= $now) AND ($close > $now) ){//展示中判斷式
                    $tArr["status"] = "exhibitive"; 
                    break;
                }
            }
        }else{
            $tArr["status"] = "NeverUsed"; //該全景圖尚未使用在任何展場
        }
        $retArr[] = $tArr;
    }
    return $retArr;
}
function getPublicPanoramaList(){
    global $db;
    $sql = "SELECT * FROM `panorama` WHERE `panorama`.`permission` = 'public' "; 
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $retArr = array();
    while($rs = mysqli_fetch_assoc($result)){
        $tArr = array();
        $tArr["pID"] = $rs["pID"];
        $tArr["name"] = $rs["name"];
        $tArr["imgLink"] = $rs["imgLink"];
        $tArr["smallimgLink"] = $rs["smallimgLink"];
        $tArr["ownerID"] = $rs["ownerID"];
        $tArr["permission"] = $rs["permission"];
        //查詢該全景圖的作者的姓名
        $sql2 = "SELECT `user`.first_name, `user`.last_name FROM `panorama` INNER JOIN `user` ON `panorama`.`ownerID` = `user`.`id` 
        WHERE `panorama`.`pID` = ?";
        $stmt2 = mysqli_prepare($db, $sql2); 
        mysqli_stmt_bind_param($stmt2,"i", $rs["pID"]);
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        if($rs2 = mysqli_fetch_assoc($result2)){
            $tArr["authorName"] = $rs2["first_name"]." ".$rs2["last_name"];
        }
        $retArr[] = $tArr;
    }
    return $retArr;
}
function getMyItemList($usr){ //撈出特定使用者所有的展品
    global $db;
    $sql = "SELECT * FROM `item` WHERE `item`.`ownerID`=?"; 
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_bind_param($stmt, "i", $usr);
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    while($rs = mysqli_fetch_assoc($result)){
         $tArr=array(); //一維陣列存下面個欄位變數
        $tArr['iID']=$rs['iID'];
         $tArr['name']=$rs['name'];
         $tArr['modelLink']=$rs['3DobjectLink'];
         $tArr['intro']=$rs['intro'];
         $tArr['permission']=$rs['permission'];
        $tArr['imgLink']=$rs['2DimgLink'];
        $tArr['ownerID']=$rs['ownerID'];
        $tArr['musicLink'] = $rs['musicLink'];
        //查詢該展品的作者的姓名
        $sql2 = "SELECT `user`.first_name, `user`.last_name FROM `item` INNER JOIN `user` ON `item`.`ownerID` = `user`.`id` 
        WHERE `item`.`iID` = ?";
        $stmt2 = mysqli_prepare($db, $sql2); 
        mysqli_stmt_bind_param($stmt2,"i", $rs["iID"]);
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        if($rs2 = mysqli_fetch_assoc($result2)){
            $tArr["authorName"] = $rs2["first_name"]." ".$rs2["last_name"];
        }
         $retArr[] = $tArr;
    }
    return $retArr;//最後是回傳一個二維陣列
}
function getPublicItemList(){ //新增展場會用到(撈出平台所有公開狀態的展品)
    global $db;
    $sql = "SELECT * FROM item WHERE item.`permission`='public'"; 
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    while($rs = mysqli_fetch_assoc($result)){
         $tArr=array(); //一維陣列存下面個欄位變數
         $tArr['iID']=$rs['iID'];
         $tArr['name']=$rs['name'];
         $tArr['intro']=$rs['intro'];
         $tArr['permission']=$rs['permission'];
        $tArr['ownerID']=$rs['ownerID'];
        $tArr['imgLink']=$rs['2DimgLink'];
        $tArr['modelLink']=$rs['3DobjectLink'];
        $tArr['musicLink'] = $rs['musicLink'];
        //查詢該展品的作者的姓名
        $sql2 = "SELECT `user`.first_name, `user`.last_name FROM `item` INNER JOIN `user` ON `item`.`ownerID` = `user`.`id` 
        WHERE `item`.`iID` = ?";
        $stmt2 = mysqli_prepare($db, $sql2); 
        mysqli_stmt_bind_param($stmt2,"i", $rs["iID"]);
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        if($rs2 = mysqli_fetch_assoc($result2)){
            $tArr["authorName"] = $rs2["first_name"]." ".$rs2["last_name"];
        }
         $retArr[] = $tArr;
    }
    return $retArr;//最後是回傳一個二維陣列
}
function getMyExhibitionList($usr){ //列出【我的展場】中的屬於自己的所有展場
    global $db;
    $sql = "SELECT * from `exhibition` INNER JOIN `user` ON `exhibition`.`creatorID` = `user`.`id` 
    where `user`.`id` = ? ORDER BY `createTime` DESC ;"; 
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_bind_param($stmt,"i",$usr); 
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    date_default_timezone_set('Asia/taipei');
    $now   = new DateTime();
    while($rs = mysqli_fetch_assoc($result)){
        $tArr=array(); //一維陣列存下面個欄位變數
        $tArr['eID']=$rs['eID'];
        $tArr['Ename']=$rs['name'];
        $tArr['frontPicture']=$rs['frontPicture'];
        $tArr['permission']=$rs['permission'];
        $start  = new DateTime($rs['startTime']);
        $close  = new DateTime($rs['closeTime']);
        if(($rs['permission'] !== "private") AND ($start <= $now) AND ($close > $now) ){
            $tArr['status']= true ;
        }else{
            $tArr['status']= false ;
        }
        $retArr[] = $tArr;
    }
    return $retArr;//最後是回傳一個二維陣列
}
function deleteMyExhibition($usr,$eID){ //刪掉自己指定的展場
    global $db;
    $sql = "SELECT * , count(*) AS total FROM `exhibition` INNER JOIN `user` ON `exhibition`.`creatorID` = `user`.`id` 
    where `user`.`id` = ? AND `exhibition`.`eID` = ?";  //先撈出該user是否有該展場
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_bind_param($stmt,"ii",$usr,$eID); 
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    $retArr = array();

    $frontPicture= $rs["frontPicture"];//必定會刪除
    if(isset($rs["picture2"])){
        $picture2= $rs["picture2"];//有再刪除就好
    }else{
        $picture2= "";//有再刪除就好
    }
    if(isset($rs["picture3"])){
        $picture3= $rs["picture3"];//有再刪除就好
    }else{
        $picture3= "";//有再刪除就好
    }
    if(isset($rs["mapImg"])){
        $mapImg= $rs["mapImg"];
    }else{
        $mapImg= "";//有再刪除就好
    }
    if($rs["total"] !== 0 ){ //userID有沒有該展場(eID)
        $retArr["isDelete"] = true; //userID有該展場(eID)，刪除成功 !!!
        $sql = "SELECT * FROM `exhibitivepanorama` WHERE `exhibitivepanorama`.`eID` = ?";  
        $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
        mysqli_stmt_bind_param($stmt,"i",$eID); 
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        while($rs2 = mysqli_fetch_assoc($result)){
            $epID = $rs2["epID"];
            $musicLink = $rs2["musicLink"];
            if(($musicLink !== "")&&(isset($musicLink))){//如果語音不為空
                $str = substr($musicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                $filename = '.'.$str;
                if(file_exists($filename)){
                    unlink($filename);//刪除文件
                }
            }
            //判斷此展場的底部圖是不是引用的，還是自己的
            if(($rs2["thumbnailLink"] !== "")&&isset($rs2["thumbnailLink"])){
                $thumbnailLink = $rs2["thumbnailLink"];
                $sql3 = "SELECT `panorama`.`smallimgLink` FROM `exhibitivepanorama` INNER JOIN `panorama` ON
                `exhibitivepanorama`.`pID` = `panorama`.`pID` WHERE  `exhibitivepanorama`.`pID` = ?"; 
                $stmt3 = mysqli_prepare($db, $sql3);
                mysqli_stmt_bind_param($stmt3,"i", $rs2['pID']); 
                mysqli_stmt_execute($stmt3);
                $result3 = mysqli_stmt_get_result($stmt3);
                if($rs3 = mysqli_fetch_assoc($result3)){
                    if(isset($rs3['smallimgLink'])){
                        $smallimgLink = $rs3['smallimgLink'];
                        if($smallimgLink !== $thumbnailLink){//不是引用原先的panorama的縮圖
                            $str = substr($thumbnailLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                            $filename = '.'.$str;
                            if(file_exists($filename)){
                                unlink($filename);//刪除文件
                            }      
                        }
                    }else{
                        $str = substr($thumbnailLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }  
                    }
                }
            }
            //刪除該展示中全景圖的資訊點
            $sql = "DELETE FROM `infospot` WHERE `infospot`.`epID` = ?";  
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"i",$epID); 
            mysqli_stmt_execute($stmt);
            //刪除該展示中全景圖的移動點
            $sql = "DELETE FROM `movespot` WHERE `movespot`.`epID` = ?";  
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"i",$epID); 
            mysqli_stmt_execute($stmt);
            //刪除客製化展品點的展品代表圖以及語音檔案
            $sql3 = "SELECT * ,`customspot`.`musicLink` AS `cMusicLink`, `item`.`musicLink` AS `iMusicLink` 
            FROM `exhibitivepanorama`INNER JOIN `customspot` ON `exhibitivepanorama`.`epID` = `customspot`.`epID` 
            INNER JOIN `item` ON `customspot`.`iID` = `item`.`iID` 
            WHERE  `exhibitivepanorama`.`epID` = ?"; 
            $stmt3 = mysqli_prepare($db, $sql3);
            mysqli_stmt_bind_param($stmt3,"i", $epID); 
            mysqli_stmt_execute($stmt3);
            $result3 = mysqli_stmt_get_result($stmt3);
            while($rs3 = mysqli_fetch_assoc($result3)){
                //刪除展品代表圖
                if((isset($rs3['imageLink'])) && ($rs3['imageLink'] !== "")){
                    $imageLink = $rs3['imageLink'];
                    if((isset($rs3['2DimgLink'])) && ($rs3['2DimgLink'] !== "")){
                        $img2DLink = $rs3['2DimgLink'];
                        if($imageLink !== $img2DLink){//不是引用原先的panorama的縮圖
                            $str = substr($imageLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                            $filename = '.'.$str;
                            if(file_exists($filename)){
                                unlink($filename);//刪除文件
                            }      
                        }
                    }else{
                        $str = substr($imageLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }      
                    }
                }
                //刪除語音檔案
                if((isset($rs3['cMusicLink'])) && ($rs3['cMusicLink'] !== "")){
                    $cMusicLink = $rs3['cMusicLink'];
                    if((isset($rs3['iMusicLink'])) && ($rs3['iMusicLink'] !== "")){
                        $iMusicLink = $rs3['iMusicLink'];
                        if($cMusicLink !== $iMusicLink){//不是引用原先的panorama的縮圖
                            $str = substr($cMusicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                            $filename = '.'.$str;
                            if(file_exists($filename)){
                                unlink($filename);//刪除文件
                            }      
                        }
                    }else{
                        $str = substr($cMusicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }      
                    }
                }
            }
            //刪除該展示中全景圖的所有客製化展品點
            $sql = "DELETE FROM `customspot` WHERE `customspot`.`epID` = ?";  
            $stmt = mysqli_prepare($db, $sql);
            mysqli_stmt_bind_param($stmt,"i",$epID); 
            mysqli_stmt_execute($stmt);
            
        }
        $sql = "DELETE FROM `likes` where `likes`.`eID` = ?";  
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$eID); 
        mysqli_stmt_execute($stmt);
    
        $sql = "DELETE FROM `exhibitivepanorama` where `exhibitivepanorama`.`eID` = ?";  
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$eID); 
        mysqli_stmt_execute($stmt);//執行一個sql指令
        
        $str = substr($frontPicture, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
        $filename = '.'.$str;
        if(file_exists($filename)){
            unlink($filename);//刪除文件
            if(($mapImg !== "")&&(isset($mapImg))){//如果縮圖不為空
                $str = substr($mapImg, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                $filename = '.'.$str;
                if(file_exists($filename)){
                    unlink($filename);//刪除文件
                }
            }
            if(($picture2 !== "")&&(isset($picture2))){//如果縮圖不為空
                $str = substr($picture2, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                $filename = '.'.$str;
                if(file_exists($filename)){
                    unlink($filename);//刪除文件
                }
            }
            if(($picture3 !== "")&&(isset($picture3))){//如果縮圖不為空
                $str = substr($picture3, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                $filename = '.'.$str;
                if(file_exists($filename)){
                    unlink($filename);//刪除文件
                }
            }
        }
        $sql = "DELETE FROM `exhibition` where `exhibition`.`eID` = ?";
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$eID); 
        mysqli_stmt_execute($stmt);
    }
    else{ //userID沒有該展場
        $retArr["isDelete"] = false;//展場刪除失敗
    }
    return $retArr;
}
function deleteMyOldExPanorama($epID){
    global $db ;
    $sql = "SELECT * FROM exhibitivepanorama WHERE `exhibitivepanorama`.`epID` = ?";  
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_bind_param($stmt,"i",$epID); 
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if($rs = mysqli_fetch_assoc($result)){
        $musicLink = $rs["musicLink"];
        if(($musicLink !== "")&&(isset($musicLink))){//如果語音不為空
            $str = substr($musicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
            $filename = '.'.$str;
            if(file_exists($filename)){
                unlink($filename);//刪除文件
            }
        }
        //判斷此展場的底部圖是不是引用的，還是自己的
        if(($rs["thumbnailLink"] !== "")&&isset($rs["thumbnailLink"])){
            $thumbnailLink = $rs["thumbnailLink"];
            $sql2 = "SELECT `panorama`.`smallimgLink` FROM exhibitivepanorama INNER JOIN panorama ON
            `exhibitivepanorama`.`pID` = `panorama`.`pID` WHERE  `exhibitivepanorama`.`pID` = ?"; 
            $stmt2 = mysqli_prepare($db, $sql2);
            mysqli_stmt_bind_param($stmt2,"i", $rs['pID']); 
            mysqli_stmt_execute($stmt2);
            $result2 = mysqli_stmt_get_result($stmt2);
            if($rs2 = mysqli_fetch_assoc($result2)){
                if(isset($rs2['smallimgLink'])){
                    $smallimgLink = $rs2['smallimgLink'];
                    if($smallimgLink !== $thumbnailLink){//不是引用原先的panorama的縮圖
                        $str = substr($thumbnailLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }      
                    }
                }else{
                    $str = substr($thumbnailLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                    $filename = '.'.$str;
                    if(file_exists($filename)){
                        unlink($filename);//刪除文件
                    }  
                }
            }
        }
        //刪除該展示中全景圖的資訊點
        $sql = "DELETE FROM infospot WHERE `infospot`.`epID` = ?";  
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$epID); 
        mysqli_stmt_execute($stmt);
        //刪除該展示中全景圖的移動點
        $sql = "DELETE FROM movespot WHERE `movespot`.`epID` = ?";  
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$epID); 
        mysqli_stmt_execute($stmt);
        //刪除客製化展品點的展品代表圖以及語音檔案
        $sql3 = "SELECT * ,`customspot`.`musicLink` AS `cMusicLink`, `item`.`musicLink` AS iMusicLink 
        FROM `exhibitivepanorama`INNER JOIN customspot ON `exhibitivepanorama`.`epID` = `customspot`.`epID` 
        INNER JOIN item ON `customspot`.`iID` = `item`.`iID` 
        WHERE  `exhibitivepanorama`.`epID` = ?"; 
        $stmt3 = mysqli_prepare($db, $sql3);
        mysqli_stmt_bind_param($stmt3,"i", $epID); 
        mysqli_stmt_execute($stmt3);
        $result3 = mysqli_stmt_get_result($stmt3);
        while($rs3 = mysqli_fetch_assoc($result3)){
            //刪除展品代表圖
            if((isset($rs3['imageLink'])) && ($rs3['imageLink'] !== "")){
                $imageLink = $rs3['imageLink'];
                if((isset($rs3['2DimgLink'])) && ($rs3['2DimgLink'] !== "")){
                    $img2DLink = $rs3['2DimgLink'];
                    if($imageLink !== $img2DLink){//不是引用原先的panorama的縮圖
                        $str = substr($imageLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }      
                    }
                }else{
                    $str = substr($imageLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                    $filename = '.'.$str;
                    if(file_exists($filename)){
                        unlink($filename);//刪除文件
                    }      
                }
            }
            //刪除語音檔案
            if((isset($rs3['cMusicLink'])) && ($rs3['cMusicLink'] !== "")){
                $cMusicLink = $rs3['cMusicLink'];
                if((isset($rs3['iMusicLink'])) && ($rs3['iMusicLink'] !== "")){
                    $iMusicLink = $rs3['iMusicLink'];
                    if($cMusicLink !== $iMusicLink){//不是引用原先的panorama的縮圖
                        $str = substr($cMusicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                        $filename = '.'.$str;
                        if(file_exists($filename)){
                            unlink($filename);//刪除文件
                        }      
                    }
                }else{
                    $str = substr($cMusicLink, 40);//取網址由前算起27字元之後(http://localhost/backendPHP)的全部字元
                    $filename = '.'.$str;
                    if(file_exists($filename)){
                        unlink($filename);//刪除文件
                    }      
                }
            }
        }
        //刪除該展示中全景圖的所有客製化展品點
        $sql = "DELETE FROM customspot WHERE `customspot`.`epID` = ?";  
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$epID); 
        mysqli_stmt_execute($stmt);

        $sql = "DELETE FROM exhibitivepanorama where `exhibitivepanorama`.`epID` = ?";  
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$epID); 
        mysqli_stmt_execute($stmt);//執行一個sql指令
    }
}
//-----------------------------------------------------------------------------------
function addMyExhibition($name, $usr, $eIntro, $start, $close, $frontPictureLink, $permission, $mapImgLink, $picture2Link,$picture3Link){
    date_default_timezone_set('Asia/taipei');
    global $db;
    $sql = "INSERT INTO `exhibition` (`name`, `creatorID`, `eIntro`, `createTime`,`startTime`, `closeTime`, `frontPicture`, `permission`, `mapImg`, `picture2`, `picture3`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";  
    $stmt = mysqli_prepare($db, $sql);
    $createTime = date("Y-m-d H:i:s");
    mysqli_stmt_bind_param($stmt,"sisssssssss",$name, $usr, $eIntro, $createTime, $start, $close, $frontPictureLink, $permission, $mapImgLink, $picture2Link, $picture3Link); 
    mysqli_stmt_execute($stmt);
    $eID = mysqli_insert_id($db);//$id = mysqli_insert_id($link);
    return $eID;
}
function addMyExPanorama($pID, $eID, $mapX, $mapY, $name, $smallimgLink, $musicLink){
    global $db;
    if(($mapX === null) && ($mapY === null)){//不能傳空值到DB中
        $sql = "INSERT INTO `exhibitivepanorama`(`pID`, `eID`, `epName`, `thumbnailLink`, `musicLink`) VALUES (?,?,?,?,?)"; 
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"iisss",$pID, $eID,  $name, $smallimgLink, $musicLink); 
    }else{
        $sql = "INSERT INTO `exhibitivepanorama`(`pID`, `eID`, `mapX`, `mapY`, `epName`, `thumbnailLink`, `musicLink`) VALUES (?,?,?,?,?,?,?)"; 
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"iiddsss",$pID, $eID, $mapX, $mapY, $name, $smallimgLink, $musicLink); 
    }
    mysqli_stmt_execute($stmt);
    $epID = mysqli_insert_id($db);
    return $epID;
}
function updateExfirstScene($eID, $epID){ //更新展場的第一張全景圖
    global $db;
    $sql = "UPDATE `exhibition` SET `firstScene`= ?  WHERE `exhibition`.`eID` = ? " ;
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$epID,$eID); 
    mysqli_stmt_execute($stmt);
    return;
}
function addExMoveSpot($epID, $type ,$pitch, $yaw, $nextScene){
    global $db;
    $sql = "INSERT INTO `movespot`(`epID`, `type`, `pitch`, `yaw`, `nextScene`) VALUES (?,?,?,?,?)";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"isddi",$epID, $type ,$pitch, $yaw, $nextScene); 
    mysqli_stmt_execute($stmt);
    return;
}
function addExInfoSpot($epID, $pitch, $yaw, $title, $intro){
    global $db;
    $sql = "INSERT INTO `infospot`(`epID`, `pitch`, `yaw`, `title`, `intro`) VALUES (?,?,?,?,?)";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"iddss",$epID, $pitch, $yaw, $title, $intro); 
    mysqli_stmt_execute($stmt);
    return;
}
function addExCustomSpot($iID, $epID,  $pitch, $yaw, $itemName, $itemIntro, $imageLink, $musicLink, $imageWidth, $imageHeight){
    global $db;
    $sql = "INSERT INTO `customspot`(`iID`,`epID`, `pitch`, `yaw`, `name`, `intro`, `imageLink`, `musicLink`,`imageWidth`,`imageHeight`) VALUES (?,?,?,?,?,?,?,?,?,?)";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"iiddssssss",$iID, $epID, $pitch, $yaw, $itemName, $itemIntro, $imageLink, $musicLink, $imageWidth, $imageHeight); 
    mysqli_stmt_execute($stmt);
    return;
}
function checkPanoIsPublic($pID){
    global $db;
    $sql = "SELECT `panorama`.`permission` FROM `panorama` WHERE `panorama`.`pID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$pID); 
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if($rs = mysqli_fetch_assoc($result)){
        if($rs["permission"] === "private"){
            $retArr = false;
        }else{
            $retArr = true;
        }
    }
    return $retArr;
}
function checkItemIsPublic($iID){
    global $db;
    $sql = "SELECT `item`.`permission` FROM `item` WHERE `item`.`iID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$iID); 
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if($rs = mysqli_fetch_assoc($result)){
        if($rs["permission"] === "private"){
            $retArr = false;
        }else{
            $retArr = true;
        }
    }
    return $retArr;
}
//----------------------------------------------------------------------------------------------------
//Home
function getOnExhibit(){//正在展出中的展覽
    global $db;
     $sql = "SELECT * FROM exhibition INNER JOIN user ON `exhibition`.`creatorID` = `user`.`id` WHERE permission = 'public' AND Now()>`startTime`  AND NOW() < `closeTime`ORDER BY exhibition.createTime DESC;"; //AND NOW() > startTime
     $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
     mysqli_stmt_execute($stmt);//執行一個sql指令
     $result = mysqli_stmt_get_result($stmt);
     $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
     while($rs = mysqli_fetch_assoc($result)){
          $tArr=array(); //一維陣列存下面個欄位變數
          $tArr['eID']=$rs['eID'];
          $tArr['name']=$rs['name'];
          $tArr['creatorID']=$rs['creatorID'];
          $tArr['frontPicture']=$rs['frontPicture'];
          $tArr['first_name']=$rs['first_name'];
          $tArr['last_name']=$rs['last_name'];
          $tArr['startTime']=$rs['startTime'];
          $tArr['closeTime']=$rs['closeTime'];
          $tArr['createTime']=$rs['createTime'];
          $retArr[] = $tArr;
     }
     return $retArr;//最後是回傳一個二維陣列
}

function getToBeExhibit(){//即將展出的展覽
    global $db;
    $sql_query = "SELECT * FROM exhibition WHERE Now()<`startTime` && exhibition.permission='public' ORDER BY exhibition.startTime;";// && NOW()>exhibition.startTime && NOW()<exhibition.closeTime
    $data = mysqli_query($db,$sql_query) or die("Query Fail! ".mysqli_error($db));
    $tArr=array(); 
    while($row=mysqli_fetch_assoc($data)){ 
        $temp=array();
        $temp["exhibition"]=$row['name'];  
        $temp["eID"]=$row['eID'];
        $temp["frontPicture"]=$row['frontPicture'];
        $temp["createTime"]=$row['createTime'];
        $temp["startTime"]=$row['startTime'];
        $temp["closeTime"]=$row['closeTime'];
        $tArr[] = $temp;
    }    
    return $tArr;
}

function getBestCu(){//熱門策展人
    global $db;
    $sql_query = "SELECT *,COUNT(*) AS SubCount FROM subscribe INNER JOIN user WHERE subscribe.creator = user.id AND subscribe.status='true' GROUP BY subscribe.creator ORDER BY SubCount DESC LIMIT 0,3;";
    $data = mysqli_query($db,$sql_query) or die("Query Fail! ".mysqli_error($db));
    $tArr=array(); 
    while($row=mysqli_fetch_assoc($data)){ 
        $temp=array();
        $temp["id"]=$row['id'];  
        $temp["first_name"]=$row['first_name'];
          $temp["last_name"]=$row['last_name'];
        $temp["photo"]=$row['photo'];
          $temp["SubCount"]=$row['SubCount'];
        $tArr[] = $temp;
    }    
    return $tArr;
}

function getBestEx(){//熱門展覽
    global $db;
    $sql_query = "SELECT *,COUNT(*) AS LikeCount FROM likes INNER JOIN exhibition WHERE likes.eID=exhibition.eID AND likes.status='true' GROUP BY likes.eID 
             ORDER BY LikeCount  DESC LIMIT 0,3;";
    $data = mysqli_query($db,$sql_query) or die("Query Fail! ".mysqli_error($db));
    $tArr=array(); 
    while($row=mysqli_fetch_assoc($data)){ 
        $temp=array();
        $temp["exhibition"]=$row['name'];  
        $temp["exhibition.eID"]=$row['eID'];
        $temp["frontPicture"]=$row['frontPicture'];
        $temp["LikeCount"]=$row['LikeCount'];
        $tArr[] = $temp;
    }    
    return $tArr;
}
//-------------------------------------------------------------------------------
function getMyExPanoData($eID,$usr){ //編輯展場時，需要先將該展場的所有資料撈出
    global $db;
    $sql = "SELECT * FROM `exhibition` WHERE `exhibition`.`eID` = ? AND `exhibition`.`creatorID` = ?";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$eID,$usr); 
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    if($rs = mysqli_fetch_assoc($result)){
        $retArr["eID"] = $rs["eID"];
        $retArr["exhibitionName"] = $rs["name"];
        $retArr["eIntro"] = $rs["eIntro"];
        $start = explode(' ' , $rs["startTime"]);//用空白切割，取日期
        $retArr["startTime"] = $start[0]; 
        $close = explode(' ' , $rs["closeTime"]);//用空白切割，取日期
        $retArr["closeTime"] = $close[0]; 
        $retArr["frontPicture"] = $rs["frontPicture"]; 
        $retArr["firstScene"] = $rs["firstScene"];
        $retArr["permission"] = $rs["permission"]; 
        $retArr["mapImg"] = $rs["mapImg"];
        $retArr["picture2"] = $rs["picture2"];
        $retArr["picture3"] = $rs["picture3"];
        $sql = "SELECT * FROM `exhibitivepanorama` 
        INNER JOIN `panorama` ON  `exhibitivepanorama`.`pID` = `panorama`.`pID`
        INNER JOIN `user` ON  `panorama`.`ownerID` = `user`.`id`
        WHERE `exhibitivepanorama`.`eID` = ?;";
        $stmt = mysqli_prepare($db, $sql);
        mysqli_stmt_bind_param($stmt,"i",$eID); 
        mysqli_stmt_execute($stmt);//執行一個sql指令
        $result = mysqli_stmt_get_result($stmt);
        $panoArray = array();
        $moveSpotsArray = array();
        $infoSpotsArray = array();
        $customSpotsArray = array();
        while($rs = mysqli_fetch_assoc($result)){
            $tArr = array();
            $tArr["epID"]=$rs['epID'];  
            $tArr["pID"]=$rs['pID'];
            $tArr["mapX"]=$rs['mapX'];
            $tArr["mapY"]=$rs['mapY'];
            $tArr["panoramaName"]=$rs['epName'];
            $tArr["imgLink"]=$rs['imgLink'];
            $tArr["smallimgLink"]=$rs['thumbnailLink'];
            $tArr["music"]=$rs['musicLink'];
            $tArr["ownerID"]=$rs['ownerID'];
            $tArr["authorName"]=$rs['first_name'].' '.$rs['last_name'];
            $panoArray[] = $tArr;
            //==================收集該展示中場景的移動點====================================
            $sql2 = "SELECT * FROM `movespot` 
            INNER JOIN `exhibitivepanorama` ON  `movespot`.`epID` = `exhibitivepanorama`.`epID`
            WHERE `exhibitivepanorama`.`epID` = ?;";
            $stmt2 = mysqli_prepare($db, $sql2);
            mysqli_stmt_bind_param($stmt2,"i", $rs['epID']); 
            mysqli_stmt_execute($stmt2);//執行一個sql指令
            $result2 = mysqli_stmt_get_result($stmt2);
            while($rs2 = mysqli_fetch_assoc($result2)){
                $tArr2 = array();
                $tArr2["msID"]=$rs2['msID'];
                $tArr2["currentSceneID"]=$rs2['epID'];  
                $tArr2["currentSceneName"]=$rs2['epName'];  
                $tArr2["pitch"]=$rs2['pitch'];
                $tArr2["yaw"]=$rs2['yaw'];
                $tArr2["clickHandlerFunc"]=$rs2['type'];
                $tArr2["destinationID"]=$rs2['nextScene'];
                $sql3 = "SELECT * FROM `movespot` INNER JOIN `exhibitivepanorama` ON  `movespot`.`nextScene` = `exhibitivepanorama`.`epID`
                        WHERE `exhibitivepanorama`.`epID` = ?;";
                $stmt3 = mysqli_prepare($db, $sql3);
                mysqli_stmt_bind_param($stmt3,"i", $rs2['nextScene']); 
                mysqli_stmt_execute($stmt3);//執行一個sql指令
                $result3 = mysqli_stmt_get_result($stmt3);
                if($rs3 = mysqli_fetch_assoc($result3)){
                    $tArr2["destinationName"]=$rs3['epName'];
                }
                $moveSpotsArray[] = $tArr2;
            }
            $sql4 = "SELECT * FROM `infospot` 
            INNER JOIN `exhibitivepanorama` ON  `infospot`.`epID` = `exhibitivepanorama`.`epID`
            WHERE `exhibitivepanorama`.`epID` = ?;";
            $stmt4 = mysqli_prepare($db, $sql4);
            mysqli_stmt_bind_param($stmt4,"i", $rs['epID']); 
            mysqli_stmt_execute($stmt4);//執行一個sql指令
            $result4 = mysqli_stmt_get_result($stmt4);
            while($rs4 = mysqli_fetch_assoc($result4)){
                $tArr3 = array();
                $tArr3["isID"]=$rs4['isID'];
                $tArr3["epID"]=$rs4['epID'];
                $tArr3["title"]=$rs4['title'];  
                $tArr3["detailtxt"]=$rs4['intro'];  
                $tArr3["pitch"]=$rs4['pitch'];
                $tArr3["yaw"]=$rs4['yaw'];
                $infoSpotsArray[] = $tArr3;
            }
            $sql5 = "SELECT * ,`customspot`.`name` AS `Cname`, `customspot`.`intro` AS `Cintro` 
            , `customspot`.`musicLink` AS `Cmusic` FROM `customspot` 
            INNER JOIN `exhibitivepanorama` ON  `customspot`.`epID` = `exhibitivepanorama`.`epID`
            INNER JOIN `item` ON  `customspot`.`iID` = `item`.`iID`
            INNER JOIN `user` ON  `item`.`ownerID` = `user`.`id`
            WHERE `exhibitivepanorama`.`epID` = ?;";
            $stmt5 = mysqli_prepare($db, $sql5);
            mysqli_stmt_bind_param($stmt5,"i", $rs['epID']); 
            mysqli_stmt_execute($stmt5);//執行一個sql指令
            $result5 = mysqli_stmt_get_result($stmt5);
            while($rs5 = mysqli_fetch_assoc($result5)){
                $tArr4 = array();
                $tArr4["csID"]=$rs5['csID'];
                $tArr4["epID"]=$rs5['epID'];
                $tArr4["iID"]=$rs5['iID'];
                $tArr4["pitch"]=$rs5['pitch'];
                $tArr4["yaw"]=$rs5['yaw'];
                $tArr4["itemName"]=$rs5['Cname'];
                $tArr4["itemIntro"]=$rs5['Cintro'];
                $tArr4["imageLink"]=$rs5['imageLink'];
                $tArr4["modelLink"]=$rs5['3DobjectLink'];
                $tArr4["musicLink"]=$rs5['Cmusic'];
                $tArr4["imageWidth"]=$rs5['imageWidth'];
                $tArr4["imageHeight"]=$rs5['imageHeight'];
                $tArr4["ownerID"]=$rs5['ownerID'];
                $tArr4["authorName"]=$rs5['first_name'].' '.$rs5['last_name'];
                $customSpotsArray[] = $tArr4;
            }
        }
        $retArr["myPanoramaList"] = $panoArray;
        $retArr["moveSpotsArray"] = $moveSpotsArray;
        $retArr["infoSpotsArray"] = $infoSpotsArray;
        $retArr["customSpotsArray"] = $customSpotsArray;
    }
    return $retArr;
}
//---------------編輯展示中展場------------------------------------
function getMyExData($eID,$usr){ //編輯展場時，需要先將該展場的所有資料撈出
    global $db;
    $sql = "SELECT * FROM `exhibition` WHERE `exhibition`.`eID` = ? AND `exhibition`.`creatorID` = ?";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$eID,$usr); 
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    if($rs = mysqli_fetch_assoc($result)){
        $retArr["eID"] =  $rs["eID"];
        $retArr["exhibitionName"] = $rs["name"];
        $retArr["eIntro"] = $rs["eIntro"];
        $start = explode(' ' , $rs["startTime"]);//用空白切割，取日期
        $retArr["startTime"] = $start[0]; 
        $close = explode(' ' , $rs["closeTime"]);//用空白切割，取日期
        $retArr["closeTime"] = $close[0]; 
        $retArr["frontPicture"] = $rs["frontPicture"]; 
        $retArr["permission"] = $rs["permission"]; 
        $retArr["picture2"] = $rs["picture2"];
        $retArr["picture3"] = $rs["picture3"];
    }
    return $retArr;
}
function editMyExData($eID, $usr, $name, $eIntro, $start, $close, $permission, $frontPictureLink, $picture2Link, $picture3Link){
    global $db;
    $sql = "UPDATE `exhibition` SET `name`=?,`eIntro`=?,`startTime`=?,`closeTime`=?,`permission`=?,`frontPicture`= ? 
    ,`picture2`= ? ,`picture3`= ? WHERE `eID`= ? AND `creatorID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "ssssssssii",$name, $eIntro, $start, $close, $permission, $frontPictureLink, $picture2Link, $picture3Link, $eID, $usr); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
}
// ========================== edit my exhibition =============================================
function editMyExhibition($eID, $usr, $name, $eIntro, $start, $close, $frontPictureLink, $permission, $mapImgLink, $picture2Link, $picture3Link){
    global $db;
    $sql = "UPDATE `exhibition` SET `name`=?,`eIntro`=?,`startTime`=?,`closeTime`=?,`frontPicture`= ?,`permission`=?, `mapImg` = ? ,
    `picture2`= ? ,`picture3`= ? WHERE `eID`= ? AND `creatorID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "sssssssssii" ,$name, $eIntro, $start, $close, $frontPictureLink, $permission, $mapImgLink, $picture2Link, $picture3Link, $eID, $usr); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
}
function getMyOriginExPanorama($eID) { //撈出編輯展場的所有原先展示中全景圖的epID撈出
    global $db;
    $sql = "SELECT `exhibitivepanorama`.`epID` FROM exhibitivepanorama WHERE `exhibitivepanorama`.`eID` = ?;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$eID); 
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    while($rs = mysqli_fetch_assoc($result)){
        $retArr[] = $rs['epID'];
    }
    return $retArr;
}
function checkDeleteSmallImg($epID){
    global $db;
    $sql = "SELECT `thumbnailLink` FROM `exhibitivepanorama` WHERE `epID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "i", $epID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    $thumbnailLink = '';
    if($rs = mysqli_fetch_assoc($result)){ //檢查有無重複
        $thumbnailLink = $rs['thumbnailLink'];
        return $thumbnailLink;
    }
    return $thumbnailLink;
}
function checkDeleteMusic($epID){
    global $db;
    $sql = "SELECT `musicLink` FROM `exhibitivepanorama` WHERE `epID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "i", $epID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    $musicLink = '';
    if($rs = mysqli_fetch_assoc($result)){ //檢查有無重複
        $musicLink = $rs['musicLink'];
        return $musicLink;
    }
    return $musicLink;
}
function editExMoveSpot($msID, $epID, $type ,$pitch, $yaw, $nextScene){
    global $db;
    $sql = "UPDATE `movespot` SET `epID`=?,`type`=?,`pitch`=?,`yaw` = ?,`nextScene`= ? WHERE `msID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "isddii",$epID, $type ,$pitch, $yaw, $nextScene, $msID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
}
function editExInfoSpot($isID, $epID, $pitch, $yaw, $title, $intro){
    global $db;
    $sql = "UPDATE `infospot` SET `epID`= ?,`pitch`= ? ,`yaw`= ? ,`title`= ?,`intro`= ? WHERE `isID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "iddssi", $epID, $pitch, $yaw, $title, $intro, $isID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
}
function checkDelete2DImg($csID){
    global $db;
    $sql = "SELECT `imageLink` FROM `customspot` WHERE `csID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "i", $csID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    $imageLink = '';
    if($rs = mysqli_fetch_assoc($result)){ //檢查有無重複
        $imageLink = $rs['imageLink'];
        return $imageLink ;
    }
    return $imageLink ;
}
function checkDeleteItemMusic($csID){
    global $db;
    $sql = "SELECT `musicLink` FROM `customspot` WHERE `csID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "i", $csID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    $musicLink = '';
    if($rs = mysqli_fetch_assoc($result)){ //檢查有無重複
        $musicLink = $rs['musicLink'];
        return $musicLink;
    }
    return $musicLink;
}
function editMyExPanorama($epID, $pID, $eID, $mapX, $mapY, $name, $smallimgLink, $musicLink){
    global $db;
    if(($mapX === null) && ($mapY === null)){
        $mapX = -1;
        $mapY = -1;
    }
    $sql = "UPDATE `exhibitivepanorama` SET `pID`= ?,`eID`= ? ,`mapX`= ? ,`mapY`= ? ,`epName`= ? ,`thumbnailLink`= ? ,`musicLink`= ? WHERE `epID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "iiddsssi", $pID, $eID, $mapX, $mapY, $name, $smallimgLink, $musicLink, $epID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
   
}
function editExCustomSpot($csID, $iID, $epID, $pitch, $yaw, $itemName, $itemIntro, $imageLink, $musicLink, $imageWidth, $imageHeight){
    global $db;
    $sql = "UPDATE `customspot` SET `iID`= ?,`epID`= ? ,`pitch`= ? ,`yaw`= ? ,`name`= ? ,`intro`= ? ,`imageLink`= ? ,`musicLink`= ?, `imageWidth`= ? ,`imageHeight`= ? WHERE `csID` = ?;"; //sql指令的insert語法
    $stmt = mysqli_prepare($db, $sql); //prepare sql statement
    mysqli_stmt_bind_param($stmt, "iiddssssssi", $iID, $epID, $pitch, $yaw, $itemName, $itemIntro, $imageLink, $musicLink, $imageWidth, $imageHeight, $csID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt);  //執行SQL
}
// ========================== Manage My Item ========================================
function EditItem($iID,$name, $intro, $img2D, $object3D, $permission, $usr,$musicLink) {
    global $db;
    $sql = "SELECT * FROM item WHERE ownerID = ? AND name=? AND iID !=?;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt, "isi", $usr,$name,$iID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    if($rs = mysqli_fetch_assoc($result)){ //檢查有無重複
        return false;
    }else{//看有沒有抓到result那張select出來的表 
        $sql2 = "UPDATE item SET `name` =?,`intro`=?,`2DimgLink`=?,`3DobjectLink`=?,`permission`=?,`musicLink`= ?  WHERE `iID` = ? ;"; //sql指令的insert語法
        $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
        mysqli_stmt_bind_param($stmt2, "ssssssi",$name, $intro,$img2D,$object3D,$permission,$musicLink,$iID); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt2);  //執行SQL
        return true;
    }
}

//刪除Item 3D
function DelItem3D($iID){
    global $db;
    $sql2 = "SELECT 3DobjectLink FROM item WHERE `item`.`iID` = ?;"; 
    $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
    mysqli_stmt_bind_param($stmt2, "i",$iID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt2);
    $result = mysqli_stmt_get_result($stmt2);
    if($rs = mysqli_fetch_assoc($result)){ 
        $objectLink = $rs["3DobjectLink"];
        $objd=substr($objectLink, 41,6);//28
        $objfile=substr($objectLink, 48);//35
        $objfileName=substr($objectLink, 41);//28
        if($objod=opendir($objd)){ //$d是目錄名
            while(($objf=readdir($objod))!==false){ //讀取目錄內檔案
                if($objf===$objfile)
                    unlink($objfileName);
                /*else
                    echo"資料夾內沒有此3D檔案";      */                     
            }
        }          
    }
}
//刪除Item music
function DelItemMusic($iID){
    global $db;
    $sql2 = "SELECT musicLink FROM item WHERE `item`.`iID` = ?;"; 
    $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
    mysqli_stmt_bind_param($stmt2, "i",$iID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt2);
    $result = mysqli_stmt_get_result($stmt2);
    if($rs = mysqli_fetch_assoc($result)){ 
        $musicLink = $rs["musicLink"];
        if($musicLink!=""){
            $md=substr($musicLink, 41,9);//28
            $mfile=substr($musicLink, 51);//38
            $mfileName=substr($musicLink, 41);//28
            if($mod=opendir($md)){ //$d是目錄名
                while(($mf=readdir($mod))!==false){ //讀取目錄內檔案
                    if($mf===$mfile)
                        unlink($mfileName);
                    /*else
                        echo"資料夾內沒有此3D檔案";  */                         
                }
            }
        }        
    }
}

//刪除Item Img
function DelPic($iID){
    global $db;
    $sql2 = "SELECT 2DimgLink FROM item WHERE `item`.`iID` = ?;"; 
    $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
    mysqli_stmt_bind_param($stmt2, "i",$iID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt2);
    $result = mysqli_stmt_get_result($stmt2);
    if($rs = mysqli_fetch_assoc($result)){ 
        $imgLink = $rs["2DimgLink"];
        $d=substr($imgLink, 41,7);
        $file=substr($imgLink, 49);
        $fileName=substr($imgLink, 41);
        if($od=opendir($d)){ //$d是目錄名
            while(($f=readdir($od))!==false){ //讀取目錄內檔案
                if($f===$file)
                    unlink($fileName);
                /*else
                    echo"資料夾內沒有此檔案";      */                     
            }
        }           
    }
}
function ShowItem($iID){//修改顯示
    global $db;
    $sql = "select * from item where iID = ?;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$iID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $tArr=array(); 
    while($rs = mysqli_fetch_assoc($result)){
        $tArr['iID']=$rs['iID'];
        $tArr['name']=$rs['name'];
        $tArr['object3D']=$rs['3DobjectLink'];
        $tArr['intro']=$rs['intro'];
        $tArr['permission']=$rs['permission'];
        $tArr['img2D']=$rs['2DimgLink'];
        $tArr['musicLink']=$rs['musicLink'];
        $tArr['ownerID']=$rs['ownerID'];
    }
    return $tArr;
}
function get3D($iID){
    global $db;
    $sql = "SELECT * FROM item WHERE iID = ?;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$iID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $tArr=array(); 
    while($rs = mysqli_fetch_assoc($result)){
        $tArr['objectLink']=$rs['3DobjectLink'];
    }
    return $tArr;
}

//加入新展品
function AddItem($name, $intro, $img2D, $object3D, $permission,$usr,$musicLink) {
    global $db;
    $sql = "SELECT name FROM item WHERE ownerID = ? AND name=?;";
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt, "is", $usr,$name);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);  //將執行完的結果放到$result裏
    if($rs = mysqli_fetch_assoc($result)){ //檢查有無重複
        return false;
    }else{//看有沒有抓到result那張select出來的表 
        $sql2 = "INSERT INTO item (name, 3DobjectLink, 2DimgLink, intro, ownerID , permission,musicLink) VALUES (?, ?, ?, ?, ?, ?,?)"; //sql指令的insert語法
        $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
        mysqli_stmt_bind_param($stmt2, "ssssiss", $name, $object3D , $img2D, $intro, $usr, $permission,$musicLink); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt2);  //執行SQL
        return true;
    }
}

function DeleteItem($usr,$iID){
    $retArr = array();
    $retArr["cause"] = "!!";
    global $db;
    $sql = "SELECT * , count(*) as total FROM `item` INNER JOIN `customspot` ON `item`.`iID` =  `customspot`.`iID` WHERE `item`.`iID` =?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$iID); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    if($rs["total"] > 0){
        $retArr["isDelete"] = false;//展品刪除失敗
        $retArr["cause"] = "展品有被其他展場使用，所以無法刪除";
        return $retArr;
    }
    $sql2 = "SELECT 2DimgLink,3DobjectLink, musicLink FROM item WHERE `item`.`iID` = ?;"; 
    $stmt2 = mysqli_prepare($db, $sql2); //prepare sql statement
    mysqli_stmt_bind_param($stmt2, "i",$iID); //bind parameters with variables(將變數bind到sql指令的問號中)
    mysqli_stmt_execute($stmt2);
    $result = mysqli_stmt_get_result($stmt2);
    if($rs = mysqli_fetch_assoc($result)){ 
        $imgLink = $rs["2DimgLink"];
        $objectLink = $rs["3DobjectLink"];
        $musicLink = $rs["musicLink"];
        $imgd=substr($imgLink, 41,7);
        $imgfile=substr($imgLink, 49);
        $imgfileName=substr($imgLink, 41);
        if($imgod=opendir($imgd)){ //$d是目錄名
            while(($imgf=readdir($imgod))!==false){ //讀取目錄內檔案
                if($imgf===$imgfile){
                    unlink($imgfileName);
                    break;
                }
                else{
                    $retArr["cause"] = " 警告: 伺服器沒有找到該img檔案";   
                }
            }
        } 
        //3DobjectLink
        $objd=substr($objectLink, 41,6); //return "Item3D"
        $objfile=substr($objectLink, 48); // return fileName
        $objfileName=substr($objectLink, 41); // return Item3D/fileName
        if($objod=opendir($objd)){ //$d是目錄名
            while(($objf=readdir($objod))!==false){ //讀取目錄內檔案
                if($objf===$objfile){
                    unlink($objfileName);
                    break;
                }
                else{
                    $retArr["cause"] = " 警告: 伺服器沒有找到該3D檔案";    
                }
            }
        }
        //musicLink
        if($musicLink!=""){
           $md=substr($musicLink, 41,9);
           $mfile=substr($musicLink, 51);
           $mfileName=substr($musicLink, 41);
            if($mod=opendir($md)){ //$d是目錄名
                while(($mf=readdir($mod))!==false){ //讀取目錄內檔案
                    if($mf===$mfile){
                        unlink($mfileName);
                         break;
                    }
                    else{
                           $retArr["cause"] = " 警告: 伺服器沒有找到該音檔";         
                    }                  
                }
            }
        }
    }
    $sql = "DELETE FROM item WHERE `item`.`iID` = ? ;"; 
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$iID);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $retArr["isDelete"] = true;
    return $retArr;
}
function checkItemAccess($usr,$iID){
    $retArr = array();
    global $db;
    $sql = "SELECT * , count(*) as total FROM `item` INNER JOIN `customspot` ON `item`.`iID` =  `customspot`.`iID` WHERE `item`.`iID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$iID); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    if($rs["total"] > 0){
        $sql2="SELECT *,`exhibition`.`permission` AS `ePermission` FROM `item` INNER JOIN `customspot` 
        ON `item`.`iID` = `customspot`.`iID` 
        RIGHT JOIN `exhibitivepanorama` ON `customspot`.`epID` = `exhibitivepanorama`.`epID` 
        LEFT JOIN `exhibition` ON `exhibition`.`eID` = `exhibitivepanorama`.`eID` 
        WHERE `item`.`iID` = ?; "; //撈出我的一展品被那些展場所使用的資料
        $stmt2 = mysqli_prepare($db, $sql2);
        mysqli_stmt_bind_param($stmt2,"i", $rs["iID"]); //bind parameters with variables(將變數bind到sql指令的問號中)
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        $now   = new DateTime();
        while($rs2 = mysqli_fetch_assoc($result2)){
            $start  = new DateTime($rs2['startTime']);
            $close  = new DateTime($rs2['closeTime']);
            if(($rs2['ePermission'] !== "private") AND ($start <= $now) AND ($close > $now) ){//展示中判斷式
             $retArr["access"] = false;
             $retArr["cause"] = "場景展示中，無法編輯";
             return $retArr;
            }
        }
    }
    $sql = "SELECT * , count(*) as total FROM `item` WHERE `item`.`iID` = ? AND `item`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"ii",$iID,$usr); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    $rs = mysqli_fetch_assoc($result);
    if($rs["total"] > 0){
        $retArr["access"] = true;
    }else{
        $retArr["access"] = false;
        $retArr["cause"] = "權限不足，無法編輯";
    }
    return $retArr;
}
function getItem($usr){//顯示展品
    global $db;
    $sql = "SELECT * FROM item WHERE item.`ownerID`=?"; 
    $stmt = mysqli_prepare($db, $sql);//$db是另一個程式生成的資料庫連線物件,  prepare:表示用這個資料庫($db)把sql指令compile好
    mysqli_stmt_bind_param($stmt, "i", $usr);
    mysqli_stmt_execute($stmt);//執行一個sql指令
    $result = mysqli_stmt_get_result($stmt);
    $retArr=array(); //用一個array存下面的每一筆資料(一筆資料也是一個array)
    while($rs = mysqli_fetch_assoc($result)){
        $tArr=array(); //一維陣列存下面個欄位變數
        $tArr['iID']=$rs['iID'];
        $tArr['name']=$rs['name'];
        $tArr['object3D']=$rs['3DobjectLink'];
        $tArr['intro']=$rs['intro'];
        $tArr['permission']=$rs['permission'];
        $tArr['img2D']=$rs['2DimgLink'];
        $tArr['musicLink']=$rs['musicLink'];
        $tArr['ownerID']=$rs['ownerID'];
        //status
        $sql2 = "SELECT * , count(*) as total FROM `item` INNER JOIN `customspot` ON `item`.`iID` =  `customspot`.`iID` WHERE `item`.`iID` =?";  
        $stmt2 = mysqli_prepare($db, $sql2);
        mysqli_stmt_bind_param($stmt2,"i",$rs["iID"]); 
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        $rs2 = mysqli_fetch_assoc($result2);
        if($rs2["total"] > 0){
            //這些展場有沒有至少一個在展出中的
            $sql3="SELECT *,`exhibition`.`permission` AS `ePermission` FROM `item` INNER JOIN `customspot` 
            ON `item`.`iID` = `customspot`.`iID` 
            RIGHT JOIN `exhibitivepanorama` ON `customspot`.`epID` = `exhibitivepanorama`.`epID` 
            LEFT JOIN `exhibition` ON `exhibition`.`eID` = `exhibitivepanorama`.`eID` 
            WHERE `item`.`iID` = ?; "; //撈出我的一展品被那些展場所使用的資料
            $stmt3 = mysqli_prepare($db, $sql3);
            mysqli_stmt_bind_param($stmt3,"i", $rs2["iID"]); //bind parameters with variables(將變數bind到sql指令的問號中)
            mysqli_stmt_execute($stmt3); 
            $result3 = mysqli_stmt_get_result($stmt3);
            $tArr["status"] = "waiting";
            $now   = new DateTime();
            while($rs3 = mysqli_fetch_assoc($result3)){
                $start  = new DateTime($rs3['startTime']);
                $close  = new DateTime($rs3['closeTime']);
                if(($rs3['ePermission'] !== "private") AND ($start <= $now) AND ($close > $now) ){//展示中判斷式
                    $tArr["status"] = "ItemUsed"; 
                    break;
                }
            }    
            
        }else{
            $tArr["status"] = "NeverUsed";
        }
    $retArr[] = $tArr;
    }
    return $retArr;//最後是回傳一個二維陣列
}

function getMyItemStatistics($usr){
    $retArr = array();
    $retArr["ItemUsedNum"] = 0;
    $retArr["waitingNum"] = 0;
    $retArr["neverUsedNum"] = 0;
    global $db;
    //先抓出所有被使用的展品
    $sql = "SELECT *  FROM `item` WHERE  `item`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$usr); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    while($rs = mysqli_fetch_assoc($result)){
        //你的每個展品個別有多少展場在使用，個別列出那些展場
        $sql2 = "SELECT * , count(*) as total FROM `item` INNER JOIN `customspot` ON `item`.`iID` =  `customspot`.`iID` WHERE `item`.`iID` =?";  
        $stmt2 = mysqli_prepare($db, $sql2);
        mysqli_stmt_bind_param($stmt2,"i",$rs["iID"]); 
        mysqli_stmt_execute($stmt2); 
        $result2 = mysqli_stmt_get_result($stmt2);
        $rs2 = mysqli_fetch_assoc($result2);
        if($rs2["total"] > 0){
            //這些展場有沒有至少一個在展出中的
            $sql3="SELECT *,`exhibition`.`permission` AS `ePermission` FROM `item` INNER JOIN `customspot` 
            ON `item`.`iID` = `customspot`.`iID` 
            RIGHT JOIN `exhibitivepanorama` ON `customspot`.`epID` = `exhibitivepanorama`.`epID` 
            LEFT JOIN `exhibition` ON `exhibition`.`eID` = `exhibitivepanorama`.`eID` 
            WHERE `item`.`iID` = ?; "; //撈出我的一展品被那些展場所使用的資料
            $stmt3 = mysqli_prepare($db, $sql3);
            mysqli_stmt_bind_param($stmt3,"i", $rs2["iID"]); //bind parameters with variables(將變數bind到sql指令的問號中)
            mysqli_stmt_execute($stmt3); 
            $result3 = mysqli_stmt_get_result($stmt3);
            $now   = new DateTime();
            $breakloop = false;
            while($rs3 = mysqli_fetch_assoc($result3)){
                $start  = new DateTime($rs3['startTime']);
                $close  = new DateTime($rs3['closeTime']);
                if(($rs3['ePermission'] !== "private") AND ($start <= $now) AND ($close > $now) ){//展示中判斷式
                    $retArr["ItemUsedNum"] += 1 ; //這個全景圖已經至少在一個展場展示中
                    $breakloop = true;
                    break;
                }
            }    
            if($breakloop === false){
                $retArr["waitingNum"] += 1 ;
            }
        }
    }
    $sql = "SELECT count(*) as total  FROM `item` WHERE  `item`.`ownerID` = ?";  
    $stmt = mysqli_prepare($db, $sql);
    mysqli_stmt_bind_param($stmt,"i",$usr); 
    mysqli_stmt_execute($stmt); 
    $result = mysqli_stmt_get_result($stmt);
    if($rs = mysqli_fetch_assoc($result)) {
        $retArr["neverUsedNum"] = $rs["total"] - $retArr["waitingNum"] - $retArr["ItemUsedNum"];
    }
    return $retArr;
}
?>