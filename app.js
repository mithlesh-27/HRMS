let isLoggedIn = false; // Track the login status

// Simulating user data for signup and login
let userData = null;

// Handle the form submission for both signup and login
function handleForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (document.getElementById('form-title').innerText === 'Signup') {
        // Handle signup
        if (username && password) {
            userData = { username, password };
            alert('Signup successful! Please log in.');
            switchToLogin();
        } else {
            alert('Please fill in all fields.');
        }
    } else {
        // Handle login
        if (userData && username === userData.username && password === userData.password) {
            isLoggedIn = true;
            alert('Login successful!');
            showMainContent();
        } else {
            alert('Incorrect username or password.');
        }
    }
}

// Switch to the login form
function switchToLogin() {
    document.getElementById('form-title').innerText = 'Login';
    document.querySelector('button').innerText = 'Login';
    document.getElementById('switch-form').innerHTML = `Don't have an account? <a href="#" onclick="switchToSignup()">Signup here</a>`;
}

// Switch to the signup form
function switchToSignup() {
    document.getElementById('form-title').innerText = 'Signup';
    document.querySelector('button').innerText = 'Signup';
    document.getElementById('switch-form').innerHTML = `Already have an account? <a href="#" onclick="switchToLogin()">Login here</a>`;
}

// Show the main content if the user is logged in
function showMainContent() {
    if (isLoggedIn) {
        document.getElementById('form-container').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
    }
}

// Hide main content and show login form on logout
function logout() {
    isLoggedIn = false;
    document.getElementById('form-container').classList.remove('hidden');
    document.getElementById('main-content').classList.add('hidden');
    switchToLogin();
    alert("Session Logout successfully! \nRelogin/Signup to access the main content again!")
}

// Prevent accessing main content without login
function preventUnauthorizedAccess() {
    if (!isLoggedIn) {
        document.getElementById('form-container').classList.remove('hidden');
        document.getElementById('main-content').classList.add('hidden');
        switchToLogin();
    }
}

// Run this check when the page loads
window.onload = preventUnauthorizedAccess;

// Helper function to enforce login status before performing any actions
function checkLoginStatus() {
    if (!isLoggedIn) {
        alert("You must be logged in to access this feature.");
        preventUnauthorizedAccess();
        return false;
    }
    return true;
}

