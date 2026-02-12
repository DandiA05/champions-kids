import Link from "next/link";

export default function EventSingle() {
  const documentationImages = [
    { img: "01.jpg", title: "Kegiatan 1" },
    { img: "02.jpg", title: "Kegiatan 2" },
    { img: "03.jpg", title: "Kegiatan 3" },
    { img: "04.jpg", title: "Kegiatan 4" },
    { img: "05.jpg", title: "Kegiatan 5" },
    { img: "06.jpg", title: "Kegiatan 6" },
  ];

  return (
    <main>
      {/* Banner - Full Width */}
      {/* <section
        className="inner-banner bg-overlay-black-6 bg-holder"
        style={{
          backgroundImage: "url('/images/inner-banner/01.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
        }}
      >
        <div className="container-fluid px-4 px-md-5">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-banner-tittle">
                <h2>Event Single</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/event">Event</Link>
                  </li>
                  <li className="breadcrumb-item active">Event Single</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="space-pt"></section>

      {/* Blog Detail - Full Width */}
      <section className="space-ptb">
        <div className="container-fluid px-4 px-md-5">
          <div className="row">
            <div className="col-lg-12 mb-4 mb-lg-0">
              <div className="blog-detail">
                <div className="blog-post post-style-02 mb-4 mb-md-5">
                  <div className="blog-image">
                    <img
                      className="img-fluid w-100"
                      src="/images/blog/08.jpg"
                      alt="#"
                      style={{ maxHeight: "600px", objectFit: "cover" }}
                    />
                    <div className="blog-post-date">
                      <span className="date">30</span>
                      <span className="month">Oct</span>
                    </div>
                  </div>
                  <div className="blog-post-details">
                    <h5 className="blog-title mb-2">
                      <a href="#">
                        Every match is the last chance to prove yourself
                      </a>
                    </h5>
                    <p>
                      The best way is to develop and follow a plan. Start with
                      your goals in mind and then work backwards to develop the
                      plan. What steps are required to get you to the goals?
                      Make the plan as detailed as possible. Try to visualize
                      and then plan for, every possible setback. Commit the plan
                      to paper and then keep it with you at all times. Review it
                      regularly and ensure that every step takes you closer to
                      your Vision and Goals. If the plan doesn’t support the
                      vision then change it!
                    </p>
                    <p>
                      The price is something not necessarily defined as
                      financial. It could be time, effort, sacrifice, money or
                      perhaps, something else. The point is that we must be
                      fully aware of the price and be willing to pay it, if we
                      want to have success.
                    </p>
                  </div>
                </div>

                <div className="list">
                  <ul className="list-unstyled text-white">
                    <li>
                      <i className="fa-solid fa-check pe-lg-3 pe-2"></i>Review
                      it regularly and ensure that every step takes you closer
                      to your Vision and Goals.
                    </li>
                    <li>
                      <i className="fa-solid fa-check pe-lg-3 pe-2"></i>We carry
                      them with us like rocks in a knapsack, and then use them
                      to sabotage our success.
                    </li>
                    <li>
                      <i className="fa-solid fa-check pe-lg-3 pe-2"></i>
                      Execution is the single biggest factor in achievement, so
                      the faster and better your execution.
                    </li>
                    <li>
                      <i className="fa-solid fa-check pe-lg-3 pe-2"></i>Can the
                      particular activity be done later? Defer it! Can it be
                      done by someone else.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentasi Kegiatan - Portfolio Style 3 Grid */}
      <section className="space-pb">
        <div className="container-fluid px-4 px-md-5">
          <div className="row">
            <div className="col-12">
              <div className="section-title">
                <h2>Event Documentation</h2>
              </div>
            </div>
          </div>
          <div className="row g-4 popup-gallery">
            {documentationImages.map((item, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div className="portfolio portfolio-style-02">
                  <div className="portfolio-images">
                    <img
                      className="img-fluid w-100"
                      src={`/images/portfolio/${item.img}`}
                      alt={item.title}
                      style={{ height: "300px", objectFit: "cover" }}
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
      </section>
    </main>
  );
}
