export default function LogoSlide() {
  return (
    <div className="client-logo py-5 bg-primary-pgs">
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
  );
}
