// functions/api/contact.js

export async function onRequestPost({ request, env }) {
  // 1. 解析 JSON 请求体
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  // 2. 构造 Slack 消息
  const payload = {
    text:
      `*新表单提交*\n` +
      `• 姓名: ${data.name}\n` +
      `• 邮箱: ${data.email}\n` +
      `• 主题: ${data.subject}\n` +
      `• 内容: ${data.message}`,
  };

  // 3. 发送到 Slack（从环境变量读取）
  try {
    await fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('Slack webhook error', e);
    return new Response('Internal Error', { status: 500 });
  }

  // 4. 返回成功
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
