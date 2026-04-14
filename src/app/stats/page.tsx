import type { Metadata } from "next";
import { MiningAnalytics } from "@/components/composed/MiningAnalytics";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Mining Analytics — The Howling Mine",
  description:
    "Live space mining analytics dashboard — globals, leaderboards, and performance metrics powered by EntropiaCentral.",
};

export default function StatsPage() {
  return (
    <div className={styles.page}>
      <MiningAnalytics />
    </div>
  );
}
