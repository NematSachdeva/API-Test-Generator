/**
 * API Test Generator - Frontend JavaScript
 * Handles file upload, API communication, and UI interactions
 */

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

// State
let selectedFile = null;

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
        // Show loading state
        generateBtn.disabled = true;
        spinner.style.display = 'inline-flex';
        showStatus('Generating tests...', 'info');

        // Create FormData
        const formData = new FormData();
        formData.append('file', selectedFile);

        // Send request
        const response = await fetch('/generate-tests', {
            method: 'POST',
            body: formData
        });

        // Handle response
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate tests');
        }

        const data = await response.json();

        // Display results
        displayResults(data);
        showStatus('Tests generated successfully!', 'success');

    } catch (error) {
        console.error('Error:', error);
        showStatus(`Error: ${error.message}`, 'error');
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

    // Update code output
    codeOutput.textContent = data.test_code;

    // Update endpoint count
    endpointCount.textContent = data.endpoints_count || 0;

    // Show results section
    resultsSection.style.display = 'block';

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
        copyBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);

        showStatus('Code copied to clipboard!', 'success');
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
        
        showStatus('Tests downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading file:', error);
        showStatus('Failed to download file', 'error');
    }
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
