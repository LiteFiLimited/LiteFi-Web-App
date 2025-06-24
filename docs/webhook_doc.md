# Mono Webhook Payment Integration Guide

## Overview

This document explains how Mono webhooks are implemented in the LiteFi Backend to handle direct payment notifications and updates. The webhook system ensures real-time processing of payment events from Mono's DirectPay service.

## Webhook Endpoint

The webhook endpoint is exposed at:
```
POST /webhooks/mono
```

## Security

### Webhook Signature Verification
Every webhook request from Mono includes a signature header that must be verified:

```typescript
@Headers('mono-webhook-signature') signature: string
```

The signature is verified using the following process:
1. The webhook payload is stringified
2. The signature is verified against Mono's public key
3. Requests with invalid signatures are rejected with a 400 Bad Request error

## Event Types

The webhook handles the following payment events:

### 1. Payment Successful
```typescript
event: 'payment.successful'
```
Triggered when a payment is successfully completed. The system will:
- Update the transaction status to 'successful'
- Credit the user's wallet
- Update payment records
- Send success notifications

### 2. Payment Failed 
```typescript
event: 'payment.failed'
```
Triggered when a payment fails. The system will:
- Update the transaction status to 'failed'
- Record the failure reason
- Send failure notifications
- Allow retry attempts where applicable

## Webhook Payload Structure

```typescript
interface MonoDirectPayWebhookEvent {
  event: string;          // Event type (payment.successful, payment.failed)
  data: {
    id: string;          // Mono transaction ID
    reference: string;   // Your system's payment reference
    amount: number;      // Transaction amount
    status: string;      // Transaction status
    // ... other transaction details
  }
}
```

## Implementation Flow

1. **Webhook Reception**
```typescript
@Post()
@HttpCode(HttpStatus.OK)
async handleWebhook(
  @Headers('mono-webhook-signature') signature: string,
  @Body() payload: MonoDirectPayWebhookEvent
) {
  // Process webhook
}
```

2. **Signature Verification**
```typescript
if (!signature || !this.monoService.verifyWebhookSignature(signature, JSON.stringify(payload))) {
  throw new BadRequestException('Invalid webhook signature');
}
```

3. **Event Processing**
```typescript
switch (payload.event) {
  case 'payment.successful':
    return this.walletService.processMonoDirectPayment(
      payload.data.reference,
      'successful',
      payload.data.id
    );

  case 'payment.failed':
    return this.walletService.processMonoDirectPayment(
      payload.data.reference,
      'failed',
      payload.data.id
    );
}
```

## Error Handling

The webhook implementation includes comprehensive error handling:

1. **Invalid Signature**
```typescript
throw new BadRequestException('Invalid webhook signature');
```

2. **Processing Errors**
```typescript
try {
  // Process webhook
} catch (error) {
  this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
  throw error;
}
```

## Logging

All webhook events are logged for monitoring and debugging:

```typescript
this.logger.log(`Received Mono webhook: ${JSON.stringify(payload)}`);
```

## Best Practices

1. **Idempotency**
   - Each webhook event should be processed only once
   - Use the transaction reference to prevent duplicate processing
   - Maintain transaction logs for audit purposes

2. **Quick Response**
   - Webhook handlers should respond quickly (within 5 seconds)
   - Move heavy processing to background jobs
   - Return 200 OK as soon as the webhook is validated

3. **Error Recovery**
   - Implement retry mechanisms for failed payments
   - Store failed webhook payloads for manual review
   - Monitor webhook processing success rates

4. **Security**
   - Always verify webhook signatures
   - Use HTTPS for webhook endpoints
   - Implement rate limiting
   - Log all webhook activities

## Testing

To test the webhook integration:

1. Use Mono's test environment
2. Generate test payments using the sandbox credentials
3. Verify webhook reception and processing
4. Check payment status updates in your system
5. Validate error handling scenarios

## Troubleshooting

Common issues and solutions:

1. **Invalid Signature**
   - Verify the correct Mono public key is being used
   - Check if the payload is being modified before signature verification
   - Ensure correct string encoding

2. **Missing Events**
   - Check webhook URL is correctly configured in Mono dashboard
   - Verify server is accessible from Mono's IPs
   - Check server logs for rejected requests

3. **Processing Failures**
   - Check transaction reference format
   - Verify wallet service is functioning correctly
   - Review error logs for specific failure reasons

## Monitoring

Monitor the following metrics:

1. Webhook reception rate
2. Signature verification success rate
3. Event processing success rate
4. Response time
5. Error rates by type
6. Payment success/failure rates

This implementation ensures reliable and secure processing of payment notifications from Mono's DirectPay service while maintaining proper error handling and monitoring capabilities. 