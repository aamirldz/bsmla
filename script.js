// Romantic Features: Floating Hearts & Typewriter

function createFloatingHearts() {
    const container = document.createElement('div');
    container.classList.add('hearts-container');
    document.body.appendChild(container);

    const hearts = ['❤️', '💖', '🌸', '✨', '🦋', '🥰', '🌹'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        // Randomize
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 4; // 4s to 7s
        const size = Math.random() * 20 + 10; // 10px to 30px

        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;

        container.appendChild(heart);

        // Cleanup
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }, 500);
}

function startTypewriter() {
    const titleElement = document.querySelector('h1');
    const fullText = "Across the Ocean, Under the Same Moon, ";
    // Check if highlight span exists or if we need to reconstruct
    // The original HTML structure has a span inside. We'll type the text then fade in the name.

    // Reset content
    const nameSpan = '<span class="highlight">Bsmla</span> 🌸✨';
    titleElement.innerHTML = '<span id="typing-text"></span><span class="typewriter-cursor"></span>';

    const typingSpan = document.getElementById('typing-text');
    let i = 0;

    function type() {
        if (i < fullText.length) {
            typingSpan.textContent += fullText.charAt(i);
            i++;
            setTimeout(type, 80);
        } else {
            // Typing done, remove cursor and append name
            document.querySelector('.typewriter-cursor').remove();
            titleElement.innerHTML += nameSpan;
            // Add a small bounce animation to the name
            const highlight = titleElement.querySelector('.highlight');
            highlight.style.opacity = '0';
            highlight.style.transition = 'opacity 1s, transform 0.5s';
            setTimeout(() => {
                highlight.style.opacity = '1';
                highlight.style.transform = 'scale(1.1)';
                setTimeout(() => highlight.style.transform = 'scale(1)', 300);
            }, 100);
        }
    }

    type();
}

document.getElementById('hug-btn').addEventListener('click', function () {
    const leftImage = document.getElementById('left-image');
    const rightImage = document.getElementById('right-image');
    const centreImage = document.getElementById('centre-image');
    const btn = document.getElementById('hug-btn');

    // Disable button to prevent spamming
    btn.disabled = true;
    btn.textContent = "Sending love... ❤️";

    // 1. Move images towards center
    leftImage.style.left = '40%';
    leftImage.style.opacity = '0';

    rightImage.style.right = '40%';
    rightImage.style.opacity = '0';

    // 2. Show center image (hug)
    setTimeout(() => {
        leftImage.classList.add('hidden');
        rightImage.classList.add('hidden');

        centreImage.classList.remove('hidden');
        centreImage.style.opacity = '1';
        centreImage.style.transform = 'scale(1.2) rotate(10deg)'; // Little pop effect
    }, 800);

    // 3. Reset everything
    setTimeout(() => {
        centreImage.style.opacity = '0';
        centreImage.style.transform = 'scale(1)';
        centreImage.classList.add('hidden');

        leftImage.classList.remove('hidden');
        rightImage.classList.remove('hidden');

        // Use timeout to allow 'hidden' class removal to take effect before animating opacity
        setTimeout(() => {
            leftImage.style.left = '20%';
            leftImage.style.opacity = '1';

            rightImage.style.right = '20%';
            rightImage.style.opacity = '1';

            btn.disabled = false;
            btn.textContent = "Send a Virtual Hug 🤗";
        }, 100);

    }, 3500);
});

// Countdown Timer System
let countdownInterval;

function startCountdown() {
    clearInterval(countdownInterval);

    // Get stored values or defaults
    const storedDate = localStorage.getItem('countdownDate');
    const storedName = localStorage.getItem('specialDayName');

    const countdownTarget = storedDate ? new Date(storedDate).getTime() : new Date('2026-12-31').getTime();
    const specialDayName = storedName || 'Special Day';

    // Update UI text
    document.getElementById('special-day-name').textContent = specialDayName;
    document.getElementById('countdown-date').textContent = new Date(countdownTarget).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Run timer loop
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownTarget - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Pad with zeros
        document.getElementById('days').textContent = days < 10 ? `0${days}` : days;
        document.getElementById('hours').textContent = hours < 10 ? `0${hours}` : hours;
        document.getElementById('minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
        document.getElementById('seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;

        // If finished
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-grid').innerHTML = '<h3>The day has arrived! 🎉</h3>';
            document.getElementById('days').textContent = "00";
        }
    }, 1000);
}

