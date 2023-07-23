import type { NextApiRequest, NextApiResponse } from 'next';
import { apis } from '../../../apis/index';
import axios from 'axios';

// Fake users data

const toBase64 = (str: string) => Buffer.from(str).toString('base64');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  try {
    const { paymentKey, orderId: orderIdQuery, amount } = req.query;

    const orderId = orderIdQuery?.slice('order-'.length);

    const result = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        amount,
        orderId: orderIdQuery,
        paymentKey,
      },
      {
        headers: {
          // https://docs.tosspayments.com/guides/using-api
          Authorization: `Basic ${toBase64(
            `${process.env.TOSS_CLIENT_SECRET}:`
          )}`,
        },
      }
    );

    await apis.order.update(
      {
        id: orderId,
        paymentKey,
        paidPrice: amount,
        isPaid: true,
      }
      // {
      //   headers: {
      //     Authorization: `Bearer ${process.env.SERVER_API_KEY}`,
      //   },
      // }
    );

    // Get data from your database
    // res.status(200).json(users);
    res.redirect(307, `/profile/orders/${orderId}?from-order=true`);
  } catch (e) {
    console.error(e.message);
    res.redirect('/?err=' + encodeURIComponent('잘못된 구매입니다.'));
  }
}
