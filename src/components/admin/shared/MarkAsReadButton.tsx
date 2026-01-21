"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MarkAsReadButtonProps {
  id: string;
}

export default function MarkAsReadButton({ id }: MarkAsReadButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleMarkAsRead = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      if (!res.ok) {
        throw new Error("İşlem başarısız");
      }

      toast.success("Mesaj okundu olarak işaretlendi");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMarkAsRead}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Check className="mr-2 h-4 w-4" />
      )}
      Okundu Olarak İşaretle
    </Button>
  );
}
