const playPause = document.querySelector('.play-btn');
const play = document.querySelector('.play-pause');
const video = document.querySelector('video');
const preview = document.querySelector('.preview');
const fullscreen = document.querySelector('.full');
const miniPlayer = document.querySelector('.pip');

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