from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React의 로컬 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = sqlite3.connect('./database.db', check_same_thread=False)
cur = conn.cursor()

cur.execute('''CREATE TABLE IF NOT EXISTS POST (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 title TEXT,
                 content TEXT,
                 view INTEGER DEFAULT 0
                 );''')
conn.commit()

cur.execute('''CREATE TABLE IF NOT EXISTS COMMENT (
                 commentid INTEGER PRIMARY KEY AUTOINCREMENT,
                 postid INTEGER,
                 userid INTEGER,
                 comment TEXT,
                 FOREIGN KEY(postid) REFERENCES POST(postid),
                 FOREIGN KEY(userid) REFERENCES USER(userid)
                 );''')
conn.commit()


# Pydantic 모델 정의
class PostCreate(BaseModel):
    title: str
    content: str

class PostUpdate(BaseModel):
    title: str
    content: str

class CommentCreate(BaseModel):
    postid: int
    comment: str

# 게시글 작성
@app.post("/posts")
def create_post(post: PostCreate):
    cur.execute("INSERT INTO POST (title, content) VALUES (?, ?)", (post.title, post.content))
    conn.commit()
    return {"message": "Post created successfully", "post_id": cur.lastrowid}

# 게시글 수정
@app.put("/posts/{post_id}")
def update_post(post_id: int, post: PostUpdate):
    cur.execute("UPDATE POST SET title = ?, content = ? WHERE id = ?", (post.title, post.content, post_id))
    conn.commit()
    return {"message": "Post updated successfully"}

# 게시글 삭제
@app.delete("/posts/{post_id}")
def delete_post(post_id: int):
    cur.execute("DELETE FROM POST WHERE id = ?", (post_id,))
    conn.commit()
    return {"message": "Post deleted successfully"}

@app.get("/posts/{post_id}/comments")
def get_comment(post_id: int):
    cur.execute("SELECT postid, comment FROM COMMENT WHERE postid = ?", (post_id,))
    comments = cur.fetchall()

    # 댓글이 없는 경우 빈 리스트 반환
    if not comments:
        return []

    # 댓글 데이터를 JSON 형식으로 변환
    return [{"id": comment[0], "content": comment[1]} for comment in comments]

# 댓글 작성
@app.post("/comments")
def create_comment(comment: CommentCreate):
    cur.execute("INSERT INTO COMMENT (postid, comment) VALUES (?, ?)", (comment.postid, comment.comment))
    conn.commit()
    comment_id = cur.lastrowid
    return {"comment_id": comment_id}

# 조회수 확인 및 증가
@app.get("/posts/{post_id}")
def get_post(post_id: int):
    cur.execute("SELECT * FROM POST WHERE id = ?", (post_id,))
    post = cur.fetchone()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    # 조회수 증가
    cur.execute("UPDATE POST SET view = view + 1 WHERE id = ?", (post_id,))
    conn.commit()
    return {"id": post[0], "title": post[1], "content": post[2], "view": post[3]}

# 페이징 처리
@app.get("/posts")
def get_posts():
    cur.execute("SELECT * FROM POST ORDER BY id DESC")
    posts = cur.fetchall()
    return [
        {"id": post[0], "title": post[1], "content": post[2], "view": post[3]}
        for post in posts
    ]