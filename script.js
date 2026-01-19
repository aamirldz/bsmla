// ========== CUSTOM TOAST NOTIFICATION SYSTEM ==========
function showToast(message, type = 'info', duration = 3500) {
    // Create container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // Icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: '💡',
        love: '💕'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 400);
    }, duration);

    return toast;
}

// Custom confirmation dialog
function showConfirmDialog(message, onConfirm, onCancel) {
    // Remove any existing dialog
    const existingDialog = document.getElementById('confirm-dialog-overlay');
    if (existingDialog) existingDialog.remove();

    const overlay = document.createElement('div');
    overlay.id = 'confirm-dialog-overlay';
    overlay.className = 'confirm-overlay';

    overlay.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-icon">💭</div>
            <div class="confirm-message">${message}</div>
            <div class="confirm-buttons">
                <button class="confirm-btn confirm-cancel">Cancel</button>
                <button class="confirm-btn confirm-ok">Confirm</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
        overlay.classList.add('confirm-show');
    });

    // Button handlers
    overlay.querySelector('.confirm-ok').addEventListener('click', () => {
        overlay.classList.remove('confirm-show');
        setTimeout(() => overlay.remove(), 300);
        if (onConfirm) onConfirm();
    });

    overlay.querySelector('.confirm-cancel').addEventListener('click', () => {
        overlay.classList.remove('confirm-show');
        setTimeout(() => overlay.remove(), 300);
        if (onCancel) onCancel();
    });

    // Click outside to cancel
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('confirm-show');
            setTimeout(() => overlay.remove(), 300);
            if (onCancel) onCancel();
        }
    });
}

