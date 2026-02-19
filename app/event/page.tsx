import Link from "next/link";
import { db } from "@/lib/db";

export default async function EventList() {
  const events = await db.getAllEvents();

  // Helper to format date for the UI "badge"
  const getEventDateParts = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear(),
    };
  };

  return (
    <main>
      {/* Blog List Section */}
      <section className="space-ptb">
        <div className="container">
          <div className="row mb-4 mb-md-5">
            <div className="col-12">
              <div className="section-title">
                <h2 className="mb-0 text-white">Latest Events</h2>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {events.length > 0 ? (
              events.map((event) => {
                const dateParts = getEventDateParts(event.event_date);
                return (
                  <div key={event.id} className="col-12 col-md-6 col-lg-4">
                    <Link
                      href={`/event/${event.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="blog-post post-style-01">
                        <div className="blog-image">
                          <img
                            className="img-fluid w-100"
                            src={event.banner_url || "/images/blog/08.jpg"}
                            alt={event.title}
                            style={{ height: "280px", objectFit: "cover" }}
                          />
                          <div className="blog-post-date">
                            <span className="date">{dateParts.day}</span>
                            <span className="month">{dateParts.month}</span>
                          </div>
                        </div>
                        <div className="blog-post-details">
                          <h5 className="blog-title">{event.title}</h5>
                          {/* <div className="blog-post-meta mt-2">
                            <span className="text-white">{dateParts.year}</span>
                          </div> */}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">
                <h4 className="text-white opacity-50">No events found</h4>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
