import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import { Message } from "@/model/User";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

export function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {new Date(message.createdAt).toLocaleString()}
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onMessageDelete(message._id.toString())}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p>{message.content}</p>
      </CardContent>
    </Card>
  );
}
