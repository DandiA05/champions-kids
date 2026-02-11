import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="banner banner-01">
        <div id="main-slider" className="swiper-container">
          <div className="slider-social">
            <div className="container">
              <div className="slider-social-info">
                <ul className="list-unstyled mb-0">
                  <li>
                    <a href="#"> FB </a>
                  </li>
                  <li>
                    <a href="#"> IG </a>
                  </li>
                  <li>
                    <a href="#"> TW </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="swiper-wrapper">
            <div
              className="swiper-slide align-items-center d-flex slide-01 header-position"
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
                      Lorem ipsum dolor sit amet, con secte tur adip si cin
                      elit, do eius mod tempor in cidi dut ut la bore magna
                      aliquat enim ad.
                    </p>
                    <a
                      href="about-us.html"
                      className="btn btn-white mt-3 mt-md-4"
                      data-swiper-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay="3.0s"
                    >
                      Read More
                    </a>
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
              className="swiper-slide align-items-center d-flex slide-02 header-position"
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
                      Lorem ipsum dolor sit amet, con secte tur adip si cin
                      elit, do eius mod tempor in cidi dut ut la bore magna
                      aliquat enim ad.
                    </p>
                    <a
                      href="about-us.html"
                      className="btn btn-white mt-3 mt-md-4"
                      data-swiper-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay="3.0s"
                    >
                      Read More
                    </a>
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

      <section className="tournament-countdown">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-xl-4 col-lg-12 d-flex justify-content-center justify-content-xl-start text-center text-xl-start mb-4 mb-xl-0">
              <div className="tournament-title">
                <h2>Tournament starts in</h2>
                <span className="text-white">Semi-Final</span>
              </div>
            </div>
            <div className="col-xl-4 col-lg-12 justify-content-lg-center mb-4 mb-xl-0">
              <div className="countdown-main">
                <div className="countdown">
                  <span className="days">00</span>
                  <p className="days_ref">Days</p>
                </div>
                <div className="countdown">
                  <span className="hours">00</span>
                  <p className="hours_ref">Hrs</p>
                </div>
                <div className="countdown">
                  <span className="minutes">00</span>
                  <p className="minutes_ref">Min</p>
                </div>
                <div className="countdown">
                  <span className="seconds">00</span>
                  <p className="seconds_ref">Sec</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-12">
              <div className="upcoming-match d-lg-flex align-items-center justify-content-center justify-content-xl-end">
                <div className="match-team">
                  <img
                    className="img-fluid"
                    src="/images/home-01/team-logo-01.png"
                    alt=""
                  />
                </div>
                <h2 className="px-4 px-lg-5">V.S</h2>
                <div className="match-team">
                  <img
                    className="img-fluid"
                    src="/images/home-01/team-logo-02.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="space-ptb latest-results">
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
                  src="/images/home-01/team-logo-03.png"
                  alt=""
                />
              </div>
            </div>
            <div className="col-md-12 col-lg-4 text-center mb-4 mb-lg-0">
              <h5>Premier League</h5>
              <h2>
                <span>03</span> : <span>02</span>
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
                  src="/images/home-01/team-logo-04.png"
                  alt=""
                />
                <h3>Cheetahs</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-ptb match-schedule overlay-top">
        <div className="container bg-light p-5">
          <div className="row">
            <div className="col-md-12 ">
              <div className="section-title mb-5">
                <h2>Match Schedule</h2>
              </div>
            </div>
            <div className="col-sm-12">
              <div
                className="owl-carousel arrow-top-right match-schedule-slider"
                data-nav-dots="false"
                data-nav-arrow="true"
                data-items="3"
                data-xl-items="2"
                data-lg-items="2"
                data-md-items="2"
                data-sm-items="2"
                data-xs-items="1"
                data-xx-items="1"
                data-autoheight="true"
              >
                <div className="item">
                  <div className="upcoming-match">
                    <div className="match-team">
                      <img
                        className="img-fluid"
                        src="/images/home-01/team-logo-05.png"
                        alt=""
                      />
                    </div>
                    <div className="match-date-time">
                      <span className="match-time">1:30 PM</span>
                      <span className="match-date">
                        <i className="fa-solid fa-calendar-days"></i>Mar 19 2023
                      </span>
                    </div>
                    <div className="match-team">
                      <img
                        className="img-fluid"
                        src="/images/home-01/team-logo-06.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="upcoming-match">
                    <div className="match-team">
                      <img
                        className="img-fluid"
                        src="/images/home-01/team-logo-05.png"
                        alt=""
                      />
                    </div>
                    <div className="match-date-time">
                      <span className="match-time">2:45 PM</span>
                      <span className="match-date">
                        <i className="fa-solid fa-calendar-days"></i>Mar 25 2023
                      </span>
                    </div>
                    <div className="match-team">
                      <img
                        className="img-fluid"
                        src="/images/home-01/team-logo-07.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                {/* More items would be repeated here as per template... */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-pb classic-players px-0 px-md-5">
        <div className="container-fluid">
          <div className="row position-relative">
            <div className="col-lg-4 pe-0 pe-lg-5">
              <div className="section-title">
                <h2 className="mb-0 text-white">Top Players Nows</h2>
                <p className="text-white mt-2">
                  For those of you who are serious about having more, doing
                  more, giving more and being more, success is achievable with
                  some understanding of what to do, some discipline around
                  planning and execution of those plans and belief that you can
                  achieve your desires.{" "}
                </p>
              </div>
            </div>
            <div className="col-lg-8 mt-5 mt-lg-0">
              <div
                className="owl-carousel"
                data-nav-dots="false"
                data-nav-arrow="true"
                data-items="2"
                data-xl-items="2"
                data-lg-items="1"
                data-md-items="1"
                data-sm-items="1"
                data-xs-items="1"
                data-xx-items="1"
                data-autoheight="true"
              >
                <div className="item  mb-4 mb-lg-0">
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
                        <a href="/player-single">Jason McElwaine</a>
                      </h3>
                      <span className="text-uppercase text-primary">
                        Center
                      </span>
                    </div>
                  </div>
                </div>
                <div className="item mb-4 mb-lg-0">
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
                        <a href="/player-single">Cherry Blossom</a>
                      </h3>
                      <span className="text-uppercase text-primary">
                        Defenders
                      </span>
                    </div>
                  </div>
                </div>
                <div className="item mb-4 mb-lg-0">
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
                        <a href="/player-single">Ginger Plant</a>
                      </h3>
                      <span className="text-uppercase text-primary">
                        Midfielders
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-ptb latest-news latest-news-pattern">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center">
                <h2 className="mb-0 text-white">Latest Events</h2>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="blog-post post-style-01">
                <div className="blog-image">
                  <img
                    className="img-fluid"
                    src="/images/home-01/blog/01.jpg"
                    alt=""
                  />
                  <div className="blog-post-date">
                    <span className="date">19</span>
                    <span className="month">Jan</span>
                  </div>
                </div>
                <div className="blog-post-details">
                  <h5 className="blog-title mb-2">
                    <Link href="/event-single">
                      A team above all. Above all a team.
                    </Link>
                  </h5>
                  <p className="text-white mb-4">
                    Trying to go through life without clarity is similar to
                    sailing a rudder-less ship – no good thing can or will
                    happen!
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4 mb-lg-0">
              <div className="blog-post post-style-01">
                <div className="blog-image">
                  <img
                    className="img-fluid"
                    src="/images/home-01/blog/02.jpg"
                    alt=""
                  />
                  <div className="blog-post-date">
                    <span className="date">25</span>
                    <span className="month">Jan</span>
                  </div>
                </div>
                <div className="blog-post-details">
                  <h5 className="blog-title mb-2">
                    <Link href="/event-single">
                      Championships are won at practice.
                    </Link>
                  </h5>
                  <p className="text-white mb-4">
                    The best way is to develop and follow a plan. Start with
                    your goals in mind and then work backwards to develop the
                    plan.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="blog-post post-style-01">
                <div className="blog-image">
                  <img
                    className="img-fluid"
                    src="/images/home-01/blog/03.jpg"
                    alt=""
                  />
                  <div className="blog-post-date">
                    <span className="date">02</span>
                    <span className="month">Feb</span>
                  </div>
                </div>
                <div className="blog-post-details">
                  <h5 className="blog-title mb-2">
                    <Link href="/event-single">We have a mission to win</Link>
                  </h5>
                  <p className="text-white mb-4">
                    It is truly amazing the damage that we, as parents, can
                    inflict on our children. So why do we do it? For the most
                    part,
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </main>
  );
}
