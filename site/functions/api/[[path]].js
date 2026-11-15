// Cloudflare Pages entry: every /api/* request goes to the shared handler.
// Set GEMINI_API_KEY and ALLOWED_ORIGINS as encrypted variables in the Pages project settings.
import { handle } from '../_handler.mjs';

export async function onRequest({ request, env }) {
  return (await handle(request, env, request.headers.get('cf-connecting-ip') || 'unknown')) || new Response('Not found', { status: 404 });
}
