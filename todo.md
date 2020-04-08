Todo pour la prochaine fois :

1. Créer un fichier restaurants.json

- Essaye de l'appeler (`fetch`), console log les données
- Le formatter comme il faut (c.f. le code ci-dessous)
- Il faut bien que les markers continuent à s'afficher

2. Ajout des événements à chacun de tes markets

- Autrement dit, quand tu cliques, tu peux logger l'id du marker
- Puis tu récupères toutes les informations relatives à ce marker

3. Afficher chacun de tes markers aux avis que tu auras enregistrés

```json
[
  {
    "id": 1,
    "restaurantName": "Bronco",

    "address": "39 Rue des Petites Écuries, 75010 Paris",

    "lat": 48.8737815,

    "long": 2.3501649,

    "ratings": [
      {
        "stars": 4,

        "comment": "Un excellent restaurant, j'y reviendrai ! Par contre il vaut mieux aimer la viande."
      },

      {
        "stars": 5,

        "comment": "Tout simplement mon restaurant préféré !"
      }
    ]
  },

  {
    "id": 2,
    "restaurantName": "Babalou",

    "address": "4 Rue Lamarck, 75018 Paris",

    "lat": 48.8865035,

    "long": 2.3442197,

    "ratings": [
      {
        "stars": 5,

        "comment": "Une minuscule pizzeria délicieuse cachée juste à côté du Sacré choeur !"
      },

      {
        "stars": 3,

        "comment": "J'ai trouvé ça correct, sans plus"
      }
    ]
  }
]
```
