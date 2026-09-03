import { LAB } from "@/config";

export function Manifesto() {
  return (
    <section className="manifesto section-shell">
      <div className="manifesto-card">
        <span className="section-kicker">Mission</span>
        <blockquote className="manifesto-quote">{LAB.quote}</blockquote>
        <h2>
          A truly distributed operating system.
        </h2>
        <p>
          The ultimate research interest is the know-how and technology of engineering a kernelware — with embedded basic cells and primitives in support of all types of foreseen and unforeseen computations, running on heterogeneous platforms.
        </p>
        <div className="manifesto-tags">
          <span>Distributed OS</span>
          <span>High-performance computing</span>
          <span>System software</span>
        </div>
      </div>
    </section>
  );
}