// ========== THEME SWITCHER SYSTEM ==========
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeOpts = document.querySelectorAll('.theme-opt');
    const savedTheme = localStorage.getItem('romanticTheme') || 'moonlight';

    // Apply saved theme
    document.body.className = `theme-${savedTheme}`;
    updateActiveThemeOpt(savedTheme);

    themeOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.dataset.theme;
            document.body.className = `theme-${theme}`;
            localStorage.setItem('romanticTheme', theme);
            updateActiveThemeOpt(theme);

            // Animation feedback
            opt.style.transform = 'scale(1.5)';
            setTimeout(() => opt.style.transform = '', 300);

            // Show toast for theme change
            const themeNames = { moonlight: '🌙 Moonlight', sunset: '🌅 Sunset', cherry: '🌸 Cherry Blossom' };
            showToast(`Theme changed to ${themeNames[theme]}`, 'success', 2000);
        });
    });

    function updateActiveThemeOpt(theme) {
        themeOpts.forEach(o => o.classList.toggle('active', o.dataset.theme === theme));
        const icon = themeToggle.querySelector('.icon');
        if (theme === 'moonlight') icon.textContent = '🌙';
        else if (theme === 'sunset') icon.textContent = '🌅';
        else if (theme === 'cherry') icon.textContent = '🌸';
    }
}

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

    // 1. Move images towards center (slower, smoother animation)
    leftImage.style.transition = 'all 2s ease-in-out';
    rightImage.style.transition = 'all 2s ease-in-out';
    leftImage.style.left = '42%';
    leftImage.style.opacity = '0';

    rightImage.style.right = '42%';
    rightImage.style.opacity = '0';

    // 2. Show center image (hug) - after 2000ms
    setTimeout(() => {
        leftImage.classList.add('hidden');
        rightImage.classList.add('hidden');

        centreImage.classList.remove('hidden');
        centreImage.style.transition = 'all 0.8s ease-out';
        centreImage.style.opacity = '1';
        centreImage.style.transform = 'scale(1.3) rotate(5deg)'; // Pop effect
    }, 2000);

    // 3. Reset everything - after 7000ms total (longer hug display)
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
        }, 200);

    }, 7000);
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
        showToast('Please select a valid date.', 'warning');
        return;
    }

    localStorage.setItem('specialDayName', newName);
    localStorage.setItem('countdownDate', newDate);

    document.getElementById('edit-date-section').classList.add('hidden');
    startCountdown();
    showToast('Countdown date saved! ✨', 'success', 2500);
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
            showToast('File is too large! Please select an image under 500KB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            try {
                localStorage.setItem(`img_${person}`, imageData);
                displayImage(person, imageData);
                showToast('Photo updated! 📸', 'success', 2000);
            } catch (err) {
                showToast('Storage full! Unable to save image.', 'error');
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



// ========== MILESTONES TIMELINE SYSTEM ==========
let editingMilestoneIndex = -1;

const defaultMilestones = [
    {
        title: "The Beginning",
        desc: "The day we first connected and felt the spark 💫",
        date: "2023-11-20"
    },
    {
        title: "First Conversation",
        desc: "When we talked for hours and realized we are meant to be ✨",
        date: "2023-11-21"
    },
    {
        title: "Future Dream",
        desc: "The beautiful dream of meeting in Dubai 🌍💕",
        date: "2026-06-15"
    }
];

function getMilestones() {
    const saved = localStorage.getItem('loveMilestones');
    return saved ? JSON.parse(saved) : defaultMilestones;
}

function saveMilestones(milestones) {
    localStorage.setItem('loveMilestones', JSON.stringify(milestones));
}

function toggleMilestoneForm(index = -1) {
    const container = document.getElementById('milestone-form-container');
    const titleInput = document.getElementById('milestone-title-input');
    const descInput = document.getElementById('milestone-desc-input');
    const dateInput = document.getElementById('milestone-date-input');
    const formTitle = document.getElementById('form-title');
    const saveBtn = document.getElementById('save-milestone-btn');

    if (index >= 0) {
        // Edit mode
        const milestones = getMilestones();
        const m = milestones[index];
        titleInput.value = m.title;
        descInput.value = m.desc || "";
        dateInput.value = m.date;
        formTitle.textContent = "Edit This Memory";
        saveBtn.textContent = "Update Memory";
        editingMilestoneIndex = index;
        container.classList.remove('hidden');
    } else if (container.classList.contains('hidden')) {
        // Add mode
        titleInput.value = "";
        descInput.value = "";
        dateInput.value = new Date().toISOString().split('T')[0];
        formTitle.textContent = "Add a New Memory";
        saveBtn.textContent = "Save Memory";
        editingMilestoneIndex = -1;
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}

function saveMilestone() {
    const title = document.getElementById('milestone-title-input').value.trim();
    const desc = document.getElementById('milestone-desc-input').value.trim();
    const date = document.getElementById('milestone-date-input').value;

    if (!title || !date) {
        showToast('Please provide at least a title and a date! 💕', 'warning');
        return;
    }

    const milestones = getMilestones();
    const newMilestone = { title, desc, date };

    if (editingMilestoneIndex >= 0) {
        milestones[editingMilestoneIndex] = newMilestone;
    } else {
        milestones.push(newMilestone);
    }

    // Sort milestones by date
    milestones.sort((a, b) => new Date(a.date) - new Date(b.date));

    saveMilestones(milestones);
    toggleMilestoneForm();
    displayMilestones();
    showToast(editingMilestoneIndex >= 0 ? 'Memory updated! 💕' : 'New memory added! 💖', 'love', 2500);
}

function deleteMilestone(index) {
    showConfirmDialog("Are you sure you want to delete this memory? 🥺", () => {
        const milestones = getMilestones();
        milestones.splice(index, 1);
        saveMilestones(milestones);
        displayMilestones();
        showToast('Memory deleted', 'info', 2000);
    });
}

function displayMilestones() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    const milestones = getMilestones();

    timeline.innerHTML = milestones.map((m, index) => {
        const dateObj = new Date(m.date);
        const formattedDate = dateObj.toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        return `
            <div class="milestone reveal">
                <div class="milestone-dot"></div>
                <div class="milestone-content">
                    <div class="milestone-actions">
                        <button class="action-btn edit" onclick="toggleMilestoneForm(${index})" title="Edit">✎</button>
                        <button class="action-btn delete" onclick="deleteMilestone(${index})" title="Delete">×</button>
                    </div>
                    <div class="milestone-date">${formattedDate}</div>
                    <div class="milestone-title">${m.title}</div>
                    <div class="milestone-desc">${m.desc || ""}</div>
                </div>
            </div>
        `;
    }).join('');
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


// ========== SIDE WINDOW KISS INTERACTION ==========
let windowsAnimating = false;

function changeImage(side) {
    // Prevent multiple simultaneous animations
    if (windowsAnimating) return;

    const leftImg = document.getElementById('left-window');
    const rightImg = document.getElementById('right-window');

    if (!leftImg || !rightImg) return;

    windowsAnimating = true;

    // Visual feedback for click - both windows glow
    leftImg.style.transform = 'scale(1.1)';
    leftImg.style.opacity = '0.7';
    rightImg.style.transform = 'scale(1.1)';
    rightImg.style.opacity = '0.7';

    // Change both to kiss images
    setTimeout(() => {
        leftImg.src = 'left-kiss.jpg';
        rightImg.src = 'right-kiss.jpg';

        leftImg.style.opacity = '1';
        rightImg.style.opacity = '1';
        leftImg.style.filter = 'drop-shadow(0 0 25px rgba(255, 77, 109, 0.6))';
        rightImg.style.filter = 'drop-shadow(0 0 25px rgba(255, 77, 109, 0.6))';
        leftImg.style.transform = 'scale(1.05)';
        rightImg.style.transform = 'scale(1.05)';

        showToast('💕 Love sent across the distance! 💕', 'love');
    }, 300);

    // Reset both after 3 seconds
    setTimeout(() => {
        leftImg.style.opacity = '0.7';
        rightImg.style.opacity = '0.7';
        leftImg.style.transform = 'scale(1)';
        rightImg.style.transform = 'scale(1)';

        setTimeout(() => {
            leftImg.src = 'left-window.jpg';
            rightImg.src = 'right-window.jpg';
            leftImg.style.opacity = '1';
            rightImg.style.opacity = '1';
            leftImg.style.filter = '';
            rightImg.style.filter = '';
            windowsAnimating = false;
        }, 300);
    }, 3500);
}


// Music Player Logic with Song Upload
const playBtn = document.getElementById('play-pause-btn');
const audio = document.getElementById('bg-music');
const musicStatus = document.querySelector('.music-status');
const musicTitle = document.querySelector('.music-title');
const musicPlayer = document.getElementById('music-player');
let isPlaying = false;

// IndexedDB Helper Functions
const dbName = 'BsmlaDB';
const storeName = 'mediaStore';

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onerror = (e) => reject("DB Error");
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
    });
}

