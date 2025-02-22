import React from 'react';
//import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

//import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link


function About() {
   return (
      <div style={{ fontSize: '18px' }}>
         <br></br>
         <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Background</span>
         <br></br>
         We are a group of 3 students from University of West Florida and we decided to create an application based on educating people on investing in the stock market.
         The reason we wanted to create this application was becasuse investors and traders rely on multiple platforms to gather data on stock performance, track portfolios, and assess financial news and sentiment.
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
         <br></br>
         Kylar Posey - Software Design Major - Software Engineering Lead / Coding Lead
         <br></br>
         Kyle Rivera - CyberSecurity Major - Security Lead
         <br></br>
         Paul Negrido - Computer Science Major - Team Lead / Testing Lead
      </div>
   );
}


export default About;