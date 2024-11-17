import React from "react";
import logo from '../assets/img/Health___Fitness.png'; // Correctly importing the image

const Footer = () => {
   
    return (
        <footer className="footer" data-aos-duration="1100" data-aos="fade-up">
            <div className="container">
                <div className="footer__wrapper">
                    <div className="footer__box">
                        <div className="logo">
                            <div className="logo__img">
                                <img src={logo} alt="PeachPath Logo" />
                            </div>
                            <h2>MindfulMove</h2>
                        </div>
                        <p>
                        Enhance your mental well-being with tailored assessments and personalized growth strategies.
                        </p>
                    </div>
                    
                    <div className="footer__box">
                        <h4 className="footer__title">Company</h4>
                        <ul className="footer__links">
                            <li>
                                <a href="/programs">Our Programs</a>
                            </li>
                            <li>
                                <a href="/meal-plans">Meal Plans</a>
                            </li>
                            <li>
                                <a href="/membership">Become a member</a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__box">
                        <h4 className="footer__title">Healthy Living</h4>
                        <ul className="footer__links">
                            <li>
                                <a href="/fitness">Fitness</a>
                            </li>
                            <li>
                                <a href="/nutrition">Nutrition</a>
                            </li>
                            <li>
                                <a href="/experts">Experts</a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer__box">
                        <h4 className="footer__title">Quick Links</h4>
                        <ul className="footer__links">
                            <li>
                                <a href="/about">About us</a>
                            </li>
                            <li>
                                <a href="/contact">Contact us</a>
                            </li>
                            <li>
                                <a href="/support">Support</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <p className="copyright">Copyright @MindfulMove. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
