// Sit 'n gratis-kontrole kaart halfpad deur elke artikel (voor die middelste ## opskrif).
// Dit gebeur tydens die bou, so dit werk ook sonder JavaScript.
import { KONTROLE_URL, kontroleLink } from "../config.ts";

const h = (tag, props, children = []) => ({ type: "element", tagName: tag, properties: props, children });
const t = (value) => ({ type: "text", value });

export default function rehypeKontrole() {
  return (tree, file) => {
    const fm = file.data?.astro?.frontmatter ?? {};
    const slug = fm.slug || "artikel";
    const h2s = tree.children
      .map((n, i) => (n.type === "element" && n.tagName === "h2" ? i : -1))
      .filter((i) => i >= 0);
    const kaart = h(
      "aside",
      { className: ["kontrole-kaart", "onthul"], ariaLabel: "Gratis kontrole" },
      [
        h("p", { className: ["kk-etiket"] }, [t("Gratis kontrole")]),
        h("p", { className: ["kk-titel"] }, [t("Wil jy hieroor met iemand praat?")]),
        h("p", { className: ["kk-teks"] }, [
          t("Bespreek 'n gratis kontrole by 'n gesondheidswerker naby jou. Op jou tyd, sonder druk."),
        ]),
        h("a", { className: ["knoppie", "knoppie--primer"], href: kontroleLink(slug), "data-kontrole": slug }, [
          t("Bespreek my gratis kontrole"),
        ]),
        ...(KONTROLE_URL.trim()
          ? []
          : [h("p", { className: ["kk-nota"] }, [t("Die knoppie maak WhatsApp oop. Jy gesels eers met ons.")])]),
      ],
    );
    let plek;
    if (h2s.length >= 2) plek = h2s[Math.floor(h2s.length / 2)];
    else {
      const ps = tree.children.map((n, i) => (n.type === "element" && n.tagName === "p" ? i : -1)).filter((i) => i >= 0);
      plek = ps.length ? ps[Math.floor(ps.length / 2)] + 1 : tree.children.length;
    }
    tree.children.splice(plek, 0, kaart);
  };
}
