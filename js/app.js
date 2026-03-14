let tousLesLivres = [];

async function loadBooks() {
    try {
        const response = await fetch("data/books.json");
        tousLesLivres = await response.json();
        displayBooks(tousLesLivres);
    } catch (error) {
        console.error("Erreur de chargement du data", error);
    }
}

function displayBooks(books) {
    const list = document.querySelector("#book-list");
    list.innerHTML = ""; // Vider la liste avant d'afficher
    
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        
        let card = document.createElement("div");
        card.classList.add("card");
        
        let image = document.createElement("img");
        image.src = book.image;
        image.alt = book.title;
        
        let card_content = document.createElement("div");
        card_content.classList.add("card-content");
        
        let info_div = document.createElement("div");
        
        let title = document.createElement("h3");
        title.textContent = book.title;
        
        let author = document.createElement("p");
        author.textContent = book.author;
        
        let rating = document.createElement("p");
        rating.textContent = "⭐ " + book.rating;
        
        info_div.appendChild(title);
        info_div.appendChild(author);
        info_div.appendChild(rating);
        
        let voir = document.createElement("a");
        voir.href = "book.html?id=" + book.id;
        voir.classList.add("btn");
        voir.textContent = "VOIR";
        
        card_content.appendChild(info_div);
        card_content.appendChild(voir);
        
        card.appendChild(image);
        card.appendChild(card_content);
        
        list.appendChild(card);
    }
}

// Fonction pour rechercher un livre
function rechercherLivre() {
    let input = document.getElementById("search");
    let valeurDeRecherche = input.value.toLowerCase();
    
    let livresTrouves = [];
    
    for (let i = 0; i < tousLesLivres.length; i++) {
        let livre = tousLesLivres[i];
        let titre = livre.title.toLowerCase();
        let auteur = livre.author.toLowerCase();
        
        // Si la valeur de recherche se trouve dans le titre ou l'auteur
        if (titre.indexOf(valeurDeRecherche) !== -1 || auteur.indexOf(valeurDeRecherche) !== -1) {
            livresTrouves.push(livre);
        }
    }
    
    // On affiche seulement les livres trouvés
    displayBooks(livresTrouves);
}

// On écoute le clic sur le bouton chercher
document.getElementById("search-btn").addEventListener("click", rechercherLivre);

// On écoute aussi quand l'utilisateur tape sur son clavier
document.getElementById("search").addEventListener("keyup", rechercherLivre);

// On lance la fonction principale
loadBooks();