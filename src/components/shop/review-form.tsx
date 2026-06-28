"use client";

// ============================================================
// 评价表单
// ============================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface ReviewFormProps {
  productId: string;
  onSubmitted: () => void;
}

export function ReviewForm({ productId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Review submitted! Thank you.");
        setRating(0);
        setComment("");
        onSubmitted();
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold">Write a Review</h3>

      {/* 星级 */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hover || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-gray-500 ml-2">
            {rating === 5 ? "Excellent!" : rating === 4 ? "Good!" : rating === 3 ? "OK" : rating === 2 ? "Not great" : "Poor"}
          </span>
        )}
      </div>

      <Textarea
        placeholder="Share your experience with this product... (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />

      <Button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
