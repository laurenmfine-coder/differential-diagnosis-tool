
window.onerror = function(msg, src, line, col, err) {
  document.getElementById('js-loading').innerHTML = 
    '<div style="text-align:center"><div style="font-size:18px;color:#c0392b;margin-bottom:10px">&#9888; Script Error</div>' +
    '<div style="font-size:12px;color:#566573">' + msg + ' (line ' + line + ')</div></div>';
  return false;
};
// ═══════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════
let feedbackMode = 'visit'; // 'visit' | 'end' | 'immediate'
const caseState = {}; // per-case progress
const completed = {};

function setFeedback(mode) {
  feedbackMode = mode;
  ['visit','end','immediate'].forEach(function(m) {
    document.getElementById('fb-' + m).classList.toggle('active', m === mode);
  });
}

// ═══════════════════════════════════════════
// TEACHING MODULE DATA
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════════════
// TEACHING MODULES — all 20 cases
// Each case gets: pathophys, guidelines, framework, evidence, emr
// ═══════════════════════════════════════════════════

const MODULES = {

// ── FAMILY 1: FATIGUE ────────────────────────────────────────────────────────

A: {
  pathophys: {
    title: 'Iron Deficiency Anemia — Mechanism',
    body: 'Iron is required for hemoglobin synthesis in developing erythrocytes. When iron stores (ferritin) are depleted, erythropoiesis becomes iron-restricted, producing small (microcytic) red cells with reduced hemoglobin content (hypochromic). In premenopausal women, the two most common causes are <strong>chronic blood loss</strong> (menstrual) and <strong>reduced intake/absorption</strong> (dietary insufficiency, malabsorption). The body compensates by increasing transferrin production (raised TIBC) to maximize iron capture from the gut, while ferritin falls as stores are consumed. Symptoms — fatigue, dyspnea, pallor — reflect reduced oxygen-carrying capacity.',
    table: [
      ['Parameter','In IDA','Direction'],
      ['Hemoglobin','Low','↓'],
      ['MCV','<80 fL (microcytic)','↓'],
      ['Ferritin','<12 ng/mL (depleted)','↓↓'],
      ['TIBC / Transferrin','Elevated (upregulated)','↑'],
      ['Serum iron','Low','↓']
    ],
    refs: ['Camaschella C. Iron-deficiency anemia. NEJM. 2015;372:1832–1843.','Lopez A et al. Iron deficiency anaemia. Lancet. 2016;387:907–916.']
  },
  guidelines: {
    title: 'Management Guidelines — Iron Deficiency Anemia',
    body: 'NICE CG39 (2015) and WHO guidelines recommend oral iron as first-line treatment (ferrous sulfate 325mg TDS). The source of iron deficiency must be identified — menstrual blood loss, GI bleeding, or malabsorption. In premenopausal women with heavy menstrual bleeding, gynecologic management (IUD type, hormonal therapy) is a co-equal intervention to iron replacement.',
    table: [
      ['Intervention','Guideline Source','Evidence Grade'],
      ['Oral iron (ferrous sulfate/gluconate)','WHO/NICE','Grade A'],
      ['Identify and treat the source','NICE CG39','Grade A'],
      ['IV iron if oral fails/not tolerated','NICE CG39','Grade B'],
      ['Dietary counseling','WHO','Grade B'],
      ['Follow-up CBC in 4–8 weeks','Expert consensus','Grade C']
    ],
    refs: ['NICE CG39. Iron deficiency anaemia. 2015.','WHO. Haemoglobin concentrations for diagnosis of anaemia. 2011.']
  },
  framework: {
    title: 'Diagnostic Framework — Microcytic Anemia',
    body: 'Microcytic anemia (MCV <80 fL) has four main causes. The discriminating tests are ferritin, TIBC, hemoglobin electrophoresis, and clinical context. In a premenopausal woman with heavy periods and dietary iron restriction, IDA is overwhelmingly likely — but the framework prevents premature closure.',
    table: [
      ['Cause','Ferritin','TIBC','Key Clue'],
      ['Iron deficiency','Low ↓↓','High ↑','Menstrual loss, diet, GI bleed'],
      ['Thalassemia trait','Normal/High','Normal','Target cells, family history, ethnicity'],
      ['Anemia of chronic disease','Normal/High','Low','Chronic infection, cancer, autoimmune'],
      ['Sideroblastic anemia','High','Low','Ring sideroblasts on smear, alcohol, lead']
    ],
    refs: ['Goddard AF et al. Guidelines for management of iron deficiency anaemia. Gut. 2011;60:1309–1316.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Oral iron + treat source (menstrual + dietary)','Grade A — RCT evidence','Complete management; address both iron loss and replacement'],
      ['Genetic testing for hereditary anemia','Grade D — Not indicated','Clinical picture fully explained; testing adds harm without benefit'],
      ['Reassure as stress without workup','Grade D — Harmful omission','Hgb 9.8 + ferritin 6 requires treatment; delay causes harm']
    ]
  },
  emr: {
    title: 'EMR Lens — What Would Have Flagged This Earlier',
    body: 'If these fields were structured and consistently populated in the EMR, an alert or CDS rule could have surfaced iron deficiency risk before the patient became symptomatic.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Menstrual history','Cycle length, flow heaviness, pad/tampon count','Heavy flow (>7 days or >80mL) in reproductive-age female'],
      ['Dietary history (structured)','Red meat frequency, plant-based flag','Plant-based + reproductive age female → IDA screen'],
      ['Last CBC date','Date of most recent blood count','No CBC in >3 years + fatigue complaint → order'],
      ['IUD type','Hormonal vs copper IUD','Copper IUD + fatigue → check ferritin'],
      ['Problem list','Active "fatigue" diagnosis','Fatigue >6 months without workup → CBC/ferritin prompt']
    ],
    refs: ['Osborn DA et al. Clinical decision support for iron deficiency. BMJ Quality & Safety. 2019.']
  }
},

B: {
  pathophys: {
    title: 'Fabry Disease — Mechanism',
    body: 'Fabry disease is an X-linked lysosomal storage disorder caused by mutations in the <em>GLA</em> gene encoding alpha-galactosidase A (α-Gal A). Enzyme deficiency leads to progressive accumulation of globotriaosylceramide (Gb3) in vascular endothelial cells, smooth muscle, cardiomyocytes, renal podocytes, and neurons. In the peripheral nervous system, Gb3 accumulation causes small fiber neuropathy — producing the acroparesthesias (burning pain in hands and feet) that begin in childhood. Renal accumulation causes proteinuria and progressive CKD. Cardiac accumulation causes left ventricular hypertrophy. The disease is multisystemic and progressive, with organ damage accruing silently for decades before presentation.',
    table: [
      ['Organ System','Manifestation','Onset'],
      ['Peripheral nervous system','Acroparesthesias, hypohidrosis','Childhood (ages 5–15)'],
      ['Skin','Angiokeratomas (trunk, genitalia)','Adolescence'],
      ['Eyes','Cornea verticillata (spoke-wheel opacity)','Adolescence'],
      ['Kidneys','Proteinuria, progressive CKD','3rd–4th decade'],
      ['Heart','LVH, arrhythmias, cardiomyopathy','3rd–5th decade'],
      ['CNS','TIA, stroke','4th–5th decade']
    ],
    refs: ['Mehta A et al. Fabry disease defined: baseline clinical manifestations of 366 patients in the Fabry Outcome Survey. Eur J Clin Invest. 2004;34:236–242.','Germain DP. Fabry disease. Orphanet J Rare Dis. 2010;5:30.']
  },
  guidelines: {
    title: 'Diagnosis & Management Guidelines — Fabry Disease',
    body: 'The European Fabry Working Group (2019) recommends alpha-galactosidase A enzyme activity assay as the first-line diagnostic test in males. GLA gene sequencing confirms pathogenic variants and enables family screening. Enzyme Replacement Therapy (ERT — agalsidase alfa or beta) is recommended for all symptomatic males and females with confirmed pathogenic variants. Average diagnostic delay remains 14 years from symptom onset.',
    table: [
      ['Step','Action','Evidence'],
      ['1. Screen','α-Gal A enzyme activity (males); GLA sequencing (females)','Grade A'],
      ['2. Confirm','GLA gene sequencing for pathogenic variant','Grade A'],
      ['3. Stage','Renal, cardiac, neurologic assessment','Grade A'],
      ['4. Treat','ERT (agalsidase alfa/beta)','Grade A — 3 RCTs'],
      ['5. Family cascade','Screen all first-degree relatives','Grade A'],
      ['6. Specialist referral','Metabolic/genetics + nephrology + cardiology','Expert consensus']
    ],
    refs: ['Biegstraaten M et al. Recommendations for initiation and cessation of enzyme replacement therapy in Fabry disease. Orphanet J Rare Dis. 2015;10:36.','Arends M et al. Fabry disease in the era of enzyme replacement therapy: a systematic review. Medicine. 2017;96:e6588.']
  },
  framework: {
    title: 'Diagnostic Framework — Undiagnosed Multisystem Disease in Adults',
    body: 'When a patient has been seen multiple times without a unifying diagnosis, apply the constellation framework: list all findings across organ systems and ask "what single disease explains all of these?" The pattern below is specific to lysosomal storage disorders and should trigger enzyme/genetic workup.',
    table: [
      ['Red Flag Cluster','Implication'],
      ['Neuropathic pain in extremities since childhood + hypohidrosis','Small fiber neuropathy — autonomic dysfunction'],
      ['Unexplained proteinuria/CKD in male <50','Infiltrative or genetic renal disease'],
      ['LVH without hypertension','Storage disorder, HCM, infiltrative disease'],
      ['Corneal opacity + angiokeratomas','Fabry disease specifically'],
      ['Male relative with early cardiovascular death + unexplained CKD in maternal family','X-linked inheritance pattern — Fabry disease']
    ],
    refs: ['Ortiz A et al. Fabry disease revisited: Management and treatment recommendations for adult patients. Mol Genet Metab. 2018;123:416–427.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['ERT + multidisciplinary referral + family cascade','Grade A — multiple RCTs','Stabilizes renal function; slows cardiac and neurologic progression'],
      ['ERT alone, skip family screening','Grade D — incomplete','Family cascade is a medical and ethical imperative; misses treatable disease in relatives'],
      ['Annual monitoring without ERT','Grade D — harmful delay','Progressive organ damage continues without treatment; CKD will reach dialysis']
    ]
  },
  emr: {
    title: 'EMR Lens — What Would Have Flagged Fabry Disease Earlier',
    body: 'Fabry disease has a documented average diagnostic delay of 14 years. The clinical features were present for decades before diagnosis. These EMR fields, if structured, would have enabled a CDS rule to surface the diagnosis much earlier.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Pain history (structured)','Burning/neuropathic pain in hands/feet since childhood','Acroparesthesias since <18 years → Fabry screen'],
      ['Sweating history','Decreased sweating (hypohidrosis) flag','Hypohidrosis + neuropathic pain → α-Gal A enzyme assay'],
      ['Family history (structured)','Cause of death for male relatives, renal disease in family','Early CV death (M <50) + unexplained CKD in family → Fabry screen'],
      ['Ophthalmology notes','Corneal findings — cornea verticillata','Cornea verticillata finding → Fabry disease CDS alert'],
      ['Dermatology notes','Angiokeratoma description','Angiokeratomas on trunk/genitalia → lysosomal storage disorder workup'],
      ['Renal function trend','eGFR trajectory + proteinuria over time','Unexplained proteinuria in male <50 + any above → immediate Fabry screen']
    ],
    refs: ['Mehta A et al. Delays in the diagnosis of Fabry disease. J Inherit Metab Dis. 2009;32:703–708.']
  }
},

D1: {
  pathophys: {
    title: 'Hashimoto\'s Thyroiditis — Mechanism',
    body: 'Hashimoto\'s thyroiditis is an autoimmune condition in which CD4+ T cells and B cells mount an attack against thyroid antigens — primarily thyroid peroxidase (TPO) and thyroglobulin. Anti-TPO antibodies activate complement and recruit cytotoxic T cells, causing progressive follicular destruction and lymphocytic infiltration of the thyroid gland. As functional thyroid tissue is destroyed, T3 and T4 production falls. The pituitary responds with increasing TSH secretion, initially maintaining normal thyroid hormone levels (subclinical hypothyroidism) before eventual overt hypothyroidism develops. Thyroid hormone is essential for basal metabolic rate — its deficiency slows virtually every organ system, explaining the multisystem symptom pattern.',
    table: [
      ['Symptom','Physiologic Mechanism'],
      ['Fatigue','Reduced cellular energy production (lower BMR)'],
      ['Weight gain','Decreased lipolysis and reduced caloric expenditure'],
      ['Cold intolerance','Reduced thermogenesis'],
      ['Constipation','Slowed gut motility'],
      ['Bradycardia','Reduced cardiac chronotropy'],
      ['Hair loss / dry skin','Reduced cellular turnover and sebaceous activity'],
      ['Brain fog','Reduced CNS metabolic activity']
    ],
    refs: ['Ragusa F et al. Hashimotos thyroiditis: Epidemiology, pathogenesis, clinic and therapy. Best Pract Res Clin Endocrinol Metab. 2019;33:101367.']
  },
  guidelines: {
    title: 'Management Guidelines — Hypothyroidism',
    body: 'ATA 2014 guidelines recommend levothyroxine (LT4) monotherapy as first-line treatment for hypothyroidism. Dose is based on body weight (~1.6 mcg/kg/day), with TSH recheck in 4–8 weeks. Target TSH is 0.5–2.5 mIU/L in most patients. Anti-TPO antibody levels do not guide treatment decisions — TSH and free T4 drive management.',
    table: [
      ['Recommendation','Source','Grade'],
      ['LT4 monotherapy as first-line','ATA 2014','Grade A'],
      ['Weight-based initial dosing (~1.6 mcg/kg/day)','ATA 2014','Grade B'],
      ['TSH target 0.5–2.5 mIU/L (most patients)','ATA 2014','Grade B'],
      ['Recheck TSH 4–8 weeks after initiation/dose change','ATA 2014','Grade A'],
      ['Periodic TSH screening in first-degree relatives','Expert consensus','Grade C'],
      ['No role for genetic testing in Hashimoto\'s','ATA 2014','Grade A']
    ],
    refs: ['Jonklaas J et al. Guidelines for the treatment of hypothyroidism. Thyroid. 2014;24:1670–1751.']
  },
  framework: {
    title: 'Diagnostic Framework — Chronic Fatigue in Women of Reproductive Age',
    body: 'A systematic approach to chronic fatigue prevents anchoring on the most common cause. TSH should be checked in virtually all women presenting with chronic fatigue — it is cheap, sensitive, and catches the most commonly missed endocrine diagnosis.',
    table: [
      ['Category','Diagnoses to Consider','Key Test'],
      ['Hematologic','Iron deficiency anemia, B12/folate deficiency','CBC, ferritin, B12'],
      ['Endocrine','Hypothyroidism, diabetes, adrenal insufficiency','TSH, fasting glucose, cortisol'],
      ['Autoimmune','SLE, celiac, RA','ANA, tTG-IgA, RF'],
      ['Infectious','Chronic EBV, HIV, hepatitis','Monospot, HIV, LFTs'],
      ['Sleep','OSA, insomnia','Epworth, sleep history'],
      ['Mental health','Depression, anxiety (diagnosis of exclusion)','PHQ-9 after organic causes excluded'],
      ['Genetic/metabolic','Fabry (if multisystem), others','Targeted by history']
    ],
    refs: ['Rosenthal TC et al. Fatigue: An overview. Am Fam Physician. 2008;78:1173–1179.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['LT4 at weight-appropriate dose + TSH recheck 4–8 weeks','Grade A','Standard of care; symptoms resolve in weeks'],
      ['Genetics referral for Hashimoto\'s','Grade D — Not indicated','Polygenic predisposition; no actionable genetic test'],
      ['Endocrinology referral for TSH 14','Grade C — Not routinely needed','Endocrinology for complex cases; primary care manages uncomplicated Hashimoto\'s']
    ]
  },
  emr: {
    title: 'EMR Lens — What Would Have Flagged Hypothyroidism Earlier',
    body: 'Hashimoto\'s hypothyroidism is often attributed to stress for 1–3 years before diagnosis. Structured EMR fields and CDS rules can dramatically shorten this delay.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Family history (structured)','Thyroid disease type in relatives','First-degree relative with thyroid disease → TSH q2–3 years'],
      ['Vital signs trend','Heart rate <60 in repeated visits','Persistent bradycardia + fatigue complaint → TSH'],
      ['Weight trend','Weight gain >5% without dietary change over 12 months','Weight gain + fatigue → TSH + metabolic screen'],
      ['Symptom checklist','Cold intolerance, constipation, hair loss flags','2+ symptoms from hypothyroid cluster → TSH'],
      ['Last TSH date','Date of most recent thyroid function test','No TSH in >3 years + female + fatigue → prompt'],
      ['Menstrual irregularity','Cycle change noted','New menstrual irregularity + fatigue in female → TSH + prolactin']
    ],
    refs: ['Canaris GJ et al. The Colorado thyroid disease prevalence study. Arch Intern Med. 2000;160:526–534.']
  }
},

E1: {
  pathophys: {
    title: 'Obstructive Sleep Apnea — Mechanism',
    body: 'During sleep, pharyngeal muscle tone decreases. In OSA, the upper airway collapses repeatedly during sleep — each collapse (apnea) causes progressive hypoxia until the brain generates an arousal to restore airway tone. These arousals are brief and rarely remembered but fragment sleep architecture, preventing normal cycling through slow-wave and REM sleep stages. The result: adequate sleep <em>duration</em> but severely impaired sleep <em>quality</em>, producing unrefreshing sleep and profound daytime sleepiness. Simultaneously, each apneic episode triggers sympathetic nervous system activation, catecholamine release, and cortisol rise — driving sustained hypertension even when awake. Repeated nocturnal hypoxia also causes endothelial dysfunction, systemic inflammation, and increased cardiovascular risk.',
    table: [
      ['Feature','Mechanism'],
      ['Unrefreshing sleep','Fragmented sleep architecture — no sustained slow-wave/REM'],
      ['Loud snoring','Partial airway obstruction with turbulent airflow'],
      ['Witnessed apneas','Complete pharyngeal collapse during sleep'],
      ['Morning headaches','Nocturnal hypercapnia and cerebral vasodilation'],
      ['Refractory hypertension','Sustained sympathetic activation from repeated arousals'],
      ['Excessive daytime sleepiness','Sleep deprivation despite adequate time in bed']
    ],
    refs: ['Peppard PE et al. Increased prevalence of sleep-disordered breathing in adults. Am J Epidemiol. 2013;177:1006–1014.']
  },
  guidelines: {
    title: 'Management Guidelines — Obstructive Sleep Apnea',
    body: 'AASM 2009 guidelines recommend CPAP as first-line treatment for moderate-severe OSA (AHI ≥15). Home sleep testing is appropriate for uncomplicated suspected OSA. Driving safety must be addressed directly — patients with ESS >10 or AHI ≥15 should be counseled regarding impaired driving performance.',
    table: [
      ['Recommendation','Source','Grade'],
      ['CPAP for moderate-severe OSA (AHI ≥15)','AASM 2009','Grade A'],
      ['Oral appliance for mild-moderate OSA or CPAP intolerance','AASM 2015','Grade B'],
      ['Weight loss as adjunct (not replacement) for OSA','AASM 2009','Grade B'],
      ['Address driving safety with all OSA patients','AASM/AAP','Grade A — legal requirement in many jurisdictions'],
      ['Cardiovascular monitoring in OSA + hypertension','AHA/ACC','Grade B'],
      ['Repeat sleep study after significant weight loss','AASM','Grade C']
    ],
    refs: ['Epstein LJ et al. Clinical guideline for the evaluation, management and long-term care of obstructive sleep apnea in adults. J Clin Sleep Med. 2009;5:263–276.']
  },
  framework: {
    title: 'Diagnostic Framework — Epworth Sleepiness Scale + STOP-BANG',
    body: 'Two validated tools efficiently screen for OSA in primary care. The Epworth measures subjective daytime sleepiness. STOP-BANG identifies high-risk patients based on clinical features. Combined use has high sensitivity for OSA requiring treatment.',
    table: [
      ['STOP-BANG Item','Score 1 if...'],
      ['S — Snoring','Loud snoring reported'],
      ['T — Tired','Fatigue/sleepiness during day'],
      ['O — Observed','Apneas witnessed during sleep'],
      ['P — Pressure','Treated or untreated hypertension'],
      ['B — BMI','BMI >35'],
      ['A — Age','>50 years'],
      ['N — Neck','Neck circumference >40cm'],
      ['G — Gender','Male sex'],
      ['','Score ≥3 = High risk for OSA — order sleep study']
    ],
    refs: ['Chung F et al. STOP-BANG questionnaire: A practical approach to screen for obstructive sleep apnea. Chest. 2016;149:631–638.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['CPAP + driving counseling + CV monitoring','Grade A','CPAP reduces ESS, BP, and cardiovascular events; driving counseling is legally required'],
      ['Weight loss first, defer CPAP 3 months','Grade D — Harmful delay','Severe OSA (AHI 34) poses immediate driving and cardiovascular risk; CPAP cannot wait'],
      ['Refer sleep medicine only — disengage primary care','Grade C — Incomplete','Primary care owns BP monitoring, driving counseling, and CPAP compliance follow-up']
    ]
  },
  emr: {
    title: 'EMR Lens — What Would Have Flagged OSA Earlier',
    body: 'OSA is often present for years before diagnosis. Structured EMR fields combined with a STOP-BANG-based CDS rule can identify high-risk patients at routine visits.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Snoring (structured)','Partner-reported loud snoring flag','Loud snoring + male + BMI >30 → STOP-BANG score + sleep study'],
      ['Vital signs','BP readings — refractory hypertension flag','Hypertension on 2+ medications + fatigue → OSA screen'],
      ['BMI trend','BMI >30 flag','BMI >30 + fatigue + male >40 → Epworth + STOP-BANG'],
      ['Neck circumference','Documented at physical exam','Neck >17 inches + snoring → high-risk OSA prompt'],
      ['Fatigue complaint','Structured symptom — unrefreshing sleep distinguished from insomnia','Unrefreshing sleep + snoring → sleep study, not just sleep hygiene counseling'],
      ['Driving history','Commercial driver or frequent long-distance driver flag','OSA risk + driver → mandatory driving safety counseling flag']
    ],
    refs: ['Kapur VK et al. Clinical practice guideline for diagnostic testing for adult obstructive sleep apnea. J Clin Sleep Med. 2017;13:479–504.']
  }
},

Raymond: {
  pathophys: {
    title: 'Colorectal Adenocarcinoma Presenting as Iron Deficiency — Mechanism',
    body: 'Colorectal adenocarcinomas arise from malignant transformation of colonic epithelium — most commonly from adenomatous polyps over 10–15 years (the adenoma-carcinoma sequence). As tumors grow, they develop a friable, vascular surface that bleeds intermittently into the bowel lumen. This occult GI blood loss is often insufficient to cause visible hematochezia but is sufficient over months to deplete iron stores, producing iron deficiency anemia. In men and post-menopausal women, there is no physiologic explanation for iron deficiency — GI blood loss must be assumed until excluded. The iron deficiency is not incidental; it is the presenting manifestation of the underlying malignancy.',
    table: [
      ['Feature','Significance'],
      ['Iron deficiency in men or post-menopausal women','GI source must be identified — no physiologic explanation'],
      ['Dark/tarry stools (melena)','Upper GI or right-sided colonic bleeding'],
      ['Change in bowel habits','Mass effect or altered motility from tumor'],
      ['Unintentional weight loss >5%','Paraneoplastic or nutritional effect — red flag'],
      ['Positive FOBT/FIT','Occult blood — mandates colonoscopy'],
      ['Overdue colonoscopy surveillance','Prevention failure — adenoma likely preceded the cancer']
    ],
    refs: ['Goddard AF et al. Guidelines for the management of iron deficiency anaemia. Gut. 2011;60:1309–1316.','Levin B et al. Screening and surveillance for the early detection of colorectal cancer. CA Cancer J Clin. 2008;58:130–160.']
  },
  guidelines: {
    title: 'Clinical Guidelines — Colorectal Cancer Screening and IDA Workup',
    body: 'USPSTF 2021 recommends screening colonoscopy beginning at age 45 for average-risk adults, repeated every 10 years. Iron deficiency in men or post-menopausal women requires GI evaluation (colonoscopy and upper endoscopy) regardless of other explanations. Do not treat IDA without identifying the source.',
    table: [
      ['Recommendation','Source','Grade'],
      ['Colonoscopy screening age 45–75, average risk','USPSTF 2021','Grade A'],
      ['Colonoscopy for IDA in men / post-menopausal women','BSG/ACG','Grade A'],
      ['Do not treat IDA without identifying source','NICE CG39','Grade A'],
      ['MSI/MMR testing on all CRC specimens','NCCN','Grade A'],
      ['First-degree relatives: colonoscopy at 40 or 10 years before diagnosis age','USPSTF/ACG','Grade A'],
      ['Lynch syndrome evaluation if MMR deficient','NCCN','Grade A']
    ],
    refs: ['US Preventive Services Task Force. Colorectal Cancer Screening. JAMA. 2021;325:1965–1977.','Goddard AF et al. Gut. 2011;60:1309–1316.']
  },
  framework: {
    title: 'Diagnostic Framework — Iron Deficiency by Demographics',
    body: 'The cause of iron deficiency is NOT the same across all patients. Demographics drive the workup. Using Sofia\'s (menstrual/dietary) logic in Raymond\'s case is a fatal reasoning error.',
    table: [
      ['Patient Type','Most Likely Cause','Required Workup'],
      ['Premenopausal female','Menstrual blood loss + dietary','Heavy period history; dietary review; GI if no response to iron or red flags'],
      ['Male (any age)','GI blood loss','Colonoscopy + upper endoscopy; FOBT'],
      ['Post-menopausal female','GI blood loss','Colonoscopy + upper endoscopy; FOBT'],
      ['Infant/toddler','Dietary (cow milk excess)','Dietary history; reduce cow milk'],
      ['Elderly (any)','GI blood loss; malabsorption; dietary','Colonoscopy; celiac screen; dietary review']
    ],
    refs: ['Pasricha SR et al. Iron deficiency. Lancet. 2021;397:233–248.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Colonoscopy at overdue surveillance visit (age 65–68)','Grade A','Prevention — catches adenoma before cancer; missed opportunity'],
      ['Colonoscopy immediately for IDA in 68M','Grade A','Mandatory — no physiologic explanation for IDA in men; cancer until excluded'],
      ['Normal newborn screen = sufficient reassurance','Grade D — Wrong context','This applies to infants, not adults; not relevant to iron deficiency workup in elderly men']
    ]
  },
  emr: {
    title: 'EMR Lens — What Would Have Flagged This Earlier',
    body: 'Two separate EMR failures contributed to Raymond\'s delayed diagnosis: overdue surveillance colonoscopy and iron deficiency treated without source identification.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Last colonoscopy date','Date + result (polyps? clean?)','Colonoscopy >10 years ago in patient age 45–75 → overdue screening alert'],
      ['Stool changes (structured)','Change in consistency, dark/black stools, rectal bleeding','Dark stools + fatigue → FOBT + colonoscopy referral'],
      ['Weight trend','Unintentional weight loss %','Unintentional weight loss >5% + any GI symptom → urgent investigation'],
      ['IDA in male flag','Ferritin <12 in male patient','Low ferritin in male → automatic GI referral prompt (no treatment without source ID)'],
      ['Preventive care tracker','Colonoscopy screening status','Overdue colonoscopy flag + age 45–75 → reminder at every visit'],
      ['Family history (structured)','Colorectal cancer in relatives, age at diagnosis','First-degree relative with CRC → earlier screening schedule']
    ],
    refs: ['Rex DK et al. Colorectal Cancer Screening: Recommendations for Physicians and Patients. Am J Gastroenterol. 2017;112:1016–1030.']
  }
},

// ── FAMILY 2: INFECTIONS ─────────────────────────────────────────────────────

C: {
  pathophys: {
    title: 'X-linked Agammaglobulinemia (XLA) — Mechanism',
    body: 'XLA is caused by mutations in the <em>BTK</em> gene (Bruton\'s tyrosine kinase), which encodes a cytoplasmic enzyme essential for B cell receptor signaling and B cell maturation. Without functional BTK, B cell development arrests at the pro-B cell stage in the bone marrow — no mature B cells are produced, and therefore no immunoglobulins (antibodies) of any class are synthesized. Maternal IgG crosses the placenta and protects infants for the first 6–18 months. As maternal antibody titers wane, the XLA infant loses protection against encapsulated bacteria — <em>Streptococcus pneumoniae</em>, <em>Haemophilus influenzae</em>, <em>Pseudomonas</em> — which rely on opsonization by antibodies for clearance. The result: recurrent serious bacterial infections beginning at approximately 18 months of age.',
    table: [
      ['Feature','Explanation'],
      ['Male sex only','BTK is X-linked — hemizygous males are fully affected'],
      ['Onset at 18 months','Maternal IgG wanes; infant cannot synthesize replacement'],
      ['Bacterial-only infections','Viruses cleared by T cells (intact); bacteria require antibody (absent)'],
      ['Absent B cells on flow','No BTK → B cell maturation arrest'],
      ['Absent tonsils/adenoids','Lymphoid structures require B cells to develop'],
      ['Normal T cells and NK cells','Only B cell lineage affected by BTK mutation']
    ],
    refs: ['Conley ME et al. Primary B-cell immunodeficiencies: comparisons and contrasts. Annu Rev Immunol. 2009;27:199–227.']
  },
  guidelines: {
    title: 'Management Guidelines — Primary Antibody Deficiencies',
    body: 'ESID/IPOPI consensus guidelines (2019) recommend IVIG or SCIG replacement as definitive treatment for XLA. Target trough IgG levels >500–800 mg/dL (higher for active infections). BTK gene testing is the gold standard for diagnosis and family screening. Prophylactic antibiotics may be considered for high-risk patients.',
    table: [
      ['Recommendation','Source','Grade'],
      ['IVIG or SCIG as lifelong replacement','ESID 2019','Grade A'],
      ['Target IgG trough >500 mg/dL','ESID 2019','Grade A'],
      ['BTK gene sequencing for confirmation and family cascade','ESID 2019','Grade A'],
      ['Avoid live vaccines in XLA patients','ESID/CDC','Grade A — safety'],
      ['Carrier testing for maternal relatives','ESID 2019','Grade A']
    ],
    refs: ['Seidel MG et al. Revised definitions and diagnostic criteria for primary immunodeficiencies. J Allergy Clin Immunol. 2019.']
  },
  framework: {
    title: 'Diagnostic Framework — Recurrent Pediatric Infections',
    body: 'Not all recurrent infections in children are created equal. This framework identifies the features that distinguish pathologic immune failure from normal childhood illness. The most important single question: "What type of organisms are causing the infections?"',
    table: [
      ['Feature','Concerning (investigate)','Reassuring (monitor)'],
      ['Infection type','Serious bacterial (pneumonia, sepsis, meningitis)','Viral URIs, otitis media'],
      ['Organisms','Encapsulated bacteria (pneumococcus, H. flu)','Rhinovirus, RSV, common pathogens'],
      ['Onset timing','At 18 months (maternal IgG wanes)','Daycare entry (age 1–3)'],
      ['Severity','Hospitalizations, IV antibiotics required','Manageable outpatient'],
      ['Growth','Falling growth percentile','Tracking normal curve'],
      ['Family history','Male relatives with early death/infections','None'],
      ['Between episodes','Chronically unwell','Completely well']
    ],
    refs: ['Ameratunga R et al. Identifying patients with primary immunodeficiency in primary care. J Prim Health Care. 2020.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Immune evaluation after 2nd serious bacterial infection','Grade B — Guideline supported','Two encapsulated bacterial pneumonias in young male + family history = actionable before third infection'],
      ['"Rule of three" — wait for 3 infections','Grade C — Minimum threshold only','Three is a floor, not a target; severity and type override count'],
      ['Daycare explains recurrent infections','Grade D — Incorrect diagnosis','Daycare explains viral URIs; it does not explain recurrent serious bacterial pneumonias']
    ]
  },
  emr: {
    title: 'EMR Lens — What Would Have Flagged XLA Earlier',
    body: 'XLA\'s clinical features are present from the first serious infection. Structured documentation of infection type and family history would have triggered evaluation after the second episode.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Infection organism (structured)','Documented pathogen from culture/PCR','Encapsulated bacteria (pneumococcus/H. flu) x2 in child <5 → immune evaluation'],
      ['Infection severity','Outpatient vs inpatient flag','Hospitalization for infection in child <5 x2 → immune workup flag'],
      ['Infection onset timing','Age at first serious infection','First serious bacterial infection at 15–18 months → flag for immune evaluation at next'],
      ['Family history (structured)','Male relatives — cause of death, serious infections in childhood','Male relative died of infection in childhood → XLA screening in current patient'],
      ['Tonsil/adenoid documentation','Size noted at physical exam','Absent/very small tonsils in child with recurrent infections → immunology referral'],
      ['Growth curve trend','Weight/height percentile trajectory','Falling growth percentile + recurrent serious infections → urgent immune evaluation']
    ],
    refs: ['Bonilla FA et al. Practice parameter for the diagnosis and management of primary immunodeficiency. J Allergy Clin Immunol. 2015;136:1186–1205.']
  }
},

