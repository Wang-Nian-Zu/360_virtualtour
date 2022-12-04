import { useEffect, useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import MyExhibitionCard from './components/MyExhibitionCard.js';
import CreateMyExhibitionButton from './components/CreateMyExhibitionButton.js';
import MyNavbar from '../components/MyNavbar';
import { Row, Col } from 'react-bootstrap';
import Slider from "react-slick";

const MyExhibition = () => {
    const [windowSize, setWindowSize] = useState(window.innerHeight + window.scrollY - 56);
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(window.innerHeight + window.scrollY - 56);
            console.log(window.scrollY);
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            // 為了刪除之前的監聽事件
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        draggable: 1,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    let history = useNavigate(); //use for Navigate on Previous
    const [list, setList] = useState([]) // start with an empty array
    useEffect(() => {
        axios({
            method: "get",
            url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=isLogin',
            dataType: "JSON",
            withCredentials: true
        })
            .then((res) => {
                if (res.data.Login) { //如果有登入的話
                    axios({
                        method: "get",
                        url: 'https://360.systemdynamics.tw/backendPHP/Control.php?act=getMyExhibitionList',
                        dataType: "JSON",
                        withCredentials: true
                    })
                    .then((res) => {
                        console.log(res);
                        setList(res.data);
                    })
                    .catch(console.error)
                }
                else {
                    alert("error ! session has been lost!");
                    history(`/loginRegister`);
                }
            })
            .catch(console.error)
    }, [history])
    return (
        <div>
            <Row className='pt-0 me-0' style={{ height: windowSize }}>
                <Col md={2} className='navbar_menu'>
                    <MyNavbar />
                </Col>
                <Col className='d-flex flex-column m-3 w-50'>
                    <h1 className="text-center"> 我的展場 </h1>
                    <CreateMyExhibitionButton />
                    <h2><span style={{ color: '#d78559' }}>| </span> 展出中 </h2>
                    <div className="">
                        <Slider {...settings}>
                            {list.map((exhibition) => (
                                exhibition.status
                                    ? <div className='p-2' key={exhibition.eID}><MyExhibitionCard key={exhibition.eID} exhibition={exhibition} /></div>
                                    : null
                            ))}
                        </Slider>
                    </div>
                    <h2><span style={{ color: '#d78559' }}>| </span> 待展中 </h2>
                    <div className="justify-content-center">
                        <Slider {...settings} >
                            {list.map((exhibition) => (
                                exhibition.status
                                    ? null
                                    : <div className='p-2' key={exhibition.eID}><MyExhibitionCard key={exhibition.eID} exhibition={exhibition} /></div>
                            ))}
                        </Slider>
                    </div>
                </Col>  
            </Row>
        </div>
    )
}

export default MyExhibition;