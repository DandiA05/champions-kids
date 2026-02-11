export default function OurHistory() {
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
                <h2>Our History</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Our History</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Welcome */}
      <section className="space-ptb about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-5 mb-4 mb-md-5 mb-lg-0">
              <div className="about-img">
                <img
                  className="img-fluid"
                  src="/images/history/club.png"
                  alt=""
                />
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="section-title ps-lg-5">
                <h2 className="mb-4">Welcome to the ligers club</h2>
                <p className="text-white">
                  The first thing to remember about success is that it is a
                  process – nothing more, nothing less. There is really no magic
                  to it and it’s not reserved only for a select few people. As
                  such, success really has nothing to do with luck, coincidence
                  or fate. It really comes down to understanding the steps in
                  the process and then executing on those steps.
                </p>
                <p className="text-white">
                  We also know those epic stories, those modern-day legends
                  surrounding the early failures of such supremely successful
                  folks as Michael Jordan and Bill Gates. We can look a bit
                  further back in time to Albert Einstein or even further back
                  to Abraham Lincoln. What made each of these people so
                  successful? Motivation.
                </p>
                <p className="mb-0 text-white">
                  Motivation is not an accident or something that someone else
                  can give you — you are the only one with the power to motivate
                  you. Motivation cannot be an external force, it must come from
                  within as the natural product of your desire to achieve
                  something and your belief that you are capable to succeed at
                  your goal.
                </p>
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

      {/* Club History Timeline */}
      <section
        className="space-ptb bg-holder"
        style={{
          backgroundImage: "url(/images/history/bg-01.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container position-relative">
          <div className="row">
            <div className="col-12">
              <div className="section-title text-center mb-5">
                <h2 className="mb-0 text-white">Club History</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="history-info">
                <div className="history-info-inner">
                  <div className="history-info-item">
                    <div className="history-info-img">
                      <img
                        className="img-fluid"
                        src="/images/history/01.jpg"
                        alt=""
                      />
                    </div>
                    <div className="history-info-number">
                      <div className="time">
                        <div className="text-center">
                          <span className="month">October</span>
                          <span className="year">2012</span>
                        </div>
                      </div>
                    </div>
                    <div className="history-info-content">
                      <h4 className="history-info-title mb-2">
                        <a href="#">Training Center Opening</a>
                      </h4>
                      <p className="text-white">
                        This path is just like today, with one difference: you
                        have 10 fewer years remaining in your life. I want you
                        to think about how you will feel in 10 years if you
                        continue doing the exact same things you have done to
                        date. What will your daily life be like?
                      </p>
                    </div>
                  </div>
                  <div className="history-info-item">
                    <div className="history-info-img order-md-3">
                      <img
                        className="img-fluid"
                        src="/images/history/02.jpg"
                        alt=""
                      />
                    </div>
                    <div className="history-info-number order-md-2">
                      <div className="time">
                        <div className="text-center">
                          <span className="month">April</span>
                          <span className="year">2018</span>
                        </div>
                      </div>
                    </div>
                    <div className="history-info-content order-md-1">
                      <h4 className="history-info-title mb-2">
                        <a href="#">Champions of europe 2018 - 2019</a>
                      </h4>
                      <p className="text-white">
                        This path is just like today, with one difference: you
                        have 10 fewer years remaining in your life. I want you
                        to think about how you will feel in 10 years if you
                        continue doing the exact same things you have done to
                        date. What will your daily life be like?
                      </p>
                    </div>
                  </div>
                  <div className="history-info-item pb-0">
                    <div className="history-info-img">
                      <img
                        className="img-fluid"
                        src="/images/history/03.jpg"
                        alt=""
                      />
                    </div>
                    <div className="history-info-number">
                      <div className="time">
                        <div className="text-center">
                          <span className="month">January</span>
                          <span className="year">2023</span>
                        </div>
                      </div>
                    </div>
                    <div className="history-info-content">
                      <h4 className="history-info-title mb-2">
                        <a href="#">Champions of champions-league 2022-2023 </a>
                      </h4>
                      <p className="mb-0 text-white">
                        This path is just like today, with one difference: you
                        have 10 fewer years remaining in your life. I want you
                        to think about how you will feel in 10 years if you
                        continue doing the exact same things you have done to
                        date. What will your daily life be like?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logo */}
      <div className="client-logo py-5 bg-primary-psg">
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
                data-space="150"
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
      </div>
    </main>
  );
}
