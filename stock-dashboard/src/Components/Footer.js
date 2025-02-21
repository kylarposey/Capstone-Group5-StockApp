import React from 'react';

function Footer() {
   const year = new Date().getFullYear();
   return (
      <footer className="footer">
         <p>Copyright &copy; {year} - Team 5 Stock App</p>
      </footer>
   );

}

export default Footer;