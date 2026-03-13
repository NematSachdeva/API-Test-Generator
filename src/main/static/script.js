/**
 * API Test Generator - Frontend JavaScript
 * Handles file upload, API communication, and UI interactions
 * Deployed on Vercel, calls Railway backend API
 */

// API Configuration
const API_BASE = "https://api-test-generator-production.up.railway.app";

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const clearFileBtn = document.getElementById('clearFileBtn');
const generateBtn = document.getElementById('generateBtn');
const spinner = document.getElementById('spinner');
const statusMessage = document.getElementById('statusMessage');
const resultsSection = document.getElementById('resultsSection');
const codeOutput = document.getElementById('codeOutput');
const endpointCount = document.getElementById('endpointCount');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const runTestsBtn = document.getElementById('runTestsBtn');
const endpointsTable = document.getElementById('endpointsTable');
const endpointsTableBody = document.getElementById('endpointsTableBody');

// State
let selectedFile = null;
let generatedTestCode = null;

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Upload area events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Clear file button
    clearFileBtn.addEventListener('click', clearFile);

    // Generate button
    generateBtn.addEventListener('click', generateTests);

    // Copy button
    copyBtn.addEventListener('click', copyToClipboard);

    // Download button
    downloadBtn.addEventListener('click', downloadTests);

    // Run Tests button
    runTestsBtn.addEventListener('click', runTests);
}

/**
 * Handle drag over event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('dragover');
}

/**
 * Handle drag leave event
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
}

/**
 * Handle drop event
 */
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect();
    }
}

/**
 * Handle file selection
 */
function handleFileSelect() {
    const file = fileInput.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/json', 'application/x-yaml', 'text/yaml', 'text/plain'];
    const validExtensions = ['.json', '.yaml', '.yml'];
    
    const isValidType = validTypes.includes(file.type) || 
                       validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
        showStatus('Please select a valid JSON or YAML file', 'error');
        fileInput.value = '';
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    fileInfo.style.display = 'block';
    uploadArea.style.display = 'none';
    generateBtn.disabled = false;
    hideStatus();
}

/**
 * Clear selected file
 */
function clearFile() {
    selectedFile = null;
    fileInput.value = '';
    fileName.textContent = '';
    fileInfo.style.display = 'none';
    uploadArea.style.display = 'block';
    generateBtn.disabled = true;
    resultsSection.style.display = 'none';
    hideStatus();
}

/**
 * Generate tests from selected file
 */
