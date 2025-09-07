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
    
    canvas.appendChild(element);
    canvasElements.push(element);
    
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
    
    propertiesContent.innerHTML = `
        <h4>Properties - ${elementType}</h4>
        <div class="property-group">
            <label>Background Color:</label>
            <input type="color" class="property-input" value="#ffffff" onchange="updateElementStyle('${element.id || 'selected'}', 'backgroundColor', this.value)">
        </div>
        <div class="property-group">
            <label>Width (px):</label>
            <input type="number" class="property-input" value="200" onchange="updateElementStyle('${element.id || 'selected'}', 'width', this.value + 'px')">
        </div>
        <div class="property-group">
            <label>Height (px):</label>
            <input type="number" class="property-input" value="100" onchange="updateElementStyle('${element.id || 'selected'}', 'height', this.value + 'px')">
        </div>
    `;
}

function initializeToolbar() {
    // Undo/Redo functionality
    document.getElementById('undo-btn').addEventListener('click', () => {
        showNotification('Undo functionality coming soon!');
    });
    
    document.getElementById('redo-btn').addEventListener('click', () => {
        showNotification('Redo functionality coming soon!');
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
        showNotification('Content inserted into website editor!');
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
            showNotification('Image selected - Click to insert into editor');
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

// Utility Functions
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
        selectedElement.style[property] = value;
        showNotification(`Updated ${property}`);
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'z':
                e.preventDefault();
                showNotification('Undo (Ctrl+Z)');
                break;
            case 'y':
                e.preventDefault();
                showNotification('Redo (Ctrl+Y)');
                break;
            case 's':
                e.preventDefault();
                showNotification('Auto-save enabled');
                break;
        }
    }
});