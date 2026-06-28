"use client";

// ============================================================
// 支付成功回调组件 - 检测 ?success=true 并确认订单
// ============================================================

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function OrderConfirm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const called = useRef(false);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true" && !called.current) {
      called.current = true;
      fetch("/api/orders/confirm", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.success("Payment confirmed! Your order is being processed.");
          }
          // 清除 URL 参数
          router.replace("/account/orders");
        })
        .catch(() => {});
    }
  }, []); // eslint-disable-line

  return null;
}
