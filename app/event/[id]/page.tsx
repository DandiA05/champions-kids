import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EventDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const event = await db.getEventById(id);

  if (!event) {
    notFound();
  }

  const date = new Date(event.event_date);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });

  return (
    <main>
      <section className="space-pt"></section>

      {/* Blog Detail */}
      <section className="space-ptb">
        <div className=" px-4 px-md-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 popup-gallery">
              <div className="row mb-5">
                <div className="col-12 text-start">
                  <Link
                    href="/event"
                    className="btn btn-sm btn-outline-light text-white d-inline-flex align-items-center gap-2"
                    style={{
                      borderRadius: "20px",
                      padding: "8px 20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Back to All Events
                  </Link>
                </div>
              </div>

              <div className="blog-detail">
                <div className="blog-post post-style-02 mb-4 mb-md-5">
                  <div className="blog-image shadow-lg">
                    <div className="portfolio portfolio-style-02">
                      <div className="portfolio-images">
                        <img
                          className="img-fluid w-100"
                          src={event.banner_url || "/images/blog/08.jpg"}
                          alt={event.title}
                          style={{
                            maxHeight: "500px",
                            objectFit: "cover",
                            borderRadius: "15px",
                          }}
                        />
                        <div className="portfolio-info-02">
                          <a
                            href={event.banner_url || "/images/blog/08.jpg"}
                            className="portfolio-img popup-icon"
                          >
                            <i className="fas fa-plus"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="blog-post-date shadow">
                      <span className="date">{day}</span>
                      <span className="month">{month}</span>
                    </div>
                  </div>
                  <div className="blog-post-details mt-5">
                    <div className="event-meta mb-3 d-flex align-items-center gap-3">
                      <span className="text-primary-psg font-weight-bold">
                        <i className="fa-regular fa-calendar-check me-2"></i>
                        Event Date:{" "}
                        {date.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-white opacity-50">|</span>
                      <span className="text-white opacity-50 small">
                        Published on:{" "}
                        {new Date(event.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    <h1 className="blog-title mb-5">
                      <span className="text-white display-5 fw-bold">
                        {event.title}
                      </span>
                    </h1>

                    {/* Render Rich Text Description */}
                    <div
                      className="text-white quill-content p-4 p-md-5"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                      style={{
                        fontSize: "1.2rem",
                        lineHeight: "1.9",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                        marginBottom: "3rem",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentasi Kegiatan */}
      {event.documentation_urls && event.documentation_urls.length > 0 && (
        <section className="space-ptb">
          <div className="px-4">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h2 className="text-white">Event Documentation</h2>
                </div>
              </div>
            </div>
            <div className="row g-4 popup-gallery">
              {event.documentation_urls.map((url, idx) => (
                <div key={idx} className="col-md-6 col-lg-4">
                  <div className="portfolio portfolio-style-02">
                    <div className="portfolio-images">
                      <img
                        className="img-fluid w-100"
                        src={url}
                        alt={`Documentation ${idx + 1}`}
                        style={{
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div className="portfolio-info-02">
                        <a
                          className="portfolio-img popup-icon"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fas fa-plus"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
