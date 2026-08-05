import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8006/api/boards';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 1. 전체 목록 조회
  const fetchBoards = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setBoards(data);
    } catch (err) {
      console.error("목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  // 2. 단건 상세 조회 (조회수 +1)
  const handleSelect = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`);
      const data = await res.json();
      setSelectedBoard(data);
      fetchBoards(); // 목록의 조회수 즉시 갱신
    } catch (err) {
      console.error("상세 조회 실패:", err);
    }
  };

  // 3. 게시글 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력하세요.");

    try {
      await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardTitle: title, boardContent: content }),
      });
      setTitle('');
      setContent('');
      fetchBoards();
    } catch (err) {
      console.error("등록 실패:", err);
    }
  };

  // 4. 게시글 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (selectedBoard?.boardNo === id) setSelectedBoard(null);
      fetchBoards();
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h2>📌 익명 게시판 </h2>

      {/* 게시글 작성 Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <h4 style={{ marginTop: 0 }}>새 글 작성</h4>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', height: '80px', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          등록
        </button>
      </form>

      {/* 게시글 상세 보기 Panel */}
      {selectedBoard && (
        <div style={{ background: '#e9ecef', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ced4da' }}>
          <h4>[{selectedBoard.boardNo}] {selectedBoard.boardTitle}</h4>
          <p style={{ color: '#6c757d', fontSize: '0.85em' }}>
            작성시각: {new Date(selectedBoard.createDate).toLocaleString()} | 조회수: {selectedBoard.count}
          </p>
          <hr />
          <p style={{ whiteSpace: 'pre-wrap' }}>{selectedBoard.boardContent}</p>
          <button onClick={() => setSelectedBoard(null)} style={{ marginRight: '8px', cursor: 'pointer' }}>닫기</button>
          <button onClick={() => handleDelete(selectedBoard.boardNo)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
            삭제
          </button>
        </div>
      )}

      {/* 게시글 목록 Table */}
      <h3>게시글 목록</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse', borderColor: '#ddd' }}>
        <thead>
          <tr style={{ background: '#f1f1f1' }}>
            <th>번호</th>
            <th>제목</th>
            <th>조회수</th>
            <th>작성일시</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {boards.length === 0 ? (
            <tr><td colSpan="5">등록된 게시글이 없습니다.</td></tr>
          ) : (
            boards.map((b) => (
              <tr key={b.boardNo}>
                <td>{b.boardNo}</td>
                <td style={{ cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }} onClick={() => handleSelect(b.boardNo)}>
                  {b.boardTitle}
                </td>
                <td>{b.count}</td>
                <td>{new Date(b.createDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(b.boardNo)} style={{ cursor: 'pointer' }}>삭제</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}