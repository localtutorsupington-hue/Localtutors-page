export type Kategorie = "rus" | "liefde" | "beweeg" | "gesondheid";

export const KATEGORIEE: Record<Kategorie, { naam: string; beskrywing: string; lang: string }> = {
  rus: {
    naam: "Rus",
    beskrywing: "Slaap, stilte en tyd vir jouself.",
    lang: "Rus is nie lui nie. Hier lees jy oor slaap, oor stilword en oor hoe om jou batterye weer te laai.",
  },
  liefde: {
    naam: "Liefde",
    beskrywing: "Vir jouself, en vir die mense om jou.",
    lang: "Jy sorg vir almal. Hier gaan dit oor hoe jy ook vir jouself kan sorg: stres, verhoudings en sagter wees met jouself.",
  },
  beweeg: {
    naam: "Beweeg",
    beskrywing: "Klein treë wat energie gee.",
    lang: "Jy hoef nie 'n atleet te wees nie. Hier lees jy hoe gewone beweging jou dag en jou energie kan verander.",
  },
  gesondheid: {
    naam: "Gesondheid",
    beskrywing: "Jou liggaam, kos en die middeljare.",
    lang: "Eerlike, eenvoudige inligting oor jou liggaam, oor kos en oor die veranderinge wat die middeljare bring.",
  },
};

export const KATEGORIE_ORDE: Kategorie[] = ["rus", "liefde", "beweeg", "gesondheid"];
