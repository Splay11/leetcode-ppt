import { useEffect, useMemo, useState } from "react";
import { ASSET_BY_ID, ASSETS, SECTIONS, searchAssets } from "./catalog.js";
import { AssetPreview } from "./previews/registry.jsx";

function parseRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const assetMatch = hash.match(/^\/asset\/([^/?]+)/);
  if (assetMatch) return { page: "asset", assetId: decodeURIComponent(assetMatch[1]) };
  const sectionMatch = hash.match(/^\/section\/([^/?]+)/);
  if (sectionMatch) return { page: "section", sectionId: decodeURIComponent(sectionMatch[1]) };
  return { page: "home" };
}

function AssetCard({ asset }) {
  return (
    <a className="al-card" href={`#/asset/${asset.id}`}>
      <div className="al-card-thumb">
        <AssetPreview asset={asset} compact />
      </div>
      <h3 className="al-card-title">{asset.nameZh}</h3>
    </a>
  );
}

function HomePage({ query, onQuery }) {
  const filtered = useMemo(() => searchAssets(query), [query]);

  return (
    <div className="al-home">
      <header className="al-hero">
        <h1>素材库</h1>
        <input
          className="al-search-input"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="搜索素材…"
        />
      </header>

      {SECTIONS.map((section) => {
        const sectionAssets = filtered.filter((a) => a.section === section.id);
        if (!sectionAssets.length) return null;

        return (
          <section key={section.id} className="al-section-block">
            <div className="al-section-head">
              <h2>{section.nameZh}</h2>
              <a className="al-link" href={`#/section/${section.id}`}>
                全部
              </a>
            </div>

            {section.subsections ? (
              section.subsections.map((sub) => {
                const items = sectionAssets.filter((a) => a.subsection === sub.id);
                if (!items.length) return null;
                return (
                  <div key={sub.id} className="al-subsection">
                    <h3>{sub.nameZh}</h3>
                    <div className="al-grid">
                      {items.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="al-grid">
                {sectionAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function SectionPage({ sectionId, query, onQuery }) {
  const section = SECTIONS.find((s) => s.id === sectionId);
  const filtered = useMemo(
    () => searchAssets(query).filter((a) => a.section === sectionId),
    [query, sectionId],
  );

  if (!section) {
    return (
      <div className="al-empty">
        <p>未找到分区</p>
        <a href="#/">返回首页</a>
      </div>
    );
  }

  return (
    <div className="al-page">
      <nav className="al-crumb">
        <a href="#/">素材库</a> / {section.nameZh}
      </nav>
      <header className="al-page-head">
        <h1>{section.nameZh}</h1>
        <input
          className="al-search-input"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="搜索…"
        />
      </header>

      {section.subsections ? (
        section.subsections.map((sub) => {
          const items = filtered.filter((a) => a.subsection === sub.id);
          if (!items.length) return null;
          return (
            <section key={sub.id} className="al-subsection">
              <h2>{sub.nameZh}</h2>
              <div className="al-grid">
                {items.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="al-grid">
          {filtered.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}

function AssetDetailPage({ assetId }) {
  const asset = ASSET_BY_ID[assetId];

  if (!asset) {
    return (
      <div className="al-empty">
        <p>未找到素材</p>
        <a href="#/">返回首页</a>
      </div>
    );
  }

  const section = SECTIONS.find((s) => s.id === asset.section);

  return (
    <div className="al-detail">
      <nav className="al-crumb">
        <a href="#/">素材库</a>
        {section && (
          <>
            {" / "}
            <a href={`#/section/${section.id}`}>{section.nameZh}</a>
          </>
        )}
        {" / "}
        {asset.nameZh}
      </nav>

      <header className="al-detail-head">
        <h1>{asset.nameZh}</h1>
        <p className="al-detail-brief">{asset.whenToUse}</p>
      </header>

      <section className="al-detail-preview">
        <AssetPreview asset={asset} />
      </section>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(parseRoute);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="al-app">
      <aside className="al-sidebar">
        <a className="al-brand" href="#/">
          素材库
        </a>
        <nav className="al-nav">
          <a href="#/" className={route.page === "home" ? "active" : ""}>
            总览
          </a>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#/section/${s.id}`}
              className={route.page === "section" && route.sectionId === s.id ? "active" : ""}
            >
              {s.nameZh}
            </a>
          ))}
        </nav>
        <p className="al-sidebar-note">{ASSETS.length} 项</p>
      </aside>

      <main className="al-main">
        {route.page === "home" && <HomePage query={query} onQuery={setQuery} />}
        {route.page === "section" && (
          <SectionPage sectionId={route.sectionId} query={query} onQuery={setQuery} />
        )}
        {route.page === "asset" && <AssetDetailPage assetId={route.assetId} />}
      </main>
    </div>
  );
}
