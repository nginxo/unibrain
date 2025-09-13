// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const data = req.body;
    console.log(data);

    res.status(200).json({ 
      type: 'form',
      title: 'Unibrain',
      url: 'https://unibrain.vercel.app', // make sure this is your public URL e.g. http://localhost:3000 for local testing
    });
  } else if (req.method === 'GET') {
    res.status(200).json({
        "type": "composer",
        "name": "Create Poll",
        "icon": "check", // supported list: https://docs.farcaster.xyz/reference/actions/spec#valid-icons
        "description": "Create a poll frame",
        "aboutUrl": "https://your-app-server.example.com/about",
        "imageUrl": "https://your-app-server.example.com/static/logo.png",
        "action": {
          "type": "post",
        }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}