import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditPost() {
  const { id } = useParams(); // URL에서 게시글 ID 가져오기
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/posts/${id}`);
        const postData = await response.json();
        setTitle(postData.title);
        setContent(postData.content);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };

    fetchPost();
  }, [id]);

  // 게시글 수정
  const handleUpdatePost = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        alert('게시글이 수정되었습니다.');
        navigate(`/post/${id}`); // 수정 후 상세 페이지로 이동
      } else {
        alert('게시글 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>게시글 수정</h2>
      <form onSubmit={handleUpdatePost}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
            rows="6"
          ></textarea>
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          수정하기
        </button>
      </form>
    </div>
  );
}
