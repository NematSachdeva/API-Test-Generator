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
const runTestsSpinner = document.getElementById('runTestsSpinner');
const viewCodeBtn = document.getElementById('viewCodeBtn');
const endpointsTable = document.getElementById('endpointsTable');
const endpointsTableBody = document.getElementById('endpointsTableBody');
const testSummaryCard = document.getElementById('testSummaryCard');
const testResultsList = document.getElementById('testResultsList');
const testResultsItems = document.getElementById('testResultsItems');
const environmentInfo = document.getElementById('environmentInfo');
const consoleOutputSection = document.getElementById('consoleOutputSection');
const toggleConsoleBtn = document.getElementById('toggleConsoleBtn');
const consoleOutput = document.getElementById('consoleOutput');
const consoleOutputText = document.getElementById('consoleOutputText');
const lineNumbers = document.getElementById('lineNumbers');
const codeHeaderLabel = document.getElementById('codeHeaderLabel');

// State
let selectedFile = null;
let generatedTestCode = null;
let testResults = null;
let testStartTime = null;

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

    // View Code button
    viewCodeBtn.addEventListener('click', viewGeneratedCode);

    // Toggle Console button
    toggleConsoleBtn.addEventListener('click', toggleConsoleOutput);
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
    viewCodeBtn.style.display = 'none';
    testSummaryCard.style.display = 'none';
    testResultsList.style.display = 'none';
    environmentInfo.style.display = 'none';
    consoleOutputSection.style.display = 'none';
    testResults = null;
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

    // Update code output with syntax highlighting
    displayCodeWithHighlighting(data.test_code);

    // Update code header label
    codeHeaderLabel.textContent = 'Generated Test Code';

    // Update endpoint count
    const count = data.endpoints_count || 0;
    endpointCount.textContent = count;

    // Try to extract and display endpoints table
    displayEndpointsTable(data.test_code, count);

    // Hide test results components
    testSummaryCard.style.display = 'none';
    testResultsList.style.display = 'none';
    environmentInfo.style.display = 'none';
    consoleOutputSection.style.display = 'none';

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
 * Run tests - Execute pytest on generated test code
 */
async function runTests() {
    if (!generatedTestCode) {
        showStatus('No tests to run', 'error');
        return;
    }

    try {
        // Show loading state
        runTestsBtn.disabled = true;
        runTestsSpinner.style.display = 'inline-flex';
        const btnLabel = runTestsBtn.querySelector('.btn-label');
        if (btnLabel) btnLabel.textContent = 'Running...';
        
        showStatus('🚀 Running tests...', 'info');

        // Record start time
        testStartTime = Date.now();

        // Send request to backend
        const response = await fetch(`${API_BASE}/run-tests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                test_code: generatedTestCode
            })
        });

        // Handle response
        if (!response.ok) {
            let errorMessage = 'Failed to run tests';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `Server error: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Calculate execution time
        const executionTime = ((Date.now() - testStartTime) / 1000).toFixed(2);
        data.executionTime = executionTime;

        // Display results
        displayTestResults(data);

        // Show appropriate status message
        if (data.passed) {
            showStatus(data.summary || '✅ All tests passed!', 'success');
        } else {
            showStatus(data.summary || '❌ Some tests failed', 'error');
        }

    } catch (error) {
        console.error('Error running tests:', error);
        
        let userMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
            userMessage = 'Cannot connect to backend. Please check your internet connection.';
        } else if (error.message.includes('timeout')) {
            userMessage = 'Test execution timed out. Tests may be taking too long to run.';
        }
        
        showStatus(`Error: ${userMessage}`, 'error');
    } finally {
        // Re-enable button
        runTestsBtn.disabled = false;
        runTestsSpinner.style.display = 'none';
        const btnLabel = runTestsBtn.querySelector('.btn-label');
        if (btnLabel) btnLabel.textContent = 'Run Tests';
    }
}

/**
 * Display test execution results
 */