D: {
  pathophys: {
    title: 'Normal Pediatric Immune Development — Why Children in Daycare Get Sick',
    body: 'Children are born with innate immunity and maternal IgG but with naïve adaptive immune systems. With each pathogen encountered, naive T and B lymphocytes differentiate into memory cells — the adaptive immune system is educated by exposure. Daycare accelerates this education by increasing exposure density. The average child in group childcare has 6–8 viral respiratory infections per year — rhinovirus, RSV, influenza, parainfluenza — which is physiologically normal. This is NOT the same as the pattern in immune deficiency, where serious bacterial infections occur because antibody production has failed. The key discriminating question is always organism type and infection severity — not frequency alone.',
    table: [
      ['Normal childhood infections','Immune deficiency infections'],
      ['Viral URIs — rhinovirus, RSV, influenza','Serious bacterial — pneumococcus, H. flu, Pseudomonas'],
      ['Outpatient management','Hospitalizations, IV antibiotics'],
      ['Otitis media (common)','Recurrent pneumonia, meningitis, sepsis'],
      ['Well between episodes','Chronically unwell, failing to thrive'],
      ['Normal growth','Declining growth percentile'],
      ['Normal tonsils and lymph nodes','Absent tonsils, no lymph nodes (XLA)']
    ],
    refs: ['Denny T. Upper respiratory infections in children. Pediatr Infect Dis J. 1994.']
  },
  guidelines: {
    title: 'Clinical Guidelines — When NOT to Order Immune Evaluation',
    body: 'The Jeffrey Modell Foundation criteria and ESID guidelines identify features warranting immune workup. Critically, they define what does NOT require workup — a list that most primary care physicians are less familiar with.',
    table: [
      ['Feature','Warrants immune workup','Does NOT warrant immediate workup'],
      ['Infection count alone','>2 serious infections per year','6–8 viral URIs per year in daycare child'],
      ['Infection type','Serious bacterial / unusual organisms','Viral URIs, otitis media, typical pathogens'],
      ['Growth','>2 SD fall from baseline','Normal growth trajectory'],
      ['Response to treatment','Incomplete response to antibiotics','Normal antibiotic response'],
      ['Between episodes','Persistently unwell','Completely well between episodes']
    ],
    refs: ['Jeffrey Modell Foundation. 10 Warning Signs of Primary Immunodeficiency. 2020.']
  },
  framework: {
    title: 'Diagnostic Framework — Anchoring and Pattern Matching',
    body: 'After diagnosing XLA in a previous patient, the brain pattern-matches the next similar presentation. This cognitive bias (anchoring + availability heuristic) is one of the most common sources of diagnostic error. Noah\'s case is explicitly designed to test resistance to this bias.',
    table: [
      ['Feature','Liam (XLA)','Noah (Normal)'],
      ['Infections','Bacterial pneumonias x3','Viral URIs x2 + otitis media x1'],
      ['Organisms','Encapsulated bacteria','Common viral/bacterial pathogens'],
      ['Onset timing','18 months (maternal IgG wane)','Daycare entry (age 2)'],
      ['Growth','[Not specified as falling]','55th percentile, tracking normally'],
      ['Family history','Uncle died of chest infection age 8','None'],
      ['Tonsils','[Likely absent in XLA]','Normal tonsils present'],
      ['Conclusion','Immune evaluation urgent','Reassure — normal immune development']
    ],
    refs: ['Croskerry P. The importance of cognitive errors in diagnosis. Acad Med. 2003;78:775–780.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Reassure + anticipatory guidance + safety net','Grade B','Appropriate for viral URIs + otitis media + normal growth + normal exam'],
      ['Basic immune panel to reassure parents','Grade C — Low yield','Pre-test probability very low; risk of false positives, VUS, and downstream anxiety'],
      ['Full immune workup + BTK sequencing','Grade D — Inappropriate','Anchoring from prior case; clinical features do not support immune evaluation']
    ]
  },
  emr: {
    title: 'EMR Lens — Documentation That Prevents Over-Investigation',
    body: 'For Noah, the EMR documentation serves a different purpose: capturing the reasoning for NOT ordering tests, and establishing a clear safety net for future visits.',
    table: [
      ['EMR Field','What to Document','Purpose'],
      ['Infection type (structured)','Viral vs bacterial; organism if known','Enables pattern recognition if infections escalate'],
      ['Growth curve','Percentile at every visit','Unchanged trajectory = reassurance; declining = escalate'],
      ['Clinical reasoning note','"Infections consistent with normal daycare exposure; immune evaluation not indicated based on viral type, normal growth, normal exam"','Documents reasoning; prevents redundant workup at next visit'],
      ['Safety net criteria (structured)','Documented return precautions','"Return if: hospitalization, serious bacterial infection, growth decline, or 2+ bacterial pneumonias"'],
      ['Sibling health','Sibling infection history at same facility','Same-rate illness in sibling = environmental explanation documented']
    ],
    refs: ['Singh H et al. The frequency of diagnostic errors in outpatient care. BMJ Qual Saf. 2014;23:727–731.']
  }
},

C2: {
  pathophys: {
    title: 'Common Variable Immune Deficiency (CVID) — Mechanism',
    body: 'CVID is characterized by markedly reduced serum immunoglobulins (IgG, IgA, IgM) and impaired specific antibody responses, arising from B cell differentiation defects. Unlike XLA, B cells are present but fail to differentiate into plasma cells or class-switch to IgG. The genetic basis is polygenic in most cases — mutations in TNFRSF13B (TACI), TNFRSF13C (BAFF-R), LRBA, CTLA4, and others have been identified, but most patients have no single-gene explanation. IgA deficiency leads to loss of mucosal protection (sinopulmonary and GI infections). Absent specific antibody responses leave patients vulnerable to encapsulated bacteria AND to viral and parasitic infections. CVID typically presents in the 2nd–4th decades — later than XLA — because partial residual B cell function delays progression.',
    table: [
      ['Feature','CVID','XLA'],
      ['Sex','Both equally','Males only (X-linked)'],
      ['Onset','Adolescence–adulthood','~18 months'],
      ['B cells on flow','Present but dysfunctional','Absent (0%)'],
      ['IgG level','Low (<500)','Very low (<100)'],
      ['Genetic basis','Polygenic (usually)','BTK gene (single gene)'],
      ['Infection types','Bacterial + viral + parasitic','Bacterial only']
    ],
    refs: ['Ameratunga R et al. Diagnostic criteria for common variable immunodeficiency disorder. Front Immunol. 2020.']
  },
  guidelines: {
    title: 'Management Guidelines — CVID',
    body: 'ESID guidelines recommend IVIG or SCIG as the mainstay of treatment for CVID. Monthly IVIG or weekly/biweekly SCIG maintains protective IgG trough levels. Surveillance for CVID complications (granulomatous disease, lymphoma, autoimmune disease, bronchiectasis) is required throughout life.',
    table: [
      ['Recommendation','Source','Grade'],
      ['IVIG or SCIG replacement therapy','ESID 2019','Grade A'],
      ['Target IgG trough >500–800 mg/dL','ESID 2019','Grade A'],
      ['Annual pulmonary function + CT for bronchiectasis','ESID','Grade B'],
      ['Annual blood count for lymphoma surveillance','ESID','Grade B'],
      ['Genetic testing: polygenic panel','ESID','Grade B — guides counseling, not management'],
      ['Family screening: periodic IgG levels + vaccine titers','Expert consensus','Grade C']
    ],
    refs: ['Bonilla FA et al. J Allergy Clin Immunol. 2015;136:1186–1205.']
  },
  framework: {
    title: 'Diagnostic Framework — Absent Post-Vaccine Titers as an Early Test',
    body: 'Checking antibody titers to vaccines the patient has already received is the most underutilized and most informative test in suspected humoral immune deficiency. A child who cannot mount an IgG response to a pneumococcal vaccine they received months ago has a fundamentally broken humoral immune system.',
    table: [
      ['Test','Normal result','CVID/XLA result'],
      ['IgG to tetanus after vaccination','Protective (>0.1 IU/mL)','Absent or below protective threshold'],
      ['IgG to pneumococcus after PCV','Protective titer present','Absent or minimal response'],
      ['IgG to diphtheria after DTaP','Protective titer present','Absent or minimal response'],
      ['Interpretation','Normal humoral immunity','Impaired specific antibody production → CVID/XLA']
    ],
    refs: ['Orange JS et al. Use and interpretation of diagnostic vaccination in primary immunodeficiency. Ann Allergy Asthma Immunol. 2012;109:82–90.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Immune evaluation at 2nd serious infection + declining growth','Grade B','Growth trajectory + infection pattern = actionable before 3rd episode'],
      ['Wait for 3rd infection (sinusitis at age 7)','Grade C — Delayed','Reasonable minimum; growth trajectory made action appropriate earlier'],
      ['Start workup only after Giardia at age 8','Grade D — Harmful delay','3 years of progressive immune failure and declining growth before action']
    ]
  },
  emr: {
    title: 'EMR Lens — Catching CVID Earlier',
    body: 'CVID\'s average diagnostic delay is 7 years. These structured fields enable earlier pattern recognition.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Vaccine titer results','Post-vaccination IgG titers (tetanus, pneumococcus)','Absent/low post-vaccine titer in child with recurrent infections → immune evaluation'],
      ['Infection organism (structured)','Pathogen type per episode','Mixed bacterial + viral/parasitic infections → CVID on differential'],
      ['Growth percentile trend','Percentile at every visit','Falling from 60th → 40th over 4 years + recurrent infections → flag'],
      ['Giardia history','Documented Giardia infection','Giardia + recurrent sinopulmonary infections → IgA deficiency/CVID screen'],
      ['Immunoglobulin levels','IgG/IgA/IgM if ordered','IgG <500 in child → immunology referral'],
      ['Female sex + recurrent serious infections','Flag for non-X-linked immune deficiency workup','Female + recurrent serious infections + late onset → CVID differential']
    ],
    refs: ['Rezaei N et al. Primary immunodeficiency diseases. J Clin Immunol. 2006;26:424–430.']
  }
},

D2: {
  pathophys: {
    title: 'Selective IgA Deficiency — Mechanism',
    body: 'Selective IgA deficiency (SIgAD) is the most common primary immune deficiency, affecting 1 in 300–500 people. It results from a failure of B cells to terminally differentiate into IgA-secreting plasma cells — total serum IgG and IgM are normal. The key role of IgA is <strong>mucosal immunity</strong>: secretory IgA (sIgA) coats mucosal surfaces of the respiratory and GI tracts, neutralizing pathogens and preventing adherence. In its absence, the mucosal barrier is breached more easily, leading to recurrent sinopulmonary infections and GI infections — particularly with <em>Giardia</em>, which is cleared by sIgA. Most patients are asymptomatic; symptomatic disease is usually mild. A critical clinical implication: commercial IVIG preparations contain negligible IgA, making IVIG both ineffective and potentially dangerous (anti-IgA antibody-mediated anaphylaxis).',
    table: [
      ['Parameter','SIgAD','Normal'],
      ['Total IgA','<7 mg/dL','70–400 mg/dL'],
      ['IgG','Normal','Normal'],
      ['IgM','Normal','Normal'],
      ['B cells','Present, functional (IgG)','Present'],
      ['Vaccine responses (IgG)','Normal','Normal'],
      ['Mucosal protection','Impaired','Intact']
    ],
    refs: ['Yazdani R et al. Selective IgA deficiency: Epidemiology, pathogenesis, clinical phenotype, diagnosis, prognosis and management. Expert Rev Clin Immunol. 2017;13:481–491.']
  },
  guidelines: {
    title: 'Management Guidelines — Selective IgA Deficiency',
    body: 'There is no specific treatment to restore IgA production. Management focuses on surveillance, vaccination, and celiac disease screening. IVIG is explicitly contraindicated in symptomatic SIgAD patients who have developed anti-IgA antibodies — anaphylaxis risk.',
    table: [
      ['Recommendation','Source','Grade'],
      ['No IVIG — contraindicated if anti-IgA antibodies present','ESID/Expert consensus','Grade A — safety'],
      ['Vaccinate against encapsulated organisms (PCV, MCV)','ESID','Grade B'],
      ['Screen for celiac disease using IgG-based tests (not tTG-IgA)','ACG/ESID','Grade A'],
      ['Monitor for development of CVID (IgG decline)','ESID','Grade B'],
      ['Prophylactic antibiotics for symptomatic patients','Expert consensus','Grade C'],
      ['Annual IgG level to detect progression to CVID','ESID','Grade B']
    ],
    refs: ['Yel L. Selective IgA deficiency. J Clin Immunol. 2010;30:10–16.']
  },
  framework: {
    title: 'Diagnostic Framework — The Celiac Screening Trap',
    body: 'IgA deficiency is 10–15 times more common in celiac disease than in the general population. The standard tTG-IgA celiac screen is falsely negative in IgA deficiency — the antibody being measured cannot be produced. This is one of the most consequential false-negative laboratory traps in general medicine.',
    table: [
      ['Scenario','Standard tTG-IgA','Correct approach'],
      ['Patient with normal IgA','Reliable — use routinely','tTG-IgA is sufficient'],
      ['Patient with low/absent IgA','Falsely negative — unreliable','Check total IgA first; use IgG-based testing (tTG-IgG, DGP-IgG) if IgA deficient'],
      ['Unknown IgA status','May be falsely negative','Always check total IgA before interpreting a negative celiac screen']
    ],
    refs: ['Leonard MM et al. American College of Gastroenterology guidelines for celiac disease. Am J Gastroenterol. 2023;118:59–76.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['No IVIG + vaccination + IgG celiac screen + annual monitoring','Grade A','Correct and safe; IVIG contraindicated'],
      ['Start IVIG for primary immune deficiency','Grade D — Harmful','IVIG contains no IgA and can cause anaphylaxis in anti-IgA antibody-positive patients'],
      ['Refer to immunology, defer all management','Grade C — Incomplete','Primary care can manage SIgAD; celiac screen and vaccines should not wait']
    ]
  },
  emr: {
    title: 'EMR Lens — Catching the Celiac Trap and IgA Deficiency',
    body: 'IgA deficiency is often an incidental finding. Its clinical implications (celiac screen interpretation, IVIG contraindication) must be flagged and persisted in the chart.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Total IgA result (structured)','IgA level with reference range flag','IgA <7 → alert: "Celiac tTG-IgA unreliable — use IgG-based testing"'],
      ['Celiac screening method','tTG-IgA vs tTG-IgG documented','tTG-IgA ordered in patient with low IgA → CDS alert: wrong test'],
      ['IVIG contraindication flag','Persistent allergy/contraindication note','IgA deficiency on problem list → contraindication alert if IVIG ordered'],
      ['Blood transfusion alert','Anti-IgA antibody status if tested','If anti-IgA antibodies present → IgA-depleted blood products required'],
      ['Mucosal infection pattern','Recurrent sinusitis + GI infections flag','Sinusitis + GI infections + low IgA → SIgAD diagnosis confirmation']
    ],
    refs: ['Oxentenko A, Murray JA. Celiac disease: Ten things that every gastroenterologist should know. Clin Gastroenterol Hepatol. 2015;13:1396–1404.']
  }
},

E2: {
  pathophys: {
    title: 'Cystic Fibrosis — Mechanism',
    body: 'CF is caused by mutations in <em>CFTR</em>, which encodes a chloride ion channel in epithelial cell membranes. The most common mutation, F508del, causes misfolding and premature degradation of the CFTR protein. Without functional CFTR, chloride (and secondarily sodium and water) cannot be secreted into the airway lumen. The result: dehydrated, thick, viscous mucus that cannot be cleared by ciliary action. In the lungs, mucus stasis creates an ideal environment for chronic bacterial colonization — <em>Pseudomonas aeruginosa</em>, <em>Staphylococcus aureus</em> — causing progressive bronchiectasis and lung function decline. In the pancreas, viscous secretions block pancreatic ducts → exocrine pancreatic insufficiency → malabsorption of fat and fat-soluble vitamins → steatorrhea and failure to thrive.',
    table: [
      ['Organ','Mechanism','Clinical Effect'],
      ['Lungs','Thick mucus → colonization → inflammation','Recurrent pulmonary infections, bronchiectasis, FEV1 decline'],
      ['Pancreas','Duct obstruction → exocrine failure','Steatorrhea, fat-soluble vitamin deficiency, FTT'],
      ['Liver','Bile duct plugging','Hepatic steatosis, cirrhosis (minority)'],
      ['Reproductive tract','Absent vas deferens (males), thick cervical mucus (females)','Infertility'],
      ['Sweat glands','Excess NaCl in sweat','Positive sweat chloride test (diagnostic)']
    ],
    refs: ['Elborn JS. Cystic fibrosis. Lancet. 2016;388:2519–2531.','Rowe SM et al. Mechanisms of disease: cystic fibrosis. NEJM. 2005;352:1992–2001.']
  },
  guidelines: {
    title: 'Management Guidelines — Cystic Fibrosis',
    body: 'CF Foundation guidelines recommend CFTR modulator therapy (Trikafta — elexacaftor/tezacaftor/ivacaftor) for patients ≥2 years with at least one F508del allele. Pancreatic enzyme replacement, fat-soluble vitamins, and airway clearance therapy are standard. Newborn screening is universal in the US but has documented false-negative rates for rarer mutations.',
    table: [
      ['Recommendation','Source','Grade'],
      ['Trikafta for F508del heterozygous/homozygous ≥2y','CFF 2022','Grade A — multiple RCTs'],
      ['Pancreatic enzyme replacement for exocrine insufficiency','CFF','Grade A'],
      ['Airway clearance therapy (chest PT, vest)','CFF','Grade A'],
      ['Fat-soluble vitamin supplementation (A,D,E,K)','CFF','Grade A'],
      ['Sweat chloride as first diagnostic test','CFF/ATS','Grade A'],
      ['Genetic counseling for families','CFF/ACMG','Grade A']
    ],
    refs: ['Middleton PG et al. Elexacaftor-Tezacaftor-Ivacaftor for CF with a Single Phe508del Allele. NEJM. 2019;381:1809–1819.']
  },
  framework: {
    title: 'Diagnostic Framework — Recurrent Infections + Failure to Thrive',
    body: 'CF is distinguishable from immune deficiency by the co-presence of GI malabsorption and failure to thrive. This framework separates the two diagnoses at the bedside.',
    table: [
      ['Feature','Immune Deficiency','Cystic Fibrosis'],
      ['Pulmonary infections','Yes — bacterial, viral, fungal','Yes — predominantly bacterial'],
      ['GI symptoms','Giardia (IgA deficient); otherwise absent','Steatorrhea, oily stools, FTT'],
      ['Growth','Declining with infections','Consistently low, independent of infections'],
      ['B cells / Immunoglobulins','Absent or low (XLA/CVID)','Normal'],
      ['Sweat chloride','Normal','>60 mmol/L (diagnostic)'],
      ['Newborn screen','N/A','May be falsely negative (5–10%)']
    ],
    refs: ['Farrell PM et al. Diagnosis of cystic fibrosis: Consensus guidelines from the CF Foundation. J Pediatr. 2017;181S:S4–S15.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Sweat chloride at age 2 (FTT + chronic cough + steatorrhea)','Grade A — guideline-recommended','CF triad present by age 2; sweat chloride is cheap, non-invasive, definitive'],
      ['Sweat chloride after 1st pulmonary infection (age 4)','Grade B — later than optimal','Actionable, but earlier opportunity missed; FTT and steatorrhea predated this'],
      ['Normal newborn screen = sufficient reassurance','Grade D — incorrect','5–10% false negative rate; clinical suspicion overrides a negative screen']
    ]
  },
  emr: {
    title: 'EMR Lens — What Would Have Flagged CF Earlier',
    body: 'Diego\'s CF was diagnosable at age 2. The steatorrhea and failure to thrive were present years before the first pulmonary exacerbation. These structured EMR fields, combined with a CDS rule, would have triggered evaluation years earlier.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Stool character (structured)','Oily, foul-smelling, frequent stools flag','Steatorrhea + growth failure + cough → sweat chloride'],
      ['Growth trend','Weight/height percentiles at every visit','Weight persistently <10th percentile + cough → CF workup'],
      ['Newborn screen country/completeness','Documentation of screen performed + which conditions covered','Foreign newborn screen or incomplete screen + respiratory/GI symptoms → repeat US screen'],
      ['Chronic cough duration','Age of onset, character, productive flag','Chronic cough since infancy + any GI malabsorption → sweat chloride'],
      ['Adoption/immigration status','Flag for incomplete birth records','International adoption + respiratory symptoms → repeat full metabolic screen'],
      ['Ethnicity/ancestry','Documented ancestry','Northern European ancestry + respiratory + GI symptoms → CFTR carrier/disease screen']
    ],
    refs: ['Farrell PM et al. J Pediatr. 2017;181S:S4–S15.']
  }
},

// ── FAMILY 3: DEVELOPMENT ────────────────────────────────────────────────────

A3: {
  pathophys: {
    title: 'Normal Motor Development — The Biology of Late Walking',
    body: 'Independent ambulation requires maturation of the corticospinal tract, cerebellum, basal ganglia, and peripheral nervous system — as well as adequate muscle strength, postural control, and proprioceptive feedback. There is significant normal variation in the timing of these maturational processes. The normal range for independent walking is 9–18 months, with a mean of approximately 12 months. Children who walk at 17–18 months have the same neurologic architecture as those who walk at 10 months — the maturation is simply on the later end of the normal distribution. The critical distinction from pathologic delay is: (1) no regression, (2) normal tone and reflexes, (3) age-appropriate development in all other domains. Isolated late walking in an otherwise normal child is benign in >95% of cases.',
    table: [
      ['Motor Milestone','Normal Range','Median'],
      ['Sits unsupported','4–9 months','6–7 months'],
      ['Pulls to stand','6–12 months','9 months'],
      ['Cruises (furniture)','7–13 months','10 months'],
      ['Stands alone','9–14 months','11 months'],
      ['Walks independently','9–18 months','12 months'],
      ['Runs','14–24 months','18 months']
    ],
    refs: ['Gerber RJ et al. Developmental milestones: Motor development. Pediatr Rev. 2010;31:267–277.']
  },
  guidelines: {
    title: 'Clinical Guidelines — Developmental Surveillance and Screening',
    body: 'AAP 2022 guidelines recommend developmental surveillance at every well-child visit and standardized screening at 9, 18, and 30 months using validated tools (ASQ, PEDS). Referral to early intervention is recommended when delay is identified — and does not require a specific diagnosis. The guidelines explicitly recommend against over-investigation of isolated motor delay with normal neurologic exam.',
    table: [
      ['Recommendation','Source','Grade'],
      ['Developmental surveillance at every well-child visit','AAP 2022','Grade A'],
      ['Standardized screening at 9, 18, 30 months','AAP 2022','Grade A'],
      ['ASQ or PEDS as validated screening tools','AAP','Grade A'],
      ['Early intervention referral without formal diagnosis','IDEA/AAP','Grade A'],
      ['Neuroimaging not indicated for isolated motor delay + normal exam','Expert consensus','Grade B'],
      ['Re-evaluate at 18 months if isolated delay and not walking','Expert consensus','Grade B']
    ],
    refs: ['Lipkin PH et al. Promoting Optimal Development: Identifying Infants and Young Children With Developmental Disorders Through Developmental Surveillance and Screening. Pediatrics. 2020.']
  },
  framework: {
    title: 'Diagnostic Framework — Isolated vs Global Developmental Delay',
    body: 'The most important first step in any developmental concern is to determine whether the delay is isolated (one domain) or global (multiple domains). Isolated delay with normal neurologic exam in a child who is otherwise developmentally appropriate almost never has a pathologic cause. Global delay or regression always requires investigation.',
    table: [
      ['Pattern','Example','Action'],
      ['Isolated motor delay, normal neurology, normal other domains','Late walker — Maya','Watchful waiting + safety net + re-evaluate at 18m'],
      ['Isolated speech delay, normal other domains','Late talker','Audiology + speech therapy referral; re-evaluate'],
      ['Global delay (motor + language + social)','Carlos (hypothyroidism)','Urgent investigation: thyroid, metabolic, genetic'],
      ['Regression of acquired skills','Ethan (ASD), Ava (Rett)','Immediate evaluation — never watchful waiting'],
      ['Abnormal tone/reflexes + delay','Cerebral palsy pattern','Neurology + MRI + genetics'],
      ['Dysmorphic features + delay','Carlos, Lily (Angelman)','Genetics + metabolic workup urgently']
    ],
    refs: ['Shevell M et al. Practice parameter: evaluation of the child with global developmental delay. Neurology. 2003;60:367–380.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Reassure + safety net + 18-month re-evaluation','Grade B — evidence-based and appropriate','Isolated late walking with normal neurology: no investigation indicated'],
      ['Neurology referral for anxiety management','Grade C — Not indicated','Over-investigation amplifies parental anxiety; does not change outcome'],
      ['Brain MRI + genetics referral','Grade D — Harmful','Anesthesia risk + VUS from genetic panels + medicalization of normal variation']
    ]
  },
  emr: {
    title: 'EMR Lens — Tracking Developmental Milestones',
    body: 'Structured milestone documentation enables pattern recognition across visits — distinguishing isolated from global delay, and tracking trajectory over time.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Motor milestone (structured)','Walking status at 12, 15, 18m well visits','Not walking at 18 months → immediate evaluation + referral'],
      ['Language milestone','Words at 12m, 2-word phrases at 24m','No words at 16m → hearing test + speech referral'],
      ['Social milestone','Pointing, waving, eye contact, response to name','No pointing or response to name at 12m → M-CHAT + referral'],
      ['Developmental screening tool','ASQ/PEDS score documented','ASQ failed domain → referral based on domain affected'],
      ['Tone/reflexes documented','Normal vs abnormal on exam note','Abnormal tone + delay → neurology referral'],
      ['Multiple domain delay flag','Two or more domains affected','Global delay flag → urgent metabolic + genetic workup']
    ],
    refs: ['AAP. Identifying Infants and Young Children With Developmental Disorders. Pediatrics. 2020;145:e20193449.']
  }
},

B3: {
  pathophys: {
    title: 'Autism Spectrum Disorder — Neurobiology',
    body: 'ASD is a neurodevelopmental condition characterized by differences in social communication and the presence of restricted, repetitive behaviors. The neurobiologic basis is heterogeneous — ASD is associated with disruptions in synaptic connectivity, particularly in circuits supporting social cognition, language, and sensory integration. Multiple genetic variants (CNVs, de novo mutations in SHANK3, CNTNAP2, and many others) contribute, but no single gene explains most cases. The regression pattern seen in ~20–30% of children with ASD (normal development then plateau/regression between 12–24 months) likely reflects late-developing social and language circuits that were always atypical but become apparent only when social demands increase. It is NOT a sign of progressive neurologic deterioration.',
    table: [
      ['ASD Core Feature','Neural Basis (current understanding)'],
      ['Impaired social reciprocity','Disrupted superior temporal sulcus and fusiform face area activity'],
      ['Delayed/absent language','Atypical left hemisphere language network connectivity'],
      ['Repetitive behaviors','Excessive frontal-striatal loop activation'],
      ['Sensory sensitivities','Atypical sensory cortex processing and top-down modulation'],
      ['Regression at 12–24 months','Late-developing social circuits reveal underlying differences']
    ],
    refs: ['Geschwind DH. Genetics of autism spectrum disorders. Trends Cogn Sci. 2011;15:409–416.','Lord C et al. Autism spectrum disorder. Nat Rev Dis Primers. 2020;6:5.']
  },
  guidelines: {
    title: 'Clinical Guidelines — ASD Screening and Early Intervention',
    body: 'AAP 2020 recommends universal ASD screening with M-CHAT-R/F at 18 and 24 months. A high-risk screen (failed) should prompt immediate referral to early intervention and developmental evaluation simultaneously — not sequentially. Early intensive behavioral intervention (ABA, ESDM, JASPER) before age 3 produces the largest developmental gains.',
    table: [
      ['Recommendation','Source','Grade'],
      ['M-CHAT-R/F at 18 and 24 months (universal)','AAP 2020','Grade A'],
      ['Simultaneous referral: early intervention + developmental evaluation','AAP 2020','Grade A'],
      ['Do not delay EI referral waiting for formal diagnosis','IDEA/AAP','Grade A'],
      ['Audiologic evaluation to exclude hearing loss','AAP','Grade A'],
      ['Chromosomal microarray + Fragile X after ASD diagnosis','ACMG/AAN','Grade B'],
      ['EEG if history of regression or seizure concern','AAP','Grade B']
    ],
    refs: ['Hyman SL et al. Identification, evaluation, and management of children with autism spectrum disorder. Pediatrics. 2020;145:e20193447.']
  },
  framework: {
    title: 'Diagnostic Framework — Regression vs Delay',
    body: 'The distinction between developmental regression and simple delay is the most important clinical judgment in pediatric developmental medicine. They have different etiologies, different urgency, and different management.',
    table: [
      ['Feature','Delay','Regression'],
      ['Definition','Never achieved milestone','Achieved then lost'],
      ['Example','No words at 18m','Had words, then lost them'],
      ['Urgency','Evaluate — not emergency','Immediate evaluation — always'],
      ['Common causes','Normal variant, ASD, hearing loss','ASD, Rett syndrome, Landau-Kleffner, metabolic'],
      ['EEG indicated?','Usually not','Yes — rule out Landau-Kleffner, epileptic encephalopathy'],
      ['Management','EI referral; evaluate based on domain','Immediate EI + neurology + genetics workup']
    ],
    refs: ['Shyman SL et al. Identification of developmental-behavioral disorders in primary care: A systematic review. Pediatrics. 2000.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Simultaneous early intervention + developmental evaluation referrals','Grade A — AAP guideline','Maximum developmental gain requires both, starting immediately'],
      ['Wait for developmental evaluation before starting EI','Grade D — Harmful delay','Every month without EI before age 3 is lost developmental opportunity; diagnosis not required for services'],
      ['Watchful waiting — many late talkers catch up','Grade D — Wrong clinical frame','Regression of acquired skills is never watchful waiting; Ethan lost skills he had']
    ]
  },
  emr: {
    title: 'EMR Lens — Capturing Regression and ASD Signals',
    body: 'ASD detection relies on capturing social and communication milestones that primary care clinicians often do not systematically document. Regression is particularly likely to be missed if previous milestone documentation is absent.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Word count at 12m visit','Number of words documented','6+ words at 12m + loss by 15–18m = regression flag → immediate M-CHAT + referral'],
      ['Social milestones','Pointing, joint attention, response to name, waving at each visit','Loss of pointing or response to name at any visit → immediate evaluation'],
      ['M-CHAT-R/F score','Total score + follow-up interview if needed','Score ≥3 (high risk) → simultaneous EI + developmental referral'],
      ['Behavioral change note','Parent-reported behavior change since last visit','Parent reports child "changed" or "different" → developmental regression screening'],
      ['Regression flag','New structured problem: "developmental regression"','Any regression flag → neurology referral + EEG if language lost']
    ],
    refs: ['Robins DL et al. Validation of the modified checklist for autism in toddlers, revised with follow-up. Pediatrics. 2014;133:37–45.']
  }
},

