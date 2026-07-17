import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
 
type VerifyResult =
  | { ok: true }
  | { ok: false; status: 401 | 403 | 404; error: string };
 
/**
 * Confirms the current request has a valid Supabase session AND that the
 * session's user is the creator of the given event. Route handlers that
 * manage an event's images (listing, deleting) must call this before
 * touching S3 — eventId alone is not a secret (it's embedded in the public
 * guest-upload link), so it cannot be used as the only authorization check.
 *
 * NOTE: column names below (`eventid`, `createdbyuserid`) match the lowercase
 * naming already used by other working queries in this codebase (e.g.
 * dashboard/manage pages). Double-check these against your actual Supabase
 * schema if this starts returning "not found" unexpectedly.
 */
export async function verifyEventOwner(eventId: string): Promise<VerifyResult> {
  const supabase = createRouteHandlerClient({ cookies });
 
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, status: 401, error: 'Not authenticated' };
  }
 
  const { data: event, error } = await supabase
    .from('Event')
    .select('eventid, createdbyuserid')
    .eq('eventid', eventId)
    .maybeSingle();
 
  if (error || !event) {
    return { ok: false, status: 404, error: 'Event not found' };
  }
 
  if (event.createdbyuserid !== user.id) {
    return { ok: false, status: 403, error: 'You do not have access to this event' };
  }
 
  return { ok: true };
}