function displayTestResults(data) {
    if (!data.stdout && !data.stderr) {
        showStatus('No test output received', 'error');
        return;
    }

    // Store test results
    testResults = data;

    // Parse test results from output
    const parsedResults = parseTestResults(data.stdout);

    // Update test summary card
    displayTestSummary(parsedResults, data.executionTime);

    // Display individual test results
    displayTestResultsList(parsedResults.tests);

    // Display environment info
    displayEnvironmentInfo();

    // Update code header label
    codeHeaderLabel.textContent = 'Test Results';

    // Display parsed results in code block
    displayCodeWithHighlighting(data.stdout, false);

    // Store console output
    consoleOutputText.textContent = data.stdout;
    consoleOutputSection.style.display = 'block';
    consoleOutput.style.display = 'none';
    toggleConsoleBtn.classList.remove('expanded');

    // Show View Code button, hide Run Tests button temporarily
    viewCodeBtn.style.display = 'inline-flex';
    
    // Scroll to results
    setTimeout(() => {
        testSummaryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * View generated code (switch back from test results)
 */
function viewGeneratedCode() {
    if (!generatedTestCode) {
        showStatus('No generated code available', 'error');
        return;
    }

    // Restore generated code
    displayCodeWithHighlighting(generatedTestCode);
    
    // Update code header label
    codeHeaderLabel.textContent = 'Generated Test Code';
    
    // Hide test results components
    testSummaryCard.style.display = 'none';
    testResultsList.style.display = 'none';
    environmentInfo.style.display = 'none';
    consoleOutputSection.style.display = 'none';
    
    // Hide View Code button
    viewCodeBtn.style.display = 'none';
    
    showStatus('Viewing generated test code', 'info');
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
 * Display code with line numbers (no syntax highlighting to avoid HTML corruption)
 */
function displayCodeWithHighlighting(code, addLineNumbers = true) {
    // Use textContent to prevent HTML parsing issues
    codeOutput.textContent = code;
    
    // Add line numbers
    if (addLineNumbers) {
        const lines = code.split('\n');
        lineNumbers.innerHTML = lines.map((_, i) => i + 1).join('\n');
        lineNumbers.style.display = 'block';
    } else {
        lineNumbers.style.display = 'none';
    }
}

/**
 * Parse test results from pytest output
 */
function parseTestResults(output) {
    const results = {
        passed: 0,
        failed: 0,
        skipped: 0,
        total: 0,
        tests: []
    };
    
    // Extract test results
    const testLines = output.split('\n');
    testLines.forEach(line => {
        // Match test result lines like: "test_file.py::test_name PASSED"
        const match = line.match(/(.+?)::(test_\w+)\s+(PASSED|FAILED|SKIPPED)/);
        if (match) {
            const [, , testName, status] = match;
            results.tests.push({
                name: testName,
                status: status.toLowerCase()
            });
            
            if (status === 'PASSED') results.passed++;
            else if (status === 'FAILED') results.failed++;
            else if (status === 'SKIPPED') results.skipped++;
        }
    });
    
    results.total = results.passed + results.failed + results.skipped;
    
    // If no tests found, try to extract from summary
    if (results.total === 0) {
        const summaryMatch = output.match(/(\d+) passed/);
        if (summaryMatch) {
            results.passed = parseInt(summaryMatch[1]);
            results.total = results.passed;
        }
    }
    
    return results;
}

/**
 * Display test summary card
 */
function displayTestSummary(results, executionTime) {
    document.getElementById('testsPassed').textContent = results.passed;
    document.getElementById('testsFailed').textContent = results.failed;
    document.getElementById('totalTests').textContent = results.total;
    document.getElementById('endpointsTested').textContent = endpointCount.textContent || '0';
    document.getElementById('executionTime').textContent = executionTime ? `${executionTime}s` : '';
    
    testSummaryCard.style.display = 'block';
}

/**
 * Display test results list
 */
function displayTestResultsList(tests) {
    if (!tests || tests.length === 0) {
        testResultsList.style.display = 'none';
        return;
    }
    
    testResultsItems.innerHTML = '';
    
    tests.forEach(test => {
        const item = document.createElement('div');
        item.className = `test-result-item ${test.status}`;
        
        const icon = document.createElement('div');
        icon.className = `test-result-icon ${test.status}`;
        
        if (test.status === 'passed') {
            icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else if (test.status === 'failed') {
            icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        } else {
            icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
        }
        
        const name = document.createElement('div');
        name.className = 'test-result-name';
        name.textContent = test.name;
        
        const status = document.createElement('div');
        status.className = `test-result-status ${test.status}`;
        status.textContent = test.status.toUpperCase();
        
        item.appendChild(icon);
        item.appendChild(name);
        item.appendChild(status);
        
        testResultsItems.appendChild(item);
    });
    
    testResultsList.style.display = 'block';
}

/**
 * Display environment info
 */
function displayEnvironmentInfo() {
    // These values could be fetched from backend in the future
    document.getElementById('pythonVersion').textContent = '3.11';
    document.getElementById('pytestVersion').textContent = '7.4.3';
    document.getElementById('platform').textContent = 'Linux';
    
    environmentInfo.style.display = 'block';
}

/**
 * Toggle console output visibility
 */
function toggleConsoleOutput() {
    if (consoleOutput.style.display === 'none') {
        consoleOutput.style.display = 'block';
        toggleConsoleBtn.classList.add('expanded');
        toggleConsoleBtn.querySelector('span').textContent = 'Hide Console Output';
    } else {
        consoleOutput.style.display = 'none';
        toggleConsoleBtn.classList.remove('expanded');
        toggleConsoleBtn.querySelector('span').textContent = 'View Console Output';
    }
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
