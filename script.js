document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const nomInput = document.getElementById('nom');
    const ageInput = document.getElementById('age');
    const origineInput = document.getElementById('origine');
    const occupationInput = document.getElementById('occupation');
    const talentsTextarea = document.getElementById('talents');
    const equipementTextarea = document.getElementById('equipement');
    const notesTextarea = document.getElementById('notes');
    
    // Compteurs de points disponibles par élément
    const totalInputs = {
        feu: document.getElementById('feu-total'),
        air: document.getElementById('air-total'),
        ether: document.getElementById('ether-total'),
        terre: document.getElementById('terre-total'),
        eau: document.getElementById('eau-total')
    };
    
    // Compétences par élément
    const competenceInputs = {
        feu: {
            exploser: document.getElementById('feu-exploser'),
            amorcer: document.getElementById('feu-amorcer'),
            attiser: document.getElementById('feu-attiser')
        },
        air: {
            filer: document.getElementById('air-filer'),
            insuffler: document.getElementById('air-insuffler'),
            evaporer: document.getElementById('air-evaporer')
        },
        ether: {}, // Éther n'a pas de compétences spécifiques
        terre: {
            peser: document.getElementById('terre-peser'),
            affermir: document.getElementById('terre-affermir'),
            evaluer: document.getElementById('terre-evaluer')
        },
        eau: {
            devier: document.getElementById('eau-devier'),
            abreuver: document.getElementById('eau-abreuver'),
            absorber: document.getElementById('eau-absorber')
        }
    };
    
    // Éléments des tooltips
    const elementHeaders = document.querySelectorAll('.element-header');
    const tooltips = document.querySelectorAll('.element-tooltip');
    
    // Boutons
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const resetBtn = document.getElementById('reset-btn');
    const importModal = document.getElementById('import-modal');
    const closeModal = document.querySelector('.close');
    const confirmImport = document.getElementById('confirm-import');
    const importData = document.getElementById('import-data');
    
    // Éléments et leurs identifiants
    const elements = ['feu', 'air', 'ether', 'terre', 'eau'];
    
    // Initialisation
    initializePoints();
    setupTooltips();
    setupCompetencesEvents();
    
    // Événements
    saveBtn.addEventListener('click', saveCharacter);
    loadBtn.addEventListener('click', loadCharacter);
    exportBtn.addEventListener('click', exportCharacter);
    importBtn.addEventListener('click', function() {
        importModal.style.display = 'block';
    });
    resetBtn.addEventListener('click', resetCharacter);
    closeModal.addEventListener('click', function() {
        importModal.style.display = 'none';
    });
    confirmImport.addEventListener('click', importCharacter);
    
    // Vérifier les limites de points au démarrage
    checkAllPointLimits();
    
    // Fermer la modal en cliquant en dehors
    window.addEventListener('click', function(event) {
        if (event.target === importModal) {
            importModal.style.display = 'none';
        }
    });
    
    // Fonction pour initialiser les points pour chaque élément
    function initializePoints() {
        elements.forEach(element => {
            // L'Éther n'a pas de points à cocher
            if (element === 'ether') return;
            
            const container = document.querySelector(`#${element} .points-container`);
            if (!container) return; // Vérification de sécurité
            
            container.innerHTML = '';
            
            for (let i = 1; i <= 12; i++) {
                const point = document.createElement('div');
                point.className = 'point';
                point.dataset.element = element;
                point.dataset.index = i;
                point.textContent = i;
                
                // Gestion des clics sur les points
                point.addEventListener('click', function(event) {
                    const isShiftPressed = event.shiftKey;
                    togglePoint(point, isShiftPressed);
                });
                
                container.appendChild(point);
            }
        });
        
        // Vérifier les limites de points
        checkAllPointLimits();
    }
    
    // Configurer les événements pour les inputs de compétences et points disponibles
    function setupCompetencesEvents() {
        // Événements pour les inputs de compétences
        const competenceInputs = document.querySelectorAll('.competence-input');
        competenceInputs.forEach(input => {
            input.addEventListener('change', function() {
                // Limiter la valeur entre 0 et 10
                if (this.value < 0) this.value = 0;
                if (this.value > 10) this.value = 10;
            });
        });
        
        // Événements pour les inputs de points disponibles
        Object.values(totalInputs).forEach(input => {
            input.addEventListener('change', function() {
                const element = this.id.split('-')[0];
                
                // Limiter la valeur selon l'élément
                if (this.value < 0) this.value = 0;
                
                if (element === 'ether') {
                    // L'Éther peut avoir jusqu'à 20 points
                    if (this.value > 20) this.value = 20;
                } else {
                    // Les autres éléments sont limités à 12 points
                    if (this.value > 12) this.value = 12;
                    
                    // Vérifier si le nombre de points cochés dépasse maintenant la limite
                    const pointStatus = checkPointLimitForElement(element);
                    
                    if (!pointStatus.isValid) {
                        alert(`Attention: Vous avez ${pointStatus.current} points cochés, mais seulement ${pointStatus.limit} points disponibles pour cet élément.`);
                    }
                }
            });
        });
    }
    
    // Fonction pour vérifier si le nombre de points cochés respecte la limite
    function checkPointLimitForElement(element) {
        // Si l'élément n'existe pas ou n'a pas d'input de total, retourner une valeur par défaut
        if (!totalInputs[element]) {
            return { current: 0, limit: 0, isValid: true };
        }
        
        const availablePoints = parseInt(totalInputs[element].value) || 0;
        const checkedPoints = document.querySelectorAll(`#${element} .point.checked`).length;
        
        return {
            current: checkedPoints,
            limit: availablePoints,
            isValid: checkedPoints <= availablePoints
        };
    }
    
    // Vérifier les limites de points pour tous les éléments
    function checkAllPointLimits() {
        elements.forEach(element => {
            // Ignorer l'Éther, qui n'a pas de points à cocher
            if (element !== 'ether') {
                checkPointLimitForElement(element);
            }
        });
    }
    
    // Fonction pour basculer l'état d'un point
    function togglePoint(point, isShiftPressed) {
        const element = point.dataset.element;
        
        if (isShiftPressed) {
            // Mode "utilisé" (avec Shift)
            if (point.classList.contains('checked')) {
                point.classList.toggle('used');
            }
        } else {
            // Mode "coché" (sans Shift)
            if (point.classList.contains('checked')) {
                // Décocher un point est toujours possible
                point.classList.remove('checked');
                point.classList.remove('used');
            } else {
                // Vérifier si on dépasse le nombre de points disponibles
                const pointStatus = checkPointLimitForElement(element);
                if (pointStatus.current < pointStatus.limit) {
                    // On peut cocher un point supplémentaire
                    point.classList.add('checked');
                } else {
                    // Afficher une alerte si on essaie de dépasser le nombre de points disponibles
                    alert(`Vous ne pouvez pas cocher plus de ${pointStatus.limit} points pour cet élément.`);
                }
            }
        }
    }
    
    // Fonction pour sauvegarder le personnage
    function saveCharacter() {
        const data = getCharacterData();
        localStorage.setItem('aristotle_character', JSON.stringify(data));
        alert('Personnage sauvegardé avec succès !');
    }
    
    // Fonction pour charger le personnage
    function loadCharacter() {
        const savedData = localStorage.getItem('aristotle_character');
        if (savedData) {
            setCharacterData(JSON.parse(savedData));
            alert('Personnage chargé avec succès !');
        } else {
            alert('Aucune sauvegarde trouvée !');
        }
    }
    
    // Fonction pour exporter le personnage
    function exportCharacter() {
        try {
            const data = getCharacterData();
            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `${data.nom || 'personnage'}_aristote.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            document.body.appendChild(linkElement); // Nécessaire pour Firefox
            linkElement.click();
            document.body.removeChild(linkElement); // Nettoyage après téléchargement
        } catch (e) {
            console.error("Erreur lors de l'exportation:", e);
            alert('Erreur lors de l\'exportation du personnage.');
        }
    }
    
    // Fonction pour importer le personnage
    function importCharacter() {
        try {
            if (!importData || !importData.value || importData.value.trim() === '') {
                alert('Veuillez coller les données du personnage avant de continuer.');
                return;
            }
            
            const data = JSON.parse(importData.value);
            setCharacterData(data);
            
            if (importModal) {
                importModal.style.display = 'none';
            }
            
            if (importData) {
                importData.value = '';
            }
            
            alert('Personnage importé avec succès !');
        } catch (e) {
            console.error("Erreur d'importation:", e);
            alert('Erreur lors de l\'importation: Le format des données est invalide.');
        }
    }
    
    // Fonction pour réinitialiser le personnage
    function resetCharacter() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser votre personnage ? Toutes les modifications non sauvegardées seront perdues.')) {
            nomInput.value = '';
            ageInput.value = '';
            origineInput.value = '';
            occupationInput.value = '';
            talentsTextarea.value = '';
            equipementTextarea.value = '';
            notesTextarea.value = '';
            
            // Réinitialiser toutes les compétences
            Object.values(competenceInputs).forEach(elementCompetences => {
                Object.values(elementCompetences).forEach(input => {
                    input.value = 0;
                });
            });
            
            // Réinitialiser les points disponibles
            Object.values(totalInputs).forEach(input => {
                input.value = 0;
            });
            
            // Réinitialiser tous les points cochables
            const points = document.querySelectorAll('.point');
            points.forEach(point => {
                point.classList.remove('checked', 'used');
            });
        }
    }
    
    // Fonction pour obtenir les données du personnage
    function getCharacterData() {
        const data = {
            nom: nomInput.value,
            age: ageInput.value,
            origine: origineInput.value,
            occupation: occupationInput.value,
            talents: talentsTextarea.value,
            equipement: equipementTextarea.value,
            notes: notesTextarea.value,
            competences: {
                feu: {
                    exploser: competenceInputs.feu.exploser.value,
                    amorcer: competenceInputs.feu.amorcer.value,
                    attiser: competenceInputs.feu.attiser.value
                },
                air: {
                    filer: competenceInputs.air.filer.value,
                    insuffler: competenceInputs.air.insuffler.value,
                    evaporer: competenceInputs.air.evaporer.value
                },
                ether: {},  // Éther n'a pas de compétences spécifiques
                terre: {
                    peser: competenceInputs.terre.peser.value,
                    affermir: competenceInputs.terre.affermir.value,
                    evaluer: competenceInputs.terre.evaluer.value
                },
                eau: {
                    devier: competenceInputs.eau.devier.value,
                    abreuver: competenceInputs.eau.abreuver.value,
                    absorber: competenceInputs.eau.absorber.value
                }
            },
            pointsDisponibles: {
                feu: totalInputs.feu.value,
                air: totalInputs.air.value,
                ether: totalInputs.ether.value,
                terre: totalInputs.terre.value,
                eau: totalInputs.eau.value
            },
            elements: {}
        };
        
        elements.forEach(element => {
            // Pour l'Éther, on ne sauvegarde pas de points
            if (element === 'ether') {
                data.elements[element] = { points: [] };
                return;
            }
            
            // Pour les autres éléments, on sauvegarde l'état des points
            const points = document.querySelectorAll(`#${element} .point`);
            if (points && points.length > 0) {
                data.elements[element] = {
                    points: Array.from(points).map(point => {
                        return {
                            index: parseInt(point.dataset.index),
                            checked: point.classList.contains('checked'),
                            used: point.classList.contains('used')
                        };
                    })
                };
            } else {
                data.elements[element] = { points: [] };
            }
        });
        
        return data;
    }
    
    // Fonction pour définir les données du personnage
    function setCharacterData(data) {
        if (!data) return;
        
        // Vérifier que les éléments DOM existent avant d'assigner des valeurs
        if (nomInput) nomInput.value = data.nom || '';
        if (ageInput) ageInput.value = data.age || '';
        if (origineInput) origineInput.value = data.origine || '';
        if (occupationInput) occupationInput.value = data.occupation || '';
        if (talentsTextarea) talentsTextarea.value = data.talents || '';
        if (equipementTextarea) equipementTextarea.value = data.equipement || '';
        if (notesTextarea) notesTextarea.value = data.notes || '';
        
        // Charger les compétences si elles existent
        if (data.competences) {
            try {
                // Feu
                if (data.competences.feu && competenceInputs.feu) {
                    if (competenceInputs.feu.exploser) competenceInputs.feu.exploser.value = data.competences.feu.exploser || 0;
                    if (competenceInputs.feu.amorcer) competenceInputs.feu.amorcer.value = data.competences.feu.amorcer || 0;
                    if (competenceInputs.feu.attiser) competenceInputs.feu.attiser.value = data.competences.feu.attiser || 0;
                }
                
                // Air
                if (data.competences.air && competenceInputs.air) {
                    if (competenceInputs.air.filer) competenceInputs.air.filer.value = data.competences.air.filer || 0;
                    if (competenceInputs.air.insuffler) competenceInputs.air.insuffler.value = data.competences.air.insuffler || 0;
                    if (competenceInputs.air.evaporer) competenceInputs.air.evaporer.value = data.competences.air.evaporer || 0;
                }
                
                // Terre
                if (data.competences.terre && competenceInputs.terre) {
                    if (competenceInputs.terre.peser) competenceInputs.terre.peser.value = data.competences.terre.peser || 0;
                    if (competenceInputs.terre.affermir) competenceInputs.terre.affermir.value = data.competences.terre.affermir || 0;
                    if (competenceInputs.terre.evaluer) competenceInputs.terre.evaluer.value = data.competences.terre.evaluer || 0;
                }
                
                // Eau
                if (data.competences.eau && competenceInputs.eau) {
                    if (competenceInputs.eau.devier) competenceInputs.eau.devier.value = data.competences.eau.devier || 0;
                    if (competenceInputs.eau.abreuver) competenceInputs.eau.abreuver.value = data.competences.eau.abreuver || 0;
                    if (competenceInputs.eau.absorber) competenceInputs.eau.absorber.value = data.competences.eau.absorber || 0;
                }
            } catch (e) {
                console.error("Erreur lors du chargement des compétences:", e);
            }
        }
        
        // Charger les points disponibles
        if (data.pointsDisponibles) {
            try {
                if (totalInputs.feu) totalInputs.feu.value = data.pointsDisponibles.feu || 0;
                if (totalInputs.air) totalInputs.air.value = data.pointsDisponibles.air || 0;
                if (totalInputs.ether) totalInputs.ether.value = data.pointsDisponibles.ether || 0;
                if (totalInputs.terre) totalInputs.terre.value = data.pointsDisponibles.terre || 0;
                if (totalInputs.eau) totalInputs.eau.value = data.pointsDisponibles.eau || 0;
            } catch (e) {
                console.error("Erreur lors du chargement des points disponibles:", e);
            }
        }
        
        try {
            // Réinitialiser tous les points d'abord
            const allPoints = document.querySelectorAll('.point');
            allPoints.forEach(point => {
                point.classList.remove('checked', 'used');
            });
            
            // Définir les états des points selon les données importées
            if (data.elements) {
                elements.forEach(element => {
                    // Ignorer l'Éther qui n'a pas de points
                    if (element === 'ether') return;
                    
                    if (data.elements[element] && data.elements[element].points) {
                        data.elements[element].points.forEach(pointData => {
                            if (!pointData || typeof pointData.index === 'undefined') return;
                            
                            const pointElement = document.querySelector(`#${element} .point[data-index="${pointData.index}"]`);
                            if (pointElement) {
                                if (pointData.checked) {
                                    pointElement.classList.add('checked');
                                }
                                if (pointData.used) {
                                    pointElement.classList.add('used');
                                }
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error("Erreur lors de la définition des états des points:", e);
        }
    }
    
    // Charger les données sauvegardées au démarrage
    const savedData = localStorage.getItem('aristotle_character');
    if (savedData) {
        try {
            setCharacterData(JSON.parse(savedData));
        } catch (e) {
            console.error('Erreur lors du chargement des données sauvegardées:', e);
        }
    }
    
    // Instructions d'utilisation
    console.log("Instructions d'utilisation:");
    console.log("- Cliquez sur un point pour le cocher/décocher");
    console.log("- Maintenez Shift + cliquez sur un point déjà coché pour le marquer comme utilisé");
    console.log("- Sauvegardez votre personnage avec le bouton 'Sauvegarder'");
    
    // Fonction pour configurer les tooltips
    function setupTooltips() {
        // Pour les appareils tactiles
        elementHeaders.forEach(header => {
            // Ajouter un gestionnaire de clic pour les appareils tactiles
            header.addEventListener('click', function(e) {
                // Si on a cliqué sur l'en-tête mais pas sur le tooltip lui-même
                if (!e.target.closest('.element-tooltip')) {
                    const tooltip = this.querySelector('.element-tooltip');
                    
                    // Fermer tous les autres tooltips
                    tooltips.forEach(t => {
                        if (t !== tooltip) {
                            t.style.visibility = 'hidden';
                            t.style.opacity = '0';
                        }
                    });
                    
                    // Basculer l'état du tooltip actuel
                    if (tooltip.style.visibility === 'visible') {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    } else {
                        tooltip.style.visibility = 'visible';
                        tooltip.style.opacity = '1';
                    }
                    
                    // Empêcher la propagation pour éviter que le clic ne ferme immédiatement le tooltip
                    e.stopPropagation();
                }
            });
        });
        
        // Fermer les tooltips quand on clique ailleurs sur la page
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.element-header')) {
                tooltips.forEach(tooltip => {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                });
            }
        });
    }
});