// Application State
let currentScreen = 'dashboard';
let draggedElement = null;
let canvasElements = [];
let undoStack = [];
let redoStack = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDashboard();
    initializeEditor();
    initializeAITools();
});

// Navigation System
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreen = button.getAttribute('data-screen');
            switchScreen(targetScreen);
        });
    });
}

function switchScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
    }
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeNavBtn = document.querySelector(`[data-screen="${screenId}"]`);
    if (activeNavBtn) {
        activeNavBtn.classList.add('active');
    }
}

// Dashboard Functionality
function initializeDashboard() {
    // Create New Website button
    const createWebsiteBtn = document.getElementById('create-website-btn');
    createWebsiteBtn.addEventListener('click', () => {
        switchScreen('editor');
        showNotification('Starting new website project...');
    });
    
    // Project card actions
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
        btn.addEventListener('click', () => {
            switchScreen('editor');
            showNotification('Opening project in editor...');
        });
    });
    
    document.querySelectorAll('[data-action="analytics"]').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Analytics feature coming soon!');
        });
    });
    
    document.querySelectorAll('[data-action="publish"]').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Publishing project...');
        });
    });
    
    // Quick access tool cards
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.getAttribute('data-tool');
            if (tool === 'editor') {
                switchScreen('editor');
            } else if (tool === 'ai-tools') {
                switchScreen('ai-tools');
            } else {
                showNotification(`${tool} feature coming soon!`);
            }
        });
    });
}

// Editor Functionality
function initializeEditor() {
    initializeDragAndDrop();
    initializeToolbar();
    initializeCodeEditor();
}

function initializeDragAndDrop() {
    const elementItems = document.querySelectorAll('.element-item');
    const canvas = document.getElementById('website-canvas');
    
    // Make elements draggable
    elementItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedElement = e.target.getAttribute('data-element');
            e.target.classList.add('dragging');
        });
        
        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });
    
    // Canvas drop functionality
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvas.classList.add('dragover');
    });
    
    canvas.addEventListener('dragleave', () => {
        canvas.classList.remove('dragover');
    });
    
    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('dragover');
        
        if (draggedElement) {
            addElementToCanvas(draggedElement, e.offsetX, e.offsetY);
            draggedElement = null;
        }
    });
}

function addElementToCanvas(elementType, x, y) {
    // Save current state before making changes
    saveCanvasState();
    
    const canvas = document.getElementById('website-canvas');
    const placeholder = canvas.querySelector('.canvas-placeholder');
    
    // Remove placeholder if it exists
    if (placeholder) {
        placeholder.remove();
    }
    
    // Create new element
    const element = document.createElement('div');
    element.className = 'canvas-element';
    element.style.position = 'absolute';
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.padding = '10px';
    element.style.border = '1px solid #ccc';
    element.style.borderRadius = '4px';
    element.style.background = 'white';
    element.style.cursor = 'move';
    element.setAttribute('data-element-type', elementType);
    element.setAttribute('data-element-id', 'element-' + Date.now());
    
    // Set element content based on type
    switch (elementType) {
        case 'text':
            element.innerHTML = '<p>Sample text block</p>';
            break;
        case 'image':
            element.innerHTML = '<div style="width: 150px; height: 100px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">Image</div>';
            break;
        case 'button':
            element.innerHTML = '<button style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 4px;">Button</button>';
            break;
        case 'container':
            element.innerHTML = '<div style="width: 200px; height: 100px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center;">Container</div>';
            break;
    }
    
    // Add click handler for selection
    element.addEventListener('click', () => selectElement(element));
    
    // Add double-click handler for deletion
    element.addEventListener('dblclick', () => {
        saveCanvasState();
        element.remove();
        updateCanvasElements();
        showNotification('Element deleted');
    });
    
    canvas.appendChild(element);
    updateCanvasElements();
    
    showNotification(`${elementType} added to canvas`);
}

