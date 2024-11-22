import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [views, setViews] = useState(0);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/posts/${id}`);
        const data = await response.json();
        setPost(data);
        setViews(data.view || 0);
        const commentsRes = await fetch(`http://localhost:8080/posts/${id}/comments`);
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (err) {
  
      }
    };

    fetchPost();
  }, [id]);

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm('게시글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        navigate('/');
      }
    } catch (err) {
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleAddComment = async () => {
    try {
      const response = await fetch('http://localhost:8080/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postid: id, comment: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, { postid: data.comment_id, comment: newComment }]);

        const commentResponse = await fetch(`http://localhost:8080/posts/${id}/comments`);
        const commentData = await commentResponse.json();
        setComments(commentData); // 댓글 목록 업데이트
        setNewComment('');
      } 
    } catch (err) {
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>{post.title}</h2>
      <p style={{ marginBottom: '20px' }}>{post.content}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>조회수: {views}</span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          style={{
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
          onClick={() => navigate(`/edit/${id}`)}
        >
          수정
        </button>
        <button
          style={{
            padding: '8px 12px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={handleDeletePost}
        >
          삭제
        </button>
      </div>

      <div>
        <h3>댓글</h3>
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div>
              <strong>{comment.author}</strong>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <textarea
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        ></textarea>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={handleAddComment}
        >
          댓글 작성
        </button>
      </div>
    </div>
  );
};