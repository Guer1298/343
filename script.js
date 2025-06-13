// --- CONSTANTES Y SELECTORES ---
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const formationSelect = document.getElementById("formation");
const formationContainer = document.getElementById("formation-container");

const getName = () => document.getElementById("player-name").value || "Jugador";
const getNumber = () => document.getElementById("player-number").value || "00";
const getStyle = () => document.getElementById("shirt-style").value || "modern";

// --- RENDERIZAR FORMACIÓN TÁCTICA DINÁMICAMENTE ---
function renderFormation() {
  const formation = formationSelect.value;
  formationContainer.innerHTML = ""; // Limpiar

  const formations = {
    "4-3-3": [4, 3, 3],
    "3-4-3": [3, 4, 3],
    "4-4-2": [4, 4, 2],
    "5-3-2": [5, 3, 2],
  };

  const lines = formations[formation];
  const dorsales = generateUniqueDorsals(11); // 10 + 1 (portero)

  // --- PORTERO ---
  const goalieLine = document.createElement("div");
  goalieLine.className = "line appear";

  const goalie = createShirt(dorsales[0], "Portero", "goalkeeper", "retro");
  goalieLine.appendChild(goalie);
  formationContainer.appendChild(goalieLine);

  // --- LÍNEAS DE JUGADORES ---
  let index = 1;
  lines.forEach((numPlayers) => {
    const line = document.createElement("div");
    line.className = "line appear";

    for (let i = 0; i < numPlayers; i++) {
      const shirt = createShirt(
        dorsales[index],
        `Jugador ${dorsales[index]}`,
        "shirt",
        getStyle()
      );
      line.appendChild(shirt);
      index++;
    }

    formationContainer.appendChild(line);
  });
}

// --- CREAR CAMISETA (dorsal, nombre, clase extra, estilo) ---
function createShirt(number = getNumber(), name = getName(), extraClass = "", style = getStyle()) {
  const shirt = document.createElement("div");
  shirt.className = `shirt ${extraClass}`;
  shirt.innerText = number;
  shirt.title = `${name} - #${number} (${style})`;
  shirt.style.backgroundImage = getShirtStyle(style);

  // Guardar datos para futuro uso
  shirt.dataset.name = name;
  shirt.dataset.number = number;
  shirt.dataset.style = style;

  shirt.onclick = () => {
    shirt.classList.add("selected");
    addToCart(name, number, style);
    setTimeout(() => shirt.classList.remove("selected"), 500);
  };

  return shirt;
}


// --- ESTILOS VISUALES DE CAMISETA ---
function getShirtStyle(style) {
  const styles = {
    retro: "url('https://cdn-icons-png.flaticon.com/512/979/979585.png')",
    modern: "url('https://cdn-icons-png.flaticon.com/512/979/979630.png')",
    limited: "url('https://cdn-icons-png.flaticon.com/512/979/979558.png')",
  };
  return styles[style] || styles["modern"];
}

// --- AÑADIR AL CARRITO ---
function addToCart(name, number, style) {
  const li = document.createElement("li");
  li.innerText = `${name} (#${number}) - ${style}`;

  const removeBtn = document.createElement("button");
  removeBtn.innerText = "❌";
  removeBtn.classList.add("remove-btn");
  removeBtn.title = "Quitar del carrito";
  removeBtn.onclick = () => {
    li.remove();
    saveCart();
    updateTotal();
  };

  li.appendChild(removeBtn);
  cartItems.appendChild(li);
  saveCart();
  updateTotal();
}

// --- DORSALES ALEATORIOS ÚNICOS ENTRE 2 Y 99 ---
function generateUniqueDorsals(quantity) {
  const dorsales = new Set();
  dorsales.add(1); // Portero

  while (dorsales.size < quantity) {
    dorsales.add(Math.floor(Math.random() * 98) + 2); // 2 a 99
  }

  return [...dorsales];
}

// --- LOCALSTORAGE ---
function saveCart() {
  const items = [...cartItems.querySelectorAll("li")].map((li) =>
    li.firstChild.textContent.trim()
  );
  localStorage.setItem("la343-cart", JSON.stringify(items));
}

function loadCart() {
  const stored = JSON.parse(localStorage.getItem("la343-cart")) || [];
  stored.forEach((text) => {
    const li = document.createElement("li");
    li.innerText = text;

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "❌";
    removeBtn.onclick = () => {
      li.remove();
      saveCart();
      updateTotal();
    };

    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });
  updateTotal();
}

// --- TOTAL SIMULADO ---
function updateTotal() {
  const precioUnidad = 45;
  const total = cartItems.querySelectorAll("li").length * precioUnidad;
  cartTotal.innerText = `$${total}`;
}

// --- CHECKOUT SIMULADO ---
function checkout() {
  if (cartItems.children.length === 0) {
    alert("Tu colección táctica está vacía. ¡Elige tu once ideal!");
    return;
  }

  alert("¡Gracias por tu compra táctica! ⚽🛒\nLlévate historia, estilo y pasión en cada camiseta.");
  localStorage.removeItem("la343-cart");
  cartItems.innerHTML = "";
  updateTotal();
}

// --- INICIALIZAR ---
window.onload = () => {
  loadCart();
  renderFormation();
  formationSelect.addEventListener("change", renderFormation);
};
