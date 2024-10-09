import React, {  useState, useEffect } from 'react';
import heroImg from '../assets/img/model1-removebg-preview.png'; // Correctly importing the image
import './Hero.css'
import AuthModal from '../component/modal';

const Hero = () => {

  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [animateZoom, setAnimateZoom] = useState(false);
  

  useEffect(() => {
    // Trigger the zoom-in animation effect after the component mounts
    setAnimateZoom(true);
  }, []);

  const openPHQ9Questionnaire = () => {

    window.open('/all-yoga', '_blank');

  };

  return (
    <section id="#">
      <div className="container">
        <div className="hero__wrapper">
          <div className="hero__content">
            <h2 className="section__title" data-aos-duration="1000" data-aos="fade-up">
              Discover a Healthier You <span className="highlights">Assess, Act, Achieve</span>
            </h2>
            <p data-aos-duration="1100" data-aos="fade-up" data-aos-delay="100">
              Elevate your mental well-being with our all-in-one platform!
              <br /> Get tailored assessments for anxiety and depression, discover personalized <br /> strategies for growth
              and harness the power of AI-driven fitness coaching. <br /> <br />
              Your journey to optimal health starts here!
            </p>

            <div
              className="hero__btns"
              data-aos-duration="1200"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <button className="register__btn" onClick={openPHQ9Questionnaire}>
                {' '}
                See How it Works
              </button>
             
            </div>
          </div>

          <div className="hero__img">
            <div className={`hero__img-wrapper ${animateZoom ? 'animate-zoom-in' : ''}`}>
              <div className="box-01">
                <div className="box-02">
                  <div className="box-03">
                    <div className="box__img">
                      <img src={heroImg} alt="err" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <AuthModal isOpen={isLoginModalOpen} onRequestClose={() => setIsLoginModalOpen(false)} />
    </section>
  );
};

export default Hero;
