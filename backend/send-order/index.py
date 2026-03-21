import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event, context):
    """Отправка заявки с конфигуратора дома на email."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}, ensure_ascii=False),
        }

    raw_body = event.get('body') or '{}'
    body = raw_body
    for _ in range(5):
        if isinstance(body, dict):
            break
        try:
            body = json.loads(body)
        except (json.JSONDecodeError, TypeError):
            body = {}
            break
    if not isinstance(body, dict):
        body = {}

    name = (body.get('name') or '').strip()
    phone = (body.get('phone') or '').strip()
    size = body.get('size', '')
    floors = body.get('floors', '')
    roof = body.get('roof', '')
    finish = body.get('finish', '')
    price = body.get('price', '')

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'}, ensure_ascii=False),
        }

    recipient = 'toystroy71rus@mail.ru'
    sender = recipient
    smtp_password = os.environ.get('SMTP_PASSWORD', '')

    subject = f'Новая заявка — {name}'
    html = f"""
    <h2>Новая заявка с сайта КаркасДом</h2>
    <table style="border-collapse:collapse;font-size:16px;">
        <tr><td style="padding:8px;font-weight:bold;">Имя:</td><td style="padding:8px;">{name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Телефон:</td><td style="padding:8px;">{phone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Площадь:</td><td style="padding:8px;">{size}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Этажность:</td><td style="padding:8px;">{floors}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Крыша:</td><td style="padding:8px;">{roof}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Отделка:</td><td style="padding:8px;">{finish}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Примерная стоимость:</td><td style="padding:8px;">{price}</td></tr>
    </table>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    msg.attach(MIMEText(html, 'html'))

    server = smtplib.SMTP_SSL('smtp.mail.ru', 465)
    server.login(sender, smtp_password)
    server.sendmail(sender, recipient, msg.as_string())
    server.quit()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True}, ensure_ascii=False),
    }