C3: {
  pathophys: {
    title: 'Angelman Syndrome — Mechanism',
    body: 'Angelman syndrome results from loss of function of the maternally inherited <em>UBE3A</em> gene on chromosome 15q11-q13, which encodes an E3 ubiquitin ligase essential for synaptic plasticity and neuronal function. The paternal copy of UBE3A is silenced in neurons (imprinting), making the maternal copy the sole functional allele. Loss occurs via four mechanisms: maternal deletion (70–75% — most severe), paternal uniparental disomy (UPD, ~7%), imprinting center defect (~3%), and UBE3A point mutations (~11%). The molecular consequence is accumulation of substrate proteins that disrupt synaptic function, explaining the severe cognitive impairment, absent speech, and seizures. The characteristically happy, excitable affect reflects altered limbic circuit function — not intact cognition.',
    table: [
      ['Mechanism','Frequency','Severity','Detectable by'],
      ['Maternal 15q deletion','70–75%','Most severe','Chromosomal microarray'],
      ['Paternal uniparental disomy','~7%','Milder','Methylation analysis'],
      ['Imprinting center defect','~3%','Intermediate','Methylation analysis'],
      ['UBE3A mutation','~11%','Variable','Gene sequencing'],
      ['Unknown (clinical diagnosis)','~10%','Variable','None of the above']
    ],
    refs: ['Williams CA et al. Angelman syndrome 2005: Updated consensus for diagnostic criteria. Am J Med Genet. 2006;140A:413–418.','Tan WH et al. Angelman syndrome. Pediatr Neurol. 2011;45:209–217.']
  },
  guidelines: {
    title: 'Clinical Guidelines — Angelman Syndrome Diagnosis and Management',
    body: 'Chromosomal microarray is the recommended first-line genetic test. If normal, methylation analysis of 15q11-q13 must follow (to detect UPD and imprinting defects). If both are normal, UBE3A sequencing is indicated. Management is multidisciplinary: seizure control (VPA, clonazepam, levetiracetam), communication therapy (AAC), physical therapy, and behavioral support.',
    table: [
      ['Step','Test','Detects'],
      ['1st','Chromosomal microarray','Maternal deletion (70–75% of cases)'],
      ['2nd (if microarray normal)','Methylation analysis (MS-MLPA)','UPD + imprinting defects'],
      ['3rd (if methylation normal)','UBE3A sequencing','Point mutations'],
      ['4th (if all normal)','Clinical diagnosis','~10% no identified mutation']
    ],
    refs: ['Dagli A et al. Angelman Syndrome. GeneReviews. NCBI Bookshelf. Updated 2021.']
  },
  framework: {
    title: 'Diagnostic Framework — The Happy Affect Trap',
    body: 'The characteristically happy, excitable affect of Angelman syndrome is the most powerful diagnostic misleader in pediatric developmental medicine. This framework reframes affect as a diagnostic signal rather than reassurance.',
    table: [
      ['Finding','Standard Interpretation','Correct Clinical Interpretation'],
      ['"She\'s always laughing and happy"','Reassuring — child is not distressed','Red flag — inappropriate happy affect in context of absent speech and seizures'],
      ['No words at 18 months','Mild language delay — monitor','Absent speech + seizures + happy affect = Angelman syndrome triad'],
      ['Seizures in a happy child','Perhaps febrile? Watch and wait','Seizures + absent speech + happy affect = urgent genetic workup'],
      ['Wide-based jerky gait','Coordination issue','Ataxic gait + happy affect + absent speech = Angelman pathognomonic constellation'],
      ['Hand-flapping','Might be excitement','Hand-flapping + absent speech + happy affect = Angelman or autism (different pattern)']
    ],
    refs: ['Striano P et al. Smile! It may be Angelman syndrome. Lancet. 2002;360:1301.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Chromosomal microarray + methylation analysis + seizure management + AAC','Grade A','Evidence-based diagnostic pathway; seizure management and communication therapy proven effective'],
      ['Genetics referral only, defer counseling and management to specialist','Grade C — Incomplete','Seizure management + AAC referrals cannot wait for genetics clinic; primary care initiates'],
      ['Wait for specialist interpretation before telling parents','Grade D — Harmful delay','Diagnosis is confirmed; family needs truth, compassion, and action plan immediately']
    ]
  },
  emr: {
    title: 'EMR Lens — Catching Angelman Earlier',
    body: 'Angelman syndrome has an average age of diagnosis of 6 years despite presenting at 18 months. The features are present at every visit from 12–18 months onward — but they are rarely entered in structured fields that would enable pattern recognition.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Affect descriptor (structured)','Inappropriate happy/excitable affect flag','Persistent happy affect + absent speech + motor delay → Angelman workup'],
      ['Seizure documentation','Type, age of onset, frequency','Seizures onset <3 years + developmental delay → genetic evaluation including Angelman'],
      ['Speech milestone (structured)','Word count or "absent" flag','Zero words at 18 months (not just "delayed") + other features → urgent genetics'],
      ['Gait descriptor','Normal vs wide-based/ataxic','Wide-based gait + absent speech + happy affect → Angelman CDS alert'],
      ['EEG result','Angelman-pattern discharge documented','High-amplitude slow spike-wave discharge → Angelman genetics immediately']
    ],
    refs: ['Williams CA. Neurological aspects of the Angelman syndrome. Brain Dev. 2005;27:88–94.']
  }
},

D3: {
  pathophys: {
    title: 'Congenital Hypothyroidism — Mechanism and Critical Window',
    body: 'Thyroid hormone (T3 and T4) is essential for normal brain development from mid-gestation through approximately 2–3 years of age. T3 drives neuronal proliferation, migration, myelination of white matter tracts, and synaptogenesis. In congenital hypothyroidism, the thyroid gland fails to develop (dysgenesis — 85% of cases) or fails to produce hormone (dyshormonogenesis — 15%). Maternal T4 crosses the placenta in small amounts, providing partial protection in utero, but is insufficient for normal postnatal brain development. Without thyroid hormone in the first 2–3 years of life, the structural and functional architecture of the brain is permanently altered — producing irreversible intellectual disability. The severity correlates with the degree of T4 deficiency and the duration of untreated disease. Newborn screening catches this at day 2–3 of life and enables treatment before any damage occurs.',
    table: [
      ['Developmental stage','Role of thyroid hormone','Consequence of deficiency'],
      ['Fetal (gestational wks 10–40)','Maternal T4 partially compensates; some fetal production','Partial protection — damage begins after birth'],
      ['Postnatal 0–6 months','Critical — rapid myelination','Severe damage if untreated; partially reversible with early treatment'],
      ['6–24 months','Essential — synaptogenesis, cortical maturation','Significant irreversible damage if untreated beyond this window'],
      ['>24 months','Still important but decreasing vulnerability','Untreated CH before age 2 causes most of the permanent disability']
    ],
    refs: ['Fisher DA. Management of congenital hypothyroidism. J Clin Endocrinol Metab. 1991;72:523–529.','Grosse SD et al. Newborn screening for congenital hypothyroidism: effectiveness and assessment. Ment Retard Dev Disabil Res Rev. 2006;12:241–246.']
  },
  guidelines: {
    title: 'Clinical Guidelines — Congenital Hypothyroidism',
    body: 'ESPE/ETA 2014 guidelines recommend treatment initiation within 2 weeks of birth when identified by newborn screening. In missed cases (international adoption, failed screen), levothyroxine should be started immediately upon diagnosis — do not wait for specialist confirmation when TSH >100 and T4 is undetectable.',
    table: [
      ['Recommendation','Source','Grade'],
      ['Newborn screening (TSH or T4) by day 3','WHO/AAP','Grade A'],
      ['Treatment initiation within 2 weeks of birth (screened)','ESPE/ETA 2014','Grade A'],
      ['Start LT4 immediately in symptomatic CH — do not wait for specialist','Expert consensus','Grade B'],
      ['International adoption: repeat full metabolic screen regardless of records','AAP','Grade B'],
      ['Target T4 in upper half of normal range (first 2 years)','ESPE/ETA','Grade A'],
      ['Developmental follow-up + early intervention even with treatment','AAP/ESPE','Grade A']
    ],
    refs: ['Van Trotsenburg AS et al. European Society for Paediatric Endocrinology. Congenital hypothyroidism. ESPE Clinical Practice Guidelines. Horm Res Paediatr. 2014.']
  },
  framework: {
    title: 'Diagnostic Framework — Global Developmental Delay with Dysmorphic Features',
    body: 'Global developmental delay (two or more domains affected) combined with dysmorphic features requires urgent evaluation. The specific physical features of untreated congenital hypothyroidism distinguish it from other causes of global delay — but only if the clinician knows what to look for.',
    table: [
      ['Feature','CH-specific','ASD','Angelman','Rett'],
      ['Coarse facial features','Yes — classic','No','No','No'],
      ['Macroglossia','Yes — classic','No','No','No'],
      ['Hoarse cry','Yes — classic','No','No','No'],
      ['Constipation','Yes','No','No','No'],
      ['Growth failure','Yes — severe','No','Mild','Mild'],
      ['Happy affect','No','No','Yes — pathognomonic','No'],
      ['Hand-wringing','No','No','No','Yes — pathognomonic'],
      ['Regression','No (never developed)','Often','No','Yes — hallmark']
    ],
    refs: ['Rovet J. The role of thyroid hormones for brain development. Best Pract Res Clin Endocrinol Metab. 2014;28:69–83.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Start LT4 immediately + urgent endocrinology + developmental pediatrics + honest prognosis','Grade A','Every day of continued hypothyroidism adds irreversible neurologic burden; honesty enables family planning'],
      ['Tell parents he will catch up fully','Grade D — Factually incorrect','15 months of severe hypothyroidism in critical window causes irreversible damage in most cases'],
      ['Wait for endocrinology before starting LT4 (TSH >100)','Grade D — Harmful delay','TSH >100 + undetectable T4 is a treatable emergency; delay adds to neurologic injury']
    ]
  },
  emr: {
    title: 'EMR Lens — International Adoption and Missed Newborn Screens',
    body: 'International adoptees represent a specific high-risk group for missed metabolic diagnoses. Structured EMR flags and mandatory re-screening protocols would catch these cases at adoption.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Adoption status','International adoption flag at intake','International adoption → mandatory full US newborn metabolic screen regardless of foreign records'],
      ['Newborn screen completeness','Country of origin screen vs US screen equivalency','Non-US screen → flag as "incomplete — repeat required"'],
      ['TSH at intake (adoption)','Thyroid function at first US visit','TSH elevated at intake → immediate LT4 + endocrinology'],
      ['Global delay + coarse features','Structured dysmorphic feature documentation','Coarse features + macroglossia + global delay → urgent TSH + metabolic workup'],
      ['Growth below 5th percentile','Flag for global growth failure','Global growth failure + coarse features + delay → thyroid + genetic workup urgently']
    ],
    refs: ['Miller LC. International adoption: Infectious diseases issues. Clin Infect Dis. 2005;40:286–293.']
  }
},

E3: {
  pathophys: {
    title: 'Rett Syndrome — Mechanism',
    body: 'Rett syndrome is caused by de novo loss-of-function mutations in <em>MECP2</em> (methyl CpG binding protein 2), an X-linked gene encoding a transcriptional regulator that modulates the expression of hundreds of genes involved in synaptic maturation. In the absence of functional MeCP2, synaptic development proceeds abnormally — particularly for inhibitory interneurons and the circuits governing breathing regulation, motor coordination, and language. The condition is almost exclusively seen in females because males with MECP2 mutations typically have a severe neonatal encephalopathy and do not survive to present with the classic Rett phenotype. X-chromosome inactivation mosaicism in females allows partial gene expression, explaining the variability in severity. The mutations are de novo in virtually all cases — parents are not carriers.',
    table: [
      ['Rett Stage','Age','Features'],
      ['I — Stagnation','6–18 months','Subtle developmental slowdown; often not recognized'],
      ['II — Regression','1–4 years','Loss of hand use, speech, and social skills; hand-wringing; breathing irregularities; seizures begin'],
      ['III — Plateau/Pseudo-stationary','2–10 years','Motor and behavioral stabilization; seizures often improve; some communication recovers'],
      ['IV — Late motor deterioration','After 10 years','Progressive loss of ambulation; scoliosis; reduced seizures']
    ],
    refs: ['Neul JL et al. Rett syndrome: Revised diagnostic criteria and nomenclature. Ann Neurol. 2010;68:944–950.','Gadalla KKE et al. MeCP2 and Rett syndrome: reversibility and potential avenues for therapy. Biochem J. 2011;439:1–14.']
  },
  guidelines: {
    title: 'Clinical Guidelines — Rett Syndrome Diagnosis',
    body: 'The 2010 revised diagnostic criteria require: regression after a period of normal development + all four main criteria (partial loss of purposeful hand use, partial loss of spoken language, gait abnormalities, hand stereotypies). MECP2 sequencing is the confirmatory test. Management is multidisciplinary with no disease-modifying treatment currently approved, though gene therapy trials are underway.',
    table: [
      ['2010 Rett Syndrome Diagnostic Criteria (all 4 required)',''],
      ['1. Partial or complete loss of acquired purposeful hand skills','Hand-wringing replaces purposeful hand use'],
      ['2. Partial or complete loss of acquired spoken language','Regression of words'],
      ['3. Gait abnormalities (acquired)','Apraxia or loss of mobility'],
      ['4. Stereotypic hand movements','Hand-wringing, squeezing, clapping'],
      ['Confirmatory test','MECP2 sequencing (pathogenic variant in ~95%)']
    ],
    refs: ['Neul JL et al. Rett syndrome: Revised diagnostic criteria. Ann Neurol. 2010;68:944–950.']
  },
  framework: {
    title: 'Diagnostic Framework — Regression After Normal Development in Girls',
    body: 'When a female child has normal development followed by regression, the differential narrows significantly. This framework guides rapid clinical identification.',
    table: [
      ['Diagnosis','Sex predilection','Key features beyond regression'],
      ['Rett syndrome','Female (almost exclusively)','Hand-wringing, breathing irregularities, de novo MECP2'],
      ['ASD with regression','Male 4:1','Social withdrawal, repetitive behaviors, M-CHAT positive'],
      ['Landau-Kleffner syndrome','Both (slight male)','Language loss specifically; EEG: epileptiform discharges during sleep'],
      ['Angelman syndrome','Both equally','Happy affect, seizures, ataxia — regression less prominent'],
      ['Mitochondrial disease','Both','Multi-organ involvement, lactic acidosis, regression with illness']
    ],
    refs: ['Glaze DG. Neurophysiology of Rett syndrome. J Child Neurol. 2005;20:740–746.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Full multidisciplinary care + honest prognosis + gene therapy discussion','Grade B — guideline supported','No cure but strong evidence for symptom management; gene therapy trials actively enrolling'],
      ['Refer to genetics/neurology and defer all counseling','Grade C — Inadequate primary care role','Primary care must provide immediate support, referrals, and connect family to resources'],
      ['Frame prognosis around only the limitations','Grade D — Harmful framing','Many Rett patients live 4–6 decades with AAC and intensive support; begin with what is possible']
    ]
  },
  emr: {
    title: 'EMR Lens — Catching Rett Syndrome in the Regression Window',
    body: 'Rett syndrome\'s regression window (12–24 months) is the time when clinical diagnosis is most actionable. Structured documentation of skills at each well-child visit enables regression detection.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Word count at each visit','Number of words documented at 9m, 12m, 15m, 18m','Word count decline between visits → regression flag → immediate evaluation'],
      ['Hand use quality','Purposeful vs stereotypic hand movements','Hand-wringing or stereotypic movements replacing purposeful use → Rett workup'],
      ['Breathing pattern','Irregular breathing episodes documented','Irregular breathing + hand stereotypies + female → MECP2 sequencing'],
      ['Sex-specific alerts','Female patient + regression flag','Regression in female child → Rett syndrome differential prominently flagged'],
      ['Previous milestone documentation','Skills documented at prior visits','Comparison to prior visit enables regression detection vs never-developed']
    ],
    refs: ['Fehr S et al. Toward earlier diagnosis of Rett syndrome: A review of the clinical signs before the classic stage. J Child Neurol. 2013;28:1121–1138.']
  }
},

// ── FAMILY 4: JOINT PAIN ─────────────────────────────────────────────────────

F4A: {
  pathophys: {
    title: 'Rheumatoid Arthritis — Mechanism',
    body: 'RA is an autoimmune condition driven by T cell and B cell activation against synovial joint antigens — particularly citrullinated proteins (recognized by anti-CCP antibodies). Immune complex deposition and inflammatory cytokines (TNF-α, IL-1, IL-6) drive synovial proliferation (pannus formation), producing the hyperplastic, invasive synovium that erodes cartilage and bone. The pannus invades bone at the cartilage-bone junction, producing the characteristic marginal erosions seen on X-ray. Untreated, this process leads to progressive joint destruction. The chronic systemic inflammation also explains constitutional symptoms (fatigue, weight loss, anemia of inflammation) and extra-articular manifestations (nodules, interstitial lung disease, vasculitis). Morning stiffness reflects nocturnal accumulation of inflammatory cytokines in joint fluid, which dissipates with joint movement.',
    table: [
      ['Feature','Mechanism'],
      ['Morning stiffness >1 hour','Cytokine accumulation overnight; dissipates with joint use'],
      ['Symmetric joint involvement','Systemic autoimmune process affecting joints bilaterally'],
      ['MCP/PIP predominance','High density of citrullinated proteins at these sites'],
      ['Pannus formation','Proliferative synovium driven by TNF-α, IL-1, IL-6'],
      ['Erosions on X-ray','Pannus invasion of bone at cartilage margin'],
      ['Elevated CRP/ESR','Systemic IL-6 driving acute phase protein production']
    ],
    refs: ['McInnes IB, Schett G. The pathogenesis of rheumatoid arthritis. NEJM. 2011;365:2205–2219.']
  },
  guidelines: {
    title: 'Clinical Guidelines — 2010 ACR/EULAR RA Classification Criteria',
    body: 'The 2010 ACR/EULAR criteria enable earlier diagnosis than the 1987 criteria — they reward early identification before erosions develop. A score ≥6/10 classifies as definite RA. Management targets remission (DAS28 <2.6) or low disease activity as first-line goals.',
    table: [
      ['Domain','Score'],
      ['Joint involvement: 1 large joint','0'],
      ['Joint involvement: 2–10 large joints','1'],
      ['Joint involvement: 1–3 small joints','2'],
      ['Joint involvement: 4–10 small joints','3'],
      ['Joint involvement: >10 joints (≥1 small)','5'],
      ['Serology: negative RF and anti-CCP','0'],
      ['Serology: low positive RF or anti-CCP','2'],
      ['Serology: high positive RF or anti-CCP (>3x ULN)','3'],
      ['Acute phase reactants: normal CRP and ESR','0'],
      ['Acute phase reactants: abnormal CRP or ESR','1'],
      ['Duration: <6 weeks','0'],
      ['Duration: ≥6 weeks','1'],
      ['Score ≥6 = definite RA','']
    ],
    refs: ['Aletaha D et al. 2010 Rheumatoid Arthritis Classification Criteria. Arthritis Rheum. 2010;62:2569–2581.']
  },
  framework: {
    title: 'Diagnostic Framework — Inflammatory vs Mechanical Arthritis',
    body: 'The single most important clinical distinction in joint disease can be made from history alone — before any test is ordered. The direction of stiffness relative to activity determines the diagnosis.',
    table: [
      ['Feature','Inflammatory (RA, SLE, reactive)','Mechanical (OA)'],
      ['Morning stiffness duration','>60 minutes','<30 minutes'],
      ['Effect of activity on stiffness','Improves with use (gel phenomenon)','Worsens with use'],
      ['Joint distribution','Small joints, symmetric','Large joints, asymmetric'],
      ['Systemic features','Fatigue, weight loss, fever','Absent'],
      ['CRP/ESR','Elevated','Normal'],
      ['Joint exam','Warmth, synovitis, effusion','Crepitus, bony enlargement, no warmth']
    ],
    refs: ['Firestein GS et al. Kelley and Firestein\'s Textbook of Rheumatology. 10th ed. 2017.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Counsel re: remission-maintenance; taper only under specialist guidance','Grade A — multiple RCTs','DMARD discontinuation in remission → flare in 70–80% within 12 months'],
      ['Support stopping medication in remission','Grade D — Harmful omission','Anti-CCP positive RA does not achieve spontaneous remission; stopping causes accelerated joint damage'],
      ['Reduce dose as a compromise','Grade C — Insufficient','Dose reduction without sustained deep remission data is not evidence-based']
    ]
  },
  emr: {
    title: 'EMR Lens — Early RA Detection in Primary Care',
    body: 'RA is often present for 9–12 months before diagnosis. Structured EMR fields enable earlier recognition and faster referral to rheumatology within the window of opportunity.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Morning stiffness duration (structured)','Minutes of stiffness at joint pain visit','Morning stiffness >60 minutes + small joint involvement → RF + anti-CCP + rheumatology'],
      ['Joint symmetry flag','Bilateral involvement documented','Bilateral hand/wrist symptoms + morning stiffness → inflammatory arthritis workup'],
      ['CRP/ESR result','Inflammatory markers at joint pain visit','Elevated CRP/ESR + small joint involvement → anti-CCP + rheumatology referral'],
      ['Anti-CCP result','Positive anti-CCP flag on problem list','Positive anti-CCP → rheumatology referral within 2 weeks'],
      ['Family history (autoimmune)','RA, SLE, psoriatic arthritis in relatives','First-degree relative with RA + joint symptoms → lower threshold for serologic workup'],
      ['Medication reconciliation','DMARD on medication list','Active RA diagnosis + no DMARD on list → gap in care alert']
    ],
    refs: ['van der Linden MPM et al. Long-term impact of delay in assessment of early arthritis patients. Ann Rheum Dis. 2010;69:522–527.']
  }
},

F4B: {
  pathophys: {
    title: 'Osteoarthritis — Mechanism',
    body: 'OA is a disease of the entire joint — cartilage, subchondral bone, synovium, and periarticular muscles. The primary event is progressive loss of articular cartilage, driven by an imbalance between cartilage anabolism (chondrocyte synthesis) and catabolism (metalloproteinase degradation). Mechanical loading, particularly repetitive or excessive, accelerates chondrocyte stress responses and matrix degradation. The subchondral bone responds by sclerosis and osteophyte formation (bony spurs at joint margins). Synovial inflammation is present but low-grade, secondary to cartilage breakdown products — it does not drive the disease as in RA. Pain arises from periarticular structures (bone, capsule, muscle) since cartilage itself has no nerve supply. Morning stiffness is brief and reflects the normal joint capsule "warming up" after rest — not cytokine-driven synovitis.',
    table: [
      ['OA Feature','Mechanism'],
      ['Cartilage loss','MMP-mediated degradation exceeds synthesis; chondrocyte apoptosis'],
      ['Subchondral sclerosis','Bone stress response to loss of cartilage cushioning'],
      ['Osteophytes','Periosteal new bone at margins — attempted stabilization'],
      ['Brief morning stiffness (<30 min)','Joint capsule stiffness, not cytokine-driven synovitis'],
      ['Pain worsens with use','Bone-on-bone contact, capsular stretch — mechanical'],
      ['Crepitus','Rough articular surfaces rubbing on joint motion']
    ],
    refs: ['Hunter DJ, Bierma-Zeinstra S. Osteoarthritis. Lancet. 2019;393:1745–1759.']
  },
  guidelines: {
    title: 'Clinical Guidelines — Osteoarthritis Management',
    body: 'ACR/EULAR 2019 guidelines strongly recommend exercise therapy as the cornerstone of OA management — not rest, not surgery first. Oral NSAIDs carry GI and cardiovascular risk in older adults; topical NSAIDs are preferred for knee OA. Surgical referral is appropriate after failure of conservative management, not based on imaging severity alone.',
    table: [
      ['Recommendation','Source','Evidence'],
      ['Exercise therapy (land- and water-based)','ACR/EULAR 2019','Grade A — strong recommendation'],
      ['Weight management','ACR 2019','Grade A'],
      ['Topical NSAIDs (knee OA)','ACR 2019','Grade A — preferred over oral for localized disease'],
      ['Acetaminophen for pain control','ACR 2019','Grade B'],
      ['Intra-articular steroid for acute flares','ACR 2019','Grade B'],
      ['Oral NSAIDs (with PPI in older adults)','ACR 2019','Grade B — use cautiously'],
      ['Total joint replacement after failed conservative management','AAOS','Grade B']
    ],
    refs: ['Kolasinski SL et al. 2019 ACR/AF Guideline for the Management of Osteoarthritis. Arthritis Rheumatol. 2020;72:149–162.']
  },
  framework: {
    title: 'Diagnostic Framework — Avoiding Over-Investigation in OA',
    body: 'Classic OA has a specific clinical and demographic signature that rarely requires extensive investigation. The risk of over-investigation is not trivial: autoimmune panels in older patients frequently return false positives or age-related antibody changes that generate downstream testing, anxiety, and specialist referrals for a non-existent diagnosis.',
    table: [
      ['OA Signature','Specific Finding'],
      ['Age >50 + large joint + asymmetric','High prior probability for OA — investigation directed'],
      ['Morning stiffness <30 min + worsens with use','Mechanical pattern — no inflammatory workup needed'],
      ['Normal CRP and ESR','Confirms mechanical diagnosis — close the investigation'],
      ['X-ray: osteophytes + joint space narrowing','Confirms OA — no further imaging (MRI, etc.) without specific indication'],
      ['If RF/ANA ordered incidentally in older patient','Low positive RF and low positive ANA are common in elderly — do not diagnose RA/lupus without clinical features']
    ],
    refs: ['Felson DT. Osteoarthritis as a disease of mechanics. Osteoarthritis Cartilage. 2013;21:10–15.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Exercise therapy + topical NSAID + weight management + no activity restriction','Grade A','Highest-evidence OA management; exercise is the single most effective intervention'],
      ['Orthopedics referral before conservative management','Grade C — Premature','Imaging severity ≠ surgical indication; function and failed conservative management drive referral'],
      ['Daily oral NSAIDs + activity restriction','Grade D — Harmful','GI/CV risk in 72-year-old + deconditioning from activity restriction worsens OA outcomes']
    ]
  },
  emr: {
    title: 'EMR Lens — OA Management and Preventing Over-Investigation',
    body: 'The EMR can support appropriate OA management and prevent the cascade of unnecessary testing that follows an incidental low-positive RF or ANA result in an older adult.',
    table: [
      ['EMR Field','What to Capture','Alert / Prevention Rule'],
      ['Arthritis type (structured)','OA vs inflammatory — document at diagnosis','OA flagged → suppress inflammatory panel CDS rules for this joint complaint'],
      ['Exercise prescription','Exercise type, frequency, referral to physio','No exercise prescription in OA patient → quality gap alert'],
      ['Oral NSAID in >65','NSAID on medication list in elderly','Oral NSAID chronic use in >65 → GI protection (PPI) prompt + consider topical switch'],
      ['Incidental RF/ANA in elderly','Low-positive result in patient without inflammatory features','Low positive RF/ANA in >65 with classic OA → interpret-in-context note; no referral unless clinical features'],
      ['Surgical referral criteria','Function score + failed conservative management documented','Referral without documented exercise trial + analgesia trial → quality gap flag']
    ],
    refs: ['Hochberg MC et al. American College of Rheumatology 2012 recommendations for the use of nonpharmacologic and pharmacologic therapies in osteoarthritis. Arthritis Care Res. 2012;64:465–474.']
  }
},

