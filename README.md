# Anatomy Kiné V6

Version orientée première année de kinésithérapie.

## Nouveautés
- 5 systèmes 3D : muscles, squelette, nerfs, viscères, cardio-vasculaire.
- Recherche dans l'index anatomique distant + couche pédagogique locale.
- 25 muscles clés avec origine, insertion, innervation et action.
- Onglet Kiné.
- Onglet Révision avec quiz et score sauvegardé dans le navigateur.
- Sélection, centrage, isolation, transparence, vues face/dos.
- Interface responsive mobile/tablette/ordinateur.

## Lancer
```bash
npm install
npm run dev
```

Les modèles 3D et l'index atlas sont chargés depuis un dépôt public au runtime.
Le projet Z-Anatomy est distribué sous CC BY-SA 4.0 avec obligations d'attribution et de partage à l'identique pour les dérivés concernés.

Attributions : Z-Anatomy / BodyParts3D / contributeurs correspondants.


## V7 — Bibliothèque kiné
- Fiches articulaires : type, surfaces, mouvements, application kiné.
- Fiches ligamentaires : attaches, rôle mécanique, application kiné.
- Bibliothèque accessible directement depuis l'onglet Anatomie.
- Recherche unifiée muscles + articulations + ligaments + atlas.
- Mode Kiné enrichi avec une logique structure → mouvement → stabilisation → rééducation.


## V8 — Intégration réelle des cours
Cette version contient un espace **MES COURS** avec des supports de cours copiés dans le projet et ouvrables directement depuis l'application.

Supports actuellement intégrés :
1. Anatomie humaine — Introduction
2. Système squelettique appendiculaire — MMSS
3. Fondements de la kinésithérapie — Concepts généraux
4. Biomécanique — Introduction
5. Biomécanique — Analyse du mouvement et magnitudes
6. Physiologie humaine — Bloc I
7. Physiologie cellulaire — Synthèse des protéines et division

La couche anatomique et les fiches pédagogiques restent séparées des documents originaux : l'application peut donc afficher le support source sans modifier son contenu.


## V9 — Révision connectée aux cours
- Index de texte local des supports intégrés.
- Recherche plein texte dans les cours depuis « MES COURS ».
- Ouverture des PDF originaux depuis l'application.
- Nouveau mode « RÉVISION → Mes cours ».


## V10 — Espace de travail et flashcards
- Nouveau tableau de bord d'accueil.
- Statistiques locales : cours, fiches et scores.
- Parcours conseillé : cours → 3D → kiné → révision.
- Nouveau mode Flashcards.
- Révision des muscles clés avec affichage progressif de la réponse.
- Progression de flashcards conservée localement.


## V11 — Liaison cours → anatomie → kiné
- Carte des 7 supports intégrés avec leurs notions clés extraites du contenu.
- Accès direct à chaque cours depuis le tableau de bord.
- Sélection du cours conservée localement.
- Base prête pour le prochain niveau : relier chaque notion aux structures 3D, mouvements, articulations et questions.


## V12 — Moteur pédagogique par chapitre
- Un cours sélectionné devient un chapitre actif.
- Proposition automatique de structures anatomiques liées.
- Fiches structurelles avec origine, insertion, innervation et action.
- Questions dédiées au chapitre.
- Passage direct vers l’étude d’une structure.


## V13 — Mode Examen UFV
- Banque de questions multidisciplinaire.
- Simulation d'examen avec progression question par question.
- Score et historique enregistrés localement.
- Erreurs catégorisées par matière pour cibler les révisions.
- Réinitialisation possible à tout moment.


## V14 — Examen basé sur les supports UFV
- Banque dédiée de 43 questions/références issues des supports intégrés.
- Mode « Examen mes cours » séparé du quiz anatomie.
- Réponses et erreurs conservées localement.


## V15 — Progression et révision adaptative
- Centre de progression avec scores anatomie/cours/flashcards.
- Détection des matières ayant généré le plus d'erreurs.
- Mode « Révision ciblée » qui donne la priorité aux points faibles enregistrés.
- Mode examen complet conservé.
- Progression stockée localement.