async function generateTests() {
    if (!selectedFile) {
        showStatus('Please select a file first', 'error');
        return;
    }

    try {
        // Show loading state with visual messages
        generateBtn.disabled = true;
        spinner.style.display = 'inline-flex';
        
        // Step 1: Uploading
        showStatus('📤 Uploading file...', 'info');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Create FormData
        const formData = new FormData();
        formData.append('file', selectedFile);

        // Step 2: Parsing API
        showStatus('🔍 Parsing API specification...', 'info');

        // Send request to Railway backend
        const response = await fetch(`${API_BASE}/generate-tests`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        // Handle response
        if (!response.ok) {
            let errorMessage = 'Failed to generate tests';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = `Server error: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Validate response
        if (!data.test_code) {
            throw new Error('No test code generated. Please check your Swagger/OpenAPI file.');
        }

        // Step 3: Generating tests
        showStatus('⚡ Generating pytest tests...', 'info');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Display results
        displayResults(data);
        showStatus('✅ Tests generated successfully!', 'success');

    } catch (error) {
        console.error('Error:', error);
        
        // Provide specific error messages
        let userMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
            userMessage = 'Cannot connect to backend. Please check your internet connection or try again later.';
        } else if (error.message.includes('CORS')) {
            userMessage = 'CORS error: Backend is not allowing requests from this domain.';
        }
        
        showStatus(`Error: ${userMessage}`, 'error');
    } finally {
        // Hide loading state
        generateBtn.disabled = false;
        spinner.style.display = 'none';
    }
}

/**
 * Display generated test results
 */
function displayResults(data) {
    if (!data.test_code) {
        showStatus('No test code generated', 'error');
        return;
    }

    // Store generated code
    generatedTestCode = data.test_code;

    // Update code output
    codeOutput.textContent = data.test_code;

    // Update endpoint count
    const count = data.endpoints_count || 0;
    endpointCount.textContent = count;

    // Try to extract and display endpoints table
    displayEndpointsTable(data.test_code, count);

    // Show results section
    resultsSection.style.display = 'block';

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Extract and display endpoints from test code
 */
function displayEndpointsTable(testCode, endpointCount) {
    if (!testCode || endpointCount === 0) {
        endpointsTable.style.display = 'none';
        return;
    }

    // Try to extract endpoints from test code
    const endpoints = extractEndpoints(testCode);
    
    if (endpoints.length === 0) {
        endpointsTable.style.display = 'none';
        return;
    }

    // Clear existing table
    endpointsTableBody.innerHTML = '';

    // Populate table
    endpoints.forEach(endpoint => {
        const row = document.createElement('tr');
        
        const methodCell = document.createElement('td');
        methodCell.textContent = endpoint.method;
        methodCell.style.fontWeight = '600';
        methodCell.style.color = getMethodColor(endpoint.method);
        
        const pathCell = document.createElement('td');
        pathCell.textContent = endpoint.path;
        pathCell.style.fontFamily = 'monospace';
        
        row.appendChild(methodCell);
        row.appendChild(pathCell);
        endpointsTableBody.appendChild(row);
    });

    // Show table
    endpointsTable.style.display = 'block';
}

/**
 * Extract endpoints from test code using regex
 */
function extractEndpoints(testCode) {
    const endpoints = [];
    
    // Match patterns like: requests.get("http://localhost:8080/users")
    // or: requests.post(f"{BASE_URL}/users")
    const patterns = [
        /requests\.(get|post|put|delete|patch)\s*\(\s*[f]?["'].*?(\/[^"']*?)["']/gi,
        /method\s*=\s*["'](GET|POST|PUT|DELETE|PATCH)["'].*?url\s*=\s*[f]?["'].*?(\/[^"']*?)["']/gi
    ];

    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(testCode)) !== null) {
            const method = match[1].toUpperCase();
            const path = match[2];
            
            // Avoid duplicates
            if (!endpoints.some(e => e.method === method && e.path === path)) {
                endpoints.push({ method, path });
            }
        }
    });

    return endpoints;
}

/**
 * Get color for HTTP method
 */
function getMethodColor(method) {
    const colors = {
        'GET': '#4a9eff',
        'POST': '#4caf50',
        'PUT': '#ff9800',
        'DELETE': '#f44336',
        'PATCH': '#9c27b0'
    };
    return colors[method.toUpperCase()] || '#a0a0a0';
}

/**
 * Copy code to clipboard
 */
async function copyToClipboard() {
    const code = codeOutput.textContent;
    if (!code) {
        showStatus('No code to copy', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(code);
        
        // Show feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);

        showStatus('📋 Code copied to clipboard!', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showStatus('Failed to copy to clipboard', 'error');
    }
}

/**
 * Download tests as file
 */
function downloadTests() {
    const code = codeOutput.textContent;
    if (!code) {
        showStatus('No code to download', 'error');
        return;
    }

    try {
        // Create blob
        const blob = new Blob([code], { type: 'text/plain' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated_tests.py';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        
        showStatus('📥 Tests downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading file:', error);
        showStatus('Failed to download file', 'error');
    }
}

/**
 * Run tests (placeholder functionality)
 */
function runTests() {
    if (!generatedTestCode) {
        showStatus('No tests to run', 'error');
        return;
    }

    // Show placeholder message
    showStatus('🚀 Running tests feature coming soon! For now, download the tests and run them locally with: pytest generated_tests.py', 'info');
    
    // Future implementation will call backend endpoint to execute tests
    // Example: POST /run-tests with test code
}

/**
 * Show status message
 */
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(hideStatus, 5000);
    }
}

/**
 * Hide status message
 */
function hideStatus() {
    statusMessage.style.display = 'none';
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    console.log('API Test Generator frontend initialized');
    console.log(`Backend API: ${API_BASE}`);
});

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter or Cmd+Enter to generate tests
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!generateBtn.disabled) {
            generateTests();
        }
    }
    
    // Ctrl+C or Cmd+C to copy (when results are visible)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && resultsSection.style.display !== 'none') {
        const selection = window.getSelection().toString();
        if (!selection) {
            e.preventDefault();
            copyToClipboard();
        }
    }
});
