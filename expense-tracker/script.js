let nameInput = document.getElementById('expense-name');
let amountInput = document.getElementById('expense-amount');
let addBtn = document.getElementById('add-btn');
let list = document.getElementById('expense-list');

let expenseLabels = [];
let expensePrices = [];

let ctx = document.getElementById('myChart').getContext('2d');

let myChart = new Chart(ctx, {
    type: 'pie', // Try changing this to 'bar' or 'line' later!
    data: {
        labels: expenseLabels, // Connects to our empty list
        datasets: [{
            label: 'Expense Cost',
            data: expensePrices, // Connects to our empty price list
            backgroundColor: [
                '#ff6384', // Pink
                '#36a2eb', // Blue
                '#ffce56', // Yellow
                '#4bc0c0', // Teal
                '#9966ff', // Purple
                '#ff9f40'  // Orange
            ]
        }]
    }
});

function addExpense(){
    let name = nameInput.value;
    let amount = Number(amountInput.value);
    if (name === '' || amount === 0){
        alert('Please enter valid name and amount');
        return;
    }

    expenseLabels.push(name);
    expensePrices.push(amount);

    let li = document.createElement('li');
    li.innerHTML = `
        <span>${name}</span>
        <span>$${amount}</span>
    `;
    list.appendChild(li);
    myChart.update()
    nameInput.value = '';
    amountInput.value = '';
}

addBtn.addEventListener('click',addExpense);
