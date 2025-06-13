// --- CONSTANTES Y SELECTORES ---
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const formationSelect = document.getElementById("formation");
const formationContainer = document.getElementById("formation-container");

const getName = () => document.getElementById("player-name").value || "Jugador";
const getNumber = () => document.getElementById("player-number").value || "00";
const getStyle = () => document.getElementById("shirt-style").value;

// --- RENDERIZAR FORMACIÓN TÁCTICA ---
function renderFormation() {
  const formation = document.getElementById("formation").value;
  const formationContainer = document.getElementById("formation-container");

  // Limpia la formación anterior
  formationContainer.innerHTML = "";

  // Define formaciones sin contar el portero
  const formations = {
    "4-3-3": [4, 3, 3],
    "3-4-3": [3, 4, 3],
    "4-4-2": [4, 4, 2],
    "5-3-2": [5, 3, 2],
  };

  const lines = formations[formation];
  let dorsal = 2;

  // Agregar portero (línea separada)
  const goalieLine = document.createElement("div");
  goalieLine.className = "line appear";

  const goalie = document.createElement("div");
  goalie.className = "shirt goalkeeper";
  goalie.innerText = "1";
  goalie.title = "Portero";
  goalieLine.appendChild(goalie);

  formationContainer.appendChild(goalieLine);

  // Agregar el resto de líneas
  lines.forEach(players => {
    const line = document.createElement("div");
    line.className = "line appear";

    for (let i = 0; i < players; i++) {
      const shirt = document.createElement("div");
      shirt.className = "shirt";
      shirt.innerText = dorsal;
      shirt.title = `Jugador ${dorsal}`;
      dorsal++;
      line.appendChild(shirt);
    }

    formationContainer.appendChild(line);
  });
}



// --- CREAR CAMISETA TÁCTICA ---
function createShirt(number) {
  const shirt = document.createElement("div");
  shirt.classList.add("shirt");

  const name = getName();
  const dorsal = getNumber();
  const style = getStyle();

  shirt.innerText = dorsal;
  shirt.title = `${name} - #${dorsal} (${style})`;
  shirt.style.backgroundImage = getShirtStyle(style);
  shirt.onclick = () => addToCart(name, dorsal, style);

  return shirt;
}

// --- MAPEO DE ESTILOS VISUALES ---
function getShirtStyle(style) {
  const styles = {
    retro: "url('https://cdn-icons-png.flaticon.com/512/979/979585.png')",
    modern: "url('https://cdn-icons-png.flaticon.com/512/979/979630.png')",
    limited: "url('https://cdn-icons-png.flaticon.com/512/979/979558.png')",
  };
  return styles[style] || styles["modern"];
}

// --- AÑADIR CAMISETA AL CARRITO ---
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

// --- GUARDAR Y CARGAR DESDE LOCALSTORAGE ---
function saveCart() {
  const items = [...cartItems.querySelectorAll("li")].map((li) =>
    li.firstChild.textContent.trim()
  );
  localStorage.setItem("la343-cart", JSON.stringify(items));
}

function loadCart() {
  const stored = JSON.parse(localStorage.getItem("la343-cart")) || [];
  stored.forEach((text) => {
    const [desc] = text.split(" - "); // evitar errores con el botón
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

// --- CALCULAR TOTAL APROXIMADO ---
function updateTotal() {
  const precioUnidad = 45; // PUEDE VENIR DE API FUTURO
  const total = cartItems.querySelectorAll("li").length * precioUnidad;
  cartTotal.innerText = `$${total}`;
}

// --- SIMULACIÓN DE CHECKOUT ---
function checkout() {
  if (cartItems.children.length === 0) {
    alert("Tu colección táctica está vacía. ¡Elige tu once ideal!");
    return;
  }

  alert("¡Gracias por tu compra táctica! 🧠⚽\nVolverás a sentir la magia del fútbol en cada camiseta.");
  localStorage.removeItem("la343-cart");
  cartItems.innerHTML = "";
  updateTotal();
}

// --- INICIO ---
window.onload = () => {
  loadCart();
  renderFormation();
  formationSelect.addEventListener("change", renderFormation);
};