// HRMS CONTENT STARTS HERE
document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        'dashboard-link': 'dashboard',
        'employee-link': 'employee-management',
        'leave-link': 'leave-management',
        'performance-link': 'performance-management',
        'payroll-link': 'payroll-management',
        'file-upload-link': 'file-upload'
    };

    const messages = document.getElementById('messages');

    // Handle section visibility
    for (let link in sections) {
        document.getElementById(link).addEventListener('click', function () {
            if (!checkLoginStatus()) return; // Check login before allowing section access
            for (let section in sections) {
                document.getElementById(sections[section]).classList.add('hidden');
            }
            document.getElementById(sections[link]).classList.remove('hidden');
            messages.innerText = '';

            switch (sections[link]) {
                case 'employee-management':
                    messages.innerText = 'Add, view, update, or delete employee data.';
                    break;
                case 'leave-management':
                    messages.innerText = 'Check, add, update, or delete leave records.';
                    break;
                case 'performance-management':
                    messages.innerText = 'View or manage performance data.';
                    break;
                case 'payroll-management':
                    messages.innerText = 'Manage payroll data here.';
                    break;
                case 'file-upload':
                    messages.innerText = 'Upload documents or files here.';
                    break;
                default:
                    messages.innerText = 'Welcome to the HRMS Dashboard.';
                    break;
            }
        });
    }

    // Common function to handle fetch requests
    async function handleRequest(url, method, data = null, successMessage, errorMessage) {
        if (!checkLoginStatus()) return; // Check login before performing any API request
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data ? JSON.stringify(data) : null,
            };
            const response = await fetch(url, options);
            const result = await response.json();
            messages.innerText = result.message || successMessage;
            return result;
        } catch (error) {
            messages.innerText = errorMessage;
        }
    } 

    // Employee Management
    document.getElementById('add-employee-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!checkLoginStatus()) return; // Check login before submitting the form
        const employeeData = {
            employeeId: document.getElementById('employeeId').value,
            name: document.getElementById('name').value,
            department: document.getElementById('department').value,
            joinDate: document.getElementById('joinDate').value,
            email: document.getElementById('email').value,
            salary: document.getElementById('salary').value,
            leaveDetails: document.getElementById('leaveDetails').value,
        };
        await handleRequest(
            'https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/dev/employee',
            'POST',
            employeeData,
            'Employee data Added successfully.',
            'Error Adding employee data. Please try again.'
        );
    });

    document.getElementById('view-employee-btn').addEventListener('click', async () => {
        if (!checkLoginStatus()) return; // Check login before viewing employee data
        const employeeId = document.getElementById('view-employee-id').value;
        const result = await handleRequest(
            `https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/dev/employee?employeeId=${employeeId}`,
            'GET',
            null,
            'Employee Data fetched successfully',
            'Error fetching employee data. Please try again.'
        );

        const employeeInfo = document.getElementById('employee-info');
        if (result) {
            employeeInfo.classList.remove('hidden');
            employeeInfo.innerText = JSON.stringify(result, null, 2);
        } else {
            messages.innerText = 'No data available for the given Employee ID.';
            employeeInfo.classList.add('hidden');
        }
    });

    document.getElementById('update-employee-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!checkLoginStatus()) return; // Check login before updating employee data
        const employeeData = {
            employeeId: document.getElementById('update-employee-id').value,
            name: document.getElementById('update-name').value,
            department: document.getElementById('update-department').value,
            joinDate: document.getElementById('update-joinDate').value,
            email: document.getElementById('update-email').value,
            salary: document.getElementById('update-salary').value,
            leaveDetails: document.getElementById('update-leaveDetails').value,
        };
        await handleRequest(
            'https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/dev/employee',
            'PUT',
            employeeData,
            'Employee data updated successfully.',
            'Error updating employee data. Please try again.'
        );
    });

    document.getElementById('delete-employee-btn').addEventListener('click', async () => {
        if (!checkLoginStatus()) return; // Check login before deleting employee data
        const employeeId = document.getElementById('delete-employee-id').value;
        await handleRequest(
            `https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/dev/employee?employeeId=${employeeId}`,
            'DELETE',
            null,
            'Employee data deleted successfully.',
            'Error deleting employee data. Please try again.'
        );
    });

    // Leave Management
    document.getElementById('view-leave-btn').addEventListener('click', async () => {
        if (!checkLoginStatus()) return; // Check login before viewing leave records
        const leaveId = document.getElementById('view-leave-id').value;
        const result = await handleRequest(
            `https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/dev/leave?employeeId=${leaveId}`,
            'GET',
            null,
            'Leave reord fetched successfully',
            'Error fetching leave record. Please try again.'
        );

        const leaveInfo = document.getElementById('leave-info');
        if (result) {
            leaveInfo.classList.remove('hidden');
            leaveInfo.innerText = JSON.stringify(result, null, 2);
        } else {
            messages.innerText = 'No data available for the given Employee ID.';
            leaveInfo.classList.add('hidden');
        }
    });

    document.getElementById('update-leave-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!checkLoginStatus()) return; // Check login before updating leave records
        const leaveData = {
            employeeId: document.getElementById('update-leave-employee-id').value,
            leaveDetails: document.getElementById('update-leave-details').value,
        };
        await handleRequest(
            'https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/dev/leave',
            'PUT',
            leaveData,
            'Leave record added/updated successfully.',
            'Error adding/updating leave record. Please try again.'
        );
    });


    document.getElementById('delete-leave-btn').addEventListener('click', async () => {
        if (!checkLoginStatus()) return; // Check login before deleting leave records
        const leaveId = document.getElementById('delete-leave-id').value;
        await handleRequest(
            `https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/dev/leave?employeeId=${leaveId}`,
            'DELETE',
            null,
            'Leave record deleted successfully.',
            'Error deleting leave record. Please try again.'
        );
    });
    
     // Performance Management
     document.getElementById('view-performance-btn').addEventListener('click', async () => {
        if (!checkLoginStatus()) return; // Check login before viewing performance data
        const performanceId = document.getElementById('view-performance-id').value;
        const result = await handleRequest(
            `https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/perfm/performance?employeeId=${performanceId}`,
            'GET',
            null,
            'performance data fetched successfully',
            'Error fetching performance data. Please try again.'
        );

        const performanceInfo = document.getElementById('performance-info');
        if (result) {
            performanceInfo.classList.remove('hidden');
            performanceInfo.innerText = JSON.stringify(result, null, 2);
        } else {
            messages.innerText = 'No data available for the given Employee ID.';
            performanceInfo.classList.add('hidden');
        }
    });

    document.getElementById('update-performance-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!checkLoginStatus()) return; // Check login before updating performance data
        const performanceData = {
            employeeId: document.getElementById('update-performance-employee-id').value,
            performanceReview: document.getElementById('update-performance-review').value,
            performanceRating: document.getElementById('update-performance-rating').value,
        };
        await handleRequest(
            'https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/perfm/performance',
            'PUT',
            performanceData,
            'Performance data updated successfully.',
            'Error updating performance data. Please try again.'
        );
    });


    document.getElementById('delete-performance-btn').addEventListener('click', async () => {
        if (!checkLoginStatus()) return; // Check login before deleting performance data
        const performanceId = document.getElementById('delete-performance-id').value;
        await handleRequest(
            `https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/perfm/performance?employeeId=${performanceId}`,
            'DELETE',
            null,
            'Performance data deleted successfully.',
            'Error deleting performance data. Please try again.'
        );
    });

    // Payroll Management
    document.getElementById('view-payroll-btn').addEventListener('click', async () => {
        if (!checkLoginStatus()) return; // Check login before viewing payroll data
        const payrollId = document.getElementById('view-payroll-id').value;
        const result = await handleRequest(
            `https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/pay/payroll?employeeId=${payrollId}`,
            'GET',
            null,
            'payroll data fetched successfully',
            'Error fetching payroll data. Please try again.'
        );

        const payrollInfo = document.getElementById('payroll-info');
        if (result) {
            payrollInfo.classList.remove('hidden');
            payrollInfo.innerText = JSON.stringify(result, null, 2);
        } else {
            messages.innerText = 'No data available for the given Employee ID.';
            payrollInfo.classList.add('hidden');
        }
    });

    document.getElementById('update-payroll-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!checkLoginStatus()) return; // Check login before updating payroll data
        const payrollData = {
            employeeId: document.getElementById('update-payroll-employee-id').value,
            salary: document.getElementById('update-salary').value,
            deductions: document.getElementById('update-deductions').value,
            bonuses: document.getElementById('update-bonuses').value,
            netPay: document.getElementById('update-netPay').value,
        };
        await handleRequest(
            'https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/pay/payroll',
            'PUT',
            payrollData,
            'Payroll data updated successfully.',
            'Error updating payroll data. Please try again.'
        );
    });

    document.getElementById('delete-payroll-btn').addEventListener('click', async () => {
        if (!checkLoginStatus()) return; // Check login before deleting payroll data
        const payrollId = document.getElementById('delete-payroll-id').value;
        await handleRequest(
            `https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/pay/payroll?employeeId=${payrollId}`,
            'DELETE',
            null,
            'Payroll data deleted successfully.',
            'Error deleting payroll data. Please try again.'
        );
    });

    // File Upload Handling
    document.getElementById('upload-file-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!checkLoginStatus()) return; // Check login before submitting the form

        const formData = new FormData();
        const fileInput = document.getElementById('file-upload');
        formData.append('file', fileInput.files[0]);

        try {
            const response = await fetch('https://9xxy2hfbxi.execute-api.ap-south-1.amazonaws.com/dev/upload', {
                method: 'put',
                body: formData

            });

            const result = await response.json();
            document.getElementById('upload-messages').innerText = result.message || 'File uploaded successfully!';
        } catch (error) {
            document.getElementById('upload-messages').innerText = 'Error uploading the file.';
        }
    });
});
