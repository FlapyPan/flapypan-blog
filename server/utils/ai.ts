import { createHmac } from 'node:crypto';
import WebSocket from 'ws';

export type SparkAIConversation = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type SparkAIResult = {
  header: {
    code: number;
    message: string;
    status: 0 | 1 | 2;
  };
  payload: {
    choices: {
      seq: number;
      text: [{ content: string }];
    };
  };
};

export const sparkAI = {
  _getWebsocketUrl(): string {
    const apiKey = ensure(process.env.SPARK_API_KEY, '未设置SPARK_API_KEY', 500);
    const apiSecret = ensure(process.env.SPARK_API_SECRET, '未设置SPARK_API_SECRET', 500);
    const url = new URL('wss://spark-api.xf-yun.com/v3.5/chat');
    const host = url.host;
    const path = url.pathname;
    const date = new Date().toUTCString();
    const signOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
    const hmac = createHmac('sha256', apiSecret);
    hmac.update(signOrigin);
    const sign = hmac.digest('base64');
    const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${sign}"`;
    const authorization = btoa(authorizationOrigin);
    url.searchParams.set('authorization', authorization);
    url.searchParams.set('date', date);
    url.searchParams.set('host', host);
    return url.toString();
  },
  async sendConversation(text: Array<SparkAIConversation>): Promise<string> {
    const appId = ensure(process.env.SPARK_APP_ID, '未设置SPARK_APP_ID', 500);
    const domain = ensure(process.env.SPARK_CHAT_DOMAIN, '未设置SPARK_CHAT_DOMAIN', 500);
    const url = this._getWebsocketUrl();
    const ws = new WebSocket(url);
    const data = JSON.stringify({
      header: { app_id: appId },
      parameter: { chat: { domain: 'generalv3.5', max_tokens: 128 } },
      payload: { message: { text } },
    });
    ws.onopen = () => ws.send(data);
    return await new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => reject('请求超时'), 30000);
      let lastSeq = -1;
      const buffer: string[] = [];
      ws.onmessage = ({ data }) => {
        const {
          header,
          payload: { choices },
        } = JSON.parse(data.toString()) as SparkAIResult;
        if (header.code !== 0) {
          reject(header.message);
          return;
        }
        if (choices.seq > lastSeq && choices.text.length > 0) {
          lastSeq = choices.seq;
          buffer.push(choices.text[0].content);
        }
        if (header.status === 2) {
          clearTimeout(timeout);
          resolve(buffer.join(''));
        }
      };
      ws.onerror = reject;
    }).finally(() => ws.close());
  },

  summary(text: string): Promise<string> {
    return this.sendConversation([
      {
        role: 'system',
        content: '简洁地概括文章的主要内容，突出强调作者的核心论点和结论，控制在80个字以内',
      },
      {
        role: 'user',
        content: text,
      },
    ]);
  },
};
