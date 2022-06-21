const playPause = document.querySelector('.play-btn');
const play = document.querySelector('.play-pause');
const video = document.querySelector('video');
const preview = document.querySelector('.preview');
const fullscreen = document.querySelector('.full');
const miniPlayer = document.querySelector('.pip');
const mute = document.querySelector('.mute-btn');
const volSlider = document.querySelector('.volume_controls input[type="range"]');
const currentTime = document.querySelector('.current_time')
const captionsBtn = document.querySelector('.captions');

document.addEventListener('keydown', e => {
    const tagName = document.activeElement.tagName.toLowerCase();

    if (tagName === 'input') return

    switch(e.key.toLowerCase()) { 
        case ' ':
            if (tagName === 'button') return
        case 'k':    
            togglePlay();
            break;
        case 'f':    
            toggleFullscreen();
            break;  
        case 'i':    
            togglePIP();
            break;
        case 'm':    
            toggleMute();
            break;
        case 'j':
            skip(-5);
            break;
        case 'l':
            skip(5);
            break; 
        case 'c':
            toggleCaptions();
            break; 
    }
}) 

document.addEventListener('keydown', e => {
    if (e.key == 'ArrowLeft' ) {
        skip(-5);
    } else if (e.key == 'ArrowRight') {
        skip(5);  
    }
})

//Play/Pause
playPause.addEventListener('click', togglePlay )
play.addEventListener('click', togglePlay )
video.addEventListener('click', togglePlay )

function togglePlay() {
    video.paused ? video.play() : video.pause();
}

video.addEventListener('play', () => {
    preview.classList.remove('paused');
} )

video.addEventListener('pause', () => {
    preview.classList.add('paused');
} )

//Fullscreen
fullscreen.addEventListener('click', toggleFullscreen )

function toggleFullscreen() {
    if (document.fullscreenElement == null) {
        preview.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
} 

document.addEventListener('fullscreenchange', () => {
    preview.classList.toggle('fullscreen', document.fullscreenElement);
})

//PIP mode 
miniPlayer.addEventListener('click', togglePIP )

function togglePIP() {
    if (preview.classList.contains('mini')) {
        document.exitPictureInPicture();
    } else {
        video.requestPictureInPicture();
    }
}

video.addEventListener('enterpictureinpicture', () => {
    preview.classList.add('mini');
})

video.addEventListener('leavepictureinpicture', () => {
    preview.classList.remove('mini');
})

//Mute/Unmute
mute.addEventListener('click', toggleMute)

volSlider.addEventListener('input', (e) => {
    video.volume = e.target.value
    video.muted = e.target.value === 0
    //handle input change
    const min = e.target.min
    const max = e.target.max
    const val = e.target.value
    
    e.target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
})

function toggleMute() {
    video.muted = !video.muted
    preview.classList.toggle('mute')
}

video.addEventListener('volumechange', () => {
    volSlider.value = video.volume
    if (video.muted || video.volume === 0) {
        volSlider.value = 0
        preview.classList.add('mute')
    } else {
        preview.classList.remove('mute')
    }
    video.volume
    video.muted
})

//Current time
video.addEventListener('loadeddata', () => {
    currentTime.textContent = `-${formatDuration(video.duration)}`
})

video.addEventListener('timeupdate', () => {
    const totalTime = video.duration
    currentTime.textContent = `-${formatDuration(totalTime - video.currentTime)}`
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
})

function formatDuration(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
        return `${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${leadingZeroFormatter.format(hours)}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`   
    }
}

function skip(duration) {
    video.currentTime += duration
}

//Captions On/Off
const captions = video.textTracks[0]
captions.mode = 'hidden'

captionsBtn.addEventListener('click', toggleCaptions)

function toggleCaptions() {
    const isHidden = captions.mode === 'hidden'
    captions.mode = isHidden ? "showing" : "hidden"
    preview.classList.toggle('captions', isHidden)
}