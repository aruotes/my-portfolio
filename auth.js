// Enhanced authentication and message management system
const USERNAME = "aryandubey";
const PASSWORD = "710aryan"; // In production, use environment variables

// Message types
const MESSAGE_TYPES = {
    MAIN: 'main',
    POETRY: 'poetry'
};

// DOM elements
const loginForm = document.getElementById('login-form');
const messagePanel = document.getElementById('message-panel');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const messageContent = document.getElementById('message-content');
const postTypeSelect = document.getElementById('post-type');
const messageTitleInput = document.getElementById('message-title');

// Login function
function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    if (username === USERNAME && password === PASSWORD) {
        localStorage.setItem('loggedIn', 'true');
        loginForm.classList.add('hidden');
        messagePanel.classList.remove('hidden');
        loadMessages();
    } else {
        alert('Invalid credentials');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
    loginForm.classList.remove('hidden');
    messagePanel.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Message functions
function loadMessages() {
    const type = postTypeSelect.value;
    if (type === MESSAGE_TYPES.MAIN) {
        const message = localStorage.getItem('portfolioMessage');
        if (message) messageContent.value = message;
    } else {
        messageContent.value = '';
    }
}

function updateMessage() {
    const type = postTypeSelect.value;
    const content = messageContent.value;
    const title = messageTitleInput.value || 'Untitled';

    if (type === MESSAGE_TYPES.MAIN) {
        localStorage.setItem('portfolioMessage', content);
    } else {
        const poetryItems = JSON.parse(localStorage.getItem('poetryItems') || '[]');
        poetryItems.push({
            title,
            content,
            date: new Date().toISOString()
        });
        localStorage.setItem('poetryItems', JSON.stringify(poetryItems));
    }
    alert('Message updated successfully!');
    messageContent.value = '';
    messageTitleInput.value = '';
}

function deleteMessages() {
    const type = postTypeSelect.value;
    if (type === MESSAGE_TYPES.MAIN) {
        localStorage.removeItem('portfolioMessage');
        alert('Main message cleared!');
    } else {
        if (confirm('Delete ALL poetry items? This cannot be undone.')) {
            localStorage.removeItem('poetryItems');
            alert('All poetry items cleared!');
            loadPoetryItems();
        }
    }
}

function loadPoetryItems() {
    const container = document.getElementById('poetry-items');
    if (!container) return;
    
    const poetryItems = JSON.parse(localStorage.getItem('poetryItems') || '[]');
    container.innerHTML = poetryItems.map((item, index) => `
        <div class="bg-gray-700 p-3 rounded-lg mb-4">
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium">${item.title}</h4>
                <button onclick="if(confirm('Delete this poem permanently?')) deletePoetryItem(${index})" 
                        class="text-red-500 hover:text-red-700 px-3 py-1 rounded transition">
                    <i class="fas fa-trash mr-1"></i> Delete
                </button>
            </div>
            <p class="text-sm text-gray-300">
                ${item.content.length > 200 ? 
                 `${item.content.substring(0, 200)}...` : 
                 item.content}
            </p>
            ${item.content.length > 200 ? `
            <button onclick="this.previousElementSibling.innerHTML = \`${item.content.replace(/`/g, '\\`')}\`; this.remove()"
                    class="text-blue-400 hover:text-blue-300 text-sm mt-1">
                Show Full Poem
            </button>
            ` : ''}
            <p class="text-xs text-gray-500 mt-2">
                ${new Date(item.date).toLocaleString()}
            </p>
        </div>
    `).join('');
}

function deletePoetryItem(index) {
    // Verify we're in admin context
    if (!document.getElementById('message-panel') || 
        document.getElementById('message-panel').classList.contains('hidden')) {
        console.error('Delete attempted from non-admin context!');
        return;
    }

    try {
        console.group('Deleting Poetry Item');
        console.log('Index:', index);
        
        // Get current items with fallback
        const currentItems = localStorage.getItem('poetryItems');
        if (!currentItems) {
            console.warn('No poetry items found in storage');
            alert('No poems found to delete');
            return;
        }

        const poetryItems = JSON.parse(currentItems);
        console.log('Current items:', poetryItems);

        // Validate index
        if (isNaN(index) || index < 0 || index >= poetryItems.length) {
            throw new Error(`Invalid index: ${index}`);
        }

        // Perform deletion
        const deletedItem = poetryItems.splice(index, 1);
        console.log('Deleted item:', deletedItem);
        
        // Save back to storage
        localStorage.setItem('poetryItems', JSON.stringify(poetryItems));
        console.log('Updated items:', poetryItems);
        
        // Refresh display
        loadPoetryItems();
        console.groupEnd();
        alert(`Deleted: ${deletedItem[0].title || 'Untitled Poem'}`);
        
    } catch (error) {
        console.error('Deletion Error:', error);
        alert(`Deletion failed: ${error.message}`);
        console.groupEnd();
    }
}

// Test function to verify deletion
function testDeleteFunctionality() {
    const testItems = [
        {title: "Test Poem 1", content: "Test content 1", date: new Date().toISOString()},
        {title: "Test Poem 2", content: "Test content 2", date: new Date().toISOString()}
    ];
    localStorage.setItem('poetryItems', JSON.stringify(testItems));
    console.log('Test data created. Attempting to delete item 0...');
    deletePoetryItem(0);
}

// Event listeners
postTypeSelect.addEventListener('change', loadMessages);

// Uncomment below line to run tests when auth.js loads
// window.addEventListener('DOMContentLoaded', testDeleteFunctionality);

// Check auth on load
if (localStorage.getItem('loggedIn') === 'true') {
    loginForm.classList.add('hidden');
    messagePanel.classList.remove('hidden');
    loadMessages();
}
