# Oase navorsing: hoe vrouegesondheid-webwerwe gebou is en lesers omskakel

Datum: 25 November 2026. Alles hieronder is gebaseer op bladsye wat op hierdie datum afgelaai is (curl), tensy anders gemeld.

## Bevindinge per webwerf

**Jean Hailes (Australië)** · https://www.jeanhailes.org.au/ · artikel: https://www.jeanhailes.org.au/health-topics/menopause/how-to-manage-menopausal-symptoms/
- Tuisblad: soek-prompt "I'm looking for ..." bo, dan onderwerp-knoppies (13 onderwerpe), "Because your health matters" artikelrooster met kategorie en leestyd ("Brain health • 4 min"), dan "My life stage" (tieners, jong vroue, middeljare, ouer word), aanhaling van stigter, "Say yes to a health check" (Her Health Check), ware stories, "Look after yourself".
- Artikel: broodkrummels, titel, een-sin opsomming, "Page sections" inhoudsopgawe, "Key takeaways" blok bo, "Reviewed" + "Our review process", "You might want to know more about" verwante artikels onderaan.
- Lead capture: **Her Health Check**, 'n gratis gesondheidstoets-gids, kom in die navigasie, op die tuisblad en in die voetskrif voor. "Subscribe" knoppie in die kopstuk.
- Vertroue: hersieningsproses verduidelik, kliniek met telefoonnommer, nie-winsgewend.
- Deurmekaar: groot mega-menu met baie herhaalde skakels; dieselfde artikelkaarte twee keer in die HTML (karrousel).

**Maven Clinic** · https://www.mavenclinic.com/ · https://www.mavenclinic.com/blog
- Tuisblad is B2B-verkoop: "Book a demo", programme (fertiliteit, swangerskap, menopouse), statistiek-blokke ("Up to 27% lower NICU admissions", "28 million lives"), getuienisse met werkgewername.
- Lead capture: twee paaie ("For businesses" / "For employees"), "See if your company offers Maven".
- Les vir Oase: duidelike paaie per persoon is goed; maar Oase mag nie statistiek of getuienisse gebruik sonder bron nie.

**Flo** · https://flo.health/ (artikels onder https://flo.health/health-library)
- Tuisblad: groot aanspraak ("world's #1 women's health app", "Over 7 million 5-star ratings") met voetnote, dan funksies, "Why choose Flo", gebruikersresensies.
- Navigasie: Health Library volgens lewensfase (Your cycle, Menopause, Getting pregnant), sakrekenaars, vasvrae.
- Lead capture: "Try Flo today" app-aflaai oral.
- Vertroue: "100+ doctors", "Medical Affairs", "Privacy Portal". Les: privaatheid is 'n verkooppunt.

**Healthline** · https://www.healthline.com/ · artikel: https://www.healthline.com/health/menopause
- Tuisblad: vertrouensbalk ("Medically reviewed content, 130 medical reviewers, 50 million monthly readers") wat 8 keer in 'n karrousel herhaal, Trending, "Explore by health topic", hulpmiddels (resepte, sakrekenaar).
- Artikel: "Key takeaways" bo, "Medically reviewed by ... Written by ... Updated on", aside-blokke, "Sources" lys en "How we reviewed this article" onderaan. Advertensieplekke in die bladsy.
- Deurmekaar: advertensies, baie kruisverkoping, herhalende statistiek.

**Well+Good** · https://www.wellandgood.com/ stuur nou deur (HTTP 301) na https://www.theskimm.com/. Die bladsy self kon nie gelees word nie (gasheer nie toegelaat nie). Les: 'n handelsnaam kan verdwyn; Oase moet sy eie domein en kanale (WhatsApp, Facebook) besit.

**Health24 (Suid-Afrika)** · https://www.news24.com/health24 gee HTTP 403 (Cloudflare blok). Kon nie ontleed word nie.