F4C: {
  pathophys: {
    title: 'Reactive Arthritis — Mechanism',
    body: 'Reactive arthritis is a sterile synovial inflammation triggered by a remote infection — most commonly genitourinary (<em>Chlamydia trachomatis</em>, <em>Ureaplasma</em>) or gastrointestinal (<em>Salmonella</em>, <em>Shigella</em>, <em>Campylobacter</em>, <em>Yersinia</em>). The joint is not infected — bacterial antigens (lipopolysaccharide, outer membrane proteins) translocate to synovial tissue and trigger an HLA-B27-restricted T cell response. HLA-B27 presents bacterial peptides to CD8+ T cells with aberrant cross-reactivity — explaining why HLA-B27 positive individuals are at higher risk. The inflammation typically peaks 1–4 weeks after the triggering infection and resolves in 3–6 months in most cases, though HLA-B27 positive patients have higher rates of chronic disease and subsequent spondyloarthropathy.',
    table: [
      ['Step','Event'],
      ['1. Triggering infection','Urogenital (Chlamydia) or GI (Salmonella, Shigella, etc.)'],
      ['2. Antigen translocation','Bacterial antigens reach synovial tissue via circulation or direct spread'],
      ['3. HLA-B27 presentation','B27 presents bacterial peptides to T cells with cross-reactive potential'],
      ['4. Synovial inflammation','Sterile synovitis — joint is NOT infected'],
      ['5. Resolution or chronicity','3–6 months in most; HLA-B27+ have higher risk of chronicity']
    ],
    refs: ['Carter JD, Hudson AP. Reactive arthritis: Clinical aspects and medical management. Rheum Dis Clin North Am. 2009;35:21–44.']
  },
  guidelines: {
    title: 'Clinical Guidelines — Reactive Arthritis Management',
    body: 'ACR and European guidelines recommend treating the triggering infection (antibiotics), managing arthritis with NSAIDs as first-line (short-term), and using DMARDs or sulfasalazine for chronic disease (>6 months). HLA-B27 testing informs prognosis but is not required for diagnosis.',
    table: [
      ['Recommendation','Source','Grade'],
      ['Treat triggering infection (antibiotics for Chlamydia)','CDC/ACR','Grade A'],
      ['NSAIDs as first-line for arthritis pain/inflammation','ACR','Grade B'],
      ['Intra-articular steroid for persistent monoarthritis','ACR','Grade B'],
      ['Sulfasalazine or methotrexate for chronic (>6m) disease','ACR/EULAR','Grade C'],
      ['HLA-B27 testing for prognosis (not diagnosis)','ACR','Grade B'],
      ['Partner notification and treatment for Chlamydia','CDC','Grade A — legal obligation']
    ],
    refs: ['Leirisalo-Repo M. Reactive arthritis. Scand J Rheumatol. 2005;34:251–259.']
  },
  framework: {
    title: 'Diagnostic Framework — Acute Oligoarthritis in Young Adults',
    body: 'Acute oligoarthritis (1–4 joints) in a young adult has a narrow differential but requires specific history and joint aspiration to distinguish. The history questions that unlock reactive arthritis are almost never asked.',
    table: [
      ['Diagnosis','Key discriminating feature','First test'],
      ['Septic arthritis','Fever + monoarthritis + systemic unwell','Joint aspiration — WBC, culture, Gram stain'],
      ['Crystal arthropathy (gout/pseudogout)','Older patient, hyperuricemia, podagra distribution','Joint aspiration — polarized light microscopy'],
      ['Reactive arthritis','Preceding infection (urogenital/GI) 1–4 weeks prior','Ask about urinary symptoms + sexual history; NAAT for Chlamydia'],
      ['Viral arthritis','Recent viral illness (parvovirus, HBV, rubella)','Viral serology; history of rash, fever'],
      ['Early RA','Symmetric, small joints, prolonged morning stiffness','RF, anti-CCP, inflammatory markers']
    ],
    refs: ['Margaretten ME et al. Does this adult patient have septic arthritis? JAMA. 2007;297:1478–1488.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Targeted history first (urinary/eye/sexual history) → NAAT → treat','Grade A','History converts a $3,000 workup into a targeted NAAT; most cost-effective approach'],
      ['Shotgun autoimmune panel + HLA-B27 + aspiration simultaneously','Grade C — Excessive without history first','Aspiration yes; autoimmune panel without history context generates confusion and false positives'],
      ['Empiric gout treatment without aspiration','Grade D — Risky','Fails to exclude septic arthritis; inappropriate in 19-year-old; gout uncommon at this age']
    ]
  },
  emr: {
    title: 'EMR Lens — Capturing Triggers for Reactive Arthritis',
    body: 'Reactive arthritis is missed because the triggering infection occurred weeks earlier and is no longer active. Structured documentation of recent infections, STI history, and sexual activity enables retrospective pattern recognition.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Recent STI/STI exposure (structured)','Chlamydia test results + exposure history','Recent Chlamydia or urethritis + acute arthritis → reactive arthritis diagnosis'],
      ['Recent GI illness','Bacterial gastroenteritis within 6 weeks','GI illness + acute oligoarthritis in lower extremities → reactive arthritis differential'],
      ['Sexual history at joint pain visit','Last sexual activity, new partners, symptoms','Sexually active + urethral symptoms + arthritis → reactive arthritis workup'],
      ['Eye symptoms (structured)','Conjunctivitis or uveitis within 4 weeks','Conjunctivitis + arthritis → reactive arthritis triad — ask about urethritis'],
      ['HLA-B27 result','Documented if tested','HLA-B27 positive + reactive arthritis → high risk for chronicity; spondyloarthropathy monitoring']
    ],
    refs: ['Hamdulay SS et al. When is arthritis reactive? Postgrad Med J. 2006;82:446–453.']
  }
},

F4D: {
  pathophys: {
    title: 'Systemic Lupus Erythematosus (SLE) — Mechanism',
    body: 'SLE is driven by defective clearance of apoptotic cells, leading to nuclear material (DNA, histones, ribonucleoproteins) persisting extracellularly. Plasmacytoid dendritic cells recognize this material via Toll-like receptors and produce massive quantities of type I interferon. Interferon drives autoantigen presentation, T cell activation, and pathogenic autoantibody production (anti-dsDNA, anti-Smith, anti-Ro/La, anti-phospholipid). Immune complex deposition in kidneys (glomeruli), skin, joints, and vessels activates complement (reducing C3/C4) and recruits neutrophils, causing end-organ inflammation. The kidneys are particularly vulnerable — glomerular immune complex deposition produces the various classes of lupus nephritis (I–V), ranging from mesangial to diffuse proliferative.',
    table: [
      ['Autoantibody','Specificity','Clinical Association'],
      ['ANA','99% sensitive','Present in virtually all SLE — screening test only'],
      ['Anti-dsDNA','70% sensitive, 97% specific','Correlates with disease activity; rises before flares'],
      ['Anti-Smith','25% sensitive, 99% specific','Highly specific — pathognomonic when positive'],
      ['Anti-Ro/La','30–40%','Neonatal lupus, SCLE, Sjögren\'s overlap'],
      ['Anti-phospholipid','30–40%','Thrombosis, pregnancy loss — antiphospholipid syndrome'],
      ['Low C3/C4','Complement consumption','Active nephritis or systemic inflammation; follows disease activity']
    ],
    refs: ['Tsokos GC. Systemic lupus erythematosus. NEJM. 2011;365:2110–2121.']
  },
  guidelines: {
    title: 'Clinical Guidelines — 2019 EULAR/ACR SLE Classification Criteria',
    body: 'The 2019 EULAR/ACR criteria replaced the 1997 ACR criteria with a weighted scoring system. ANA ≥1:80 is the entry criterion. Subsequent domains each carry weighted scores — a total score ≥10 classifies as SLE. Urinalysis is a mandatory component of SLE evaluation and monitoring.',
    table: [
      ['Domain','Items (examples)','Max score'],
      ['Constitutional','Fever','2'],
      ['Hematologic','Leukopenia, thrombocytopenia, hemolytic anemia','up to 4'],
      ['Neuropsychiatric','Seizures, psychosis, myelitis','up to 5'],
      ['Mucocutaneous','Malar rash, oral ulcers, photosensitivity, hair loss','up to 6'],
      ['Serosal','Pericarditis, pleuritis','up to 6'],
      ['Musculoskeletal','Arthritis (2+ joints + synovitis)','6'],
      ['Renal','Proteinuria, renal biopsy Class III–V','up to 10'],
      ['Immunology','Anti-dsDNA, anti-Smith, complement, anti-phospholipid','up to 12'],
      ['Entry criterion: ANA ≥1:80','Required (score 0)','—']
    ],
    refs: ['Aringer M et al. 2019 EULAR/ACR Classification Criteria for Systemic Lupus Erythematosus. Arthritis Rheumatol. 2019;71:1400–1412.']
  },
  framework: {
    title: 'Diagnostic Framework — Arthritis as Presenting Complaint of Systemic Disease',
    body: 'Arthritis is rarely an isolated finding in SLE — it almost always accompanies systemic features. The clinical skill is stepping back from the joint complaint and asking: "What else is this patient telling me?" The following findings, present in combination, mandate SLE evaluation.',
    table: [
      ['Finding','Significance if present with arthritis'],
      ['Photosensitive facial rash (malar distribution)','SLE until proven otherwise — check ANA, anti-dsDNA'],
      ['Oral ulcers (painless)','SLE classification criterion — ask specifically'],
      ['Hair thinning/alopecia','SLE classification criterion — often dismissed as stress'],
      ['Fatigue + fever + weight loss','Constitutional features of systemic autoimmunity'],
      ['Female + Black/Hispanic/Asian + reproductive age','Highest-risk demographic for SLE — lower threshold'],
      ['Proteinuria/RBC casts on UA','Lupus nephritis — requires immediate nephrology referral']
    ],
    refs: ['Tani C et al. SLE presentation and management in different demographic groups. Rheumatology. 2021.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['ANA + UA + anti-dsDNA + complement in any patient with systemic features + arthritis','Grade A','Mandatory — lupus nephritis is silent without UA; delay causes irreversible renal damage'],
      ['Treat arthritis in isolation without systemic evaluation','Grade D — Harmful omission','Lupus nephritis is present in ~50% of SLE patients and is clinically silent without UA'],
      ['Hydroxychloroquine as foundational therapy for all SLE','Grade A — multiple RCTs','Reduces flares, organ damage, thrombosis, and mortality — prescribed regardless of disease activity']
    ]
  },
  emr: {
    title: 'EMR Lens — Capturing Systemic Features That Identify SLE',
    body: 'SLE\'s multisystem features are often documented separately across different visits without ever being assembled into a pattern. Structured fields and cross-visit synthesis enable earlier recognition.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Skin findings (structured)','Malar rash, photosensitivity, oral ulcers as coded findings','Malar rash + oral ulcers in female of reproductive age → ANA + UA + anti-dsDNA'],
      ['Hair changes','Alopecia flag — non-androgenic pattern','Diffuse alopecia + joint pain + fatigue in young woman → SLE screen'],
      ['UA at every visit for SLE suspect','Protein, RBC casts, microscopy result','Proteinuria 2+ or RBC casts → immediate nephrology referral and SLE workup'],
      ['Complement levels','C3/C4 results','Low C3/C4 + positive ANA → anti-dsDNA + nephrology'],
      ['Demographic flag','Female + age 15–45 + Black/Hispanic/Asian ancestry','Higher-risk demographic + any 2 SLE features → lower threshold for full workup'],
      ['Fatigue + multiple symptoms across visits','Cross-visit symptom pattern flag','Fatigue + joint pain + rash + oral ulcers across separate visits → SLE screen CDS']
    ],
    refs: ['Pons-Estel GJ et al. Understanding and recognizing systemic lupus erythematosus in diverse populations. Expert Rev Clin Immunol. 2017;13:263–275.']
  }
},

F4E: {
  pathophys: {
    title: 'Systemic JIA and Macrophage Activation Syndrome — Mechanism',
    body: 'Systemic JIA (sJIA) is now classified as an autoinflammatory disease driven by innate immune dysregulation — distinct from the adaptive immune-driven mechanisms of other JIA subtypes. The central pathologic drivers are excessive IL-1β and IL-18 signaling, produced by activated macrophages and neutrophils. IL-18 — markedly elevated in sJIA — drives NK cell and cytotoxic T cell activation, creating the substrate for MAS. MAS is a secondary hemophagocytic lymphohistiocytosis (HLH) — uncontrolled macrophage activation that engulfs and destroys blood cells (hemophagocytosis), producing consumptive coagulopathy (falling fibrinogen, platelets) and cytokine storm (hyperferritinemia, organ failure). Ferritin in MAS often exceeds 10,000 ng/mL — the markedly elevated ferritin reflects massive macrophage activity and serves as the most sensitive early warning.',
    table: [
      ['Feature','Mechanism'],
      ['Quotidian fever (afternoon spike)','IL-1β pulse secretion — follows macrophage activation cycle'],
      ['Salmon evanescent rash','Transient IL-1/IL-6 driven skin inflammation during fever spike'],
      ['Splenomegaly/lymphadenopathy','Macrophage infiltration of reticuloendothelial system'],
      ['Ferritin rise in MAS','Massive macrophage ferritin secretion during hemophagocytosis'],
      ['Falling fibrinogen in MAS','Consumptive coagulopathy — macrophages activate coagulation cascade'],
      ['Falling platelets in MAS','Platelet consumption by activated macrophages in BM and spleen']
    ],
    refs: ['Ravelli A et al. Macrophage activation syndrome as part of systemic juvenile idiopathic arthritis. Pediatr Rheumatol. 2016;14:33.','Nigrovic PA. Review: Is there a window of opportunity for treatment of systemic juvenile idiopathic arthritis? Arthritis Rheum. 2014;66:1405–1413.']
  },
  guidelines: {
    title: 'Clinical Guidelines — sJIA Diagnosis and MAS Recognition',
    body: 'ILAR classification criteria require: arthritis in ≥1 joint + quotidian fever ≥2 weeks + ≥1 of: rash, lymphadenopathy, hepatosplenomegaly, serositis. MAS should be suspected when ferritin rises rapidly, platelets fall, or fibrinogen drops in any sJIA patient — it is a medical emergency.',
    table: [
      ['MAS Early Warning Signs (2016 classification criteria)','Threshold'],
      ['Ferritin','>684 ng/mL (in context of sJIA; watch trend)'],
      ['Platelet count (falling)','<181 × 10⁹/L'],
      ['AST (rising)','>48 U/L'],
      ['Triglycerides (rising)','>156 mg/dL'],
      ['Fibrinogen (falling)','<360 mg/dL'],
      ['Ferritin trend','Rising rapidly in known sJIA patient = emergency regardless of absolute value']
    ],
    refs: ['Ravelli A et al. 2016 Classification Criteria for Macrophage Activation Syndrome Complicating Systemic Juvenile Idiopathic Arthritis. Ann Rheum Dis. 2016;75:481–489.']
  },
  framework: {
    title: 'Diagnostic Framework — Fever + Arthritis in a Child',
    body: 'Fever + arthritis + rash in a child is a diagnostic emergency — the differential includes conditions with very different urgency levels. The quotidian fever pattern is the single feature that most efficiently narrows to sJIA.',
    table: [
      ['Diagnosis','Fever pattern','Key distinguishing feature'],
      ['Septic arthritis','Persistent, high','Single joint, very unwell, no rash'],
      ['Systemic JIA (sJIA)','Quotidian — spikes afternoon, resolves overnight','Salmon evanescent rash; multi-joint; ferritin very high'],
      ['Acute leukemia','Persistent or irregular','Bone pain, blast cells on CBC, BM required to exclude'],
      ['Viral arthritis','With viral illness','Self-limited, preceding URI/viral prodrome'],
      ['Reactive arthritis','After infection (1–4 weeks)','Preceding GI/GU infection; HLA-B27'],
      ['Lyme arthritis','Intermittent, large joint','Tick exposure, EM rash history, Lyme serology']
    ],
    refs: ['Petty RE et al. Revision of the proposed classification criteria for juvenile idiopathic arthritis. J Rheumatol. 2004;31:390–392.']
  },
  evidence: {
    title: 'Evidence Ratings — Management Decisions',
    table: [
      ['Decision','Evidence Level','Notes'],
      ['Rheumatology referral at day 7 of quotidian fever + joint + salmon rash','Grade B — Guideline supported','Pattern recognition at day 7; sequential approach (antibiotics first, then rheumatology) delays recognition by 1 week'],
      ['Antibiotics + cultures first, then rheumatology after cultures negative at 72h','Grade C — Acceptable but suboptimal','Infectious workup appropriate but parallel rheumatologic consideration reduces diagnostic delay'],
      ['Watchful waiting on antibiotics','Grade D — Dangerous','sJIA + evolving MAS with rising ferritin is a life-threatening emergency; every day matters']
    ]
  },
  emr: {
    title: 'EMR Lens — Recognizing sJIA and MAS Risk in Primary Care',
    body: 'sJIA requires pattern recognition across fever timing, rash, and lab trajectory. Structured EMR fields and CDS rules enable earlier referral.',
    table: [
      ['EMR Field','What to Capture','Alert Trigger'],
      ['Fever timing (structured)','Time of day fever peaks and breaks','Quotidian pattern (afternoon spike, overnight resolution) + arthritis → sJIA differential'],
      ['Rash character','Salmon-pink evanescent rash with fever','Salmon rash appearing only with fever → sJIA pathognomonic; urgent rheumatology'],
      ['Ferritin result + trend','Ferritin value + date at multiple visits','Ferritin >500 in child with fever + arthritis → sJIA/MAS alert'],
      ['Ferritin trajectory','Sequential ferritin values over days','Rising ferritin (any level) in child with sJIA → MAS alert; admit'],
      ['Platelet/fibrinogen trend','Serial CBC + coagulation in febrile child with arthritis','Falling platelets + rising ferritin → MAS emergency alert'],
      ['Bone marrow biopsy ordered','Malignancy excluded flag','Leukemia excluded before sJIA management initiated — required safety step']
    ],
    refs: ['Weiss ES et al. Interleukin-18 diagnostically distinguishes and pathogenically promotes human and murine macrophage activation syndrome. Blood. 2018;131:1442–1455.']
  }
}

}; // end MODULES


