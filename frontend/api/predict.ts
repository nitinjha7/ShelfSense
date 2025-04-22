// pages/api/predict.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' })

  try {
    const fastapiUrl = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'
    const response = await axios.post(`${fastapiUrl}/predict`, req.body)
    res.status(200).json(response.data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
