/**
 * Xunfei Speech Recognition Service (讯飞语音识别)
 * WebSocket接口集成
 */

const crypto = require('crypto');

export interface XunfeiConfig {
  appId: string;
  apiSecret: string;
  apiKey: string;
}

export class XunfeiSpeechService {
  private appId: string;
  private apiSecret: string;
  private apiKey: string;
  private hostUrl: string = 'ws-api.xfyun.cn/v1/private/s2t';

  constructor(config: XunfeiConfig) {
    this.appId = config.appId;
    this.apiSecret = config.apiSecret;
    this.apiKey = config.apiKey;
  }

  /**
   * 生成WebSocket连接URL
   */
  private getAuthUrl(): string {
    const host = this.hostUrl;
    const date = new Date().toUTCString();

    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1/private/s2t HTTP/1.1`;
    const signatureSha = crypto
      .createHmac('sha256', this.apiSecret)
      .update(signatureOrigin)
      .digest('base64');

    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
    const authorizationBase64 = Buffer.from(authorizationOrigin).toString('base64');

    const url = `wss://${host}?authorization=${authorizationBase64}&date=${encodeURIComponent(date)}&host=${host}`;
    return url;
  }

  /**
   * 获取音频URL (客户端使用)
   * 返回Xunfei WebSocket URL供客户端JavaScript使用
   */
  getAudioUrl(): string {
    return this.getAuthUrl();
  }

  /**
   * 获取认证信息 (供客户端JavaScript使用)
   */
  getAuthInfo(): {
    appId: string;
    apiKey: string;
    apiSecret: string;
    wsUrl: string;
  } {
    return {
      appId: this.appId,
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      wsUrl: this.getAuthUrl(),
    };
  }
}

export default XunfeiSpeechService;
