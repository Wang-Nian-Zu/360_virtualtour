import React from "react";
import '../index.css';

const Footer = () => <footer className="page-footer font-small blue pt-4" style={{ backgroundColor: '#d78559dd', color: '#FFFFFF' }}>
    <div className="container-fluid text-center text-md-left">
        <div className="row">
            <div className="col-md-5 mt-md-0 mt-3">

                <h5 className="text-uppercase" ><a href="/" style={{ color: '#FFFFFF' }}> 360°虛擬策展</a></h5>
                <p id="intro">提供使用者參觀展覽、自行設置展覽功能<br /> 讓欣賞藝術、策展不再困難重重！</p>
            </div>

            <hr className="clearfix w-100 d-md-none pb-0" />

            <div className="footer-links col-md-2 mb-md-0 mb-3" >
                <h5 className="text-uppercase" >成員</h5>
                <ul className="list-unstyled ">
                    <li>王念祖</li>
                    <li>王俞文</li>
                    <li>柯予亮</li>
                    <li>謝沐恩</li>
                    <li>簡翎恩</li>
                </ul>
            </div>
            <div className="footer-links col-md-2 mb-md-0 mb-3" >
                <h5 className="text-uppercase">指導教授</h5>
                <ul className="list-unstyled">
                    <li>陳建宏 教授</li>
                    <li>李健菁 教授</li>
                </ul>
            </div>
            <div className="footer-links col-md-3 mb-md-0 mb-3">
                <h5 className="text-uppercase">合作單位</h5>
                <ul className="list-unstyled">
                    <li>南投陶展示館</li>
                    <li>南投縣陶藝學會</li>
                    <li>南投縣政府文化局</li>
                    <li>埔里基督教醫院</li>
                </ul>
            </div>
        </div>
    </div>
    <div className="footer-copyright text-center py-3">© 2022 授權:國立暨南國際大學資管系</div>

</footer>

export default Footer