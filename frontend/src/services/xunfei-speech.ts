import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * 讯飞语音识别服务 (Xunfei Speech Recognition)
 * 使用WebSocket接口进行实时语音转文字
 */
export class XunfeiSpeechClient {
  private wsUrl: string = '';
  private appId: string = '';
  private webSocket: WebSocket | null = null;
  private onMessage: ((text: string) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  constructor() {}

  /**
   * 初始化WebSocket连接
   */
  async initialize(): Promise<void> {
    try {
      const response = await axios.get(`${API_BASE_URL}/speech/ws-url`);
      if (response.data.success) {
        this.wsUrl = response.data.data.wsUrl;
        this.appId = response.data.data.appId;
      }
    } catch (error) {
      console.error('Failed to get Xunfei auth:', error);
      throw error;
    }
  }

  /**
   * 开始语音识别
   */
  async startListening(
    onMessageCallback: (text: string) => void,
    onErrorCallback?: (error: string) => void
  ): Promise<void> {
    if (!this.wsUrl) {
      await this.initialize();
    }

    this.onMessage = onMessageCallback;
    this.onError = onErrorCallback || (() => {});

    try {
      this.webSocket = new WebSocket(this.wsUrl);
      this.webSocket.binaryType = 'arraybuffer';

      this.webSocket.onopen = () => {
        console.log('Xunfei WebSocket connected');
        this.sendInitialConfig();
      };

      this.webSocket.onmessage = (event: MessageEvent) => {
        this.handleMessage(event.data);
      };

      this.webSocket.onerror = (error: Event) => {
        console.error('Xunfei WebSocket error:', error);
        this.onError?.('Speech recognition error');
      };

      this.webSocket.onclose = () => {
        console.log('Xunfei WebSocket closed');
      };
    } catch (error) {
      console.error('Failed to establish WebSocket:', error);
      this.onError?.('Failed to connect to speech service');
      throw error;
    }
  }

  /**
   * 发送初始配置
   */
  private sendInitialConfig(): void {
    const config = {
      audio: {
        audio_format: 'raw',
        encoding: 'raw',
        sample_rate: 16000,
        channels: 1,
        bit_depth: 16,
        frame_size: 480
      },
      service: {
        sub: 's2t',
        language: 'zh_CN',
        accent: 'mandarin',
        vad_enable: true,
        dwa: 'erca'
      },
      business: {
        domain: 'iat',
        language: 'zh_CN',
        language_style: 1
      }
    };

    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify(config));
    }
  }

  /**
   * 发送音频数据
   */
  sendAudio(audioData: ArrayBuffer): void {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(audioData);
    }
  }

  /**
   * 处理WebSocket消息
   */
  private handleMessage(data: string | ArrayBuffer): void {
    if (typeof data === 'string') {
      try {
        const result = JSON.parse(data);
        if (result.action === 'started') {
          console.log('Recognition started');
        } else if (result.payload) {
          // 处理识别结果
          const transcript = this.extractText(result.payload);
          if (transcript) {
            this.onMessage?.(transcript);
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  }

  /**
   * 从负载中提取文本
   */
  private extractText(payload: any): string {
    try {
      if (payload.result && payload.result.ws) {
        return payload.result.ws
          .map((w: any) => w.cw.map((c: any) => c.w).join(''))
          .join('');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
    }
    return '';
  }

  /**
   * 停止识别并关闭连接
   */
  stopListening(): void {
    if (this.webSocket) {
      // 发送停止信号
      const stopData = JSON.stringify({ action: 'stop' });
      if (this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.send(stopData);
      }
      this.webSocket.close();
      this.webSocket = null;
    }
  }
}

// 导出全局实例
export const xunfeiService = new XunfeiSpeechClient();

export default XunfeiSpeechClient;