function selectElement(element) {
    // Remove previous selections
    document.querySelectorAll('.canvas-element').forEach(el => {
        el.style.border = '1px solid #ccc';
    });
    
    // Highlight selected element
    element.style.border = '2px solid #667eea';
    
    // Show properties panel
    showElementProperties(element);
}

function showElementProperties(element) {
    const propertiesContent = document.querySelector('.properties-content');
    const elementType = element.getAttribute('data-element-type');
    const elementId = element.getAttribute('data-element-id') || 'selected';
    
    propertiesContent.innerHTML = `
        <h4>Properties - ${elementType}</h4>
        
        <!-- Styling Properties -->
        <div class="property-section">
            <h5>Styling</h5>
            <div class="property-group">
                <label>Background Color:</label>
                <input type="color" class="property-input" value="#ffffff" onchange="updateElementStyle('${elementId}', 'backgroundColor', this.value)">
            </div>
            <div class="property-group">
                <label>Width (px):</label>
                <input type="number" class="property-input" value="200" onchange="updateElementStyle('${elementId}', 'width', this.value + 'px')">
            </div>
            <div class="property-group">
                <label>Height (px):</label>
                <input type="number" class="property-input" value="100" onchange="updateElementStyle('${elementId}', 'height', this.value + 'px')">
            </div>
            <div class="property-group">
                <label>Border Radius (px):</label>
                <input type="number" class="property-input" value="4" onchange="updateElementStyle('${elementId}', 'borderRadius', this.value + 'px')">
            </div>
        </div>
        
        <!-- Animation Properties -->
        <div class="property-section">
            <h5>Animations</h5>
            <div class="property-group">
                <label>Animation Type:</label>
                <select class="property-input" onchange="applyAnimation('${elementId}', this.value)">
                    <option value="">None</option>
                    <option value="fadeIn">Fade In</option>
                    <option value="slideInLeft">Slide In Left</option>
                    <option value="slideInRight">Slide In Right</option>
                    <option value="bounceIn">Bounce In</option>
                    <option value="pulse">Pulse</option>
                    <option value="shake">Shake</option>
                </select>
            </div>
            <div class="property-group">
                <label>Animation Duration (s):</label>
                <input type="number" class="property-input" value="1" step="0.1" min="0.1" max="5" onchange="setAnimationDuration('${elementId}', this.value)">
            </div>
            <div class="property-group">
                <label>Animation Delay (s):</label>
                <input type="number" class="property-input" value="0" step="0.1" min="0" max="5" onchange="setAnimationDelay('${elementId}', this.value)">
            </div>
            <button class="btn-secondary" onclick="previewAnimation('${elementId}')">Preview Animation</button>
        </div>
        
        <!-- Position Properties -->
        <div class="property-section">
            <h5>Position</h5>
            <div class="property-group">
                <label>X Position (px):</label>
                <input type="number" class="property-input" value="${parseInt(element.style.left) || 0}" onchange="updateElementStyle('${elementId}', 'left', this.value + 'px')">
            </div>
            <div class="property-group">
                <label>Y Position (px):</label>
                <input type="number" class="property-input" value="${parseInt(element.style.top) || 0}" onchange="updateElementStyle('${elementId}', 'top', this.value + 'px')">
            </div>
        </div>
        
        <!-- Actions -->
        <div class="property-section">
            <h5>Actions</h5>
            <button class="btn-secondary" onclick="duplicateElement('${elementId}')">Duplicate</button>
            <button class="btn-secondary" onclick="deleteElement('${elementId}')" style="background: #dc3545; color: white;">Delete</button>
        </div>
    `;
}

function initializeToolbar() {
    // Undo/Redo functionality
    document.getElementById('undo-btn').addEventListener('click', () => {
        performUndo();
    });
    
    document.getElementById('redo-btn').addEventListener('click', () => {
        performRedo();
    });
    
    // Device selector
    document.querySelector('.device-selector').addEventListener('change', (e) => {
        const device = e.target.value;
        const canvas = document.getElementById('website-canvas');
        
        switch (device) {
            case 'desktop':
                canvas.style.maxWidth = '100%';
                break;
            case 'tablet':
                canvas.style.maxWidth = '768px';
                break;
            case 'mobile':
                canvas.style.maxWidth = '375px';
                break;
        }
        
        showNotification(`Switched to ${device} view`);
    });
    
    // Publish and Preview buttons
    document.getElementById('publish-btn').addEventListener('click', () => {
        showNotification('Publishing website...');
    });
    
    document.getElementById('preview-btn').addEventListener('click', () => {
        showNotification('Opening preview...');
    });
}

