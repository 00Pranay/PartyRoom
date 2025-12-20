import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
const navLinks = [
{ name: 'Home', path: '/' },
{ name: 'Video Call', path: '/CreateRoom' },
{ name: 'Open Chat', path: '/JoinGlobalChat' },
{ name: 'File Transfer', path: '/LoginRegister' },
{ name: 'Read Me', path: '/ReadMe' }
];

return (
<nav style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
padding: '1px 32px',
backgroundColor: '#1f1f2e',
color: '#fff',
fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
fontWeight: '500',
boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
flexWrap: 'wrap'
}}>
<h1 style={{ fontSize: '1.8rem', color: '#5c7cfa', fontWeight: '700' }}>PartyRoom</h1>

  <div style={{
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  }}>
    {navLinks.map(link => (
      <Link
        key={link.name}
        to={link.path}
        style={{
          color: '#fff',
          textDecoration: 'none',
          fontSize: '1rem',
          padding: '6px 12px',
          borderRadius: '6px',
          transition: 'background 0.2s, color 0.2s'
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#5c7cfa';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#fff';
        }}
      >
        {link.name}
      </Link>
    ))}
  </div>
</nav>

);
}

export default Navbar;