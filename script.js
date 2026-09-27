const expenseForm = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");
const totalAmount = document.getElementById("totalAmount");
const totalRecords = document.getElementById("totalRecords");
const emptyMessage = document.getElementById("emptyMessage");
const clearBtn = document.getElementById("clearBtn");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function formatDate(dateString) {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

function renderExpenses() {
    expenseTable.innerHTML = "";

    if (expenses.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    let total = 0;

    expenses.forEach((expense) => {
        total += Number(expense.amount);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.id}</td>
            <td>${escapeHTML(expense.category)}</td>
            <td>₹${Number(expense.amount).toFixed(2)}</td>
            <td>${formatDate(expense.date)}</td>
            <td>${escapeHTML(expense.description)}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </td>
        `;

        expenseTable.appendChild(row);
    });

    totalAmount.textContent = `₹${total.toFixed(2)}`;
    totalRecords.textContent = expenses.length;
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = Number(document.getElementById("id").value);
    const category = document.getElementById("category").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value.trim();

    if (expenses.some(expense => expense.id === id)) {
        alert("This ID already exists. Please use another ID.");
        return;
    }

    const expense = {
        id,
        category,
        amount,
        date,
        description
    };

    expenses.push(expense);
    saveExpenses();
    renderExpenses();

    expenseForm.reset();

    // Put today's date back into the date field.
    document.getElementById("date").value =
        new Date().toISOString().split("T")[0];
});

function deleteExpense(id) {
    const expense = expenses.find(expense => expense.id === id);

    if (!expense) {
        alert("Expense not found.");
        return;
    }

    if (confirm(`Delete expense with ID ${id}?`)) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveExpenses();
        renderExpenses();
    }
}

clearBtn.addEventListener("click", function() {
    if (expenses.length === 0) {
        alert("There are no expenses to clear.");
        return;
    }

    if (confirm("Are you sure you want to delete ALL expenses?")) {
        expenses = [];
        saveExpenses();
        renderExpenses();
    }
});

// Set today's date when the website opens.
document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

renderExpenses();