**Discovery Vitality / Stella (Suid-Afrika)** · https://www.discovery.co.za/vitality/nutrition-and-exercise-tips-for-women-of-every-age · https://www.discovery.co.za/medical-aid/menopause-support · https://www.onstella.com/
- Vitality-artikel: inhoud per ouderdom in oop-en-toe blokke ("19 - 49", "45 - 60", "60+"), maar produkreklame (HealthyFood, Discovery Miles) midde-in die artikel.
- Menopouse-bladsy: stap-vir-stap pad: simptoom-vasvra (Stella), dan virtuele GP-afspraak, dan app. Lewendige openingsin oor nagsweet en slapeloosheid.
- Stella: primêre knoppie "Start Your Health Questionnaire"; "What we treat" lys van onderwerpe (slaap, gemoed, gewig).
- Les: een duidelike volgende stap werk; maar 'n simptoom-vasvra versamel gesondheidsdata, wat Oase nie mag doen nie (POPIA).

**w-Spot (Organon Suid-Afrika)** · Die IOL-berig https://www.iol.co.za/lifestyle/health/online-platform-dedicated-to-womens-health-is-focusing-on-rarely-discussed-health-experiences-468afa31-630d-4c8d-9a85-e7c4d92f9551 gee HTTP 403. Volgens die soekresultaat-opsomming: menopouse-gids met wenke oor kos, geestesgesondheid, oefening, slaap en seks, herinnering aan jaarlikse siftings, en 'n vraelys om met jou dokter te deel. Die webwerf-adres kon nie bevestig word nie.

## Patrone wat werk
1. Een gratis, lae-drempel volgende stap (Jean Hailes "Her Health Check", Stella vraelys, Discovery simptoomtoets).
2. "Key takeaways" bo-aan elke artikel en 'n inhoudsopgawe (Jean Hailes, Healthline).
3. Bronnelys en 'n datum onderaan (Healthline "Sources", NHS "Page last reviewed").
4. Navigasie volgens lewensfase en onderwerp, nie net 'n A-Z nie.
5. Leestyd en kategorie op elke kaart.

## Wat verouderd of deurmekaar lyk
Advertensies in artikels, herhaalde statistiek-karrousels, mega-menu's met 60+ skakels, getuienisse en sterre sonder konteks, produkreklame binne gesondheidsinhoud.

---

# Ontwerpopdrag vir Oase (een bladsy)

**Doel:** Lees, vertrou, dan een tik na die gratis kontrole. Rustig, warm, in Afrikaans op graad 6-vlak.

**Besluit 1. Een hoofaksie, drie plekke.** "Bespreek jou gratis kontrole" is die enigste groen knoppie. Dit verskyn in die tuisblad-hero, as 'n kaart halfpad deur elke artikel, as 'n blok aan die einde, en in 'n vaste balk op selfone nadat die leser verby die inleiding is. WhatsApp is die tweede aksie (omlyn). Elke kontrole-skakel kry `?bron=<slug>`. (Gebaseer op Jean Hailes Her Health Check en Stella.)

**Besluit 2. Artikels wat vinnig lees.** Groot serif-titel, kategorie-etiket, leestyd, datum. Dan 'n "Kortliks"-blok met 3 punte, 'n inhoudsopgawe op langer stukke, liggaam van hoogstens 68 karakters breed, en 'n "Bronne"-lys met skakels plus "Laas nagegaan"-datum. Geen "mediese hersiening"-wapen nie, want ons het dit nie. (Gebaseer op Jean Hailes en Healthline, sonder hul advertensies.)

**Besluit 3. Navigeer volgens die vier pilare.** Rus, Liefde, Beweeg, Gesondheid is die hoofnavigasie (4 skakels, geen mega-menu). Die tuisblad het 'n "Waaroor ons skryf" onderwerplys (slaap, stres, middeljare, kos, energie, beweeg) en 'n "Alle artikels"-bladsy met soek.

**Besluit 4. Geen geraas.** Geen advertensies, opspringers, sterre, gebruikersgetalle of getuienisse. Prente is tipografiese omslae in die handelskleure, nie voorraadfoto's nie. Beweging is sag (vervaag en styg) en skakel af vir mense wat dit nie wil hê nie.

**Besluit 5. Vertroue deur eerlikheid en privaatheid.** Die vrywaring "Algemene inligting, nie mediese advies nie. Noodgeval? Bel 10177 of 112." is op elke artikel en in die voetskrif. Die nuusbrief vra net naam en WhatsApp-nommer, met 'n duidelike toestemmingsblokkie (POPIA). Geen simptoom-vraelys op die webwerf nie: gesondheidsvrae word eers in die kontrole self hanteer.
