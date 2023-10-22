import React from 'react'
import "../css/Home.css"
import { Slide } from 'react-slideshow-image';
import chair1 from '../css/Chair'
import chair2 from '../css/chair2'
import sofa1 from '../css/sofa1'
import sofa2 from '../css/sofa2'
import sofa3 from '../css/sofa3'
import sofa4 from '../css/sofa4'


const Home = () => {
    return (
        <div id="home-page">
            <h1>Linares Upholstery</h1>
            <Slide>
                <div className="each-slide-effect">
                    <img src={chair1} />
                </div>
                <div className="each-slide-effect">
                    <img src={chair2} />
                </div>
                <div className="each-slide-effect">
                    <img src={sofa1} />
                </div>
                <div className="each-slide-effect">
                    <img src={sofa2} />
                </div>
                <div className="each-slide-effect">
                    <img src={sofa3} />
                </div>
                <div className="each-slide-effect">
                    <img src={sofa4} />
                </div>
            </Slide>
        </div>
    )
}

export default Home