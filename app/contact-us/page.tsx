export default function ContactUs() {
  return (
    <main>
      <section
        className="inner-banner bg-overlay-black-6 bg-holder"
        style={{ backgroundImage: "url(/images/inner-banner/01.jpg)" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-banner-tittle">
                <h2>Contact us</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Contact us</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-ptb">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="message-info bg-primary-psg">
                <div className="section-title">
                  <h3>Get in touch with us</h3>
                  <p className="mb-0 text-white">
                    One of the main areas that I work on with my clients is
                    shedding these non-supportive beliefs and replacing
                    accomplish their desires.
                  </p>
                </div>

                <div className="feature-item feature-info-style-01">
                  <div className="feature-icon">
                    <object
                      type="image/svg+xml"
                      data="/images/svg/email.svg"
                      className="icon"
                    ></object>
                  </div>
                  <div className="feature-content">
                    <h5 className="feature-title">Address</h5>
                    <p className="mb-0">
                      214 West Arnold St. New York, NY 10002
                    </p>
                  </div>
                </div>

                <div className="feature-item feature-info-style-01">
                  <div className="feature-icon">
                    <object
                      type="image/svg+xml"
                      data="/images/svg/phone.svg"
                      className="icon"
                    ></object>
                  </div>
                  <div className="feature-content">
                    <h5 className="feature-title">Phone</h5>
                    <span>+0123 456 789</span>
                    <span>+704 279 1249</span>
                  </div>
                </div>

                <div className="feature-item feature-info-style-01 mb-0">
                  <div className="feature-icon">
                    <object
                      type="image/svg+xml"
                      data="/images/svg/location.svg"
                      className="icon"
                    ></object>
                  </div>
                  <div className="feature-content">
                    <h5 className="feature-title">Email</h5>
                    <span>support@vehicle.com</span>
                    <span>letstalk@vehicle.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="contact-us-form">
                <div className="section-title">
                  <h3>We&apos;d love to hear from you</h3>
                  <p>
                    Get the oars in the water and start rowing. Execution is the
                    single biggest factor in achievement, the quicker you will
                    get to the goals!
                  </p>
                </div>
                <form>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        id="first-name"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Your Email"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <select className="form-control basic-select">
                        <option value="1">Country</option>
                        <option value="ARM">Armenia</option>
                        <option value="AR">Argentina</option>
                        <option value="AM">Armenia</option>
                        <option value="AW">Aruba</option>
                        <option value="AU">Australia</option>
                        {/* More options would go here */}
                      </select>
                    </div>
                    <div className="col-lg-12">
                      <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Message"
                      ></textarea>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a href="" className="btn btn-primary">
                      Send Message
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-pb">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="feature-item feature-info-style-02 feature-info-center">
                <div className="feature-icon">
                  <object
                    type="image/svg+xml"
                    data="/images/svg/shipping.svg"
                    className="icon"
                  ></object>
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">Free Shipping</h4>
                  <p className="mb-0">
                    Free shipping on all Local Area order above $200
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-item feature-info-style-02 feature-info-center">
                <div className="feature-icon">
                  <object
                    type="image/svg+xml"
                    data="/images/svg/headphone.svg"
                    className="icon"
                  ></object>
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">24/7 Support</h4>
                  <p className="mb-0">
                    Our Customer Support Team is ready and available to help.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="feature-item feature-info-style-02 feature-info-center mb-0">
                <div className="feature-icon">
                  <object
                    type="image/svg+xml"
                    data="/images/svg/return-customer.svg"
                    className="icon"
                  ></object>
                </div>
                <div className="feature-content">
                  <h4 className="feature-title">30 Days Return</h4>
                  <p className="mb-0">
                    Product any fault within 30 days for an exchange.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 p-0">
              <iframe
                className="w-100 border-0 map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8402891185456!2d144.95373631584474!3d-37.81720974201458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sin!4v1598418458630!5m2!1sen!2sin"
                style={{ border: 0, width: "100%", height: "500px" }}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
