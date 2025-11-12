import express from 'express';
import { XunfeiSpeechService } from '../services/xunfei-speech';

const router = express.Router();

// 获取讯飞语音识别认证信息
router.get('/auth', (req, res) => {
  try {
    const appId = process.env.XUNFEI_APPID;
    const apiSecret = process.env.XUNFEI_API_SECRET;
    const apiKey = process.env.XUNFEI_API_KEY;

    if (!appId || !apiSecret || !apiKey) {
      return res.status(400).json({
        error: 'Xunfei speech recognition not configured',
        requiresConfig: true
      });
    }

    const speechService = new XunfeiSpeechService({
      appId,
      apiSecret,
      apiKey,
    });

    const authInfo = speechService.getAuthInfo();
    res.json({
      success: true,
      data: authInfo
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 获取WebSocket URL用于语音识别
router.get('/ws-url', (req, res) => {
  try {
    const appId = process.env.XUNFEI_APPID;
    const apiSecret = process.env.XUNFEI_API_SECRET;
    const apiKey = process.env.XUNFEI_API_KEY;

    if (!appId || !apiSecret || !apiKey) {
      return res.status(400).json({
        error: 'Xunfei speech recognition not configured',
        requiresConfig: true
      });
    }

    const speechService = new XunfeiSpeechService({
      appId,
      apiSecret,
      apiKey,
    });

    res.json({
      success: true,
      data: {
        wsUrl: speechService.getAudioUrl(),
        appId: appId,
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
