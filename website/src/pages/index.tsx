import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

const conceptCards = [
  {
    title: "Task",
    description: "The operator goal states the outcome the run should produce.",
  },
  {
    title: "Capability",
    description: "The capability names the bounded task domain for the run.",
  },
  {
    title: "Context",
    description: "Context carries structured execution input like URLs and IDs.",
  },
  {
    title: "Runtime",
    description: "Runtime holds the resources and state the engine can use.",
  },
  {
    title: "Engine",
    description: "The engine performs execution with the runtime resources.",
  },
  {
    title: "Verification",
    description: "Verification defines deterministic acceptance logic.",
  },
  {
    title: "Trace",
    description: "Trace records attempts, failures, and accepted results.",
  },
];

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Operator architecture for reliable automation systems."
      description="Docs for the operator-runtime TypeScript SDK."
    >
      <main className="container margin-vert--xl">
        <section className="hero hero--primary docHero">
          <div className="container">
            <h1 className="hero__title">
              Operator architecture for reliable automation systems.
            </h1>
            <p className="hero__subtitle">
              Define the task. Select the capability. Provide context. Run with
              a real runtime. Verify the result deterministically.
            </p>
            <p>
              `operator-runtime` is still in active development.
            </p>
            <div className="docHeroActions">
              <Link className="button button--secondary button--lg" to="/docs/intro">
                Read the docs
              </Link>
              <Link
                className="button button--outline button--lg"
                to="/docs/guides/first-operator"
              >
                Start with the first operator guide
              </Link>
            </div>
          </div>
        </section>

        <section className="margin-vert--xl">
          <div className="row">
            {conceptCards.map((card) => {
              return (
                <div className="col col--4 margin-bottom--lg" key={card.title}>
                  <div className="card docCard">
                    <div className="card__body">
                      <h2>{card.title}</h2>
                      <p>{card.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="margin-vert--xl">
          <div className="row">
            <div className="col col--6">
              <h2>Execution model</h2>
              <p>
                The operator coordinates a run. The capability defines what kind
                of task the run is. The engine executes. The runtime supplies
                resources. Verification decides whether the result is accepted.
              </p>
              <pre className="docDiagram">
                <code>{`OPERATOR
  │
  │ task + context + verify
  ▼
Capability-selected execution
  │
  ▼
Engine
  │
  │ uses runtime
  ▼
Runtime (Browser / APIs / Test Runtime)
  │
  ▼
Environment
  │
  ▼
Verification
  │
  ▼
Result + Trace`}</code>
              </pre>
            </div>
            <div className="col col--6">
              <h2>Current state</h2>
              <p>
                The current implementation includes a typed operator runtime, a
                browser-backed example using Playwright, and a verified browser
                integration test. The project is still in active development.
              </p>
              <p>
                The docs call out what exists today and what is planned so the
                abstraction stays honest.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