function initializeCodeEditor() {
    const toggleBtn = document.getElementById('toggle-code-editor');
    const codeEditor = document.getElementById('code-editor');
    
    toggleBtn.addEventListener('click', () => {
        if (codeEditor.style.display === 'none') {
            codeEditor.style.display = 'block';
            toggleBtn.textContent = 'Hide Code Editor';
        } else {
            codeEditor.style.display = 'none';
            toggleBtn.textContent = 'Show Code Editor';
        }
    });
}

// Undo/Redo History Management
function saveCanvasState() {
    const canvas = document.getElementById('website-canvas');
    const state = {
        html: canvas.innerHTML,
        timestamp: Date.now()
    };
    
    undoStack.push(state);
    
    // Limit undo stack size to prevent memory issues
    if (undoStack.length > 50) {
        undoStack.shift();
    }
    
    // Clear redo stack when new action is performed
    redoStack = [];
    
    updateUndoRedoButtons();
}

function performUndo() {
    if (undoStack.length === 0) {
        showNotification('Nothing to undo');
        return;
    }
    
    const canvas = document.getElementById('website-canvas');
    const currentState = {
        html: canvas.innerHTML,
        timestamp: Date.now()
    };
    
    redoStack.push(currentState);
    const previousState = undoStack.pop();
    
    canvas.innerHTML = previousState.html;
    restoreEventListeners();
    updateCanvasElements();
    updateUndoRedoButtons();
    
    showNotification('Undo performed');
}

function performRedo() {
    if (redoStack.length === 0) {
        showNotification('Nothing to redo');
        return;
    }
    
    const canvas = document.getElementById('website-canvas');
    const currentState = {
        html: canvas.innerHTML,
        timestamp: Date.now()
    };
    
    undoStack.push(currentState);
    const nextState = redoStack.pop();
    
    canvas.innerHTML = nextState.html;
    restoreEventListeners();
    updateCanvasElements();
    updateUndoRedoButtons();
    
    showNotification('Redo performed');
}

function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    
    undoBtn.disabled = undoStack.length === 0;
    redoBtn.disabled = redoStack.length === 0;
    
    undoBtn.style.opacity = undoStack.length === 0 ? '0.5' : '1';
    redoBtn.style.opacity = redoStack.length === 0 ? '0.5' : '1';
}

function restoreEventListeners() {
    // Re-attach event listeners to canvas elements after undo/redo
    const canvasElements = document.querySelectorAll('.canvas-element');
    canvasElements.forEach(element => {
        element.addEventListener('click', () => selectElement(element));
        element.addEventListener('dblclick', () => {
            saveCanvasState();
            element.remove();
            updateCanvasElements();
            showNotification('Element deleted');
        });
    });
}

function updateCanvasElements() {
    canvasElements = Array.from(document.querySelectorAll('.canvas-element'));
}

// AI Tools Functionality
function initializeAITools() {
    initializeContentGeneration();
    initializeImageGeneration();
    initializeSEOAnalysis();
}

function initializeContentGeneration() {
    const generateBtn = document.getElementById('generate-content-btn');
    const insertBtn = document.getElementById('insert-content-btn');
    
    generateBtn.addEventListener('click', () => {
        const contentType = document.querySelector('.content-type-selector').value;
        const topic = document.querySelector('.topic-input').value;
        
        if (!topic.trim()) {
            showNotification('Please enter a topic or keywords');
            return;
        }
        
        // Simulate AI content generation
        setTimeout(() => {
            const generatedContent = generateSampleContent(contentType, topic);
            document.getElementById('content-output').innerHTML = generatedContent;
            insertBtn.style.display = 'inline-block';
            showNotification('Content generated successfully!');
        }, 1000);
        
        showNotification('Generating content...');
    });
    
    insertBtn.addEventListener('click', () => {
        insertAIContentToEditor();
    });
}

