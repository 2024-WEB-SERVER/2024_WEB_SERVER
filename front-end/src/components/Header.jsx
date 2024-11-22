import React from 'react';
import { Link } from 'react-router-dom';
export default function Header() {
    const headerStyle = {
        backgroundColor: '#f0f0f0', // 회색 바
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
      };
    
      return (
        <header style={headerStyle}>
          <h1 style={{ margin: 0 }}>게시판</h1>
          <Link to="write">글쓰기</Link>
        </header>
      );
}