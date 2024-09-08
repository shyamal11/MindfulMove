import React from 'react';



const Exercise = () => {

    const lunges = "https://shyamal11.github.io/backend-innerBalanceHub/assets/img/lunges.png";
    const yoga = "https://shyamal11.github.io/backend-innerBalanceHub/assets/img/yoga-pose.png";
    const ex = "https://shyamal11.github.io/backend-innerBalanceHub/assets/img/extended.png";
  
    return (
        <section>
            <div className="container exercise__top">
                <div className="exercise__top">
                    <h2 className="section__title">How it <span className="highlights">Works</span></h2>
                  
                </div>
                <div className="exButtonm">
                    <div className="exercise__wrapper">
                        <div className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
                            <span className="exercise__icon"><img src={lunges} alt="err" /></span>

                            <div className="exercise__content">
                            <h4>Assessment </h4>
                            <p>Include stress, anxiety, and depression assessments to understand your mental well-being.</p>
                            </div>
                        </div>

                        <div className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
                            <span className="exercise__icon"><img src={yoga} alt="err" /></span>

                            <div className="exercise__content">
                            <h4>Suggested Yoga</h4>
                            <p>Based on your assessment, we recommend yoga to improve flexibility, mental clarity, and overall well-being.</p>
                            </div>
                        </div>

                        <div className="exercise__item" data-aos-duration="1500" data-aos="zoom-in">
                            <span className="exercise__icon"><img src={ex} alt="err" /></span>

                            <div className="exercise__content">
                            <h4>Yoga with AI Instructor</h4>
                            <p>Experience live yoga sessions guided by AI instructors for personalized and interactive sessions.</p>
                            </div>
                        </div>


                    </div>
                    <div className="exButton">
                        <button onClick={() => console.log("Start button clicked for Healthy Life")} className="btn btn-primary fit-width">Start</button>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default Exercise;
