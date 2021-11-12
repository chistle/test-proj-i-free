// Глобальные переменные
const video = document.getElementById("video");
const videoControls = document.getElementById("video-controls");

// Переменные для перемотки по двойному нажатию
const notifications = document.querySelectorAll(".notification");
const forwardNotificationValue = document.querySelector(
  ".video-forward-notify span"
);
const rewindNotificationValue = document.querySelector(
  ".video-rewind-notify span"
);

// Проверка браузера на поддержку видео
const videoWorks = !!document.createElement("video").canPlayType;
if (videoWorks) {
  video.controls = false;
  videoControls.classList.remove("hidden");
}

const playButton = document.getElementById("play");

// Функция отвечающая за смену состояния с воизпроизведения на паузу
function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

playButton.addEventListener("click", togglePlay);

const playbackIcons = document.querySelectorAll(".playback-icons use");

// Функция для динамической смены кнопки воспроизведения/паузы
function updatePlayButton() {
  playbackIcons.forEach((icon) => icon.classList.toggle("hidden"));

  if (video.paused) {
    playButton.setAttribute("data-title", "Play");
  } else {
    playButton.setAttribute("data-title", "Pause");
  }
}

video.addEventListener("play", updatePlayButton);
video.addEventListener("pause", updatePlayButton);

const timeElapsed = document.getElementById("time-elapsed");
const duration = document.getElementById("duration");

function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}

// Функция для расчета текущего времени видео для отображения в плеере
function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute("max", videoDuration);
  progressBar.setAttribute("max", videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
}

video.addEventListener("loadedmetadata", initializeVideo);

// Функция обновляющая время с начала ролика для плеера
function updateTimeElapsed() {
  const time = formatTime(Math.round(video.currentTime));
  timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
  timeElapsed.setAttribute("datetime", `${time.minutes}m ${time.seconds}s`);
}

video.addEventListener("timeupdate", updateTimeElapsed);

const progressBar = document.getElementById("progress-bar");
const seek = document.getElementById("seek");

// Функция обновления положения ползунка воспроизведения
function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}

video.addEventListener("timeupdate", updateProgress);

const seekTooltip = document.getElementById("seek-tooltip");

// Функция для обновления места воспроизведения с помощью ползунка перемотки
function updateSeekTooltip(event) {
  const skipTo = Math.round(
    (event.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute("max"), 10)
  );
  seek.setAttribute("data-seek", skipTo);
  const t = formatTime(skipTo);
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
  const rect = video.getBoundingClientRect();
  seekTooltip.style.left = `${event.pageX - rect.left}px`;
}

seek.addEventListener("mousemove", updateSeekTooltip);

// Функция которая передает данные от ползунка перемотки к самому видео
// и меняет место воспроизведения
function skipAhead(event) {
  const skipTo = event.target.dataset.seek
    ? event.target.dataset.seek
    : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}

seek.addEventListener("input", skipAhead);

// Глобальные переменные для элементов громкости
const volumeButton = document.getElementById("volume-button");
const volumeIcons = document.querySelectorAll(".volume-button use");
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById("volume");

// Функция смены громкости с текущей громкости на 0 и обратно
function updateVolume() {
  if (video.muted) {
    video.muted = false;
  }

  video.volume = volume.value;
}

volume.addEventListener("input", updateVolume);

// Функция изменяющая иконку громкости в зависимости от уровня громкости
function updateVolumeIcon() {
  volumeIcons.forEach((icon) => {
    icon.classList.add("hidden");
  });

  volumeButton.setAttribute("data-title", "Mute");

  if (video.muted || video.volume === 0) {
    volumeMute.classList.remove("hidden");
    volumeButton.setAttribute("data-title", "Unmute");
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeLow.classList.remove("hidden");
  } else {
    volumeHigh.classList.remove("hidden");
  }
}

video.addEventListener("volumechange", updateVolumeIcon);

function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    volume.setAttribute("data-volume", volume.value);
    volume.value = 0;
  } else {
    volume.value = volume.dataset.volume;
  }
}

volumeButton.addEventListener("click", toggleMute);

video.addEventListener("click", togglePlay);

