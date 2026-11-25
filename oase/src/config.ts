/*
 * OASE INSTELLINGS
 * Verander net die waardes tussen die aanhalingstekens "...".
 * Laat 'n waarde leeg ("") as jy dit nog nie het nie.
 */
export const KONTROLE_URL = ""; // Skakel na jou kontrole-bladsy, bv. "https://oase.co.za/kontrole". Leeg = WhatsApp word gebruik.
export const WHATSAPP = "27697635055"; // Net syfers, met 27 voor, sonder 0 of +.
export const FACEBOOK_URL = ""; // Skakel na die Oase Facebook-bladsy.
export const PRAKTISYN_URL = ""; // Skakel vir gesondheidswerkers wat by Oase wil aansluit. Leeg = skakel word versteek.
export const NEWSLETTER_URL = ""; // Waarheen die nuusbrief-vorm stuur. Leeg = Netlify Forms (werk vanself op Netlify).

export const SITE_URL = "https://oase-webwerf.netlify.app"; // Jou webwerf se adres. Verander as jy 'n eie domein kry.

/* Hieronder hoef jy niks te verander nie. */
export const WHATSAPP_DISPLAY = "069 763 5055";
export const DISCLAIMER = "Algemene inligting, nie mediese advies nie. Noodgeval? Bel 10177 of 112.";

export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/** Elke kontrole-skakel kry ?bron=<bron> sodat ons weet waar die leser vandaan kom. */
export function kontroleLink(bron: string): string {
  const b = encodeURIComponent(bron);
  if (KONTROLE_URL.trim()) {
    const sep = KONTROLE_URL.includes("?") ? "&" : "?";
    return `${KONTROLE_URL.trim()}${sep}bron=${b}`;
  }
  const msg = `Hallo Oase, ek wil graag my gratis kontrole bespreek. (bron: ${bron})`;
  return `${whatsappLink(msg)}&bron=${b}`;
}

export function chatLink(bron: string): string {
  return whatsappLink(`Hallo Oase, ek het 'n vraag. (bron: ${bron})`);
}
