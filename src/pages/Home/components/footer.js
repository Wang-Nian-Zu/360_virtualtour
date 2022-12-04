import React from "react";
import '../index.css';

const Footer = () => <footer className="page-footer font-small blue pt-4" style={{ backgroundColor: '#d78559dd', color: '#424242' }}>
    <div className="container-fluid text-center text-md-left">
        <div className="row">
            <div className="col-md-6 mt-md-0 mt-3">

                <h5 className="text-uppercase" ><a href="/" style={{ color: '#FFFAD4' }}> 360 Virtual Tour</a></h5>
                <p>Here you can use rows and columns to organize your footer content.</p>
            </div>

            <hr className="clearfix w-100 d-md-none pb-0" />

            <div className="footer-links col-md-3 mb-md-0 mb-3" >
                <h5 className="text-uppercase" > 關於我們 </h5>
                <ul className="list-unstyled ">
                    <li><a href="#!" >Link 1</a></li>
                    <li><a href="#!" >Link 2</a></li>
                    <li><a href="#!" >Link 3</a></li>
                    <li><a href="#!" >Link 4</a></li>
                </ul>
            </div>

            <div className=" footer-links col-md-3 mb-md-0 mb-3">
                <h5 className="text-uppercase">常見問題</h5>
                <ul className="list-unstyled">
                    <li><a href="#!" >Link 1</a></li>
                    <li><a href="#!" >Link 2</a></li>
                    <li><a href="#!" >Link 3</a></li>
                    <li><a href="#!" >Link 4</a></li>
                </ul>
            </div>
        </div>
    </div>

    <div className="footer-copyright text-center py-3">© 2022 授權:國立暨南國際大學資管系</div>

</footer>

export default Footer