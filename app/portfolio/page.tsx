import Link from "next/link";

export default function Portfolio() {
  return (
    <main>
      {/* Banner */}
      <section
        className="inner-banner bg-overlay-black-6 bg-holder"
        style={{ backgroundImage: "url(/images/inner-banner/01.jpg)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-banner-tittle">
                <h2>Portfolio</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Portfolio</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <div className="space-ptb">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="filters-group mb-2 mb-lg-5">
                <button className="btn-filter active" data-group="all">
                  View All
                </button>
                <button className="btn-filter" data-group="france">
                  France
                </button>
                <button className="btn-filter" data-group="brazil">
                  Brazil
                </button>
                <button className="btn-filter" data-group="uk">
                  United Kingdom
                </button>
                <button className="btn-filter" data-group="marseille">
                  Marseille
                </button>
              </div>
              <div className="row g-4 popup-gallery">
                {/* Items */}
                {[
                  { groups: '["uk","france"]', img: "01.jpg" },
                  { groups: '["brazil","uk"]', img: "02.jpg" },
                  { groups: '["uk","brazil"]', img: "03.jpg" },
                  { groups: '["marseille","france"]', img: "04.jpg" },
                  { groups: '["uk","brazil"]', img: "05.jpg" },
                  { groups: '["marseille","france"]', img: "06.jpg" },
                  { groups: '["marseille","france"]', img: "07.jpg" },
                  { groups: '["marseille","france"]', img: "08.jpg" },
                  { groups: '["marseille","france"]', img: "09.jpg" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="col-md-6 col-lg-4"
                    data-groups={item.groups}
                  >
                    <div className="portfolio portfolio-style-02">
                      <div className="portfolio-images">
                        <img
                          className="img-fluid "
                          src={`/images/portfolio/${item.img}`}
                          alt=""
                        />
                        <div className="portfolio-info-02">
                          <a
                            className="portfolio-img popup-icon"
                            href={`/images/portfolio/${item.img}`}
                          >
                            <i className="fas fa-plus"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
