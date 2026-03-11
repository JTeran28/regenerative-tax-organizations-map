import { useState, useEffect, useRef } from "react";

// ─── WEBFLOW CSS VARIABLES ────────────────────────────────────────────────────
// These fallback values exactly match your current Webflow site.
// When the iframe is embedded, the parent page can push updated values via
// postMessage and the map will re-theme itself instantly — no redeploy needed.
//
// HOW TO ENABLE LIVE SYNC FROM WEBFLOW:
// Add this snippet to your Webflow page's "Before </body>" custom code:
//
//   <script>
//     const iframe = document.querySelector('iframe[src*="regen-tax-map"]');
//     if (iframe) {
//       iframe.addEventListener('load', () => {
//         const cs = getComputedStyle(document.documentElement);
//         const keys = [
//           '--swatch--dark-900','--swatch--dark-800',
//           '--swatch--light-100','--swatch--light-200',
//           '--swatch--brand-500','--swatch--brand-text',
//         ];
//         const vars = {};
//         keys.forEach(k => { vars[k] = cs.getPropertyValue(k).trim(); });
//         iframe.contentWindow.postMessage({ type: 'WEBFLOW_THEME', vars }, '*');
//       });
//     }
//   </script>
//
const WEBFLOW_CSS = `
:root {
  /* ── Raw swatches ── */
  --swatch--dark-900:        #1f1d1e;
  --swatch--dark-800:        #2f2b2d;
  --swatch--light-100:       white;
  --swatch--light-200:       #ebebeb;
  --swatch--brand-500:       #c6fb50;
  --swatch--transparent:     transparent;

  /* ── Derived swatches ── */
  --swatch--dark-900-o20:    color-mix(in srgb, var(--swatch--dark-900) 20%, transparent);
  --swatch--light-100-o20:   color-mix(in srgb, var(--swatch--light-100) 20%, transparent);
  --swatch--brand-100:       color-mix(in srgb, var(--swatch--brand-500), white 80%);
  --swatch--brand-200:       color-mix(in srgb, var(--swatch--brand-500), white 60%);
  --swatch--brand-300:       color-mix(in srgb, var(--swatch--brand-500), white 40%);
  --swatch--brand-400:       color-mix(in srgb, var(--swatch--brand-500), white 20%);
  --swatch--brand-600:       color-mix(in srgb, var(--swatch--brand-500), black 20%);
  --swatch--brand-700:       color-mix(in srgb, var(--swatch--brand-500), black 40%);
  --swatch--brand-800:       color-mix(in srgb, var(--swatch--brand-500), black 60%);
  --swatch--brand-900:       color-mix(in srgb, var(--swatch--brand-500), black 80%);
  --swatch--brand-text:      var(--swatch--dark-900);
  --swatch--brand-text-o20:  color-mix(in srgb, var(--swatch--brand-text) 20%, transparent);

  /* ── Typography ── */
  --_typography---font--primary-family:
    system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  --_typography---font--primary-regular:     400;
  --_typography---font--primary-medium:      500;
  --_typography---font--primary-bold:        700;
  --_typography---font--primary-trim-top:    .33em;
  --_typography---font--primary-trim-bottom: .38em;
  --_typography---line-height--small:        1;
  --_typography---line-height--medium:       1.1;
  --_typography---line-height--large:        1.3;
  --_typography---line-height--huge:         1.5;
  --_typography---letter-spacing--tight:     -.03em;
  --_typography---letter-spacing--normal:    0em;
  --_typography---text-transform--none:      none;
  --_typography---text-transform--uppercase: uppercase;
  --_typography---text-transform--capitalize:capitalize;
  --_typography---text-transform--lowercase: lowercase;
  --_typography---font-size--text-small:     clamp(.875rem, .875rem + .125vw, 1rem);
  --_typography---font-size--text-main:      clamp(1rem, 1rem + .125vw, 1.125rem);
  --_typography---font-size--text-large:     clamp(1.125rem, 1.125rem + .125vw, 1.25rem);
  --_typography---font-size--h6:             clamp(1rem, 1rem + .125vw, 1.125rem);
  --_typography---font-size--h5:             clamp(1.375rem, 1.375rem + .125vw, 1.5rem);
  --_typography---font-size--h4:             clamp(1.75rem, 1.75rem + .25vw, 2rem);

  /* ── Text-style tokens (used on body copy) ── */
  --_text-style---font-family:    var(--_typography---font--primary-family);
  --_text-style---font-size:      var(--_typography---font-size--text-main);
  --_text-style---line-height:    var(--_typography---line-height--huge);
  --_text-style---font-weight:    var(--_typography---font--primary-regular);
  --_text-style---letter-spacing: var(--_typography---letter-spacing--normal);
  --_text-style---text-transform: none;

  /* ── Theme tokens ── */
  --_theme---background:          var(--swatch--light-200);
  --_theme---background-2:        var(--swatch--light-100);
  --_theme---background-skeleton: color-mix(in lab, currentcolor 10%, transparent);
  --_theme---text:                var(--swatch--dark-900);
  --_theme---heading-accent:      var(--swatch--brand-600);
  --_theme---border:              var(--swatch--dark-900-o20);

  /* ── Button primary ── */
  --_theme---button-primary--background:       var(--swatch--brand-500);
  --_theme---button-primary--border:           var(--_theme---button-primary--background);
  --_theme---button-primary--text:             var(--swatch--brand-text);
  --_theme---button-primary--background-hover: var(--_theme---text);
  --_theme---button-primary--border-hover:     var(--_theme---button-primary--background-hover);
  --_theme---button-primary--text-hover:       var(--_theme---background);

  /* ── Button secondary ── */
  --_theme---button-secondary--background:       var(--swatch--transparent);
  --_theme---button-secondary--border:           var(--_theme---border);
  --_theme---button-secondary--text:             var(--_theme---text);
  --_theme---button-secondary--background-hover: var(--_theme---text);
  --_theme---button-secondary--border-hover:     var(--_theme---button-secondary--background-hover);
  --_theme---button-secondary--text-hover:       var(--_theme---background);

  /* ── Text links ── */
  --_theme---text-link--border:       var(--_theme---border);
  --_theme---text-link--text:         var(--_theme---text);
  --_theme---text-link--text-hover:   var(--_theme---text-link--text);
  --_theme---text-link--border-hover: var(--_theme---text);

  /* ── Selection ── */
  --_theme---selection--background: var(--swatch--brand-300);
  --_theme---selection--text:       var(--swatch--brand-text);

  /* ── Nav ── */
  --_theme---nav--background: var(--_theme---background-2);

  /* ── Radii ── */
  --radius--main:  1rem;
  --radius--small: .5rem;
  --radius--round: 100vw;

  /* ── Borders ── */
  --border-width--main:  .063rem;
  --border-width--links: .125rem;
}

::selection {
  background: var(--_theme---selection--background);
  color:      var(--_theme---selection--text);
}
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const ORGANIZATIONS = [
  { name:"ActionAid", slug:"actionaid", description:"International development and human rights organization working on tax justice and global inequalities.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a8584fd864d3b952a7ff6e_aa-logo-white.svg", website:"https://actionaid.org/", region:"global", category:"campaigning" },
  { name:"African Tax Administration Forum", slug:"african-tax-administration-forum", description:"A platform for cooperation among African tax authorities to build efficient tax systems and combat tax evasion.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84f714d32998443ea75f9_auweblogo-en.png", website:"https://au.int/", region:"africa", category:"institutions" },
  { name:"Alliance Sud", slug:"alliance-sud", description:"Swiss development policy organization advocating for tax justice and financial transparency.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85a9f75c7ac589772ebfe_5012%252520Alliance%252520Sud%252520Logo%252520Zusatz%252520FR.svg", website:"https://www.alliancesud.ch/fr", region:"europe", category:"campaigning" },
  { name:"Arab NGO Network for Development", slug:"arab-ngo-network-for-development", description:"Arab NGO network working on development and social justice in the MENA region.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a8591b7094978691da8454_logo.png", website:"https://www.annd.org/en", region:"asia", category:"campaigning" },
  { name:"BEPS Monitoring Group", slug:"beps-monitoring-group", description:"Global network of independent researchers producing technical reports on international taxation reform under the OECD BEPS project.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85145174abcf17ab0a3e8_favicon.webp", website:"https://www.bepsmonitoringgroup.org/", region:"global", category:"research" },
  { name:"Center for Economic and Social Rights", slug:"center-for-economic-and-social-rights", description:"International human rights organization using a rights-based approach for economic and social justice.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85b1fc5dc48f50ff8f9d3_logo%20(2).svg", website:"https://www.cesr.org/", region:"north-america", category:"campaigning" },
  { name:"Centre for International Corporate Tax Accountability and Research", slug:"cictar", description:"Research center conducting detailed investigations into multinational tax arrangements to expose tax evasion.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85761be9f6ac5ac7aa1d6_logo_text-1-1024x374.webp", website:"https://cictar.org/research-themes", region:"oceania", category:"research" },
  { name:"Centre for Trade Policy and Development Zambia", slug:"ctpd-zambia", description:"Zambian research and advocacy center on trade policy and development.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8c954b7f75d097c19e96_apple-icon-144x144.png", website:"https://ctpd.org.zm/", region:"africa", category:"institutions" },
  { name:"Christian Aid", slug:"christian-aid", description:"British humanitarian organization fighting poverty and injustice, including work on tax justice.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85b71ca775a25042857f7_logo%20(3).svg", website:"https://www.christianaid.org.uk/", region:"europe", category:"campaigning" },
  { name:"Committee on Fiscal Studies", slug:"committee-on-fiscal-studies", description:"Center based at the University of Nairobi dedicated to reforming and strengthening tax systems in the Global South.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85323755e1431cd30983e_Black%20White%20Minimalist%20Name%20Monogram%20Logo_0.png", website:"https://cfs.uonbi.ac.ke/", region:"africa", category:"campaigning" },
  { name:"Eurodad", slug:"eurodad", description:"European network of 61 NGOs advocating for democratic, sustainable and human rights-based financial and economic systems.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a8467b27f273874066185b_Eurodad_logo_withnotext.png", website:"https://www.eurodad.org/", region:"europe", category:"campaigning" },
  { name:"Fair Tax Mark", slug:"fair-tax-mark", description:"Certification scheme that is the gold standard of responsible tax conduct.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8ce2f1bb001c9067e6cd_logo-1.png", website:"https://fairtaxmark.net/", region:"europe", category:"research" },
  { name:"Friedrich Ebert Stiftung", slug:"friedrich-ebert-stiftung", description:"German political foundation promoting social democracy and economic justice internationally.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8c3d9d9a01e5492aef52_index.png", website:"https://www.fes.de/", region:"europe", category:"institutions" },
  { name:"G20", slug:"g20", description:"Key player in building momentum for international standard setting rules.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84f3090e805e623875007_logo_main.png", website:"https://g20.org/", region:"global", category:"institutions" },
  { name:"Global Alliance for Tax Justice", slug:"global-alliance-for-tax-justice", description:"Global coalition bringing together regional tax justice networks advocating for progressive tax systems.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a845895649631835e59e22_logoggttgg.png", website:"https://globaltaxjustice.org/", region:"africa", category:"campaigning" },
  { name:"IBDF", slug:"ibdf", description:"Independent non-profit foundation based in Amsterdam dedicated to advancing knowledge of cross-border taxation.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84b52983ea5393a2809d8_logo%20(1).svg", website:"https://www.ibfd.org/", region:"global", category:"research" },
  { name:"ICRICT", slug:"icrict", description:"Independent commission of global leaders advocating for reform of the international corporate tax system. Led by Joe Stiglitz & Jayati Gosh.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84a992fd028fcac2c9afb_Icrict10YearsWideWhite-02-1024x225.png", website:"https://www.icrict.com/", region:"global", category:"campaigning" },
  { name:"Institute on Taxation and Economic Policy", slug:"itep", description:"Non-profit, non-partisan organization that conducts rigorous analyses of tax and economic proposals.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84ca8ac43f76907a7190e_itep-logo.webp", website:"https://itep.org/", region:"north-america", category:"research" },
  { name:"International Centre for Tax and Development", slug:"ictd", description:"Aims to improve tax policy and administration in lower-income countries through collaborative research.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84c1c2707dad8f176f916_ICTD-Logo-ThreeLines-300x142.jpeg", website:"https://www.ictd.ac/", region:"africa", category:"research" },
  { name:"International Tax Observatory", slug:"international-tax-observatory", description:"Independent research institute led by Gabriel Zucman, conducting innovative research on tax evasion and fraud.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84d050cabe01e6755adbe_c2bc9fd7-9305-4dfa-8ea8-d17e71958e02.svg", website:"https://www.taxobservatory.eu/", region:"global", category:"research" },
  { name:"Latindadd", slug:"latindadd", description:"Latin American and Caribbean network for economic, social and climate justice, combating tax evasion by multinationals.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a8461194c9c5d74fafa255_web-25-anos_Mesa-de-trabajo-1.png", website:"https://latindadd.org/", region:"latin-america", category:"campaigning" },
  { name:"Moral Ambition", slug:"moral-ambition", description:"Fellowship program that trains and funds experienced professionals to build careers in tax justice.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a850b11772e53b75446f21_e167a68f-d301-4672-9017-79d75739406b.svg", website:"https://www.moralambition.org/jobs/tax-fairness-fellowship", region:"global", category:"campaigning" },
  { name:"OECD", slug:"oecd", description:"OECD/G20 project equipping governments with instruments to combat tax avoidance and base erosion by multinationals.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84d8b0c35b35701c59d0a_5cd94d88-1c8f-4204-9af9-768d818fc27b.svg", website:"https://www.oecd.org/en/topics/base-erosion-and-profit-shifting-beps.html", region:"global", category:"institutions" },
  { name:"Oikoumene - World Council of Churches", slug:"oikoumene", description:"World Council of Churches working on economic and social justice from a faith perspective.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8b7ce5b832db046ed190_logo%20(1).png", website:"https://www.oikoumene.org/", region:"global", category:"institutions" },
  { name:"Oxfam International", slug:"oxfam-international", description:"International confederation of organizations working against poverty and injustice, including campaigns on tax justice.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84aefa86ee3f98ade288c_apple-touch-icon.png", website:"https://www.oxfam.org/en", region:"global", category:"campaigning" },
  { name:"Patriotic Millionaires", slug:"patriotic-millionaires", description:"Taking advantage of their membership to influence the narrative over taxation of high-net-worth individuals.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a848654fb19283e3e235ef_logo.svg", website:"https://patrioticmillionaires.org/", region:"north-america", category:"campaigning" },
  { name:"Public Services International", slug:"public-services-international", description:"Global trade union federation representing 30 million public service workers in 154 countries.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8b1e67989d49d75a2e6c_4c08d674-cf72-4014-bb77-543ca43c479b.svg", website:"https://publicservices.international/", region:"global", category:"institutions" },
  { name:"South Center", slug:"south-center", description:"Aims to advance international tax cooperation to support sustainable development in the Global South.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84bca886f895bb89bab3b_SouthCentre_Logo.svg", website:"https://taxinitiative.southcentre.int/", region:"africa", category:"research" },
  { name:"South Centre", slug:"south-centre", description:"Intergovernmental think tank of Global South countries providing intellectual and policy support to developing nations.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa88a4ff59044c68b474f0_Logo-South-Centre-CMYK-1-e1642701877608.png", website:"https://www.southcentre.int/", region:"global", category:"institutions" },
  { name:"Tax Inspectors Without Borders", slug:"tiwb", description:"Joint OECD-UNDP initiative supporting developing countries by strengthening their tax audit and investigation capacities.", logo:"", website:"https://www.tiwb.org/en.html", region:"europe", category:"institutions" },
  { name:"Tax Justice Network", slug:"tax-justice-network", description:"International research and advocacy network combating tax abuse, tax havens and financial secrecy.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a851a068d6f7ef4ae8e925_logo-3.png", website:"https://taxjustice.net/", region:"global", category:"research" },
  { name:"Tax Justice Network Africa", slug:"tax-justice-network-africa", description:"Pan-African network of civil society organizations promoting pro-poor tax systems and combating illicit financial flows.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a846fe68195d14794134cd_logo.png", website:"https://taxjusticeafrica.net/", region:"africa", category:"campaigning" },
  { name:"UN Framework Tax Convention", slug:"un-framework-tax-convention", description:"International legal instrument being negotiated (2025–2027) to establish an inclusive, UN-led platform for reforming global tax rules.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84e76dc7532e56779dd32_c80c5bb1-8fdc-40b0-b534-39595e8a378d.jpg", website:"https://financing.desa.un.org/unfcitc", region:"global", category:"institutions" },
  { name:"World Inequality Lab", slug:"world-inequality-lab", description:"Global research center based at the Paris School of Economics, dedicated to evidence-based research on socio-economic inequality.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84b913facf5f11165bf7b_logo-wil-simple-dark.png", website:"https://inequalitylab.world/en/", region:"global", category:"research" },
  { name:"ptlacsocial", slug:"ptlacsocial", description:"Permanent civil society advisory council monitoring the Latin American and Caribbean Tax Platform.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84fdd6ffd45d9dfb66e20_Logo-PTLAC.png", website:"https://ptlacsocial.org/", region:"latin-america", category:"institutions" },
];

// ─── REGION CONFIG ────────────────────────────────────────────────────────────
const REGION_COUNTRY_GROUPS = {
  "north-america": ["US","CA","MX","GT","BZ","HN","SV","NI","CR","PA","CU","JM","HT","DO","PR","TT","BB","LC","VC","GD","AG","DM","KN"],
  "latin-america": ["BR","AR","CL","CO","PE","VE","EC","BO","PY","UY","GY","SR","GF"],
  "europe":        ["GB","FR","DE","ES","IT","PT","NL","BE","LU","CH","AT","SE","NO","DK","FI","IS","IE","PL","CZ","SK","HU","RO","BG","GR","HR","SI","RS","BA","ME","MK","AL","XK","LT","LV","EE","BY","UA","MD","MT","CY"],
  "africa":        ["NG","ET","EG","CD","TZ","KE","UG","ZA","DZ","SD","MA","AO","MZ","GH","MG","CM","CI","NE","BF","ML","MW","ZM","SN","SO","TD","GN","RW","BJ","TN","BI","SS","TG","SL","LY","CG","LR","CF","MR","ER","GM","BW","NA","GA","LS","GW","GQ","MU","SZ","DJ","KM","CV","ST","SC","ZW"],
  "asia":          ["CN","IN","ID","PK","BD","JP","PH","VN","TR","IR","TH","MM","KR","IQ","AF","SA","UZ","MY","YE","NP","KZ","SY","KH","AE","TJ","IL","AZ","JO","LB","KG","TM","SG","OM","PS","KW","GE","MN","AM","QA","BH","TL","LK","BT","MV","KP","TW","HK","MO","BN"],
  "oceania":       ["AU","PG","NZ","FJ","SB","VU","WS","KI","TO","FM","PW","MH","NR","TV"],
  "global":        [],
};
const REGION_LABELS = {
  "global":"Global","north-america":"North America","latin-america":"Latin America",
  "europe":"Europe","africa":"Africa","asia":"Asia","oceania":"Oceania",
};
// Each region uses a Webflow brand CSS variable for its map fill colour.
// Change --swatch--brand-500 in Webflow → all fills update automatically.
const REGION_VAR = {
  "global":        "var(--swatch--dark-800)",
  "north-america": "var(--swatch--brand-600)",
  "latin-america": "var(--swatch--brand-500)",
  "europe":        "var(--swatch--brand-700)",
  "africa":        "var(--swatch--brand-400)",
  "asia":          "var(--swatch--brand-800)",
  "oceania":       "var(--swatch--brand-300)",
};
const CATEGORY_VAR = {
  campaigning: "var(--swatch--brand-600)",
  research:    "var(--swatch--dark-800)",
  institutions:"var(--swatch--brand-800)",
};

// ─── ISO NUMERIC → ALPHA-2 ───────────────────────────────────────────────────
const N2A = {
  4:"AF",8:"AL",12:"DZ",24:"AO",32:"AR",36:"AU",40:"AT",50:"BD",56:"BE",64:"BT",68:"BO",
  76:"BR",100:"BG",116:"KH",120:"CM",124:"CA",144:"LK",152:"CL",156:"CN",170:"CO",180:"CD",
  188:"CR",191:"HR",192:"CU",203:"CZ",204:"BJ",208:"DK",214:"DO",218:"EC",818:"EG",222:"SV",
  231:"ET",246:"FI",250:"FR",266:"GA",276:"DE",288:"GH",300:"GR",320:"GT",324:"GN",332:"HT",
  340:"HN",348:"HU",356:"IN",360:"ID",364:"IR",368:"IQ",372:"IE",376:"IL",380:"IT",388:"JM",
  392:"JP",400:"JO",404:"KE",408:"KP",410:"KR",414:"KW",417:"KG",418:"LA",422:"LB",430:"LR",
  434:"LY",442:"LU",450:"MG",454:"MW",458:"MY",466:"ML",484:"MX",504:"MA",508:"MZ",516:"NA",
  524:"NP",528:"NL",554:"NZ",558:"NI",562:"NE",566:"NG",586:"PK",591:"PA",598:"PG",600:"PY",
  604:"PE",608:"PH",616:"PL",620:"PT",642:"RO",643:"RU",646:"RW",682:"SA",686:"SN",694:"SL",
  706:"SO",710:"ZA",716:"ZW",724:"ES",729:"SD",752:"SE",756:"CH",762:"TJ",764:"TH",788:"TN",
  792:"TR",800:"UG",804:"UA",784:"AE",826:"GB",834:"TZ",840:"US",858:"UY",860:"UZ",862:"VE",
  704:"VN",887:"YE",894:"ZM",496:"MN",104:"MM",20:"AD",31:"AZ",51:"AM",70:"BA",112:"BY",
  196:"CY",233:"EE",268:"GE",428:"LV",440:"LT",807:"MK",498:"MD",499:"ME",703:"SK",705:"SI",688:"RS",
};

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function OrganizationMap() {
  const [search, setSearch]                     = useState("");
  const [selectedRegion, setSelectedRegion]     = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOrg, setSelectedOrg]           = useState(null);
  const [hoveredOrg, setHoveredOrg]             = useState(null);
  const [showHint, setShowHint]                 = useState(true);

  // Inject CSS variables as a <style> tag so all var() refs resolve correctly
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "wf-vars";
    el.textContent = WEBFLOW_CSS;
    document.head.insertBefore(el, document.head.firstChild);
    return () => { try { document.head.removeChild(el); } catch {} };
  }, []);

  // Receive live theme updates from Webflow parent via postMessage
  useEffect(() => {
    const handler = ({ data }) => {
      if (data?.type !== "WEBFLOW_THEME") return;
      const el = document.getElementById("wf-vars");
      if (!el) return;
      let css = el.textContent;
      Object.entries(data.vars).forEach(([k, v]) => {
        // Only patch raw swatch overrides; derived tokens cascade automatically
        const re = new RegExp(`(${k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\s*:)[^;]+;`);
        css = css.replace(re, `$1 ${v};`);
      });
      el.textContent = css;
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const filtered = ORGANIZATIONS.filter(o =>
    (!search || o.name.toLowerCase().includes(search.toLowerCase())) &&
    (!selectedRegion || o.region === selectedRegion) &&
    (!selectedCategory || o.category === selectedCategory)
  );
  const activeRegions = new Set(filtered.map(o => o.region));

  const countryRegionMap = {};
  Object.entries(REGION_COUNTRY_GROUPS).forEach(([r, codes]) =>
    codes.forEach(c => { countryRegionMap[c] = r; })
  );

  const toggleRegion = (r) => { setSelectedRegion(p => p === r ? null : r); setSelectedOrg(null); setShowHint(false); };

  return (
    <div style={S.root}>
      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside style={S.sidebar}>
        <div style={S.sidebarTop}>

          {/* Search */}
          <label style={S.searchBox}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ color:"var(--_theme---border)", flexShrink:0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input style={S.searchInput} placeholder="Search organizations…"
              value={search} onChange={e => { setSearch(e.target.value); setSelectedOrg(null); }} />
            {search && <button style={S.clearX} onClick={() => setSearch("")}>✕</button>}
          </label>

          {/* Category chips */}
          <div style={S.chipRow}>
            {["campaigning","research","institutions"].map(cat => {
              const on = selectedCategory === cat;
              return (
                <button key={cat} style={{ ...S.chip,
                  background:  on ? "var(--_theme---button-primary--background)" : "transparent",
                  color:       on ? "var(--_theme---button-primary--text)"       : "var(--_theme---text)",
                  borderColor: on ? "var(--_theme---button-primary--border)"     : "var(--_theme---border)",
                }}
                  onClick={() => { setSelectedCategory(p => p === cat ? null : cat); setSelectedOrg(null); }}>
                  <span style={{ ...S.dot, background: CATEGORY_VAR[cat] }}/>
                  {cat[0].toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Active region */}
          {selectedRegion && (
            <div style={S.activeRow}>
              <span style={S.activePill}>
                <span style={{ ...S.dot, background: REGION_VAR[selectedRegion] }}/>
                {REGION_LABELS[selectedRegion]}
              </span>
              <button style={S.clearRegion} onClick={() => { setSelectedRegion(null); setSelectedOrg(null); }}>
                ✕ Clear
              </button>
            </div>
          )}

          <p style={S.count}>
            {filtered.length === ORGANIZATIONS.length
              ? `All ${ORGANIZATIONS.length} organizations`
              : `${filtered.length} of ${ORGANIZATIONS.length} organizations`}
          </p>
        </div>

        {/* Org list */}
        <div style={S.list}>
          {filtered.length === 0 && <p style={S.empty}>No organizations match.</p>}
          {filtered.map(org => {
            const active = selectedOrg?.slug === org.slug;
            const hovered = hoveredOrg === org.slug;
            return (
              <div key={org.slug} style={{ ...S.row,
                background:  active  ? "var(--_theme---background)" : hovered ? "color-mix(in srgb, var(--_theme---text) 5%, transparent)" : "transparent",
                borderLeft:  `3px solid ${active ? "var(--_theme---heading-accent)" : "transparent"}`,
              }}
                onClick={() => setSelectedOrg(p => p?.slug === org.slug ? null : org)}
                onMouseEnter={() => setHoveredOrg(org.slug)}
                onMouseLeave={() => setHoveredOrg(null)}>
                <div style={S.logoBox}>
                  {org.logo
                    ? <img src={org.logo} alt={org.name} style={S.logoImg} onError={e => { e.target.style.display="none"; }}/>
                    : <span style={S.logoFb}>{org.name[0]}</span>}
                </div>
                <div style={S.orgText}>
                  <span style={S.orgName}>{org.name}</span>
                  <span style={S.orgMeta}>
                    <span style={{ color: CATEGORY_VAR[org.category], ...S.catTag }}>{org.category}</span>
                    <span style={S.regionTag}>· {REGION_LABELS[org.region]}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Map ───────────────────────────────────────────────────────── */}
      <main style={S.mapArea}>
        <WorldMap countryRegionMap={countryRegionMap} activeRegions={activeRegions}
          selectedRegion={selectedRegion} onRegionClick={toggleRegion} />

        {showHint && (
          <div style={S.hint}>
            <span>Click a region on the map to filter organizations</span>
            <button style={S.hintBtn} onClick={() => setShowHint(false)}>Thanks</button>
          </div>
        )}

        {/* Legend */}
        <div style={S.legend}>
          {Object.entries(REGION_LABELS).filter(([r]) => r !== "global").map(([r, label]) => {
            const n = ORGANIZATIONS.filter(o => o.region === r).length;
            const on = selectedRegion === r;
            return (
              <button key={r} style={{ ...S.legendBtn,
                opacity: selectedRegion && !on ? 0.4 : 1,
                fontWeight: on ? "var(--_typography---font--primary-bold)" : "var(--_typography---font--primary-regular)",
                background: on ? "var(--_theme---background)" : "transparent",
              }} onClick={() => toggleRegion(r)}>
                <span style={{ ...S.dot, background: REGION_VAR[r] }}/>
                {label}
                <span style={S.badge}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {selectedOrg && (
          <div style={S.detail}>
            <button style={S.detailX} onClick={() => setSelectedOrg(null)}>✕</button>
            <div style={S.detailLogoBox}>
              {selectedOrg.logo
                ? <img src={selectedOrg.logo} alt={selectedOrg.name} style={S.detailLogoImg}
                    onError={e => { e.target.style.display="none"; }}/>
                : <span style={S.detailLogoFb}>{selectedOrg.name[0]}</span>}
            </div>
            <h3 style={S.detailName}>{selectedOrg.name}</h3>
            <div style={S.detailBadges}>
              <span style={{ ...S.pill, color: CATEGORY_VAR[selectedOrg.category],
                background:"var(--_theme---background)", border:"var(--border-width--main) solid var(--_theme---border)" }}>
                {selectedOrg.category}
              </span>
              <span style={{ ...S.pill,
                background:"var(--_theme---button-primary--background)",
                color:"var(--_theme---button-primary--text)",
                border:"var(--border-width--main) solid var(--_theme---button-primary--border)" }}>
                {REGION_LABELS[selectedOrg.region]}
              </span>
            </div>
            <p style={S.detailDesc}>{selectedOrg.description}</p>
            <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" style={S.visitBtn}
              onMouseEnter={e => Object.assign(e.currentTarget.style, {
                background:"var(--_theme---button-primary--background-hover)",
                color:"var(--_theme---button-primary--text-hover)",
                borderColor:"var(--_theme---button-primary--border-hover)" })}
              onMouseLeave={e => Object.assign(e.currentTarget.style, {
                background:"var(--_theme---button-primary--background)",
                color:"var(--_theme---button-primary--text)",
                borderColor:"var(--_theme---button-primary--border)" })}>
              Visit website →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── WORLD MAP ────────────────────────────────────────────────────────────────
function WorldMap({ countryRegionMap, activeRegions, selectedRegion, onRegionClick }) {
  const [paths, setPaths] = useState([]);
  const [zoom, setZoom]   = useState(1);
  const [pan, setPan]     = useState({ x:0, y:0 });
  const [drag, setDrag]   = useState(null); // null | {ox, oy}

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(data => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
        s.onload = () => {
          const feat = window.topojson.feature(data, data.objects.countries);
          const proj = merc(960, 500);
          setPaths(feat.features.map(f => {
            const d = toD(f, proj);
            const a = N2A[+f.id] || "";
            return { id:f.id, a2:a, region:countryRegionMap[a]||null, d };
          }).filter(p => p.d));
        };
        document.head.appendChild(s);
      }).catch(()=>{});
  }, []);

  const fill    = p => (!p.region || !activeRegions.has(p.region)) ? "var(--_theme---background)" : REGION_VAR[p.region];
  const opacity = p => (selectedRegion && p.region && p.region !== selectedRegion) ? 0.3 : 1;

  const onWheel = e => { e.preventDefault(); const d = e.deltaY<0?1.15:0.87; setZoom(z=>Math.min(8,Math.max(1,z*d))); };
  const onDown  = e => { if(e.button!==0)return; setDrag({ox:e.clientX-pan.x, oy:e.clientY-pan.y}); };
  const onMove  = e => { if(drag) setPan({x:e.clientX-drag.ox, y:e.clientY-drag.oy}); };
  const onUp    = ()  => setDrag(null);

  return (
    <svg viewBox="0 0 960 500"
      style={{ width:"100%",height:"100%",display:"block",
               background:"var(--_theme---background-2)",
               cursor: drag ? "grabbing":"grab" }}
      onWheel={onWheel} onMouseDown={onDown} onMouseMove={onMove}
      onMouseUp={onUp} onMouseLeave={onUp}>
      <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
        {paths.map(p => (
          <path key={p.id} d={p.d}
            fill={fill(p)} fillOpacity={opacity(p)}
            stroke="var(--_theme---background-2)" strokeWidth={0.5/zoom}
            style={{ cursor:p.region?"pointer":"default", transition:"fill-opacity .2s,fill .2s" }}
            onClick={() => p.region && onRegionClick(p.region)}>
            <title>{REGION_LABELS[p.region]||p.a2}</title>
          </path>
        ))}
      </g>
    </svg>
  );
}

// ─── GEO HELPERS ─────────────────────────────────────────────────────────────
const merc = (w, h) => {
  const sc = (w / (2*Math.PI)) * 0.95;
  return ([lon, lat]) => {
    const x = w/2 + sc*(lon*Math.PI/180);
    const s = Math.sin(lat*Math.PI/180);
    const y = h/2 - sc*Math.log((1+s)/(1-s))/2;
    return [x,y];
  };
};
const toD = (feat, proj) => {
  try {
    const g = feat.geometry; if(!g) return null;
    const polys = g.type==="Polygon"?[g.coordinates]:g.type==="MultiPolygon"?g.coordinates:[];
    let d="";
    for(const poly of polys) for(const ring of poly){
      let first=true;
      let prevLon=null;
      for(const pt of ring){
        const [lon, lat] = pt;
        // Detect antimeridian crossing: if longitude jumps > 180°, start a new subpath
        const crossed = prevLon !== null && Math.abs(lon - prevLon) > 180;
        const [px,py]=proj([lon,lat]);
        if(!isFinite(px)||!isFinite(py)){ prevLon=null; continue; }
        if(first || crossed){
          d+=`M${px.toFixed(1)},${py.toFixed(1)}`;
          first=false;
        } else {
          d+=`L${px.toFixed(1)},${py.toFixed(1)}`;
        }
        prevLon=lon;
      } d+="Z";
    } return d||null;
  } catch{ return null; }
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
// Every colour, font, radius and border value references a Webflow CSS variable.
// Change the design token in Webflow Designer → the map updates automatically.
const S = {
  root:{ display:"flex", width:"100%", height:"100vh", minHeight:500,
    fontFamily:"var(--_text-style---font-family)",
    fontSize:"var(--_typography---font-size--text-small)",
    fontWeight:"var(--_text-style---font-weight)",
    lineHeight:"var(--_text-style---line-height)",
    letterSpacing:"var(--_text-style---letter-spacing)",
    color:"var(--_theme---text)",
    background:"var(--_theme---background)",
    overflow:"hidden" },

  // Sidebar
  sidebar:{ width:272, minWidth:210, background:"var(--_theme---background-2)",
    borderRight:"var(--border-width--main) solid var(--_theme---border)",
    display:"flex", flexDirection:"column", overflow:"hidden" },
  sidebarTop:{ padding:"14px 14px 0",
    borderBottom:"var(--border-width--main) solid var(--_theme---border)" },

  // Search
  searchBox:{ display:"flex", alignItems:"center", gap:8,
    background:"var(--_theme---background)",
    border:"var(--border-width--main) solid var(--_theme---border)",
    borderRadius:"var(--radius--small)", padding:"7px 10px", marginBottom:10, cursor:"text" },
  searchInput:{ flex:1, border:"none", background:"transparent", outline:"none",
    fontFamily:"var(--_text-style---font-family)",
    fontSize:"var(--_typography---font-size--text-small)",
    fontWeight:"var(--_text-style---font-weight)",
    letterSpacing:"var(--_text-style---letter-spacing)",
    color:"var(--_theme---text)" },
  clearX:{ background:"none", border:"none", cursor:"pointer",
    color:"var(--_theme---border)", fontSize:10, padding:0, lineHeight:1 },

  // Chips
  chipRow:{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 },
  chip:{ display:"flex", alignItems:"center", gap:5,
    border:"var(--border-width--main) solid",
    borderRadius:"var(--radius--round)", padding:"3px 10px",
    fontSize:"var(--_typography---font-size--text-small)",
    fontFamily:"var(--_text-style---font-family)",
    fontWeight:"var(--_typography---font--primary-medium)",
    cursor:"pointer", transition:"all .15s", lineHeight:1.4 },
  dot:{ width:7, height:7, borderRadius:"50%", flexShrink:0, display:"inline-block" },

  // Active region row
  activeRow:{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 },
  activePill:{ display:"flex", alignItems:"center", gap:6,
    fontWeight:"var(--_typography---font--primary-medium)",
    fontSize:"var(--_typography---font-size--text-small)" },
  clearRegion:{ background:"none", border:"none", cursor:"pointer",
    color:"var(--_theme---border)", fontSize:"var(--_typography---font-size--text-small)",
    fontFamily:"var(--_text-style---font-family)" },
  count:{ fontSize:"var(--_typography---font-size--text-small)",
    color:"var(--_theme---border)", margin:"0 0 10px", lineHeight:1.4 },

  // List
  list:{ flex:1, overflowY:"auto", padding:"6px 0" },
  row:{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px",
    cursor:"pointer", transition:"background .1s", borderLeft:"3px solid transparent" },
  logoBox:{ width:34, height:34, borderRadius:"var(--radius--small)",
    background:"var(--_theme---background)",
    border:"var(--border-width--main) solid var(--_theme---border)",
    display:"flex", alignItems:"center", justifyContent:"center",
    overflow:"hidden", flexShrink:0 },
  logoImg:{ width:"100%", height:"100%", objectFit:"contain", padding:3 },
  logoFb:{ fontWeight:"var(--_typography---font--primary-bold)",
    color:"var(--_theme---border)", fontSize:13 },
  orgText:{ display:"flex", flexDirection:"column", gap:2,
    overflow:"hidden", minWidth:0 },
  orgName:{ fontSize:"var(--_typography---font-size--text-small)",
    fontWeight:"var(--_typography---font--primary-medium)",
    color:"var(--_theme---text)", whiteSpace:"nowrap",
    overflow:"hidden", textOverflow:"ellipsis" },
  orgMeta:{ display:"flex", alignItems:"center", gap:4 },
  catTag:{ fontWeight:"var(--_typography---font--primary-bold)",
    textTransform:"uppercase", letterSpacing:"0.06em", fontSize:9 },
  regionTag:{ color:"var(--_theme---border)", fontSize:10 },
  empty:{ padding:24, textAlign:"center",
    color:"var(--_theme---border)", fontSize:"var(--_typography---font-size--text-small)" },

  // Map
  mapArea:{ flex:1, position:"relative", overflow:"hidden" },

  // Hint
  hint:{ position:"absolute", bottom:56, left:"50%", transform:"translateX(-50%)",
    background:"var(--_theme---text)", color:"var(--_theme---background)",
    padding:"10px 16px", borderRadius:"var(--radius--small)",
    fontSize:"var(--_typography---font-size--text-small)",
    display:"flex", alignItems:"center", gap:12, zIndex:20,
    whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,0.2)" },
  hintBtn:{ background:"var(--_theme---button-primary--background)",
    border:"none", color:"var(--_theme---button-primary--text)",
    borderRadius:"var(--radius--small)", padding:"4px 12px",
    fontSize:"var(--_typography---font-size--text-small)",
    fontFamily:"var(--_text-style---font-family)",
    fontWeight:"var(--_typography---font--primary-medium)", cursor:"pointer" },

  // Legend
  legend:{ position:"absolute", bottom:14, left:14,
    display:"flex", flexWrap:"wrap", gap:4, zIndex:10,
    background:"var(--_theme---background-2)",
    border:"var(--border-width--main) solid var(--_theme---border)",
    padding:"8px 10px", borderRadius:"var(--radius--small)" },
  legendBtn:{ display:"flex", alignItems:"center", gap:5,
    background:"none", border:"none", cursor:"pointer",
    fontSize:10, color:"var(--_theme---text)", padding:"2px 6px",
    borderRadius:"var(--radius--small)", transition:"all .12s",
    fontFamily:"var(--_text-style---font-family)",
    letterSpacing:"var(--_text-style---letter-spacing)" },
  badge:{ background:"var(--_theme---background)",
    color:"var(--_theme---border)",
    border:"var(--border-width--main) solid var(--_theme---border)",
    borderRadius:"var(--radius--round)", padding:"0 5px",
    fontSize:9, fontWeight:"var(--_typography---font--primary-bold)" },

  // Detail panel
  detail:{ position:"absolute", top:14, right:14, width:256,
    background:"var(--_theme---background-2)",
    border:"var(--border-width--main) solid var(--_theme---border)",
    borderRadius:"var(--radius--main)", padding:20, zIndex:20,
    boxShadow:"0 8px 32px rgba(0,0,0,0.12)" },
  detailX:{ position:"absolute", top:12, right:12,
    background:"var(--_theme---background)",
    border:"var(--border-width--main) solid var(--_theme---border)",
    borderRadius:"var(--radius--small)", width:24, height:24,
    cursor:"pointer", fontSize:11, color:"var(--_theme---text)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"var(--_text-style---font-family)" },
  detailLogoBox:{ width:52, height:52,
    background:"var(--_theme---background)",
    border:"var(--border-width--main) solid var(--_theme---border)",
    borderRadius:"var(--radius--small)", display:"flex",
    alignItems:"center", justifyContent:"center",
    overflow:"hidden", marginBottom:12 },
  detailLogoImg:{ width:"100%", height:"100%", objectFit:"contain", padding:5 },
  detailLogoFb:{ fontSize:20, fontWeight:"var(--_typography---font--primary-bold)",
    color:"var(--_theme---border)" },
  detailName:{ fontFamily:"var(--_text-style---font-family)",
    fontSize:"var(--_typography---font-size--h6)",
    fontWeight:"var(--_typography---font--primary-bold)",
    color:"var(--_theme---text)", margin:"0 0 8px",
    lineHeight:"var(--_typography---line-height--large)" },
  detailBadges:{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" },
  pill:{ fontSize:9, fontWeight:"var(--_typography---font--primary-bold)",
    padding:"3px 8px", borderRadius:"var(--radius--round)",
    textTransform:"uppercase", letterSpacing:"0.06em" },
  detailDesc:{ fontSize:"var(--_typography---font-size--text-small)",
    color:"var(--_theme---text)", lineHeight:"var(--_typography---line-height--huge)",
    margin:"0 0 14px", opacity:.75 },
  visitBtn:{ display:"inline-block",
    fontFamily:"var(--_text-style---font-family)",
    fontSize:"var(--_typography---font-size--text-small)",
    fontWeight:"var(--_typography---font--primary-medium)",
    background:"var(--_theme---button-primary--background)",
    color:"var(--_theme---button-primary--text)",
    border:"var(--border-width--main) solid var(--_theme---button-primary--border)",
    borderRadius:"var(--radius--round)", padding:"6px 16px",
    textDecoration:"none", transition:"all .15s", cursor:"pointer" },
};
