document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const characterName = document.getElementById('character-name');
    const characterDescription = document.getElementById('character-description');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const resetBtn = document.getElementById('reset-btn');
    const importModal = document.getElementById('import-modal');
    const closeModal = document.querySelector('.close');
    const confirmImport = document.getElementById('confirm-import');
    const importData = document.getElementById('import-data');
    
    // Éléments et leurs points
    const elements = ['fire', 'water', 'earth', 'air'];
    const elementsTranslation = {
        'fire': 'Feu',
        'water': 'Eau',
        'earth': 'Terre',
        'air': 'Air'
    };
    
    // Initialisation
    initializePoints();
    
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
    
    // Fermer la modal en cliquant en dehors
    window.addEventListener('click', function(event) {
        if (event.target === importModal) {
            importModal.style.display = 'none';
        }
    });
    
    // Fonction pour initialiser les points pour chaque élément
    function initializePoints() {
        elements.forEach(element => {
            const container = document.querySelector(`#${element}-element .points-container`);
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
    }
    
    // Fonction pour basculer l'état d'un point
    function togglePoint(point, isShiftPressed) {
        if (isShiftPressed) {
            // Mode "utilisé" (avec Shift)
            if (point.classList.contains('checked')) {
                point.classList.toggle('used');
            }
        } else {
            // Mode "coché" (sans Shift)
            point.classList.toggle('checked');
            if (!point.classList.contains('checked')) {
                point.classList.remove('used');
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
        const data = getCharacterData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `${data.name || 'personnage'}_aristote.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    // Fonction pour importer le personnage
    function importCharacter() {
        try {
            const data = JSON.parse(importData.value);
            setCharacterData(data);
            importModal.style.display = 'none';
            importData.value = '';
            alert('Personnage importé avec succès !');
        } catch (e) {
            alert('Erreur lors de l\'importation: Le format des données est invalide.');
        }
    }
    
    // Fonction pour réinitialiser le personnage
    function resetCharacter() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser votre personnage ? Toutes les modifications non sauvegardées seront perdues.')) {
            characterName.value = '';
            characterDescription.value = '';
            
            const points = document.querySelectorAll('.point');
            points.forEach(point => {
                point.classList.remove('checked', 'used');
            });
        }
    }
    
    // Fonction pour obtenir les données du personnage
    function getCharacterData() {
        const data = {
            name: characterName.value,
            description: characterDescription.value,
            elements: {}
        };
        
        elements.forEach(element => {
            data.elements[element] = {
                points: Array.from(document.querySelectorAll(`#${element}-element .point`)).map(point => {
                    return {
                        index: parseInt(point.dataset.index),
                        checked: point.classList.contains('checked'),
                        used: point.classList.contains('used')
                    };
                })
            };
        });
        
        return data;
    }
    
    // Fonction pour définir les données du personnage
    function setCharacterData(data) {
        characterName.value = data.name || '';
        characterDescription.value = data.description || '';
        
        // Réinitialiser tous les points d'abord
        const allPoints = document.querySelectorAll('.point');
        allPoints.forEach(point => {
            point.classList.remove('checked', 'used');
        });
        
        // Définir les états des points selon les données importées
        if (data.elements) {
            elements.forEach(element => {
                if (data.elements[element] && data.elements[element].points) {
                    data.elements[element].points.forEach(pointData => {
                        const pointElement = document.querySelector(`#${element}-element .point[data-index="${pointData.index}"]`);
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
    console.log("- Exportez votre personnage pour le partager ou le sauvegarder hors-ligne");
});