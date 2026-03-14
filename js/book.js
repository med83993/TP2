const params = new URLSearchParams(window.location.search);
const bookId = parseInt(params.get('id'));

async function loadBookData() {
    try {
        const response = await fetch("data/books.json");
        const books = await response.json();
        
        let monLivre = null;
        for (let i = 0; i < books.length; i++) {
            if (books[i].id === bookId) {
                monLivre = books[i];
                break;
            }
        }
        
        if (monLivre !== null) {
            displayLivre(monLivre);
        }
        
        await initReviews();
        displayReviews();
        
    } catch (error) {
        console.error("Erreur de chargement du livre", error);
    }
}

function displayLivre(book) {
    const container = document.getElementById("book-details");
    container.innerHTML = "";
    
    let image = document.createElement("img");
    image.src = book.image;
    image.alt = book.title;
    
    let info = document.createElement("div");
    
    let titre = document.createElement("h2");
    titre.textContent = book.title;
    
    let auteur = document.createElement("h3");
    auteur.textContent = book.author;
    
    let description = document.createElement("p");
    description.textContent = book.description;
    
    let rating = document.createElement("p");
    rating.textContent = "⭐ " + book.rating;
    
    info.appendChild(titre);
    info.appendChild(auteur);
    info.appendChild(description);
    info.appendChild(rating);
    
    container.appendChild(image);
    container.appendChild(info);
}

// Fonction pour récupérer les données du JSON et les mettre dans localStorage pour simuler la BD
async function initReviews() {
    let savedReviews = JSON.parse(localStorage.getItem('mesNotesLivres'));
    
    if (savedReviews === null || savedReviews.init !== true) {
        try {
            const response = await fetch("data/reviews.json");
            const reviews = await response.json();
            
            savedReviews = {
                liste: reviews,
                init: true
            };
            localStorage.setItem('mesNotesLivres', JSON.stringify(savedReviews));
        } catch (error) {
            console.error("Erreur avec reviews.json", error);
        }
    }
}

function displayReviews() {
    let data = JSON.parse(localStorage.getItem('mesNotesLivres'));
    let container = document.getElementById("reviews-list");
    container.innerHTML = "";
    
    let count = 0;
    
    for (let i = 0; i < data.liste.length; i++) {
        let r = data.liste[i];
        
        if (r.bookId === bookId) {
            count++;
            
            let div = document.createElement("div");
            div.classList.add("review-item");
            
            let nom = document.createElement("strong");
            nom.textContent = r.name + " • ⭐ " + r.rating + "/5";
            
            let commentaire = document.createElement("p");
            commentaire.style.marginTop = "10px";
            commentaire.textContent = r.comment;
            
            div.appendChild(nom);
            div.appendChild(commentaire);
            
            container.appendChild(div);
        }
    }
    
    if (count === 0) {
        let vide = document.createElement("p");
        vide.textContent = "Aucun avis pour l'instant.";
        container.appendChild(vide);
    }
}

document.getElementById("add-review-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    
    let champNom = document.getElementById("reviewer-name").value;
    let champNote = parseInt(document.getElementById("review-rating").value);
    let champCommentaire = document.getElementById("review-comment").value;
    
    let data = JSON.parse(localStorage.getItem('mesNotesLivres'));
    
    let nouvelAvis = {
        bookId: bookId,
        name: champNom,
        rating: champNote,
        comment: champCommentaire
    };
    
    data.liste.push(nouvelAvis);
    localStorage.setItem('mesNotesLivres', JSON.stringify(data));
    
    document.getElementById("add-review-form").reset();
    
    displayReviews();
});

loadBookData();