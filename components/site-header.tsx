import Link from "next/link";

interface SiteHeaderProps {
  isHomePage?: boolean;
}

export function SiteHeader({ isHomePage = false }: SiteHeaderProps) {
  return (
    <>
      <header
        className={`header header-sticky default inner-page-header ${
          !isHomePage ? "inner-page-header" : ""
        }`}
      >
        <nav className="navbar navbar-static-top navbar-expand-xl">
          <div className="container-fluid main-header position-relative">
            <button
              type="button"
              className="navbar-toggler"
              data-bs-toggle="collapse"
              data-bs-target=".navbar-collapse"
            >
              <i className="fas fa-align-left"></i>
            </button>
            <Link className="navbar-brand" href="/">
              <img
                width={180}
                height={60}
                className="logo img-fluid"
                src="/images/logo-champions-kids.png"
                alt="logo"
                style={{
                  objectFit: "contain",
                }}
              />
              <img
                width={180}
                height={60}
                className="sticky-logo img-fluid"
                src="/images/logo-champions-kids.png"
                alt="logo"
              />
            </Link>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                {/* <li className="dropdown nav-item">
                  <Link className="nav-link" href="/about-us">
                    About us
                  </Link>
                </li> */}
                {/* <li className="dropdown nav-item">
                  <Link className="nav-link" href="/our-history">
                    Our History
                  </Link>
                </li> */}
                <li className="dropdown nav-item">
                  <Link className="nav-link" href="/team">
                    Team
                  </Link>
                </li>

                <li className="dropdown nav-item">
                  <Link className="nav-link" href="/event">
                    Event
                  </Link>
                </li>
              </ul>
            </div>
            <div className="add-listing">
              <div className="side-menu">
                <a
                  href="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  <img src="/images/svg/menu.svg" alt="#" />
                  <img
                    className="menu-dark"
                    src="/images/svg/menu.svg"
                    alt="#"
                  />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div
        className="offcanvas offcanvas-end offcanvas-sidebar-menu"
        tabIndex={-1}
        id="offcanvasRight"
      >
        <div className="offcanvas-header text-end justify-content-end p-4">
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body p-4 p-sm-5 d-flex align-content-between flex-wrap justify-content-center">
          <div className="sidebar-menu">
            <div className="sidebar-logo">
              <Link href="/">
                <img
                  className="logo img-fluid"
                  src="/images/logo.svg"
                  alt="logo"
                  style={{
                    objectFit: "contain",
                    height: "300px",
                    width: "100%",
                  }}
                />
              </Link>
            </div>
            <div className="section-title mt-5">
              <h3 className="title text-white">About us</h3>
              <p className="text-white">
                Get the oars in the water and start rowing. Execution is the
                single biggest factor in achievement so the faster and better
                your execution.
              </p>
            </div>
            <div className="mt-5">
              <h3 className="mb-3 text-white">Contact Info</h3>
              <p className="text-white">
                17504 Carlton Cuevas Rd,
                <br /> Gulfport, MS, 39503
              </p>
              <h2 className="text-white">1-800-555-500</h2>
            </div>
            <div className="social-icon mt-5">
              <ul>
                <li>
                  <a href="#">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
