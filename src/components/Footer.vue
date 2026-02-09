<template>
  <footer class="pro-footer">
    <div class="footer-glass">
      <div class="footer-content">


        <div class="footer-brand">
          <h2 class="brand-title">Proyecto Vue</h2>
          <p class="brand-desc">
            Vive la experiencia musical definitiva. Sonido premium, artistas increíbles y emoción en cada nota.
          </p>
        </div>


        <div class="footer-social">
          <h3 class="social-title">Síguenos</h3>

          <div class="social-list">
            <a href="#" class="social-link">YouTube</a>
            <a href="#" class="social-link">Instagram</a>
            <a href="#" class="social-link">Facebook</a>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <p>© 2025 Vue.js • Desarrollado por Israel Jimenez</p>
      </div>

    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterUltraPro",
};
</script>

<style scoped>
.pro-footer {
  background: linear-gradient(135deg, #0a0a0a, #1a1a1a 40%, #000);  
  padding: 70px 20px 35px;
  display: flex;
  justify-content: center;
}

.footer-glass {
  width: 100%;
  max-width: 1300px;
  padding: 45px;
  border-radius: 25px;
  backdrop-filter: blur(18px);
  background: rgba(226, 0, 0, 0.04);
  border: 1px solid rgb(233, 20, 187);
  box-shadow: 
    0 0 25px rgb(204, 0, 153),
    0 0 60px rgb(196, 0, 81);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-brand {
  flex: 1;
  min-width: 260px;
}

.brand-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ff4f91;
  letter-spacing: 1px;
  text-shadow: 
    0 0 12px rgba(255, 79, 145, 0.7),
    0 0 25px rgba(255, 79, 145, 0.4);
}

.brand-desc {
  margin-top: 12px;
  color: #ccc;
  line-height: 1.7;
  font-size: 1rem;
}

.footer-social {
  flex: 1;
}

.social-title {
  color: #ff4f91;
  font-size: 1.4rem;
  margin-bottom: 18px;
  font-weight: 600;
  text-shadow: 0 0 12px rgba(255, 79, 145, 0.5);
}

.social-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-link {
  color: #fff;
  font-size: 1.15rem;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: 0.25s ease;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
}

.social-link:hover {
  color: #ff4f91;
  text-shadow: 
    0 0 10px rgba(255, 79, 145, 0.8),
    0 0 20px rgba(255, 79, 145, 0.6);
  transform: translateX(4px);
}

.footer-bottom {
  margin-top: 40px;
  text-align: center;
  color: #bbb;
  font-size: 0.95rem;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 768px) {
  .footer-content {
    text-align: center;
  }
  .social-list {
    align-items: center;
  }
}
</style>