function generateSampleContent(type, topic) {
    const samples = {
        headline: [
            `Discover the Power of ${topic}`,
            `Transform Your Business with ${topic}`,
            `The Ultimate Guide to ${topic}`
        ],
        paragraph: [
            `In today's digital landscape, ${topic} has become increasingly important for businesses looking to stay competitive. Our comprehensive approach ensures that you get the most out of your investment while maintaining the highest standards of quality.`,
            `When it comes to ${topic}, there are many factors to consider. Our expert team has years of experience helping clients navigate these challenges and achieve their goals through innovative solutions and strategic planning.`
        ],
        'product-desc': [
            `This premium ${topic} solution is designed to meet your specific needs. With advanced features and user-friendly design, it's the perfect choice for both beginners and professionals.`,
            `Experience the difference with our ${topic} product. Built with cutting-edge technology and backed by exceptional customer support, it delivers results you can count on.`
        ],
        'blog-post': [
            `# Everything You Need to Know About ${topic}\n\nIn this comprehensive guide, we'll explore the fundamentals of ${topic} and how it can benefit your business...\n\n## Getting Started\n\nThe first step in understanding ${topic} is...`
        ]
    };
    
    const sampleArray = samples[type] || samples.paragraph;
    return sampleArray[Math.floor(Math.random() * sampleArray.length)];
}

function initializeImageGeneration() {
    const generateBtn = document.getElementById('generate-image-btn');
    
    generateBtn.addEventListener('click', () => {
        const prompt = document.querySelector('.image-prompt').value;
        const style = document.querySelector('.image-style-selector').value;
        
        if (!prompt.trim()) {
            showNotification('Please enter an image prompt');
            return;
        }
        
        // Simulate AI image generation
        setTimeout(() => {
            generateSampleImages(prompt, style);
            showNotification('Images generated successfully!');
        }, 2000);
        
        showNotification('Generating images...');
    });
}

function generateSampleImages(prompt, style) {
    const gallery = document.getElementById('image-gallery');
    gallery.innerHTML = '';
    
    // Create sample image placeholders
    for (let i = 1; i <= 3; i++) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'generated-image';
        imageContainer.style.cssText = `
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            height: 150px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        `;
        
        imageContainer.innerHTML = `
            <div style="text-align: center; color: #666;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">🖼️</div>
                <div style="font-size: 0.8rem;">${style} style</div>
                <div style="font-size: 0.7rem; margin-top: 0.25rem;">${prompt.substring(0, 20)}...</div>
            </div>
        `;
        
        imageContainer.addEventListener('click', () => {
            // Remove previous selections
            gallery.querySelectorAll('.generated-image').forEach(img => {
                img.style.borderColor = 'transparent';
            });
            
            // Highlight selected image
            imageContainer.style.borderColor = '#667eea';
            
            // Add double-click to insert
            imageContainer.addEventListener('dblclick', () => {
                insertAIImageToEditor(imageContainer);
            });
            
            showNotification('Image selected - Double-click to insert into editor');
        });
        
        gallery.appendChild(imageContainer);
    }
}

function initializeSEOAnalysis() {
    const analyzeBtn = document.getElementById('analyze-seo-btn');
    
    analyzeBtn.addEventListener('click', () => {
        const pageUrl = document.querySelector('.page-url').value;
        const keywords = document.querySelector('.keywords-input').value;
        
        if (!pageUrl.trim() || !keywords.trim()) {
            showNotification('Please enter both page URL and target keywords');
            return;
        }
        
        // Simulate SEO analysis
        setTimeout(() => {
            performSEOAnalysis(keywords);
            showNotification('SEO analysis completed!');
        }, 1500);
        
        showNotification('Analyzing SEO...');
    });
}

