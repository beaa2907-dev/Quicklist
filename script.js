const form = document.querySelector("#item-form");
const input = document.querySelector("#item-input");
const list = document.querySelector("#shopping-list");
const emptyState = document.querySelector("#empty-state");

const remainingCount = document.querySelector("#remaining-count");
const listSummary = document.querySelector("#list-summary");

const progressValue = document.querySelector("#progress-value");
const progressBar = document.querySelector("#progress-bar");

const clearCompletedButton = document.querySelector("#clear-completed");
const feedback = document.querySelector("#feedback");


let items = [];
let feedbackTimer;


function showFeedback(message) {
    feedback.textContent = message;

    clearTimeout(feedbackTimer);

    feedbackTimer = setTimeout(() => {
        feedback.textContent = "";
    }, 2500);
}


function updateSummary() {

    const total = items.length;

    const completed = items.filter(item => item.completed).length;

    const pending = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round(completed / total * 100);

    remainingCount.textContent = pending;

    listSummary.textContent = total === 0
        ? "Sua lista está vazia."
        : `${total} ${total === 1 ? "produto" : "produtos"} na lista • ${completed} concluído(s)`;

    progressValue.textContent = `${percentage}%`;

    progressBar.style.width = `${percentage}%`;

    emptyState.hidden = total !== 0;
}


function renderList() {

    list.querySelectorAll(".item").forEach(element => {
        element.remove();
    });

    items.forEach(item => {

        const li = document.createElement("li");

        li.className = `item${item.completed ? " completed" : ""}`;


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "item-check";

        checkbox.checked = item.completed;

        checkbox.setAttribute(
            "aria-label",
            `Marcar ${item.name} como concluído`
        );

        checkbox.addEventListener("change", () => {

            item.completed = checkbox.checked;

            renderList();

            showFeedback(
                item.completed
                    ? "Produto marcado como concluído!"
                    : "Produto voltou para a lista."
            );
        });


        const name = document.createElement("span");

        name.className = "item-name";

        name.textContent = item.name;


        const removeButton = document.createElement("button");

        removeButton.type = "button";

        removeButton.className = "remove-button";

        removeButton.textContent = "×";

        removeButton.setAttribute(
            "aria-label",
            `Remover ${item.name}`
        );

        removeButton.addEventListener("click", () => {

            items = items.filter(current => {
                return current.id !== item.id;
            });

            renderList();

            showFeedback("Produto removido da lista.");
        });


        li.append(checkbox, name, removeButton);

        list.appendChild(li);

    });

    updateSummary();
}


form.addEventListener("submit", event => {

    event.preventDefault();

    const name = input.value.trim();


    if (!name) {

        showFeedback("Digite o nome de um produto antes de adicionar.");

        input.focus();

        return;
    }


    const exists = items.some(item =>

        item.name.toLocaleLowerCase("pt-BR") ===
        name.toLocaleLowerCase("pt-BR")

    );

    if (exists) {

        showFeedback("Esse produto já está na sua lista.");

        input.select();

        return;
    }


    items.push({

        id: Date.now() + Math.random(),

        name: name,

        completed: false

    });


    renderList();

    form.reset();

    input.focus();

    showFeedback("Produto adicionado com sucesso!");

});

clearCompletedButton.addEventListener("click", () => {

    const completedCount = items.filter(item => {
        return item.completed;
    }).length;

    if (completedCount === 0) {

        showFeedback("Não há produtos concluídos para limpar.");

        return;
    }

    items = items.filter(item => {
        return !item.completed;
    });

    renderList();

    showFeedback("Produtos concluídos removidos da lista.");

});



renderList();
