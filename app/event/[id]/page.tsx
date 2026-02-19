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
        <div className="container-fluid px-4 px-md-5">
          <div className="row">
            <div className="col-lg-12 mb-4 mb-lg-0">
              <div className="blog-detail">
                <div className="blog-post post-style-02 mb-4 mb-md-5">
                  <div className="blog-image">
                    <img
                      className="img-fluid w-100"
                      src={event.banner_url || "/images/blog/08.jpg"}
                      alt={event.title}
                      style={{ maxHeight: "600px", objectFit: "cover" }}
                    />
                    <div className="blog-post-date">
                      <span className="date">{day}</span>
                      <span className="month">{month}</span>
                    </div>
                  </div>
                  <div className="blog-post-details">
                    <h5 className="blog-title mb-4">
                      <span className="text-white h2">{event.title}</span>
                    </h5>

                    {/* Render Rich Text Description */}
                    <div
                      className="text-white quill-content"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                      style={{
                        fontSize: "1.1rem",
                        lineHeight: "1.8",
                        marginBottom: "2rem",
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
        <section className="space-pb">
          <div className="container-fluid px-4 px-md-5">
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

      <section className="space-pb">
        <div className="container text-center">
          <Link
            href="/event"
            className="btn btn-primary-psg px-5"
            style={{ color: "white" }}
          >
            Back to All Events
          </Link>
        </div>
      </section>
    </main>
  );
}