## V16 — Parcours par chapitres
- Index structuré des chapitres des 7 supports intégrés.
- Navigation directe cours → chapitre → séance d'étude.
- Chapitre actif mémorisé.
- Base préparée pour associer chaque chapitre à ses structures 3D et à une banque d'examen dédiée.


## V17 — Séances d'apprentissage guidées
- Objectifs d'apprentissage par chapitre.
- Checklist de maîtrise persistante.
- Structures anatomiques proposées selon les objectifs du chapitre.
- Séance enregistrable comme terminée.


## V18 — Pont séance → anatomie 3D
- Les structures proposées dans une séance disposent d'une action « Afficher dans l'anatomie 3D ».
- La structure sélectionnée est mémorisée avant le passage vers l'onglet Anatomie.
- Le moteur tente de retrouver automatiquement le mesh correspondant et de l'isoler/centrer lorsque le modèle chargé expose des noms compatibles.


## V19 — Fiches de structures
- Nouvelle fiche de révision dédiée à chaque muscle reconnu.
- Origine, insertion, innervation et action regroupées.
- Bouton pour revenir directement à l'atlas 3D.
- Possibilité de marquer une structure comme maîtrisée.
- Les structures maîtrisées sont comptabilisées dans la progression.


## V20 — Ostéo-articulaire
- Module dédié aux articulations et ligaments.
- Fiches avec type, rôle mécanique, surfaces/attaches et mouvements lorsqu'ils sont disponibles.
- Accès depuis le tableau de bord.
- Les données de joints et ligaments déjà intégrées dans V7+ sont maintenant exposées dans un parcours d'étude dédié.


## V21 — Laboratoire des mouvements
- Module biomécanique dédié aux mouvements.
- Plans et axes anatomiques.
- Exemples fonctionnels.
- Applications kiné.
- Validation personnelle des mouvements maîtrisés.


## V22 — Laboratoire du mouvement
- Relations mouvement ↔ articulation ↔ plan ↔ axe ↔ muscles moteurs ↔ antagonistes.
- Applications kinésithérapiques contextualisées.
- Suivi local des mouvements maîtrisés.
- Nouveau fichier : `src/movement_map.json`.


## V23 — Parcours clinique
- Articulation → mouvements → muscles → ligaments → situations de rééducation → exercices pédagogiques → mini-quiz.
- 5 parcours : épaule, coude, hanche, genou, cheville.
- Progression locale par parcours.


## V24 — Évaluation clinique
- Banque de questions courtes anatomie/kiné.
- Correction immédiate.
- Suivi local des erreurs et des thèmes faibles.
- Répétition aléatoire des questions.


## V25 — Simulateur de cas clinique
- Cas pédagogiques épaule, genou et cheville.
- Raisonnement bilan → objectifs → tests → progression.
- Auto-évaluation des objectifs prioritaires.


## V26 — Fiches cliniques de structure
- Fiches muscle : origine, insertion, innervation, action.
- Application kiné, mini-bilan et points de vigilance.
- Progression locale des structures étudiées.


## V27 — Bibliothèque d'exercices
- Exercices pédagogiques par région et objectif.
- Étapes d'exécution, muscles sollicités, progression et points de vigilance.
- Suivi local des exercices étudiés.


## V28 — Plans de rééducation
- Progressions pédagogiques par phases.
- Checklist de bilan, mobilité, force, contrôle et retour fonctionnel.
- Suivi local de l'avancement.


## V29 — Grande base anatomique
- 35+ muscles structurés avec origine, insertion, innervation et action.
- 15 os et 8 articulations.
- 4 parcours pathologiques pédagogiques.
- Banque d'examen structurée générée depuis la base anatomique.
- Recherche et suivi de maîtrise par catégorie.


## V30 — Examen complet adaptatif
- QCM, vrai/faux, réponses courtes et mini-cas.
- Sessions aléatoires, score, meilleur score et historique local.
- Thèmes faibles enregistrés pour orienter les révisions.


## V31 — ULTIMATE / consolidation majeure
- Hub unifié regroupant anatomie, clinique, mouvements/biomécanique, cours UFV, examen et suivi.
- Base anatomique étendue : muscles, os et articulations.
- Base clinique étendue avec plusieurs parcours pathologiques.
- Recherche globale dans l'atlas.
- Suivi local des structures/cas maîtrisés.
- Conservation des modules V1-V30.
