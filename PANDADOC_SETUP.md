# PandaDoc Integration Setup Guide

## 1. Install Dependencies

The required `@vercel/node` package has been installed automatically.

## 2. Configure PandaDoc API Credentials

Create a `.env` file in the root directory with your PandaDoc credentials:

```env
PANDADOC_API_KEY=your_api_key_here
PANDADOC_BAA_TEMPLATE_ID=your_baa_template_id
PANDADOC_CONTRACT_TEMPLATE_ID=your_contract_template_id
```

### How to get these values:

1. **API Key**: 
   - Go to https://app.pandadoc.com/a/#/settings/integrations/api
   - Click "Create API Key"
   - Copy the key

2. **Template IDs**:
   - Go to https://app.pandadoc.com/a/#/templates
   - Open your BAA template
   - Copy the ID from the URL: `https://app.pandadoc.com/a/#/templates/TEMPLATE_ID_HERE`
   - Repeat for Contract template

## 3. Configure Webhook (Optional but Recommended)

To receive real-time signature completion notifications:

1. Go to https://app.pandadoc.com/a/#/settings/integrations/webhooks
2. Add new webhook endpoint: `https://your-domain.vercel.app/api/pandadoc/webhook`
3. Select events: `document_completed`
4. Save

## 4. Test the Integration

1. Log in to the portal with test credentials
2. Navigate to the document signing step
3. Click "Sign Now" on either document
4. Complete the signature in the PandaDoc iframe
5. Verify the document status updates to "signed"

## File Structure

```
api/
  └── pandadoc/
      ├── create-document.ts    - Creates document and session
      ├── document-status.ts    - Polls document status
      └── webhook.ts            - Receives completion events

components/
  ├── PandaDocModal.tsx         - Iframe modal component
  └── activation-portal/
      └── DocumentSigningView.tsx - Updated with integration

types/
  └── pandadoc.types.ts         - TypeScript definitions
```

## How It Works

1. User clicks "Sign Now"
2. Frontend calls `/api/pandadoc/create-document`
3. Backend creates PandaDoc document from template
4. Backend sends document and creates embedded session
5. Frontend opens PandaDocModal with iframe
6. User signs in iframe
7. PandaDoc sends completion event (via iframe & webhook)
8. Frontend updates status to "signed"
9. When both docs signed, onboarding completes

## Troubleshooting

**Error: "PandaDoc API credentials not configured"**
- Make sure `.env` file exists with all required variables
- Restart dev server after adding env variables

**Document not appearing in iframe**
- Check browser console for errors
- Verify template IDs are correct
- Ensure API key has proper permissions

**Status not updating after signing**
- Check that webhook is configured
- Status polling runs every 10 seconds as fallback
- Verify document ID is being stored correctly
