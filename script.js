// --- INDEXED DB FOR IMAGE STORAGE ---
let db;

const request = indexedDB.open("LovePageDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore("images");
};

request.onsuccess = function (event) {
    db = event.target.result;
    loadImages();
};

request.onerror = function () {
    console.error("IndexedDB failed");
};


// --- GLOBAL VARIABLES ---

let countdownInterval;

let isKissAnimationRunning = false;

let currentSentenceIndex = 0;

const butterfly = document.getElementById('butterfly');

const loveText = document.getElementById('love-text');



// --- VIRTUAL HUG ---

function triggerHugAnimation() {

    const leftImage = document.getElementById('left-image');

    const rightImage = document.getElementById('right-image');

    const centreImage = document.getElementById('centre-image');



    // Check screen width, don't run animation on small screens

    if (window.innerWidth <= 480) {

        return;

    }



    // UPDATED: Animate based on percentage, not fixed pixels

    leftImage.style.transform = 'translateX(100%) scale(0.8)';

    rightImage.style.transform = 'translateX(-100%) scale(0.8)';

    leftImage.style.opacity = '0';

    rightImage.style.opacity = '0';

    

    centreImage.style.opacity = '1'; // Show center

    centreImage.style.transform = 'translateX(-50%) scale(1)';





    setTimeout(function() {

        // Reset to original positions

        leftImage.style.transform = 'translateX(0) scale(1)';

        rightImage.style.transform = 'translateX(0) scale(1)';

        leftImage.style.opacity = '1';

        rightImage.style.opacity = '1';

        

        centreImage.style.opacity = '0';

        centreImage.style.transform = 'translateX(-50%) scale(0.8)';

    }, 3500);

}



// --- COUNTDOWN TIMER ---

