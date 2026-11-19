export async function onRequestPost(context) {
  try {
    const { accountSid, authToken, from, to, body } = await context.request.json();

    if (!accountSid || !authToken || !from || !to || !body) {
      return new Response(JSON.stringify({ error: 'عافاك عمر جميع معلومات Twilio والرسالة' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const encodedAuth = btoa(`${accountSid}:${authToken}`);

    const formData = new URLSearchParams();
    formData.append('From', from.trim());
    formData.append('To', to.trim());
    formData.append('Body', body);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.message || 'خطأ من خادم Twilio' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, sid: data.sid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'خطأ غير متوقع في السيرفر' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
