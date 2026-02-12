import LogoSlide from "@/components/logo-slide";

export default function AboutUs() {
  return (
    <main>
      {/* <section
        className="inner-banner bg-overlay-black-6 bg-holder"
        style={{ backgroundImage: "url(/images/inner-banner/01.jpg)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-banner-tittle">
                <h2>About Us</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active">about us</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section className="space-pt"></section>

      <section className="space-ptb about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <div className="about-img">
                <img
                  className="img-fluid"
                  src="/images/home-01/about.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="section-title  mb-4 mb-lg-5">
                <h2 className="mb-4">About The Football</h2>
                <p className="text-white">
                  Positive pleasure-oriented goals are much more powerful
                  motivators than negative fear-based ones. Although each is
                  successful separately, the right combination of both is the
                  most powerful motivational force known to humankind.
                </p>
                <p className="text-white">
                  Give yourself the power of responsibility. Remind yourself the
                  only thing stopping you is yourself.
                </p>
              </div>

              <div className="row counter-box">
                <div className="col-sm-4">
                  <div className="counter mb-4 mb-lg-0">
                    <div className="counter-number">
                      <p>Games</p>
                      <div className="counter-text">
                        <h2
                          className="timer mb-0"
                          data-to="200"
                          data-speed="2000"
                        >
                          200
                        </h2>
                        <span>+</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="counter mb-4 mb-lg-0">
                    <div className="counter-number">
                      <p>Goals</p>
                      <div className="counter-text">
                        <h2
                          className="timer mb-0"
                          data-to="179"
                          data-speed="2000"
                        >
                          179
                        </h2>
                        <span>+</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <div className="counter mb-0">
                    <div className="counter-number">
                      <p>Assist</p>
                      <div className="counter-text">
                        <h2
                          className="timer mb-0"
                          data-to="146"
                          data-speed="2000"
                        >
                          146
                        </h2>
                        <span>+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="about-bg">
          <img
            className="img-fluid"
            src="/images/home-01/pattern-04.png"
            alt=""
          />
        </div>
      </section>

      <section className="space-ptb latest-results latest-results-about">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center">
                <h2 className="mb-0 text-white">Latest Results</h2>
              </div>
            </div>
          </div>
          <div className="row mt-5 align-items-center">
            <div className="col-md-12 col-lg-4 text-center mb-4 mb-lg-0">
              <div className="d-lg-flex align-items-center">
                <h3>Ligers</h3>
                <img
                  className="img-fluid ms-0 ms-lg-4 ms-xl-5"
                  src="/images/home-01/team-logo-09.png"
                  alt=""
                />
              </div>
            </div>
            <div className="col-md-12 col-lg-4 text-center mb-4 mb-lg-0">
              <h5>Premier League</h5>
              <h2>
                <span>02</span> : <span>01</span>
              </h2>
              <div className="time-location">
                <span className="time">
                  <i className="fa-regular fa-clock"></i>1:30 PM
                </span>
                <span className="location">
                  <i className="fa-solid fa-location-dot"></i>Maracanã Stadium
                </span>
              </div>
            </div>
            <div className="col-md-12 col-lg-4 text-center">
              <div className="d-lg-flex align-items-center justify-content-end">
                <img
                  className="img-fluid me-0 me-lg-4 me-xl-5"
                  src="/images/home-01/team-logo-10.png"
                  alt=""
                />
                <h3>Cheetahs</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-pt"></div>

      <section className="space-pb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-title text-center">
                <h2 className="mb-0 text-white">Classic Players</h2>
                <p className="text-white mt-2">
                  For those of you who are serious about having more, doing
                  more, giving more and being more, success is achievable with
                  some understanding of what to do, some discipline around
                  planning and execution of those plans and belief that you can
                  achieve your desires.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 mt-4 mt-md-5">
              <div
                className="owl-carousel arrow-top-right"
                data-nav-dots="false"
                data-nav-arrow="false"
                data-items="3"
                data-xl-items="3"
                data-lg-items="2"
                data-md-items="1"
                data-sm-items="1"
                data-xs-items="1"
                data-xx-items="1"
                data-autoheight="true"
              >
                <div className="item">
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
                          <a href="#">Jason McElwaine</a>
                        </h3>
                        <span className="text-uppercase text-primary-psg">
                          Center
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Additional players would ideally be mapped or added here, just including one more for structure */}
                <div className="item">
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
                          <a href="#">Cherry Blossom</a>
                        </h3>
                        <span className="text-uppercase text-primary-psg">
                          Defenders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
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
                          <a href="#">Ginger Plant</a>
                        </h3>
                        <span className="text-uppercase text-primary-psg">
                          Midfielders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="space-ptb position-relative"
        style={{ backgroundImage: "url(/images/home-01/bg-02.jpg)" }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center ">
            <div className="col-md-8 mb-4 mb-md-5 mb-lg-0">
              {/* Testimonials Carousel */}
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
                    {/* Content omitted for brevity, structure implied */}
                    <div className="testimonial-content">
                      <p className="mb-0 text-white">
                        <i>
                          &quot;I love Potenza. I have gotten at least 50 times
                          the value from Potenza. I STRONGLY recommend Potenza
                          to EVERYONE interested in running a successful online
                          business!&quot;
                        </i>{" "}
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogoSlide />
    </main>
  );
}