function updateCountdownDisplay(countdownDate) {

    const now = new Date().getTime();

    const distance = countdownDate - now;



    if (distance < 0) {

        clearInterval(countdownInterval);

        document.getElementById('countdown-date').textContent = "The day has arrived!";

        document.getElementById('days').textContent = '00';

        document.getElementById('hours').textContent = '00';

        document.getElementById('minutes').textContent = '00';

        document.getElementById('seconds').textContent = '00';

        return;

    }



    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    const seconds = Math.floor((distance % (1000 * 60)) / 1000);



    document.getElementById('days').textContent = days < 10 ? `0${days}` : days;

    document.getElementById('hours').textContent = hours < 10 ? `0${hours}` : hours;

    document.getElementById('minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;

    document.getElementById('seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;

}



function startCountdown() {

    clearInterval(countdownInterval);



    const countdownDateStr = localStorage.getItem('countdownDate') || 'December 31, 2024';

    const countdownDate = new Date(countdownDateStr).getTime();

    const specialDayName = localStorage.getItem('specialDayName') || 'Special Day';



    document.getElementById('special-day-name').textContent = specialDayName;

    document.getElementById('countdown-date').textContent = new Date(countdownDate).toLocaleDateString();



    updateCountdownDisplay(countdownDate); 

    countdownInterval = setInterval(() => updateCountdownDisplay(countdownDate), 1000);

}



function editCountdownDate() {

    const currentDayName = localStorage.getItem('specialDayName') || 'Special Day';

    const currentDate = localStorage.getItem('countdownDate') || '2024-12-31';



    const dateObj = new Date(currentDate);

    // Handle potential invalid date in storage

    const formattedDate = !isNaN(dateObj) ? dateObj.toISOString().split('T')[0] : '2024-12-31';



    document.getElementById('new-special-day-name').value = currentDayName;

    document.getElementById('new-countdown-date').value = formattedDate;

    

    document.getElementById('edit-date-section').style.display = 'block';

}



function saveCountdownDate() {

    const newSpecialDayName = document.getElementById('new-special-day-name').value;

    const newCountdownDate = document.getElementById('new-countdown-date').value;



    // Check 1: Is the new date field empty? If so, just close.

    if (!newCountdownDate) {

        document.getElementById('edit-date-section').style.display = 'none';

        return;

    }



    // Check 2: Is the date a valid, parseable date?

    if (Date.parse(newCountdownDate)) {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(newCountdownDate);

        selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset()); // Fix timezone bug



        // Check 3: Is the date in the future?

        if (selectedDate >= today) {

            try {

                localStorage.setItem('specialDayName', newSpecialDayName || 'Special Day');

                localStorage.setItem('countdownDate', newCountdownDate);

                startCountdown(); // Refresh countdown with new date

            } catch (error) {

                console.error('Error saving countdown data:', error);

            }

        }

    }

    

    // Always hide the edit box, whether we saved or not

    document.getElementById('edit-date-section').style.display = 'none';

}



// --- IMAGE UPLOAD ---

function triggerUpload(circle) {

    const input = document.createElement('input');

    input.type = 'file';

    input.accept = 'image/*';

    input.onchange = (event) => handleImageUpload(event, circle);

    input.click();

}



function handleImageUpload(event, circle) {
    const file = event.target.files[0];
    if (!file) return;

    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");

    store.put(file, circle);

    tx.oncomplete = () => {
        const imgURL = URL.createObjectURL(file);
        displayImage(circle, imgURL);
    };
}




function displayImage(circle, imageData) {

    const element = document.querySelector(`[data-circle="${circle}"]`);

    if (!element) return;



    let imgElement;

    let textElement;



    if (element.tagName === 'IMG') {

        imgElement = element;

    } else {

        imgElement = element.querySelector('img');

        textElement = element.querySelector('span');

    }



    if (imgElement) {

        imgElement.src = imageData;

    }

    if (textElement) {

        textElement.style.display = 'none';

    }

}



function loadImages() {
    if (!db) return;

    const tx = db.transaction("images", "readonly");
    const store = tx.objectStore("images");

    const circles = [
        'aamir','place','bsmla',
        'left-window','right-window',
        'left-hug','centre-hug','right-hug'
    ];

    circles.forEach(circle => {
        const req = store.get(circle);
        req.onsuccess = () => {
            if (req.result) {
                const imgURL = URL.createObjectURL(req.result);
                displayImage(circle, imgURL);
            }
        };
    });
}




// --- BUTTERFLY TEXT ---

const loveSentences = [

   "Every moment with you is a treasure. 💖",

   "You are the light of my life. ✨",

   "My heart beats for you, forever. 💕",

   "You complete me in every way. 🧩",

   "I can't wait to meet you. 🌍",

   "Our love knows no distance. 🌙",

   "Together, we make magic. ✨",

   "You’re not just in my thoughts; you’re in every beat of my heart. 💓",

   "Every night, I look at the moon, knowing you might be seeing the same one. 🌙",

   "The distance between us only makes my love for you grow stronger. 🌍💕",

   "You’re the missing piece in my life, and I can’t wait to feel complete. 🧩❤️",

   "Every time we talk, it feels like the world disappears, and it’s just us. 🌟",

   "I catch myself smiling every time I think about you... which is all the time. 😊💖",

   "The thought of meeting you in Dubai keeps me going every day. 🕌💕",

   "If love were a journey, I’d travel across galaxies just to hold your hand. 🚀💫",

   "I don’t need the stars when I already have you lighting up my life. ✨",

   "Your voice is my favorite melody, and I can’t wait to hear it in person. 🎶💞",

   "You’re my favorite notification, my sweetest distraction. 📱💌",

   "I may be in Nepal, and you in Algeria, but my heart is wherever you are. 🌏❤️",

   "Every good morning and goodnight from you feels like a gentle hug. 🤗💖",

   "I dream of the day I can see your smile for real and hold your hand. 🌈💕",

   "Your kindness, your laughter, your love—it’s all I need to be happy. 🌹💘",

   "You make me believe that even across oceans, love knows no limits. 🌊💞",

   "One day, our 'goodnights' will turn into 'good mornings' side by side. 🌄💑",

   "I don’t just miss you; I miss the future we’ll create together. 🛤️❤️",

   "They say patience is a virtue, but waiting for you is the sweetest test of all. ⏳💕",

   "If I could, I’d bottle up every moment we’ve shared and keep it close forever. 🫶💝"

];



function changeLoveSentence() {

    loveText.style.opacity = 0;

    setTimeout(() => {

        loveText.textContent = loveSentences[currentSentenceIndex];

        loveText.style.opacity = 1;

        currentSentenceIndex = (currentSentenceIndex + 1) % loveSentences.length;

    }, 1000);

}



// --- WINDOW KISS ANIMATION ---

function triggerKissAnimation() {

    if (isKissAnimationRunning) return;

    isKissAnimationRunning = true;



    const leftWindow = document.getElementById('left-window');

    const rightWindow = document.getElementById('right-window');



    const originalLeftSrc = localStorage.getItem('left-window') || 'left-window.jpg';

    const originalRightSrc = localStorage.getItem('right-window') || 'right-window.jpg';



    leftWindow.src = 'left-kiss.jpg'; 



    setTimeout(() => {

        rightWindow.src = 'right-kiss.jpg'; 

    }, 2000);



    setTimeout(() => {

        leftWindow.src = originalLeftSrc;

        rightWindow.src = originalRightSrc;

        isKissAnimationRunning = false;

    }, 8000);

}



// --- CLICK VS. DOUBLE-CLICK ---

function setupWindowClickEvents(dataCircle) {

    const windowElement = document.querySelector(`[data-circle="${dataCircle}"]`);

    let clickTimer = null;



    windowElement.addEventListener('click', () => {

        clickTimer = setTimeout(() => {

            if (!isKissAnimationRunning) {

                 triggerKissAnimation();

            }

        }, 250);

    });



    windowElement.addEventListener('dblclick', (e) => {

        e.preventDefault();

        clearTimeout(clickTimer);

        triggerUpload(dataCircle);

    });

}



// --- INITIALIZE ON PAGE LOAD ---

window.onload = function() {

    // Load data from storage

    loadImages();

    startCountdown();



    // Set up all event listeners

    document.getElementById('hug-btn').addEventListener('click', triggerHugAnimation);

    document.getElementById('edit-countdown-trigger').addEventListener('click', editCountdownDate);

    document.getElementById('save-countdown-btn').addEventListener('click', saveCountdownDate);

    butterfly.addEventListener('click', changeLoveSentence);



    // Click listeners for simple image uploads

    document.querySelector('[data-circle="aamir"]').addEventListener('click', () => triggerUpload('aamir'));

    document.querySelector('[data-circle="bsmla"]').addEventListener('click', () => triggerUpload('bsmla'));

    document.querySelector('[data-circle="place"]').addEventListener('click', () => triggerUpload('place'));

    document.querySelector('[data-circle="left-hug"]').addEventListener('click', () => triggerUpload('left-hug'));

    document.querySelector('[data-circle="centre-hug"]').addEventListener('click', () => triggerUpload('centre-hug'));

    document.querySelector('[data-circle="right-hug"]').addEventListener('click', () => triggerUpload('right-hug'));



    // Click/Double-click listeners for windows

    setupWindowClickEvents('left-window');

    setupWindowClickEvents('right-window');

};
