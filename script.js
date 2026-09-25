function ajouterAuPanier(nom, prix){

    let panier = localStorage.getItem("panier");

    if(panier == null){

        panier = [];

    }else{

        panier = JSON.parse(panier);

    }

    let produit = panier.find(function(article){
        return article.nom === nom && Number(article.prix) === Number(prix);
    });

    if(produit){
        produit.quantite = (Number(produit.quantite) || 1) + 1;
    }else{
        panier.push({
            nom : nom,
            prix : Number(prix),
            quantite : 1
        });
    }

    localStorage.setItem("panier",JSON.stringify(panier));

    alert(nom + " ajouté au panier !");

}

fetch("/api/panier", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        nom: nom,
        prix: prix
    })
})
.then(response => response.json())
.then(data => {
    console.log(data);
});

fetch("/api/produits")
.then(response => response.json())
.then(produits => {

    const liste = document.getElementById("liste-produits");

    produits.forEach(produit => {

        liste.innerHTML += `
            <div class="carte">
                <h3>${produit.nom}</h3>
                <p>${produit.prix} FCFA</p>
                <button onclick="ajouterAuPanier('${produit.nom}', ${produit.prix})">
                    Ajouter au panier
                </button>
            </div>
        `;

    });

})
.catch(error => {
    console.log("Erreur :", error);
});