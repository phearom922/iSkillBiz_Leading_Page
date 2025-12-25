"use client";

import { useEffect, useState } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface UseRealtimeOptions {
  table: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export function useRealtime<T = any>(options: UseRealtimeOptions) {
  const [data, setData] = useState<T[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured (not dummy client)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isDummyClient = !supabaseUrl || supabaseUrl === 'https://dummy.supabase.co';
    
    // Skip realtime subscriptions if using dummy client
    if (isDummyClient) {
      return;
    }

    const channelName = `realtime:${options.table}${options.filter ? `:${options.filter}` : ""}`;
    const newChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: options.table,
          filter: options.filter,
        },
        (payload) => {
          if (payload.eventType === "INSERT" && options.onInsert) {
            options.onInsert(payload);
          } else if (payload.eventType === "UPDATE" && options.onUpdate) {
            options.onUpdate(payload);
          } else if (payload.eventType === "DELETE" && options.onDelete) {
            options.onDelete(payload);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [options.table, options.filter]);

  return {
    data,
    setData,
    channel,
    isConnected,
  };
}

