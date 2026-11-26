/*
 * OASE INSTELLINGS
 * Verander net die waardes tussen die aanhalingstekens "...".
 * Laat 'n waarde leeg ("") as jy dit nog nie het nie.
 */
export const KONTROLE_URL = ""; // Skakel na jou kontrole-bladsy, bv. "https://oase.co.za/kontrole". Leeg = WhatsApp word gebruik.
export const WHATSAPP = "27697635055"; // Net syfers, met 27 voor, sonder 0 of +.
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61596962033795"; // Skakel na die Oase Facebook-bladsy.
export const PRAKTISYN_URL = ""; // Skakel vir gesondheidswerkers wat by Oase wil aansluit. Leeg = skakel word versteek.
export const NEWSLETTER_URL = ""; // Waarheen die nuusbrief-vorm stuur. Leeg = Netlify Forms (werk vanself op Netlify).

export const TOETS_URL = "https://oase-gewigsverlies-toets.netlify.app/"; // Die gratis gewigsverlies-toets. Artikels met cta: "toets" wys hierdie kaart.

// E-pos-intekenare (die pop-up op artikels) word in Supabase gestoor, in die tabel oase_intekenare.
// Die sleutel hieronder is die publieke "publishable" sleutel: dit mag in die webwerf staan.
export const SUPABASE_URL = "https://xlcssifyiokxkznawghw.supabase.co";
export const SUPABASE_KEY = "sb_publishable_ulFIG27OqaIR-2ytBb6ROQ_gPFv_iOG";

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

/** Skakel na die gratis toets, ook met ?bron=<bron>. */
export function toetsLink(bron: string): string {
  const sep = TOETS_URL.includes("?") ? "&" : "?";
  return `${TOETS_URL.trim()}${sep}bron=${encodeURIComponent(bron)}`;
}

export function chatLink(bron: string): string {
  return whatsappLink(`Hallo Oase, ek het 'n vraag. (bron: ${bron})`);
}
