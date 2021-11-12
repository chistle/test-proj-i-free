(function () {
  var baseUrl = "https://dash.akamaized.net/dash264/TestCases/2c/qualcomm/1/"; // Обычно это Url ведущий в корневую папку Manifest.mpd
  var initUrl = baseUrl + "ED_1280_4M_MPEG2_video_init.mp4"; // Url для инициализации видео
  var templateUrl = baseUrl + "ED_1280_4M_MPEG2_video_$Number$.mp4"; // Url для вызова GET для сегментов видео
  var audioInitUrl = baseUrl + "ED_MPEG2_32k_init.mp4"; // Url для инициализации аудио
  var audioTemplate = baseUrl + "ED_MPEG2_32k_$Number$.mp4"; // Url для вызова GET для сегментов аудио
  var sourceBuffer;
  var index = 0;
  var audioIndex = 0;

  // Количество кусочков исходного файла или в этом случае общяя длительность
  // видео с точки зрения MPEG-DASH
  var numberOfChunks = 8036352;
  var video = document.querySelector("video");

  if (!window.MediaSource) {
    console.error("No Media Source API available");
    return;
  }

  // Создание объекта MediaSourse
  var ms = new MediaSource();
  video.src = window.URL.createObjectURL(ms);
  ms.addEventListener("sourceopen", onMediaSourceOpen);

  // Создание двух буфферов для файлов аудио и видео
  function onMediaSourceOpen() {
    sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="avc1.42c01f"');
    audioSourceBuffer = ms.addSourceBuffer('audio/mp4; codecs="mp4a.40.29"');
    sourceBuffer.addEventListener("updateend", nextSegment);

    // Запрос на новые кусочки файлов через XMLHttpRequest
    GET(initUrl, appendToBuffer);
    GET(audioInitUrl, appendToAudioBuffer);

    // Запуск видео
    video.play();
  }

  // Функция вызова следующего сегмента и добавления его в буффер
  function nextSegment() {
    var url = templateUrl.replace("$Number$", index);
    GET(url, appendToBuffer);
    console.log(index);
    index = index + 24576; // 24576 - это время, используемое MPEG-DASH для вызова следующего сегмента видео
    var audioUrl = audioTemplate.replace("$Number$", audioIndex);
    GET(audioUrl, appendToAudioBuffer);
    audioIndex = audioIndex + 94208; // 94208 - это время, используемое MPEG-DASH для вызова следующего сегмента аудио
    console.log(audioIndex);
    if (index > numberOfChunks) {
      sourceBuffer.removeEventListener("updateend", nextSegment);
    }
  }

  // Отдельная функция для добавление нового кусочка в общий буфер видео
  function appendToBuffer(chunk) {
    if (chunk) {
      sourceBuffer.appendBuffer(new Uint8Array(chunk));
    }
  }

  // Отдельная функция для добавление нового кусочка в общий буфер аудио
  function appendToAudioBuffer(chunk) {
    if (chunk) {
      audioSourceBuffer.appendBuffer(new Uint8Array(chunk));
    }
  }

  // Функция вызова xhr документа с сервера MPD источника
  function GET(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";

    xhr.onload = function (e) {
      if (xhr.status != 200) {
        console.warn("Unexpected status code " + xhr.status + " for " + url);
        return false;
      }
      callback(xhr.response);
    };

    xhr.send();
  }
})();
