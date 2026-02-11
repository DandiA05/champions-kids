import Link from "next/link";

export default function Team() {
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
                <h2>Team</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">team</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Player */}
      <section className="space-ptb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-title text-center mb-4 mb-md-5">
                <h2 className="mb-0 text-white">Our Player</h2>
                <p className="text-white mt-2">
                  Along with your plans, you should consider developing an
                  action orientation that will keep you motivated to move
                  forward at all times. This requires a little self-discipline,
                  but is a crucial component to achievement of any kind.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team">
                <div className="player">
                  <img
                    className="img-fluid"
                    src="/images/home-01/team-01.jpg"
                    alt=""
                  />
                </div>
                <div className="player-info">
                  <span className="player-number">10</span>
                  <div className="player-name">
                    <h3 className="text-uppercase title">
                      <Link href="/player-single">Jason McElwaine</Link>
                    </h3>
                    <span className="text-uppercase text-primary-psg">
                      Center
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team">
                <div className="player">
                  <img
                    className="img-fluid"
                    src="/images/home-01/team-02.jpg"
                    alt=""
                  />
                </div>
                <div className="player-info">
                  <span className="player-number">88</span>
                  <div className="player-name">
                    <h3 className="text-uppercase title">
                      <Link href="/player-single">Cherry Blossom</Link>
                    </h3>
                    <span className="text-uppercase text-primary-psg">
                      Defenders
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="team">
                <div className="player">
                  <img
                    className="img-fluid"
                    src="/images/home-01/team-03.jpg"
                    alt=""
                  />
                </div>
                <div className="player-info">
                  <span className="player-number">07</span>
                  <div className="player-name">
                    <h3 className="text-uppercase title">
                      <Link href="/player-single">Ginger Plant</Link>
                    </h3>
                    <span className="text-uppercase text-primary-psg">
                      Midfielders
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="team">
                <div className="player">
                  <img
                    className="img-fluid"
                    src="/images/home-01/team-04.jpg"
                    alt=""
                  />
                </div>
                <div className="player-info">
                  <span className="player-number">09</span>
                  <div className="player-name">
                    <h3 className="text-uppercase title">
                      <Link href="/player-single">Bridget Theriveaquai</Link>
                    </h3>
                    <span className="text-uppercase text-primary-psg">
                      Forwards
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <div className="team">
                <div className="player">
                  <img
                    className="img-fluid"
                    src="/images/home-01/team-05.jpg"
                    alt=""
                  />
                </div>
                <div className="player-info">
                  <span className="player-number">30</span>
                  <div className="player-name">
                    <h3 className="text-uppercase title">
                      <Link href="/player-single">Lynne Gwafranca</Link>
                    </h3>
                    <span className="text-uppercase text-primary-psg">
                      Center
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="team">
                <div className="player">
                  <img
                    className="img-fluid"
                    src="/images/home-01/team-06.jpg"
                    alt=""
                  />
                </div>
                <div className="player-info">
                  <span className="player-number">11</span>
                  <div className="player-name">
                    <h3 className="text-uppercase title">
                      <Link href="/player-single">Oscar Nommanee</Link>
                    </h3>
                    <span className="text-uppercase text-primary-psg">
                      Center
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section
        className="space-ptb position-relative"
        style={{ backgroundImage: "url(/images/home-01/bg-02.jpg)" }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center ">
            <div className="col-md-8 mb-4 mb-md-5 mb-lg-0">
              <div
                className="owl-carousel dots-bottom-center"
                data-nav-dots="true"
                data-nav-arrow="false"
                data-items="1"
                data-lg-items="1"
                data-md-items="1"
                data-sm-items="1"
                data-space="30"
                data-autoheight="true"
              >
                <div className="item">
                  <div className="testimonial text-center">
                    <div className="testimonial-star-icon">
                      <ul className="justify-content-center">
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-regular fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-regular fa-star text-white"></i>
                        </li>
                      </ul>
                    </div>

                    <div className="testimonial-content">
                      <p className="mb-0 text-white">
                        <i>
                          &quot;I love Potenza. I have gotten at least 50 times
                          the value from Potenza. I STRONGLY recommend Potenza
                          to EVERYONE interested in running a successful online
                          business!&quot;
                        </i>
                      </p>
                    </div>
                    <div className="testimonial-author">
                      <div className="testimonial-name">
                        <h6 className="author-tittle text-primary-psg">
                          Alice Williams
                        </h6>
                        <span>Services</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimonial text-center">
                    <div className="testimonial-star-icon">
                      <ul className="justify-content-center">
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-regular fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-regular fa-star text-white"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="testimonial-content">
                      <p className="mb-0 text-white">
                        <i>
                          &quot;I would gladly pay over 600 dollars for Potenza.
                          Since I invested in Potenza I made over 100,000
                          dollars profits. Your company is truly upstanding and
                          is behind its product 100%.&quot;
                        </i>
                      </p>
                    </div>
                    <div className="testimonial-author">
                      <div className="testimonial-name">
                        <h6 className="author-tittle text-primary-psg">
                          Harry Russell
                        </h6>
                        <span>Advisors</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="testimonial text-center">
                    <div className="testimonial-star-icon">
                      <ul className="justify-content-center">
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-solid fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-regular fa-star text-primary-psg"></i>
                        </li>
                        <li>
                          <i className="fa-regular fa-star text-white"></i>
                        </li>
                      </ul>
                    </div>

                    <div className="testimonial-content">
                      <p className="mb-0 text-white">
                        <i>
                          &quot;I love your system. Nice work on your Potenza.
                          Great job, I will definitely be ordering again! I
                          would like to personally thank you for your
                          outstanding product.&quot;
                        </i>
                      </p>
                    </div>
                    <div className="testimonial-author">
                      <div className="testimonial-name">
                        <h6 className="author-tittle text-primary-psg">
                          Paul Flavius
                        </h6>
                        <span>Finance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
