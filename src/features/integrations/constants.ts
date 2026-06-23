export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:4010/api/v1';

export const SEND_EXAMPLE = `{
  "template": "booking_confirmation",
  "language": "en",
  "to": "919876543210",
  "variables": {
    "customerName": "John",
    "bookingId": "BK123",
    "serviceDate": "2026-06-20"
  },
  "idempotencyKey": "booking-BK123"
}`;

export const SEND_SUCCESS_EXAMPLE = `{
  "success": true,
  "message": "Message accepted for delivery",
  "data": {
    "messageId": "550e8400-e29b-41d4-a716-446655440000",
    "duplicate": false,
    "status": "QUEUED",
    "idempotencyKey": "booking-BK123",
    "template": "booking_confirmation"
  }
}`;

export const TEMPLATE_CREATE_EXAMPLE = `{
  "whatsAppAccountId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "booking_confirmation",
  "language": "en",
  "category": "UTILITY",
  "header": {
    "format": "IMAGE",
    "handle": "4::aW..."
  },
  "body": {
    "text": "Hi {{customerName}}, booking {{bookingId}} is confirmed for {{serviceDate}}."
  },
  "footer": {
    "text": "ExtraHand"
  }
}`;

export const MEDIA_UPLOAD_EXAMPLE = `# multipart/form-data
# fields: file (JPEG/PNG/MP4), whatsAppAccountId (UUID)

curl -X POST "${API_BASE_URL}/media/upload" \\
  -H "Authorization: Bearer YOUR_JWT" \\
  -F "file=@/path/to/header.jpg" \\
  -F "whatsAppAccountId=550e8400-e29b-41d4-a716-446655440000"`;

export const WEBHOOK_PAYLOAD_EXAMPLE = `{
  "event": "message.delivered",
  "timestamp": "2026-06-19T12:00:00.000Z",
  "data": {
    "messageId": "550e8400-e29b-41d4-a716-446655440000",
    "idempotencyKey": "booking-BK123",
    "template": "booking_confirmation",
    "to": "919876543210",
    "status": "DELIVERED",
    "metaMessageId": "wamid.HBgL...",
    "errorCode": null,
    "errorMessage": null
  }
}`;

export const SEND_FIELD_ROWS = [
  { field: 'template', required: true, description: 'Approved Meta template name (lowercase_snake_case).' },
  { field: 'language', required: false, description: 'BCP-47 language code. Default: en.' },
  { field: 'to', required: true, description: 'Recipient phone with country code, digits only (e.g. 919876543210).' },
  { field: 'variables', required: false, description: 'Named object or ordered array matching template slots.' },
  { field: 'idempotencyKey', required: true, description: 'Your stable reference (MyOperator myop_ref_id). Prevents duplicate sends on retry.' },
  { field: 'phoneNumberId', required: false, description: 'TrizenDialog phone UUID when org has multiple numbers.' },
] as const;

export const SEND_ERROR_ROWS = [
  { code: 'UNAUTHORIZED', when: 'Missing or invalid API key.' },
  { code: 'FORBIDDEN', when: 'API key lacks messages:write scope.' },
  { code: 'VALIDATION_ERROR', when: 'Invalid body (template, phone, variables).' },
  { code: 'TEMPLATE_NOT_FOUND', when: 'Template missing or not APPROVED.' },
  { code: 'PHONE_NOT_CONFIGURED', when: 'No WhatsApp phone number available for send.' },
] as const;

export const WEBHOOK_EVENTS = [
  { event: 'message.accepted', when: 'POST /messages accepted and message queued (202).' },
  { event: 'message.sent', when: 'Meta accepted the outbound message.' },
  { event: 'message.delivered', when: 'Recipient device received the message.' },
  { event: 'message.read', when: 'Recipient read the message (if read receipts enabled).' },
  { event: 'message.failed', when: 'Send or delivery failed (see errorCode / errorMessage).' },
] as const;
