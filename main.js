/* =============================================
   Jo Hours - 公共JS脚本
============================================= */

document.addEventListener('DOMContentLoaded', function() {

  // ── 自定义光标（仅桌面端）──
  if (window.innerWidth >= 1024) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Ring 跟随（加缓动）
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover 效果
    document.querySelectorAll('a, button, .card, .module-card, .preview-card, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        ring.classList.remove('hover');
      });
    });
  }

  // ── 导航栏滚动效果 ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── 汉堡菜单 ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // 点击菜单链接后关闭
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── 滚动淡入动画 ──
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  // ── 卡片3D倾斜效果（仅桌面端）──
  if (window.innerWidth >= 1024) {
    document.querySelectorAll('.card-3d').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `
          translateY(-6px)
          rotateX(${-y * 5}deg)
          rotateY(${x * 5}deg)
          scale(1.02)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ── 当前导航高亮 ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── 数字动画 ──
  function animateNumber(el) {
    const target = parseInt(el.getAttribute('data-target') || el.textContent);
    const duration = 2000;
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current + (el.getAttribute('data-suffix') || '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const numObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        numObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => numObserver.observe(el));

  // ── 标签筛选 ──
  document.querySelectorAll('.filter-tags').forEach(group => {
    group.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => {
        group.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');

        const filterValue = tag.getAttribute('data-filter');
        const container = document.querySelector(group.getAttribute('data-target'));
        if (!container) return;

        container.querySelectorAll('[data-category]').forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = '';
            item.classList.add('reveal');
            setTimeout(() => item.classList.add('visible'), 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });

  // ── 粒子动画（Hero区）──
  const heroParticles = document.querySelector('.hero-particles');
  if (heroParticles) {
    const colors = ['#B886FF', '#DDA0DD', '#FFD700'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${Math.random() * 10 + 8}s;
        animation-delay: ${Math.random() * 8}s;
      `;
      heroParticles.appendChild(p);
    }
  }

  // ── Tab切换 ──
  document.querySelectorAll('.tab-nav').forEach(nav => {
    nav.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        const parent = nav.closest('.tab-container');

        // 更新按钮状态
        nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 切换内容
        if (parent) {
          parent.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
          });
        }
      });
    });
  });

  // ── Flag 互动按钮 ──
  document.querySelectorAll('.flag-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const countEl = this.querySelector('.count');
      if (countEl) {
        let count = parseInt(countEl.textContent) || 0;
        countEl.textContent = count + 1;
        // 动效
        this.classList.add('bumped');
        setTimeout(() => this.classList.remove('bumped'), 400);
      }
    });
  });

  // ── 留言表单 ──
  const msgForm = document.querySelector('#message-form');
  if (msgForm) {
    msgForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('[type=submit]');
      const successMsg = document.querySelector('.form-success');
      const upsellMsg = document.querySelector('.form-upsell');

      btn.textContent = '发送中...';
      btn.disabled = true;

      setTimeout(() => {
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.classList.add('visible');
        }
        if (upsellMsg) {
          setTimeout(() => {
            upsellMsg.style.display = 'block';
            upsellMsg.classList.add('visible');
          }, 800);
        }
        this.reset();
        btn.textContent = '留下足迹';
        btn.disabled = false;
      }, 1200);
    });
  }

  // ── 快捷语按钮 ──
  document.querySelectorAll('.quick-phrase').forEach(btn => {
    btn.addEventListener('click', function() {
      const textarea = document.querySelector('#message-content');
      if (textarea) {
        textarea.value = this.getAttribute('data-phrase') || this.textContent;
        textarea.focus();
      }
    });
  });

});

// ── 工具函数：格式化日期 ──
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}
