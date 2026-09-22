# Anatomy Kiné — utilisation sur iPhone

## Installation comme une vraie app
1. Publier ce dossier sur une adresse HTTPS (GitHub Pages, serveur personnel ou hébergement web).
2. Ouvrir cette adresse dans Safari sur l'iPhone.
3. Appuyer sur **Partager** → **Ajouter à l'écran d'accueil**.
4. Valider **Ajouter**.
5. L'icône **Anatomy Kiné** apparaît alors sur l'écran d'accueil et l'app s'ouvre en mode plein écran.

## Hors connexion
Les données et l'interface locales sont mises en cache par le Service Worker après la première ouverture. L'Atlas 3D reste dépendant de sa source 3D distante dans cette édition.

## Important
Un fichier ZIP ou HTML local ne peut pas installer directement une PWA sur iOS : l'installation « écran d'accueil » nécessite une page servie en HTTPS. Aucun logiciel n'est nécessaire sur l'iPhone une fois l'application hébergée.
