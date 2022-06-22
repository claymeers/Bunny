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
const speed = document.querySelector('.speed')
const progress = document.querySelector('.progress')
const previewImg = document.querySelector('.preview-img');
const times = document.querySelector('.previewImg .time')

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
    const percent = video.currentTime / video.duration
    progress.style.setProperty('--progress-position', percent)
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

//Speed
speed.addEventListener('click', changePlaybackSpeed)

function changePlaybackSpeed() {
    let newPlaybackSpeed = video.playbackRate + .25
    if (newPlaybackSpeed > 2) newPlaybackSpeed = .25
    video.playbackRate = newPlaybackSpeed
    speed.textContent = `${newPlaybackSpeed}x`
}

//Timeline
progress.addEventListener('mousemove', handleTimelineUpdate)
progress.addEventListener('mousedown', toggleScrubbing)
document.addEventListener('mouseup', e => {
    if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener('mousemove', e => {
    if (isScrubbing) handleTimelineUpdate(e)
})
let isScrubbing = false;
let wasPaused
function toggleScrubbing(e) {
    const rect = progress.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing= (e.buttons & 1) === 1
    preview.classList.toggle('scrubbing', isScrubbing)
    if (isScrubbing) {
        wasPaused = video.paused
        // video.pause()
    } else {
        video.currentTime = percent * video.duration
        // if (!wasPaused) video.play()
    }

    handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
    const rect = progress.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    const previewImgNumber = Math.max(1, Math.floor((percent * video.duration) / 10))   
    const previewImgSrc = `assets/media/previews/preview${previewImgNumber}.jpg`
    previewImg.src = previewImgSrc
    times.textContent = formatDuration(percent * video.duration)
    progress.style.setProperty('--preview-position', percent)

    if (isScrubbing) {
        e.preventDefault()
    }
}


//Tracks styling
const eminem = document.getElementsByTagName('video')[0]
const tracks = eminem.textTracks[0]
const active_cues = tracks.cues[0]
console.log(tracks.length)