// functions/api/contact.js
// 先响应预检请求
export const onRequestOptions = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
export async function onRequestPost({ request, env }) {
  // 主逻辑也要返回 CORS 头
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response('Bad Request', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  const payload = {
    text:
      `*新表单提交*\n` +
      `• 姓名: ${data.name}\n` +
      `• 邮箱: ${data.email}\n` +
      `• 主题: ${data.subject}\n` +
      `• 内容: ${data.message}`,
  };

  try {
    await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Slack webhook error', err);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
