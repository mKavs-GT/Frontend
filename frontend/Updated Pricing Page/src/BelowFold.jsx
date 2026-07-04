import {
  Check, Clock, FileText, Search, Share2, Globe,
  MessageCircle, RefreshCw, ShieldCheck, Smartphone, BarChart2,
  Bug, Layers, Pen, Megaphone, LayoutDashboard, Bot, Languages,
  Wrench, Zap, Package, ArrowRight, Gift, CalendarCheck,
} from 'lucide-react';
import { compareRows, addons, services, complimentaryItems } from './data.js';

/* ── Icon resolver ─────────────────────────────────────────── */
const ICON_MAP = {
  Pen, FileText, Search, Share2, Globe, MessageCircle, RefreshCw,
  ShieldCheck, Smartphone, BarChart2, Bug, Layers, Megaphone,
  LayoutDashboard, Bot, Languages, Wrench,
};
function DynIcon({ name, size = 18, ...props }) {
  const Ic = ICON_MAP[name] || Zap;
  return <Ic size={size} {...props} />;
}

/* ── Cell renderer ─────────────────────────────────────────── */
function Cell({ value, isDelivery, isEmpire }) {
  const cls = isEmpire ? 'td-empire' : '';
  if (isDelivery) return <td className={cls} style={{ fontWeight: 700, color: '#374151' }}>{value}</td>;
  if (value === 'yes')   return <td className={cls}><span className="check-yes" aria-label="Included">✓</span></td>;
  if (value === 'addon') return <td className={cls}><span className="check-addon" aria-label="Available as add-on">Add-on</span></td>;
  return <td className={cls}><span className="check-no" aria-label="Not included">—</span></td>;
}

/* ── Compare Table ─────────────────────────────────────────── */
export function CompareSection() {
  return (
    <section id="compare" className="compare-section" aria-labelledby="compare-heading">
      <div className="inner">
        <div className="section-header">
          <h2 id="compare-heading">Compare <span className="accent-green">ALL PLANS</span></h2>
          <p>A side-by-side breakdown of every feature across all tiers.</p>
        </div>
        <div className="table-wrapper">
          <table className="compare-table" aria-label="Feature comparison across all mKavs pricing plans">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">T0 – Spark</th>
                <th scope="col">T1 – Launchpad</th>
                <th scope="col">T2 – Velocity</th>
                <th scope="col" className="col-empire">T3 – Empire</th>
                <th scope="col">T4 – Nexus</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, i) => (
                <tr key={i} className={row.isDelivery ? 'row-delivery' : ''}>
                  <th scope="row" style={row.isDelivery ? { fontWeight: 700 } : { fontWeight: 500 }}>{row.feature}</th>
                  <Cell value={row.t0} isDelivery={row.isDelivery} />
                  <Cell value={row.t1} isDelivery={row.isDelivery} />
                  <Cell value={row.t2} isDelivery={row.isDelivery} />
                  <Cell value={row.t3} isDelivery={row.isDelivery} isEmpire />
                  <Cell value={row.t4} isDelivery={row.isDelivery} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ── Add-ons Section ───────────────────────────────────────── */
export function AddonsSection() {
  return (
    <section id="addons" className="addons-section" aria-labelledby="addons-heading">
      <div className="inner">
        <div className="section-header">
          <h2 id="addons-heading">
            <span style={{ color: '#111827' }}>Optional&nbsp;</span>
            <span className="accent-green">ADD-ONS</span>
          </h2>
          <p>Pay only if you need it — bolt on exactly what your project requires.</p>
        </div>
        <div className="addons-grid">
          {addons.map(addon => (
            <div key={addon.id} className="addon-card" id={`addon-${addon.id}`}>
              <div className="addon-icon" aria-hidden="true">
                <DynIcon name={addon.icon} size={20} />
              </div>
              <div className="addon-name">{addon.name}</div>
              <div className="addon-price">{addon.price}</div>
              <div className="addon-desc">{addon.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Additional Services ───────────────────────────────────── */
export function ServicesSection() {
  return (
    <section id="services" className="services-section" aria-labelledby="services-heading">
      <div className="inner">
        <div className="section-header">
          <h2 id="services-heading" style={{ color: '#fff' }}>
            Additional <span className="accent-teal">SERVICES</span>
          </h2>
          <p style={{ color: '#9CA3AF' }}>
            Standalone builds and specialist services available separately.
          </p>
        </div>
      </div>
      <div className="services-scroll">
        {services.map(svc => (
          <div key={svc.id} className="service-card" id={`service-${svc.id}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={16} color="#0EA5E9" aria-hidden="true" />
              <span className="service-name">{svc.name}</span>
            </div>
            <div className="service-price">{svc.price}</div>
            <div className="service-desc">{svc.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Complimentary Section ─────────────────────────────────── */
export function ComplimentarySection() {
  return (
    <section id="complimentary" className="comp-section" aria-labelledby="complimentary-heading">
      <div className="inner">
        <div className="section-header">
          <h2
            id="complimentary-heading"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
          >
            <Gift size={28} color="#16A34A" aria-hidden="true" />
            What's <span className="accent-green" style={{ marginLeft: 8 }}>ALWAYS INCLUDED</span>
          </h2>
          <p>Every plan ships with these essentials — no hidden costs, ever.</p>
        </div>
        <div className="comp-grid">
          {complimentaryItems.map(item => (
            <div key={item.id} className="comp-item">
              <div className="comp-item-icon" aria-hidden="true">
                <DynIcon name={item.icon} size={18} />
              </div>
              <div className="comp-item-text">
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer CTA ────────────────────────────────────────────── */
export function FooterCTA() {
  return (
    <footer id="footer-cta" className="footer-cta">
      <div className="footer-left">
        <div className="footer-headline" aria-label="Your Digital Journey Starts Here">
          <span className="white">YOUR</span>
          <span className="green">DIGITAL JOURNEY</span>
          <span className="white">STARTS HERE.</span>
        </div>
        <div className="footer-cta-btns">
          <a
            href="/Consult"
            className="btn-neon"
            id="cta-consultation"
            aria-label="Book a free consultation"
          >
            <CalendarCheck size={18} aria-hidden="true" />
            Book Free Consultation
          </a>
          <a
            href="../index.html#slide-3"
            className="btn-outline-white"
            id="cta-works"
            aria-label="View our portfolio of works"
          >
            View Our Works
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="mascot-area">
        <img
          src="../images/mascot.png"
          alt="mKavs friendly cartoon robot mascot holding a laptop, representing digital innovation"
          width="340"
          height="380"
          loading="lazy"
        />
      </div>
    </footer>
  );
}

/* ── Default export: BelowFold bundle for lazy loading ─────── */
export default function BelowFold() {
  return (
    <>
      <CompareSection />
      <AddonsSection />
      <ServicesSection />
      <ComplimentarySection />
      <FooterCTA />
    </>
  );
}
