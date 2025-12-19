// DOM 요소
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const infoText = document.getElementById('infoText');

// LocalStorage 키
const STORAGE_KEY = 'todos';

// LocalStorage에서 Todo 목록 가져오기
function getTodos() {
    const todosJson = localStorage.getItem(STORAGE_KEY);
    return todosJson ? JSON.parse(todosJson) : [];
}

// LocalStorage에 Todo 목록 저장하기
function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Todo 목록 불러오기 및 렌더링
function fetchTodos() {
    const todos = getTodos();
    renderTodos(todos);
    updateInfo(todos);
}

// 새 Todo 추가
function addTodo(text) {
    if (!text || text.trim().length === 0) {
        alert('할 일을 입력해주세요!');
        return;
    }
    
    const todos = getTodos();
    const newTodo = {
        id: Date.now(), // 고유 ID 생성
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveTodos(todos);
    todoInput.value = '';
    fetchTodos();
}

// Todo 완료 상태 토글
function toggleTodo(id) {
    const todos = getTodos();
    const todo = todos.find(t => t.id === id);
    
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos(todos);
        fetchTodos();
    }
}

// Todo 삭제
function deleteTodo(id) {
    const todos = getTodos();
    const filteredTodos = todos.filter(t => t.id !== id);
    saveTodos(filteredTodos);
    fetchTodos();
}

// UI 렌더링 함수들
function renderTodos(todos) {
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty-state">할 일이 없습니다. 새로운 Todo를 추가해보세요!</li>';
        return;
    }
    
    todoList.innerHTML = todos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
        </li>
    `).join('');
}

function updateInfo(todos) {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;
    
    if (total === 0) {
        infoText.textContent = '';
    } else {
        infoText.textContent = `전체: ${total}개 | 완료: ${completed}개 | 남은 작업: ${remaining}개`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 이벤트 리스너
addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
    } else {
        alert('할 일을 입력해주세요!');
        todoInput.focus();
    }
});

todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            addTodo(text);
        }
    }
});

// 전역 함수로 만들기 (인라인 이벤트 핸들러 사용)
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

// 페이지 로드 시 Todo 목록 가져오기
fetchTodos();