// ═══════════════════════════════════════════
// CASE DATA
// ═══════════════════════════════════════════
const CASES = {

  // ── CASE A: Sofia — Iron deficiency (NON-genetic) ──────────────────────────
  A: {
    id: 'A',
    headline: '"I\'ve been exhausted for over a year and I can\'t figure out why"',
    patient: 'Sofia, 34 &nbsp;&#183;&nbsp; Female &nbsp;&#183;&nbsp; Works full time, 2 children',
    tagline: 'A common complaint with a common answer — if you ask the right questions.',
    diagnosis: 'Iron Deficiency Anemia',
    isGenetic: false,
    visits: [
      {
        id: 'v1',
        label: 'Visit 1',
        icon: '&#128337;',
        iconClass: 'v1',
        title: 'Initial Presentation',
        sub: 'Sofia presents to your clinic for the first time.',
        snapshot: 'Sofia is a 34-year-old woman who works full time as a teacher and has two children ages 3 and 6. She reports feeling exhausted "all the time" for the past 14 months. She wakes up tired even after 8 hours of sleep. She also mentions occasional headaches and difficulty concentrating at work. She attributes it to being a working mom but her husband pushed her to come in.',
        vitals: [{t:'BP 112/70',f:false},{t:'HR 88',f:false},{t:'BMI 23',f:false},{t:'Temp 98.4',f:false}],
        questions: [
          { id:'A-v1-q1', prompt:'What is your initial differential for chronic fatigue in a 34-year-old woman? List your top diagnoses and briefly explain what makes each plausible here.', placeholder:'Consider the demographics, lifestyle, duration, and associated symptoms. Be broad — what common and less common conditions should be on your list?' },
          { id:'A-v1-q2', prompt:'What specific additional history would you gather right now — and what are you hoping to find or exclude with each question?', placeholder:'Think about what would most change your differential. What questions would move a diagnosis up or down your list?' }
        ],
        nextFinding: 'Sofia reports her periods have been heavier than usual for the past year since switching her IUD. She eats meat occasionally but mostly a plant-based diet. She has no family history of thyroid disease or autoimmune conditions. She has not had bloodwork in 3 years.',
        nextFindingLabel: 'What the history reveals',
        feedback: [
          { icon:'&#128269;', text:'<strong>Heavy menstrual bleeding + dietary iron restriction</strong> are the two most common causes of iron deficiency in women of reproductive age. Together, they are additive. Did you ask about both?' },
          { icon:'&#9203;', text:'<strong>Duration matters:</strong> 14 months of progressive fatigue is rarely stress alone. Functional causes are possible, but an organic workup should precede that diagnosis.' },
          { icon:'&#128203;', text:'<strong>No bloodwork in 3 years</strong> in a symptomatic patient means the answer may already be visible in basic labs. A CBC with differential is the most efficient first move here.' }
        ]
      },
      {
        id: 'v2',
        label: 'Visit 2',
        icon: '&#128202;',
        iconClass: 'v2',
        title: 'Labs Return',
        sub: 'Results from the CBC and metabolic panel you ordered.',
        snapshot: 'CBC results: Hgb 9.8 g/dL (low), MCV 71 fL (low — microcytic), MCH low. Ferritin 6 ng/mL (severely low). TIBC elevated. TSH normal. CMP normal. Peripheral smear: hypochromic microcytic red cells.',
        vitals: [{t:'Hgb 9.8 &#8595;',f:true},{t:'MCV 71 &#8595;',f:true},{t:'Ferritin 6 &#8595;&#8595;',f:true},{t:'TSH normal',f:false},{t:'CMP normal',f:false}],
        questions: [
          { id:'A-v2-q1', prompt:'These labs narrow the picture significantly. What is your leading diagnosis now, and what does the pattern of findings tell you about the likely cause?', placeholder:'Consider the combination of low Hgb, low MCV, and very low ferritin together. What does this pattern indicate, and what is the most likely underlying reason in this patient?' },
          { id:'A-v2-q2', prompt:'What additional workup, if any, would you order — and what would prompt you to investigate further beyond a straightforward explanation?', placeholder:'When would you stop here and treat, versus when would you want to look deeper? What findings would make you consider something beyond the obvious?' }
        ],
        nextFinding: 'Celiac serology (tTG-IgA) returns negative. Colonoscopy not indicated at this age without red flags. The pattern is consistent with iron deficiency from combined dietary insufficiency and heavy menstrual loss.',
        nextFindingLabel: 'Additional workup results',
        feedback: [
          { icon:'&#128269;', text:'<strong>Microcytic hypochromic anemia + low ferritin + elevated TIBC</strong> is the classic triad of iron deficiency. This is not ambiguous — the pattern is highly specific.' },
          { icon:'&#9888;', text:'<strong>Always identify the source:</strong> Iron deficiency in a premenopausal woman is common, but the underlying cause (menstrual loss, dietary, malabsorption) should always be named, not assumed.' },
          { icon:'&#128203;', text:'<strong>No genetic testing indicated here.</strong> This is a nutritional and gynecologic problem. The pattern does not support a hereditary hemolytic anemia or other genetic cause.' }
        ]
      },
      {
        id: 'v3',
        label: 'Decision',
        icon: '&#128250;',
        iconClass: 'v3',
        title: 'Management Decision',
        sub: 'You have the diagnosis. What do you do now?',
        decisionPrompt: 'Sofia has iron deficiency anemia from combined menstrual loss and dietary insufficiency. She wants to know: "Is this serious? What do I do? Could it be anything genetic?"',
        choices: [
          { text: 'Start oral iron supplementation, address menstrual blood loss with gynecology referral, dietary counseling on iron-rich foods. No genetic testing needed. Follow up in 6–8 weeks with repeat CBC.', outcome: 'good' },
          { text: 'Start iron supplementation and order a genetic panel to rule out hereditary anemia syndromes given the severity.', outcome: 'partial' },
          { text: 'Reassure Sofia this is stress-related and recommend lifestyle changes. Recheck labs in 6 months.', outcome: 'bad' }
        ],
        outcomes: {
          good: 'Correct and complete. You addressed all three components: the anemia itself (iron replacement), the ongoing blood loss (gynecology), and the dietary contribution. Follow-up in 6–8 weeks confirms the diagnosis is reversible and there is no indication for genetic testing. Sofia\'s fatigue resolves over 3 months.',
          partial: 'The iron supplementation is appropriate, but genetic testing is not indicated here. The clinical picture is fully explained by menstrual blood loss and dietary insufficiency — ordering a hereditary panel adds cost, potential anxiety, and possibly incidental variants of uncertain significance without changing management.',
          bad: 'This is a missed diagnosis with real harm. A hemoglobin of 9.8 with severe ferritin depletion is not stress. Sofia\'s symptoms will worsen without treatment, and the underlying menstrual blood loss will continue unaddressed. Labeling a symptomatic patient with severe anemia as "stress" delays appropriate care by months to years.'
        },
        keyFindings: [
          'Heavy menstrual bleeding + plant-based diet = combined iron loss. Both needed to be named.',
          'Microcytic anemia + ferritin 6 = iron deficiency. No genetic workup indicated.',
          'Addressing the source matters as much as replacing the iron.'
        ],
        diagnosis: 'Iron Deficiency Anemia',
        diagnosisText: 'A nutritional and gynecologic problem, fully reversible with oral iron and management of menstrual blood loss. This case was designed to demonstrate that the most common diagnosis is still the correct one — and that ordering genetic testing without a plausible genetic pattern adds harm without benefit.',
        genaText: 'In this case, GENA Screen would not be indicated. The clinical picture — microcytic anemia, low ferritin, heavy menstrual bleeding, dietary history — fully supports a non-genetic etiology. Applying genetic decision support here would represent inappropriate use. Recognizing when <em>not</em> to use a tool is as important as knowing when to use it.',
        reflection: [
          { icon:'&#128269;', q:'<strong>The diagnostic anchor:</strong> Did you consider iron deficiency at Visit 1, or did you chase other diagnoses first? What would have made you think of it earlier?' },
          { icon:'&#9888;', q:'<strong>The genetic testing question:</strong> Sofia asked if it could be genetic. How do you explain to a patient — without dismissing their concern — that genetic testing is not appropriate here?' },
          { icon:'&#128203;', q:'<strong>The source:</strong> Iron deficiency always has a source. What are the three most common causes in a premenopausal woman, and which would you investigate if oral iron failed to correct the anemia?' }
        ]
      }
    ]
  },

  // ── CASE B: Marcus — Fabry Disease (GENETIC, missed for 14 years avg) ──────
  B: {
    id: 'B',
    headline: '"I\'m exhausted all the time — it\'s been going on for years"',
    patient: 'Marcus, 41 &nbsp;&#183;&nbsp; Male &nbsp;&#183;&nbsp; Office work, sedentary lifestyle',
    tagline: 'Same complaint as the last patient. Different details. Different answer.',
    diagnosis: 'Fabry Disease (GLA gene, X-linked)',
    isGenetic: true,
    visits: [
      {
        id: 'v1',
        label: 'Visit 1',
        icon: '&#128337;',
        iconClass: 'v1',
        title: 'Initial Presentation',
        sub: 'Marcus presents reporting years of unexplained fatigue.',
        snapshot: 'Marcus is a 41-year-old man who works in finance. He reports fatigue for "at least 5 years." He has been told it is stress and depression. He tried an antidepressant for 6 months with no improvement. He also mentions episodes of burning pain in his hands and feet — especially in heat or after exercise — which he has had since his twenties. He also notes he sweats very little compared to others.',
        vitals: [{t:'BP 148/92 &#8593;',f:true},{t:'HR 78',f:false},{t:'BMI 26',f:false},{t:'Temp 98.6',f:false}],
        questions: [
          { id:'B-v1-q1', prompt:'Marcus has the same chief complaint as the previous patient. But the details are different. What stands out to you, and how does your differential differ from the previous case?', placeholder:'What is specifically different about Marcus\'s presentation compared to a straightforward fatigue workup? What features are making you think differently?' },
          { id:'B-v1-q2', prompt:'The burning pain in hands and feet since his twenties — and the decreased sweating — what do these findings suggest to you? What would you ask about next?', placeholder:'These are not typical fatigue symptoms. What physiologic system do they implicate? What other symptoms would you look for to build a pattern?' }
        ],
        nextFinding: 'Further history: Marcus mentions his younger brother has kidney disease of unknown cause. His maternal uncle died of a heart attack at age 46. He also mentions he had a corneal opacity found on a routine eye exam years ago that was never explained. He has no urticaria, no joint swelling, no lymphadenopathy.',
        nextFindingLabel: 'Deeper history reveals',
        feedback: [
          { icon:'&#128269;', text:'<strong>Neuropathic pain in the extremities since adolescence</strong> is not a feature of depression or stress-related fatigue. It should immediately broaden the differential toward neurologic or metabolic etiologies.' },
          { icon:'&#9203;', text:'<strong>Decreased sweating (hypohidrosis)</strong> is a sign of autonomic dysfunction — a feature of several multisystem genetic disorders. Combined with acroparesthesias, it points toward a small fiber neuropathy pattern.' },
          { icon:'&#128203;', text:'<strong>Family history is the key unlock here:</strong> Unexplained kidney disease in a brother, early cardiovascular death in a maternal uncle, and unexplained corneal opacity together form a pattern that demands a unifying diagnosis.' }
        ]
      },
      {
        id: 'v2',
        label: 'Visit 2',
        icon: '&#128202;',
        iconClass: 'v2',
        title: 'Workup Returns',
        sub: 'Results from labs and specialist notes.',
        snapshot: 'CBC: normal. CMP: Creatinine 1.6 (mildly elevated), eGFR 58 (Stage 3a CKD). Urinalysis: protein 2+. Echo: mild LVH. Skin biopsy arranged by dermatology: small angiofibromas noted on trunk (angiokeratomas). Ophthalmology note: cornea verticillata confirmed.',
        vitals: [{t:'Creatinine 1.6 &#8593;',f:true},{t:'eGFR 58 &#8595;',f:true},{t:'Protein 2+',f:true},{t:'LVH on Echo',f:true},{t:'CBC normal',f:false}],
        questions: [
          { id:'B-v2-q1', prompt:'You now have: CKD with proteinuria, LVH, angiokeratomas on trunk, cornea verticillata, acroparesthesias since adolescence, hypohidrosis, and a family history of early cardiovascular death and unexplained kidney disease. What is your leading diagnosis?', placeholder:'What single diagnosis best unifies all of these findings across multiple organ systems? What is the mechanism that connects the kidneys, heart, skin, eyes, and nerves?' },
          { id:'B-v2-q2', prompt:'If your leading diagnosis is correct, what is the most important next step — and what does it mean for Marcus\'s family members?', placeholder:'Think about confirmatory testing, urgency of specialist referral, and the family implications of your diagnosis.' }
        ],
        nextFinding: 'Alpha-galactosidase A enzyme activity assay returns markedly reduced. GLA gene sequencing confirms a pathogenic variant. Diagnosis of Fabry disease confirmed.',
        nextFindingLabel: 'Confirmatory testing',
        feedback: [
          { icon:'&#9733;', text:'<strong>Fabry disease</strong> is an X-linked lysosomal storage disorder caused by GLA gene mutations leading to alpha-galactosidase A deficiency. It is one of the most commonly missed genetic diagnoses in adults — average delay to diagnosis is 14 years.' },
          { icon:'&#128269;', text:'<strong>The constellation:</strong> Acroparesthesias + hypohidrosis + angiokeratomas + cornea verticillata + CKD + LVH in a male with family history of early cardiovascular death and kidney disease is Fabry disease until proven otherwise.' },
          { icon:'&#9203;', text:'<strong>Family screening is mandatory:</strong> Fabry disease is X-linked. Marcus\'s mother is an obligate carrier. His brother with kidney disease likely has it. His sisters may be carriers. Genetic counseling and family cascade testing must be initiated.' }
        ]
      },
      {
        id: 'v3',
        label: 'Decision',
        icon: '&#128250;',
        iconClass: 'v3',
        title: 'Management Decision',
        sub: 'Fabry disease is confirmed. What happens next?',
        decisionPrompt: 'Marcus has confirmed Fabry disease with multiorgan involvement — kidney (CKD Stage 3a), cardiac (LVH), neurologic (acroparesthesias), and skin/eye findings. He asks: "Is this serious? My brother has bad kidneys — could he have this too?"',
        choices: [
          { text: 'Refer urgently to metabolic/genetics for enzyme replacement therapy (ERT) evaluation. Refer nephrology, cardiology. Initiate family cascade screening — contact his brother and notify his mother. Counsel Marcus on disease trajectory and available treatments.', outcome: 'good' },
          { text: 'Start Marcus on ERT immediately and schedule follow-up in 3 months. No need to involve family at this stage.', outcome: 'partial' },
          { text: 'Monitor Marcus\'s kidney function and echo annually. Fabry disease is rare and the family history may be coincidental. Revisit if he worsens.', outcome: 'bad' }
        ],
        outcomes: {
          good: 'Excellent. You recognized that Fabry disease requires urgent multidisciplinary management and that family screening is not optional — it is a medical and ethical imperative. Marcus\'s brother is tested and found to have Fabry disease at an earlier, more treatable stage. ERT stabilizes Marcus\'s kidney function. This is the difference early diagnosis makes.',
          partial: 'ERT is appropriate but cannot be initiated without metabolic specialist involvement — dosing, monitoring, and infusion protocols require specialist oversight. More critically, failing to screen the family immediately means Marcus\'s brother continues to deteriorate without treatment. Family cascade testing is the most urgent action after diagnosis.',
          bad: 'This approach misses treatable disease progression in Marcus and diagnostic opportunities in multiple family members. CKD Stage 3a will progress to dialysis without ERT. LVH will worsen. And Marcus\'s brother — who very likely has the same condition — will not be diagnosed. Watchful waiting is not appropriate management for confirmed Fabry disease.'
        },
        keyFindings: [
          'Acroparesthesias + hypohidrosis since adolescence: the clue that was present for 20 years.',
          'Multiorgan pattern (kidney + heart + skin + eye + neuro) demands a unifying diagnosis.',
          'Family history of unexplained CKD and early cardiovascular death is a red flag that was actionable at Visit 1.',
          'Average Fabry diagnosis delay: 14 years. The features were present at every prior visit.'
        ],
        diagnosis: 'Fabry Disease (GLA gene, X-linked lysosomal storage disorder)',
        diagnosisText: 'Fabry disease affects 1 in 40,000 males and is one of the most commonly missed diagnoses in primary care. Enzyme replacement therapy (ERT) can stabilize kidney function, reduce cardiac hypertrophy, and improve neuropathic pain — but only if started before irreversible organ damage occurs. The features that identified this diagnosis were present for over two decades.',
        genaText: 'GENA Screen, when given Marcus\'s constellation — acroparesthesias since adolescence, hypohidrosis, angiokeratomas, cornea verticillata, CKD with proteinuria, LVH, family history of early cardiovascular death and unexplained kidney disease — returns Fabry disease as the top-ranked pre-diagnostic finding with a recommendation for alpha-galactosidase A enzyme activity assay and GLA gene sequencing. This is exactly the use case GENA is designed for: a multisystem pattern in a patient who has been seen many times without the picture being assembled.',
        reflection: [
          { icon:'&#9203;', q:'<strong>The 20-year delay:</strong> Marcus had acroparesthesias since his twenties. He was 41 at diagnosis. What would it have taken to catch this at age 25? What questions were never asked?' },
          { icon:'&#128101;', q:'<strong>Family cascade testing:</strong> When you confirm a genetic diagnosis, you implicitly have information about people who are not your patient. How do you approach the ethical obligation to notify family members?' },
          { icon:'&#9733;', q:'<strong>Compare to Case 01:</strong> Both Sofia and Marcus presented with chronic fatigue. What were the specific features in Marcus\'s history that should have told you this was different from the first visit — before any labs?' }
        ]
      }
    ]
  },

  // ── CASE C: Liam — XLA (GENETIC, bacterial-only infections) ───────────────
  C: {
    id: 'C',
    headline: '"He just keeps getting sick &#8212; third time this year"',
    patient: 'Liam, 5 &nbsp;&#183;&nbsp; Male &nbsp;&#183;&nbsp; Attends daycare',
    tagline: 'Third pneumonia. Parents think it\'s daycare. Is it?',
    diagnosis: 'X-linked Agammaglobulinemia (XLA, BTK gene)',
    isGenetic: true,
    visits: [
      {
        id: 'v1',
        label: 'Visit 1',
        icon: '&#128337;',
        iconClass: 'v1',
        title: 'Initial Presentation',
        sub: 'Liam\'s parents bring him in for his third serious infection.',
        snapshot: 'Liam is a 5-year-old boy presenting with his third episode of pneumonia in 18 months. He was previously healthy until age 18 months (when maternal antibodies waned). This episode is right lower lobe consolidation on CXR. He also had two prior pneumococcal pneumonias confirmed by culture. He is currently on amoxicillin with improvement. He attends a large daycare center.',
        vitals: [{t:'Temp 38.2',f:true},{t:'RR 24 &#8593;',f:true},{t:'O2 96%',f:false},{t:'HR 110',f:false},{t:'WBC 14.2',f:false}],
        questions: [
          { id:'C-v1-q1', prompt:'Three serious infections in 18 months in a 5-year-old. Before you attribute this to daycare exposure, what specific questions about the infections themselves would change your thinking?', placeholder:'Think about the TYPE of organisms, the SEVERITY, the SITES affected, and the TIMING. Not all recurrent infections are created equal. What pattern would concern you versus reassure you?' },
          { id:'C-v1-q2', prompt:'What would you ask about the family history — and specifically, what family history finding would be most alarming here?', placeholder:'Think about inheritance patterns. What specific information about male relatives would be particularly important in a 5-year-old boy with recurrent serious infections?' }
        ],
        nextFinding: 'All three infections have been bacterial (pneumococcal pneumonia x2, Haemophilus influenzae pneumonia x1). No viral or fungal infections. No thrush, no unusual skin infections. His maternal uncle died of a "chest infection" at age 8 in another country. Liam has had no serious infections with viruses — his colds resolve normally.',
        nextFindingLabel: 'Critical history emerges',
        feedback: [
          { icon:'&#9733;', text:'<strong>Bacterial-only infections</strong> are the key discriminating feature. Children in daycare get viral URIs constantly — but recurrent serious bacterial infections (pneumonia, sepsis, meningitis) affecting the same sites suggest a specific immune defect in antibody-mediated (humoral) immunity.' },
          { icon:'&#128269;', text:'<strong>Timing of onset at 18 months</strong> is critical. Maternal IgG crosses the placenta and protects infants for the first 6–18 months. A child who was well until 18 months and then began getting serious bacterial infections has lost maternal antibody protection — and may not be making their own.' },
          { icon:'&#9888;', text:'<strong>A male relative who died of a "chest infection" in childhood</strong> in the maternal line is the single most alarming family history finding for X-linked agammaglobulinemia.' }
        ]
      },
      {
        id: 'v2',
        label: 'Visit 2',
        icon: '&#128202;',
        iconClass: 'v2',
        title: 'Immunology Workup',
        sub: 'Results from the immune evaluation you ordered.',
        snapshot: 'Serum immunoglobulins: IgG <200 mg/dL (severely low; normal >700), IgA undetectable, IgM undetectable. Flow cytometry: B cells absent (0%). T cells and NK cells normal. BTK gene sequencing: pathogenic hemizygous variant in BTK gene confirmed.',
        vitals: [{t:'IgG <200 &#8595;&#8595;',f:true},{t:'IgA undetectable',f:true},{t:'IgM undetectable',f:true},{t:'B cells 0%',f:true},{t:'T cells normal',f:false}],
        questions: [
          { id:'C-v2-q1', prompt:'Absent B cells, undetectable immunoglobulins, and a BTK gene mutation. The diagnosis is confirmed. What does this mean for Liam\'s immediate management and his long-term trajectory?', placeholder:'Think about what Liam needs now (treatment), what will happen if untreated, and what this diagnosis means for how he lives going forward.' },
          { id:'C-v2-q2', prompt:'What does this diagnosis mean for the rest of Liam\'s family — specifically his mother, his maternal aunts, and any male cousins?', placeholder:'Consider the inheritance pattern. Who is at risk? Who should be screened? What would you tell his mother today?' }
        ],
        nextFinding: 'Liam is started on intravenous immunoglobulin (IVIG) replacement every 3–4 weeks. Within 6 months he has had no further serious infections. His mother is found to be a carrier of the BTK mutation. Her brother (Liam\'s maternal uncle) died of the same condition undiagnosed.',
        nextFindingLabel: 'Treatment response and family findings',
        feedback: [
          { icon:'&#9733;', text:'<strong>XLA (X-linked Agammaglobulinemia)</strong> is caused by BTK gene mutations that arrest B cell development. Affected males have absent B cells and cannot produce any immunoglobulins. IVIG replacement is lifesaving and highly effective when started early.' },
          { icon:'&#128101;', text:'<strong>The maternal uncle who died of a "chest infection" at age 8</strong> almost certainly had XLA that was never diagnosed. This is the typical pre-IVIG era outcome. Liam\'s diagnosis potentially saves his cousins.' },
          { icon:'&#9203;', text:'<strong>The discriminating question</strong> that most clinicians don\'t ask: "Have all the infections been bacterial?" Recurrent bacterial-only infections in a male child = humoral immune defect until proven otherwise.' }
        ]
      },
      {
        id: 'v3',
        label: 'Decision',
        icon: '&#128250;',
        iconClass: 'v3',
        title: 'Management Decision',
        sub: 'What should have happened earlier — and what happens now?',
        decisionPrompt: 'Looking back: Liam had his first serious bacterial infection at 18 months, then again at age 3, and now at age 5. He is in front of you for the third time. At what point should his workup have escalated to immune evaluation?',
        choices: [
          { text: 'The second serious bacterial infection (age 3) should have triggered immunology referral. Two episodes of serious bacterial infection in the same child — especially pneumonia caused by encapsulated organisms — warrants immune evaluation before a third occurs.', outcome: 'good' },
          { text: 'The third infection (now) is appropriate — three infections is the standard threshold before immune workup.', outcome: 'partial' },
          { text: 'Daycare exposure adequately explains three infections in 5 years. No immune workup needed unless he continues getting sick after starting school.', outcome: 'bad' }
        ],
        outcomes: {
          good: 'Correct. The "three infection" threshold is a guideline, not a rule — and it does not account for the type or severity of infections. Two serious bacterial pneumonias caused by encapsulated organisms in a young male child should trigger immune evaluation after the second episode. An earlier diagnosis means earlier IVIG, fewer hospitalizations, and no third pneumonia.',
          partial: 'Understandable, but the "rule of three" is a low bar for serious infections. The type of infection matters enormously — three viral URIs is different from three bacterial pneumonias. The pattern was actionable at infection two.',
          bad: 'Daycare exposure explains viral URIs — it does not explain recurrent serious bacterial pneumonias caused by encapsulated organisms in a child who has never had a serious viral illness. The key discriminating question — "what type of organisms?" — was never asked. Liam would have continued to deteriorate toward a potentially fatal infection.'
        },
        keyFindings: [
          'Bacterial-only infections (no serious viral illness): the single most important discriminating feature.',
          'Onset at 18 months when maternal antibodies wane: the timing of XLA presentation.',
          'Male child + maternal family history of early death from infection: X-linked inheritance pattern.',
          'The "rule of three" does not apply to serious encapsulated bacterial pneumonias — two is enough.'
        ],
        diagnosis: 'X-linked Agammaglobulinemia (XLA, BTK gene)',
        diagnosisText: 'XLA affects approximately 1 in 200,000 males. IVIG replacement therapy is highly effective and allows near-normal life expectancy. Without it, affected males die of overwhelming bacterial infection in childhood or early adulthood. The features that identify this diagnosis — bacterial-only infections, onset at 18 months, male sex, maternal family history — are present at the first serious infection.',
        genaText: 'GENA Screen, when given the pattern of recurrent serious bacterial-only infections beginning at 18 months in a male child with absent B cells and family history of a male relative dying of infection in childhood, identifies X-linked Agammaglobulinemia as the top pre-diagnostic finding and recommends BTK gene sequencing alongside serum immunoglobulins and lymphocyte subset panel.',
        reflection: [
          { icon:'&#128269;', q:'<strong>The discriminating question:</strong> "What type of organisms caused the infections?" is the single question that separates normal daycare illness from immunodeficiency. When did you think to ask it — and would you ask it routinely after a second serious infection?' },
          { icon:'&#9203;', q:'<strong>The maternal uncle:</strong> He died of a "chest infection" at age 8. How do you take a family history that catches information like this — and how does the death of a male relative in another country get factored into your clinical reasoning?' },
          { icon:'&#128101;', q:'<strong>Compare to Case 04:</strong> The next patient has a nearly identical presentation. What will you look for differently?' }
        ]
      }
    ]
  },

  // ── CASE D: Noah — Normal child in daycare (NON-genetic) ──────────────────
  D: {
    id: 'D',
    headline: '"He keeps getting sick &#8212; we\'ve been to urgent care three times"',
    patient: 'Noah, 4 &nbsp;&#183;&nbsp; Male &nbsp;&#183;&nbsp; Attends daycare',
    tagline: 'Same story as the last patient. Read the details carefully.',
    diagnosis: 'Normal immune response — recurrent viral URIs in a daycare child',
    isGenetic: false,
    visits: [
      {
        id: 'v1',
        label: 'Visit 1',
        icon: '&#128337;',
        iconClass: 'v1',
        title: 'Initial Presentation',
        sub: 'Noah\'s parents are worried — this seems like a lot of illness.',
        snapshot: 'Noah is a 4-year-old boy who has been to urgent care three times in the past 12 months. His parents are concerned he gets sick "constantly." Review of his urgent care records: two episodes of viral upper respiratory infections treated with supportive care, one episode of otitis media treated with amoxicillin. He is well between episodes. He has never been hospitalized. He attends a large daycare center with 40+ children.',
        vitals: [{t:'Temp 98.6',f:false},{t:'RR 18',f:false},{t:'O2 99%',f:false},{t:'HR 88',f:false},{t:'Well-appearing',f:false}],
        questions: [
          { id:'D-v1-q1', prompt:'Before you do anything else — what specific details about these three infections tell you whether this is a normal pattern or a concerning one?', placeholder:'Look carefully at the types of infections, the organisms (if known), the severity, and how Noah does between episodes. What is the same as Case 03 — and what is different?' },
          { id:'D-v1-q2', prompt:'What would you ask the family that would either reassure you or raise your level of concern?', placeholder:'Think about family history, the pattern of illness, developmental milestones, vaccination status, and whether there is anything about these infections that doesn\'t fit a normal picture.' }
        ],
        nextFinding: 'All three episodes were viral or caused by common bacteria (one otitis media, two viral URIs). Noah has also had four colds this year that resolved without medical care. He has had no pneumonias, no serious bacterial infections. He is growing normally, hitting all developmental milestones, and is fully vaccinated. No family history of early death or immune deficiency. His older sister (age 7, same daycare) gets sick at the same rate.',
        nextFindingLabel: 'History clarified',
        feedback: [
          { icon:'&#9989;', text:'<strong>6–8 respiratory infections per year is normal for a child in daycare or preschool.</strong> The immune system is actively learning. This is physiologic, not pathologic.' },
          { icon:'&#128269;', text:'<strong>The critical difference from the previous case:</strong> Noah\'s infections are viral and one bacterial otitis media — not recurrent serious bacterial pneumonias from encapsulated organisms. Severity and type matter more than count.' },
          { icon:'&#9888;', text:'<strong>A sibling in the same environment with the same infection rate</strong> is strong evidence for an environmental explanation rather than a host immune defect.' }
        ]
      },
      {
        id: 'v2',
        label: 'Visit 2',
        icon: '&#128202;',
        iconClass: 'v2',
        title: 'Parent Concern Escalates',
        sub: 'Noah\'s parents return requesting "immune testing."',
        snapshot: 'Noah\'s parents have read about immune deficiency online and are requesting blood tests to "rule it out." Noah has had one more viral URI since the last visit. He is currently well. His growth curve is tracking at the 55th percentile. He is meeting all developmental milestones. His vaccinations are up to date. Physical exam: normal lymph nodes, normal tonsils, no hepatosplenomegaly.',
        vitals: [{t:'Growth 55th %ile',f:false},{t:'Normal exam',f:false},{t:'Fully vaccinated',f:false},{t:'Well between episodes',f:false}],
        questions: [
          { id:'D-v2-q1', prompt:'Noah\'s parents are anxious and requesting immune testing. What is your clinical assessment — and is immune testing indicated here?', placeholder:'Based on everything you know, does the clinical picture support an immune deficiency workup? What would testing show, and what would be the cost — clinical and otherwise — of ordering it?' },
          { id:'D-v2-q2', prompt:'How do you counsel Noah\'s parents in a way that validates their concern without ordering unnecessary testing?', placeholder:'Think about how to explain normal childhood illness patterns in a way that is reassuring without being dismissive. What would make them feel heard?' }
        ],
        nextFinding: 'You decide not to order immune testing. You provide anticipatory guidance about normal illness frequency in daycare, signs that would prompt reassessment (hospitalization, failure to thrive, unusual organisms, infections not responding to treatment), and a safety net follow-up plan. Over the next 12 months Noah\'s illness frequency decreases as his immune system matures.',
        nextFindingLabel: 'Your management and outcome',
        feedback: [
          { icon:'&#9989;', text:'<strong>Immune testing in a well-growing, well-developing child with viral URIs and one otitis media</strong> has a very low pre-test probability of finding pathology. A false-positive or variant of uncertain significance result creates significant anxiety and further unnecessary workup.' },
          { icon:'&#9203;', text:'<strong>Normal lymph nodes and normal tonsils</strong> are actually reassuring for immune function — XLA patients often have absent tonsils and lymph nodes because these structures require B cells to develop.' },
          { icon:'&#128203;', text:'<strong>Anticipatory guidance with a clear safety net</strong> is better medicine here than immune testing. Tell parents: if he is ever hospitalized for an infection, has a serious bacterial infection, or stops growing normally — come back immediately.' }
        ]
      },
      {
        id: 'v3',
        label: 'Decision',
        icon: '&#128250;',
        iconClass: 'v3',
        title: 'Final Decision',
        sub: 'Do you order immune testing — and what do you tell this family?',
        decisionPrompt: 'Noah is well, growing normally, and his infections are viral with one otitis media. His parents are anxious and requesting immune testing. You have just seen a case (Liam) where immune testing was absolutely warranted. How do you approach Noah?',
        choices: [
          { text: 'Reassure the family based on the clinical picture. Explain what normal daycare illness looks like. Provide anticipatory guidance and clear red flags that should prompt return. No immune testing today — the clinical picture does not support it.', outcome: 'good' },
          { text: 'Order a basic immune panel (CBC with differential, serum immunoglobulins) to reassure the family, even though the clinical picture is benign.', outcome: 'partial' },
          { text: 'Order a full immune workup including BTK gene sequencing given the previous patient you just saw had XLA.', outcome: 'bad' }
        ],
        outcomes: {
          good: 'Correct. This is a normal child. The clinical picture — viral infections, normal growth, normal exam, well between episodes, sibling with the same pattern — does not support immune evaluation. Appropriate reassurance with clear safety netting is the right management. You resisted the anchoring effect of the previous case.',
          partial: 'The basic labs are low-yield but not harmful in isolation. The risk is what you do with a slightly low immunoglobulin level (which is common in young children and usually transient) or a borderline finding — it often leads to more testing, more anxiety, and rarely changes management. The clinical picture should drive test ordering, not parental anxiety.',
          bad: 'This is diagnostic anchoring from the previous case. Noah\'s presentation is fundamentally different from Liam\'s — viral infections, not serious bacterial pneumonias; normal growth; normal family history; sibling with same pattern. Ordering BTK sequencing in a child with viral URIs and otitis media is not appropriate clinical reasoning. The features that made Liam\'s case concerning are absent here.'
        },
        keyFindings: [
          'Viral URIs and otitis media ≠ recurrent serious bacterial infections.',
          'Normal growth, normal milestones, well between episodes = reassuring.',
          'Sibling with same pattern in same environment = environmental, not host, explanation.',
          'Resisting the anchoring effect of the previous case is the core clinical reasoning skill here.'
        ],
        diagnosis: 'Normal immune development — recurrent viral URIs typical of daycare exposure',
        diagnosisText: 'This case was designed to directly follow the XLA case. Noah\'s presentation sounds similar at first glance but the details are fundamentally different. Appropriate clinical reasoning requires reading those details — not applying the previous case\'s diagnosis to this patient. The most important skill demonstrated here is knowing when a pattern does NOT support escalation.',
        genaText: 'GENA Screen is not indicated in this case. Noah\'s infections are viral with one bacterial otitis media, his growth is normal, and there is no family history of immune deficiency. Applying genetic or immune decision support here would represent a pattern mismatch. This case demonstrates that clinical decision support tools — like all diagnostic tools — are only as useful as the reasoning that decides when to use them.',
        reflection: [
          { icon:'&#128269;', q:'<strong>The anchoring effect:</strong> You just diagnosed XLA in the previous patient. How did that affect how you approached Noah? Did you catch yourself applying the previous diagnosis to this patient?' },
          { icon:'&#9888;', q:'<strong>The parent communication challenge:</strong> Noah\'s parents are anxious and want testing. You are saying no. How do you make them feel heard while still making the right clinical decision?' },
          { icon:'&#9989;', q:'<strong>The safety net:</strong> You are not ordering immune testing. But what specific findings — if they appeared at the next visit — would make you reconsider? What is your threshold?' }
        ]
      }
    ]
  }
};

// ─── RAYMOND: Iron deficiency from GI blood loss (colon cancer) ───────────
CASES['Raymond'] = {
  id:'Raymond', family:1,
  headline:'"I\'ve been tired and a bit short of breath &#8212; thought it was just getting older"',
  patient:'Raymond, 68M &nbsp;&#183;&nbsp; Retired teacher &nbsp;&#183;&nbsp; No bloodwork in 4 years',
  tagline:'Same diagnosis as Case 1A. Completely different cause. Very different urgency.',
  diagnosis:'Iron Deficiency Anemia secondary to colorectal adenocarcinoma',
  isGenetic:false,
  visits:[
    { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1',
      title:'Initial Presentation', sub:'Raymond comes in after his wife insisted.',
      snapshot:'Raymond is a 68-year-old retired teacher. Fatigue for 6 months, mild exertional dyspnea, and "some stool changes" he describes as darker than usual. He has not had a colonoscopy since age 58. He eats a mixed diet. No family history of colon cancer he is aware of. He takes no medications. He attributes everything to "getting older." He lost 8 pounds over the past 4 months without trying.',
      vitals:[{t:'BP 128/78',f:false},{t:'HR 92',f:true},{t:'BMI 24 (down from 26)',f:true},{t:'Conjunctival pallor',f:true}],
      questions:[
        { id:'Rmd-v1-q1', prompt:'Raymond has the same chief complaint as Sofia (Case 1A) — chronic fatigue. But several details are fundamentally different. What features in his presentation are red flags that change your approach immediately?', placeholder:'Compare Raymond\'s presentation to Sofia\'s. What is different — and which differences are alarming? What does unintentional weight loss in a 68-year-old mean for your differential?' },
        { id:'Rmd-v1-q2', prompt:'Raymond mentions "darker stools" and changes in bowel habits. How do these symptoms interact with his fatigue — and what is the most urgent test you need to order today?', placeholder:'Think about the connection between GI blood loss and fatigue. What does dark stool suggest? What is the immediate workup priority for a 68-year-old with these symptoms?' }
      ],
      nextFinding:'CBC: Hgb 8.2 g/dL (low), MCV 69 fL (microcytic), ferritin 4 ng/mL (critically low). Fecal occult blood test: strongly positive. Urgent colonoscopy arranged.',
      nextFindingLabel:'Labs and initial workup',
      feedback:[
        { icon:'&#9888;', text:'<strong>Iron deficiency in a post-menopausal woman or any man requires a GI source to be identified.</strong> "Common cause" thinking (dietary, menstrual) does not apply here. GI malignancy must be excluded.' },
        { icon:'&#128269;', text:'<strong>Unintentional weight loss + change in bowel habits + iron deficiency in a 68-year-old male</strong> is colorectal cancer until proven otherwise. This is not a workup that can wait.' },
        { icon:'&#9203;', text:'<strong>Compare to Sofia:</strong> Both have iron deficiency anemia with low ferritin. Sofia\'s cause was reproductive and dietary. Raymond\'s cause is occult GI bleeding — same lab pattern, completely different urgency and diagnostic pathway.' }
      ]
    },
    { id:'v2', label:'Visit 2', icon:'&#128202;', iconClass:'v2',
      title:'Colonoscopy Result', sub:'Urgent colonoscopy was performed.',
      snapshot:'Colonoscopy: 3.5 cm partially obstructing mass in the sigmoid colon. Biopsy: moderately differentiated adenocarcinoma. CT chest/abdomen/pelvis: no distant metastases. Stage IIB colorectal cancer. Surgery consult arranged.',
      vitals:[{t:'Hgb 8.2 &#8595;',f:true},{t:'Mass confirmed',f:true},{t:'No mets on CT',f:false},{t:'Surgery consult',f:false}],
      questions:[
        { id:'Rmd-v2-q1', prompt:'Raymond has Stage IIB colorectal cancer discovered through his iron deficiency workup. Had he presented 6 months earlier, what stage might this have been — and what does that tell you about the importance of not anchoring to "getting older" as an explanation for fatigue in an older adult?', placeholder:'Think about the natural history of colorectal cancer. How long was this growing? When did the blood loss begin? What would have happened if the iron deficiency was treated without identifying the source?' },
        { id:'Rmd-v2-q2', prompt:'Raymond\'s daughter asks: "Should I be tested for colon cancer? Is this genetic?" How do you counsel her — and what does the absence of a family history of colorectal cancer in Raymond\'s case tell you about her personal risk?', placeholder:'What proportion of colorectal cancer is hereditary? What screening is appropriate for a first-degree relative of someone with colorectal cancer diagnosed at 68? What syndromes cause hereditary colorectal cancer — and does Raymond\'s case suggest one?' }
      ],
      nextFinding:'Raymond undergoes sigmoid colectomy. Pathology: 3/18 lymph nodes positive — upgraded to Stage IIIB. Adjuvant chemotherapy initiated. Microsatellite instability testing: MSS (microsatellite stable) — Lynch syndrome excluded. Daughter referred for colonoscopy at 48 (10 years before Raymond\'s diagnosis age).',
      nextFindingLabel:'Surgical and genetic findings',
      feedback:[
        { icon:'&#9889;', text:'<strong>Iron deficiency anemia in a man or post-menopausal woman is a GI malignancy until proven otherwise.</strong> Treating the anemia without identifying the source is one of the most consequential delays in oncology.' },
        { icon:'&#128269;', text:'<strong>Most colorectal cancer is sporadic, not hereditary.</strong> MSI testing and Lynch syndrome evaluation are standard — but a negative result is the most common outcome. Raymond\'s daughter needs colonoscopy screening starting 10 years before his diagnosis age, not genetic testing.' },
        { icon:'&#9203;', text:'<strong>The lesson of this case:</strong> Iron deficiency looks like iron deficiency on a CBC. It does not reveal its cause. In a 68-year-old man, always find the source before treating the anemia.' }
      ]
    },
    { id:'v3', label:'Decision', icon:'&#128250;', iconClass:'v3',
      title:'The Earlier Decision', sub:'Looking back — when was this diagnosable?',
      decisionPrompt:'Raymond had dark stools for "a few months" before his fatigue became severe. His last colonoscopy was at age 58 — ten years ago. He was overdue for screening. At what point was the earlier intervention opportunity?',
      choices:[
        { text:'At his 65-year-old well visit (3 years ago), colonoscopy should have been recommended and performed. Average-risk adults should have colonoscopy at 45 and every 10 years after. Raymond was overdue and no one flagged it. Screening colonoscopy is the intervention that could have caught this as a polyp.', outcome:'good' },
        { text:'When the dark stools began — that was the moment for urgent evaluation.', outcome:'partial' },
        { text:'The presentation was appropriate — iron deficiency worked up and colonoscopy performed. The timeline was correct.', outcome:'bad' }
      ],
      outcomes:{
        good:'Correct. This is a preventable cancer story. Raymond had a colonoscopy at age 58. The guidelines recommend repeat at 68. No one tracked this. A screening colonoscopy 3 years ago would likely have found a polyp — not a cancer. Prevention and surveillance are the highest-value interventions in colorectal cancer.',
        partial:'Dark stools were an urgent signal — but by that point, cancer was already established. The earlier opportunity was the missed surveillance colonoscopy. Both are important failures in the cascade of care.',
        bad:'The workup was clinically correct once Raymond presented with symptoms, but calling the timeline "correct" misses the prevention opportunity. Stage II or III colorectal cancer that presents symptomatically represents a surveillance failure in a patient with a prior colonoscopy on record.'
      },
      keyFindings:[
        'Iron deficiency in men and post-menopausal women: always find the source.',
        'Unintentional weight loss + dark stools + iron deficiency = GI malignancy until excluded.',
        'Treating iron deficiency without colonoscopy in this patient would be a serious error.',
        'Overdue colonoscopy surveillance: the earlier prevention opportunity that was missed.',
        'Most colorectal cancer is sporadic — family members need surveillance, not genetic testing.'
      ],
      diagnosis:'Stage IIIB Colorectal Adenocarcinoma presenting as iron deficiency anemia',
      diagnosisText:'Iron deficiency anemia in an older man is a GI malignancy until proven otherwise. This case directly mirrors Case 1A (Sofia, iron deficiency from menstrual loss) to demonstrate that the same laboratory pattern demands completely different management depending on the patient\'s demographics and context. Sofia needed iron and gynecology. Raymond needed a colonoscopy immediately.',
      genaText:'GENA Screen is not the primary tool in this case — colorectal cancer diagnosis requires endoscopy, not genetic screening. However, MSI and Lynch syndrome testing are now standard after colorectal cancer diagnosis, and GENA Screen would appropriately flag Lynch syndrome evaluation based on the tumor findings. The negative MSI result appropriately excluded hereditary colorectal cancer. This case reinforces that genetic decision support follows clinical diagnosis — not the other way around.',
      reflection:[
        { icon:'&#9888;', q:'<strong>The same lab, different urgency:</strong> Sofia and Raymond both had ferritin of 4–6 and microcytic anemia. What was the single clinical feature in Raymond\'s presentation that most urgently changed the next step — and would you have identified it at the first visit?' },
        { icon:'&#9203;', q:'<strong>The surveillance failure:</strong> Raymond\'s colonoscopy lapsed by 3 years. Do you track when your patients\' preventive screenings are due — and do you have a system to flag overdue tests before symptoms develop?' },
        { icon:'&#128269;', q:'<strong>The genetic question:</strong> Raymond\'s daughter asked about genetic testing. How do you explain the difference between "sporadic colorectal cancer" and "hereditary colorectal cancer syndrome" — and what screening do you recommend for her?' }
      ]
    }
  ]
};

