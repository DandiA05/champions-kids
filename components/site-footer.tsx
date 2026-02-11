import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="min-footer">
        <div className="container">
          <div className="row align-items-center justify-content-between mb-4 mb-md-5">
            <div className="col-md-12 col-lg-4 mb-4 mb-lg-0"></div>
            <div className="col-md-12 col-lg-4 text-center mb-4 mb-lg-0">
              <Link href="/" className="footer-logo">
                <img
                  width={160}
                  height={55}
                  className="logo img-fluid"
                  src="/images/logo.svg"
                  alt="logo"
                  style={{
                    objectFit: "contain",
                    height: "300px",
                    width: "300px",
                  }}
                />
              </Link>
            </div>
            <div className="col-md-12 col-lg-4"></div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <h5 className="footer-title text-primary-psg">
                Contact Information
              </h5>
              <ul className="contact-info">
                <li>
                  <i className="fas fa-map-marker-alt"></i>{" "}
                  <span> 17504 Carlton Cuevas Rd, Gulfport, MS, 39503 </span>
                </li>
                <li className="contact-email">
                  <i className="far fa-envelope"></i>
                  <span>letstalk@sports.com</span>
                </li>
                <li>
                  <i className="fa-solid fa-phone"></i>
                  <span>(007) 123 456 7890</span>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-6 text-lg-center mb-4 mb-lg-0">
              <h5 className="footer-title text-primary-psg">About Our Team</h5>
              <p className="text-white mb-0">
                For those of you who are serious about having more, doing more,
                giving more and being more, success is achievable with some
                understanding of what to do serious about having more, doing
                more.
              </p>
            </div>
            <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
              <h5 className="footer-title text-primary-psg">Useful Links</h5>
              <div className="footer-menu">
                <ul>
                  <li>
                    <a href="#">Portfolio</a>
                  </li>
                  <li>
                    <a href="#">Shop</a>
                  </li>
                  <li>
                    <a href="#">Match Schedule</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title text-primary-psg">Need help?</h5>
              <div className="footer-menu">
                <ul>
                  <li>
                    <a href="#">Faqs</a>
                  </li>
                  <li>
                    <a href="#">Team</a>
                  </li>
                  <li>
                    <a href="#">Contact us</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center copyright">
            <div className="col-12 col-md-6 text-center text-md-start">
              <div className="copyright-menu footer-menu">
                <ul className="mb-0 justify-content-center justify-content-md-start list-unstyled">
                  <li>
                    <a href="#">About us</a>
                  </li>
                  <li>
                    <a href="#">Events</a>
                  </li>
                  <li>
                    <a href="#">Our History</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end mt-2 mt-md-0">
              <p className="mb-0">
                {" "}
                &copy; Copyright{" "}
                <span id="copyright"> {new Date().getFullYear()}</span>{" "}
                <a href="/"> PGSports </a> All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
