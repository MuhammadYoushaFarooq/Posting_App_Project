// Global variables
let posts = [];
let currentPostId = 0;
let currentDetailPostId = null;
let selectedBackgroundImage = '';

// Background images object
const backgroundImages = {
    'nature': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'city': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    'green': 'https://static.vecteezy.com/system/resources/thumbnails/049/547/631/small_2x/stunning-high-resolution-nature-and-landscape-backgrounds-breathtaking-scenery-in-hd-free-photo.jpg',
    'forest': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'ocean': 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop',
    'sunset': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
};

// Create a new post
function createPost() {
    const postInput = document.getElementById('postInput');
    const content = postInput.value.trim();
    
    if (!content) {
        showNotification('Please write something to post!', 'error');
        return;
    }

    const post = {
        id: currentPostId++,
        content: content,
        author: 'John Doe',
        timestamp: new Date(),
        likes: 0,
        comments: [],
        image: selectedBackgroundImage ? backgroundImages[selectedBackgroundImage] : null
    };

    posts.unshift(post);
    renderPosts();
    postInput.value = '';
    selectedBackgroundImage = '';
    updateImagePickerDisplay();
    showNotification('Post created successfully!', 'success');
}

// Render all posts
function renderPosts() {
    const postsFeed = document.getElementById('postsFeed');
    postsFeed.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsFeed.appendChild(postElement);
    });
}

// Create a post element
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card';
    postDiv.addEventListener('click', function() {
        openPostDetailModal(post.id);
    });

    let imageHtml = '';
    if (post.image) {
        imageHtml = `
            <div class="post-image-container">
                <img src="${post.image}" alt="Post Image" class="post-image">
            </div>
        `;
    }

    postDiv.innerHTML = `
        <div class="post-header">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="User Avatar" class="user-avatar">
            <div>
                <div class="post-author">${post.author}</div>
                <div class="post-time">${getTimeAgo(post.timestamp)}</div>
            </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${imageHtml}
        <div class="post-actions-bar">
            <div class="post-actions-left">
                <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id}); event.stopPropagation();">
                    <i class="fas fa-heart"></i>
                    <span class="like-count">${post.likes}</span>
                </button>
                <button class="action-btn" onclick="openCommentModal(${post.id}); event.stopPropagation();">
                    <i class="fas fa-comment"></i>
                    <span class="comment-count">${post.comments.length}</span>
                </button>
            </div>
        </div>
    `;

    return postDiv;
}

// Toggle like on a post
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        renderPosts();
    }
}

// Open comment modal
function openCommentModal(postId) {
    currentPostId = postId;
    const modal = document.getElementById('commentModal');
    modal.style.display = 'flex';
    renderComments();
}

// Close comment modal
function closeCommentModal() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'none';
    document.getElementById('commentNameInput').value = '';
    document.getElementById('commentInput').value = '';
}

// Add a comment
function addComment() {
    const nameInput = document.getElementById('commentNameInput');
    const commentInput = document.getElementById('commentInput');
    const name = nameInput.value.trim();
    const content = commentInput.value.trim();

    if (!name || !content) {
        showNotification('Please fill in both name and comment!', 'error');
        return;
    }

    const post = posts.find(p => p.id === currentPostId);
    if (post) {
        const comment = {
            id: Date.now(),
            name: name,
            content: content,
            timestamp: new Date()
        };
        post.comments.push(comment);
        renderPosts();
        renderComments();
        nameInput.value = '';
        commentInput.value = '';
        showNotification('Comment added successfully!', 'success');
    }
}

// Render comments in modal
function renderComments() {
    const commentsList = document.getElementById('commentsList');
    const post = posts.find(p => p.id === currentPostId);
    
    if (!post) return;
    
    commentsList.innerHTML = '';
    post.comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentsList.appendChild(commentElement);
    });
}

// Create comment element
function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item';
    commentDiv.innerHTML = `
        <div class="comment-header">
            <div class="comment-author">${comment.name}</div>
            <div class="comment-time">${getTimeAgo(comment.timestamp)}</div>
        </div>
        <div class="comment-content">${comment.content}</div>
    `;
    return commentDiv;
}