// Edit Mode Functions
function editCountdownDate() {
    const editPanel = document.getElementById('edit-date-section');
    editPanel.classList.toggle('hidden');

    // Pre-fill inputs
    document.getElementById('new-special-day-name').value = document.getElementById('special-day-name').textContent;

    // Format date for setting the input value safely
    const existingDate = new Date(localStorage.getItem('countdownDate') || '2026-12-31');
    // .toISOString() gives YYYY-MM-DDTHH... split to just get the date part
    document.getElementById('new-countdown-date').value = existingDate.toISOString().split('T')[0];
}

function saveCountdownDate() {
    const newName = document.getElementById('new-special-day-name').value;
    const newDate = document.getElementById('new-countdown-date').value;

    if (!newDate) {
        alert('Please select a valid date.');
        return;
    }

    localStorage.setItem('specialDayName', newName);
    localStorage.setItem('countdownDate', newDate);

    document.getElementById('edit-date-section').classList.add('hidden');
    startCountdown();
}

// Image Upload Logic
function triggerUpload(person) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleImageUpload(e, person);
    input.click();
}

function handleImageUpload(event, person) {
    const file = event.target.files[0];
    if (file) {
        // Limit file size to 500KB to prevent localStorage quota errors
        if (file.size > 500 * 1024) {
            alert("File is too large! Please select an image under 500KB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            try {
                localStorage.setItem(`img_${person}`, imageData);
                displayImage(person, imageData);
            } catch (err) {
                alert("Storage full! Unable to save image.");
                console.error("LocalStorage error:", err);
            }
        };
        reader.readAsDataURL(file);
    }
}

function displayImage(person, data) {
    const imgElement = document.getElementById(`img-${person}`);
    if (imgElement) {
        imgElement.src = data;
    }
}

function loadSavedImages() {
    ['aamir', 'place', 'bsmla'].forEach(person => {
        const saved = localStorage.getItem(`img_${person}`);
        if (saved) {
            displayImage(person, saved);
        }
    });
}

// Love Notes System
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

const butterfly = document.getElementById('butterfly');
const loveText = document.getElementById('love-text');
let sentenceIndex = 0;

butterfly.addEventListener('click', () => {
    // Reset animation
    loveText.classList.remove('visible');
    loveText.style.opacity = '0'; // immediate hide

    // Add fly away animation
    butterfly.style.transform = 'translateY(-20px) rotate(10deg)';

    setTimeout(() => {
        loveText.textContent = loveSentences[sentenceIndex];
        loveText.style.opacity = ''; // clear inline style to let class handle it
        loveText.classList.add('visible'); // Trigger CSS animation

        butterfly.style.transform = 'translateY(0) rotate(0deg)';

        sentenceIndex = (sentenceIndex + 1) % loveSentences.length;
    }, 400);
});


// Side Window Interaction
function changeImage(side) {
    const img = document.getElementById(`${side}-window`);
    const originalSrc = `${side}-window.jpg`;
    const kissSrc = `${side}-kiss.jpg`;

    // Swap source with fade effect (CSS transition handles opacity if we toggled class, 
    // but here we just swap src. To make it smoother we could fade out first)
    img.style.opacity = '0.5';

    setTimeout(() => {
        img.src = kissSrc;
        img.style.opacity = '1';
    }, 200);

    setTimeout(() => {
        img.style.opacity = '0.5';
        setTimeout(() => {
            img.src = originalSrc;
            img.style.opacity = '1';
        }, 200);
    }, 3000);
}


// Music Player Logic
const playBtn = document.getElementById('play-pause-btn');
const audio = document.getElementById('bg-music');
const musicStatus = document.querySelector('.music-status');
let isPlaying = false;

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
        musicStatus.textContent = 'Paused';
    } else {
        // Attempt to play - might fail if no source, but UI will update
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Play started
            }).catch(error => {
                console.log("Audio play failed (expected if source missing):", error);
                // We'll still update UI to simulate it for the user
            });
        }

        playBtn.textContent = '⏸';
        playBtn.classList.add('playing');
        musicStatus.textContent = 'Playing... 🎶';
    }
    isPlaying = !isPlaying;
});

// Reset Functionality
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all customization?")) {
        localStorage.clear();
        location.reload();
    }
});


// Initialization
window.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    loadSavedImages();
    createFloatingHearts();
    startTypewriter();
});