function performSEOAnalysis(keywords) {
    // Generate random but realistic SEO metrics
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const density = (Math.random() * 2 + 0.5).toFixed(1); // 0.5-2.5%
    
    // Update metrics
    const metrics = document.querySelectorAll('.metric-value');
    metrics[0].textContent = score + '/100';
    metrics[1].textContent = density + '%';
    metrics[2].textContent = Math.random() > 0.5 ? 'Good' : 'Needs Improvement';
    
    // Update suggestions
    const suggestions = [
        `Optimize content for "${keywords.split(',')[0].trim()}" keyword`,
        'Add more internal links to improve site structure',
        'Optimize images with descriptive alt text',
        'Improve page loading speed',
        'Add structured data markup',
        'Optimize meta description length (150-160 characters)'
    ];
    
    const suggestionsContainer = document.querySelector('#seo-suggestions ul');
    suggestionsContainer.innerHTML = suggestions
        .slice(0, Math.floor(Math.random() * 3) + 3)
        .map(suggestion => `<li>${suggestion}</li>`)
        .join('');
}

// AI Integration Functions
function insertAIContentToEditor() {
    const contentOutput = document.getElementById('content-output');
    const content = contentOutput.textContent || contentOutput.innerHTML;
    
    if (!content || content.trim() === 'Generated content will appear here...') {
        showNotification('No content to insert');
        return;
    }
    
    // Switch to editor screen if not already there
    if (currentScreen !== 'editor') {
        switchScreen('editor');
    }
    
    // Create a text element with the AI content
    setTimeout(() => {
        saveCanvasState();
        const canvas = document.getElementById('website-canvas');
        const placeholder = canvas.querySelector('.canvas-placeholder');
        
        // Remove placeholder if it exists
        if (placeholder) {
            placeholder.remove();
        }
        
        // Create new text element with AI content
        const element = document.createElement('div');
        element.className = 'canvas-element';
        element.style.position = 'absolute';
        element.style.left = '50px';
        element.style.top = '50px';
        element.style.padding = '15px';
        element.style.border = '1px solid #ccc';
        element.style.borderRadius = '4px';
        element.style.background = 'white';
        element.style.cursor = 'move';
        element.style.maxWidth = '400px';
        element.setAttribute('data-element-type', 'text');
        element.setAttribute('data-element-id', 'element-' + Date.now());
        
        // Set the AI-generated content
        element.innerHTML = `<div>${content}</div>`;
        
        // Add event listeners
        element.addEventListener('click', () => selectElement(element));
        element.addEventListener('dblclick', () => {
            saveCanvasState();
            element.remove();
            updateCanvasElements();
            showNotification('Element deleted');
        });
        
        canvas.appendChild(element);
        updateCanvasElements();
        
        showNotification('AI content inserted into editor!');
    }, 500);
}

function insertAIImageToEditor(imageElement) {
    // Switch to editor screen if not already there
    if (currentScreen !== 'editor') {
        switchScreen('editor');
    }
    
    // Create an image element in the editor
    setTimeout(() => {
        saveCanvasState();
        const canvas = document.getElementById('website-canvas');
        const placeholder = canvas.querySelector('.canvas-placeholder');
        
        // Remove placeholder if it exists
        if (placeholder) {
            placeholder.remove();
        }
        
        // Create new image element
        const element = document.createElement('div');
        element.className = 'canvas-element';
        element.style.position = 'absolute';
        element.style.left = '50px';
        element.style.top = '50px';
        element.style.padding = '10px';
        element.style.border = '1px solid #ccc';
        element.style.borderRadius = '4px';
        element.style.background = 'white';
        element.style.cursor = 'move';
        element.setAttribute('data-element-type', 'image');
        element.setAttribute('data-element-id', 'element-' + Date.now());
        
        // Set placeholder image with AI style info
        element.innerHTML = `<div style="width: 200px; height: 150px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); display: flex; align-items: center; justify-content: center; border-radius: 4px;">
            <div style="text-align: center; color: #666;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🖼️</div>
                <div style="font-size: 0.8rem;">AI Generated Image</div>
            </div>
        </div>`;
        
        // Add event listeners
        element.addEventListener('click', () => selectElement(element));
        element.addEventListener('dblclick', () => {
            saveCanvasState();
            element.remove();
            updateCanvasElements();
            showNotification('Element deleted');
        });
        
        canvas.appendChild(element);
        updateCanvasElements();
        
        showNotification('AI image inserted into editor!');
    }, 500);
}
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Make some functions globally available for inline event handlers
window.updateElementStyle = function(elementId, property, value) {
    const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
    if (selectedElement) {
        saveCanvasState();
        selectedElement.style[property] = value;
        showNotification(`Updated ${property}`);
    }
};