const playbackAnimation = document.getElementById("playback-animation");

// Функция для анимации воспроизведения или паузы при клике на плеер
function animatePlayback() {
  playbackAnimation.animate(
    [
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      },
    ],
    {
      duration: 500,
    }
  );
}

video.addEventListener("click", animatePlayback);

const fullscreenButton = document.getElementById("fullscreen-button");
const videoContainer = document.getElementById("video-container");

// Функция с переводящая плеер в полноэкранный режим при нажатии на кнопку полноэкранного режима
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (document.webkitFullscreenElement) {
    // Need this to support Safari
    document.webkitExitFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    // Need this to support Safari
    videoContainer.webkitRequestFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
}

fullscreenButton.onclick = toggleFullScreen;

const fullscreenIcons = fullscreenButton.querySelectorAll(
  ".right-controls use"
);

function hideControls() {
  if (video.paused) {
    return;
  }

  videoControls.classList.add("hide");
}

function showControls() {
  videoControls.classList.remove("hide");
}

// Event listener для того, чтобы когда мышь не указывает на плеер, прятать панель управления плеером
video.addEventListener("mouseenter", showControls);
video.addEventListener("mouseleave", hideControls);
videoControls.addEventListener("mouseenter", showControls);
videoControls.addEventListener("mouseleave", hideControls);

// Event listener для вывода управления плеером при касании
video.addEventListener("touchstart", function () {
  showControls();
  setTimeout(function () {
    hideControls();
  }, 1500);
});

// Event listener для скрытия управления плеером при бездействии курсора
video.addEventListener("mousemove", function () {
  showControls();
  setTimeout(function () {
    hideControls();
  }, 2000);
});

let timer;
let rewindSpeed = 0;
let forwardSpeed = 0;

// Функция просчета направления перемотки
function updateCurrentTime(delta) {
  let isRewinding = delta < 0;

  if (isRewinding) {
    rewindSpeed = rewindSpeed + delta;
    forwardSpeed = 0;
  } else {
    forwardSpeed = forwardSpeed + delta;
    rewindSpeed = 0;
  }

  clearTimeout(timer);

  let speed = isRewinding ? rewindSpeed : forwardSpeed;
  video.currentTime = video.currentTime + speed;

  let NotificationValue = isRewinding
    ? rewindNotificationValue
    : forwardNotificationValue;
  NotificationValue.innerHTML = `${Math.abs(speed)} seconds`;

  timer = setTimeout(function () {
    rewindSpeed = 0;
    forwardSpeed = 0;
  }, 200); // При изменении данного параметра, можно добиться перемотки больше чем на 10 секунд. Эффект заметен при 2000

  console.log(`updated time: ${video.currentTime}`);
}

// Функция определяющая какую анимацию проиграть
function animateNotificationIn(isRewinding) {
  isRewinding
    ? notifications[0].classList.add("animate-in")
    : notifications[1].classList.add("animate-in");
}

function animateNotificationOut() {
  this.classList.remove("animate-in");
}

function forwardVideo() {
  updateCurrentTime(10);
  animateNotificationIn(false);
}

function rewindVideo() {
  updateCurrentTime(-10);
  animateNotificationIn(true);
}

// Функция перематывающая видео на 10 секунд назад или вперед
function doubleClickHandler(e) {
  console.log(`current time: ${video.currentTime}`);
  const videoWidth = video.offsetWidth;
  e.offsetX < videoWidth / 2 ? rewindVideo() : forwardVideo();
}

// Хэндлер для touch устройств
var tapped = false;
video.addEventListener("touchstart", function (e) {
  e.offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft;

  if (!tapped) {
    //if tap is not set, set up single tap
    tapped = setTimeout(function () {
      tapped = null;
      togglePlay(e);
    }, 300); //wait 300ms then run single click code
  } else {
    clearTimeout(tapped); //stop single tap callback
    tapped = null;
    doubleClickHandler(e);
    //insert things you want to do when double tapped
  }
  e.preventDefault();
});

video.addEventListener("dblclick", doubleClickHandler);
notifications.forEach(function (notification) {
  notification.addEventListener("animationend", animateNotificationOut);
});
