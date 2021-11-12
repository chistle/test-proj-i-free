В репозитории представлены 2 папки с двумя разными подходами к подаче видео в плеер.

Для запуска, скачайте код и запустите index.html из одной из папок. Видео начнет загружаться после клика на видео.
В плеере присутствуют стандартные элементы управления: кнопки play/pause, воспроизведение и приостановка воспроизведения при нажатии на экранб ползунок для выбора фрагмента видео, ползунок громкости с возможностью включения/выключения звука по клику и при двойном нажатии на правую или левую сторону плеера - видео перематывается на 10 секунд вперед (если двойное нажатие было на правую сторону плеера) или на 10 секунд назад (если двойное нажатие было на левую сторону плеера). Перемотка двойным нажатием сопровождается анимацией и стрелками указывающими в какую сторону происходит перемотка. 

В папке "mse-player" находится плеер с дополнительно написанным js файлом "mse-player.js", который написан с помощью Media Source API. К сожалению, параметры для файла в этом плеере не представляется возможным вводить динамически, но все же сменить файл можно, изменив параметры из вводного mpd файла. Так как задача была поставлена с учетом не использования сторонних библиотек, времени просто не хватило на парсер для mpd файлов, особенно учитывая, что они бывают с разным механизмом подачи кусочков видео и аудио (по номерам кусочков или по времени с предыдущего). Но плеер работоспособен и может проигрывать потоковую передачу через MPEG-DASH. В плеере был использован mpd файл из этого источника: https://dash.akamaized.net/dash264/TestCases/2c/qualcomm/1/MultiResMPEG2.mpd. MPD файл так же приложен к репозиторию. 

В папке "regular-player" находится такой же плеер как и в папке "mse-player", только без дополнительного "mse-player.js" и функционала потоковой передачи. Вместо этого, в плеере используется источник прямо в тэге видео из свободного доступа. Плеер обладает тем же функционалом с точки зрения пользователя, что и "mse-player", такими как перемотка по двойному нажатию и т.п.

Так же, в ветке "testing" репозитория плеера присутствует версия с поддержкой touch инпута. Ветка тестовая, так как протестирована работа только в Chrome на Android и через эмуляцию Touch браузеров. На iOS, к сожалению данная ветка не работает как следует и нужны изменения специфичные для платформы.

Плеер протестирован на Google Chrome 95.0.4638.69, Microsoft Edge 95.0.1020.44, Mozilla Firefox 94.0.1.
