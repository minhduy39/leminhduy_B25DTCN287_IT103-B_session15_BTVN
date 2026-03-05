// Mảng lưu trữ danh sách công việc
let tasks = [];
let taskIdCounter = 1;

// Lấy các phần tử DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const completedCount = document.getElementById('completedCount');
const totalCount = document.getElementById('totalCount');
const completionStatus = document.getElementById('completionStatus');

// Khởi tạo ứng dụng
function init() {
    renderTasks();
    updateFooter();

    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}

// Thêm công việc mới
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Vui lòng nhập tên công việc!');
        taskInput.focus();
        return;
    }

    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    taskInput.focus();

    renderTasks();
    updateFooter();
}

// Render danh sách công việc
function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">Chưa có công việc nào. Hãy thêm công việc mới!</div>
            </div>
        `;
        return;
    }

    tasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// Tạo phần tử công việc
function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Task text
    const taskText = document.createElement('span');
    taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
    taskText.textContent = task.text;

    // Actions container
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.textContent = '✏️ Sửa';
    editBtn.addEventListener('click', () => editTask(task.id));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = '🗑️ Xóa';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(actions);

    return taskItem;
}

// Đánh dấu hoàn thành/chưa hoàn thành
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateFooter();
    }
}

// Sửa công việc
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    const taskTextElement = taskItem.querySelector('.task-text');
    const actions = taskItem.querySelector('.task-actions');

    // Thêm class editing
    taskItem.classList.add('editing');

    // Tạo input để sửa
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = task.text;

    // Tạo nút Lưu
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-save';
    saveBtn.textContent = '💾 Lưu';
    saveBtn.addEventListener('click', () => saveTask(taskId, editInput.value));

    // Tạo nút Hủy
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-cancel';
    cancelBtn.textContent = '❌ Hủy';
    cancelBtn.addEventListener('click', () => renderTasks());

    // Xóa actions cũ và thêm input + buttons mới
    actions.innerHTML = '';
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    // Thêm input vào task item
    taskItem.insertBefore(editInput, actions);
    editInput.focus();
    editInput.select();

    // Cho phép nhấn Enter để lưu
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTask(taskId, editInput.value);
        } else if (e.key === 'Escape') {
            renderTasks();
        }
    });
}

// Lưu công việc sau khi sửa
function saveTask(taskId, newText) {
    const trimmedText = newText.trim();

    if (trimmedText === '') {
        alert('Tên công việc không được để trống!');
        return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.text = trimmedText;
        renderTasks();
        updateFooter();
    }
}

// Xóa công việc
function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa công việc "${task.text}"?`);

    if (confirmDelete) {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
        updateFooter();
    }
}

// Cập nhật footer
function updateFooter() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    totalCount.textContent = total;
    completedCount.textContent = completed;

    // Hiển thị badge hoàn thành tất cả
    if (total > 0 && completed === total) {
        completionStatus.innerHTML = `
            <div class="completion-badge">
                <span class="check-icon">✅</span>
                <span>Hoàn thành tất cả!</span>
            </div>
        `;
    } else {
        completionStatus.innerHTML = '';
    }
}
                            
// Khởi chạy ứng dụng
init();
