"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { getGuildDetails } from "../../../lib/botApi";

export default function GuildDashboardLayout({ children }) {
  const params = useParams();
  const guildId = params?.guildId;
  const [guild, setGuild] = useState(null);

  useEffect(() => {
    if (guildId) {
      getGuildDetails(guildId)
        .then(res => { if (res.success) setGuild(res.data); })
        .catch(() => {});
    }
  }, [guildId]);

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
      <Sidebar
        guildId={guildId}
        guildName={guild?.name}
        guildIcon={guild?.icon}
      />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
