import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CHANNELS = [
  { key: "email", label: "Email" },
  { key: "sms", label: "SMS" },
  // { key: "inapp", label: "In-App" },
  // { key: "push", label: "Push" },
];

interface ChannelSelectorProps {
  selectedChannels: string[];
  onToggleChannel: (channel: string) => void;
}

export default function ChannelSelector({
  selectedChannels,
  onToggleChannel,
}: ChannelSelectorProps) {
  return (
    <Card className="p-8 rounded-3xl shadow-2xl bg-white/90 border-0">
      <label className="font-semibold text-gray-700">Channels</label>
      <div className="flex gap-3 mt-3 flex-wrap">
        {CHANNELS.map((ch) => (
          <Button
            key={ch.key}
            variant={selectedChannels.includes(ch.key) ? "default" : "outline"}
            onClick={() => onToggleChannel(ch.key)}
            className={`rounded-xl px-6 py-2 font-medium transition-all text-base shadow-sm ${
              selectedChannels.includes(ch.key)
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white scale-105"
                : "bg-white text-gray-700 border-gray-300 hover:bg-violet-50"
            }`}
          >
            {ch.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
