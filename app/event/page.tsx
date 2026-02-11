import Link from "next/link";

export default function EventList() {
  const blogPosts = [
    {
      id: 1,
      date: "30",
      month: "Oct",
      year: "2024",
      title: "Every match is the last chance to prove yourself",
      img: "/images/blog/08.jpg",
      author: "Harry Russell",
      authorImg: "/images/avatar/06.jpg",
    },
    {
      id: 2,
      date: "15",
      month: "Nov",
      year: "2024",
      title: "Football goals are attained by perseverance",
      img: "/images/blog/03.jpg",
      author: "Harry Russell",
      authorImg: "/images/avatar/06.jpg",
    },
    {
      id: 3,
      date: "22",
      month: "Dec",
      year: "2024",
      title: "Liverpool’s defeat to brentford shows why they",
      img: "/images/blog/05.jpg",
      author: "Harry Russell",
      authorImg: "/images/avatar/06.jpg",
    },
    {
      id: 4,
      date: "05",
      month: "Jan",
      year: "2025",
      title: "We have only one dream, win it!",
      img: "/images/blog/07.jpg",
      author: "Harry Russell",
      authorImg: "/images/avatar/06.jpg",
    },
    {
      id: 5,
      date: "12",
      month: "Feb",
      year: "2025",
      title: "Get ready to live each second",
      img: "/images/blog/01.jpg",
      author: "Harry Russell",
      authorImg: "/images/avatar/06.jpg",
    },
    {
      id: 6,
      date: "20",
      month: "Mar",
      year: "2025",
      title: "Pride and passion meets success.",
      img: "/images/blog/04.jpg",
      author: "Harry Russell",
      authorImg: "/images/avatar/06.jpg",
    },
  ];

  return (
    <main>
      {/* Banner */}
      <section
        className="inner-banner bg-overlay-black-6 bg-holder"
        style={{ backgroundImage: "url('/images/inner-banner/01.jpg')" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-banner-tittle">
                <h2>Event List</h2>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Event</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            {blogPosts.map((post) => (
              <div key={post.id} className="col-12 col-md-6 col-lg-4">
                <Link href="/event-single" style={{ textDecoration: "none" }}>
                  <div className="blog-post post-style-01">
                    <div className="blog-image">
                      <img
                        className="img-fluid w-100"
                        src={post.img}
                        alt={post.title}
                        style={{ height: "280px", objectFit: "cover" }}
                      />
                      <div className="blog-post-date">
                        <span className="date">{post.date}</span>
                        <span className="month">{post.month}</span>
                      </div>
                    </div>
                    <div className="blog-post-details">
                      <h5 className="blog-title">{post.title}</h5>
                      <div className="blog-post-meta mt-2">
                        <span className="text-white">By {post.author}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
