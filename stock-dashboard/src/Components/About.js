import React from 'react';
import "../assets/css/About.css";
import bigBrainImage from '../assets/css/big_brain.jpg';
import lostImage from '../assets/css/lost.png';
import bossImage from '../assets/css/boss.jpg';

function About() {
   return (

      <div className="about-container">
         <div className="about-content">
            <h2>About Us</h2>
            <br></br>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Background</span>
            <br></br>
            We are a group of 3 students from University of West Florida and we decided to create an application based on educating people on investing in the stock market.
            The reason we wanted to create this application was because investors and traders rely on multiple platforms to gather data on stock performance, track portfolios, and assess financial news and sentiment.
            However, existing tools are often fragmented, requiring users to switch between apps to compare stocks, set alerts, and analyze sentiment.
            This disjointed approach can lead to inefficient research and missed opportunities.
            <br></br>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Goals</span>
            <br></br>
            Our goal is to create an easy to use interactive platform where users can:
            <br></br>
            -Find basic stock information and educate new users on basic financial concepts
            <br></br>
            -Recommend and build a portfolio based on user selected risk tolerance and themes
            <br></br>
            -View relevant stock news based on user portfolio or sector interests
            <br></br>
            -Create a watchlist and notification system
            <br></br>
            -Visualize performance based on historical data
            <br></br>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Meet the Team</span>
            <div className="team-container">
               <div className="team-member">
                  <img src={bigBrainImage} alt="Kylar Posey" className="team-image" />
                  <p>Kylar Posey</p>
                  <p>Software Design Major</p>
                  <p>Software Engineering Lead / Coding Lead</p>
               </div>
               <div className="team-member">
                  <img src={lostImage} alt="Kyle Rivera" className="team-image" />
                  <p>Kyle Rivera</p>
                  <p>CyberSecurity Major</p>
                  <p>Security Lead</p>
               </div>
               <div className="team-member">
                  <img src={bossImage} alt="Paul Negrido" className="team-image" />
                  <p>Paul Negrido</p>
                  <p>Computer Science Major</p>
                  <p>Team Lead / Testing Lead</p>
               </div>
            </div>
         </div>
      </div>
      
   );
}

export default About;