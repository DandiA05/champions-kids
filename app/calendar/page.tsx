import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import CalendarView from "@/components/calendar-view";
import { db } from "@/lib/db";
import "./calendar.css";

export const metadata = {
  title: "Calendar - Champion Kids",
  description:
    "View our training, sparing, tournament and liga schedules in our sporty monthly calendar.",
};

export default async function CalendarPage() {
  const initialSchedules = await db.getAllSchedules();

  // Transform date to string if needed, depending on how db handles it
  const formattedSchedules = initialSchedules.map((s) => ({
    ...s,
    date:
      (s.date as any) instanceof Date
        ? (s.date as any).toISOString().split("T")[0]
        : s.date,
  })) as any[];

  return (
    <main className="min-h-screen">
      <SiteHeader isHomePage={false} />

      <section className="space-pt"></section>

      <section className="space-ptb">
        <div className="container px-xl-5">
          <div className="row justify-content-center">
            <div className="col-12 py-4">
              <div className="section-title text-center mb-5">
                <h2 className="mb-0 text-white">Match & Training Calendar</h2>
                <p className="text-white mt-2">
                  Stay updated with our academy's latest activities, training
                  sessions, and upcoming tournaments.
                </p>
              </div>
            </div>
            <div className="col-lg-10">
              <CalendarView initialSchedules={formattedSchedules} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
