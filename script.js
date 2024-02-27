const textArray = ["Welcome to my website!", "I am Dark-_-", "Big hacker man and that", "Find my social links above"];
let textIndex = 0;
let charIndex = 0;
const typedTextElement = document.getElementById("typed-text");
const waterEffect = document.getElementById("water-effect");
const audio = document.getElementById("background-music");
let audioContext;
let analyser;
let dataArray;

function type() {
    if (charIndex < textArray[textIndex].length) {
        typedTextElement.innerHTML += textArray[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 50);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextElement.innerHTML = textArray[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        textIndex = (textIndex + 1) % textArray.length;
        setTimeout(type, 500);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Display splash screen
    const splashScreen = document.getElementById("splash-screen");
    const mainContent = document.getElementById("main-content");

    document.addEventListener("click", function() {
        splashScreen.style.display = "none";
        mainContent.style.display = "block";

        // Initiate Web Audio API after a user gesture
        initAudio();

        // Start the typewriter effect
        setTimeout(type, 1000);
    });
});

function initAudio() {
    // Check if AudioContext is supported
    if (typeof window.AudioContext !== "undefined") {
        // Ensure AudioContext is created only once
        if (!audioContext) {
            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audio);

            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            dataArray = new Uint8Array(analyser.frequencyBinCount);

            // Start the audio context
            audioContext.resume().then(() => {
                audio.play();
                updateWaterEffect();
            });
        } else {
            console.warn("AudioContext already created.");
        }
    } else {
        console.error("Web Audio API is not supported in this browser.");
    }
}

function updateWaterEffect() {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const scale = 1 + average / 100;
    const opacity = 0.3 + (average / 255) * 0.7;

    waterEffect.style.transform = `scale(${scale})`;
    waterEffect.style.opacity = opacity;
    requestAnimationFrame(updateWaterEffect);
}