// Open post detail modal
function openPostDetailModal(postId) {
    currentDetailPostId = postId;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('postDetailModal');
    const detailPostImage = document.getElementById('detailPostImage');
    const detailUserAvatar = document.getElementById('detailUserAvatar');
    const detailPostAuthor = document.getElementById('detailPostAuthor');
    const detailPostTime = document.getElementById('detailPostTime');
    const detailPostText = document.getElementById('detailPostText');
    const detailLikeCount = document.getElementById('detailLikeCount');
    const detailCommentCount = document.getElementById('detailCommentCount');

    detailPostAuthor.textContent = post.author;
    detailPostTime.textContent = getTimeAgo(post.timestamp);
    detailPostText.textContent = post.content;
    detailLikeCount.textContent = post.likes;
    detailCommentCount.textContent = post.comments.length;

    if (post.image) {
        detailPostImage.src = post.image;
        detailPostImage.style.display = 'block';
    } else {
        detailPostImage.style.display = 'none';
    }

    detailUserAvatar.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
    renderDetailComments();
    modal.style.display = 'flex';
}

// Close post detail modal
function closePostDetailModal() {
    const modal = document.getElementById('postDetailModal');
    modal.style.display = 'none';
    currentDetailPostId = null;
}

// Toggle like from detail modal
function toggleLikeFromDetail() {
    if (currentDetailPostId !== null) {
        const post = posts.find(p => p.id === currentDetailPostId);
        if (post) {
            post.liked = !post.liked;
            post.likes += post.liked ? 1 : -1;
            document.getElementById('detailLikeCount').textContent = post.likes;
            renderPosts();
        }
    }
}

// Open comment modal from detail view
function openCommentModalFromDetail() {
    if (currentDetailPostId !== null) {
        openCommentModal(currentDetailPostId);
        closePostDetailModal();
    }
}

// Create detail comment element
function createDetailCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'post-detail-comment';
    commentDiv.innerHTML = `
        <div class="post-detail-comment-header">
            <div class="post-detail-comment-author">${comment.name}</div>
            <div class="post-detail-comment-time">${getTimeAgo(comment.timestamp)}</div>
        </div>
        <div class="post-detail-comment-content">${comment.content}</div>
    `;
    return commentDiv;
}

// Render comments in detail modal
function renderDetailComments() {
    const detailCommentsList = document.getElementById('detailCommentsList');
    const post = posts.find(p => p.id === currentDetailPostId);
    
    if (!post) return;
    
    detailCommentsList.innerHTML = '';
    post.comments.forEach(comment => {
        const commentElement = createDetailCommentElement(comment);
        detailCommentsList.appendChild(commentElement);
    });
}

// Image picker functions
function toggleImagePicker() {
    const overlay = document.getElementById('imagePickerOverlay');
    
    if (!overlay) {
        return;
    }
    
    // Check if overlay is currently visible
    const isVisible = overlay.style.display === 'flex';
    
    if (isVisible) {
        // Hide the overlay
        overlay.style.display = 'none';
    } else {
        // Show the overlay
        overlay.style.display = 'flex';
        
        // Update the display to show selected image
        updateImagePickerDisplay();
    }
}

function selectImage(imageType) {
    selectedBackgroundImage = imageType;
    updateImagePickerDisplay();
    toggleImagePicker();
    
    // Show notification
    if (imageType) {
        showNotification(`Image selected: ${imageType}`, 'success');
    } else {
        showNotification('No image selected', 'info');
    }
}

function updateImagePickerDisplay() {
    const options = document.querySelectorAll('.image-option');
    
    options.forEach(option => {
        option.classList.remove('selected');
        const dataImage = option.getAttribute('data-image');
        if (dataImage === selectedBackgroundImage) {
            option.classList.add('selected');
        }
    });
}

// Utility function to get time ago
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Auto-resize textarea
    const postInput = document.getElementById('postInput');
    postInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // Post button click
    document.getElementById('postBtn').addEventListener('click', createPost);

    // Enter key to post
    postInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            createPost();
        }
    });

    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        const commentModal = document.getElementById('commentModal');
        const postDetailModal = document.getElementById('postDetailModal');
        const imagePickerOverlay = document.getElementById('imagePickerOverlay');
        
        if (e.target === commentModal) {
            closeCommentModal();
        }
        if (e.target === postDetailModal) {
            closePostDetailModal();
        }
        if (e.target === imagePickerOverlay) {
            toggleImagePicker();
        }
    });
}); 