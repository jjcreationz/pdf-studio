
import { ArrowLeft, ShieldCheck, Sparkles, Code2, FileText } from 'lucide-react'

export default function About({ onBack }) {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="eyebrow">
          <Sparkles size={15} />
          THE STORY BEHIND JJ CREATIONZ
        </div>

        <h1>
          Technology should make life easier.
          <span> Not more complicated.</span>
        </h1>

        <p>
          JJ Creationz is building simple, practical digital tools that help
          people get things done without unnecessary complexity.
        </p>

        <button className="primary-btn" onClick={onBack}>
          <ArrowLeft size={17} />
          Back to PDF Studio
        </button>
      </section>

      <section className="about-section">
        <div className="about-copy">
          <span className="about-kicker">OUR STORY</span>
          <h2>Built around creativity. Growing through technology.</h2>
          <p>
            JJ Creationz began with a simple idea: create things that people
            find useful and enjoy using. Today, we're bringing that same
            creative mindset into digital tools designed for everyday tasks.
          </p>
          <p>
            Our first step is PDF Studio — a straightforward workspace for
            opening PDFs, adding text, rotating pages, and downloading an
            updated copy.
          </p>
        </div>

        <div className="about-visual">
          <div className="about-logo-mark">JJ<span>.</span></div>
          <div className="about-visual-line" />
          <p>CREATIVITY MEETS TECHNOLOGY</p>
        </div>
      </section>

      <section className="about-section about-mission">
        <div className="about-card-icon">
          <Sparkles size={23} />
        </div>
        <span className="about-kicker">OUR MISSION</span>
        <h2>Useful tools. Clear experiences. Less friction.</h2>
        <p>
          We want to make common digital tasks feel simple and approachable.
          That means focusing on practical features, understandable interfaces,
          and tools that help you move forward.
        </p>
      </section>

      <section className="about-values">
        <article className="about-value-card">
          <div className="feature-icon">
            <ShieldCheck size={19} />
          </div>
          <h3>Privacy matters</h3>
          <p>
            PDF Studio processes documents in your browser. The current
            implementation does not upload your PDF to our server.
          </p>
        </article>

        <article className="about-value-card">
          <div className="feature-icon">
            <FileText size={19} />
          </div>
          <h3>Practical by design</h3>
          <p>
            We focus on useful features and a clean experience instead of
            making everyday tasks feel complicated.
          </p>
        </article>

        <article className="about-value-card">
          <div className="feature-icon">
            <Code2 size={19} />
          </div>
          <h3>Always evolving</h3>
          <p>
            PDF tools are the beginning. We're exploring more useful tools
            for writing, productivity, and development.
          </p>
        </article>
      </section>

      <section className="about-next">
        <span className="about-kicker">WHAT'S NEXT</span>
        <h2>This is just the beginning.</h2>
        <p>
          We're working toward a growing collection of accessible online tools,
          with future ideas including more PDF features, spelling assistance,
          and developer utilities.
        </p>
        <button className="primary-btn" onClick={onBack}>
          Explore PDF Studio
          <ArrowLeft size={17} />
        </button>
      </section>
    </main>
  )
}