// ─── INJECT ALL NEW CASES ────────────────────────────────────────────────────
(function() {
  // Family 1 extra
  var f1extra = {
    D1: {
      id:'D1', family:1,
      headline:'"I gain weight no matter what I do and I\'m exhausted all the time"',
      patient:'Priya, 29F &nbsp;&#183;&nbsp; Medical student &nbsp;&#183;&nbsp; Attributes it to stress',
      tagline:'The most commonly missed endocrine diagnosis. It looks like everything else.',
      diagnosis:'Hypothyroidism (Hashimoto\'s Thyroiditis)',
      isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1',
          title:'Initial Presentation', sub:'Priya comes in between rotations.',
          snapshot:'Priya is a 29-year-old third-year medical student. She reports 18 months of progressive fatigue, weight gain of 8 pounds despite no dietary changes, cold intolerance, hair thinning at the temples, constipation, dry skin, and brain fog affecting her studying. Her periods have become irregular. She attributes everything to "medical school stress." Her mother has a thyroid condition.',
          vitals:[{t:'HR 58',f:true},{t:'Temp 97.1',f:true},{t:'BMI 24 up to 27',f:true},{t:'Dry skin',f:true}],
          questions:[
            { id:'D1-v1-q1', prompt:'Priya is a medical student who has diagnosed herself with stress. What specific symptom cluster tells you this is not stress — and what organ system deficit explains all of these findings together?', placeholder:'List the symptoms that point to a systemic cause. Which do NOT typically occur from stress? What single hormone deficiency causes fatigue, weight gain, cold intolerance, bradycardia, and constipation simultaneously?' },
            { id:'D1-v1-q2', prompt:'Heart rate 58, temperature 97.1, weight gain without dietary change, cold intolerance, constipation. What is the physiologic explanation connecting all of these — and what is the most likely underlying cause in a 29-year-old woman with a family history of thyroid disease?', placeholder:'Think about metabolic rate control. What causes this to fail in a young woman — and what is the most common cause of acquired hypothyroidism in this demographic?' }
          ],
          nextFinding:'TSH: 14.2 mIU/L (elevated). Free T4: 0.6 ng/dL (low). Anti-TPO antibodies: 480 IU/mL (markedly elevated). Diagnosis: Hashimoto\'s thyroiditis. CBC and iron studies normal.',
          nextFindingLabel:'Lab results',
          feedback:[
            { icon:'&#9889;', text:'<strong>Hashimoto\'s thyroiditis</strong> is the most common cause of hypothyroidism in developed countries — an autoimmune destruction of the thyroid. Affects women 7–10x more than men, strong familial component.' },
            { icon:'&#128269;', text:'<strong>Bradycardia + low temperature</strong> are objective signs of reduced metabolic rate. These are not features of depression or stress — they are physical examination findings that confirm a systemic cause.' },
            { icon:'&#9203;', text:'<strong>Medical students are the worst patients</strong> — they attribute everything to stress and delay care. The lesson: apply the same clinical rigor to yourself that you would apply to your patients.' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2',
          title:'Management Decision', sub:'Hashimoto\'s hypothyroidism confirmed.',
          decisionPrompt:'TSH 14.2, low T4, markedly elevated anti-TPO antibodies. Priya asks: "Is this genetic? My mom has thyroid disease. Do I need to worry about my sister? Will I need medication forever?"',
          choices:[
            { text:'Start levothyroxine at weight-appropriate dose. Explain: Hashimoto\'s has polygenic predisposition — runs in families but not a single-gene condition. Her sister should have periodic TSH checks, not genetic testing. Most patients need lifelong treatment but symptoms resolve fully. Recheck TSH in 6–8 weeks.', outcome:'good' },
            { text:'Start levothyroxine and refer to genetics for evaluation of hereditary thyroid disease.', outcome:'bad' },
            { text:'Start levothyroxine and refer to endocrinology — TSH of 14 needs specialist management.', outcome:'partial' }
          ],
          outcomes:{
            good:'Correct. Hashimoto\'s is straightforward primary care management. Levothyroxine is safe and highly effective. The genetic question: autoimmune thyroid disease has strong familial clustering, but periodic TSH for family members is the right recommendation — not genetic testing. Most patients feel dramatically better within weeks.',
            bad:'Genetics referral is not indicated for Hashimoto\'s. It is polygenic — no single gene test, no actionable genetic result. Appropriate recommendation is periodic TSH monitoring for family members.',
            partial:'Endocrinology is not required for uncomplicated Hashimoto\'s hypothyroidism in a young woman. TSH of 14 is not a thyroid emergency. This is well within primary care scope. Reserve endocrinology for complex cases: pregnancy, difficult TSH control, suspected cancer, Graves\' disease.'
          },
          keyFindings:[
            'Hashimoto\'s: most common cause of hypothyroidism, most common in young women.',
            'Bradycardia + low temp + weight gain + cold intolerance = objective signs of hypothyroidism.',
            'Anti-TPO antibodies: confirm autoimmune etiology.',
            'Family history: periodic TSH for relatives, not genetics referral.',
            'Response to levothyroxine is dramatic — validates the diagnosis retrospectively.'
          ],
          diagnosis:'Hypothyroidism secondary to Hashimoto\'s Thyroiditis',
          diagnosisText:'Hashimoto\'s thyroiditis is the most common autoimmune disorder in women. Primary care management with levothyroxine is definitive. This case shows that the same complaint (chronic fatigue) can have a different common answer — one that requires a different clinical lens than the iron deficiency in Case 1A or the rare genetic condition in Case 1B.',
          genaText:'GENA Screen is not indicated for Hashimoto\'s hypothyroidism — it is a polygenic autoimmune condition, not a single-gene genetic disorder. Periodic TSH monitoring in family members is appropriate; genetic workup is not. This reinforces when genetic clinical decision support should not be applied.',
          reflection:[
            { icon:'&#9889;', q:'<strong>The objective exam findings:</strong> Heart rate 58 and temperature 97.1 are not stress. What physical examination findings would you specifically look for when hypothyroidism is on your differential?' },
            { icon:'&#9203;', q:'<strong>Across the fatigue family:</strong> Sofia (iron deficiency), Marcus (Fabry disease), Priya (hypothyroidism), James (sleep apnea), Raymond (colon cancer). What was the single most distinguishing feature of each case at Visit 1?' },
            { icon:'&#128269;', q:'<strong>"Runs in families" vs "genetic":</strong> How do you explain the difference between hereditary predisposition and a single-gene disorder to a patient who asks about testing her sister?' }
          ]
        }
      ]
    },
    E1: {
      id:'E1', family:1,
      headline:'"I fall asleep at my desk &#8212; I sleep 8 hours but I\'m never rested"',
      patient:'James, 52M &nbsp;&#183;&nbsp; High school teacher &nbsp;&#183;&nbsp; Wife says he snores loudly',
      tagline:'The answer is in the bedroom. The labs will be normal.',
      diagnosis:'Obstructive Sleep Apnea (OSA), severe',
      isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1',
          title:'Initial Presentation', sub:'James is tired despite sleeping 8 hours every night.',
          snapshot:'James is a 52-year-old teacher with severe daytime fatigue for 2 years — falling asleep at his desk, struggling to stay awake driving, asleep watching TV within minutes. He sleeps 8 hours but wakes "unrefreshed." His wife reports loud snoring with episodes where he stops breathing and then gasps. Morning headaches 3–4 days per week. On lisinopril for hypertension. BMI 32. Neck circumference 17 inches.',
          vitals:[{t:'BP 148/88',f:true},{t:'BMI 32',f:true},{t:'Neck 17 inches',f:true},{t:'HR 78',f:false}],
          questions:[
            { id:'E1-v1-q1', prompt:'James sleeps 8 hours and wakes unrefreshed. His wife reports snoring with apneic episodes. Before ordering any labs, what is your clinical diagnosis — and how does this differ from insomnia or depression-related fatigue?', placeholder:'What specific features point toward sleep-disordered breathing? What is the significance of witnessed apneic episodes? What does unrefreshing sleep tell you about sleep architecture?' },
            { id:'E1-v1-q2', prompt:'Connect James\'s hypertension, BMI, neck circumference, morning headaches, and fatigue. What is the physiologic mechanism that links all of these?', placeholder:'What happens physiologically during repeated apneic episodes? Which organ systems are affected by nocturnal hypoxia? Why does this cause hypertension?' }
          ],
          nextFinding:'Epworth Sleepiness Scale: 18/24 (severe). CBC, TSH, CMP: all normal. Home sleep study: AHI 34 events/hour (severe OSA), minimum O2 saturation 82%.',
          nextFindingLabel:'Screening and sleep study',
          feedback:[
            { icon:'&#9889;', text:'<strong>Obstructive sleep apnea</strong> affects 25–30% of middle-aged men and is one of the most underdiagnosed conditions in primary care. The triad of snoring + witnessed apneas + daytime sleepiness is essentially diagnostic before any testing.' },
            { icon:'&#128269;', text:'<strong>Unrefreshing sleep despite adequate duration</strong> is the key discriminator from insomnia. OSA fragments sleep architecture through repeated arousals — preventing restorative slow-wave and REM sleep.' },
            { icon:'&#9203;', text:'<strong>OSA is a cardiovascular risk factor:</strong> Repeated nocturnal hypoxia triggers sympathetic activation. James\'s refractory hypertension on lisinopril may be partially OSA-driven. CPAP can lower blood pressure.' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2',
          title:'Management Decision', sub:'Severe OSA confirmed. CPAP is the answer.',
          decisionPrompt:'AHI 34, min sat 82%. James asks: "Do I really have to wear a mask? Is there anything else? My buddy says CPAP is miserable." How do you counsel him — and what critical safety issue must you address?',
          choices:[
            { text:'Recommend CPAP first-line. Discuss alternatives (oral appliance for mild-moderate, weight loss adjunct). Address driving safety directly — ESS 18 is a documented impairment risk, he should not drive until treated. Explain cardiovascular benefit. Follow up in 4–6 weeks for compliance.', outcome:'good' },
            { text:'Recommend weight loss first — OSA will improve if he loses 20 pounds. Start CPAP only if he doesn\'t lose weight in 3 months.', outcome:'bad' },
            { text:'Prescribe CPAP and refer to sleep medicine. Primary care role is complete.', outcome:'partial' }
          ],
          outcomes:{
            good:'Correct. The driving safety issue is critical and legally significant — ESS 18 is a documented driving impairment. This must be addressed directly. CPAP is the most effective treatment for severe OSA. Weight loss helps but is too slow for the immediate cardiovascular and safety risk.',
            bad:'James has severe OSA with minimum saturation 82%. Waiting 3 months for weight loss exposes him to drowsy-driving accidents and continued cardiovascular damage. Weight loss is an adjunct, not a substitute for immediate CPAP in severe OSA.',
            partial:'Sleep medicine referral is appropriate but primary care should not disengage. The driving conversation cannot wait for a specialist appointment. Blood pressure monitoring and CPAP compliance follow-up belong in primary care.'
          },
          keyFindings:[
            'Unrefreshing sleep + witnessed apneas + snoring = OSA before any testing.',
            'AHI 34 = severe. Min sat 82% = significant nocturnal hypoxia.',
            'Driving safety: ESS 18 is a legal and ethical obligation to address directly.',
            'OSA + refractory hypertension: CPAP may reduce blood pressure significantly.',
            'No genetic testing indicated — anatomic, physiologic, lifestyle-driven.'
          ],
          diagnosis:'Obstructive Sleep Apnea (OSA), severe',
          diagnosisText:'OSA is one of the most prevalent and underdiagnosed conditions in primary care. This case closes the fatigue family — five patients, five common complaints, five completely different diagnoses. Iron deficiency, Fabry disease, hypothyroidism, OSA, colon cancer. Each required a completely different diagnostic pathway from the same chief complaint.',
          genaText:'GENA Screen is not indicated for OSA. This is anatomic and physiologic — upper airway obstruction during sleep, exacerbated by BMI and neck circumference. No genetic testing is needed. This case closes the fatigue family by demonstrating that the same complaint can arise from mechanisms spanning nutritional, genetic, autoimmune, anatomic, and oncologic domains. Genetic decision support applies to only one of these five.',
          reflection:[
            { icon:'&#9889;', q:'<strong>The Epworth:</strong> Takes 2 minutes. Do you use it routinely? At what score would you order a home sleep study without asking further questions?' },
            { icon:'&#9203;', q:'<strong>The driving conversation:</strong> James has an ESS of 18 and drives to work. What is your legal and ethical obligation — and how do you have this conversation with a patient who may push back?' },
            { icon:'&#128269;', q:'<strong>The whole fatigue family:</strong> Five cases, five diagnoses. What single question asked at Visit 1 would most efficiently distinguish each case from the others?' }
          ]
        }
      ]
    }
  };
  Object.keys(f1extra).forEach(function(k){ CASES[k] = f1extra[k]; });

  // Family 2 extra + Family 3
  var newCases = {
    C2:{ id:'C2', family:2, headline:'"She keeps getting ear infections and pneumonia &#8212; it never stops"', patient:'Aisha, 8F &nbsp;&#183;&nbsp; Previously healthy until age 5', tagline:'Recurrent infections in a girl. Same complaint family. Different immune defect.', diagnosis:'Common Variable Immune Deficiency (CVID)', isGenetic:true,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Aisha has had 4 serious infections in 3 years.',
          snapshot:'Aisha, 8-year-old girl, four serious infections over three years: two pneumonias, sinusitis requiring IV antibiotics, and Giardia lasting 6 weeks. Entirely healthy until age 5. Gets more viral illnesses than classmates. No hospitalizations but comes close each time. Growth at 40th percentile, down from 60th at age 4.',
          vitals:[{t:'Growth 40th %ile &#8595;',f:true},{t:'Temp 37.1',f:false},{t:'No lymphadenopathy',f:false},{t:'Tonsils present',f:false}],
          questions:[
            { id:'C2-v1-q1', prompt:'Three things distinguish Aisha from a typical child with recurrent daycare infections. What are they — and what do each suggest about her immune system?', placeholder:'Think about age of onset, types of organisms (bacterial AND viral AND parasitic), and trajectory. What is different from XLA or a normal child?' },
            { id:'C2-v1-q2', prompt:'Aisha is female, not male. How does that change your thinking about primary immune deficiency — and what diagnoses move up or down the list?', placeholder:'X-linked conditions primarily affect males. What immune deficiencies affect both sexes? What would you expect on immunologic workup?' }
          ],
          nextFinding:'IgG 280 mg/dL (low), IgA 18 (low), IgM 45 (low). B cells present but non-functional. Vaccine titers: absent response to pneumococcal polysaccharide. No BTK mutation.',
          nextFindingLabel:'Immunology workup',
          feedback:[
            { icon:'&#9733;', text:'<strong>CVID differs from XLA:</strong> later onset (childhood–adulthood, not infancy), both sexes affected equally, B cells present but dysfunctional rather than absent.' },
            { icon:'&#128269;', text:'<strong>Mixed infections (bacterial + viral + parasitic)</strong> suggest a broader defect than XLA. Giardia is cleared by secretory IgA — its presence is a clue to IgA deficiency.' },
            { icon:'&#9203;', text:'<strong>Declining growth trajectory + recurrent infections</strong> = immune failure, not bad luck.' }
          ]
        },
        { id:'v2', label:'Visit 2', icon:'&#128202;', iconClass:'v2', title:'CVID Confirmed', sub:'Management and family implications.',
          snapshot:'SCIG started. Parents ask about screening their younger daughter (age 6, healthy).',
          vitals:[{t:'SCIG started',f:false},{t:'IgG 280 &#8595;',f:true},{t:'Vaccine titers absent',f:true}],
          questions:[
            { id:'C2-v2-q1', prompt:'CVID often has no single identifiable gene mutation. How does this change counseling compared to XLA where the BTK gene is clear?', placeholder:'What can you say about inheritance risk and family screening when the genetic basis is unclear?' },
            { id:'C2-v2-q2', prompt:'Aisha\'s younger sister is healthy at 6. Should she be tested?', placeholder:'Risk/benefit of testing a healthy child. What would testing show and what would you do with the result?' }
          ],
          nextFinding:'Aisha: no further serious infections on SCIG at 12 months. Sister: mildly low IgA, otherwise normal — monitored annually.',
          nextFindingLabel:'Outcome',
          feedback:[
            { icon:'&#9889;', text:'<strong>CVID: most common serious primary immune deficiency</strong>, 1 in 25,000. Frequently diagnosed 5–10 years after symptom onset.' },
            { icon:'&#128101;', text:'<strong>Polygenic conditions:</strong> unlike XLA\'s clear BTK test, CVID family screening involves monitoring immunoglobulins and symptoms — not a single genetic test.' },
            { icon:'&#9203;', text:'<strong>Absent post-vaccine titers</strong> is the definitive early test for humoral immune failure that was never ordered.' }
          ]
        },
        { id:'v3', label:'Decision', icon:'&#128250;', iconClass:'v3', title:'When Should This Have Been Caught?', sub:'Four infections over three years.',
          decisionPrompt:'Aisha had pneumonia at 5, second pneumonia at 6, sinusitis at 7, Giardia at 8. When should immune evaluation have started?',
          choices:[
            { text:'After the second serious infection (age 6) + declining growth. Two serious infections in a previously healthy child with a falling growth curve warrants immune evaluation.', outcome:'good' },
            { text:'After the third infection (sinusitis, age 7). Three infections is the standard threshold.', outcome:'partial' },
            { text:'Age 8 is appropriate — Giardia made this atypical enough to investigate.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. Two serious infections plus declining growth was actionable. The "rule of three" is a minimum, not a target.',
            partial:'Reasonable but not optimal. Growth trajectory + two serious infections was already sufficient at age 6.',
            bad:'Four hospitalizations-near-misses and 3 years of progressive immune failure before workup. The declining growth curve was an actionable signal at the second visit.'
          },
          keyFindings:['Late onset (age 5) distinguishes CVID from XLA (18 months).','Female sex: CVID affects both equally.','Mixed infections: broader defect than XLA.','Declining growth + recurrent infections = immune failure.','Absent vaccine responses: the early test never ordered.'],
          diagnosis:'Common Variable Immune Deficiency (CVID)',
          diagnosisText:'CVID is the most common serious primary immune deficiency requiring treatment. Average diagnostic delay: 7 years from symptom onset.',
          genaText:'GENA Screen identifies CVID from late-onset recurrent mixed infections, declining growth, female sex, and absent vaccine responses — recommending immunoglobulins, vaccine titers, and lymphocyte subset panel.',
          reflection:[
            { icon:'&#9203;', q:'<strong>CVID vs XLA:</strong> What three features clearly distinguish them — and which would you now ask about in any child with recurrent serious infections?' },
            { icon:'&#128101;', q:'<strong>The growth curve:</strong> Aisha fell from 60th to 40th percentile over 4 years. Do you plot and review growth curves at every pediatric visit?' },
            { icon:'&#9889;', q:'<strong>Vaccine responses:</strong> Simple, cheap, highly informative. When should checking post-vaccine titers be routine practice?' }
          ]
        }
      ]
    },
    D2:{ id:'D2', family:2, headline:'"Lots of sinus infections and stomach bugs &#8212; more than his friends"', patient:'Tyler, 7M &nbsp;&#183;&nbsp; Active school-age child', tagline:'Recurrent infections — but mild ones. Does this need a workup?', diagnosis:'Selective IgA Deficiency', isGenetic:true,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Tyler gets more infections than his peers.',
          snapshot:'Tyler, 7-year-old boy. 5–6 sinus infections per year requiring antibiotics, recurrent GI illness (3–4 bouts/year lasting 1–2 weeks), one pneumonia at age 5. Well between episodes. Growth 55th percentile. No hospitalizations.',
          vitals:[{t:'Growth 55th %ile',f:false},{t:'Normal exam',f:false},{t:'Well between episodes',f:false}],
          questions:[
            { id:'D2-v1-q1', prompt:'Tyler\'s infections are real but milder than previous cases. What features tell you whether this warrants immune evaluation or is within normal variation?', placeholder:'Severity, types, sites, trajectory, and function between episodes. What is the threshold separating normal from pathologic?' },
            { id:'D2-v1-q2', prompt:'Recurrent sinusitis AND recurrent GI illness together. What immunologic connection links these — and what antibody class specifically protects mucosal surfaces?', placeholder:'Which antibody protects mucosal surfaces? What happens when it is missing?' }
          ],
          nextFinding:'IgG 820 (normal), IgM 110 (normal), IgA <7 mg/dL (severely low). B cells present, vaccine responses intact for IgG antigens.',
          nextFindingLabel:'Immunology workup',
          feedback:[
            { icon:'&#9733;', text:'<strong>Selective IgA deficiency:</strong> most common primary immune deficiency, 1 in 300–500 people. Most are asymptomatic or have only mild mucosal infections.' },
            { icon:'&#128269;', text:'<strong>IgA protects mucosal surfaces</strong> — respiratory and GI tracts. Its absence predisposes specifically to sinusitis and GI infections, not serious systemic bacterial infections.' },
            { icon:'&#9888;', text:'<strong>Celiac screening trap:</strong> standard tTG-IgA is falsely negative in IgA deficiency. Always check total IgA first — then use IgG-based testing.' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2', title:'Management Decision', sub:'Selective IgA deficiency confirmed.',
          decisionPrompt:'Tyler has selective IgA deficiency. Recurrent mucosal infections but normal growth. Parents ask: "Does he need IV immunoglobulin?"',
          choices:[
            { text:'No IVIG — it contains almost no IgA and won\'t help. Can cause anaphylaxis in anti-IgA antibody-positive patients. Vaccinate against encapsulated organisms. Screen for celiac using IgG-based tests. Monitor annually.', outcome:'good' },
            { text:'Start IVIG — Tyler has a primary immune deficiency and deserves treatment.', outcome:'bad' },
            { text:'Refer to immunology and defer all decisions.', outcome:'partial' }
          ],
          outcomes:{
            good:'Correct. IVIG is not indicated and potentially harmful. Appropriate management: surveillance, vaccination, IgG-based celiac screen, education about blood product reactions.',
            bad:'IVIG contains almost no IgA and can cause anaphylaxis if anti-IgA antibodies have formed. This management decision could cause serious harm.',
            partial:'Immunology referral is reasonable but primary care can manage most cases. The celiac screen and vaccination updates should not wait.'
          },
          keyFindings:['Selective IgA deficiency: most common primary immune deficiency, often mild.','Mucosal infections (sinuses + GI) = IgA is the clue.','IVIG contraindicated — almost no IgA, anti-IgA antibody anaphylaxis risk.','Celiac disease more common in IgA deficiency — use IgG-based testing.','Most patients are asymptomatic — reassurance is often the right answer.'],
          diagnosis:'Selective IgA Deficiency',
          diagnosisText:'The most common primary immune deficiency. Majority are asymptomatic. IVIG not indicated and can cause reactions. This case demonstrates that not every immune deficiency requires aggressive intervention.',
          genaText:'GENA Screen identifies selective IgA deficiency from recurrent mucosal infections with normal growth and specifically flags the celiac screening implication and IVIG contraindication — preventing a common management error.',
          reflection:[
            { icon:'&#9889;', q:'<strong>The celiac trap:</strong> How often do you check total IgA before interpreting a negative celiac screen? When should this be routine?' },
            { icon:'&#128269;', q:'<strong>Severity spectrum:</strong> Compare Tyler to Aisha (CVID) and Liam (XLA). What features distinguish mild from serious humoral immune defects?' },
            { icon:'&#9888;', q:'<strong>The IVIG question:</strong> Tyler\'s parents read about IVIG. How do you explain why the "internet answer" is wrong for their child?' }
          ]
        }
      ]
    },
    E2:{ id:'E2', family:2, headline:'"Four chest infections this year and he never puts on weight"', patient:'Diego, 6M &nbsp;&#183;&nbsp; Hispanic family &nbsp;&#183;&nbsp; Normal newborn screen reported', tagline:'Recurrent pulmonary infections. Not an immune deficiency. Read carefully.', diagnosis:'Cystic Fibrosis (CFTR gene, autosomal recessive)', isGenetic:true,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Diego has recurrent chest infections and never gains weight.',
          snapshot:'Diego, 6-year-old boy. Four serious respiratory infections in 12 months requiring antibiotics, two needing steroids. Recurrent loose, foul-smelling, oily stools. Weight 10th percentile, height 25th. Chronic cough since infancy. Newborn screen reportedly normal.',
          vitals:[{t:'Weight 10th %ile',f:true},{t:'Chronic cough',f:true},{t:'O2 96%',f:false},{t:'Height 25th %ile',f:false}],
          questions:[
            { id:'E2-v1-q1', prompt:'Diego has recurrent pulmonary infections + failure to thrive + steatorrhea. Why does this combination point away from primary immune deficiency toward a different mechanism?', placeholder:'What connects the lungs, GI tract, and failure to thrive in a single unifying diagnosis? What secretion is abnormal in both organs?' },
            { id:'E2-v1-q2', prompt:'His parents say the newborn screen was "reportedly normal." How much reassurance does this provide — and what are the limitations of newborn screening for the condition you\'re considering?', placeholder:'What false negative rate exists for the condition you\'re thinking of? What test should you order regardless of a normal newborn screen?' }
          ],
          nextFinding:'Sweat chloride 82 mmol/L (positive; >60 diagnostic). CFTR sequencing: compound heterozygous F508del/R117H. Pancreatic elastase severely low.',
          nextFindingLabel:'Diagnostic workup',
          feedback:[
            { icon:'&#9733;', text:'<strong>The triad of recurrent pulmonary infections + steatorrhea + failure to thrive</strong> is cystic fibrosis until proven otherwise.' },
            { icon:'&#9888;', text:'<strong>Newborn screens miss CF in 5–10% of cases</strong>, particularly with rarer mutations or R117H. A "normal" screen never excludes CF when clinical suspicion exists.' },
            { icon:'&#128269;', text:'<strong>The steatorrhea distinguishes this from immune deficiency</strong> — none of the immune cases caused GI malabsorption. Oily stools + failure to thrive + pulmonary infections = exocrine pancreatic insufficiency.' }
          ]
        },
        { id:'v2', label:'Visit 2', icon:'&#128202;', iconClass:'v2', title:'CF Confirmed', sub:'Management and family counseling.',
          snapshot:'Started on Trikafta (elexacaftor/tezacaftor/ivacaftor), pancreatic enzyme replacement, fat-soluble vitamins, airway clearance. Parents ask about future children.',
          vitals:[{t:'CF confirmed',f:true},{t:'Trikafta started',f:false},{t:'Enzymes started',f:false}],
          questions:[
            { id:'E2-v2-q1', prompt:'CF is autosomal recessive. What is the risk for each future pregnancy — and how do you explain this accurately and compassionately?', placeholder:'25% recurrence risk, carrier testing, prenatal genetic diagnosis options. How do you present without being directive?' },
            { id:'E2-v2-q2', prompt:'The newborn screen was "normal." Parents are angry. How do you respond — and what systemic change does this case suggest is needed?', placeholder:'Address screening limitations honestly. What would earlier diagnosis have meant for Diego?' }
          ],
          nextFinding:'At 6 months: weight gain 2.3 kg, FEV1 improved 78% to 91%. No exacerbations on Trikafta. Both parents confirmed carriers.',
          nextFindingLabel:'Six-month follow-up',
          feedback:[
            { icon:'&#9889;', text:'<strong>Trikafta</strong> addresses underlying CFTR dysfunction — one of the most significant advances in genetic medicine. Eligible patients show dramatic improvement.' },
            { icon:'&#128101;', text:'<strong>25% risk per pregnancy</strong>: affected, 50% carrier, 25% unaffected. Prenatal genetic diagnosis and preimplantation testing are available options.' },
            { icon:'&#9203;', text:'<strong>6 years of untreated CF</strong> = irreversible lung damage. The steatorrhea and failure to thrive were present since infancy — actionable signals missed.' }
          ]
        },
        { id:'v3', label:'Decision', icon:'&#128250;', iconClass:'v3', title:'When Was This Diagnosable?', sub:'Diego had symptoms since infancy.',
          decisionPrompt:'Diego: chronic cough since infancy, failure to thrive since age 2, oily stools for years, recurrent infections since age 4. A "normal" newborn screen was documented. When was this diagnosable?',
          choices:[
            { text:'At age 2: failure to thrive + chronic cough present together. Sweat chloride should have been ordered — the combination of pulmonary + GI + growth failure is CF until proven otherwise regardless of newborn screen.', outcome:'good' },
            { text:'After the first serious pulmonary infection at age 4. Recurrent infections + failure to thrive should have triggered CF workup.', outcome:'partial' },
            { text:'The newborn screen covers CF — normal result was sufficient reassurance until the pattern became clear at age 6.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. Failure to thrive + chronic cough + steatorrhea at age 2 was a CF presentation. Sweat chloride is cheap and non-invasive. Newborn screen false negatives are documented — clinical suspicion should override a reassuring screen.',
            partial:'First infection + failure to thrive was actionable — but growth failure and oily stools were present years earlier. Earlier intervention at age 2 was the missed opportunity.',
            bad:'Newborn screening has a 5–10% false negative rate for CF. "Normal newborn screen" should never close a clinical question when the ongoing presentation suggests CF.'
          },
          keyFindings:['Recurrent pulmonary + steatorrhea + failure to thrive = CF triad.','Newborn screen false negative rate 5–10%. Never excludes CF.','Sweat chloride: gold standard, cheap, non-invasive, definitive.','Trikafta works best before irreversible lung damage.','25% recurrence risk per pregnancy.'],
          diagnosis:'Cystic Fibrosis (CFTR gene, autosomal recessive)',
          diagnosisText:'CF is the most common life-shortening autosomal recessive condition in people of Northern European descent. CFTR modulator therapy has transformed life expectancy. This case shows that the same presenting complaint (recurrent infections) can have a non-immune mechanism — CF — that is entirely different from XLA, CVID, or IgA deficiency.',
          genaText:'GENA Screen identifies CF from recurrent pulmonary infections + exocrine pancreatic insufficiency + failure to thrive and recommends sweat chloride and CFTR sequencing. This demonstrates that genetic decision support can identify non-immune genetic causes of a presentation that mimics immune deficiency.',
          reflection:[
            { icon:'&#9889;', q:'<strong>The newborn screen:</strong> When should clinical suspicion override a normal newborn screen result? What is your threshold for ordering sweat chloride despite a "normal" screen?' },
            { icon:'&#9203;', q:'<strong>The CF triad:</strong> Pulmonary + pancreatic + growth failure. Which element was present earliest in Diego? What stopped it from triggering the right workup?' },
            { icon:'&#128101;', q:'<strong>The conversation:</strong> How do you tell parents their child has had a diagnosable condition for years — and still move forward constructively?' }
          ]
        }
      ]
    },
    A3:{ id:'A3', family:3, headline:'"She\'s not walking yet &#8212; all her friends are walking"', patient:'Maya, 14 months F &nbsp;&#183;&nbsp; First child, anxious parents', tagline:'Late walker. Normal exam. What does this family need from you?', diagnosis:'Benign Motor Delay — walked independently at 17 months', isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Maya\'s parents are worried about walking.',
          snapshot:'Maya, 14-month-old girl, not yet walking independently but pulls to stand and cruises. Babbles with several words. Points, waves, good eye contact. Feeds herself. Growth 50th percentile. Normal pregnancy. No family history of delay.',
          vitals:[{t:'Growth 50th %ile',f:false},{t:'Normal tone',f:false},{t:'Eye contact good',f:false},{t:'5-6 words',f:false}],
          questions:[
            { id:'A3-v1-q1', prompt:'What specific developmental domains do you assess — and what findings in each domain would change this from low-concern to high-concern?', placeholder:'Gross motor, fine motor, language, social-emotional, cognitive. What is Maya doing well? What is lagging? Isolated vs global?' },
            { id:'A3-v1-q2', prompt:'What features of Maya\'s presentation are specifically reassuring — and what single finding would most change your concern?', placeholder:'What would you look for on neurologic exam? What is the difference between isolated late walking and a concerning developmental picture?' }
          ],
          nextFinding:'Neurologic exam: normal tone, normal DTRs, symmetrical strength, no clonus. All developmental domains age-appropriate except gross motor. Excellent social development, 5–6 words, no regression.',
          nextFindingLabel:'Developmental assessment',
          feedback:[
            { icon:'&#9989;', text:'<strong>Isolated late walking with normal neurology and normal other domains</strong> is benign in the vast majority. Normal range for walking: 9–18 months.' },
            { icon:'&#128269;', text:'<strong>Reassuring features:</strong> normal tone, normal reflexes, age-appropriate language and social development, no regression, normal growth.' },
            { icon:'&#9203;', text:'<strong>Knowing when to reassure is a clinical skill.</strong> Over-investigation of normal variation causes real harm.' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2', title:'Management Decision', sub:'What do you tell this family?',
          decisionPrompt:'Maya is 14 months, cruising, normal neurology, normal other domains. Parents ask: "Should we be worried? Does she need an MRI? A neurologist?"',
          choices:[
            { text:'Reassure: isolated late walking with normal neurology and other domains is a normal variant. Follow-up at 18 months. Safety net: not walking by 18 months or any other developmental concern = re-evaluate and refer.', outcome:'good' },
            { text:'Refer to pediatric neurology now given parental anxiety.', outcome:'partial' },
            { text:'Order brain MRI and genetics referral — developmental delay can be the first sign of a serious condition.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. Normal child with isolated late gross motor development within expected range. Appropriate response: reassurance, safety net, specific follow-up plan. Maya walks at 17 months.',
            partial:'Neurology is not necessary here. It amplifies anxiety and rarely changes management for a child with isolated late walking, normal neurology, and normal other domains.',
            bad:'MRI and genetics are not indicated. Anesthesia in toddlers carries risks, genetic panels return VUS, and the investigation medicalizes a normal variant. Clinical reasoning must precede test ordering.'
          },
          keyFindings:['Normal range for walking: 9–18 months. Maya at 14 months is within range.','Isolated delay in one domain with normal neurology = monitor, not investigate.','Global delay OR abnormal neurology OR regression = investigate urgently.','Over-investigation causes real harm: anxiety, incidental findings, procedure risk.'],
          diagnosis:'Benign Motor Delay — walked independently at 17 months',
          diagnosisText:'Most late walkers are normal children at the late end of the developmental distribution. The critical skill is distinguishing isolated late walking from a global or regressive picture. This case demonstrates that the most important action is sometimes reassurance.',
          genaText:'GENA Screen is not indicated here. Isolated gross motor delay with normal neurology and no regression does not support a genetic or metabolic etiology. The next four cases in this family will show what a concerning developmental picture actually looks like.',
          reflection:[
            { icon:'&#9989;', q:'<strong>The normal range:</strong> Upper limit for independent walking? First words? Social smiling? How confident are you in these milestones?' },
            { icon:'&#9203;', q:'<strong>Parental anxiety:</strong> Maya\'s parents wanted an MRI. How do you hold "this is normal" against "this feels wrong" — and still leave the family feeling heard?' },
            { icon:'&#128269;', q:'<strong>The safety net:</strong> "Not walking by 18 months = re-evaluate." What specifically would you do at 18 months? Tests, referrals, in what order?' }
          ]
        }
      ]
    },
    B3:{ id:'B3', family:3, headline:'"He used to say words but he\'s stopped &#8212; and doesn\'t look at us anymore"', patient:'Ethan, 18 months M &nbsp;&#183;&nbsp; Previously developing normally', tagline:'A developmental regression. Something different from the previous case.', diagnosis:'Autism Spectrum Disorder (ASD)', isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Ethan had words and lost them.',
          snapshot:'Ethan, 18-month-old boy. Had 5–6 words at 12 months, lost most over past 2–3 months. No longer responds to name consistently. Lost pointing and joint play. Lines up toy cars repeatedly. Normal motor development — walks well. Born full-term.',
          vitals:[{t:'Growth 50th %ile',f:false},{t:'Motor: normal',f:false},{t:'Language: regressed',f:true},{t:'Social: withdrawn',f:true}],
          questions:[
            { id:'B3-v1-q1', prompt:'Ethan had words and lost them. How is developmental regression different from simply being a late developer — and why does regression change urgency?', placeholder:'What does regression imply about what was already there? What conditions cause regression vs. failure to develop?' },
            { id:'B3-v1-q2', prompt:'What specific social-communication milestones are absent — and what does language regression + lost social referencing together tell you?', placeholder:'Joint attention, pointing, response to name, eye contact, reciprocal play. Which is Ethan missing? What is the significance of this combination?' }
          ],
          nextFinding:'M-CHAT-R/F: high risk. Delays in social-communication and language with repetitive behaviors. Normal gross and fine motor. Audiogram: normal. EEG: normal. Metabolic screen: normal.',
          nextFindingLabel:'Screening and workup',
          feedback:[
            { icon:'&#9889;', text:'<strong>Language regression + loss of social referencing + repetitive behaviors</strong> is the classic ASD presentation. The regression distinguishes this from a late talker.' },
            { icon:'&#128269;', text:'<strong>M-CHAT-R/F</strong> at 18 and 24 months is standard of care. High-risk screen requires immediate referral — do not wait for specialist confirmation before initiating early intervention.' },
            { icon:'&#9203;', text:'<strong>ASD is not primarily a genetic diagnosis in this context</strong> — developmental workup precedes genetic workup.' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2', title:'Management Decision', sub:'ASD suspected — what happens now?',
          decisionPrompt:'M-CHAT high risk. Regression of language and social skills, lost pointing and name response, repetitive play. What is your immediate action?',
          choices:[
            { text:'Refer IMMEDIATELY to early intervention (do not wait for diagnosis) AND developmental pediatrics simultaneously. Begin both referrals today. Also order audiogram to confirm hearing.', outcome:'good' },
            { text:'Refer to developmental pediatrics. Wait for their evaluation before starting early intervention — don\'t label without formal diagnosis.', outcome:'partial' },
            { text:'Wait and see at 24 months. Many late talkers catch up. Regression can be temporary.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct and urgent. Early intervention before age 3 is the highest-yield action — brain plasticity is greatest here. Most states allow early intervention referral based on developmental delay alone, without formal diagnosis. Both referrals simultaneously.',
            partial:'Waiting for developmental pediatrics before early intervention loses critical time. The referrals must happen in parallel.',
            bad:'Regression of previously acquired language is never watchful waiting. Every month without early intervention in the peak developmental window is lost opportunity that cannot be recovered.'
          },
          keyFindings:['Regression of acquired skills: never wait and see — immediate action.','ASD early intervention before age 3: highest-yield pediatric action.','Does not require formal diagnosis — developmental delay is sufficient for services.','Refer to early intervention AND developmental pediatrics simultaneously.','M-CHAT at 18 and 24 months: standard at every well visit.'],
          diagnosis:'Autism Spectrum Disorder (ASD)',
          diagnosisText:'ASD affects 1 in 36 US children. Primary care\'s most important role is early identification and referral. The single most impactful action is early intervention before age 3. This case shows ASD presents very differently from benign motor delay.',
          genaText:'GENA Screen is not the first step in ASD evaluation. Primary workup is developmental and behavioral. After diagnosis is confirmed, chromosomal microarray and Fragile X testing are recommended — but as a second step, not a first response.',
          reflection:[
            { icon:'&#9889;', q:'<strong>Regression vs. delay:</strong> Why does losing previously acquired skills change urgency? What conditions can cause regression in a toddler?' },
            { icon:'&#9203;', q:'<strong>The M-CHAT:</strong> Do you administer it at every 18-month and 24-month well visit? What barriers exist in primary care?' },
            { icon:'&#128269;', q:'<strong>Compare to Maya:</strong> What three specific features made Ethan clearly different — and what would Maya have needed to look like to reach the same urgency level?' }
          ]
        }
      ]
    },
    C3:{ id:'C3', family:3, headline:'"She\'s behind but she\'s such a happy baby &#8212; we\'re not too worried"', patient:'Lily, 18 months F &nbsp;&#183;&nbsp; Happy affect, no words', tagline:'The "happy baby" presentation. Don\'t let the affect mislead you.', diagnosis:'Angelman Syndrome (UBE3A gene, maternal chromosome 15)', isGenetic:true,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Lily\'s parents aren\'t worried — she seems so happy.',
          snapshot:'Lily, 18-month-old girl. Parents describe her as "the happiest baby we\'ve ever seen — always laughing." Not yet walking, no words. Frequent hand-flapping and laughing at nothing. Two seizure-like episodes. Wide-based jerky gait when attempting walking. Good eye contact but communication absent.',
          vitals:[{t:'Growth 45th %ile',f:false},{t:'No words at 18m',f:true},{t:'Seizures x2',f:true},{t:'Gait abnormal',f:true}],
          questions:[
            { id:'C3-v1-q1', prompt:'Lily\'s parents are not worried because she seems happy. How does the happy affect in a child with absent speech and seizures change — rather than reassure — your clinical concern?', placeholder:'What does pronounced happy excitable affect combined with absent language actually signify? What diagnoses are associated with this specific temperament?' },
            { id:'C3-v1-q2', prompt:'Absent speech, hypotonia, seizures, abnormal gait, happy affect, hand-flapping. What single test most efficiently confirms your leading diagnosis?', placeholder:'What genetic condition is classically associated with this exact constellation? What is the mechanism?' }
          ],
          nextFinding:'EEG: high-amplitude slow spike-wave discharges consistent with Angelman syndrome. Chromosomal microarray: deletion of maternal 15q11-q13 (UBE3A gene region). Angelman syndrome confirmed.',
          nextFindingLabel:'Genetic and EEG workup',
          feedback:[
            { icon:'&#9733;', text:'<strong>Angelman syndrome</strong> classic features: profound intellectual disability, absent speech, seizures, wide-based jerky gait, hand-flapping, and markedly happy excitable affect.' },
            { icon:'&#9889;', text:'<strong>The affect is the clue, not reassurance:</strong> Inappropriately happy affect in a child with absent speech and seizures is pathognomonic to the experienced clinician.' },
            { icon:'&#128269;', text:'<strong>Chromosomal microarray is the first test</strong>; add methylation analysis if microarray is normal (to detect UPD and imprinting defects).' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2', title:'Communication and Management', sub:'Angelman syndrome confirmed. The hardest part.',
          decisionPrompt:'Lily has Angelman syndrome. Her parents believed her happiness meant normal development. They are now in shock. What do you prioritize?',
          choices:[
            { text:'Acknowledge their experience — Lily\'s happiness is real and also a feature of her condition. Share diagnosis clearly and compassionately. Priorities: seizure management, AAC (augmentative communication), physical/OT/speech therapy, genetics for family implications, Angelman Syndrome Foundation. Schedule follow-up within one week.', outcome:'good' },
            { text:'Provide diagnosis and refer to genetics. Let specialist handle counseling.', outcome:'partial' },
            { text:'Confirm with specialist interpretation before telling parents — the microarray result needs specialist review.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. The diagnosis is clear. The family needs truth, compassion, and a clear action plan — now. Seizure management and therapy referrals cannot wait for genetics clinic availability. The primary care physician is the most trusted person in this family\'s medical life.',
            partial:'Deferring all communication to genetics is not appropriate. Lily needs seizure management now. Her parents need support now. The primary care physician has both the information and the obligation.',
            bad:'The diagnosis is confirmed. A microarray identifying maternal 15q deletion in a child with the classic Angelman phenotype is definitive. Waiting for "specialist interpretation" delays necessary treatment and leaves the family in agonizing limbo.'
          },
          keyFindings:['Happy affect + absent speech + seizures + abnormal gait = Angelman syndrome until proven otherwise.','"She seems so happy" delays diagnosis — it is a diagnostic feature, not a sign of normality.','Microarray first; add methylation analysis if normal.','Seizure management and AAC cannot wait for genetics clinic.','Average age of Angelman diagnosis: 6 years. Average onset of features: 18 months.'],
          diagnosis:'Angelman Syndrome (loss of maternal UBE3A, chromosome 15q11-q13)',
          diagnosisText:'Angelman syndrome affects 1 in 12,000–20,000. Average diagnosis age is 6 years despite features appearing at 18 months. The happy demeanor consistently reassures families and clinicians — it is the most important diagnostic trap in pediatric developmental medicine.',
          genaText:'GENA Screen identifies Angelman syndrome from absent speech, seizures, abnormal gait, hand-flapping, and inappropriate happy affect — recommending chromosomal microarray with methylation analysis. The affect itself is as diagnostically important as any clinical finding.',
          reflection:[
            { icon:'&#9889;', q:'<strong>The happy trap:</strong> How many times have you been reassured by affect rather than concerned by it? What would it take to reframe "very happy baby" as a clinical signal?' },
            { icon:'&#128269;', q:'<strong>Compare Maya, Ethan, Lily:</strong> All had developmental concerns at 14–18 months. What three features in Lily\'s presentation made this clearly the most urgent of the three?' },
            { icon:'&#9203;', q:'<strong>The conversation:</strong> How do you hold the truth ("happiness is a feature of the condition causing her disability") with compassion — without destroying that joy?' }
          ]
        }
      ]
    },
    D3:{ id:'D3', family:3, headline:'"He\'s just a slow developer &#8212; our doctor says boys are slower"', patient:'Carlos, 15 months M &nbsp;&#183;&nbsp; International adoption, no newborn screen', tagline:'Global delay. A treatable cause. Time is critical.', diagnosis:'Congenital Hypothyroidism (missed — international adoption, no newborn screen)', isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Carlos was adopted from Eastern Europe at 3 months.',
          snapshot:'Carlos, 15-month-old internationally adopted boy. Not walking, not pulling to stand, no words. Socially disengaged, rare smile, no pointing or waving. Hoarse cry, coarse facial features, large tongue, dry skin. Growth below 5th percentile for weight and height. Persistent constipation. No newborn metabolic screen in records.',
          vitals:[{t:'Growth <5th %ile',f:true},{t:'Global delay',f:true},{t:'Hoarse cry',f:true},{t:'Macroglossia',f:true}],
          questions:[
            { id:'D3-v1-q1', prompt:'Carlos has global developmental delay combined with coarse features, macroglossia, hoarse cry, and growth failure. How is this different from isolated motor delay or ASD — and what systemic condition does this combination suggest?', placeholder:'What endocrine hormone is essential for brain development in the first two years? What does its absence produce in terms of features and delay?' },
            { id:'D3-v1-q2', prompt:'Carlos has no documented newborn metabolic screen. How does this change your approach — and what is the single most important test to order today?', placeholder:'What would have been caught at birth? What can still be tested now? What is the urgency?' }
          ],
          nextFinding:'TSH: >100 mIU/L (severely elevated). Free T4: undetectable. Bone age: equivalent to 4–6 months. Thyroid ultrasound: hypoplastic thyroid. Severe congenital hypothyroidism, undetected and untreated for 15 months.',
          nextFindingLabel:'Thyroid workup',
          feedback:[
            { icon:'&#9889;', text:'<strong>Congenital hypothyroidism</strong> is the most common preventable cause of intellectual disability worldwide. Caught by newborn screening, treated within days — normal developmental outcomes. Carlos had none of that.' },
            { icon:'&#9888;', text:'<strong>The classic features</strong> — coarse facies, macroglossia, hoarse cry, constipation, dry skin, growth failure, global delay — develop over months without thyroid hormone.' },
            { icon:'&#128203;', text:'<strong>International adoption: always repeat metabolic workup.</strong> Newborn screening coverage varies widely internationally. Do not assume a foreign "normal" screen covers what US screens cover.' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2', title:'Diagnosis Confirmed — What Now?', sub:'TSH >100, undetectable T4. 15 months untreated.',
          decisionPrompt:'Carlos has severe congenital hypothyroidism, untreated for 15 months. Levothyroxine will normalize thyroid function. Parents ask: "Will he catch up? Will he be normal?"',
          choices:[
            { text:'Start levothyroxine immediately. Refer urgently to pediatric endocrinology and developmental pediatrics. Be honest: thyroid replacement will prevent further damage and may allow some catch-up, but 15 months of severe hypothyroidism during the critical brain development window will likely result in permanent intellectual disability. Early intervention is still essential.', outcome:'good' },
            { text:'Start levothyroxine and tell parents he will likely catch up fully — the brain is resilient.', outcome:'bad' },
            { text:'Refer to pediatric endocrinology before starting levothyroxine — want specialist guidance on dosing.', outcome:'partial' }
          ],
          outcomes:{
            good:'Correct. Start levothyroxine today. Be honest about prognosis: the first 2 years are the critical window for thyroid-dependent brain development. 15 months of severe hypothyroidism in that window causes irreversible damage in most cases. Some catch-up is possible with intensive intervention. Families deserve truth.',
            bad:'The brain is not resilient to 15 months of severe hypothyroidism. Thyroid hormone is essential for neuronal migration and myelination. This statement sets false expectations that will cause greater devastation later.',
            partial:'Waiting for endocrinology with TSH >100 and undetectable T4 is inappropriate. Primary care initiates levothyroxine today. Specialist referral is parallel, not prerequisite.'
          },
          keyFindings:['Congenital hypothyroidism: most common preventable cause of intellectual disability.','Classic untreated features: coarse facies, macroglossia, hoarse cry, constipation, global delay.','TSH >100 at 15 months = 15 months of severe hypothyroidism during critical brain window.','International adoption: always repeat metabolic screening.','Start levothyroxine today — every day of delay adds to neurologic burden.'],
          diagnosis:'Congenital Hypothyroidism (missed due to absent newborn screening)',
          diagnosisText:'Congenital hypothyroidism affects 1 in 2,000–3,000 newborns. With newborn screening and early treatment, affected children develop normally. Without treatment, irreversible intellectual disability occurs within the first two years. This case demonstrates what newborn screening exists to prevent.',
          genaText:'GENA Screen is not the primary tool here — congenital hypothyroidism is diagnosed with TSH and T4, not genetic testing. However, if the hypothyroidism has a genetic basis (PAX8, NKX2-1 mutations), GENA could support workup after the diagnosis is established. The primary lesson: endocrine causes of global developmental delay must be excluded before genetic evaluation.',
          reflection:[
            { icon:'&#9889;', q:'<strong>The newborn screen:</strong> What does your state\'s screen cover — and what does it miss? When should you repeat it?' },
            { icon:'&#9888;', q:'<strong>The prognosis conversation:</strong> You must tell a family their child has likely permanent disability from a preventable condition. How do you prepare?' },
            { icon:'&#128269;', q:'<strong>Compare Lily, Ethan, Carlos:</strong> All three had global or near-global delay. What specific features distinguished Carlos\'s dysmorphic presentation — and what would you check first in any internationally adopted child with delay?' }
          ]
        }
      ]
    },
    E3:{ id:'E3', family:3, headline:'"She was doing everything right &#8212; and then around her first birthday she just stopped"', patient:'Ava, 20 months F &nbsp;&#183;&nbsp; Normal development until 12 months', tagline:'Normal development. Then regression. The pattern that changes everything.', diagnosis:'Rett Syndrome (MECP2 gene, X-linked dominant, de novo)', isGenetic:true,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Ava developed normally and then regressed.',
          snapshot:'Ava, 20-month-old girl. Entirely normal development until 12 months — walked at 11 months, 8–10 words, excellent eye contact. From 13–15 months: became irritable, lost words. Now: lost purposeful hand use, repetitive hand-wringing constantly. Episodes of irregular breathing — breath-holding then rapid breathing. Absent speech but maintains some eye contact. No seizures yet.',
          vitals:[{t:'Growth 48th %ile',f:false},{t:'Hand-wringing',f:true},{t:'Speech: absent',f:true},{t:'Breathing irregular',f:true}],
          questions:[
            { id:'E3-v1-q1', prompt:'Ava had completely normal development and then regressed. The regression is the most important feature. What does it tell you — and how does it narrow the differential from a broad list?', placeholder:'What conditions cause regression after normal development? How does timing, pattern, and specific skills lost help identify the cause?' },
            { id:'E3-v1-q2', prompt:'Hand-wringing replacing purposeful hand use, breathing irregularities, speech loss after normal early development — in a female child. What is your leading diagnosis and what is the genetic mechanism?', placeholder:'What gene is involved? Why does this almost exclusively affect females? What happens to males with this mutation?' }
          ],
          nextFinding:'MECP2 sequencing: pathogenic de novo variant (R306C). EEG: generalized slowing, no seizures yet. MRI: mild cortical atrophy. Parents ask: "Where did this come from?"',
          nextFindingLabel:'Genetic testing',
          feedback:[
            { icon:'&#9733;', text:'<strong>Rett syndrome</strong> is caused by de novo MECP2 mutations — not inherited from parents. Mutation arises spontaneously. Parental recurrence risk <1%.' },
            { icon:'&#9889;', text:'<strong>Clinical stages:</strong> Normal development → regression (12–18 months) → hand-wringing, breathing irregularities, speech loss → stabilization → late motor decline.' },
            { icon:'&#128269;', text:'<strong>Why almost exclusively females:</strong> Males with MECP2 mutations typically have a severe neonatal phenotype and rarely survive to present with classic Rett.' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2', title:'After Diagnosis — What Ava Needs', sub:'Rett syndrome confirmed. Building a care plan.',
          decisionPrompt:'Ava has confirmed Rett syndrome at 20 months. No seizures yet but 80% develop them. Parents ask: "Is there any treatment? What is her future?"',
          choices:[
            { text:'Honest and specific: no cure, but effective supportive interventions. Priorities: neurology for seizure monitoring, AAC, physical/OT therapy, scoliosis surveillance, cardiac monitoring (QTc). International Rett Syndrome Foundation. Discuss emerging gene therapy trials. Hope grounded in truth.', outcome:'good' },
            { text:'Refer to genetics and neurology and defer all counseling to specialists.', outcome:'partial' },
            { text:'Tell family Rett syndrome has a very poor prognosis — focus on planning for lifetime care needs.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. No cure but excellent supportive management. Many Rett patients survive into their 40s-60s. Primary care plays a central coordination role. Hope grounded in honesty — acknowledging challenges while describing what is possible.',
            partial:'Specialists are necessary but primary care cannot be passive. The family is in crisis in your office. They need immediate information, referrals, and connection to patient organizations — now.',
            bad:'This framing, while not wrong about severity, opens with devastation without the full picture. Many Rett patients communicate through AAC, experience joy, and live for decades. Begin with what is possible, then move to challenges.'
          },
          keyFindings:['Normal development until 12 months, then regression: the Rett timeline.','Hand-wringing (replacing purposeful hand use) + breathing irregularities: pathognomonic.','MECP2 mutations: almost always de novo — parents not carriers, <1% recurrence.','Almost exclusively females: males have severe neonatal phenotype.','Emerging gene therapy trials: hope grounded in active research.'],
          diagnosis:'Rett Syndrome (MECP2 gene, X-linked dominant, de novo mutation)',
          diagnosisText:'Rett syndrome affects 1 in 10,000 females. Caused by de novo MECP2 mutations — one of the most commonly missed genetic diagnoses in girls because normal early development creates false security. The regression phase — when the diagnosis is most actionable — lasts only months.',
          genaText:'GENA Screen identifies Rett syndrome from normal early development followed by regression with hand-wringing and breathing irregularities in a female child — recommending MECP2 sequencing. The regression pattern combined with gender specificity makes this one of the most recognizable genetic presentations, but only if the clinician asks specifically about what skills were lost and when.',
          reflection:[
            { icon:'&#9889;', q:'<strong>The regression window:</strong> Ava\'s regression occurred at 13–15 months. When during that window could the diagnosis have been suspected? What question at the 12-month visit would have set the stage?' },
            { icon:'&#128269;', q:'<strong>The gender clue:</strong> Rett almost exclusively affects females. In which cases in this family did patient sex provide a diagnostic clue?' },
            { icon:'&#9203;', q:'<strong>Compare all five cases:</strong> Maya (benign), Ethan (ASD), Lily (Angelman), Carlos (hypothyroidism), Ava (Rett). What single question most efficiently separates "watch and reassure" from "investigate urgently" across all five?' }
          ]
        }
      ]
    }
  };
  Object.keys(newCases).forEach(function(k){ CASES[k] = newCases[k]; });
})();

// ─── FAMILY 4: Joint Pain ─────────────────────────────────────────────────
(function() {
  var f4 = {
    F4A:{ id:'F4A', family:4, headline:'"My hands are stiff and swollen every morning &#8212; it\'s been months"', patient:'Elena, 34F &nbsp;&#183;&nbsp; Administrative coordinator &nbsp;&#183;&nbsp; No prior joint history', tagline:'The prototype inflammatory arthritis. The diagnosis is in the history if you know what to ask.', diagnosis:'Rheumatoid Arthritis (RA), seropositive', isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Elena has bilateral hand and wrist pain with prolonged morning stiffness.',
          snapshot:'Elena, 34-year-old woman. 4 months of bilateral hand and wrist pain. Morning stiffness lasting "at least 90 minutes" before hands feel functional. Visible swelling in MCP and PIP joints. Fatigue, 6-pound weight loss. Stiffness worst in the morning, improves with activity. No skin rash, no eye symptoms, no recent infection.',
          vitals:[{t:'Temp 37.4',f:false},{t:'MCP/PIP swelling',f:true},{t:'Symmetric hands',f:true},{t:'No skin changes',f:false}],
          questions:[
            { id:'F4A-v1-q1', prompt:'Elena has bilateral hand and wrist pain with prolonged morning stiffness that improves with activity. Before ordering a single test, what does this pattern tell you about the type of arthritis — and how does it distinguish inflammatory from mechanical joint disease?', placeholder:'Think about timing of stiffness relative to activity, symmetry, joints involved, and systemic features. What is the fundamental physiologic difference between inflammatory and degenerative arthritis?' },
            { id:'F4A-v1-q2', prompt:'Bilateral MCP and PIP involvement — why does the distribution matter diagnostically? What does this pattern suggest compared to DIP or large joint involvement?', placeholder:'Which joint patterns are associated with which arthritis types? What does small joint, bilateral, symmetric MCP/PIP involvement suggest vs large joint or axial disease?' }
          ],
          nextFinding:'CRP 42 mg/L (elevated), ESR 68 mm/hr (elevated), RF positive 1:320, anti-CCP >250 U/mL (strongly positive). Mild normocytic anemia. Hand X-rays: periarticular osteopenia, no erosions yet.',
          nextFindingLabel:'Inflammatory workup',
          feedback:[
            { icon:'&#9733;', text:'<strong>Morning stiffness >1 hour that improves with use</strong> is the hallmark of inflammatory arthritis. Mechanical arthritis causes stiffness that worsens with use and lasts <30 minutes.' },
            { icon:'&#128269;', text:'<strong>Bilateral symmetric MCP/PIP with DIP sparing</strong> is the classic RA distribution. DIP involvement points toward OA or psoriatic arthritis. Wrist involvement in RA is nearly universal.' },
            { icon:'&#9203;', text:'<strong>Anti-CCP is the most specific test for RA</strong> (>95% specificity) and predicts erosive destructive disease. RF alone is less specific — positive in Sjögren\'s, lupus, chronic infection, aging.' }
          ]
        },
        { id:'v2', label:'Visit 2', icon:'&#128202;', iconClass:'v2', title:'Rheumatology Confirms RA', sub:'DAS28 5.8 — high disease activity. Treatment initiated.',
          snapshot:'Rheumatology confirms seropositive RA by 2010 ACR/EULAR criteria. Joint ultrasound: bilateral MCP and wrist synovitis with power Doppler signal. No erosions on MRI yet. Methotrexate 15mg weekly started. At 3 months: DAS28 3.1. Morning stiffness <20 min. Elena asks about stopping medication.',
          vitals:[{t:'DAS28: 5.8 (high)',f:true},{t:'Synovitis confirmed',f:true},{t:'No erosions',f:false},{t:'MTX started',f:false}],
          questions:[
            { id:'F4A-v2-q1', prompt:'Elena has seropositive RA with high disease activity but no erosions yet. Why does "no erosions yet" make treatment timing especially critical?', placeholder:'What is the natural history of untreated seropositive RA? What is the window of opportunity — and what happens to joint architecture if treatment is delayed?' },
            { id:'F4A-v2-q2', prompt:'Elena is 34 and asks about pregnancy. Methotrexate is teratogenic. How do you counsel her?', placeholder:'What happens to RA during pregnancy? What DMARDs are pregnancy-compatible? What does a woman of reproductive age starting methotrexate need to know?' }
          ],
          nextFinding:'At 3 months: DAS28 3.1 (low disease activity). CRP normalized. Morning stiffness <20 min. Elena feels "cured" and asks to stop medication.',
          nextFindingLabel:'3-month treatment response',
          feedback:[
            { icon:'&#9889;', text:'<strong>The window of opportunity:</strong> Treating early seropositive RA before radiographic erosions dramatically changes long-term joint outcome. Anti-CCP positive = more aggressive disease. Early aggressive treatment is evidence-based.' },
            { icon:'&#128101;', text:'<strong>RA and pregnancy:</strong> RA often improves during pregnancy, flares postpartum. Methotrexate must stop 3 months before conception. Hydroxychloroquine and sulfasalazine are pregnancy-compatible.' },
            { icon:'&#9203;', text:'<strong>Remission ≠ cure:</strong> Stopping DMARDs in RA remission leads to flare in 70–80% of patients. This conversation is essential at every visit.' }
          ]
        },
        { id:'v3', label:'Decision', icon:'&#128250;', iconClass:'v3', title:'Elena Wants to Stop Medication', sub:'She\'s in remission and feels completely better.',
          decisionPrompt:'Elena has been on methotrexate 6 months, DAS28 1.8. She says: "I feel completely better. My joints don\'t hurt at all. Can I stop? I don\'t want to be on a drug forever if I don\'t need it."',
          choices:[
            { text:'Counsel Elena that clinical remission in seropositive RA is medication-maintained, not spontaneous. Stopping in remission leads to flare in 70–80% of patients — often with accelerated joint damage. After sustained deep remission (12+ months), tapering under rheumatologist guidance is possible. Validate her goal while being honest about the evidence.', outcome:'good' },
            { text:'Support her decision — if she feels better, medication may no longer be necessary. Many patients achieve natural remission. Follow up in 3 months.', outcome:'bad' },
            { text:'Agree to reduce the dose but not stop — a compromise addressing her concern.', outcome:'partial' }
          ],
          outcomes:{
            good:'Correct. Remission in anti-CCP positive RA is medication-maintained. Stopping DMARDs in remission causes flare in 70–80% within 12 months, often with accelerated joint damage. Validate her goal — tapering after sustained deep remission under specialist guidance is the evidence-based path.',
            bad:'Anti-CCP positive RA does not achieve spontaneous remission. Stopping methotrexate will cause flare and potentially irreversible joint damage. Validating this decision without explaining the evidence causes harm through omission.',
            partial:'Dose reduction without sustained deep remission data is not evidence-based. The decision to taper belongs to rheumatology after defined remission duration, with clear monitoring. Arbitrary dose reduction without a plan defers the problem rather than solving it.'
          },
          keyFindings:['Morning stiffness >1 hour + improves with use = inflammatory arthritis.','Bilateral symmetric MCP/PIP = RA distribution.','Anti-CCP >250 = highly specific, predicts erosive disease.','Treat before erosions — the window of opportunity.','Remission in seropositive RA is medication-maintained. Stopping causes flare in 70–80%.'],
          diagnosis:'Rheumatoid Arthritis (RA), seropositive',
          diagnosisText:'RA affects 1% of the population, predominantly women. Early treatment with DMARDs in seropositive disease has transformed outcomes. The central primary care skill is recognizing the inflammatory vs mechanical distinction at the first visit — before any labs.',
          genaText:'GENA Screen is not indicated for RA — it is a multifactorial autoimmune condition without a single diagnostic gene. However, if the presentation suggested a genetic autoinflammatory syndrome (periodic fever + arthritis in a young patient), GENA would be appropriate. For Elena, the clinical and serologic picture is sufficient.',
          reflection:[
            { icon:'&#9733;', q:'<strong>The morning stiffness clock:</strong> >1 hour improves with use = inflammatory. <30 min worsens with use = mechanical. How reliably do you ask about stiffness duration and direction at every joint pain visit?' },
            { icon:'&#9203;', q:'<strong>The remission conversation:</strong> Elena feels cured. You are telling her she\'s not. How do you communicate this honestly without undermining her experience of feeling well?' },
            { icon:'&#128269;', q:'<strong>Anti-CCP vs RF:</strong> When would you order anti-CCP? When is RF alone sufficient? What does a strongly positive anti-CCP tell you about prognosis that RF does not?' }
          ]
        }
      ]
    },
    F4B:{ id:'F4B', family:4, headline:'"My knees have been aching for years &#8212; they\'re getting worse"', patient:'Harold, 72M &nbsp;&#183;&nbsp; Retired carpenter &nbsp;&#183;&nbsp; Walks daily', tagline:'Same complaint. Mechanical, not inflammatory. Don\'t over-investigate.', diagnosis:'Bilateral Knee Osteoarthritis, moderate-severe', isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Harold has 8 years of bilateral knee pain, worsening.',
          snapshot:'Harold, 72-year-old retired carpenter. 8 years of bilateral knee pain, progressively worsening. Pain worst after prolonged standing or walking, worse going downstairs. Morning stiffness lasts 10–15 minutes then resolves. Occasional puffiness after long walks. No fever, no weight loss, no other joint involvement. BMI 29. 40 years as a carpenter.',
          vitals:[{t:'BP 134/82',f:false},{t:'BMI 29',f:true},{t:'No warmth on exam',f:false},{t:'Crepitus bilateral',f:true}],
          questions:[
            { id:'F4B-v1-q1', prompt:'Harold\'s morning stiffness lasts 10–15 minutes and pain worsens with use. How does this specifically distinguish his joint disease from Elena\'s (Case 4A) — and what does it tell you about the underlying mechanism?', placeholder:'Direction of stiffness relative to activity, symmetry, joints involved. What is the cellular difference between osteoarthritis and inflammatory arthritis? What would you expect on exam and labs?' },
            { id:'F4B-v1-q2', prompt:'72-year-old ex-carpenter, BMI 29, bilateral knee pain for 8 years. What specific risk factors are operating — and what additional history completes the picture?', placeholder:'Age, occupation, BMI, sex, bilateral large joint involvement. What are the major modifiable and non-modifiable risk factors for OA?' }
          ],
          nextFinding:'Knee exam: crepitus, bony enlargement, mild varus deformity, no warmth, no effusion at rest. X-rays: medial compartment narrowing, osteophytes, subchondral sclerosis — moderate-severe OA. CRP 4 (normal). ESR 18 (normal). RF negative.',
          nextFindingLabel:'Exam and imaging',
          feedback:[
            { icon:'&#9989;', text:'<strong>Normal CRP and ESR</strong> confirm mechanical not inflammatory disease. Extensive autoimmune workup in classic OA generates false positives. Stop at the diagnosis.' },
            { icon:'&#128269;', text:'<strong>OA exam:</strong> Bony enlargement, crepitus, varus deformity, limited ROM without warmth or significant effusion at rest — structural mechanical disease, not synovitis.' },
            { icon:'&#9203;', text:'<strong>Occupational history:</strong> 40 years of carpentry = decades of repetitive knee loading. Occupation is one of the most underrecorded risk factors in musculoskeletal disease.' }
          ]
        },
        { id:'v2', label:'Decision', icon:'&#128250;', iconClass:'v2', title:'Management Decision', sub:'Bilateral moderate-severe knee OA. What does Harold need?',
          decisionPrompt:'Harold has moderate-severe bilateral knee OA limiting his daily walks. He asks: "Is there a pill? My neighbor gets injections. Do I need surgery? Should I stop walking since it hurts?"',
          choices:[
            { text:'First-line: supervised exercise therapy (highest evidence for knee OA), weight management, acetaminophen or topical NSAIDs. Intra-articular steroid for acute flares. Reserve surgery for severe functional impairment unresponsive to conservative management. Critically: tell Harold NOT to stop walking — activity improves OA outcomes.', outcome:'good' },
            { text:'Refer to orthopedics for bilateral knee replacement evaluation given imaging severity.', outcome:'partial' },
            { text:'Start daily oral NSAIDs and advise reducing walking until pain improves.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. Exercise therapy is the highest-evidence intervention for knee OA — quadriceps strengthening reduces medial compartment loading. Walking does not accelerate OA. Activity restriction leads to deconditioning and weight gain, which worsen OA. Daily oral NSAIDs in a 72-year-old carry GI and cardiovascular risk — topical is safer for knee OA.',
            partial:'Orthopedic referral is premature without first trying supervised exercise and appropriate analgesia. Imaging severity does not equal surgical indication — function and failed conservative treatment drive surgery, not X-ray appearance.',
            bad:'Daily oral NSAIDs in a 72-year-old = significant GI, renal, and cardiovascular risk. More critically, advising activity restriction is evidence-opposed. Exercise is the most effective OA treatment available. Restricting it causes deconditioning and worse outcomes.'
          },
          keyFindings:['Morning stiffness <30 min, worsens with use = mechanical, not inflammatory.','Normal CRP/ESR: no autoimmune workup. Do not over-investigate.','Exercise therapy: highest-evidence OA treatment. Never restrict activity.','Topical NSAIDs safer than oral in older adults for knee pain.','Imaging severity ≠ surgical indication. Function and failed conservative treatment drive surgery.'],
          diagnosis:'Bilateral Knee Osteoarthritis, moderate-severe',
          diagnosisText:'OA is the most common joint disease worldwide. It is mechanical and degenerative — not autoimmune. The primary care role: accurate diagnosis without over-investigation, prescribing exercise, counseling against activity restriction. Directly contrasts with Elena\'s RA to show that the same complaint requires a completely different approach.',
          genaText:'GENA Screen is not indicated for OA — polygenic, multifactorial, structural. No genetic test changes management. Over-investigating classic OA with autoimmune panels generates false positives. This case teaches when to stop testing.',
          reflection:[
            { icon:'&#9989;', q:'<strong>Exercise as medicine:</strong> Harold wanted to rest. Evidence says opposite. How do you convince an older patient with painful joints that exercise will help — not worsen — their condition?' },
            { icon:'&#9203;', q:'<strong>Imaging vs function:</strong> Harold has severe OA on X-ray but still walks daily. When does imaging severity drive surgical referral — and when should it not?' },
            { icon:'&#128269;', q:'<strong>Compare Elena and Harold:</strong> Three features that most efficiently distinguish inflammatory from mechanical arthritis before any labs.' }
          ]
        }
      ]
    },
    F4C:{ id:'F4C', family:4, headline:'"My knee and ankle have been swollen for two weeks &#8212; I don\'t know why"', patient:'Jordan, 19M &nbsp;&#183;&nbsp; College student &nbsp;&#183;&nbsp; Healthy until now', tagline:'Asymmetric lower extremity arthritis. The history nobody asks about unlocks the diagnosis.', diagnosis:'Reactive Arthritis (post-Chlamydia trachomatis)', isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Jordan has acute asymmetric joint swelling — no obvious cause.',
          snapshot:'Jordan, 19-year-old college student. 2 weeks of swollen, painful right knee and left ankle. Warm and swollen joints. Difficulty walking. Morning stiffness ~40 minutes. No fever. Mentions "burning when I pee" 3–4 weeks ago that resolved on its own. Red eye last week. Otherwise healthy.',
          vitals:[{t:'Right knee effusion',f:true},{t:'Left ankle swollen',f:true},{t:'Normal upper extremities',f:false},{t:'No fever',f:false}],
          questions:[
            { id:'F4C-v1-q1', prompt:'Jordan has asymmetric arthritis in two lower extremity joints in a 19-year-old male. What is the differential — and what specific history is essential before you can narrow it?', placeholder:'Broad differential: septic, crystal, reactive, viral, inflammatory. Red flags for septic arthritis? What would you specifically ask a 19-year-old male with acute joint swelling?' },
            { id:'F4C-v1-q2', prompt:'Burning urination 3–4 weeks ago that resolved + red eye last week + joint swelling now. How do these connect — and what is the leading diagnosis?', placeholder:'What is the classic triad? What organism most commonly causes this in a sexually active young male? Why does joint inflammation occur weeks after urethritis?' }
          ],
          nextFinding:'Urine NAAT: Chlamydia trachomatis positive. Knee arthrocentesis: inflammatory fluid (WBC 28,000, no organisms, no crystals). HLA-B27: positive.',
          nextFindingLabel:'Infectious and joint workup',
          feedback:[
            { icon:'&#9733;', text:'<strong>Reactive arthritis</strong> presents 1–4 weeks after urogenital or GI infection. The triad: arthritis + urethritis/cervicitis + conjunctivitis. You don\'t need all three to make the diagnosis.' },
            { icon:'&#128269;', text:'<strong>The questions that unlock it:</strong> "Any urinary symptoms in the past month?" and "Any eye redness?" distinguish reactive arthritis from septic arthritis — questions most clinicians don\'t ask in a 19-year-old with a swollen joint.' },
            { icon:'&#9203;', text:'<strong>HLA-B27 positive</strong> in ~75% of reactive arthritis cases (vs 8% general population). Associated with severity and risk of chronicity and future spondyloarthropathy.' }
          ]
        },
        { id:'v2', label:'Visit 2', icon:'&#128202;', iconClass:'v2', title:'Treatment and Counseling', sub:'Two issues to address: the infection and the arthritis.',
          snapshot:'Jordan needs treatment for Chlamydia and the reactive arthritis. He is embarrassed about the STI and asks if his partner needs to be treated. He asks: "Will this go away? Can this happen again?"',
          vitals:[{t:'Chlamydia confirmed',f:true},{t:'HLA-B27 positive',f:false},{t:'Partner unaware',f:true}],
          questions:[
            { id:'F4C-v2-q1', prompt:'Treatment for Chlamydia and for the arthritis — why does treating the infection not immediately resolve the joints?', placeholder:'Is the joint actively infected or immunologically reactive? Does treating the trigger treat the joint disease?' },
            { id:'F4C-v2-q2', prompt:'Jordan\'s partner needs treatment. He\'s embarrassed and reluctant. What is your ethical and medical obligation?', placeholder:'Primary care physician\'s role in STI partner notification. What does his partner need — and what happens if she goes untreated?' }
          ],
          nextFinding:'Doxycycline for Chlamydia (partner treated). NSAIDs for arthritis. Significant improvement at 3 weeks. Full resolution at 8 weeks. Counseled on HLA-B27 and recurrence risk.',
          nextFindingLabel:'Treatment response',
          feedback:[
            { icon:'&#9889;', text:'<strong>Reactive arthritis is post-infectious, not septic.</strong> The joint is not infected — it\'s immunologically inflamed by bacterial antigens. Treating the trigger prevents ongoing stimulus and reduces chronicity risk.' },
            { icon:'&#128101;', text:'<strong>Partner notification is a medical obligation</strong> for reportable STIs. Most female partners have asymptomatic Chlamydia — and risk PID and infertility if untreated.' },
            { icon:'&#9203;', text:'<strong>Most reactive arthritis resolves in 3–6 months.</strong> HLA-B27 positive patients have higher risk of chronic arthritis and future spondyloarthropathy (ankylosing spondylitis).' }
          ]
        },
        { id:'v3', label:'Decision', icon:'&#128250;', iconClass:'v3', title:'The History That Changes Everything', sub:'What if you hadn\'t asked about the urethritis?',
          decisionPrompt:'If you had not asked about urinary symptoms or eye redness — what would your differential have been, and how does asking the right question change the entire workup?',
          choices:[
            { text:'Ask specifically about urinary symptoms (past month), eye symptoms, recent GI illness, and sexual history before ordering anything. The history is the diagnosis here. The right question changes a $3,000 workup into a targeted NAAT.', outcome:'good' },
            { text:'Order joint aspiration, uric acid, ANA panel, HLA-B27, and inflammatory markers simultaneously — cover all bases.', outcome:'partial' },
            { text:'Treat empirically for gout with NSAIDs and colchicine — most common cause of acute oligoarthritis.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. History is the highest-yield diagnostic tool in reactive arthritis. Without asking about urethritis and conjunctivitis, this diagnosis is almost always missed. With it, the diagnosis is often clear before any test is ordered.',
            partial:'Joint aspiration is always appropriate in acute monoarthritis to exclude septic arthritis — correct. But a shotgun autoimmune panel without a focused history generates expense and confusion. Aspiration yes. History first.',
            bad:'Gout in a 19-year-old male is uncommon. Empiric gout treatment without ruling out septic arthritis — which requires aspiration — risks missing a joint-destroying infection.'
          },
          keyFindings:['Asymmetric lower extremity oligoarthritis in young adult = reactive arthritis on differential.','Triad: arthritis + urethritis/cervicitis + conjunctivitis. Ask about all three.','History unlocks the diagnosis: urinary symptoms 3–4 weeks prior + red eye = reactive arthritis.','Joint aspiration always indicated in acute monoarthritis to exclude septic arthritis.','HLA-B27 positive: higher risk of chronicity and future spondyloarthropathy.'],
          diagnosis:'Reactive Arthritis (post-Chlamydia trachomatis urethritis)',
          diagnosisText:'Reactive arthritis follows urogenital or GI infection by 1–4 weeks. The joint is not infected — it is immunologically reactive. Most cases resolve in 3–6 months. The diagnosis is almost always missed when the antecedent infection history is not elicited.',
          genaText:'GENA Screen is not indicated for reactive arthritis. The clinical picture and targeted infectious testing are sufficient. GENA\'s pattern recognition would correctly prioritize reactive arthritis from the triad — but the history alone achieves this at zero cost.',
          reflection:[
            { icon:'&#128269;', q:'<strong>The question you almost didn\'t ask:</strong> "Any urinary symptoms in the past month?" What other diagnoses require asking questions patients will never volunteer unprompted?' },
            { icon:'&#128101;', q:'<strong>Partner notification:</strong> Jordan was embarrassed. How do you have this conversation while meeting your medical and legal obligations?' },
            { icon:'&#9203;', q:'<strong>HLA-B27 and the future:</strong> Jordan is HLA-B27 positive at 19. What does this mean for long-term risk — and how do you follow him?' }
          ]
        }
      ]
    },
    F4D:{ id:'F4D', family:4, headline:'"My joints have been aching and I\'ve been exhausted &#8212; I thought it was stress"', patient:'Priya, 16F &nbsp;&#183;&nbsp; High school student &nbsp;&#183;&nbsp; Facial rash after beach trip', tagline:'Arthritis as the presenting complaint of a multisystem disease. Don\'t just treat the joints.', diagnosis:'Systemic Lupus Erythematosus (SLE) with Class III Lupus Nephritis', isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Priya has joint pain, fatigue, and a new facial rash.',
          snapshot:'Priya, 16-year-old Black girl. 3 months of bilateral hand and knee aching, significant fatigue, low-grade fever. After a beach trip: red rash across both cheeks and nose bridge, sparing nasolabial folds. Two oral ulcers in the past month. 5-pound weight loss. Hair thinning. Morning stiffness <30 minutes.',
          vitals:[{t:'Temp 37.8',f:true},{t:'Malar rash',f:true},{t:'BP 124/76',f:false},{t:'Hair thinning',f:true}],
          questions:[
            { id:'F4D-v1-q1', prompt:'Priya has joint pain — but also a photosensitive facial rash, oral ulcers, hair thinning, fatigue, and fever. Why is it essential to step back from the joint pain and find the unifying diagnosis?', placeholder:'What single diagnosis explains photosensitive malar rash + oral ulcers + arthritis + fatigue + hair loss + fever in a teenage girl? What is the risk of treating this as isolated arthritis?' },
            { id:'F4D-v1-q2', prompt:'Priya is a 16-year-old Black female. How does her demographic profile change your prior probability for SLE — and what does it tell you about likely disease severity?', placeholder:'SLE has significant demographic variation in incidence and severity. How does race and sex affect the likelihood and phenotypic expression?' }
          ],
          nextFinding:'ANA: 1:640 (homogeneous). Anti-dsDNA: strongly positive >1:320. Anti-Smith: positive. C3/C4: low. CBC: lymphopenia, mild hemolytic anemia. UA: 2+ proteinuria, RBC casts. Diagnosis: SLE with probable lupus nephritis.',
          nextFindingLabel:'Serologic and urine workup',
          feedback:[
            { icon:'&#9888;', text:'<strong>RBC casts and proteinuria in SLE = lupus nephritis.</strong> Immediate nephrology referral. Lupus nephritis is the leading cause of morbidity — and it is silent until found on urinalysis.' },
            { icon:'&#9733;', text:'<strong>2019 EULAR/ACR SLE criteria:</strong> Priya has malar rash, photosensitivity, oral ulcers, arthritis, hemolytic anemia, lymphopenia, proteinuria, ANA, anti-dsDNA, anti-Smith. Meets criteria definitively.' },
            { icon:'&#128269;', text:'<strong>Black women:</strong> highest SLE incidence, earliest onset, most severe disease — including higher rates of lupus nephritis. This is biologic and systemic, not incidental.' }
          ]
        },
        { id:'v2', label:'Visit 2', icon:'&#128202;', iconClass:'v2', title:'Lupus Nephritis Confirmed', sub:'Kidney biopsy: Class III focal proliferative nephritis.',
          snapshot:'Kidney biopsy: Class III lupus nephritis. Hydroxychloroquine + mycophenolate mofetil + prednisone taper started. Priya and mother ask: "Is this curable? Can she live a normal life? Can she still go to college?"',
          vitals:[{t:'Biopsy: Class III',f:true},{t:'HCQ started',f:false},{t:'MMF started',f:false},{t:'Prednisone taper',f:false}],
          questions:[
            { id:'F4D-v2-q1', prompt:'Priya has Class III lupus nephritis at 16. What does this mean for long-term kidney prognosis — and why is hydroxychloroquine prescribed for essentially all SLE patients?', placeholder:'Natural history of treated Class III nephritis? What does hydroxychloroquine do beyond joints — and what happens to patients who don\'t take it?' },
            { id:'F4D-v2-q2', prompt:'Priya asks if she can still go to college and live normally. How do you frame this prognosis conversation honestly — without minimizing or catastrophizing?', placeholder:'Realistic long-term outlook for a treated young woman with SLE and lupus nephritis. What does "normal life" require from her?' }
          ],
          nextFinding:'At 6 months: proteinuria 2.3g/day → 0.4g/day. Anti-dsDNA falling. Complement normalizing. No flare. Priya starts college with a management plan in place.',
          nextFindingLabel:'Six-month response',
          feedback:[
            { icon:'&#9889;', text:'<strong>Hydroxychloroquine reduces flares, organ damage, thrombosis, and mortality in SLE</strong> — foundational therapy for essentially all patients regardless of disease activity. Non-adherence dramatically worsens outcomes.' },
            { icon:'&#128101;', text:'<strong>Class III nephritis treated early</strong> has good renal prognosis — >80% avoid dialysis at 10 years with modern treatment.' },
            { icon:'&#9203;', text:'<strong>Urinalysis at every SLE visit:</strong> Lupus nephritis is clinically silent. Routine UA with microscopy is the only way to detect early nephritis before irreversible damage.' }
          ]
        },
        { id:'v3', label:'Decision', icon:'&#128250;', iconClass:'v3', title:'What If Arthritis Had Been Treated in Isolation?', sub:'What would have happened if you\'d just given her NSAIDs?',
          decisionPrompt:'Priya came in with joint pain. If her malar rash had been attributed to sunburn and her fatigue to teenage stress, her arthritis might have been treated with NSAIDs and she would have been sent home. What would have happened to her lupus nephritis?',
          choices:[
            { text:'Lupus nephritis is clinically silent — it would not have been caught until it caused nephrotic syndrome, hypertension, or renal failure. By then, Class III would likely have progressed to Class IV or V. Treating arthritis in a teenage girl with systemic features without a UA and ANA is a diagnostic failure.', outcome:'good' },
            { text:'The nephritis would have been found on routine bloodwork at her next annual visit. A few months\' delay is unlikely to significantly affect outcome.', outcome:'partial' },
            { text:'The malar rash would have prompted investigation sooner — it\'s a recognizable finding any clinician would pursue.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. Lupus nephritis does not cause symptoms until advanced. A teenager with arthritis + systemic features who receives NSAIDs and is sent home will develop progressive renal damage silently. The features identifying this as systemic disease are visible at the first visit. A UA and ANA cost <$50. The cost of missing nephritis is measured in renal function.',
            partial:'Annual visits are too infrequent for active lupus nephritis. Class III nephritis can progress to Class IV within months without treatment. "A few months" of untreated proliferative lupus nephritis is not trivial.',
            bad:'Malar rash is frequently misattributed to sunburn, rosacea, or eczema — particularly in patients of color, where rash recognition is less reliable. It is not reliably self-presenting without a clinician who knows what to look for.'
          },
          keyFindings:['Malar rash + oral ulcers + arthritis + fatigue + hair loss = SLE until proven otherwise.','UA is mandatory in any patient with suspected SLE — nephritis is clinically silent.','ANA, anti-dsDNA, anti-Smith, complement form the SLE serologic profile.','Black females: highest SLE incidence, earliest onset, most severe disease.','Hydroxychloroquine: foundational for all SLE — reduces mortality and organ damage.'],
          diagnosis:'Systemic Lupus Erythematosus (SLE) with Class III Lupus Nephritis',
          diagnosisText:'SLE is most common in women of reproductive age and disproportionately affects Black, Hispanic, and Asian women. Arthritis is a presenting complaint of a multisystem disease — not a disease in itself. Lupus nephritis, present in ~50% of SLE patients, requires urinalysis to detect.',
          genaText:'GENA Screen is not indicated for SLE — polygenic multifactorial autoimmune condition. However, the multisystem pattern here — arthritis, renal involvement, specific autoantibodies — is where GENA\'s cross-system pattern recognition adds value in identifying rare mimics or overlapping genetic syndromes. In this case the clinical picture is sufficient.',
          reflection:[
            { icon:'&#9888;', q:'<strong>The silent kidney:</strong> Lupus nephritis has no symptoms until advanced. What other serious conditions present silently — and what is your protocol for detecting them before symptoms develop?' },
            { icon:'&#128269;', q:'<strong>Demographics:</strong> Priya is a 16-year-old Black female. How explicitly do you incorporate demographic risk factors into clinical reasoning — and where is the line between appropriate Bayesian thinking and stereotyping?' },
            { icon:'&#9203;', q:'<strong>Arthritis as a presenting complaint:</strong> Both Priya (SLE) and Elena (RA) had joint pain as their primary complaint. What features in the first 5 minutes of Priya\'s history told you this was a systemic disease?' }
          ]
        }
      ]
    },
    F4E:{ id:'F4E', family:4, headline:'"He\'s been spiking fevers every day for three weeks and now his knee is swollen"', patient:'Marcus, 8M &nbsp;&#183;&nbsp; Elementary school &nbsp;&#183;&nbsp; Parents worried about leukemia', tagline:'Arthritis that looks like infection. Fever + rash + joint swelling in a child.', diagnosis:'Systemic Juvenile Idiopathic Arthritis (sJIA) with evolving Macrophage Activation Syndrome', isGenetic:false,
      visits:[
        { id:'v1', label:'Visit 1', icon:'&#128337;', iconClass:'v1', title:'Initial Presentation', sub:'Daily spiking fevers for 3 weeks, bilateral knee swelling for 10 days.',
          snapshot:'Marcus, 8-year-old boy. 3 weeks of daily spiking fevers to 39.5–40°C, occurring in the late afternoon and resolving overnight. Salmon-pink evanescent rash that appears with fever and fades when fever breaks. Bilateral knee swelling 10 days. Irritable, fatigued, alert. Lymph nodes slightly enlarged. Spleen tip palpable. CBC: WBC 24,000. Ferritin 2,840 ng/mL.',
          vitals:[{t:'Temp 39.8',f:true},{t:'HR 118',f:true},{t:'Ferritin 2840',f:true},{t:'Splenomegaly',f:true}],
          questions:[
            { id:'F4E-v1-q1', prompt:'Marcus has daily spiking fevers with a salmon rash that appears only with fever, joint swelling, lymphadenopathy, and splenomegaly. Why is this fever pattern specifically different from bacterial infection — and what does the evanescent rash tell you?', placeholder:'The fever pattern: quotidian, resolves overnight. Differential for fever + arthritis + evanescent salmon rash in a child? What does fever + rash + arthritis together point toward?' },
            { id:'F4E-v1-q2', prompt:'Ferritin is 2,840 ng/mL. When does ferritin become a specific finding — and what conditions use markedly elevated ferritin diagnostically?', placeholder:'When is ferritin not just inflammation but a disease-specific signal? What threshold has diagnostic weight? What happens to ferritin in macrophage activation syndrome?' }
          ],
          nextFinding:'Bone marrow biopsy: no malignancy. Blood cultures: negative at 72 hours. ANA/RF/anti-CCP: negative. Echo: small pericardial effusion. Repeat ferritin: 6,200 ng/mL. Rheumatology confirms sJIA. MAS concerns raised.',
          nextFindingLabel:'Workup and rheumatology evaluation',
          feedback:[
            { icon:'&#9733;', text:'<strong>Systemic JIA</strong> (10–15% of JIA): quotidian fever + salmon evanescent rash + arthritis is the diagnostic triad. The rash — appearing with fever and fading as it breaks — is pathognomonic.' },
            { icon:'&#9888;', text:'<strong>MAS</strong> complicates sJIA in 10–15% of cases. Ferritin >500 = attention; ferritin >10,000 in sJIA = MAS until proven otherwise. Rising ferritin in a sick sJIA patient is an emergency signal.' },
            { icon:'&#128269;', text:'<strong>Leukemia was appropriate on the differential</strong> — fever + lymphadenopathy + hepatosplenomegaly in a child requires bone marrow biopsy before committing to JIA. Both can coexist.' }
          ]
        },
        { id:'v2', label:'Visit 2', icon:'&#128202;', iconClass:'v2', title:'MAS Risk and Treatment', sub:'Ferritin rising. MAS evolving. Admission required.',
          snapshot:'Ferritin now 6,200 and rising. Fibrinogen falling. Platelets 320K → 180K. Liver enzymes rising. Admitted. High-dose corticosteroids + anakinra (IL-1 inhibitor) initiated. Parents ask: "Why is this happening? Is it going to get worse?"',
          vitals:[{t:'Ferritin 6200 &#8593;',f:true},{t:'Platelets falling',f:true},{t:'Fibrinogen low',f:true},{t:'Admitted',f:true}],
          questions:[
            { id:'F4E-v2-q1', prompt:'Marcus shows evolving MAS: rising ferritin, falling platelets, falling fibrinogen, rising liver enzymes. What is the pathophysiology — and why is it so dangerous?', placeholder:'What is happening at the cellular level in MAS? Why do ferritin, fibrinogen, and platelets change in these directions? What is untreated MAS mortality?' },
            { id:'F4E-v2-q2', prompt:'Anakinra (IL-1 receptor antagonist) is being used for sJIA and MAS. What does this tell you about sJIA\'s immune mechanism — and how have biologics changed outcomes?', placeholder:'What cytokine pathway is central to sJIA? How does targeting IL-1 change disease course? What was the prognosis before biologics?' }
          ],
          nextFinding:'IV methylprednisolone + anakinra: ferritin 6,200 → 1,800 over 5 days, platelets stabilize, fibrinogen recovers. Discharged on canakinumab (IL-1 inhibitor) + steroid taper.',
          nextFindingLabel:'Treatment response',
          feedback:[
            { icon:'&#9889;', text:'<strong>MAS</strong> = hyperactivated macrophages/T cells, cytokine storm, consumptive coagulopathy, multiorgan failure. Mortality of untreated MAS: 20–30%. IL-1 blockade + corticosteroids is now standard of care.' },
            { icon:'&#9203;', text:'<strong>Biologics transformed sJIA:</strong> Before IL-1 and IL-6 inhibitors, sJIA had the highest morbidity/mortality of all JIA subtypes. With modern treatment, sustained remission is achievable in many.' },
            { icon:'&#128269;', text:'<strong>Ferritin trend > single value:</strong> 2,840 → 6,200 in 48 hours signals loss of control. Rate of change is the warning — not any single measurement.' }
          ]
        },
        { id:'v3', label:'Decision', icon:'&#128250;', iconClass:'v3', title:'The Primary Care Role — What Should Have Happened Earlier?', sub:'Marcus was seen twice with antibiotics before rheumatology.',
          decisionPrompt:'Marcus saw his pediatrician at day 7 (antibiotics for presumed bacterial infection) and day 14 (knee swollen, ferritin 2,840). When should sJIA have been on the differential — and what is the primary care role?',
          choices:[
            { text:'At day 7: quotidian fever pattern (spikes in afternoon, resolves overnight) + any joint symptoms + salmon rash should place sJIA on the differential. Bacterial infection without a source for 7 days with a quotidian pattern warrants rheumatologic consideration in parallel with continued infectious workup — not sequentially after it fails.', outcome:'good' },
            { text:'Day 14 was appropriate — two weeks of fever is the standard FUO threshold for rheumatology referral.', outcome:'partial' },
            { text:'Antibiotics were appropriate and rheumatologic workup should only start after cultures are definitively negative at 72 hours.', outcome:'bad' }
          ],
          outcomes:{
            good:'Correct. Quotidian fever — peaking in the afternoon and resolving by morning — is not the pattern of bacterial infection. At day 7 with no bacterial source, the quotidian pattern + joint symptoms should prompt rheumatologic consideration in parallel. Earlier recognition means earlier ferritin trending and earlier MAS risk identification.',
            partial:'Two weeks is the FUO definition, not the sJIA recognition point. The quotidian pattern is diagnostically specific. A pediatrician who recognizes this refers at day 7–10. The joint swelling and ferritin were already elevated by day 14 — earlier recognition means earlier intervention.',
            bad:'The quotidian pattern should be recognized before cultures finalize — in sJIA, the clinical picture is atypical for bacterial infection from day one. Waiting for negative cultures as the sole trigger for rheumatologic consideration loses a critical week in a potentially life-threatening condition.'
          },
          keyFindings:['Quotidian fever (afternoon spike, resolves overnight) + salmon rash + arthritis = sJIA triad.','Salmon evanescent rash appearing only with fever is pathognomonic.','Ferritin >500 in sJIA = monitor. Rising ferritin = MAS until proven otherwise.','Bone marrow biopsy to exclude leukemia is mandatory before JIA diagnosis.','IL-1 blockade has transformed sJIA — early rheumatology referral is critical.'],
          diagnosis:'Systemic Juvenile Idiopathic Arthritis (sJIA) with Macrophage Activation Syndrome (MAS)',
          diagnosisText:'sJIA is driven by innate immune dysregulation (IL-1β, IL-18, IL-6). The quotidian fever + salmon rash triad is pathognomonic. MAS complicates 10–15% with 20–30% mortality untreated. IL-1 and IL-6 inhibitors have transformed outcomes. Primary care role: pattern recognition and urgent referral.',
          genaText:'GENA Screen is not indicated for sJIA — not a single-gene disorder. However, the MAS phenotype can overlap with genetic autoinflammatory syndromes (NLRC4-MAS, HLH) that GENA would appropriately flag when the phenotype is atypical or severe. Knowing when the phenotype warrants genetic autoinflammatory workup is an advanced clinical skill.',
          reflection:[
            { icon:'&#9889;', q:'<strong>The quotidian pattern:</strong> Fever that peaks in the afternoon and resolves overnight is not bacterial. How reliably do you ask about fever timing — not just "does he have a fever?" but "when does it peak and when does it break?"' },
            { icon:'&#9888;', q:'<strong>The ferritin trend:</strong> Marcus\'s ferritin went from 2,840 to 6,200 in 48 hours. When you order a ferritin, do you trend it — or look at one value and move on?' },
            { icon:'&#128269;', q:'<strong>Across the joint pain family:</strong> Elena (RA), Harold (OA), Jordan (reactive), Priya (SLE), Marcus (sJIA). What is the single most distinguishing feature of each at the first visit, before any labs?' }
          ]
        }
      ]
    }
  };
  Object.keys(f4).forEach(function(k){ CASES[k] = f4[k]; });
})();


// ═══════════════════════════════════════════
