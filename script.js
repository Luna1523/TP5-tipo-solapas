const tabContainer = document.querySelector(".vertical-tabs");
const modeButtons = Array.from(document.querySelectorAll(".mode-button"));
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#site-search");

const collections = {
  categories: [
    ["Procesos", ["Colonialismo", "Extractivismo", "Modernidad", "Mestizaje", "Hibridación cultural", "Colonialidad de género", "Colonialidad", "Representación", "Identidad"], "#9fd2f4", "#0b2f5b"],
    ["Conocimiento", ["Oralidad", "Lengua", "Sistema", "Visibilización", "Diseño situado", "Saber situado", "Justicia cognitiva", "Interculturalidad", "Epistemologías del Sur", "Pluriverso", "Diversidad epistemológica", "Decolonialidad", "Desobediencia epistémica", "Ancestralidad"], "#70afe4", "#0b2f5b"],
    ["Herramientas", ["Identidad", "Interfaz", "Traducción", "Memoria", "Matriz de pensamiento", "Pedagogías de la crueldad", "Reparación", "Archivo", "Tecnología", "Resistencia", "Oralidad", "Lengua", "Sistema", "Visibilización", "Diseño situado"], "#2f73b7", "#b9dcf2"],
    ["Comunidad", ["Comunidad", "Comunalidad", "Buen vivir", "Cosmovisión", "Reciprocidad", "Frontera", "Territorio", "Desobediencia tecnológica", "Cuerpo-territorio", "Ancestralidad"], "#174b82", "#b9dcf2"],
  ],
  tags: [
    ["Práctica", ["Comunidad", "Comunalidad", "Buen vivir", "Reciprocidad", "Desobediencia tecnológica", "Saber situado", "Desobediencia epistémica", "Oralidad", "Sistema", "Visibilización", "Diseño situado", "Traducción", "Reparación", "Tecnología", "Resistencia", "Colonialidad de género", "Extractivismo", "Hibridación cultural"], "#b8ddf7", "#0b2f5b"],
    ["Principio", ["Visibilización", "Diseño situado", "Diversidad epistemológica", "Pluriverso", "Saber situado", "Epistemologías del Sur", "Justicia cognitiva", "Desobediencia epistémica", "Interculturalidad", "Ancestralidad", "Comunalidad", "Buen vivir", "Reciprocidad", "Cuerpo-territorio"], "#8fc5ec", "#0b2f5b"],
    ["Concepto", ["Cosmovisión", "Frontera", "Territorio", "Cuerpo-territorio", "Diversidad epistemológica", "Epistemologías del Sur", "Justicia cognitiva", "Reparación", "Mestizaje", "Hibridación cultural", "Colonialidad"], "#70afe4", "#0b2f5b"],
    ["Proceso", ["Colonialismo", "Extractivismo", "Modernidad", "Colonialidad", "Representación", "Identidad", "Traducción", "Memoria", "Matriz de pensamiento", "Pedagogías de la crueldad", "Decolonialidad"], "#2f6faf", "#b9dcf2"],
    ["Dispositivo", ["Decolonialidad", "Interculturalidad", "Oralidad", "Lengua", "Sistema", "Visibilización", "Archivo", "Interfaz", "Memoria", "Matriz de pensamiento", "Pedagogías de la crueldad", "Identidad", "Colonialidad de género"], "#174b82", "#b9dcf2"],
  ],
};

function bindTabs() {
  const tabs = Array.from(tabContainer.querySelectorAll(".home-tab"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      if (event.target.closest(".concept-link")) return;
      const isActive = tab.classList.contains("is-active");
      const isCloseControl = event.target.closest(".tab-close");

      if (isActive && !isCloseControl) return;

      const willOpen = !isActive;
      tabs.forEach((item) => {
        const isOpen = item === tab && willOpen;
        item.classList.toggle("is-active", isOpen);
        item.setAttribute("aria-expanded", String(isOpen));
      });
    });

    tab.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !tab.classList.contains("is-active")) {
        event.preventDefault();
        tab.click();
      }
    });
  });

  return tabs;
}

function renderTabs(mode) {
  tabContainer.replaceChildren(
    ...collections[mode].map(([label, concepts, color, textColor], index) => {
      const tab = document.createElement("section");
      tab.className = "home-tab";
      tab.tabIndex = 0;
      tab.setAttribute("role", "button");
      tab.setAttribute("aria-expanded", "false");
      tab.style.setProperty("--tab-color", color);
      tab.style.setProperty("--tab-text", textColor);
      tab.style.setProperty("--concept-accent", textColor === "#0b2f5b" ? "#e3a936" : "#ffc64f");
      tab.style.setProperty("--layer", String(index + 1));
      tab.style.setProperty("--concept-rows", String(Math.ceil(concepts.length / 2)));

      const tabLabel = document.createElement("span");
      tabLabel.className = "tab-label";
      tabLabel.textContent = label;

      const closeControl = document.createElement("button");
      closeControl.className = "tab-close";
      closeControl.type = "button";
      closeControl.setAttribute("aria-label", `Cerrar ${label}`);
      closeControl.textContent = "+";

      const content = document.createElement("span");
      content.className = "tab-content";
      const list = document.createElement("span");
      list.className = "concept-list";
      const targetRightCount = Math.floor(concepts.length / 2);
      const multiwordIndexes = concepts
        .map((concept, conceptIndex) => (/\s/.test(concept.trim()) ? conceptIndex : -1))
        .filter((conceptIndex) => conceptIndex >= 0);
      const singlewordIndexes = concepts
        .map((concept, conceptIndex) => (/\s/.test(concept.trim()) ? -1 : conceptIndex))
        .filter((conceptIndex) => conceptIndex >= 0);
      const rightIndexes = new Set(multiwordIndexes.slice(0, targetRightCount));
      const remainingRightSlots = targetRightCount - rightIndexes.size;
      if (remainingRightSlots > 0) {
        singlewordIndexes.slice(-remainingRightSlots).forEach((conceptIndex) => rightIndexes.add(conceptIndex));
      }

      concepts.forEach((concept, conceptIndex) => {
        const control = document.createElement(
          concept.toLocaleLowerCase("es") === "representación" ? "a" : "button"
        );
        control.className = "concept-link";
        control.textContent = concept;
        if (/\s/.test(concept.trim())) control.classList.add("is-multiword");
        control.classList.add(rightIndexes.has(conceptIndex) ? "is-right-column" : "is-left-column");

        if (control instanceof HTMLAnchorElement) {
          control.href = "./representacion.html";
        } else {
          control.type = "button";
          control.classList.add("is-prototype");
          control.title = "Entrada en desarrollo";
          control.addEventListener("click", () => {
            control.classList.toggle("is-selected");
          });
        }
        list.append(control);
      });

      content.append(list);
      tab.append(tabLabel, closeControl, content);
      return tab;
    })
  );

  bindTabs();
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    renderTabs(button.dataset.mode);
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  if (!query) return;

  const tabs = Array.from(tabContainer.querySelectorAll(".home-tab"));
  const match = tabs.find((tab) =>
    tab.textContent.toLocaleLowerCase("es").includes(query)
  );

  tabs.forEach((tab) => {
    const isMatch = tab === match;
    tab.classList.toggle("is-active", isMatch);
    tab.setAttribute("aria-expanded", String(isMatch));
  });

  searchInput.setAttribute("aria-invalid", String(!match));
  if (match) match.focus();
});

searchInput.addEventListener("input", () => searchInput.removeAttribute("aria-invalid"));

renderTabs("categories");
