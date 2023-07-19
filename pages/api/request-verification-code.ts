import type { NextApiRequest, NextApiResponse } from 'next';
import twillo from 'twilio';
import axios from 'axios';

const genNum = (): number[] => {
  const arr = [];

  while (arr.length < 6) {
    arr.push(Math.floor(Math.random() * 10));
  }

  return arr.reduce((acc, val) => `${acc}${val}`, '');
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  const { phone, jwt } = req.body;

  const key = genNum();

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/sms-verifications`,
      {
        data: { key, phone },
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
    const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

    const client = twillo(accountSid, authToken);

    await client.messages
      .create({
        body: `[뜰] 인증번호는 ${key}입니다.`,
        messagingServiceSid: 'MG473c9d8f6279e6275bcb40b237af48f8',
        to: `+82${phone}`,
      })
      .then((message) => console.log(message.sid))
      .done();

    res.status(200).json({ success: true });
    // Get data from your database
    // res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
}
