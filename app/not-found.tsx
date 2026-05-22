import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-wrap pb-20 text-center">
      <span className="eyebrow mx-auto">Offside</span>
      <h1 className="section-title mt-4">Match Not Found</h1>
      <div className="mt-8 flex justify-center">
        <Link className="primary-action" href="/matches">
          Back to Matches
        </Link>
      </div>
    </main>
  );
}
