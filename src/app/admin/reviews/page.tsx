// ============================================================
// Moderator 专属 - 审核评价
// ============================================================

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, CheckCircle } from "lucide-react";

export default async function ReviewModeration() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!role || !["ADMIN", "MODERATOR"].includes(role)) redirect("/admin");

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
    take: 50,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Review Moderation</h1>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.user.name}</span>
                  <span className="text-xs text-gray-400">
                    on {review.product.name}
                  </span>
                </div>
                <div className="flex mb-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-gray-600">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" className="text-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="text-red-500">
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews to moderate.</p>
        )}
      </div>
    </div>
  );
}
