import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import MarkAsReadButton from "@/components/admin/shared/MarkAsReadButton";
import DeleteMessageButton from "@/components/admin/shared/DeleteMessageButton";

async function getMessages() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function MessagesPage() {
  const messages = await getMessages();
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mesajlar</h2>
        <p className="text-muted-foreground">
          İletişim formundan gelen mesajları görüntüleyin
          {unreadCount > 0 && ` (${unreadCount} okunmamış)`}
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Henüz mesaj bulunmuyor.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={message.isRead ? "opacity-75" : "border-primary/50"}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${message.isRead ? "bg-muted-foreground" : "bg-primary"
                        }`}
                    />
                    <div>
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {message.email}
                        {message.phone && ` • ${message.phone}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={message.isRead ? "secondary" : "default"}>
                      {message.isRead ? "Okundu" : "Yeni"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {message.company && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Firma: {message.company}
                  </p>
                )}
                {message.subject && (
                  <p className="text-sm font-medium mb-2">Konu: {message.subject}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                {!message.isRead && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <MarkAsReadButton id={message.id} />
                    <DeleteMessageButton id={message.id} />
                  </div>
                )}
                {message.isRead && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <DeleteMessageButton id={message.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
