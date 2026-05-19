import { lazy, Suspense } from 'react';
import {
  Check, Clock,
  Zap, ArrowRight, Star,
} from 'lucide-react';
import { plans } from './data.js';

/* ── Lazy-load all below-fold sections as one chunk ─────────── */
const BelowFold = lazy(() => import('./BelowFold.jsx'));

/* ── Cell renderer (table rows use scope="row" in BelowFold) ── */

/* ── Marquee Banner ────────────────────────────────────────── */
function MarqueeBanner() {
  const text = 'LIMITED TIME OFFER — 10% OFF FOR FIRST 10 CLIENTS ONLY!';
  const items = Array(8).fill(text);
  return (
    <div className="marquee-wrapper" role="region" aria-label="Promotional offer: 10% off for first 10 clients">
      <div className="marquee-track" aria-hidden="true">
        {items.map((t, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Hero Section ──────────────────────────────────────────── */
function HeroSection() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-heading">
      <div className="hero-label">Transparent Pricing</div>
      <h1 id="hero-heading">PRICING TIERS</h1>
      <p className="hero-subtitle">
        5 Flexible Plans &nbsp;•&nbsp; Scales for All Business Needs &nbsp;•&nbsp;
        UI/UX, Backend, and E-Commerce Solutions &nbsp;•&nbsp; Maintenance Included
      </p>
      <p className="hero-note">
        <Star size={14} aria-hidden="true" />
        Contact us before making payments
      </p>
    </section>
  );
}

/* ── Pricing Card ──────────────────────────────────────────── */
function PricingCard({ plan }) {
  const ctaClass =
    plan.ctaStyle === 'neon'  ? 'card-cta cta-neon'  :
    plan.ctaStyle === 'blue'  ? 'card-cta cta-blue'  :
                                'card-cta cta-outline';

  const cardClass = [
    'pricing-card',
    plan.isBestValue ? 'best-value' : '',
    plan.id === 'T4'  ? 'ecommerce'  : '',
  ].filter(Boolean).join(' ');

  return (
    <article className={cardClass} id={`card-${plan.id}`} aria-label={`${plan.name} — ${plan.subtitle} pricing plan at ₹${plan.price.toLocaleString('en-IN')}`}>
      {/* Top row: tag + badges */}
      <div className="card-top-row">
        <span className="card-tag">{plan.tag}</span>
        <div className="badge-row">
          {plan.isBestValue && <span className="best-badge" aria-label="Best value plan">⭐ Best Value</span>}
          {plan.id === 'T4'  && <span className="ecom-badge" aria-label="E-Commerce plan">🛒 E-Commerce</span>}
          {plan.discountBadge && (
            <span className={`discount-badge ${plan.discountBadge.color}`} aria-label={`${plan.discountBadge.label} discount`}>
              {plan.discountBadge.label}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <div className="card-name">{plan.name}</div>
      <div className="card-subtitle">{plan.subtitle} &nbsp;·&nbsp; {plan.pages}</div>

      {/* Price */}
      <div className="card-price-block">
        {plan.originalPrice && (
          <div className="card-price-original" aria-label={`Original price ₹${plan.originalPrice.toLocaleString('en-IN')}, now discounted`}>
            ₹{plan.originalPrice.toLocaleString('en-IN')}
          </div>
        )}
        <div className="card-price" aria-label={`Price: ₹${plan.price.toLocaleString('en-IN')}`}>
          <span aria-hidden="true">₹</span>{plan.price.toLocaleString('en-IN')}
        </div>
        <div className="card-delivery">
          <Clock size={13} aria-hidden="true" />
          Delivered in {plan.delivery}
        </div>
      </div>

      <hr className="card-divider" />

      {/* Features */}
      <p className="card-features-title" id={`features-title-${plan.id}`}>What's Included</p>
      <ul className="card-features" aria-labelledby={`features-title-${plan.id}`}>
        {plan.features.map((f, i) => (
          <li key={i}>
            <Check size={14} className="feat-icon green" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <hr className="card-divider" />

      {/* Complimentary */}
      <p className="comp-title" id={`comp-title-${plan.id}`}>Complimentary</p>
      <ul className="comp-list" aria-labelledby={`comp-title-${plan.id}`}>
        {plan.complimentary.map((c, i) => (
          <li key={i} className="comp-pill">{c}</li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="../consult/consult.html"
        className={ctaClass}
        id={`cta-${plan.id}`}
        aria-label={`${plan.cta} — ${plan.name} plan at ₹${plan.price.toLocaleString('en-IN')}`}
      >
        {plan.cta}
        <ArrowRight size={16} aria-hidden="true" style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
      </a>
    </article>
  );
}

/* ── Pricing Cards Section ─────────────────────────────────── */
function PricingCardsSection() {
  return (
    <section id="pricing" className="cards-section" aria-labelledby="pricing-heading">
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="section-header">
          <h2 id="pricing-heading">Choose Your <span className="accent-teal">Perfect Plan</span></h2>
          <p>Scalable solutions for every stage of your business journey.</p>
        </div>
      </div>
      <div className="cards-grid">
        {plans.map(plan => <PricingCard key={plan.id} plan={plan} />)}
      </div>
    </section>
  );
}

/* ── Main Pricing Page ─────────────────────────────────────── */
export default function PricingPage() {
  return (
    <>
      <header>
        <MarqueeBanner />
      </header>
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <PricingCardsSection />
        <Suspense fallback={<div className="below-fold-loading" aria-label="Loading content" role="status">Loading…</div>}>
          <BelowFold />
        </Suspense>
      </main>
    </>
  );
}
