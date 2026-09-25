let panier = localStorage.getItem("panier");

if(panier == null){

    panier = [];

}else{

    panier = JSON.parse(panier);

}

function normaliserPanier(produits){
    let resultat = [];

    produits.forEach(function(produit){
        let existant = resultat.find(function(article){
            return article.nom === produit.nom && Number(article.prix) === Number(produit.prix);
        });
        let quantite = Number(produit.quantite) || 1;

        if(existant){
            existant.quantite += quantite;
        }else{
            resultat.push({
                nom: produit.nom,
                prix: Number(produit.prix),
                quantite: quantite
            });
        }
    });

    return resultat;
}

panier = normaliserPanier(panier);
localStorage.setItem("panier", JSON.stringify(panier));

let total = 0;
let lignesPanier = panier;

function afficherPanier(){
    let liste = document.getElementById("liste-panier");
    liste.innerHTML = "";
    lignesPanier = panier;
    total = 0;

    lignesPanier.forEach(function(produit, index){
        let ligne = document.createElement("tr");
        ligne.innerHTML = `
            <td>${produit.nom}</td>
            <td>
                <div class="quantity-control">
                    <button type="button" class="quantity-button" data-action="moins" aria-label="Diminuer ${produit.nom}">− Retirer</button>
                    <strong>${produit.quantite}</strong>
                    <button type="button" class="quantity-button" data-action="plus" aria-label="Augmenter ${produit.nom}">＋ Ajouter</button>
                </div>
            </td>
            <td>${produit.prix} FCFA</td>
            <td>${produit.prix * produit.quantite} FCFA</td>
            <td><button type="button" class="delete-button" data-action="supprimer" aria-label="Supprimer ${produit.nom}">✕ Supprimer</button></td>
        `;

        ligne.querySelector('[data-action="moins"]').addEventListener("click", function(){
            modifierQuantite(produit.nom, produit.prix, -1);
        });
        ligne.querySelector('[data-action="plus"]').addEventListener("click", function(){
            modifierQuantite(produit.nom, produit.prix, 1);
        });
        ligne.querySelector('[data-action="supprimer"]').addEventListener("click", function(){
            supprimerProduit(produit.nom, produit.prix);
        });
        liste.appendChild(ligne);
        total += produit.prix * produit.quantite;
    });

    document.getElementById("nombre-produits").textContent =
        panier.reduce(function(somme, produit){ return somme + produit.quantite; }, 0) +
        (panier.reduce(function(somme, produit){ return somme + produit.quantite; }, 0) > 1 ? " articles" : " article");
    document.getElementById("total").textContent = total + " FCFA";
    document.getElementById("panier-vide").hidden = panier.length !== 0;
    document.querySelector(".cart-table").classList.toggle("is-empty", panier.length === 0);
}

function sauvegarder(){
    localStorage.setItem("panier", JSON.stringify(panier));
    afficherPanier();
}

function modifierQuantite(nomProduit, prixProduit, variation){
    let produit = lignesPanier.find(function(element){
        return element.nom === nomProduit && element.prix === prixProduit;
    });

    if(!produit){
        return;
    }

    produit.quantite += variation;

    if(produit.quantite <= 0){
        panier = panier.filter(function(element){
            return element !== produit;
        });
    }
    sauvegarder();
}

function supprimerProduit(nomProduit, prixProduit){
    panier = panier.filter(function(element){
        return !(element.nom === nomProduit && Number(element.prix) === prixProduit);
    });
    sauvegarder();
}

afficherPanier();

function viderPanier(){

    localStorage.removeItem("panier");

    location.reload();

}

function commander(){

    if(panier.length == 0){

        alert("Votre panier est vide.");

        return;

    }

    let message = "Bonjour, je souhaite commander :\n\n";

    lignesPanier.forEach(function(produit){

        message += "- " + produit.nom + " x" + produit.quantite + " : " +
            (produit.prix * produit.quantite) + " FCFA\n";

    });

    message += "\nTotal : " + total + " FCFA";

    let messageEncode = encodeURIComponent(message);
    window.location.href = "https://wa.me/2250170631187?text=" + messageEncode;

}