async function saveSongToDB(blob, name) {
    try {
        const db = await initDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put(blob, 'userSong');
        store.put(name, 'userSongName');
        return true;
    } catch (e) {
        console.error("Save failed:", e);
        return false;
    }
}

async function getSongFromDB() {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.get('userSong');
            const nameRequest = store.get('userSongName');

            request.onsuccess = () => {
                nameRequest.onsuccess = () => {
                    resolve({
                        blob: request.result,
                        name: nameRequest.result
                    });
                };
            };
            request.onerror = () => reject();
        });
    } catch (e) {
        return null;
    }
}

// Load saved song on startup
async function loadSavedSong() {
    const data = await getSongFromDB();
    if (data && data.blob) {
        const url = URL.createObjectURL(data.blob);
        audio.src = url;
        if (data.name) {
            musicTitle.textContent = data.name;
        }
        musicPlayer.classList.add('has-song');
    }
}

// Trigger song upload
function uploadSong() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => handleSongUpload(e);
    input.click();
}

// Handle song upload
async function handleSongUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Limit increased to 200MB since we use IndexedDB now
        if (file.size > 200 * 1024 * 1024) {
            showToast('File too large (>200MB). Please choose a smaller file.', 'error');
            return;
        }

        showToast('Saving song... please wait ⏳', 'info');

        const success = await saveSongToDB(file, file.name.replace(/\.[^/.]+$/, ""));

        if (success) {
            const url = URL.createObjectURL(file);
            audio.src = url;
            musicTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
            musicPlayer.classList.add('has-song');
            showToast('Song added successfully! 🎵', 'success');
        } else {
            showToast('Failed to save song. Please try again.', 'error');
        }
    }
}

// Add click handler to music title for uploading
if (musicTitle) {
    musicTitle.addEventListener('click', uploadSong);
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
        musicPlayer.classList.remove('playing');
        musicStatus.textContent = 'Paused';
    } else {
        // Check if there's a song source
        if (!audio.src || audio.src === window.location.href) {
            showToast('Click on "Our Song" to add your music! 🎵', 'info');
            return;
        }

        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                musicStatus.textContent = 'Playing... 🎶';
                playBtn.textContent = '⏸';
                playBtn.classList.add('playing');
                musicPlayer.classList.add('playing');
            }).catch(error => {
                console.log("Audio play failed:", error);
                showToast('Unable to play. Try adding a song first.', 'warning');
                return;
            });
        }
    }
    isPlaying = !isPlaying;
});

// Update playing state if audio ends
audio.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.textContent = '▶';
    playBtn.classList.remove('playing');
    musicPlayer.classList.remove('playing');
    musicStatus.textContent = 'Finished';
});

// Load saved song on page load
loadSavedSong();

// Reset Functionality - Complete Reset
document.getElementById('reset-btn').addEventListener('click', () => {
    showConfirmDialog("Clear all customization?<br><small>• Photos • Milestones • Countdown • Theme</small>", () => {
        // Clear all localStorage data
        localStorage.clear();

        // Reset images to default before reload
        const imgAamir = document.getElementById('img-aamir');
        const imgPlace = document.getElementById('img-place');
        const imgBsmla = document.getElementById('img-bsmla');
        const leftWindow = document.getElementById('left-window');
        const rightWindow = document.getElementById('right-window');
        const leftImage = document.getElementById('left-image');
        const rightImage = document.getElementById('right-image');

        if (imgAamir) imgAamir.src = 'left-image.png';
        if (imgPlace) imgPlace.src = 'default-place.jpg';
        if (imgBsmla) imgBsmla.src = 'right-image.png';
        if (leftWindow) leftWindow.src = 'left-window.jpg';
        if (rightWindow) rightWindow.src = 'right-window.jpg';
        if (leftImage) leftImage.src = 'left-image.png';
        if (rightImage) rightImage.src = 'right-image.png';

        // Reset milestones display
        const timeline = document.getElementById('timeline');
        if (timeline) {
            timeline.innerHTML = '';
        }

        // Reset theme
        document.body.className = 'theme-moonlight';

        showToast('Experience reset! Reloading...', 'success', 1500);

        // Small delay to show reset visually, then reload
        setTimeout(() => {
            location.reload();
        }, 1000);
    });
});


// Initialization
window.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    startCountdown();
    loadSavedImages();
    createFloatingHearts();
    startTypewriter();
    displayMilestones();
});
