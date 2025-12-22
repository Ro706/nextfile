"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { toast } from "sonner";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { MessageCard } from "@/components/MessageCard";

import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/User";

export default function UserDashboard() {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [acceptMessages, setAcceptMessages] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // 🧠 Derive username safely
  const username = (session?.user as User | undefined)?.username;

  // 🔗 Build profile URL safely (client only)
  const profileUrl = useMemo(() => {
    if (!username || typeof window === "undefined") return "";
    return `${window.location.origin}/u/${username}`;
  }, [username]);

  // 📨 Fetch messages
  const fetchMessages = useCallback(async (showToast = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages ?? []);

      if (showToast) {
        toast.success("Messages refreshed");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch messages"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔘 Fetch accept-messages state
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setAcceptMessages(Boolean(response.data.isAcceptingMessages));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  // 🔁 Initial load
  useEffect(() => {
    if (!username) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [username, fetchMessages, fetchAcceptMessages]);

  // 🔄 Toggle accept messages
  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        "/api/accept-messages",
        { acceptMessages: checked }
      );

      setAcceptMessages(checked);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to update message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // 🗑️ Remove message locally
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((message) => message._id.toString() !== messageId)
    );
  };

  // 📋 Copy profile link
  const copyToClipboard = async () => {
    if (!profileUrl) return;
    await navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied");
  };

  // 🚫 Not authenticated
  if (!session || !username) {
    return null;
  }

  return (
    <div className="mx-auto my-8 w-full max-w-6xl rounded bg-white p-6">
      <h1 className="mb-6 text-4xl font-bold">User Dashboard</h1>

      {/* 🔗 Profile Link */}
      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Your Anonymous Link</h2>
        <div className="flex gap-2">
          <input
            value={profileUrl}
            disabled
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </section>

      {/* 🔘 Accept Messages */}
      <section className="mb-6 flex items-center gap-3">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-sm font-medium">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </section>

      <Separator />

      {/* 🔄 Refresh */}
      <Button
        variant="outline"
        className="mt-6"
        onClick={() => fetchMessages(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      {/* 📨 Messages */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-muted-foreground">
            No messages to display.
          </p>
        )}
      </div>
    </div>
  );
}