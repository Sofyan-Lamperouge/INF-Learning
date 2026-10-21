// src/components/skeletons/LandingSkeleton.jsx

export default function LandingSkeleton() {
  return (
    <div className="ls-wrapper">
      
      {/* === 1. NAVBAR SKELETON === */}
      <div className="ls-navbar">
        <div className="ls-box ls-logo"></div>
        <div className="ls-nav-links">
          <div className="ls-box ls-link"></div>
          <div className="ls-box ls-link"></div>
          <div className="ls-box ls-link"></div>
          <div className="ls-box ls-link"></div>
        </div>
        <div className="ls-nav-actions">
          <div className="ls-box ls-btn-outline"></div>
          <div className="ls-box ls-btn-solid"></div>
        </div>
      </div>

      {/* === 2. HERO SECTION SKELETON === */}
      <div className="ls-container ls-hero">
        <div className="ls-hero-text">
          <div className="ls-box ls-text-sm"></div>
          <div className="ls-box ls-text-md"></div>
          <div className="ls-box ls-badge"></div>
          <div className="ls-box ls-text-lg"></div>
          <div className="ls-box ls-text-lg" style={{ width: '80%' }}></div>
          <div className="ls-box ls-text-md"></div>
          <div className="ls-box ls-btn-hero"></div>
        </div>
        <div className="ls-hero-img">
          <div className="ls-box ls-img-large"></div>
        </div>
      </div>

      {/* === 3. FITUR SECTION SKELETON === */}
      <div className="ls-container ls-features">
        <div className="ls-box ls-text-md"></div>
        <div className="ls-box ls-text-sm"></div>
        
        <div className="ls-features-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="ls-feature-item">
              <div className="ls-box ls-icon"></div>
              <div className="ls-box ls-text-sm"></div>
              <div className="ls-box ls-text-xs"></div>
            </div>
          ))}
        </div>
      </div>

      {/* === 4. TENTANG SECTION SKELETON === */}
      <div className="ls-section-bg">
        <div className="ls-container ls-about">
          <div className="ls-about-text">
            <div className="ls-box ls-text-sm"></div>
            <div className="ls-box ls-text-md"></div>
            <div className="ls-box ls-text-sm"></div>
          </div>
          <div className="ls-about-cards">
            <div className="ls-box ls-card"></div>
            <div className="ls-box ls-card"></div>
          </div>
        </div>
      </div>

      {/* === 5. FAQ SECTION SKELETON === */}
      <div className="ls-container ls-faq">
        <div className="ls-faq-text">
          <div className="ls-box ls-text-sm"></div>
          <div className="ls-box ls-text-md"></div>
          <div className="ls-box ls-text-sm"></div>
        </div>
        <div className="ls-faq-list">
          <div className="ls-box ls-faq-item"></div>
          <div className="ls-box ls-faq-item"></div>
          <div className="ls-box ls-faq-item"></div>
        </div>
      </div>

      {/* === 6. FOOTER SKELETON === */}
      <div className="ls-footer">
        <div className="ls-container ls-footer-grid">
          <div className="ls-footer-brand">
            <div className="ls-box ls-logo"></div>
            <div className="ls-box ls-text-sm"></div>
            <div className="ls-box ls-text-sm"></div>
          </div>
          <div className="ls-footer-links">
            <div className="ls-box ls-text-sm"></div>
            <div className="ls-box ls-link"></div>
            <div className="ls-box ls-link"></div>
            <div className="ls-box ls-link"></div>
          </div>
          <div className="ls-footer-contact">
            <div className="ls-box ls-text-sm"></div>
            <div className="ls-box ls-link"></div>
            <div className="ls-box ls-link"></div>
          </div>
        </div>
        <div className="ls-container">
          <div className="ls-box ls-text-xs ls-copyright"></div>
        </div>
      </div>

    </div>
  );
}