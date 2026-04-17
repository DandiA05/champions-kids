import Link from "next/link";

export default function AboutUs() {
  return (
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
              <h2 className="mb-4">About Us</h2>
              <p className="text-white">
                Champion Kids adalah akademi sepak bola yang berfokus pada
                pengembangan karakter dan bakat anak sejak usia dini. Kami
                percaya bahwa setiap anak memiliki potensi untuk menjadi
                juara, tidak hanya di lapangan hijau, tetapi juga dalam
                kehidupan sehari-hari.
              </p>
              <p className="text-white">
                Ajang pengembangan bakat sepak bola usia dini terbaik. Kami
                membantu mewujudkan mimpi sang juara melalui pelatihan
                profesional dan kurikulum sepak bola modern.
              </p>
              <Link
                href="/about-us"
                className="btn btn-light text-black btn-sm hover:text-black"
              >
                Read More
              </Link>
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
  );
}
