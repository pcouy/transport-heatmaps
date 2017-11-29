# Visualisation d'évenements ponctuels localisés spatialement et temporellement

## Objectif

Produire une visualisation interactive avec d3.js permettant d'afficher des heatmaps d'évenements, avec la possibilité de combiner ou comparer plusieurs données. Nous souhaitons produire une visualisation sur une seule page.

Les données fournies en entrée sont des fichiers CSV ayant pour colonnes un timestamp, une latitude et une longitude.
Nous travaillerons avec les données des pickups Uber à New York

## Fonctionnalités envisagées

### Import de données

L'utilisateur doit pourvoir importer ses propres données au format CSV contenant les colonnes définies précédemment.
Ces données peuvent ensuite être combinées ou comparées avec d'autres jeux de données.

### Manipulation des données

Lors de la sélection des données à visualiser :
1. L'utilisateur peut appliquer plusieurs filtres temporels :
 * Année(s)
 * Mois
 * Jour(s) de la semaine
 * Plages horaires
2. L'utilisateur peut additionner ou soustraire plusieurs jeux de données :
 * Une addition correspond à l'union des évenements des deux jeux de données
 * Une soustraction correspond à l'union des évenements du premier jeu de données et d'évenements *négatifs* associés aux évenements du deuxième jeu de données
3. L'utilisateur peut sauvegarder toute visualisation sous la forme d'un nouveau jeu de données qui pourra être manipulé à son tour
