// Real-time Message Board
function initMessageBoard() {
    const messageDisplay = document.getElementById('display-message');
    if (!messageDisplay) return;

    const renderMessage = () => {
        const message = localStorage.getItem('portfolioMessage');
        messageDisplay.innerHTML = message ? `
            <div class="message-content bg-gray-800 p-4 rounded-lg">
                <h3 class="text-xl font-semibold text-green-400 mb-2">Latest Update</h3>
                <p class="text-gray-300">${message}</p>
                <p class="text-gray-500 text-xs mt-2">
                    Updated: ${new Date().toLocaleTimeString()}
                </p>
            </div>
        ` : `
            <div class="message-content bg-gray-800 p-4 rounded-lg">
                <p class="text-gray-400">No current announcements</p>
            </div>
        `;
    };

    // Initial render
    renderMessage();
    
    // Update when storage changes
    window.addEventListener('storage', renderMessage);
}

// Date/Time Display
function initDateTime() {
    const update = () => {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        document.getElementById('datetime').textContent = now.toLocaleDateString('en-IN', options);
    };
    update();
    setInterval(update, 1000);
}

// Mobile Menu Toggle
function initMobileMenu() {
    document.querySelector('.mobile-menu-button')?.addEventListener('click', () => {
        document.querySelector('.mobile-menu')?.classList.toggle('open');
    });
}

// Load and display poetry items
function loadPoetryItems() {
    const container = document.getElementById('poetry-container');
    if (!container) return;
    
    const items = JSON.parse(localStorage.getItem('poetryItems') || '[]');
        container.innerHTML = items.map(item => {
            const maxLength = 150;
            const shouldTruncate = item.content.length > maxLength;
            const displayText = shouldTruncate ? 
                `${item.content.substring(0, maxLength)}...` : 
                item.content;
            
            return `
            <div class="poetry-item bg-gray-700 p-4 rounded-lg mb-4">
                <h4 class="text-green-400 font-medium mb-2">${item.title || 'Untitled'}</h4>
                <p class="text-gray-300 italic">${displayText}</p>
                ${shouldTruncate ? `
                <button onclick="this.previousElementSibling.innerHTML = \`${item.content.replace(/`/g, '\\`')}\`; this.remove()"
                        class="text-blue-400 hover:text-blue-300 text-sm mt-1">
                    See More
                </button>
                ` : ''}
                <p class="text-gray-500 text-xs mt-2">
                    ${new Date(item.date).toLocaleString()}
                </p>
            </div>
            `;
        }).join('');
}

// Delete single poetry item
function deletePoetryItem(index) {
    const poetryItems = JSON.parse(localStorage.getItem('poetryItems') || '[]');
    poetryItems.splice(index, 1);
    localStorage.setItem('poetryItems', JSON.stringify(poetryItems));
    loadPoetryItems();
    alert('Poem deleted successfully!');
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initDateTime();
    initMessageBoard();
    initMobileMenu();
    loadPoetryItems();
    
    // Update poetry items when storage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'poetryItems') {
            loadPoetryItems();
        }
    });
});
