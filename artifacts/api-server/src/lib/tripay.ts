import crypto from "crypto";

const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY || "";
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY || "";
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE || "";

export const IS_SANDBOX =
  process.env.TRIPAY_SANDBOX === "true" ||
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test";

const BASE_URL = IS_SANDBOX
  ? "https://tripay.co.id/api-sandbox"
  : "https://tripay.co.id/api";

export const PREMIUM_AMOUNT = 49900;

export const ALLOWED_STATUSES = [
  "UNPAID",
  "PAID",
  "EXPIRED",
  "FAILED",
] as const;
export type TripayStatus = (typeof ALLOWED_STATUSES)[number];

export function sanitizeStatus(status: string): TripayStatus {
  return ALLOWED_STATUSES.includes(status as TripayStatus)
    ? (status as TripayStatus)
    : "FAILED";
}

export function generateMerchantRef(userId: string): string {
  const slice = userId.slice(-6).toUpperCase();
  const ts = Date.now();
  return `WB-${slice}-${ts}`;
}

export function createSignature(merchantRef: string, amount: number): string {
  return crypto
    .createHmac("sha256", TRIPAY_PRIVATE_KEY)
    .update(`${TRIPAY_MERCHANT_CODE}${merchantRef}${amount}`)
    .digest("hex");
}

export function verifyCallbackSignature(
  rawBody: string,
  headerSignature: string,
): boolean {
  if (IS_SANDBOX) return true;
  if (!TRIPAY_PRIVATE_KEY) return false;
  try {
    const expected = crypto
      .createHmac("sha256", TRIPAY_PRIVATE_KEY)
      .update(rawBody)
      .digest("hex");
    const expectedBuf = Buffer.from(expected);
    const signatureBuf = Buffer.from(headerSignature || "");
    if (expectedBuf.length !== signatureBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, signatureBuf);
  } catch {
    return false;
  }
}

export async function createQrisTransaction({
  merchantRef,
  amount,
  customerName,
  customerEmail,
  callbackUrl,
}: {
  merchantRef: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  callbackUrl: string;
}) {
  if (!TRIPAY_API_KEY || !TRIPAY_MERCHANT_CODE || !TRIPAY_PRIVATE_KEY) {
    throw new Error("Tripay credentials not configured");
  }

  const signature = createSignature(merchantRef, amount);
  const expiredTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  const payload = {
    method: "QRIS",
    merchant_ref: merchantRef,
    amount,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: "08111111111",
    order_items: [
      {
        sku: "WB-PREMIUM",
        name: "WhisperBox Premium (Lifetime)",
        price: amount,
        quantity: 1,
      },
    ],
    callback_url: callbackUrl,
    expired_time: expiredTime,
    signature,
  };

  const res = await fetch(`${BASE_URL}/transaction/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TRIPAY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as any;

  if (!json.success) {
    throw new Error(`Tripay error: ${json.message}`);
  }

  const qrString = (json.data.qr_string || json.data.pay_code || "") as string;
  const qrUrl = (json.data.qr_url || "") as string;

  return {
    tripayRef: json.data.reference as string,
    merchantRef: json.data.merchant_ref as string,
    qrString,
    qrUrl,
    expiresAt: expiredTime,
  };
}

export async function getTransactionDetail(reference: string) {
  const res = await fetch(
    `${BASE_URL}/transaction/detail?reference=${reference}`,
    {
      headers: {
        Authorization: `Bearer ${TRIPAY_API_KEY}`,
      },
    },
  );

  const json = (await res.json()) as any;

  if (!json.success) {
    throw new Error(`Tripay error: ${json.message}`);
  }

  const qrString = (json.data.qr_string || json.data.pay_code || "") as string;
  const qrUrl = (json.data.qr_url || "") as string;

  return {
    reference: json.data.reference as string,
    merchantRef: json.data.merchant_ref as string,
    status: sanitizeStatus(json.data.status),
    paidAt: json.data.paid_at ? new Date(json.data.paid_at * 1000) : null,
    qrString,
    qrUrl,
    expiresAt: json.data.expired_time as number | null,
  };
}
