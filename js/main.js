// ============================================
//   YAKEEN INTERNATIONAL — MAIN JS
//   Shared functions used across all pages
// ============================================

// ── Homepage: Load featured vacancies ──
async function loadFeaturedVacancies() {
  const container = document.getElementById('featuredVacancies');
  if (!container) return;

  const countryFlags = {
    'Saudi Arabia':'🇸🇦','UAE':'🇦🇪','Japan':'🇯🇵',
    'Vietnam':'🇻🇳','Maldives':'🇲🇻','Malaysia':'🇲🇾',
    'Portugal':'🇵🇹','Spain':'🇪🇸','Norway':'🇳🇴',
    'Malta':'🇲🇹','Italy':'🇮🇹'
  };

  try {
    const vacancies = await window.getFeaturedVacancies();

    if (!vacancies || vacancies.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--mid-gray);">
          <div style="font-size:2rem;margin-bottom:12px;">📋</div>
          <div style="font-weight:600;color:var(--navy-dark);">No vacancies posted yet</div>
          <div style="font-size:0.88rem;margin-top:6px;">Check back soon — we update weekly!</div>
        </div>`;
      return;
    }

    container.innerHTML = vacancies.map(v => `
      <div class="vacancy-card" data-aos="fade-up">
        <div class="vacancy-card-header">
          <div>
            <div class="vacancy-country-flag">${countryFlags[v.country] || '🌍'}</div>
          </div>
          <span class="badge ${v.is_urgent ? 'badge-gold' : 'badge-navy'}">
            ${v.is_urgent ? '🔥 Urgent' : '✅ Active'}
          </span>
        </div>
        <div class="vacancy-title">${escHtml(v.title)}</div>
        <div class="vacancy-meta">
          <span class="vacancy-meta-item">
            <i class="fas fa-map-marker-alt" style="color:var(--gold);font-size:0.7rem;"></i>
            ${escHtml(v.country)}
          </span>
          <span class="vacancy-meta-item">
            <i class="fas fa-tag" style="color:var(--gold);font-size:0.7rem;"></i>
            ${escHtml(v.category)}
          </span>
          ${v.salary ? `
          <span class="vacancy-meta-item">
            <i class="fas fa-money-bill-wave" style="color:var(--gold);font-size:0.7rem;"></i>
            ${escHtml(v.salary)}
          </span>` : ''}
        </div>
        <div class="vacancy-card-footer">
          <span style="font-size:0.75rem;color:var(--mid-gray);">
            <i class="fas fa-calendar-alt" style="color:var(--gold);font-size:0.7rem;"></i>
            ${formatDate(v.created_at)}
          </span>
          <a href="contact.html?job=${encodeURIComponent(v.title)}&country=${encodeURIComponent(v.country)}"
             class="btn btn-primary" style="padding:8px 18px;font-size:0.82rem;">
            Apply <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `).join('');

    AOS.refresh();

  } catch (err) {
    console.error('loadFeaturedVacancies error:', err);
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--mid-gray);">
        <div style="font-size:2rem;margin-bottom:12px;">⚠️</div>
        <div style="font-size:0.88rem;">Could not load vacancies. Please try again later.</div>
      </div>`;
  }
}


// ── Homepage: Load featured testimonials ──
async function loadFeaturedTestimonials() {
  const container = document.getElementById('testimonialsPreview');
  if (!container) return;

  try {
    const testimonials = await window.getFeaturedTestimonials();

    if (!testimonials || testimonials.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--mid-gray);">
          <div style="font-size:2rem;margin-bottom:12px;">🎥</div>
          <div style="font-weight:600;color:var(--navy-dark);">No testimonials yet</div>
          <div style="font-size:0.88rem;margin-top:6px;">Worker stories coming soon!</div>
        </div>`;
      return;
    }

    container.innerHTML = testimonials.map(t => `
      <div class="testimonial-card" data-aos="fade-up">
        <div class="testimonial-video-thumb" onclick="openVideoModal('${getYouTubeEmbed(t.youtube_url)}')">
          <img
            src="https://img.youtube.com/vi/${getYouTubeId(t.youtube_url)}/hqdefault.jpg"
            alt="${escHtml(t.worker_name)}"
            onerror="this.src='assets/images/video-placeholder.jpg'"
          />
          <div class="play-btn">
            <div class="play-btn-inner">▶</div>
          </div>
        </div>
        <div class="testimonial-card-body">
          <div class="testimonial-worker-name">${escHtml(t.worker_name)}</div>
          <div class="testimonial-worker-meta">
            ${escHtml(t.job_title)} · ${escHtml(t.country)}
          </div>
        </div>
      </div>
    `).join('');

    AOS.refresh();

  } catch (err) {
    console.error('loadFeaturedTestimonials error:', err);
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--mid-gray);">
        <div style="font-size:0.88rem;">Could not load testimonials.</div>
      </div>`;
  }
}


// ── YouTube helpers ──
function getYouTubeId(url) {
  if (!url) return '';
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : '';
}

function getYouTubeEmbed(url) {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : '';
}


// ── Shared helpers ──
window.escHtml = function (str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

window.formatDate = function (dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};


// ── Auto-fill contact form if coming from vacancy ──
function prefillContactForm() {
  const params = new URLSearchParams(window.location.search);
  const job     = params.get('job');
  const country = params.get('country');

  if (job) {
    const msgField = document.getElementById('message');
    if (msgField) {
      msgField.value = `I am interested in the ${job} position in ${country || 'your listed country'}. Please contact me with more details.`;
    }
    const subjectField = document.getElementById('subject');
    if (subjectField) {
      subjectField.value = `Job Application — ${job} (${country || ''})`;
    }
  }
}


// ── Run on page load ──
document.addEventListener('DOMContentLoaded', function () {
  // Load dynamic homepage sections
  loadFeaturedVacancies();
  loadFeaturedTestimonials();

  // Prefill contact form if redirected from vacancy
  prefillContactForm();
});
