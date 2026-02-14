import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/live";
import { EVENTS_QUERY } from "@/sanity/queries";
import EventsHub from "./EventsHub";

export const metadata: Metadata = {
  title: "Events — The Howling Mine",
  description:
    "Upcoming in-game events, mining runs, community meetups, and more.",
};

export default async function EventsPage() {
  let events = [];
  try {
    const { data } = await sanityFetch({ query: EVENTS_QUERY });
    events = data ?? [];
  } catch {
    /* Sanity not configured yet */
  }

  return <EventsHub events={events} />;
}
