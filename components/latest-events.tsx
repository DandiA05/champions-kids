import { sql } from "@/lib/db";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  banner_url: string | null;
  description: string | null;
  event_date: string | null;
  created_at: string;
}

export default async function LatestEvents() {
  // Fetch 3 latest events ordered by event_date descending
  const events = (await sql`
    SELECT 
      id,
      title,
      banner_url,
      description,
      event_date,
      created_at
    FROM events
    ORDER BY created_at DESC
    LIMIT 3
  `) as Event[];

  if (!events || events.length === 0) {
    return null;
  }

  return (
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
          {events.map((event) => {
            const eventDate = event.event_date
              ? new Date(event.event_date)
              : new Date(event.created_at);

            const day = eventDate.toLocaleDateString("en-GB", {
              day: "2-digit",
            });
            const month = eventDate.toLocaleDateString("en-GB", {
              month: "short",
            });

            return (
              <div className="col-lg-4 mb-4 mb-lg-0" key={event.id}>
                <Link
                  href={`/event/${event.id}`}
                  style={{ display: "block", textDecoration: "none" }}
                >
                  <div className="blog-post post-style-01">
                    <div className="blog-image">
                      <img
                        className="img-fluid"
                        src={event.banner_url || "/images/home-01/blog/01.jpg"}
                        alt={event.title}
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 9",
                          objectFit: "cover",
                        }}
                      />
                      <div className="blog-post-date">
                        <span className="date">{day}</span>
                        <span className="month">{month}</span>
                      </div>
                    </div>
                    <div className="blog-post-details">
                      <h5 className="blog-title mb-2 text-underline">
                        {event.title}
                      </h5>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
