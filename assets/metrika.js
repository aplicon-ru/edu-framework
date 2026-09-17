// Счётчик Яндекс.Метрики. Подключается через extra_javascript в mkdocs.yml;
// сам файл копируется в docs/ сборочным скриптом tools/build-site.sh.
(function (m, e, t, r, i, k, a) {
  m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
  m[i].l = 1 * new Date();
  for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
  k = e.createElement(t); a = e.getElementsByTagName(t)[0];
  k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=112743706', 'ym');

ym(112743706, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
