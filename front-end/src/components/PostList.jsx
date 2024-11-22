import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [page] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:8080/posts?page=${page}`);
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, [page]);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>게시글 목록</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>번호</th>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>제목</th>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>내용</th>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr
              key={post.id}
              style={{ borderBottom: '1px solid #ddd', cursor: 'pointer' }}
              onClick={() => handlePostClick(post.id)}
            >
              <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{index + 1}</td>
              <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{post.title}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{post.content}</td>
              <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>{post.view}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
