import type { Catalog, PackageOption, Scenario } from '../domain/types';
import { BannerCarousel } from './BannerCarousel';

interface HomeProps {
  catalog: Catalog;
  onSelectScenario: (scenario: Scenario) => void;
  onAddPackage: (packageOption: PackageOption) => void;
}

export function Home({ catalog, onSelectScenario, onAddPackage }: HomeProps) {
  return (
    <main className="screen">
      <section className="hero">
        <p className="eyebrow">Commercial Aroma Consultant</p>
        <h1>为商业空间匹配香型与扩香设备</h1>
        <p>按场景推荐常备香型、参考区间价与扩香机配置，最终报价以询价确认为准。</p>
      </section>

      <BannerCarousel
        banners={catalog.banners}
        onSelectTarget={(banner) => {
          if (banner.linkType !== 'scenario') {
            return;
          }

          const scenario = catalog.scenarios.find((item) => item.id === banner.targetId);
          if (scenario) {
            onSelectScenario(scenario);
          }
        }}
      />

      <section className="section">
        <div className="section-heading">
          <span>Step 1</span>
          <h2>选择你的商业场景</h2>
        </div>
        <div className="card-grid">
          {catalog.scenarios
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((scenario) => (
              <button className="scenario-card" type="button" key={scenario.id} onClick={() => onSelectScenario(scenario)}>
                <strong>{scenario.name}</strong>
                <span>{scenario.subtitle}</span>
              </button>
            ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span>Popular Packages</span>
          <h2>热门标准方案</h2>
        </div>
        <div className="package-list">
          {catalog.packages.map((packageOption) => (
            <article className="package-card" key={packageOption.id}>
              <h3>{packageOption.name}</h3>
              <p>{packageOption.description}</p>
              <button className="primary-button" type="button" onClick={() => onAddPackage(packageOption)}>
                加入询价清单
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
