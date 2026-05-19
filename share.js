/* ═══════════════════════════════════════════
   INSTANT PURSUIT — Share Utility
   WhatsApp, Facebook, LinkedIn, X, Copy Link
   ═══════════════════════════════════════════ */

function shareBar(title, url) {
  var encoded = encodeURIComponent(url);
  var encodedText = encodeURIComponent(title + ' — Instant Pursuit\n' + url);
  var wa = 'https://api.whatsapp.com/send?text=' + encodedText;
  var fb = 'https://www.facebook.com/sharer/sharer.php?u=' + encoded;
  var li = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encoded;
  var tw = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title + ' — Instant Pursuit') + '&url=' + encoded;

  return '<div class="share-bar">'
    + '<span class="share-bar-label">Share</span>'
    + '<a href="' + wa + '" target="_blank" rel="noopener" class="share-btn share-btn-wa">WhatsApp</a>'
    + '<a href="' + fb + '" target="_blank" rel="noopener" class="share-btn share-btn-fb">Facebook</a>'
    + '<a href="' + li + '" target="_blank" rel="noopener" class="share-btn share-btn-li">LinkedIn</a>'
    + '<a href="' + tw + '" target="_blank" rel="noopener" class="share-btn share-btn-tw">𝕏</a>'
    + '<button class="share-btn share-btn-copy" onclick="copyShareLink(this,\'' + url.replace(/'/g, "\\'") + '\')" title="Copy link">Copy Link</button>'
    + '</div>';
}

function copyShareLink(btn, url) {
  navigator.clipboard.writeText(url).then(function() {
    btn.classList.add('copied');
    btn.textContent = 'Copied!';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.textContent = 'Copy Link';
    }, 2000);
  }).catch(function() {
    var t = document.createElement('textarea');
    t.value = url;
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    btn.classList.add('copied');
    btn.textContent = 'Copied!';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.textContent = 'Copy Link';
    }, 2000);
  });
}
