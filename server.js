const express = require('express');
const path = require('path');

const app = express();
// 로컬 환경에서 실행 (도커 사용 안 함)
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(express.json());
// 정적 파일 제공 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 기반 Todo 저장소 (로컬 실행용)
let todos = [];
let nextId = 1;

// API 라우트
// GET /api/todos - 모든 Todo 조회
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// POST /api/todos - 새 Todo 추가
app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Todo 텍스트가 필요합니다.' });
    }
    
    const newTodo = {
        id: nextId++,
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// PATCH /api/todos/:id - Todo 완료 상태 토글
app.patch('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({ error: 'Todo를 찾을 수 없습니다.' });
    }
    
    todo.completed = !todo.completed;
    res.json(todo);
});

// DELETE /api/todos/:id - Todo 삭제
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Todo를 찾을 수 없습니다.' });
    }
    
    todos.splice(index, 1);
    res.status(204).send();
});

// 서버 시작 (로컬 환경 전용 - 도커 사용 안 함)
app.listen(PORT, 'localhost', () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`브라우저에서 http://localhost:${PORT} 를 열어주세요.`);
});

