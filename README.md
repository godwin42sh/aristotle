# Fiche de Personnage - Jeu de Rôle Époque d'Aristote

Une application web simple pour gérer les fiches de personnage d'un jeu de rôle se déroulant à l'époque d'Aristote, avec un focus sur les quatre éléments (Feu, Eau, Terre, Air).

## Fonctionnalités

- Interface intuitive pour créer et gérer une fiche de personnage
- Gestion des 4 éléments (Feu, Eau, Terre, Air) avec 12 points pour chacun
- Sauvegarde locale dans le navigateur
- Export/import des fiches de personnage pour le partage
- Fonctionne entièrement en local, sans base de données

## Comment utiliser

### Installation

Plusieurs options sont disponibles pour utiliser cette application :

#### Option 1 : Utilisation directe (sans installation)

1. Clonez ce dépôt : `git clone https://github.com/votre-utilisateur/aristote-character-sheet.git`
2. Ouvrez le fichier `index.html` dans votre navigateur préféré

#### Option 2 : Via Docker

```bash
docker pull votre-utilisateur/aristote-character-sheet:latest
docker run -d -p 8080:80 votre-utilisateur/aristote-character-sheet:latest
```

Puis visitez `http://localhost:8080` dans votre navigateur.

### Utilisation de la fiche de personnage

1. **Création d'un personnage** :
   - Renseignez le nom et la description du personnage
   - Cliquez sur les points dans chaque élément pour représenter les talents initiaux

2. **Pendant la partie** :
   - Maintenez la touche Shift et cliquez sur un point déjà coché pour le marquer comme utilisé
   - Sauvegardez régulièrement avec le bouton "Sauvegarder"

3. **Partage et sauvegarde** :
   - Utilisez "Exporter" pour générer un fichier JSON contenant toutes les données du personnage
   - Pour charger un personnage, cliquez sur "Importer" et collez le contenu du fichier JSON

## Développement

### Prérequis

- Un navigateur web moderne
- Pour le déploiement Docker : Docker installé sur votre machine

### Structure du projet

```
.
├── index.html      # Structure HTML principale
├── styles.css      # Feuilles de style
└── script.js       # Logique JavaScript
```

## Déploiement

### GitHub Actions

Ce projet utilise GitHub Actions pour automatiquement construire et publier l'image Docker à chaque push sur la branche main.

Pour configurer le déploiement automatique, ajoutez les secrets suivants dans votre dépôt GitHub :
- `DOCKERHUB_USERNAME` : Votre nom d'utilisateur Docker Hub
- `DOCKERHUB_TOKEN` : Votre token d'accès Docker Hub

## Licence

MIT