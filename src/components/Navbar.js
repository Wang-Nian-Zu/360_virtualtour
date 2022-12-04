import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import VirtualTourHomePage from "../VirtualTourHomePage.js";
import HomePage from "../pages/Home";
import Exhibition from "../pages/Exhibition";
import Curator from "../pages/Curator";
import LoginRegister from "../pages/LoginRegister";
import Account from "../pages/Account"
import MyInfo from "../pages/Account/MyInfo";
import MyExhibition from "../pages/Account/MyExhibition";
import AddExPage from "../pages/Account/MyExhibition/AddExPage";
import EditExPage from "../pages/Account/MyExhibition/EditExPage";
import EditExhibitiveExPage from "../pages/Account/MyExhibition/EditExhibitiveExPage";
import MyDetailExhibition from "../pages/Account/MyExhibition/MyDetailExhibition";
import MyVirtualTour from '../pages/Account/MyExhibition/MyVirtualTour.js';
import MyItem from "../pages/Account/MyItem";
import MyPanorama from "../pages/Account/MyPanorama";
import DetailExhibition from '../pages/Exhibition/DetailExhibition.js';
import DetailCurator from '../pages/Curator/DetailCurator.js';
import VirtualTour from '../pages/Exhibition/VirtualTour.js';
import ForgetPwd from '../pages/LoginRegister/ForgetPwd.js';
import EditPwd from "../pages/Account/EditPwd.js";
import "./index.css"
import useAuth from "../pages/LoginRegister/AuthUser";
import axios from 'axios';
import icon from "./images/textLogo.png";
import ScrollToTop from "./ScrollToTop.js";
import Live2DModel from './Live2DModel.js';

function NavBar() {
  const { auth, user } = useAuth();
  const logout = async (auth) => {
    axios({
      method: "get",
      url: "https://360.systemdynamics.tw/backendPHP/Control.php?act=logout",
      dataType: "JSON",
      withCredentials: true
    })
      .then((res) => {
        if (res.data.sessionIsClean)
          auth = false;
        console.log(auth);
        window.location.reload()
      })
      .catch(console.error);
  }
  return (
    <Router>
      <Navbar bg="light" variant="light" expand="lg" className="sticky-top">
        <Container fluid>
          <Navbar.Brand as={Link} to={"/"}>
            <img src={icon} alt="Facebook" width="140"
              height="40"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link as={Link} to={"/home"}> 首頁 </Nav.Link>
              <Nav.Link as={Link} to={"/exhibition"}> 展場 </Nav.Link>
              <Nav.Link as={Link} to={"/curators"}> 策展人 </Nav.Link>
            </Nav>
            <Nav navbarScroll>
              <div className="d-flex w-100">
                {auth ?
                  <div className="Userinfo d-flex">
                    <Navbar.Text>歡迎, </Navbar.Text>
                    <NavDropdown className="me-3" title={user} id="navbarScrollingDropdown">
                      <NavDropdown.Item as={Link} to={"/myInfo"}>後臺管理</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={logout} as={Link} to={"/"}>
                        登出
                      </NavDropdown.Item>
                    </NavDropdown>
                  </div>
                  :
                  <div className="d-flex w-100">
                    <Navbar.Text className='ms-2'>歡迎, {user}</Navbar.Text>
                    <Nav.Link as={Link} to={"/loginRegister"}>登入/註冊</Nav.Link>
                  </div>
                }
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<VirtualTourHomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/exhibition" element={<Exhibition />} />
          <Route path="/curators" element={<Curator />} />
          <Route path="/loginRegister" element={<LoginRegister />} />
          <Route path="/account" element={< Account />} />
          <Route path="/myInfo" element={<MyInfo />} />
          <Route path="/myExhibition" element={<MyExhibition />} />
          <Route path='/addExPage' element={<AddExPage />} />
          <Route path='/editExPage' element={<EditExPage />} />
          <Route path='/editExhibitiveExPage' element={<EditExhibitiveExPage />} />
          <Route path='/myDetailExhibition' element={<MyDetailExhibition />} />
          <Route path='/myVirtualTour' element={<MyVirtualTour />} />
          <Route path="/myItem" element={<MyItem />} />
          <Route path="/myPanorama" element={<MyPanorama />} />
          <Route path="/detailExhibition" element={<DetailExhibition />} />
          <Route path="/detailCurator" element={<DetailCurator />} />
          <Route path="/virtualTour" element={<VirtualTour />} />
          <Route path="/forgetPwd" element={<ForgetPwd />} />
          <Route path="/editPwd" element={<EditPwd />} />
        </Routes>
        <Live2DModel/>
      </div>
    </Router>
  );
}

export default NavBar;
