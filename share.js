/* ═══════════════════════════════════════════
   INSTANT PURSUIT — Share Utility
   WhatsApp, Facebook, LinkedIn, X, Copy Link
   ═══════════════════════════════════════════ */

function shareBar(title, url) {
  var encoded = encodeURIComponent(url);
  var encodedTitle = encodeURIComponent(title + ' — Instant Pursuit');
  var wa = 'https://api.whatsapp.com/send?text=' + encodedTitle + '%20' + encoded;
  var fb = 'https://www.facebook.com/sharer/sharer.php?u=' + encoded;
  var li = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encoded;
  var tw = 'https://twitter.com/intent/tweet?text=' + encodedTitle + '&url=' + encoded;

  return '<div class="share-bar">'
    + '<span class="share-bar-label">Share</span>'
    + '<a href="' + wa + '" target="_blank" rel="noopener" class="share-btn share-btn-wa" title="Share on WhatsApp">💬 WhatsApp</a>'
    + '<a href="' + fb + '" target="_blank" rel="noopener" class="share-btn share-btn-fb" title="Share on Facebook">📘 Facebook</a>'
    + '<a href="' + li + '" target="_blank" rel="noopener" class="share-btn share-btn-li" title="Share on LinkedIn">💼 LinkedIn</a>'
    + '<a href="' + tw + '" target="_blank" rel="noopener" class="share-btn share-btn-tw" title="Share on X">𝕏 Post</a>'
    + '<button class="share-btn share-btn-copy" onclick="copyShareLink(this,\'' + url.replace(/'/g, "\\'") + '\')" title="Copy link">📋 Copy Link</button>'
    + '</div>';
}

function copyShareLink(btn, url) {
  navigator.clipboard.writeText(url).then(function() {
    btn.classList.add('copied');
    btn.innerHTML = '✅ Copied!';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.innerHTML = '📋 Copy Link';
    }, 2000);
  }).catch(function() {
    // Fallback
    var t = document.createElement('textarea');
    t.value = url;
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    btn.classList.add('copied');
    btn.innerHTML = '✅ Copied!';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.innerHTML = '📋 Copy Link';
    }, 2000);
  });
}
