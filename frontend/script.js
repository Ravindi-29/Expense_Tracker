// DOM Elements
const balance = document.getElementById('total-balance');
const money_plus = document.getElementById('total-income');
const money_minus = document.getElementById('total-expenses');
const list = document.getElementById('list');
const transactionForm = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const type = document.getElementById('type');
const category = document.getElementById('category');
const search = document.getElementById('search');
const filterCategory = document.getElementById('filter-category');
const currencySelector = document.getElementById('currency-selector');

const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const authForm = document.getElementById('auth-form');
const authBtn = document.getElementById('auth-btn');
const authMessage = document.getElementById('auth-message');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const usernameField = document.getElementById('username-field');

const darkModeToggle = document.getElementById('dark-mode-toggle');
const logoutBtn = document.getElementById('logout-btn');

const summaryModal = document.getElementById('summary-modal');
const summaryDetails = document.getElementById('summary-details');
const saveSummaryBtn = document.getElementById('save-summary-btn');
const deleteSummaryBtn = document.getElementById('delete-summary-btn');
const closeSummaryBtn = document.querySelector('.close-btn');

// State
let transactions = [];
let token = localStorage.getItem('token');
let currency = localStorage.getItem('currency') || '$';
let isLogin = true;
let chart = null;

const API_URL = 'http://localhost:5000/api';

// Initialize
function init() {
    currencySelector.value = currency;
    if (token) {
        showDashboard();
    } else {
        showAuth();
    }
}

// --- Auth Functions ---

function showAuth() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    getTransactions();
    checkMonthlySummary();
}

loginTab.onclick = () => {
    isLogin = true;
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    usernameField.classList.add('hidden');
    authBtn.innerText = 'Login';
};

registerTab.onclick = () => {
    isLogin = false;
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    usernameField.classList.remove('hidden');
    authBtn.innerText = 'Register';
};

authForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username')?.value;

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const body = isLogin ? { email, password } : { username, email, password };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.success) {
            if (isLogin) {
                token = data.token;
                localStorage.setItem('token', token);
                showDashboard();
            } else {
                authMessage.innerText = 'Registration successful! Please login.';
                loginTab.click();
            }
        } else {
            authMessage.innerText = data.message || 'Error occurred';
        }
    } catch (err) {
        authMessage.innerText = 'Server Error';
    }
};

logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    token = null;
    showAuth();
};

// --- Transaction Functions ---

async function getTransactions() {
    try {
        const res = await fetch(`${API_URL}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            transactions = data.data;
            updateUI();
        }
    } catch (err) {
        console.error(err);
    }
}

async function addTransaction(e) {
    e.preventDefault();

    const transactionData = {
        text: text.value,
        amount: +amount.value,
        type: type.value,
        category: category.value
    };

    try {
        const res = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });

        const data = await res.json();
        if (data.success) {
            transactions.unshift(data.data);
            updateUI();
            transactionForm.reset();
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteTransaction(id) {
    try {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (data.success) {
            transactions = transactions.filter(t => t._id !== id);
            updateUI();
        }
    } catch (err) {
        console.error(err);
    }
}

// --- Monthly Summary Functions ---

async function checkMonthlySummary() {
    try {
        const res = await fetch(`${API_URL}/summary/check`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.data.length > 0) {
            showSummaryModal(data.data[0]);
        }
    } catch (err) {
        console.error(err);
    }
}

function showSummaryModal(summary) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    summaryDetails.innerHTML = `
        <div class="summary-item"><strong>Period:</strong> ${months[summary.month]} ${summary.year}</div>
        <div class="summary-item"><strong>Total Income:</strong> <span class="plus">+${currency}${summary.totalIncome.toFixed(2)}</span></div>
        <div class="summary-item"><strong>Total Expenses:</strong> <span class="minus">-${currency}${summary.totalExpenses.toFixed(2)}</span></div>
        <div class="summary-item highlight"><strong>Balance:</strong> ${currency}${summary.balance.toFixed(2)}</div>
    `;

    summaryModal.classList.remove('hidden');

    saveSummaryBtn.onclick = () => updateSummary(summary._id, 'saved');
    deleteSummaryBtn.onclick = () => updateSummary(summary._id, 'deleted');
}

async function updateSummary(id, status) {
    try {
        const res = await fetch(`${API_URL}/summary/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (res.ok) {
            summaryModal.classList.add('hidden');
        }
    } catch (err) {
        console.error(err);
    }
}

closeSummaryBtn.onclick = () => summaryModal.classList.add('hidden');

// --- UI Updates ---

function updateUI() {
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.text.toLowerCase().includes(search.value.toLowerCase());
        const matchesCategory = filterCategory.value === 'all' || t.category === filterCategory.value;
        return matchesSearch && matchesCategory;
    });

    list.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;

    filteredTransactions.forEach(t => {
        const sign = t.type === 'income' ? '+' : '-';
        const item = document.createElement('li');
        item.classList.add(t.type === 'income' ? 'plus' : 'minus');

        item.innerHTML = `
            ${t.text} <span>${sign}${currency}${Math.abs(t.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="deleteTransaction('${t._id}')">&times;</button>
        `;

        list.appendChild(item);

        if (t.type === 'income') {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });

    const bal = totalIncome - totalExpense;
    balance.innerText = `${currency}${bal.toFixed(2)}`;
    money_plus.innerText = `+${currency}${totalIncome.toFixed(2)}`;
    money_minus.innerText = `-${currency}${totalExpense.toFixed(2)}`;

    updateChart(totalIncome, totalExpense);
}

function updateChart(income, expense) {
    const ctx = document.getElementById('expense-chart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#a8dadc', '#f4a261'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: document.body.classList.contains('dark-mode') ? '#fff' : '#4a4a4a' }
                }
            }
        }
    });
}

// --- Listeners ---

transactionForm.addEventListener('submit', addTransaction);

search.oninput = () => updateUI();
filterCategory.onchange = () => updateUI();

currencySelector.onchange = (e) => {
    currency = e.target.value;
    localStorage.setItem('currency', currency);
    updateUI();
};

darkModeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    lucide.createIcons();
    updateUI(); // Redraw chart for label colors
};

init();
