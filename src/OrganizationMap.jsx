import { useState, useEffect, useRef } from "react";

const BRAND_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,800&family=Inter:wght@400;600;700&display=swap');
  :root {
    --amber-fire:  #EF9F27; --amber-deep: #BA7517; --amber-light: #FAC775;
    --amber-wash:  #FAEEDA; --amber-dark1:#854F0B; --amber-dark2: #633806; --amber-dark3:#412402;
    --green-accent:#97C459; --green-mid:  #639922; --green-deep:  #3B6D11;
    --near-black:  #0E0E0B; --dark2:      #1a1200; --dark3:       #2a1c00;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::selection { background: #EF9F27; color: #0E0E0B; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1a1200; }
  ::-webkit-scrollbar-thumb { background: #633806; border-radius: 4px; }
`;

const ORGANIZATIONS = [
  { name:"ActionAid", slug:"actionaid", description:"International development and human rights organization working on tax justice and global inequalities.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a8584fd864d3b952a7ff6e_aa-logo-white.svg", website:"https://actionaid.org/", region:"global", category:"campaigning" },
  { name:"African Tax Administration Forum", slug:"african-tax-administration-forum", description:"A platform for cooperation among African tax authorities to build efficient tax systems and combat tax evasion.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84f714d32998443ea75f9_auweblogo-en.png", website:"https://au.int/", region:"africa", category:"institutions" },
  { name:"Alliance Sud", slug:"alliance-sud", description:"Swiss development policy organization advocating for tax justice and financial transparency.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85a9f75c7ac589772ebfe_5012%252520Alliance%252520Sud%252520Logo%252520Zusatz%252520FR.svg", website:"https://www.alliancesud.ch/fr", region:"europe", category:"campaigning" },
  { name:"Arab NGO Network for Development", slug:"arab-ngo-network-for-development", description:"Arab NGO network working on development and social justice in the MENA region.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a8591b7094978691da8454_logo.png", website:"https://www.annd.org/en", region:"asia", category:"campaigning" },
  { name:"BEPS Monitoring Group", slug:"beps-monitoring-group", description:"Global network of independent researchers producing technical reports on international taxation reform.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85145174abcf17ab0a3e8_favicon.webp", website:"https://www.bepsmonitoringgroup.org/", region:"global", category:"research" },
  { name:"Center for Economic and Social Rights", slug:"center-for-economic-and-social-rights", description:"International human rights organization using a rights-based approach for economic and social justice.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85b1fc5dc48f50ff8f9d3_logo%20(2).svg", website:"https://www.cesr.org/", region:"north-america", category:"campaigning" },
  { name:"Centre for International Corporate Tax Accountability and Research", slug:"cictar", description:"Research center conducting detailed investigations into multinational tax arrangements.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85761be9f6ac5ac7aa1d6_logo_text-1-1024x374.webp", website:"https://cictar.org/research-themes", region:"oceania", category:"research" },
  { name:"Centre for Trade Policy and Development Zambia", slug:"ctpd-zambia", description:"Zambian research and advocacy center on trade policy and development.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8c954b7f75d097c19e96_apple-icon-144x144.png", website:"https://ctpd.org.zm/", region:"africa", category:"institutions" },
  { name:"Christian Aid", slug:"christian-aid", description:"British humanitarian organization fighting poverty and injustice, including work on tax justice.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85b71ca775a25042857f7_logo%20(3).svg", website:"https://www.christianaid.org.uk/", region:"europe", category:"campaigning" },
  { name:"Committee on Fiscal Studies", slug:"committee-on-fiscal-studies", description:"Center at the University of Nairobi dedicated to reforming and strengthening tax systems in the Global South.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a85323755e1431cd30983e_Black%20White%20Minimalist%20Name%20Monogram%20Logo_0.png", website:"https://cfs.uonbi.ac.ke/", region:"africa", category:"campaigning" },
  { name:"Eurodad", slug:"eurodad", description:"European network of 61 NGOs advocating for democratic, sustainable and human rights-based financial systems.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a8467b27f273874066185b_Eurodad_logo_withnotext.png", website:"https://www.eurodad.org/", region:"europe", category:"campaigning" },
  { name:"Fair Tax Mark", slug:"fair-tax-mark", description:"Certification scheme that is the gold standard of responsible tax conduct.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8ce2f1bb001c9067e6cd_logo-1.png", website:"https://fairtaxmark.net/", region:"europe", category:"research" },
  { name:"Friedrich Ebert Stiftung", slug:"friedrich-ebert-stiftung", description:"German political foundation promoting social democracy and economic justice internationally.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8c3d9d9a01e5492aef52_index.png", website:"https://www.fes.de/", region:"europe", category:"institutions" },
  { name:"G20", slug:"g20", description:"Key player in building momentum for international standard setting rules.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84f3090e805e623875007_logo_main.png", website:"https://g20.org/", region:"global", category:"institutions" },
  { name:"Global Alliance for Tax Justice", slug:"global-alliance-for-tax-justice", description:"Global coalition bringing together regional tax justice networks advocating for progressive tax systems.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a845895649631835e59e22_logoggttgg.png", website:"https://globaltaxjustice.org/", region:"africa", category:"campaigning" },
  { name:"IBDF", slug:"ibdf", description:"Independent non-profit foundation based in Amsterdam advancing knowledge of cross-border taxation.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84b52983ea5393a2809d8_logo%20(1).svg", website:"https://www.ibfd.org/", region:"global", category:"research" },
  { name:"ICRICT", slug:"icrict", description:"Independent commission of global leaders advocating for reform of the international corporate tax system. Led by Joe Stiglitz & Jayati Gosh.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84a992fd028fcac2c9afb_Icrict10YearsWideWhite-02-1024x225.png", website:"https://www.icrict.com/", region:"global", category:"campaigning" },
  { name:"Institute on Taxation and Economic Policy", slug:"itep", description:"Non-profit, non-partisan organization conducting rigorous analyses of tax and economic proposals.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84ca8ac43f76907a7190e_itep-logo.webp", website:"https://itep.org/", region:"north-america", category:"research" },
  { name:"International Centre for Tax and Development", slug:"ictd", description:"Aims to improve tax policy and administration in lower-income countries through collaborative research.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84c1c2707dad8f176f916_ICTD-Logo-ThreeLines-300x142.jpeg", website:"https://www.ictd.ac/", region:"africa", category:"research" },
  { name:"International Tax Observatory", slug:"international-tax-observatory", description:"Independent research institute led by Gabriel Zucman, conducting innovative research on tax evasion.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84d050cabe01e6755adbe_c2bc9fd7-9305-4dfa-8ea8-d17e71958e02.svg", website:"https://www.taxobservatory.eu/", region:"global", category:"research" },
  { name:"Latindadd", slug:"latindadd", description:"Latin American and Caribbean network for economic, social and climate justice, combating tax evasion by multinationals.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a8461194c9c5d74fafa255_web-25-anos_Mesa-de-trabajo-1.png", website:"https://latindadd.org/", region:"latin-america", category:"campaigning" },
  { name:"Moral Ambition", slug:"moral-ambition", description:"Fellowship program training professionals to build careers in tax justice.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a850b11772e53b75446f21_e167a68f-d301-4672-9017-79d75739406b.svg", website:"https://www.moralambition.org/jobs/tax-fairness-fellowship", region:"global", category:"campaigning" },
  { name:"OECD", slug:"oecd", description:"OECD/G20 project equipping governments with instruments to combat tax avoidance and base erosion.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84d8b0c35b35701c59d0a_5cd94d88-1c8f-4204-9af9-768d818fc27b.svg", website:"https://www.oecd.org/en/topics/base-erosion-and-profit-shifting-beps.html", region:"global", category:"institutions" },
  { name:"Oikoumene - World Council of Churches", slug:"oikoumene", description:"World Council of Churches working on economic and social justice from a faith perspective.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8b7ce5b832db046ed190_logo%20(1).png", website:"https://www.oikoumene.org/", region:"global", category:"institutions" },
  { name:"Oxfam International", slug:"oxfam-international", description:"International confederation of organizations working against poverty and injustice, including campaigns on tax justice.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84aefa86ee3f98ade288c_apple-touch-icon.png", website:"https://www.oxfam.org/en", region:"global", category:"campaigning" },
  { name:"Patriotic Millionaires", slug:"patriotic-millionaires", description:"Influencing the narrative over taxation of high-net-worth individuals.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a848654fb19283e3e235ef_logo.svg", website:"https://patrioticmillionaires.org/", region:"north-america", category:"campaigning" },
  { name:"Public Services International", slug:"public-services-international", description:"Global trade union federation representing 30 million public service workers in 154 countries.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa8b1e67989d49d75a2e6c_4c08d674-cf72-4014-bb77-543ca43c479b.svg", website:"https://publicservices.international/", region:"global", category:"institutions" },
  { name:"South Center", slug:"south-center", description:"Aims to advance international tax cooperation to support sustainable development in the Global South.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84bca886f895bb89bab3b_SouthCentre_Logo.svg", website:"https://taxinitiative.southcentre.int/", region:"africa", category:"research" },
  { name:"South Centre", slug:"south-centre", description:"Intergovernmental think tank of Global South countries providing intellectual and policy support.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69aa88a4ff59044c68b474f0_Logo-South-Centre-CMYK-1-e1642701877608.png", website:"https://www.southcentre.int/", region:"global", category:"institutions" },
  { name:"Tax Inspectors Without Borders", slug:"tiwb", description:"Joint OECD-UNDP initiative supporting developing countries by strengthening their tax audit capacities.", logo:"", website:"https://www.tiwb.org/en.html", region:"europe", category:"institutions" },
  { name:"Tax Justice Network", slug:"tax-justice-network", description:"International research and advocacy network combating tax abuse, tax havens and financial secrecy.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a851a068d6f7ef4ae8e925_logo-3.png", website:"https://taxjustice.net/", region:"global", category:"research" },
  { name:"Tax Justice Network Africa", slug:"tax-justice-network-africa", description:"Pan-African network promoting pro-poor tax systems and combating illicit financial flows.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a846fe68195d14794134cd_logo.png", website:"https://taxjusticeafrica.net/", region:"africa", category:"campaigning" },
  { name:"UN Framework Tax Convention", slug:"un-framework-tax-convention", description:"International legal instrument (2025–2027) establishing an inclusive UN-led platform for reforming global tax rules.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84e76dc7532e56779dd32_c80c5bb1-8fdc-40b0-b534-39595e8a378d.jpg", website:"https://financing.desa.un.org/unfcitc", region:"global", category:"institutions" },
  { name:"World Inequality Lab", slug:"world-inequality-lab", description:"Global research center at the Paris School of Economics producing evidence-based research on inequality.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84b913facf5f11165bf7b_logo-wil-simple-dark.png", website:"https://inequalitylab.world/en/", region:"global", category:"research" },
  { name:"ptlacsocial", slug:"ptlacsocial", description:"Permanent civil society advisory council monitoring the Latin American and Caribbean Tax Platform.", logo:"https://cdn.prod.website-files.com/69925f8f8c3cfd8595051ef6/69a84fdd6ffd45d9dfb66e20_Logo-PTLAC.png", website:"https://ptlacsocial.org/", region:"latin-america", category:"institutions" },
];

const REGION_COUNTRY_GROUPS = {
  "north-america":["US","CA","MX","GT","BZ","HN","SV","NI","CR","PA","CU","JM","HT","DO","PR","TT","BB","LC","VC","GD","AG","DM","KN"],
  "latin-america":["BR","AR","CL","CO","PE","VE","EC","BO","PY","UY","GY","SR","GF"],
  "europe":["GB","FR","DE","ES","IT","PT","NL","BE","LU","CH","AT","SE","NO","DK","FI","IS","IE","PL","CZ","SK","HU","RO","BG","GR","HR","SI","RS","BA","ME","MK","AL","XK","LT","LV","EE","BY","UA","MD","MT","CY"],
  "africa":["NG","ET","EG","CD","TZ","KE","UG","ZA","DZ","SD","MA","AO","MZ","GH","MG","CM","CI","NE","BF","ML","MW","ZM","SN","SO","TD","GN","RW","BJ","TN","BI","SS","TG","SL","LY","CG","LR","CF","MR","ER","GM","BW","NA","GA","LS","GW","GQ","MU","SZ","DJ","KM","CV","ST","SC","ZW"],
  "asia":["CN","IN","ID","PK","BD","JP","PH","VN","TR","IR","TH","MM","KR","IQ","AF","SA","UZ","MY","YE","NP","KZ","SY","KH","AE","TJ","IL","AZ","JO","LB","KG","TM","SG","OM","PS","KW","GE","MN","AM","QA","BH","TL","LK","BT","MV","KP","TW","HK","MO","BN"],
  "oceania":["AU","PG","NZ","FJ","SB","VU","WS","KI","TO","FM","PW","MH","NR","TV"],
  "global":[],
};
const REGION_LABELS={"global":"Global","north-america":"North America","latin-america":"Latin America","europe":"Europe","africa":"Africa","asia":"Asia","oceania":"Oceania"};
const REGION_FILL={"global":"#2a1c00","north-america":"#854F0B","latin-america":"#97C459","europe":"#EF9F27","africa":"#BA7517","asia":"#FAC775","oceania":"#639922"};
const CATEGORY_COLOR={campaigning:"#EF9F27",research:"#97C459",institutions:"#FAC775"};
const N2A={4:"AF",8:"AL",12:"DZ",24:"AO",32:"AR",36:"AU",40:"AT",50:"BD",56:"BE",64:"BT",68:"BO",76:"BR",100:"BG",116:"KH",120:"CM",124:"CA",144:"LK",152:"CL",156:"CN",170:"CO",180:"CD",188:"CR",191:"HR",192:"CU",203:"CZ",204:"BJ",208:"DK",214:"DO",218:"EC",818:"EG",222:"SV",231:"ET",246:"FI",250:"FR",266:"GA",276:"DE",288:"GH",300:"GR",320:"GT",324:"GN",332:"HT",340:"HN",348:"HU",356:"IN",360:"ID",364:"IR",368:"IQ",372:"IE",376:"IL",380:"IT",388:"JM",392:"JP",400:"JO",404:"KE",408:"KP",410:"KR",414:"KW",417:"KG",418:"LA",422:"LB",430:"LR",434:"LY",442:"LU",450:"MG",454:"MW",458:"MY",466:"ML",484:"MX",504:"MA",508:"MZ",516:"NA",524:"NP",528:"NL",554:"NZ",558:"NI",562:"NE",566:"NG",586:"PK",591:"PA",598:"PG",600:"PY",604:"PE",608:"PH",616:"PL",620:"PT",642:"RO",643:"RU",646:"RW",682:"SA",686:"SN",694:"SL",706:"SO",710:"ZA",716:"ZW",724:"ES",729:"SD",752:"SE",756:"CH",762:"TJ",764:"TH",788:"TN",792:"TR",800:"UG",804:"UA",784:"AE",826:"GB",834:"TZ",840:"US",858:"UY",860:"UZ",862:"VE",704:"VN",887:"YE",894:"ZM",496:"MN",104:"MM",20:"AD",31:"AZ",51:"AM",70:"BA",112:"BY",196:"CY",233:"EE",268:"GE",428:"LV",440:"LT",807:"MK",498:"MD",499:"ME",703:"SK",705:"SI",688:"RS"};

export default function OrganizationMap() {
  const [search,setSearch]=useState("");
  const [selectedRegion,setSelectedRegion]=useState(null);
  const [selectedCategory,setSelectedCategory]=useState(null);
  const [selectedOrg,setSelectedOrg]=useState(null);
  const [hoveredOrg,setHoveredOrg]=useState(null);
  const [showHint,setShowHint]=useState(true);

  useEffect(()=>{
    const el=document.createElement("style");
    el.id="regen-brand"; el.textContent=BRAND_CSS;
    document.head.insertBefore(el,document.head.firstChild);
    return ()=>{try{document.head.removeChild(el);}catch{}};
  },[]);

  const filtered=ORGANIZATIONS.filter(o=>
    (!search||o.name.toLowerCase().includes(search.toLowerCase()))&&
    (!selectedRegion||o.region===selectedRegion)&&
    (!selectedCategory||o.category===selectedCategory)
  );
  const activeRegions=new Set(filtered.map(o=>o.region));
  const countryRegionMap={};
  Object.entries(REGION_COUNTRY_GROUPS).forEach(([r,codes])=>codes.forEach(c=>{countryRegionMap[c]=r;}));
  const toggleRegion=(r)=>{setSelectedRegion(p=>p===r?null:r);setSelectedOrg(null);setShowHint(false);};

  return (
    <div style={S.root}>
      <aside style={S.sidebar}>
        <div style={S.sidebarTop}>
          <label style={S.searchBox}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#BA7517" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input style={S.searchInput} placeholder="Search organizations…" value={search} onChange={e=>{setSearch(e.target.value);setSelectedOrg(null);}}/>
            {search&&<button style={S.clearX} onClick={()=>setSearch("")}>✕</button>}
          </label>
          <div style={S.chipRow}>
            {["campaigning","research","institutions"].map(cat=>{
              const on=selectedCategory===cat;
              return <button key={cat} style={{...S.chip,background:on?"#BA7517":"transparent",color:on?"#fff":"rgba(250,250,247,0.5)",borderColor:on?"#BA7517":"rgba(186,117,23,0.3)"}} onClick={()=>{setSelectedCategory(p=>p===cat?null:cat);setSelectedOrg(null);}}>
                <span style={{...S.dot,background:CATEGORY_COLOR[cat]}}/>{cat[0].toUpperCase()+cat.slice(1)}
              </button>;
            })}
          </div>
          {selectedRegion&&<div style={S.activeRow}>
            <span style={S.activePill}><span style={{...S.dot,background:REGION_FILL[selectedRegion]}}/>{REGION_LABELS[selectedRegion]}</span>
            <button style={S.clearRegion} onClick={()=>{setSelectedRegion(null);setSelectedOrg(null);}}>✕ Clear</button>
          </div>}
          <p style={S.count}>{filtered.length===ORGANIZATIONS.length?`All ${ORGANIZATIONS.length} organizations`:`${filtered.length} of ${ORGANIZATIONS.length} organizations`}</p>
        </div>
        <div style={S.list}>
          {filtered.length===0&&<p style={S.empty}>No organizations match.</p>}
          {filtered.map(org=>{
            const active=selectedOrg?.slug===org.slug;
            const hovered=hoveredOrg===org.slug;
            return <div key={org.slug} style={{...S.row,background:active?"rgba(186,117,23,0.12)":hovered?"rgba(186,117,23,0.06)":"transparent",borderLeft:`3px solid ${active?"#EF9F27":"transparent"}`}}
              onClick={()=>setSelectedOrg(p=>p?.slug===org.slug?null:org)}
              onMouseEnter={()=>setHoveredOrg(org.slug)} onMouseLeave={()=>setHoveredOrg(null)}>
              <div style={S.logoBox}>{org.logo?<img src={org.logo} alt={org.name} style={S.logoImg} onError={e=>{e.target.style.display="none";}}/>:<span style={S.logoFb}>{org.name[0]}</span>}</div>
              <div style={S.orgText}>
                <span style={S.orgName}>{org.name}</span>
                <span style={S.orgMeta}><span style={{...S.catTag,color:CATEGORY_COLOR[org.category]}}>{org.category}</span><span style={S.regionTag}>· {REGION_LABELS[org.region]}</span></span>
              </div>
            </div>;
          })}
        </div>
      </aside>

      <main style={S.mapArea}>
        <WorldMap countryRegionMap={countryRegionMap} activeRegions={activeRegions} selectedRegion={selectedRegion} onRegionClick={toggleRegion}/>
        {showHint&&<div style={S.hint}><span>Click a region on the map to filter organizations</span><button style={S.hintBtn} onClick={()=>setShowHint(false)}>Thanks</button></div>}
        <div style={S.legend}>
          {Object.entries(REGION_LABELS).filter(([r])=>r!=="global").map(([r,label])=>{
            const n=ORGANIZATIONS.filter(o=>o.region===r).length;
            const on=selectedRegion===r;
            return <button key={r} style={{...S.legendBtn,opacity:selectedRegion&&!on?0.4:1,fontWeight:on?700:400,background:on?"rgba(186,117,23,0.15)":"transparent"}} onClick={()=>toggleRegion(r)}>
              <span style={{...S.dot,background:REGION_FILL[r]}}/>{label}<span style={S.badge}>{n}</span>
            </button>;
          })}
        </div>
        {selectedOrg&&<div style={S.detail}>
          <button style={S.detailX} onClick={()=>setSelectedOrg(null)}>✕</button>
          <div style={S.detailLogoBox}>{selectedOrg.logo?<img src={selectedOrg.logo} alt={selectedOrg.name} style={S.detailLogoImg} onError={e=>{e.target.style.display="none";}}/>:<span style={S.detailLogoFb}>{selectedOrg.name[0]}</span>}</div>
          <h3 style={S.detailName}>{selectedOrg.name}</h3>
          <div style={S.detailBadges}>
            <span style={{...S.pill,background:"#FAEEDA",color:"#633806",border:"1px solid #BA7517"}}>{selectedOrg.category}</span>
            <span style={{...S.pill,background:"#0E0E0B",color:"#EF9F27",border:"1px solid rgba(186,117,23,0.3)"}}>{REGION_LABELS[selectedOrg.region]}</span>
          </div>
          <p style={S.detailDesc}>{selectedOrg.description}</p>
          <a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" style={S.visitBtn}
            onMouseEnter={e=>Object.assign(e.currentTarget.style,{background:"#0E0E0B",color:"#EF9F27"})}
            onMouseLeave={e=>Object.assign(e.currentTarget.style,{background:"#BA7517",color:"#fff"})}>
            Visit website →
          </a>
        </div>}
      </main>
    </div>
  );
}

function WorldMap({countryRegionMap,activeRegions,selectedRegion,onRegionClick}){
  const [paths,setPaths]=useState([]);
  const [zoom,setZoom]=useState(1);
  const [pan,setPan]=useState({x:0,y:0});
  const [drag,setDrag]=useState(null);
  const [activated,setActivated]=useState(false);
  const svgRef=useRef(null);

  useEffect(()=>{
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r=>r.json()).then(data=>{
        const s=document.createElement("script");
        s.src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
        s.onload=()=>{
          const feat=window.topojson.feature(data,data.objects.countries);
          const proj=merc(960,500);
          setPaths(feat.features.map(f=>{const d=toD(f,proj);const a=N2A[+f.id]||"";return{id:f.id,a2:a,region:countryRegionMap[a]||null,d};}).filter(p=>p.d));
        };
        document.head.appendChild(s);
      }).catch(()=>{});
  },[]);

  useEffect(()=>{
    const el=svgRef.current;if(!el)return;
    const h=(e)=>{if(!activated)return;e.preventDefault();setZoom(z=>Math.min(8,Math.max(1,z*(e.deltaY<0?1.15:0.87))));};
    el.addEventListener("wheel",h,{passive:false});
    return ()=>el.removeEventListener("wheel",h);
  },[activated]);

  useEffect(()=>{
    const h=(e)=>{if(svgRef.current&&!svgRef.current.contains(e.target))setActivated(false);};
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  const getFill=p=>(!p.region||!activeRegions.has(p.region))?"#1a1200":REGION_FILL[p.region];
  const getOp=p=>(selectedRegion&&p.region&&p.region!==selectedRegion)?0.2:1;
  const onDown=e=>{if(e.button!==0)return;setActivated(true);setDrag({ox:e.clientX-pan.x,oy:e.clientY-pan.y});};
  const onMove=e=>{if(drag)setPan({x:e.clientX-drag.ox,y:e.clientY-drag.oy});};
  const onUp=()=>setDrag(null);
  const onLeave=()=>{setDrag(null);setActivated(false);};

  return (
    <svg ref={svgRef} viewBox="0 0 960 500" style={{width:"100%",height:"100%",display:"block",background:"#0E0E0B",cursor:drag?"grabbing":activated?"grab":"default",outline:activated?"2px solid #BA7517":"none",outlineOffset:"-2px"}}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onLeave}>
      <defs>
        <pattern id="dotgrid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="rgba(186,117,23,0.15)"/>
        </pattern>
      </defs>
      <rect width="960" height="500" fill="url(#dotgrid)"/>
      <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
        {paths.map(p=>(
          <path key={p.id} d={p.d}
            fill={getFill(p)} fillOpacity={getOp(p)}
            stroke="#BA7517" strokeWidth={0.6/zoom}
            strokeOpacity={p.region&&activeRegions.has(p.region)?0.65:0.15}
            style={{cursor:p.region?"pointer":"default",transition:"fill-opacity .2s,fill .2s"}}
            onClick={()=>p.region&&onRegionClick(p.region)}>
            <title>{REGION_LABELS[p.region]||p.a2}</title>
          </path>
        ))}
      </g>
    </svg>
  );
}

const merc=(w,h)=>{
  const sc=(w/(2*Math.PI))*0.95;
  return([lon,lat])=>{
    const x=w/2+sc*(lon*Math.PI/180);
    const s=Math.sin(lat*Math.PI/180);
    const y=h/2-sc*Math.log((1+s)/(1-s))/2;
    return[x,y];
  };
};
const toD=(feat,proj)=>{
  try{
    const g=feat.geometry;if(!g)return null;
    const polys=g.type==="Polygon"?[g.coordinates]:g.type==="MultiPolygon"?g.coordinates:[];
    let d="";
    for(const poly of polys)for(const ring of poly){
      let first=true,prevLon=null;
      for(const pt of ring){
        const[lon,lat]=pt;
        const crossed=prevLon!==null&&Math.abs(lon-prevLon)>180;
        const[px,py]=proj([lon,lat]);
        if(!isFinite(px)||!isFinite(py)){prevLon=null;continue;}
        d+=(first||crossed)?`M${px.toFixed(1)},${py.toFixed(1)}`:`L${px.toFixed(1)},${py.toFixed(1)}`;
        first=false;prevLon=lon;
      }d+="Z";
    }return d||null;
  }catch{return null;}
};

const S={
  root:{display:"flex",width:"100%",height:"100vh",minHeight:500,fontFamily:"'Inter',system-ui,sans-serif",fontSize:13,color:"rgba(250,250,247,0.85)",background:"#0E0E0B",overflow:"hidden"},
  sidebar:{width:272,minWidth:210,background:"#1a1200",borderRight:"1px solid rgba(186,117,23,0.2)",display:"flex",flexDirection:"column",overflow:"hidden"},
  sidebarTop:{padding:"14px 14px 0",borderBottom:"1px solid rgba(186,117,23,0.15)"},
  searchBox:{display:"flex",alignItems:"center",gap:8,background:"#0E0E0B",border:"1px solid rgba(186,117,23,0.3)",borderRadius:8,padding:"7px 10px",marginBottom:10,cursor:"text"},
  searchInput:{flex:1,border:"none",background:"transparent",outline:"none",fontFamily:"'Inter',system-ui,sans-serif",fontSize:12,color:"rgba(250,250,247,0.8)"},
  clearX:{background:"none",border:"none",cursor:"pointer",color:"rgba(186,117,23,0.5)",fontSize:10,padding:0,lineHeight:1},
  chipRow:{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10},
  chip:{display:"flex",alignItems:"center",gap:5,border:"1px solid",borderRadius:100,padding:"3px 10px",fontSize:10,fontWeight:600,cursor:"pointer",transition:"all .15s",fontFamily:"'Inter',system-ui,sans-serif",lineHeight:1.4},
  dot:{width:6,height:6,borderRadius:"50%",flexShrink:0,display:"inline-block"},
  activeRow:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8},
  activePill:{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:600,color:"rgba(250,250,247,0.8)"},
  clearRegion:{background:"none",border:"none",cursor:"pointer",color:"rgba(186,117,23,0.5)",fontSize:11,fontFamily:"'Inter',system-ui,sans-serif"},
  count:{fontSize:10,color:"rgba(250,250,247,0.25)",margin:"0 0 10px",lineHeight:1.4},
  list:{flex:1,overflowY:"auto",padding:"6px 0"},
  row:{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",cursor:"pointer",transition:"background .1s",borderLeft:"3px solid transparent"},
  logoBox:{width:34,height:34,borderRadius:8,background:"#2a1c00",border:"1px solid rgba(186,117,23,0.25)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0},
  logoImg:{width:"100%",height:"100%",objectFit:"contain",padding:3},
  logoFb:{fontWeight:700,color:"#EF9F27",fontSize:13},
  orgText:{display:"flex",flexDirection:"column",gap:2,overflow:"hidden",minWidth:0},
  orgName:{fontSize:11.5,fontWeight:600,color:"rgba(250,250,247,0.9)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  orgMeta:{display:"flex",alignItems:"center",gap:4},
  catTag:{fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:9},
  regionTag:{color:"rgba(250,250,247,0.25)",fontSize:10},
  empty:{padding:24,textAlign:"center",color:"rgba(250,250,247,0.25)",fontSize:12},
  mapArea:{flex:1,position:"relative",overflow:"hidden"},
  hint:{position:"absolute",bottom:56,left:"50%",transform:"translateX(-50%)",background:"#1a1200",border:"1px solid #BA7517",color:"rgba(250,250,247,0.8)",padding:"10px 16px",borderRadius:8,fontSize:12,display:"flex",alignItems:"center",gap:12,zIndex:20,whiteSpace:"nowrap",boxShadow:"0 4px 24px rgba(65,36,2,0.4)"},
  hintBtn:{background:"#BA7517",border:"none",color:"#fff",borderRadius:6,padding:"4px 12px",fontSize:11,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",cursor:"pointer"},
  legend:{position:"absolute",bottom:14,left:14,display:"flex",flexWrap:"wrap",gap:4,zIndex:10,background:"rgba(26,18,0,0.92)",border:"1px solid rgba(186,117,23,0.2)",padding:"8px 10px",borderRadius:8},
  legendBtn:{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",fontSize:10,color:"rgba(250,250,247,0.6)",padding:"2px 6px",borderRadius:6,transition:"all .12s",fontFamily:"'Inter',system-ui,sans-serif"},
  badge:{background:"rgba(186,117,23,0.15)",color:"#BA7517",border:"1px solid rgba(186,117,23,0.25)",borderRadius:100,padding:"0 5px",fontSize:9,fontWeight:700},
  detail:{position:"absolute",top:14,right:14,width:252,background:"#1a1200",border:"1px solid #BA7517",borderRadius:12,padding:18,zIndex:20,boxShadow:"0 8px 32px rgba(65,36,2,0.4)"},
  detailX:{position:"absolute",top:12,right:12,background:"#2a1c00",border:"1px solid rgba(186,117,23,0.3)",borderRadius:6,width:24,height:24,cursor:"pointer",fontSize:11,color:"rgba(250,250,247,0.5)",display:"flex",alignItems:"center",justifyContent:"center"},
  detailLogoBox:{width:48,height:48,background:"#2a1c00",border:"1px solid rgba(186,117,23,0.3)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",marginBottom:11},
  detailLogoImg:{width:"100%",height:"100%",objectFit:"contain",padding:4},
  detailLogoFb:{fontSize:18,fontWeight:700,color:"#EF9F27"},
  detailName:{fontFamily:"'Fraunces',Georgia,serif",fontSize:14,fontWeight:800,color:"#FAC775",margin:"0 0 8px",lineHeight:1.3},
  detailBadges:{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"},
  pill:{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:100,textTransform:"uppercase",letterSpacing:"0.06em",fontFamily:"'Inter',system-ui,sans-serif"},
  detailDesc:{fontSize:11,color:"rgba(250,250,247,0.45)",lineHeight:1.6,margin:"0 0 13px"},
  visitBtn:{display:"inline-block",fontFamily:"'Inter',system-ui,sans-serif",fontSize:11,fontWeight:700,background:"#BA7517",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",textDecoration:"none",transition:"all .15s",cursor:"pointer"},
};