// Animation functions
window.applyAnimation = function(elementId, animationType) {
    const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
    if (selectedElement && animationType) {
        selectedElement.style.animation = 'none';
        selectedElement.offsetHeight; // Force reflow
        selectedElement.style.animation = `${animationType} 1s ease-in-out`;
        selectedElement.setAttribute('data-animation', animationType);
        showNotification(`Applied ${animationType} animation`);
    }
};

window.setAnimationDuration = function(elementId, duration) {
    const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
    if (selectedElement) {
        const currentAnimation = selectedElement.getAttribute('data-animation');
        if (currentAnimation) {
            selectedElement.style.animation = `${currentAnimation} ${duration}s ease-in-out`;
        }
        showNotification(`Animation duration set to ${duration}s`);
    }
};

window.setAnimationDelay = function(elementId, delay) {
    const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
    if (selectedElement) {
        selectedElement.style.animationDelay = `${delay}s`;
        showNotification(`Animation delay set to ${delay}s`);
    }
};

window.previewAnimation = function(elementId) {
    const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
    if (selectedElement) {
        const currentAnimation = selectedElement.getAttribute('data-animation');
        if (currentAnimation) {
            selectedElement.style.animation = 'none';
            selectedElement.offsetHeight; // Force reflow
            selectedElement.style.animation = `${currentAnimation} 1s ease-in-out`;
            showNotification('Animation previewed');
        } else {
            showNotification('No animation selected');
        }
    }
};

window.duplicateElement = function(elementId) {
    const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
    if (selectedElement) {
        saveCanvasState();
        const clone = selectedElement.cloneNode(true);
        clone.style.left = (parseInt(selectedElement.style.left) + 20) + 'px';
        clone.style.top = (parseInt(selectedElement.style.top) + 20) + 'px';
        clone.setAttribute('data-element-id', 'element-' + Date.now());
        
        // Re-attach event listeners
        clone.addEventListener('click', () => selectElement(clone));
        clone.addEventListener('dblclick', () => {
            saveCanvasState();
            clone.remove();
            updateCanvasElements();
            showNotification('Element deleted');
        });
        
        selectedElement.parentNode.appendChild(clone);
        updateCanvasElements();
        showNotification('Element duplicated');
    }
};

window.deleteElement = function(elementId) {
    const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
    if (selectedElement) {
        saveCanvasState();
        selectedElement.remove();
        updateCanvasElements();
        
        // Clear properties panel
        const propertiesContent = document.querySelector('.properties-content');
        propertiesContent.innerHTML = '<p>Select an element to edit its properties</p>';
        
        showNotification('Element deleted');
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'z':
                e.preventDefault();
                if (e.shiftKey) {
                    performRedo();
                } else {
                    performUndo();
                }
                break;
            case 'y':
                e.preventDefault();
                performRedo();
                break;
            case 's':
                e.preventDefault();
                showNotification('Auto-save enabled');
                break;
            case 'd':
                e.preventDefault();
                const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
                if (selectedElement) {
                    window.duplicateElement();
                }
                break;
        }
    }
    
    // Delete key for removing selected element
    if (e.key === 'Delete') {
        const selectedElement = document.querySelector('.canvas-element[style*="border: 2px solid"]');
        if (selectedElement) {
            window.deleteElement();
        }
    }
});