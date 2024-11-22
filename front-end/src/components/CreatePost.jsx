export default function CreatePost() {
    return (
      <div>
        <h2>게시글 작성</h2>
        <form>
          <label>
            제목:
            <input type="text" name="title" />
          </label>
          <br />
          <label>
            내용:
            <textarea name="content"></textarea>
          </label>
          <br />
          <button type="submit">등록하기</button>
        </form>
      </div>
    );
  }
  