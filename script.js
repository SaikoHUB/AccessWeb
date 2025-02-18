// Navigation fluide pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Gestion de la vidéo
const video = document.querySelector('video');
if (video) {
    // Ajout des raccourcis clavier pour la vidéo
    video.addEventListener('keydown', function(e) {
        switch(e.key) {
            case ' ':
            case 'k':
                // Espace ou K pour play/pause
                e.preventDefault();
                if (video.paused) video.play();
                else video.pause();
                break;
            case 'ArrowLeft':
                // Flèche gauche pour reculer de 5s
                e.preventDefault();
                video.currentTime = Math.max(video.currentTime - 5, 0);
                break;
            case 'ArrowRight':
                // Flèche droite pour avancer de 5s
                e.preventDefault();
                video.currentTime = Math.min(video.currentTime + 5, video.duration);
                break;
        }
    });
}

// Validation basique du formulaire
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Validation email basique
        if (!email.value.includes('@')) {
            alert('Veuillez entrer une adresse email valide');
            isValid = false;
        }
        
        // Validation longueur message
        if (message.value.length < 10) {
            alert('Le message doit contenir au moins 10 caractères');
            isValid = false;
        }
        
        if (isValid) {
            console.log('Formulaire envoyé');
            form.reset();
        }
    });
}

// Gestion du focus visible pour l'accessibilité
function handleFirstTab(e) {
    if (e.keyCode === 9) { // touche Tab
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
    }
}

window.addEventListener('keydown', handleFirstTab);

// Configuration du narrateur
const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();
utterance.lang = 'fr-FR';
utterance.rate = 1;
utterance.pitch = 1;

// Fonction pour lire le texte
function speak(text) {
    if (synth.speaking) {
        synth.cancel();
    }
    utterance.text = text;
    synth.speak(utterance);
}

// Gestion de la narration au focus
document.addEventListener('focusin', function(e) {
    let textToRead;
    const element = e.target;

    if (element.hasAttribute('aria-label')) {
        textToRead = element.getAttribute('aria-label');
    } else if (element.tagName === 'A') {
        textToRead = `Lien : ${element.textContent}`;
    } else if (element.tagName === 'BUTTON') {
        textToRead = `Bouton : ${element.textContent}`;
    } else if (element.tagName === 'INPUT') {
        textToRead = `${element.labels[0].textContent}, champ de saisie ${element.type}`;
    } else if (element.tagName === 'TEXTAREA') {
        textToRead = `${element.labels[0].textContent}, zone de texte`;
    } else {
        textToRead = element.textContent;
    }

    speak(textToRead);
});

// Gestion du dépôt de fichier
const fileInput = document.getElementById('cv');
const fileInfo = document.querySelector('.file-info');

if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Vérification du type de fichier
            if (file.type === 'application/pdf') {
                // Vérification de la taille (max 5Mo)
                if (file.size <= 5 * 1024 * 1024) {
                    fileInfo.textContent = `Fichier sélectionné : ${file.name}`;
                    fileInfo.className = 'file-info';
                    speak(`CV sélectionné : ${file.name}`);
                } else {
                    fileInfo.textContent = 'Le fichier est trop volumineux. Maximum 5Mo.';
                    fileInfo.className = 'file-info file-error';
                    speak('Le fichier est trop volumineux. Maximum 5 Méga octets.');
                    fileInput.value = '';
                }
            } else {
                fileInfo.textContent = 'Veuillez sélectionner un fichier PDF.';
                fileInfo.className = 'file-info file-error';
                speak('Format de fichier invalide. Veuillez sélectionner un PDF.');
                fileInput.value = '';
            }
        }
    });
} 