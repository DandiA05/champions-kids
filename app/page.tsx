import LogoSlide from "@/components/logo-slide";
import LatestEvents from "@/components/latest-events";
import TopPlayers from "@/components/top-players";
import LatestResults from "@/components/latest-results";
import MatchSchedule from "@/components/match-schedule";
import MatchCountdown from "@/components/match-countdown";

export default function Home() {
  return (
    <main>
      <section className="banner banner-01">
        <div id="main-slider" className="swiper-container">
          <div className="slider-social">
            <div className="container">
              <div className="slider-social-info"></div>
            </div>
          </div>
          <div className="swiper-wrapper  header-position">
            <div
              className="swiper-slide align-items-center d-flex slide-01 "
              style={{
                // backgroundImage: "url(/images/home-01/blog-01.jpg)",
                backgroundColor: "#CD6500",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="pattern-01"
                data-swiper-animation="fadeIn"
                data-duration="1.5s"
                data-delay="1.0s"
              >
                <img
                  className="img-fluid vert-move"
                  src="/images/home-01/pattern-01.png"
                  alt=""
                />
              </div>
              <div
                className="pattern-03"
                data-swiper-animation="fadeIn"
                data-duration="1.5s"
                data-delay="1.0s"
              >
                <img
                  className="img-fluid vert-move"
                  src="/images/home-01/pattern-03.png"
                  alt=""
                />
              </div>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 col-lg-6 position-relative">
                    <h1
                      className="text-white text-start"
                      data-swiper-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay="1.0s"
                    >
                      Football Is Just Awesome
                    </h1>
                    <p
                      className="text-white"
                      data-swiper-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay="2.0s"
                    >
                      Ajang pengembangan bakat sepak bola usia dini terbaik.
                      Kami membantu mewujudkan mimpi sang juara melalui
                      pelatihan profesional dan kurikulum sepak bola modern.
                    </p>
                    {/* <a
                      href="/about-us"
                      className="btn btn-white mt-3 mt-md-4"
                      data-swiper-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay="3.0s"
                    >
                      Read More
                    </a> */}
                    <div
                      className="pattern-02"
                      data-swiper-animation="fadeIn"
                      data-duration="5.5s"
                      data-delay="1.0s"
                    >
                      <img
                        className="custom-animation img-fluid"
                        src="/images/home-01/pattern-02.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 d-none d-lg-flex">
                    <div className="banner-img">
                      <img
                        className="img-fluid hori-move"
                        src="/images/home-01/banner-img.png"
                        data-swiper-animation="fadeIn"
                        data-duration="5.0s"
                        data-delay="1.0s"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="swiper-slide align-items-center d-flex slide-02"
              style={{
                // backgroundImage: "url(/images/home-01/banner-bg.jpg)",
                backgroundColor: "#CD6500",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="pattern-01"
                data-swiper-animation="fadeIn"
                data-duration="1.5s"
                data-delay="1.0s"
              >
                <img
                  className="img-fluid vert-move"
                  src="/images/home-01/pattern-01.png"
                  alt=""
                />
              </div>
              <div
                className="pattern-03"
                data-swiper-animation="fadeIn"
                data-duration="1.5s"
                data-delay="1.0s"
              >
                <img
                  className="img-fluid vert-move"
                  src="/images/home-01/pattern-03.png"
                  alt=""
                />
              </div>
              <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                  <div className="col-12 col-lg-4 col-xl-4 col-xxl-6 d-none position-relative d-lg-flex justify-content-center">
                    <div className="banner-img">
                      <img
                        className="img-fluid vert-move"
                        src="/images/home-01/banner-img-02.png"
                        data-swiper-animation="fadeIn"
                        data-duration="5.0s"
                        data-delay="1.0s"
                        alt=""
                      />
                    </div>
                    <div
                      className="pattern-04"
                      data-swiper-animation="fadeIn"
                      data-duration="5.5s"
                      data-delay="1.0s"
                    >
                      <img
                        className="custom-animation"
                        src="/images/home-01/star-icon02.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 col-xl-6 col-xxl-6 position-relative">
                    <h1
                      className="text-white text-start"
                      data-swiper-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay="1.0s"
                    >
                      Football for the kicks
                    </h1>
                    <p
                      className="text-white"
                      data-swiper-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay="2.0s"
                    >
                      Bentuk karakter, disiplin, dan kerja sama tim melalui
                      olahraga. Bergabunglah bersama Champions Kids dan rasakan
                      pengalaman latihan sepak bola yang seru dan mengedukasi.
                    </p>
                    {/* <a
                      href="about-us.html"
                      className="btn btn-white mt-3 mt-md-4"
                      data-swiper-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay="3.0s"
                    >
                      Read More
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-12 position-relative text-center">
                <div className="pagination-button">
                  <div
                    className="swiper-button-prev"
                    tabIndex={0}
                    role="button"
                    aria-label="Previous slide"
                  >
                    Prev
                  </div>
                  <div
                    className="swiper-button-next"
                    tabIndex={0}
                    role="button"
                    aria-label="Next slide"
                  >
                    Next
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MatchCountdown />

      <section className="space-ptb about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <div className="about-img fadeInUp animated">
                <img
                  className="img-fluid"
                  src="/images/home-01/about.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="section-title mb-4 mb-lg-5">
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
                  <div className="counter mb-4 mb-md-0">
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
            className="img-fluid vert-move"
            src="/images/home-01/pattern-04.png"
            alt=""
          />
        </div>
      </section>

      <LatestResults />

      <MatchSchedule />

      {/* TOP PLAYERS NOW */}
      <TopPlayers />

      {/* LATEST EVENTS */}
      <LatestEvents />

      {/* <div className="client-logo py-5 bg-primary-psg">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <div
                className="owl-carousel"
                data-nav-dots="false"
                data-nav-arrow="false"
                data-items="5"
                data-lg-items="5"
                data-md-items="3"
                data-sm-items="3"
                data-xs-items="2"
                data-xx-items="1"
                data-space="0"
                data-autoheight="true"
              >
                <div className="item">
                  <img
                    className="img-fluid"
                    src="/images/home-01/client-logo/01.png"
                    alt=""
                  />
                </div>
                <div className="item">
                  <img
                    className="img-fluid"
                    src="/images/home-01/client-logo/02.png"
                    alt=""
                  />
                </div>
                <div className="item">
                  <img
                    className="img-fluid"
                    src="/images/home-01/client-logo/03.png"
                    alt=""
                  />
                </div>
                <div className="item">
                  <img
                    className="img-fluid"
                    src="/images/home-01/client-logo/04.png"
                    alt=""
                  />
                </div>
                <div className="item">
                  <img
                    className="img-fluid"
                    src="/images/home-01/client-logo/05.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <LogoSlide />
    </main>
  );
}
