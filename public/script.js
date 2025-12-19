// DOM 요소
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const infoText = document.getElementById('infoText');

// API 호출 함수들
async function fetchTodos() {
    try {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        renderTodos(todos);
        updateInfo(todos);
    } catch (error) {
        console.error('Todo 목록을 가져오는 중 오류 발생:', error);
        infoText.textContent = '오류: Todo 목록을 불러올 수 없습니다.';
    }
}

async function addTodo(text) {
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        if (response.ok) {
            todoInput.value = '';
            fetchTodos();
        } else {
            const error = await response.json();
            alert(error.error || 'Todo 추가 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('Todo 추가 중 오류 발생:', error);
        alert('Todo 추가 중 오류가 발생했습니다.');
    }
}

async function toggleTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PATCH'
        });
        
        if (response.ok) {
            fetchTodos();
        }
    } catch (error) {
        console.error('Todo 상태 변경 중 오류 발생:', error);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            fetchTodos();
        }
    } catch (error) {
        console.error('Todo 삭제 중 오류 발생:', error);
    }
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

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// Enter 키로도 추가 가능하도록
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

