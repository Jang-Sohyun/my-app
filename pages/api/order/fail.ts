import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  const { code, message, orderId } = req.query;

  res.redirect(307, `/order/${orderId}?message=${encodeURIComponent(message)}`);
}
