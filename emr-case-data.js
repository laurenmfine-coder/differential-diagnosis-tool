// ═══════════════════════════════════════════════════════════
// EMR SIMULATOR — ALL 20 PATIENT DATASETS
// ═══════════════════════════════════════════════════════════

const EMR_CASES = {

  // ── FAMILY 1: FATIGUE ────────────────────────────────────

  A: {
    id: 'A', family: 1,
    patient: { name: 'Sofia T.', age: '34F', mrn: 'RDX-1001-A', visit: 'New patient — chronic fatigue' },
    vitals: [{val:'BP 112/70',flag:false},{val:'HR 88',flag:false},{val:'Temp 98.4',flag:false},{val:'BMI 23',flag:false}],
    problems: [{name:'Fatigue, chronic',detail:'14 months duration'},{name:'Heavy menstrual bleeding',detail:'Since IUD change 1 year ago'}],
    meds: [{name:'Mirena IUD',detail:'Placed 14 months ago'},{name:'Ibuprofen PRN',detail:'For cramps'}],
    cc: '"I\'ve been exhausted for over a year and I can\'t figure out why. I eat well, I sleep okay, but I\'m always tired."',
    diagnosis: 'Iron Deficiency Anemia',
    personas: {
      patient: {
        name: 'Sofia T.', role: 'Patient', location: 'In exam room', avatar: 'S', color: '#1a6fa8',
        greeting: 'Hi, thanks for seeing me. I\'ve been exhausted for over a year and I just can\'t figure out why. I\'ve been to my OB and she said everything looks fine.',
        systemPrompt: `You are Sofia T., a 34-year-old woman who is a teacher with two children ages 3 and 6. You have been exhausted for 14 months. You are warm but tired and a little frustrated that no one has figured out what's wrong.

VOLUNTEER freely: Fatigue all the time, poor energy, occasional headaches, difficulty concentrating at work. You attribute it to being a working mom.

ONLY IF ASKED: Periods have been heavier since your IUD was changed about a year ago ("I go through more pads than I used to"). You eat mostly plant-based — not much red meat. No family history of thyroid disease. No recent bloodwork.

Keep responses 2-3 sentences. Speak naturally.`
      },
      spouse: {
        name: 'Marco T.', role: 'Husband', location: 'In waiting room', avatar: 'M', color: '#2a7a50',
        greeting: 'Hi doctor. I drove her in today because I\'ve been worried. She\'s exhausted every evening.',
        systemPrompt: `You are Marco, Sofia's husband. You are concerned. You noticed she seems pale and gets tired easily. You pushed her to come in. You don't know medical details but observe she's been "running on empty" for a year. Keep responses 2-3 sentences.`
      }
    },
    exam: {
      general: [{label:'Appearance',text:'Alert, thin woman, mildly pale conjunctivae noted.',flag:'abnormal',flagText:'PALE'}],
      heent: [{label:'Conjunctivae',text:'Mildly pale — consistent with anemia.',flag:'abnormal',flagText:'PALE'},{label:'Sclera',text:'Anicteric.',flag:'normal'}],
      skin: [{label:'Skin',text:'Dry, no rashes, no jaundice.',flag:'normal'}],
      cardiac: [{label:'Heart',text:'Regular rate and rhythm. No murmurs. HR 88.',flag:'normal'},{label:'Peripheral',text:'2+ pulses bilaterally.',flag:'normal'}],
      pulm: [{label:'Lungs',text:'Clear to auscultation bilaterally.',flag:'normal'}],
      abdomen: [{label:'Abdomen',text:'Soft, non-tender. No hepatosplenomegaly.',flag:'normal'}],
      neuro: [{label:'Neurologic',text:'Alert and oriented. No focal deficits.',flag:'normal'}],
      ext: [{label:'Extremities',text:'No edema. No koilonychia (spoon nails).',flag:'normal'}]
    },
    orders: {
      cbc: { name:'CBC with Differential', timing:0, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Hemoglobin','9.8 g/dL','12.0-16.0','L'],['MCV','71 fL','80-100','L'],['MCH','22 pg','27-33','L'],['WBC','7.1 K/uL','4.5-11.0',''],['Platelets','310 K/uL','150-400','']], note:'Microcytic hypochromic anemia. Pattern consistent with iron deficiency.' }},
      bmp: { name:'BMP', timing:0, relevant:false, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Sodium','139','136-145',''],['Creatinine','0.8','0.5-1.1',''],['Glucose','88','70-100','']] }},
      iron: { name:'Iron Studies / Ferritin', timing:2, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Ferritin','6 ng/mL','12-150','L'],['Serum Iron','42 mcg/dL','60-170','L'],['TIBC','420 mcg/dL','250-370','H'],['Transferrin Sat','10%','20-50%','L']], note:'Severely depleted iron stores. Pattern confirms iron deficiency anemia.' }},
      tsh: { name:'TSH', timing:2, relevant:false, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['TSH','2.3 mIU/L','0.4-4.5','']], note:'TSH normal. Hypothyroidism excluded.' }},
      celiac: { name:'Celiac Screen (tTG-IgA)', timing:24, relevant:false, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['tTG-IgA','3 U/mL','<20',''],['Total IgA','180 mg/dL','70-400','']], note:'Celiac serology negative. IgA level normal — result is reliable.' }},
      pelvic_us: { name:'Pelvic Ultrasound', timing:48, relevant:false, result:{ type:'imaging', report:'PELVIC ULTRASOUND\n\nUterus: Normal size. IUD in appropriate position.\nEndometrium: 8mm thickness (proliferative phase normal).\nOvaries: Normal bilaterally.\nNo fibroids or masses identified.', impression:'IMPRESSION: Normal pelvic ultrasound. IUD in correct position. No structural cause for heavy bleeding identified — likely related to IUD type (copper vs hormonal).' }},
      gyn: { name:'Gynecology Referral', timing:0, relevant:true, result:{ type:'imaging', report:'GYNECOLOGY REFERRAL PLACED\n\nIndication: Heavy menstrual bleeding with iron deficiency anemia.\nEstimated appointment: 1-2 weeks.\n\nRecommended pre-visit labs: CBC, ferritin, coagulation studies.', impression:'Referral accepted for evaluation and management of heavy menstrual bleeding.' }}
    },
    badges: {
      menstrual: { trigger: (q,r) => /period|menstrual|bleed|pad|tampon|iud/i.test(q+r), icon:'&#128167;', label:'Menstrual History', color:'gold', explanation:'You asked about menstrual bleeding — revealing heavier periods since IUD change' },
      dietary: { trigger: (q,r) => /diet|eat|meat|iron|food|veg/i.test(q+r), icon:'&#127822;', label:'Dietary Detective', color:'blue', explanation:'You asked about dietary iron intake — revealing plant-based diet low in iron' },
      pallor: { trigger: (sys) => sys === 'heent' || sys === 'general', icon:'&#128064;', label:'Pallor Spotted', color:'gold', explanation:'You examined for pallor — a key physical finding in anemia' }
    }
  },

  B: {
    id: 'B', family: 1,
    patient: { name: 'Marcus T.', age: '41M', mrn: 'RDX-2041-B', visit: 'New patient — chronic fatigue' },
    vitals: [{val:'BP 148/92',flag:true},{val:'HR 78',flag:false},{val:'Temp 98.6',flag:false},{val:'BMI 26',flag:false}],
    problems: [{name:'Fatigue, chronic',detail:'5+ years, previously attributed to stress'},{name:'Hypertension',flag:true,detail:'Newly identified'},{name:'Depression, NOS',detail:'Prior dx — on sertraline 6 months, no improvement'}],
    meds: [{name:'Sertraline 50mg',detail:'Daily — 6 months, ineffective'},{name:'Ibuprofen PRN',detail:'OTC, occasional'}],
    cc: '"I\'m exhausted all the time. It\'s been going on for years. My doctor said it was depression and I tried an antidepressant for 6 months but I feel exactly the same."',
    diagnosis: 'Fabry Disease (GLA gene, X-linked)',
    personas: {
      patient: {
        name: 'Marcus T.', role: 'Patient', location: 'In exam room', avatar: 'M', color: '#1a6fa8',
        greeting: 'Hi doctor. I\'m really glad to finally see someone new. I\'ve been to three different doctors about this exhaustion and they all tell me it\'s stress or depression. I\'ve been on an antidepressant for 6 months and I feel exactly the same.',
        systemPrompt: `You are Marcus T., a 41-year-old man who works in finance. You have chronic fatigue for 5+ years. You are frustrated with the medical system but hopeful. You attribute symptoms to work stress.

VOLUNTEER freely: Fatigue, difficulty concentrating at work, history of being told it's stress/depression, ineffective antidepressant.

ONLY IF ASKED DIRECTLY:
- Burning pain in hands/feet: "Yeah actually, I've had that since I was a teenager. I thought everyone had that burning feeling, especially when it's hot or after exercising."
- Sweating: "Now that you mention it, I almost never sweat — even at the gym everyone is drenched and I'm totally dry."
- Eyes: "An eye doctor once told me I had something unusual about my corneas but said it wasn't a problem."
- Skin: "I have these little red spots on my stomach and upper thighs. I've had them my whole life."
- Family history: Father died of heart attack age 55. Brother has kidney problems doctors can't explain. Mother alive age 68. Suggest doctor call his mother for more family history detail.

Never volunteer information unless specifically asked. Keep responses 2-3 sentences.`
      },
      spouse: {
        name: 'Diana T.', role: 'Wife', location: 'In waiting room', avatar: 'D', color: '#2a7a50',
        greeting: 'Hi doctor. I came along today because I\'ve been worried about Marcus for a long time.',
        systemPrompt: `You are Diana, Marcus's wife (38F). You are warm and worried. You know Marcus has episodes where his feet turn bright red and he says they're burning. He barely sweats even at the gym. He's been to multiple doctors and they keep saying it's stress. His father died young of a heart attack. His brother has mysterious kidney problems. Keep responses 2-3 sentences.`
      },
      mother: {
        name: 'Helen T.', role: 'Mother (phone)', location: 'Available to call', avatar: 'H', color: '#7a4a1a',
        greeting: 'Hello? Yes, this is Helen. Marcus told me you might call. Of course I\'ll help however I can, doctor.',
        systemPrompt: `You are Helen T., 68, Marcus's mother. You are cooperative. ONLY reveal if asked: Your brother (Marcus's maternal uncle) died at 46 — "They said it was his heart, but he was always sickly. He used to complain about burning in his hands and feet for years." Your brother also had kidney problems. You yourself have mild kidney disease Stage 2, unexplained. Keep responses 2-3 sentences.`
      }
    },
    exam: {
      general: [{label:'Appearance',text:'Alert, well-appearing male. No acute distress.',flag:'normal'}],
      heent: [{label:'Eyes',text:'Slit lamp not available in office. Recommend ophthalmology referral if corneal pathology suspected.',flag:'abnormal',flagText:'REFER'}],
      skin: [{label:'Skin',text:'Multiple small (1-3mm) dark-red non-blanching papules on lower abdomen and proximal thighs bilaterally. Present since childhood per patient.',flag:'abnormal',flagText:'KEY FINDING'},{label:'Character',text:'Firm, smooth, non-tender. Consistent with angiokeratomas.',flag:'abnormal',flagText:'ABNORMAL'}],
      cardiac: [{label:'BP',text:'148/92 both arms. Hypertension confirmed.',flag:'abnormal',flagText:'H'},{label:'Heart',text:'Regular rate, no murmurs.',flag:'normal'}],
      pulm: [{label:'Lungs',text:'Clear bilaterally.',flag:'normal'}],
      abdomen: [{label:'Abdomen',text:'Soft, no organomegaly.',flag:'normal'}],
      neuro: [{label:'Temperature sensation',text:'DECREASED sensation to temperature testing in bilateral hands and feet. Patient says this is normal for him.',flag:'abnormal',flagText:'KEY FINDING'},{label:'Motor/Reflexes',text:'5/5 strength, 2+ reflexes, normal coordination.',flag:'normal'}],
      ext: [{label:'Extremities',text:'No edema. Pulses intact.',flag:'normal'}]
    },
    orders: {
      cbc: { name:'CBC', timing:0, relevant:false, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Hemoglobin','13.8','13.5-17.5',''],['WBC','7.2','4.5-11.0',''],['Platelets','218','150-400','']] }},
      bmp: { name:'BMP / CMP', timing:0, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Sodium','139','136-145',''],['Creatinine','1.6 mg/dL','0.7-1.3','H'],['eGFR','58 mL/min','>60','L'],['Glucose','94','70-100','']], note:'eGFR 58 = Stage 3a CKD. Unexplained CKD in a 41-year-old male requires investigation.' }},
      ua: { name:'Urinalysis', timing:0, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Protein','2+','Negative','H'],['Blood','Trace','Negative','H'],['Protein/Cr ratio','0.68','<0.2','H']], note:'Proteinuria with elevated protein/Cr ratio. Glomerular protein leak. Consider nephrology referral.' }},
      agala: { name:'Alpha-galactosidase A (alpha-Gal A)', timing:24, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['alpha-Gal A activity','0.3 nmol/hr/mg','>3.0','C']], note:'CRITICAL: alpha-Gal A severely reduced (<10% of lower normal). Consistent with Fabry disease. GLA sequencing indicated.' }},
      gla: { name:'GLA Gene Sequencing', timing:48, relevant:true, result:{ type:'labs', rows:[['Gene','Variant','Classification','Zygosity'],['GLA','c.901C>T (p.Arg301Trp)','Pathogenic','Hemizygous']], note:'DIAGNOSTIC: Pathogenic hemizygous GLA variant confirmed. Fabry disease diagnosis established. Initiate multidisciplinary management and family cascade testing.' }},
      echo: { name:'Echocardiogram', timing:48, relevant:true, result:{ type:'imaging', report:'ECHOCARDIOGRAM\n\nIVS: 13mm (H, normal <11mm)\nPW: 12mm (H)\nLVEF: 60%\nSmall pericardial effusion (<5mm)\nNo significant valvular disease', impression:'IMPRESSION: Mild concentric LVH with small pericardial effusion. LVH degree atypical for hypertension duration. Consider infiltrative/storage etiology.' }},
      mri: { name:'Brain MRI', timing:48, relevant:true, result:{ type:'imaging', report:'BRAIN MRI\n\nNo acute infarct on DWI.\nScattered T2/FLAIR hyperintensities periventricular white matter bilaterally (Fazekas grade 1).\nNo mass. No microhemorrhages.', impression:'IMPRESSION: White matter changes atypical for age 41. Consider metabolic or storage etiology contributing to small vessel pathology.' }},
      ophtho: { name:'Ophthalmology — Slit Lamp', timing:72, relevant:true, result:{ type:'imaging', report:'OPHTHALMOLOGY CONSULT\n\nSlit lamp: Cornea verticillata present bilaterally\n- Whorl-like spoke-wheel gold-brown deposits\n- Inferior corneal epithelium, bilateral, symmetric\nLens: Clear. Posterior segment: Normal.', impression:'IMPRESSION: Cornea verticillata bilaterally. Pathognomonic for Fabry disease in absence of amiodarone use. Strongly supports diagnosis.' }},
      genetics: { name:'Medical Genetics Referral', timing:0, relevant:true, result:{ type:'imaging', report:'GENETICS REFERRAL PLACED\n\nIndication: Suspected Fabry disease — multiorgan involvement in young male.\nAlpha-Gal A enzyme assay recommended before appointment.\nEstimated appointment: 3-4 weeks.', impression:'Referral accepted.' }}
    },
    badges: {
      acroparesthesias: { trigger: (q,r) => /burn|tingle|hand|feet|sensation|pain.*feet|feet.*pain/i.test(q+r), icon:'&#128293;', label:'Small Fiber Signal', color:'gold', explanation:'You asked about burning/tingling — revealing acroparesthesias since adolescence' },
      sweat: { trigger: (q,r) => /sweat|perspir|anhidros/i.test(q+r), icon:'&#128166;', label:'Autonomic Thinker', color:'blue', explanation:'You asked about sweating — revealing hypohidrosis' },
      maternal: { trigger: (p) => p === 'mother', icon:'&#9742;', label:'Maternal Line', color:'gold', explanation:'You called the mother — unlocking the maternal family history' },
      skin_exam: { trigger: (sys) => sys === 'skin', icon:'&#129340;', label:'Skin Detective', color:'gold', explanation:'You examined the skin — finding angiokeratomas, pathognomonic for Fabry disease' },
      enzyme: { trigger: (orderId) => orderId === 'agala', icon:'&#9879;', label:'Genetic Thinker', color:'gold', explanation:'You ordered alpha-Gal A enzyme assay — the key diagnostic test for Fabry disease' }
    }
  },

  D1: {
    id: 'D1', family: 1,
    patient: { name: 'Priya S.', age: '29F', mrn: 'RDX-1003-D1', visit: 'Fatigue, weight gain' },
    vitals: [{val:'HR 58',flag:true},{val:'Temp 97.1',flag:true},{val:'BMI 24→27',flag:true},{val:'BP 108/68',flag:false}],
    problems: [{name:'Fatigue, chronic',detail:'18 months'},{name:'Weight gain',detail:'8 lbs without dietary change'},{name:'Hair thinning',detail:'3 months'}],
    meds: [{name:'No medications',detail:''}],
    cc: '"I gain weight no matter what I do and I\'m exhausted all the time. I\'m a medical student and I\'ve been attributing it to stress but my mom has a thyroid problem and I\'m starting to wonder."',
    diagnosis: 'Hypothyroidism (Hashimoto\'s Thyroiditis)',
    personas: {
      patient: {
        name: 'Priya S.', role: 'Patient', location: 'In exam room', avatar: 'P', color: '#1a6fa8',
        greeting: 'Hi. I know I probably should have come in sooner. I\'ve been attributing everything to medical school stress but 18 months feels like too long for that.',
        systemPrompt: `You are Priya, a 29-year-old third-year medical student. You are intelligent and self-aware but have been denying your symptoms. You know your mother has a thyroid problem. You are cold all the time, constipated, hair thinning, 8-lb weight gain without dietary change, brain fog affecting studying, irregular periods. You attribute everything to stress. You only mention thyroid family history if asked about family history. Keep responses 2-3 sentences.`
      }
    },
    exam: {
      general: [{label:'Appearance',text:'Alert, slightly slow affect. Well-groomed.',flag:'normal'}],
      skin: [{label:'Skin',text:'Dry, cool to touch. Hair visibly thinned at temples.',flag:'abnormal',flagText:'ABNORMAL'}],
      cardiac: [{label:'Heart rate',text:'58 bpm — bradycardic. No murmurs.',flag:'abnormal',flagText:'BRADYCARDIA'}],
      heent: [{label:'Thyroid',text:'Mildly enlarged, non-tender, diffuse. No nodules palpated.',flag:'abnormal',flagText:'GOITER'}],
      neuro: [{label:'Reflexes',text:'Delayed relaxation phase of deep tendon reflexes bilaterally — classic hypothyroid finding.',flag:'abnormal',flagText:'DELAYED'}],
      ext: [{label:'Extremities',text:'No edema. Skin dry and slightly thickened.',flag:'normal'}],
      pulm: [{label:'Lungs',text:'Clear.',flag:'normal'}],
      abdomen: [{label:'Abdomen',text:'Soft, non-tender.',flag:'normal'}]
    },
    orders: {
      tsh: { name:'TSH', timing:0, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['TSH','14.2 mIU/L','0.4-4.5','H']], note:'TSH markedly elevated. Overt hypothyroidism confirmed.' }},
      ft4: { name:'Free T4', timing:0, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Free T4','0.6 ng/dL','0.8-1.8','L']], note:'Low free T4 confirms overt hypothyroidism.' }},
      tpo: { name:'Anti-TPO Antibodies', timing:2, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Anti-TPO','480 IU/mL','<35','H']], note:'Markedly elevated anti-TPO antibodies confirm Hashimoto\'s thyroiditis as the etiology.' }},
      cbc: { name:'CBC', timing:0, relevant:false, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Hemoglobin','12.8','12.0-16.0',''],['MCV','88','80-100','']], note:'CBC normal. No anemia.' }},
      lipids: { name:'Lipid Panel', timing:2, relevant:false, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Total Cholesterol','218','<200','H'],['LDL','138','<130','H'],['HDL','48','>40','']], note:'Mildly elevated cholesterol — common in hypothyroidism, will improve with treatment.' }}
    },
    badges: {
      bradycardia: { trigger: (sys) => sys === 'cardiac', icon:'&#128149;', label:'Objective Finder', color:'gold', explanation:'You examined the heart — finding bradycardia, an objective sign of hypothyroidism' },
      family_thyroid: { trigger: (q,r) => /family|mother|thyroid|heredit/i.test(q+r), icon:'&#128101;', label:'Family History', color:'blue', explanation:'You asked about family history — revealing maternal thyroid disease' },
      reflexes: { trigger: (sys) => sys === 'neuro', icon:'&#129504;', label:'Reflex Tester', color:'blue', explanation:'You tested reflexes — finding delayed relaxation, classic for hypothyroidism' }
    }
  },

  E1: {
    id: 'E1', family: 1,
    patient: { name: 'James P.', age: '52M', mrn: 'RDX-1004-E1', visit: 'Fatigue, daytime sleepiness' },
    vitals: [{val:'BP 148/88',flag:true},{val:'BMI 32',flag:true},{val:'HR 78',flag:false},{val:'Neck 17in',flag:true}],
    problems: [{name:'Fatigue, severe daytime',detail:'2 years — falls asleep at desk'},{name:'Hypertension',detail:'On lisinopril'},{name:'Obesity',detail:'BMI 32'}],
    meds: [{name:'Lisinopril 10mg',detail:'Daily'},{name:'Ibuprofen PRN',detail:'OTC'}],
    cc: '"I fall asleep at my desk and I can\'t understand why — I sleep 8 hours every night. My wife says I snore loudly and sometimes stop breathing."',
    diagnosis: 'Obstructive Sleep Apnea (OSA), severe',
    personas: {
      patient: {
        name: 'James P.', role: 'Patient', location: 'In exam room', avatar: 'J', color: '#1a6fa8',
        greeting: 'Hi doctor. I\'m a high school teacher and I\'m falling asleep at my desk during free periods. I sleep 8 hours but wake up exhausted every morning.',
        systemPrompt: `You are James, a 52-year-old high school teacher. You fall asleep at your desk, struggle to stay awake driving, and fall asleep watching TV within minutes. You sleep 8 hours but wake unrefreshed. You have morning headaches 3-4 days/week. Your wife reports loud snoring with episodes where you stop breathing and gasp. You're on lisinopril for hypertension. If asked about driving: you drive 20 minutes to work daily. Keep responses 2-3 sentences.`
      },
      spouse: {
        name: 'Carol P.', role: 'Wife', location: 'In waiting room', avatar: 'C', color: '#2a7a50',
        greeting: 'I insisted he come in. The snoring is terrible and I\'ve seen him stop breathing and then gasp — it\'s frightening.',
        systemPrompt: `You are Carol, James's wife. You witness loud snoring every night, episodes where James stops breathing for 10-20 seconds then gasps awake. You sleep in a separate room now. He falls asleep in 2-3 minutes whenever he sits down. You're worried about him driving. Keep responses 2-3 sentences.`
      }
    },
    exam: {
      general: [{label:'Appearance',text:'Alert, obese male. Sleepy-appearing.',flag:'normal'}],
      heent: [{label:'Oropharynx',text:'Mallampati class III. Crowded oropharynx. Uvula visible. Large tongue. Short neck.',flag:'abnormal',flagText:'HIGH RISK OSA'}],
      cardiac: [{label:'BP',text:'148/88 — elevated despite lisinopril. Refractory hypertension.',flag:'abnormal',flagText:'H'},{label:'Heart',text:'Regular rate, no murmurs.',flag:'normal'}],
      pulm: [{label:'Lungs',text:'Clear bilaterally.',flag:'normal'}],
      neuro: [{label:'Neurologic',text:'Alert. Epworth Sleepiness Scale administered: 18/24 (severe daytime sleepiness; normal <10).',flag:'abnormal',flagText:'SEVERE ESS'}],
      abdomen: [{label:'Abdomen',text:'Obese, soft, non-tender.',flag:'normal'}],
      skin: [{label:'Skin',text:'No rashes.',flag:'normal'}],
      ext: [{label:'Extremities',text:'No edema.',flag:'normal'}]
    },
    orders: {
      cbc: { name:'CBC', timing:0, relevant:false, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Hemoglobin','15.2','13.5-17.5',''],['WBC','7.8','4.5-11.0','']], note:'CBC normal.' }},
      tsh: { name:'TSH', timing:0, relevant:false, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['TSH','2.1','0.4-4.5','']], note:'TSH normal. Hypothyroidism excluded.' }},
      sleep: { name:'Home Sleep Study', timing:24, relevant:true, result:{ type:'imaging', report:'HOME SLEEP STUDY RESULTS\n\nApnea-Hypopnea Index (AHI): 34 events/hour\nSeverity: SEVERE (>30 = severe OSA)\nMinimum O2 saturation: 82%\nAverage O2 saturation: 91%\nTotal sleep time monitored: 6.4 hours', impression:'IMPRESSION: Severe obstructive sleep apnea. AHI 34 with significant nocturnal hypoxia (minimum sat 82%). CPAP therapy indicated. Driving safety counseling mandatory.' }},
      cxr: { name:'Chest X-ray', timing:0, relevant:false, result:{ type:'imaging', report:'CHEST X-RAY\n\nNormal cardiac silhouette. Clear lungs. No infiltrates.', impression:'Normal.' }}
    },
    badges: {
      witnessed: { trigger: (q,r) => /snor|apnea|stop breath|gasp|witness/i.test(q+r), icon:'&#128172;', label:'Collateral History', color:'gold', explanation:'You asked about witnessed apneas — the most specific OSA finding' },
      driving: { trigger: (q,r) => /driv|car|commut|safe/i.test(q+r), icon:'&#128663;', label:'Safety First', color:'gold', explanation:'You asked about driving — ESS 18 is a documented driving impairment risk' },
      epworth: { trigger: (sys) => sys === 'neuro', icon:'&#128203;', label:'Epworth Scorer', color:'blue', explanation:'You assessed daytime sleepiness — ESS 18/24 indicates severe impairment' }
    }
  },

  Raymond: {
    id: 'Raymond', family: 1,
    patient: { name: 'Raymond J.', age: '68M', mrn: 'RDX-1005-R', visit: 'Fatigue, shortness of breath' },
    vitals: [{val:'BP 128/78',flag:false},{val:'HR 92',flag:true},{val:'BMI 24 (↓from 26)',flag:true},{val:'Pallor',flag:true}],
    problems: [{name:'Fatigue, progressive',detail:'6 months'},{name:'Unintentional weight loss',detail:'8 lbs over 4 months'},{name:'No colonoscopy in 10 years',flag:true,detail:'Last at age 58'}],
    meds: [{name:'Atorvastatin 40mg',detail:'Daily'},{name:'Aspirin 81mg',detail:'Daily'}],
    cc: '"I\'ve been tired and a bit short of breath — I thought it was just getting older. My wife made me come in."',
    diagnosis: 'Colorectal Adenocarcinoma (presenting as iron deficiency anemia)',
    personas: {
      patient: {
        name: 'Raymond J.', role: 'Patient', location: 'In exam room', avatar: 'R', color: '#1a6fa8',
        greeting: 'Hi doc. I\'ll be honest, I feel fine mostly. My wife is the one who worried. I\'ve been a bit tired and short of breath going up stairs but I figured that\'s getting older.',
        systemPrompt: `You are Raymond, a 68-year-old retired teacher. You've been tired for 6 months and notice shortness of breath climbing stairs. You lost 8 lbs without trying over 4 months. ONLY IF ASKED: You've noticed your stools have been darker than usual for "a few months." You haven't had a colonoscopy since age 58 — 10 years ago. No family history of colon cancer you know of. Keep responses 2-3 sentences.`
      }
    },
    exam: {
      general: [{label:'Appearance',text:'Pale-appearing male. Conjunctival pallor notable.',flag:'abnormal',flagText:'PALE'}],
      heent: [{label:'Conjunctivae',text:'Markedly pale — significant anemia.',flag:'abnormal',flagText:'CRITICAL'}],
      abdomen: [{label:'Abdomen',text:'Soft. Mild fullness in left lower quadrant. No guarding. No palpable mass on surface exam.',flag:'abnormal',flagText:'NOTE'}],
      cardiac: [{label:'Heart',text:'Regular rate, HR 92. No murmurs. Tachycardia may reflect anemia.',flag:'abnormal',flagText:'TACHYCARDIC'}],
      pulm: [{label:'Lungs',text:'Clear bilaterally.',flag:'normal'}],
      skin: [{label:'Skin',text:'Pale, dry. No jaundice.',flag:'normal'}],
      neuro: [{label:'Neurologic',text:'Normal.',flag:'normal'}],
      ext: [{label:'Extremities',text:'No edema.',flag:'normal'}]
    },
    orders: {
      cbc: { name:'CBC', timing:0, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Hemoglobin','8.2 g/dL','13.5-17.5','L'],['MCV','69 fL','80-100','L'],['WBC','8.1','4.5-11.0',''],['Platelets','380','150-400','']], note:'Moderate microcytic anemia in a 68-year-old male. GI source must be excluded.' }},
      iron: { name:'Iron Studies', timing:2, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['Ferritin','4 ng/mL','24-336','L'],['TIBC','410 mcg/dL','250-370','H']], note:'Critically depleted iron stores. Iron deficiency in a male requires GI source identification.' }},
      fobt: { name:'Fecal Occult Blood Test', timing:0, relevant:true, result:{ type:'labs', rows:[['Test','Result','Reference','Flag'],['FOBT','POSITIVE','Negative','C']], note:'POSITIVE fecal occult blood. Urgent colonoscopy required.' }},
      colonoscopy: { name:'Urgent Colonoscopy Referral', timing:0, relevant:true, result:{ type:'imaging', report:'URGENT COLONOSCOPY REFERRAL\n\nIndication: Iron deficiency anemia + positive FOBT in 68-year-old male.\nPriority: Urgent (within 2 weeks)\n\nResult (completed):\n3.5cm partially obstructing mass, sigmoid colon.\nBiopsy: Moderately differentiated adenocarcinoma.\nCT chest/abdomen: No distant metastases.\nStage: IIB colorectal cancer.', impression:'Colorectal adenocarcinoma confirmed. Surgical oncology referral placed.' }}
    },
    badges: {
      dark_stools: { trigger: (q,r) => /stool|bowel|dark|black|blood|rectal|change.*habit/i.test(q+r), icon:'&#9888;', label:'GI Alert', color:'gold', explanation:'You asked about stool changes — revealing dark stools for several months' },
      colonoscopy: { trigger: (q,r) => /colonoscopy|colon|screen|last.*exam/i.test(q+r), icon:'&#128270;', label:'Surveillance Tracker', color:'blue', explanation:'You asked about colonoscopy history — finding it was overdue by 3 years' },
      fobt_order: { trigger: (orderId) => orderId === 'fobt', icon:'&#128203;', label:'GI Thinker', color:'gold', explanation:'You ordered fecal occult blood test — positive result mandates colonoscopy' }
    }
  }
};

// Export for use
if (typeof window !== 'undefined') window.EMR_CASES = EMR_CASES;

// ── FAMILY 2: INFECTIONS ─────────────────────────────────

EMR_CASES.C = {
  id:'C', family:2,
  patient:{name:'Liam K.',age:'5M',mrn:'RDX-2001-C',visit:'Recurrent pneumonia — 3rd episode'},
  vitals:[{val:'Temp 38.2',flag:true},{val:'RR 24',flag:true},{val:'O2 96%',flag:false},{val:'HR 110',flag:false}],
  problems:[{name:'Pneumonia, recurrent',detail:'3rd episode in 18 months — all bacterial'},{name:'Failure to fully clear infections',detail:'Prolonged courses needed'}],
  meds:[{name:'Amoxicillin',detail:'Current course — improving'}],
  cc:'"He just keeps getting sick — this is his third pneumonia in 18 months. We thought it was daycare but this seems like too much."',
  diagnosis:'X-linked Agammaglobulinemia (XLA, BTK gene)',
  personas:{
    patient:{name:'Liam K.',role:'Patient',location:'In exam room (with parents)',avatar:'L',color:'#1e8449',greeting:'...(Liam is 5 and quiet, lets his parents speak for him)',systemPrompt:`You are Liam, a quiet 5-year-old boy. You are shy and let your parents answer. If asked direct simple questions, answer in very short child-like responses. "I don't know" or "my tummy hurts" type answers.`},
    parent:{name:'Sarah K.',role:'Mother',location:'At bedside',avatar:'S',color:'#1a6fa8',greeting:'Thank you for seeing us. This is his third pneumonia and we\'re really worried. The daycare keeps sending other kids home sick but Liam always gets it the worst.',systemPrompt:`You are Sarah, Liam's mother. You are worried. All three infections have been bacterial pneumonias requiring antibiotics. He was healthy until age 18 months. ONLY IF ASKED: A maternal uncle died of a "chest infection" at age 8 in another country — you don't know details. Liam has no serious viral infections, his colds resolve normally. He has no tonsils visible (they've always been small). Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Ill-appearing child, mildly distressed. Alert.',flag:'abnormal',flagText:'ILL'}],
    heent:[{label:'Tonsils',text:'Absent/extremely small tonsils. Lymph nodes not palpable in cervical chain.',flag:'abnormal',flagText:'KEY FINDING'},{label:'Note',text:'Absent tonsils in a child with recurrent infections = absent B cells (lymphoid tissue requires B cells to develop).',flag:'abnormal',flagText:'NOTE'}],
    pulm:[{label:'Lungs',text:'Decreased breath sounds right lower lobe. Dullness to percussion. Consistent with RLL consolidation.',flag:'abnormal',flagText:'CONSOLIDATION'}],
    cardiac:[{label:'Heart',text:'Regular rate, no murmurs. Tachycardic at 110.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Soft, no organomegaly.',flag:'normal'}],
    skin:[{label:'Skin',text:'No rashes.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Age-appropriate.',flag:'normal'}],
    ext:[{label:'Extremities',text:'No edema.',flag:'normal'}]
  },
  orders:{
    cbc:{name:'CBC with Differential',timing:0,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['WBC','14.2 K/uL','5.0-15.5','H'],['Neutrophils','82%','50-70%','H'],['Lymphocytes','12%','25-45%','L'],['Hemoglobin','12.1','11.5-14.5','']],note:'Neutrophilia consistent with bacterial infection. Low lymphocytes — investigate.'}},
    igg:{name:'Serum Immunoglobulins (IgG, IgA, IgM)',timing:2,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['IgG','<100 mg/dL','>700','C'],['IgA','Undetectable','>70','C'],['IgM','Undetectable','>50','C']],note:'CRITICAL: All immunoglobulin classes severely depressed or absent. Primary immune deficiency confirmed.'}},
    flow:{name:'Lymphocyte Subset Panel (Flow Cytometry)',timing:24,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['B cells (CD19+)','0%','7-23%','C'],['T cells (CD3+)','68%','55-78%',''],['NK cells','22%','5-20%','']],note:'CRITICAL: Absent B cells (0%). T cells and NK cells normal. Pattern confirms agammaglobulinemia — XLA most likely in male with absent B cells.'}},
    btk:{name:'BTK Gene Sequencing',timing:48,relevant:true,result:{type:'labs',rows:[['Gene','Variant','Classification','Zygosity'],['BTK','c.1684T>C (p.Tyr562His)','Pathogenic','Hemizygous']],note:'DIAGNOSTIC: Pathogenic hemizygous BTK variant confirmed. XLA diagnosis established. Start IVIG immediately. Family cascade testing — mother is obligate carrier.'}},
    cxr:{name:'Chest X-ray',timing:0,relevant:true,result:{type:'imaging',report:'CHEST X-RAY PA\n\nRight lower lobe consolidation consistent with pneumonia.\nNo pleural effusion.\nLeft lung clear.',impression:'RLL pneumonia. Third episode in 18 months.'}}
  },
  badges:{
    tonsils:{trigger:(sys)=>sys==='heent',icon:'&#128270;',label:'Absent Tonsils',color:'gold',explanation:'You examined the oropharynx — absent tonsils in XLA (no B cells = no lymphoid tissue)'},
    organism:{trigger:(q,r)=>/bacteria|organism|culture|what.*type|type.*infection/i.test(q+r),icon:'&#129440;',label:'Organism Thinker',color:'gold',explanation:'You asked about infection type — all bacterial, never serious viral = humoral deficiency pattern'},
    family:{trigger:(q,r)=>/family|uncle|relative|history/i.test(q+r),icon:'&#128101;',label:'Family Historian',color:'blue',explanation:'You asked about family history — revealing maternal uncle who died of chest infection in childhood'}
  }
};

EMR_CASES.D = {
  id:'D', family:2,
  patient:{name:'Noah B.',age:'4M',mrn:'RDX-2002-D',visit:'Recurrent infections — parental concern'},
  vitals:[{val:'Temp 98.6',flag:false},{val:'RR 18',flag:false},{val:'O2 99%',flag:false},{val:'Well-appearing',flag:false}],
  problems:[{name:'Recurrent URIs',detail:'6-8 per year — all viral'},{name:'Otitis media x1',detail:'Treated outpatient'}],
  meds:[{name:'No medications',detail:''}],
  cc:'"He keeps getting sick — we\'ve been to urgent care three times this year. Is something wrong with his immune system?"',
  diagnosis:'Normal immune development — recurrent viral URIs typical of daycare',
  personas:{
    parent:{name:'Emily B.',role:'Mother',location:'In exam room',avatar:'E',color:'#1a6fa8',greeting:'Hi doctor. I know this might seem like a lot but Noah has been to urgent care three times this year and I\'m worried something is wrong with his immune system.',systemPrompt:`You are Emily, Noah's mother. You are anxious but your child is healthy. The three urgent care visits were for 2 viral URIs and 1 otitis media. Noah is fully vaccinated, growing normally at the 55th percentile, completely well between episodes. His older sister goes to the same daycare and gets sick at the same rate. No family history of immune problems. Noah has never been hospitalized. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Well-appearing, happy, active 4-year-old. No acute distress.',flag:'normal'}],
    heent:[{label:'Tonsils',text:'Normal-sized tonsils present bilaterally. Cervical lymph nodes: small, mobile, non-tender (normal).',flag:'normal'},{label:'Note',text:'Normal tonsils = normal B cell development. Reassuring finding.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear bilaterally. No wheeze, no crackles.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular, no murmurs.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Soft, no organomegaly.',flag:'normal'}],
    skin:[{label:'Skin',text:'No rashes.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Age-appropriate. Active and playful.',flag:'normal'}],
    ext:[{label:'Extremities',text:'No edema.',flag:'normal'}]
  },
  orders:{
    cbc:{name:'CBC',timing:0,relevant:false,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['WBC','9.2','5.0-15.5',''],['Lymphocytes','38%','25-45%',''],['Hemoglobin','12.6','11.5-14.5','']],note:'CBC completely normal. No immune abnormality.'}},
    igg:{name:'Serum Immunoglobulins',timing:2,relevant:false,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['IgG','780 mg/dL','>700',''],['IgA','85 mg/dL','>70',''],['IgM','95 mg/dL','>50','']],note:'Immunoglobulins normal for age. No immune deficiency.'}}
  },
  badges:{
    infection_type:{trigger:(q,r)=>/type|bacteria|viral|organism|what kind/i.test(q+r),icon:'&#128270;',label:'Pattern Thinker',color:'gold',explanation:'You asked about infection type — viral URIs + one otitis media is normal, not pathologic'},
    sibling:{trigger:(q,r)=>/sister|brother|sibling|other child|same rate/i.test(q+r),icon:'&#128101;',label:'Environmental Eye',color:'blue',explanation:'You asked about siblings — same illness rate = environmental (daycare), not immune deficiency'},
    growth:{trigger:(q,r)=>/grow|weight|height|percentile|develop/i.test(q+r),icon:'&#128202;',label:'Growth Tracker',color:'blue',explanation:'You asked about growth — normal trajectory is reassuring against immune deficiency'}
  }
};

EMR_CASES.C2 = {
  id:'C2', family:2,
  patient:{name:'Elena V.',age:'28F',mrn:'RDX-2003-C2',visit:'Recurrent sinusitis, fatigue'},
  vitals:[{val:'Temp 37.8',flag:false},{val:'HR 82',flag:false},{val:'BP 118/72',flag:false},{val:'BMI 21',flag:false}],
  problems:[{name:'Sinusitis, recurrent',detail:'4 episodes in 18 months — all bacterial'},{name:'Pneumonia x1',detail:'Age 25, required hospitalization'},{name:'Fatigue',detail:'Chronic, low-grade'}],
  meds:[{name:'Amoxicillin-clavulanate',detail:'Current course'}],
  cc:'"I keep getting sinus infections — four in the last year and a half. I was hospitalized for pneumonia three years ago. My allergist thought I might have an immune problem."',
  diagnosis:'Common Variable Immune Deficiency (CVID)',
  personas:{
    patient:{name:'Elena V.',role:'Patient',location:'In exam room',avatar:'E',color:'#1a6fa8',
    greeting:'Hi. My allergist referred me because she thought my infections might be more than just allergies.',
    systemPrompt:`You are Elena, a 28-year-old teacher. You've had recurrent bacterial infections since your mid-20s — all bacterial sinusitis, one pneumonia requiring hospitalization. You were healthy as a child (immune deficiency onset in young adulthood is classic for CVID). If asked: you had normal childhood vaccinations. You have mild GI symptoms — loose stools, bloating. No family immune history you know of. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Well-appearing young woman.',flag:'normal'}],
    heent:[{label:'Sinuses',text:'Tenderness on palpation over maxillary sinuses bilaterally.',flag:'abnormal',flagText:'TENDERNESS'},{label:'Tonsils',text:'Normal tonsils present.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Soft. Mild diffuse tenderness. No organomegaly.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear bilaterally.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular, no murmurs.',flag:'normal'}],
    skin:[{label:'Skin',text:'No rashes.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Normal.',flag:'normal'}],
    ext:[{label:'Extremities',text:'No edema.',flag:'normal'}]
  },
  orders:{
    igg:{name:'Serum Immunoglobulins',timing:2,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['IgG','280 mg/dL','>700','C'],['IgA','18 mg/dL','>90','C'],['IgM','22 mg/dL','>50','C']],note:'CRITICAL: All immunoglobulin classes significantly depressed in an adult. Pattern consistent with CVID. Onset in young adulthood distinguishes from XLA.'}},
    flow:{name:'Lymphocyte Subset Panel',timing:24,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['B cells (CD19+)','8%','7-23%',''],['T cells (CD3+)','62%','55-78%',''],['Memory B cells','<1%','normal >27%','C']],note:'B cells present but non-functional memory B cells. Classic CVID pattern — B cells exist but fail to mature to antibody-secreting plasma cells.'}},
    vaccine:{name:'Vaccine Titer Testing',timing:24,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['Tetanus IgG','<0.1 IU/mL','>0.1','C'],['Pneumococcal','Non-protective','Protective >1.3','C']],note:'Failed to mount protective antibody responses to vaccines. Confirms functional antibody deficiency.'}}
  },
  badges:{
    adult_onset:{trigger:(q,r)=>/when.*start|child|young|onset|how long/i.test(q+r),icon:'&#9200;',label:'Onset Timeline',color:'gold',explanation:'You asked about onset — adult onset distinguishes CVID from XLA (childhood onset)'},
    gi:{trigger:(q,r)=>/gi|bowel|diarrhea|stool|gut|digest/i.test(q+r),icon:'&#129704;',label:'GI Involvement',color:'blue',explanation:'You asked about GI symptoms — CVID commonly causes GI complications'},
    vaccine:{trigger:(orderId)=>orderId==='vaccine',icon:'&#9733;',label:'Vaccine Titer',color:'gold',explanation:'You ordered vaccine titers — failure to respond confirms functional antibody deficiency'}
  }
};

EMR_CASES.D2 = {
  id:'D2', family:2,
  patient:{name:'Carlos M.',age:'19M',mrn:'RDX-2004-D2',visit:'Recurrent infections — college student'},
  vitals:[{val:'Temp 38.1',flag:true},{val:'HR 96',flag:false},{val:'BP 122/78',flag:false},{val:'BMI 22',flag:false}],
  problems:[{name:'Cellulitis, recurrent',detail:'3 episodes in 2 years'},{name:'Abscess, skin',detail:'Required I&D x2'},{name:'Current: left leg cellulitis',detail:''}],
  meds:[{name:'Cephalexin',detail:'Current course'}],
  cc:'"I keep getting skin infections — three cellulitis episodes and two abscesses in two years. My doctor thinks I might be a staph carrier."',
  diagnosis:'Staphylococcal skin infections — SARS decolonization candidate (normal immunity)',
  personas:{
    patient:{name:'Carlos M.',role:'Patient',location:'In exam room',avatar:'C',color:'#1a6fa8',
    greeting:'Hi. I\'m a college wrestler and I keep getting these skin infections. My teammates get them too but mine seem to need more treatment.',
    systemPrompt:`You are Carlos, a 19-year-old college wrestler. You get recurrent staph skin infections — common in wrestlers (contact sport, shared mats). No serious internal infections, no pneumonia, no bacteremia. You share a wrestling mat. You pick at skin abrasions. You use a shared locker room. Your infections are all skin/soft tissue — never internal. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Athletic young man. Left leg erythema and warmth.',flag:'normal'}],
    skin:[{label:'Left leg',text:'8x6cm erythema, warm, tender, no fluctuance. Consistent with non-purulent cellulitis.',flag:'abnormal',flagText:'ACTIVE CELLULITIS'},{label:'Scars',text:'Two healed I&D scars on right arm and trunk.',flag:'normal'}],
    heent:[{label:'Tonsils',text:'Normal tonsils. No lymphadenopathy.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular, no murmurs.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Normal.',flag:'normal'}],
    ext:[{label:'Extremities',text:'No other lesions.',flag:'normal'}]
  },
  orders:{
    cbc:{name:'CBC',timing:0,relevant:false,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['WBC','11.2','4.5-11.0',''],['Neutrophils','72%','50-70%',''],['Hemoglobin','15.1','13.5-17.5','']],note:'Mild leukocytosis consistent with active infection. Normal differential.'}},
    igg:{name:'Serum Immunoglobulins',timing:2,relevant:false,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['IgG','940 mg/dL','>700',''],['IgA','180 mg/dL','>90',''],['IgM','110 mg/dL','>50','']],note:'Immunoglobulins completely normal. No humoral immune deficiency.'}},
    culture:{name:'Wound Culture / Nasal Swab',timing:24,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['Wound culture','S. aureus (MSSA)','',''],['Nasal swab','S. aureus carrier','','']],note:'MSSA confirmed. Nasal carriage identified. Decolonization protocol (mupirocin nasal ointment + chlorhexidine washes) recommended. Environmental cleaning of wrestling equipment.'}}
  },
  badges:{
    sport:{trigger:(q,r)=>/sport|wrestl|team|mat|locker|contact/i.test(q+r),icon:'&#127946;',label:'Environmental Thinker',color:'gold',explanation:'You asked about sports/contact — wrestling mats are classic MRSA/MSSA transmission vectors'},
    carrier:{trigger:(q,r)=>/carrier|coloniz|nasal|nares|nose/i.test(q+r),icon:'&#129440;',label:'Carrier Concept',color:'blue',explanation:'You asked about staph carriage — nasal colonization drives recurrent skin infections'},
    no_internal:{trigger:(q,r)=>/pneumonia|blood|bacteremia|internal|organ/i.test(q+r),icon:'&#128270;',label:'Pattern Recognizer',color:'gold',explanation:'You asked about internal infections — all skin/soft tissue pattern argues against immune deficiency'}
  }
};

EMR_CASES.E2 = {
  id:'E2', family:2,
  patient:{name:'Diego R.',age:'22M',mrn:'RDX-2005-E2',visit:'Recurrent pulmonary infections, malabsorption'},
  vitals:[{val:'Temp 38.4',flag:true},{val:'O2 93%',flag:true},{val:'BMI 17.8',flag:true},{val:'RR 22',flag:true}],
  problems:[{name:'Recurrent pulmonary infections',detail:'Pseudomonas, Staph — since childhood'},{name:'Malabsorption/steatorrhea',detail:'Chronic'},{name:'Underweight',detail:'BMI 17.8, height 5\'11"'}],
  meds:[{name:'Creon (pancreatic enzymes)',detail:'With meals'},{name:'Inhaled tobramycin',detail:'Alternating months'}],
  cc:'"I have cystic fibrosis — I was diagnosed at age 3. I\'m here for my annual pulmonary visit and I\'ve been having more exacerbations lately."',
  diagnosis:'Cystic Fibrosis — pulmonary exacerbation',
  personas:{
    patient:{name:'Diego R.',role:'Patient',location:'In exam room',avatar:'D',color:'#1a6fa8',
    greeting:'Hi. I\'ve had CF my whole life. I know my lungs better than anyone. I\'ve been having more coughing and my FEV1 is down from my baseline.',
    systemPrompt:`You are Diego, a 22-year-old with known cystic fibrosis diagnosed age 3. You are medically knowledgeable about your condition. You take pancreatic enzymes, inhaled antibiotics, and airway clearance twice daily. You've had 3 pulmonary exacerbations this year vs 1-2 per year baseline. Your FEV1 baseline is 68% predicted. You have clubbing of fingers. Sputum has been more purulent. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Thin, underweight male. Mild respiratory distress.',flag:'abnormal',flagText:'DISTRESS'}],
    pulm:[{label:'Lungs',text:'Diffuse coarse crackles bilaterally. Prolonged expiratory phase. Wheezing.',flag:'abnormal',flagText:'ABNORMAL'},{label:'Barrel chest',text:'Mild barrel chest deformity from chronic hyperinflation.',flag:'abnormal',flagText:'NOTE'}],
    ext:[{label:'Clubbing',text:'Digital clubbing bilaterally — from chronic hypoxia.',flag:'abnormal',flagText:'CLUBBING'}],
    heent:[{label:'Sinuses',text:'Chronic nasal polyps visible.',flag:'abnormal',flagText:'POLYPS'}],
    cardiac:[{label:'Heart',text:'Regular. No cor pulmonale signs currently.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Soft. No hepatomegaly. Pancreatic insufficiency managed with enzymes.',flag:'normal'}],
    skin:[{label:'Skin',text:'No rashes.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Normal.',flag:'normal'}]
  },
  orders:{
    pfts:{name:'Pulmonary Function Tests',timing:0,relevant:true,result:{type:'labs',rows:[['Test','Result','% Predicted','Trend'],['FEV1','1.82L','61%','↓ from 68% baseline'],['FVC','2.91L','71%',''],['FEV1/FVC','0.63','','Obstructive']],note:'FEV1 down 7% from personal baseline. Obstructive pattern consistent with CF exacerbation.'}},
    culture:{name:'Sputum Culture',timing:24,relevant:true,result:{type:'labs',rows:[['Organism','Quantity','Sensitivity'],['P. aeruginosa (mucoid)','Heavy','See report'],['S. aureus (MRSA)','Moderate','Vancomycin S']],note:'Mucoid Pseudomonas — characteristic of CF. MRSA co-infection present. IV antibiotics recommended for this exacerbation.'}},
    cxr:{name:'Chest X-ray',timing:0,relevant:true,result:{type:'imaging',report:'CHEST X-RAY\n\nBilateral bronchiectasis, upper lobe predominant.\nNew right upper lobe infiltrate consistent with exacerbation.\nHyperinflation. Flattened diaphragms.', impression:'CF with new RUL infiltrate. Pulmonary exacerbation confirmed.'}}
  },
  badges:{
    cftr:{trigger:(q,r)=>/cftr|mutation|genotype|gene|f508/i.test(q+r),icon:'&#129516;',label:'CFTR Thinker',color:'blue',explanation:'You asked about CFTR mutation — F508del is the most common CF mutation'},
    baseline:{trigger:(q,r)=>/baseline|usual|normal.*fev|fev.*normal|how.*usually/i.test(q+r),icon:'&#128202;',label:'Baseline Tracker',color:'gold',explanation:'You asked about baseline FEV1 — essential for assessing exacerbation severity'},
    modulator:{trigger:(q,r)=>/trikafta|elexacaftor|modulator|cftr.*modulator/i.test(q+r),icon:'&#9877;',label:'Modulator Aware',color:'gold',explanation:'You asked about CFTR modulators — Trikafta has transformed CF outcomes'}
  }
};

// ── FAMILY 3: DEVELOPMENTAL CONCERNS ──────────────────────

EMR_CASES.A3 = {
  id:'A3', family:3,
  patient:{name:'Aiden C.',age:'3M',mrn:'RDX-3001-A3',visit:'Developmental delay — speech and motor'},
  vitals:[{val:'Weight 50th %',flag:false},{val:'Height 48th %',flag:false},{val:'HC 52nd %',flag:false},{val:'Alert',flag:false}],
  problems:[{name:'Speech delay',detail:'10 words at age 3 (expected 50+ words)'},{name:'Motor delay',detail:'Just walking at 20 months'},{name:'Hypotonia',detail:'Since infancy'}],
  meds:[{name:'No medications',detail:''}],
  cc:'"Aiden is 3 and only says about 10 words. He walked late — at 20 months. He\'s in early intervention but he doesn\'t seem to be catching up."',
  diagnosis:'Down Syndrome (Trisomy 21) — presenting for developmental evaluation',
  personas:{
    parent:{name:'Jennifer C.',role:'Mother',location:'In exam room',avatar:'J',color:'#1a6fa8',
    greeting:'Hi. We knew Aiden had Down syndrome from birth — the amniocentesis confirmed it. We\'re here because we\'re wondering about his development compared to other kids with DS.',
    systemPrompt:`You are Jennifer, Aiden's mother. You have known about his Down syndrome since birth. You are engaged and proactive. Aiden has been receiving early intervention since age 6 months. He has hypothyroidism (on levothyroxine). He had an AV canal repair at age 6 months. You want to know what to expect developmentally and what screening he needs. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Happy, engaging toddler with characteristic Down syndrome features: upslanting palpebral fissures, epicanthal folds, flat nasal bridge, small ears.',flag:'normal'}],
    heent:[{label:'Features',text:'Classic DS facial features. Single palmar crease bilaterally.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Well-healed sternotomy scar. No murmurs — AV canal repaired.',flag:'normal'}],
    neuro:[{label:'Tone',text:'Mild generalized hypotonia. Reflexes 2+ but slightly delayed.',flag:'abnormal',flagText:'HYPOTONIA'},{label:'Development',text:'10 words (expected 50+). Points, waves, eye contact good. No autistic features.',flag:'abnormal',flagText:'DELAY'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Soft, no organomegaly.',flag:'normal'}],
    skin:[{label:'Skin',text:'Dry skin. No rashes.',flag:'normal'}],
    ext:[{label:'Extremities',text:'Joint laxity present. Flat feet.',flag:'normal'}]
  },
  orders:{
    tsh:{name:'TSH (annual DS screening)',timing:0,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['TSH','3.1','0.5-4.5',''],['Free T4','1.1','0.8-1.8','']],note:'Thyroid function stable on current levothyroxine dose.'}},
    neck_xray:{name:'Cervical Spine X-ray (C1-C2 stability)',timing:24,relevant:true,result:{type:'imaging',report:'CERVICAL SPINE X-RAY FLEXION/EXTENSION\n\nAtlantodens interval: 3mm (normal <4.5mm in children)\nNo instability.\nNo subluxation.',impression:'No atlantoaxial instability. Annual screening recommended per DS guidelines.'}},
    audiology:{name:'Audiology Referral',timing:0,relevant:true,result:{type:'imaging',report:'AUDIOLOGY REFERRAL PLACED\n\nIndication: Annual hearing screen — DS (middle ear disease risk)\nResult: Mild conductive hearing loss bilateral, 25dB.\nRecommendation: ENT referral for PE tube consideration.',impression:'Mild conductive hearing loss likely contributing to speech delay.'}}
  },
  badges:{
    thyroid_screen:{trigger:(orderId)=>orderId==='tsh',icon:'&#9877;',label:'Annual Screener',color:'gold',explanation:'DS requires annual TSH — hypothyroidism worsens developmental outcomes'},
    hearing:{trigger:(orderId)=>orderId==='audiology',icon:'&#128266;',label:'Hearing First',color:'gold',explanation:'Hearing loss is a major modifiable contributor to speech delay in DS'},
    atlantoaxial:{trigger:(q,r)=>/neck|spine|atlanto|instability|c1|c2/i.test(q+r),icon:'&#127358;',label:'Safety Screen',color:'blue',explanation:'You asked about neck stability — atlantoaxial instability screening is mandatory in DS before sports'}
  }
};

EMR_CASES.B3 = {
  id:'B3', family:3,
  patient:{name:'Lily H.',age:'18M',mrn:'RDX-3002-B3',visit:'Developmental regression — lost words'},
  vitals:[{val:'Weight 45th %',flag:false},{val:'HC 50th %',flag:false},{val:'Temp 98.6',flag:false},{val:'Alert',flag:false}],
  problems:[{name:'Developmental regression',detail:'Lost 6 words at 18 months'},{name:'Decreased eye contact',detail:'Worsening over 3 months'},{name:'Repetitive behaviors',detail:'Hand-wringing, rocking'}],
  meds:[{name:'No medications',detail:''}],
  cc:'"Lily said 6 words and then stopped. She used to look at us and now she doesn\'t as much. She rocks and wrings her hands. Something changed around 15 months."',
  diagnosis:'Rett Syndrome (MECP2 gene, X-linked)',
  personas:{
    parent:{name:'Michelle H.',role:'Mother',location:'In exam room',avatar:'M',color:'#1a6fa8',
    greeting:'I\'ve been so scared. She was developing normally and then around 15 months she just... stopped. She lost her words and she doesn\'t make eye contact like she used to.',
    systemPrompt:`You are Michelle, Lily's mother. You are frightened and grieving. Lily had NORMAL development to 15 months — this is a TRUE regression. She had 6 words, waved, pointed, and had good eye contact. Then over 3 months she lost all words, decreased eye contact, and developed hand-wringing and body rocking. She breathes irregularly sometimes. She still smiles occasionally when she hears music she likes. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Small girl, alert but not engaged. Not tracking examiner\'s face consistently.',flag:'abnormal',flagText:'DECREASED ENGAGEMENT'}],
    neuro:[{label:'Hand stereotypies',text:'Repetitive hand-wringing/washing movements. Cannot use hands purposefully.',flag:'abnormal',flagText:'KEY FINDING'},{label:'Gait',text:'Ataxic, wide-based gait.',flag:'abnormal',flagText:'ATAXIC'},{label:'Breathing',text:'Episodes of breath-holding and hyperventilation during exam.',flag:'abnormal',flagText:'KEY FINDING'}],
    heent:[{label:'Head circumference',text:'Deceleration from 50th to 35th percentile over past 6 months — acquired microcephaly.',flag:'abnormal',flagText:'HC DECELERATION'}],
    cardiac:[{label:'Heart',text:'Regular. No murmurs.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear, but irregular breathing pattern noted.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    skin:[{label:'Skin',text:'No rashes.',flag:'normal'}],
    ext:[{label:'Extremities',text:'Hands and feet cool, mottled — autonomic dysfunction.',flag:'abnormal',flagText:'AUTONOMIC'}]
  },
  orders:{
    mecp2:{name:'MECP2 Gene Sequencing',timing:48,relevant:true,result:{type:'labs',rows:[['Gene','Variant','Classification'],['MECP2','c.916C>T (p.Arg306Cys)','Pathogenic']],note:'DIAGNOSTIC: Pathogenic MECP2 variant. Rett syndrome confirmed. Genetics and neurology referral urgent.'}},
    eeg:{name:'EEG',timing:24,relevant:true,result:{type:'imaging',report:'EEG REPORT\n\nBackground: Diffusely slow for age.\nAbnormal discharges: Centrotemporal spike-wave activity.\nSeizure activity: No ictal pattern captured.',impression:'Abnormal EEG consistent with Rett syndrome. Seizure risk elevated. Neurology follow-up.'}},
    mri:{name:'Brain MRI',timing:48,relevant:false,result:{type:'imaging',report:'BRAIN MRI\n\nMild diffuse cerebral volume loss.\nNo focal lesions, no malformations, no metabolic changes.\nWhite matter signal normal.',impression:'Subtle volume loss consistent with neurodevelopmental disorder. No structural cause.'}}
  },
  badges:{
    regression:{trigger:(q,r)=>/regress|lost.*word|used to|normal.*then|before/i.test(q+r),icon:'&#9203;',label:'Regression Recognizer',color:'gold',explanation:'True developmental regression after normal early development is the hallmark of Rett syndrome'},
    hand_stereo:{trigger:(sys)=>sys==='neuro',icon:'&#128080;',label:'Stereotypy Spotter',color:'gold',explanation:'Hand-wringing stereotypies are pathognomonic for Rett syndrome — not seen in autism'},
    breathing:{trigger:(q,r)=>/breath|respir|irregular|hyperventilat/i.test(q+r),icon:'&#129978;',label:'Autonomic Thinker',color:'blue',explanation:'You asked about breathing — irregular breathing is characteristic of Rett syndrome'}
  }
};

EMR_CASES.C3 = {
  id:'C3', family:3,
  patient:{name:'Noah P.',age:'4M',mrn:'RDX-3003-C3',visit:'Autism evaluation'},
  vitals:[{val:'Weight 60th %',flag:false},{val:'Height 58th %',flag:false},{val:'HC 55th %',flag:false},{val:'Alert',flag:false}],
  problems:[{name:'Social communication delay',detail:'Limited eye contact, no pointing by 18 months'},{name:'Repetitive behaviors',detail:'Lining up objects, rigid routines'},{name:'Language delay',detail:'50 words at 4, mostly echolalic'}],
  meds:[{name:'No medications',detail:''}],
  cc:'"Noah doesn\'t make much eye contact and he gets very upset with any change in routine. He lines up his toys and repeats phrases from TV. We think he might have autism."',
  diagnosis:'Autism Spectrum Disorder (ASD) — level 2',
  personas:{
    parent:{name:'Robert P.',role:'Father',location:'In exam room',avatar:'R',color:'#1a6fa8',
    greeting:'Thanks for seeing us. We\'ve suspected autism for a while. He doesn\'t really play with other kids and he knows the complete route to school and melts down if we go a different way.',
    systemPrompt:`You are Robert, Noah's father. Noah has never had normal development — no regression. He had limited joint attention (pointing, showing) from the start. He has some spoken language (50 words, echolalic) but doesn't use it to communicate socially. He plays with toys repetitively (lining up, spinning wheels). He's very rigid with routines. He does have some affection for family. You want to know about ABA therapy and school supports. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Well-nourished boy. Engages briefly with toys in room. Avoids examiner\'s gaze.',flag:'normal'}],
    neuro:[{label:'Social',text:'Limited eye contact. No pointing or joint attention observed during exam. Does not respond to name consistently.',flag:'abnormal',flagText:'SOCIAL DEFICIT'},{label:'Language',text:'Echolalic speech. Quotes phrases without apparent communicative intent.',flag:'abnormal',flagText:'NOTE'},{label:'Motor',text:'Normal tone, gait, coordination.',flag:'normal'}],
    heent:[{label:'Head',text:'Macrocephaly: HC 58cm (>97th percentile). Associated with ASD in some cases.',flag:'abnormal',flagText:'MACROCEPHALY'}],
    cardiac:[{label:'Heart',text:'Regular, no murmurs.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    skin:[{label:'Skin',text:'No rashes, no cafe-au-lait spots, no ash-leaf macules.',flag:'normal'}],
    ext:[{label:'Extremities',text:'Normal.',flag:'normal'}]
  },
  orders:{
    ados:{name:'ADOS-2 Assessment (Autism Diagnostic Obs.)',timing:48,relevant:true,result:{type:'imaging',report:'ADOS-2 ASSESSMENT\n\nModule 1 administered (no phrase speech).\nSocial Affect score: 14 (cutoff 8 — significant)\nRBSR score: 6 (cutoff 2 — significant)\nOverall impression: Consistent with autism spectrum disorder, Level 2 (requiring substantial support).',impression:'ASD Level 2 diagnosis supported.'}},
    fragx:{name:'Fragile X DNA Testing',timing:48,relevant:true,result:{type:'labs',rows:[['Test','Result','Flag'],['FMR1 CGG repeats','28 repeats','Normal (<55 normal)']],note:'Fragile X negative. Recommended first-line genetic test in ASD — excluded.'}},
    array:{name:'Chromosomal Microarray',timing:72,relevant:true,result:{type:'labs',rows:[['Test','Result'],['Microarray','16p11.2 microdeletion — 593kb']],note:'16p11.2 microdeletion identified — associated with ASD, intellectual disability, and macrocephaly. Explains ASD etiology in this patient. Parental testing recommended.'}}
  },
  badges:{
    no_regression:{trigger:(q,r)=>/regress|lost|used to|change|different/i.test(q+r),icon:'&#128270;',label:'No Regression',color:'gold',explanation:'You confirmed no regression — distinguishing ASD from Rett syndrome and other disorders'},
    fragile_x:{trigger:(orderId)=>orderId==='fragx',icon:'&#129516;',label:'Genetic Thinker',color:'gold',explanation:'Fragile X is the most common single-gene cause of ASD — correct to test'},
    microarray:{trigger:(orderId)=>orderId==='array',icon:'&#9883;',label:'Copy Number Variant',color:'gold',explanation:'Chromosomal microarray finds copy number variants — 16p11.2 deletion found here'}
  }
};

EMR_CASES.D3 = {
  id:'D3', family:3,
  patient:{name:'Emma W.',age:'6F',mrn:'RDX-3004-D3',visit:'Intellectual disability evaluation'},
  vitals:[{val:'Weight 40th %',flag:false},{val:'Height 38th %',flag:false},{val:'HC 30th %',flag:false},{val:'Alert',flag:false}],
  problems:[{name:'Global developmental delay',detail:'IQ ~60 on testing'},{name:'Behavioral concerns',detail:'Happy disposition, inappropriate laughter, hand-flapping'},{name:'Seizures',detail:'Onset age 3, controlled on valproate'}],
  meds:[{name:'Valproate 250mg',detail:'BID for seizures'}],
  cc:'"Emma has intellectual disability and seizures. Her previous neurologist said the MRI was normal and genetics was negative but she has a very unusual behavioral profile — she\'s almost always happy and laughs a lot."',
  diagnosis:'Angelman Syndrome (UBE3A, maternal 15q11)',
  personas:{
    parent:{name:'Karen W.',role:'Mother',location:'In exam room',avatar:'K',color:'#1a6fa8',
    greeting:'Thank you. Emma is a joy — she\'s happy almost all the time, which sounds great, but her teacher says it\'s actually unusual. She laughs at things that aren\'t funny and she gets very excited by water.',
    systemPrompt:`You are Karen, Emma's mother. Emma is happy constantly — inappropriately so. She laughs spontaneously without obvious triggers. She is fascinated by water. She has a jerky, puppetlike gait. She has seizures controlled on valproate. She has essentially no functional speech — she communicates with gestures. Previous genetic testing was "normal chromosomes" (karyotype only — NOT methylation testing). Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Small girl, smiling broadly throughout exam. Spontaneous laughter.',flag:'abnormal',flagText:'CHARACTERISTIC BEHAVIOR'}],
    neuro:[{label:'Gait',text:'Wide-based, stiff-legged "marionette" gait.',flag:'abnormal',flagText:'KEY FINDING'},{label:'Tone',text:'Mild truncal hypotonia with normal limb tone.',flag:'normal'},{label:'Speech',text:'No functional words. Communicates with gestures and facial expression.',flag:'abnormal',flagText:'NON-VERBAL'}],
    heent:[{label:'Head',text:'Head circumference at 30th percentile (acquired relative microcephaly).',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    skin:[{label:'Skin',text:'Hypopigmentation relative to parents.',flag:'abnormal',flagText:'HYPOPIGMENTED'}],
    ext:[{label:'Extremities',text:'Normal.',flag:'normal'}]
  },
  orders:{
    methyl:{name:'15q11 Methylation Analysis',timing:48,relevant:true,result:{type:'labs',rows:[['Test','Result','Flag'],['Chromosome 15 methylation','Abnormal methylation pattern — maternal deletion','C']],note:'DIAGNOSTIC: Abnormal methylation of chromosome 15q11 — maternal allele deleted. Angelman syndrome confirmed. FISH and UBE3A sequencing to follow for subtype.'}},
    eeg:{name:'EEG',timing:24,relevant:true,result:{type:'imaging',report:'EEG\n\nCharacteristic high-amplitude delta activity.\nBilateral spike-wave bursts.\nPattern highly characteristic of Angelman syndrome.',impression:'EEG pattern highly characteristic of Angelman syndrome — supports diagnosis.'}}
  },
  badges:{
    happy_phenotype:{trigger:(q,r)=>/happy|laugh|smile|mood|behav/i.test(q+r),icon:'&#128516;',label:'Happy Phenotype',color:'gold',explanation:'You asked about behavior — inappropriate happiness is the most characteristic Angelman feature'},
    gait:{trigger:(sys)=>sys==='neuro',icon:'&#129483;',label:'Gait Examiner',color:'gold',explanation:'You examined gait — the puppetlike movement is characteristic of Angelman syndrome'},
    methylation:{trigger:(orderId)=>orderId==='methyl',icon:'&#129516;',label:'Epigenetics Thinker',color:'gold',explanation:'Methylation analysis is the correct first test for Angelman — standard karyotype misses it'}
  }
};

EMR_CASES.E3 = {
  id:'E3', family:3,
  patient:{name:'Tyler B.',age:'8M',mrn:'RDX-3005-E3',visit:'ADHD evaluation'},
  vitals:[{val:'Weight 55th %',flag:false},{val:'Height 52nd %',flag:false},{val:'BP 108/64',flag:false},{val:'Alert',flag:false}],
  problems:[{name:'Attention difficulties',detail:'Teacher and parent reports'},{name:'Hyperactivity',detail:'Cannot sit still, blurts out answers'},{name:'Academic underperformance',detail:'Below grade level in reading'}],
  meds:[{name:'No medications',detail:''}],
  cc:'"Tyler\'s teacher says he can\'t focus and he\'s always moving. He struggles with reading. We want to know if he has ADHD."',
  diagnosis:'ADHD, combined presentation — appropriate diagnosis, no genetic workup indicated',
  personas:{
    parent:{name:'David B.',role:'Father',location:'In exam room',avatar:'D',color:'#1a6fa8',
    greeting:'Tyler\'s teacher has been saying for two years that he can\'t sit still and doesn\'t finish work. He\'s a smart kid but he struggles with reading.',
    systemPrompt:`You are David, Tyler's father. Tyler has had these concerns since kindergarten — NO developmental regression. He has friends, good social skills, appropriate emotions. He reads below grade level (reading disability component). He focuses fine on things he loves like video games. His symptoms are present at home AND school. Family history: you also had ADHD as a child. No seizures, no regression, no repetitive behaviors. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Active, fidgety 8-year-old. Makes good eye contact. Socially appropriate.',flag:'normal'}],
    neuro:[{label:'Attention',text:'Difficulty sustaining attention during exam. Easily distracted by sounds in hallway.',flag:'abnormal',flagText:'INATTENTION'},{label:'Social',text:'Excellent eye contact and social reciprocity — distinguishing from ASD.',flag:'normal'},{label:'Motor',text:'No tics, no stereotypies, normal tone and gait.',flag:'normal'}],
    heent:[{label:'Head',text:'Normal head circumference.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular, no murmurs. Normal heart rate.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    skin:[{label:'Skin',text:'No cafe-au-lait spots (NF1 excluded).',flag:'normal'}],
    ext:[{label:'Extremities',text:'Normal.',flag:'normal'}]
  },
  orders:{
    rating:{name:'Vanderbilt Rating Scales',timing:0,relevant:true,result:{type:'labs',rows:[['Rater','Inattention','Hyperactivity','Impulsivity'],['Parent','Significantly elevated','Significantly elevated','Elevated'],['Teacher','Significantly elevated','Elevated','Elevated']],note:'Both parent and teacher rating scales meet DSM-5 criteria for ADHD combined presentation. Multimodal treatment plan indicated.'}},
    neuro_testing:{name:'Neuropsychological Testing',timing:72,relevant:false,result:{type:'imaging',report:'NEUROPSYCHOLOGICAL TESTING\n\nFull Scale IQ: 104 (average)\nWorking memory: 82 (below average)\nProcessing speed: 79 (below average)\nReading: 76 (below average — dyslexia co-occurring)\nConclusion: ADHD + co-occurring reading disability (dyslexia)', impression:'ADHD with co-occurring dyslexia. IEP with reading intervention and ADHD accommodations recommended.'}}
  },
  badges:{
    two_settings:{trigger:(q,r)=>/school|home|both|teacher|class/i.test(q+r),icon:'&#127979;',label:'Two Settings',color:'gold',explanation:'You confirmed symptoms in 2+ settings — required for DSM-5 ADHD diagnosis'},
    family_hx:{trigger:(q,r)=>/family|father|parent|inherit|heredit/i.test(q+r),icon:'&#128101;',label:'Family History',color:'blue',explanation:'You asked about family ADHD history — ADHD is highly heritable (heritability ~74%)'},
    no_genetic:{trigger:(q,r)=>/genetic|chromosome|gene|test.*blood/i.test(q+r),icon:'&#9745;',label:'No Overtest',color:'blue',explanation:'You considered genetics — ADHD does not routinely require genetic workup'}
  }
};

// ── FAMILY 4: JOINT PAIN ──────────────────────────────────

EMR_CASES.F4A = {
  id:'F4A', family:4,
  patient:{name:'Maria L.',age:'32F',mrn:'RDX-4001-F4A',visit:'Joint pain, morning stiffness'},
  vitals:[{val:'BP 118/74',flag:false},{val:'HR 82',flag:false},{val:'Temp 37.4',flag:false},{val:'BMI 22',flag:false}],
  problems:[{name:'Polyarthritis',detail:'Small joints, bilateral, 8 months'},{name:'Morning stiffness',detail:'>1 hour daily'},{name:'Fatigue',detail:'Chronic'}],
  meds:[{name:'Ibuprofen PRN',detail:'Mild relief only'}],
  cc:'"My hands and wrists have been swollen and painful for 8 months. I\'m so stiff in the morning I can\'t open jars. My mother has rheumatoid arthritis."',
  diagnosis:'Rheumatoid Arthritis (seropositive)',
  personas:{
    patient:{name:'Maria L.',role:'Patient',location:'In exam room',avatar:'M',color:'#1a6fa8',
    greeting:'Hi. My hands have been getting worse for almost a year. The morning stiffness is the worst part — I can\'t function for the first hour of the day.',
    systemPrompt:`You are Maria, a 32-year-old graphic designer. You have bilateral symmetric small joint arthritis — MCPs, PIPs, wrists — for 8 months. Morning stiffness >1 hour. Fatigue. Mild improvement with ibuprofen. Your mother has RA. You've noticed a low-grade fever some days. No skin rashes, no eye symptoms, no bowel symptoms. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Well-appearing woman, mildly uncomfortable.',flag:'normal'}],
    ext:[{label:'Hands',text:'Bilateral MCP and PIP joint synovitis — boggy swelling, warmth, tenderness. Wrist synovitis bilaterally.',flag:'abnormal',flagText:'SYNOVITIS'},{label:'Distribution',text:'Symmetric small joint involvement. DIP joints spared.',flag:'abnormal',flagText:'RA PATTERN'}],
    heent:[{label:'Eyes',text:'No scleritis, no episcleritis.',flag:'normal'}],
    skin:[{label:'Skin',text:'No psoriatic plaques, no rashes, no nodules yet.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular, no murmurs.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Normal.',flag:'normal'}]
  },
  orders:{
    rf:{name:'Rheumatoid Factor + Anti-CCP',timing:2,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['Rheumatoid Factor','182 IU/mL','<20','H'],['Anti-CCP','>250 U/mL','<20','H'],['ESR','68 mm/hr','<20','H'],['CRP','3.2 mg/dL','<0.5','H']],note:'Strongly seropositive RA. High anti-CCP predicts erosive disease. Early aggressive DMARD therapy indicated.'}},
    xray:{name:'Hand X-rays Bilateral',timing:24,relevant:true,result:{type:'imaging',report:'HAND X-RAYS BILATERAL\n\nPeriarticular osteopenia at MCPs and PIPs bilaterally.\nSmall juxta-articular erosion at 2nd MCP right.\nNo advanced joint space narrowing yet.',impression:'Early erosive change at right 2nd MCP. Early RA confirmed radiographically.'}},
    cbc:{name:'CBC',timing:0,relevant:false,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['Hemoglobin','11.8','12.0-16.0','L'],['WBC','8.2','4.5-11.0',''],['Platelets','420','150-400','H']],note:'Mild anemia of chronic inflammation. Thrombocytosis consistent with active inflammatory disease.'}}
  },
  badges:{
    morning_stiffness:{trigger:(q,r)=>/morning|stiff|worse.*morning|how long.*stiff/i.test(q+r),icon:'&#127774;',label:'Stiffness Timer',color:'gold',explanation:'You asked about morning stiffness duration — >1 hour is characteristic of inflammatory arthritis'},
    family_ra:{trigger:(q,r)=>/family|mother|relative|heredit/i.test(q+r),icon:'&#128101;',label:'Family History',color:'blue',explanation:'You asked about family history — first-degree relative with RA significantly increases risk'},
    anti_ccp:{trigger:(orderId)=>orderId==='rf',icon:'&#9879;',label:'Serology Ordered',color:'gold',explanation:'Anti-CCP is the most specific RA marker — strongly positive here confirms diagnosis'}
  }
};

EMR_CASES.F4B = {
  id:'F4B', family:4,
  patient:{name:'Kevin O.',age:'24M',mrn:'RDX-4002-F4B',visit:'Low back pain, morning stiffness'},
  vitals:[{val:'BP 124/76',flag:false},{val:'HR 74',flag:false},{val:'Temp 98.6',flag:false},{val:'BMI 24',flag:false}],
  problems:[{name:'Low back pain',detail:'Insidious onset, 2 years, worse with rest'},{name:'Morning stiffness',detail:'1-2 hours, improves with exercise'},{name:'Right heel pain',detail:'Enthesitis'}],
  meds:[{name:'Ibuprofen',detail:'Helps significantly'}],
  cc:'"My back pain is the worst when I wake up — it actually gets better when I move around. I\'m 24 and I know this isn\'t normal. My uncle has a similar problem."',
  diagnosis:'Ankylosing Spondylitis (HLA-B27 positive)',
  personas:{
    patient:{name:'Kevin O.',role:'Patient',location:'In exam room',avatar:'K',color:'#1a6fa8',
    greeting:'Hi. My back has been bothering me for 2 years. I know back pain in a 24-year-old isn\'t normal. The weirdest thing is it\'s worse when I rest and better when I move.',
    systemPrompt:`You are Kevin, a 24-year-old software developer. You have inflammatory back pain — worse at rest/night, improves with exercise (opposite of mechanical back pain). Morning stiffness 1-2 hours. NSAID response is dramatic. You have right heel pain (enthesitis). You had an episode of red painful right eye last year (anterior uveitis). Your paternal uncle has "a stiff spine" and walks hunched. No bowel symptoms. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Fit young man, slightly guarded posture.',flag:'normal'}],
    ext:[{label:'Spine',text:'Reduced lumbar flexion (Schober test: 2cm increase from 5cm mark — abnormal, normal >5cm). Paravertebral muscle tenderness.',flag:'abnormal',flagText:'REDUCED FLEXION'},{label:'SI joints',text:'Bilateral sacroiliac joint tenderness on direct palpation and FABER test.',flag:'abnormal',flagText:'SI TENDERNESS'}],
    heent:[{label:'Eyes',text:'Currently clear. History of anterior uveitis.',flag:'normal'}],
    skin:[{label:'Skin',text:'No psoriasis, no rashes.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Normal.',flag:'normal'}]
  },
  orders:{
    hlab27:{name:'HLA-B27',timing:24,relevant:true,result:{type:'labs',rows:[['Test','Result'],['HLA-B27','POSITIVE']],note:'HLA-B27 positive. Present in ~90% of ankylosing spondylitis. Supports diagnosis.'}},
    mri_si:{name:'MRI Sacroiliac Joints',timing:48,relevant:true,result:{type:'imaging',report:'MRI SACROILIAC JOINTS\n\nBilateral bone marrow edema at SI joints.\nErosion of iliac surface bilaterally.\nNo bridging syndesmophytes yet.\nNo complete ankylosis.', impression:'Active sacroiliitis bilaterally. Consistent with early ankylosing spondylitis/axial spondyloarthropathy.'}},
    crp:{name:'CRP / ESR',timing:0,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['CRP','2.8 mg/dL','<0.5','H'],['ESR','42 mm/hr','<20','H']],note:'Elevated inflammatory markers consistent with active axial spondyloarthropathy.'}}
  },
  badges:{
    inflammatory_pattern:{trigger:(q,r)=>/rest|exercise|movement|worse.*rest|better.*move/i.test(q+r),icon:'&#127939;',label:'Inflammatory Pattern',color:'gold',explanation:'You identified inflammatory back pain pattern — worse at rest, better with movement'},
    uveitis:{trigger:(q,r)=>/eye|uveitis|red.*eye|vision/i.test(q+r),icon:'&#128065;',label:'Extra-articular',color:'gold',explanation:'You asked about eyes — anterior uveitis is the most common extra-articular manifestation of AS'},
    enthesitis:{trigger:(sys)=>sys==='ext',icon:'&#129461;',label:'Enthesitis Finder',color:'blue',explanation:'You examined entheses — heel pain from Achilles enthesitis is characteristic of SpA'}
  }
};

EMR_CASES.F4C = {
  id:'F4C', family:4,
  patient:{name:'Sandra T.',age:'45F',mrn:'RDX-4003-F4C',visit:'Joint pain, skin rash'},
  vitals:[{val:'BP 132/82',flag:false},{val:'HR 78',flag:false},{val:'Temp 98.8',flag:false},{val:'BMI 27',flag:false}],
  problems:[{name:'Arthritis — DIP joints',detail:'Asymmetric, 18 months'},{name:'Psoriatic skin plaques',detail:'Known 10 years'},{name:'Nail pitting',detail:'Multiple fingers'}],
  meds:[{name:'Methotrexate',detail:'For skin, recently started'}],
  cc:'"My finger joints are swollen and painful — but it\'s the end joints, not the knuckles. I\'ve had psoriasis for years and my dermatologist said this might be related."',
  diagnosis:'Psoriatic Arthritis (DIP predominant pattern)',
  personas:{
    patient:{name:'Sandra T.',role:'Patient',location:'In exam room',avatar:'S',color:'#1a6fa8',
    greeting:'Hi. My dermatologist sent me over because my joints have been getting worse since the arthritis started.',
    systemPrompt:`You are Sandra, a 45-year-old nurse. You have had psoriasis for 10 years (plaques on elbows, scalp). Now you have arthritis affecting DIP joints (end joints) asymmetrically — 3rd and 4th fingers right hand, 2nd finger left. "Sausage" swelling of left 3rd finger. Morning stiffness 30-40 minutes only. Nail pitting and onycholysis. Family history of psoriasis (brother). Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Well-appearing woman.',flag:'normal'}],
    skin:[{label:'Psoriasis plaques',text:'Erythematous scaly plaques on bilateral elbows and posterior scalp.',flag:'abnormal',flagText:'PSORIASIS'},{label:'Nails',text:'Pitting of multiple fingernails. Onycholysis of right 3rd fingernail.',flag:'abnormal',flagText:'KEY FINDING'}],
    ext:[{label:'DIP joints',text:'Swelling and tenderness of right 3rd and 4th DIP joints. Asymmetric.',flag:'abnormal',flagText:'DIP ARTHRITIS'},{label:'Dactylitis',text:'"Sausage digit" — left 3rd finger diffusely swollen (dactylitis).',flag:'abnormal',flagText:'KEY FINDING'}],
    heent:[{label:'Eyes',text:'Clear.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Normal.',flag:'normal'}]
  },
  orders:{
    rf:{name:'RF / Anti-CCP (to exclude RA)',timing:2,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['Rheumatoid Factor','<14','<20',''],['Anti-CCP','<5','<20','']],note:'Seronegative. RA excluded. Pattern and seronegative status consistent with psoriatic arthritis.'}},
    xray:{name:'Hand X-rays',timing:24,relevant:true,result:{type:'imaging',report:'HAND X-RAYS\n\nDIP joint erosions right 3rd and 4th fingers.\n"Pencil-in-cup" deformity beginning right 3rd DIP — characteristic of PsA.\nNo periarticular osteopenia (distinguishes from RA).', impression:'DIP erosions with early pencil-in-cup deformity. Consistent with psoriatic arthritis.'}}
  },
  badges:{
    dip_pattern:{trigger:(sys)=>sys==='ext',icon:'&#128080;',label:'Joint Mapper',color:'gold',explanation:'You examined the joints — DIP involvement is characteristic of PsA, not RA (which spares DIPs)'},
    dactylitis:{trigger:(q,r)=>/sausage|dactyl|whole finger|swoll.*finger/i.test(q+r),icon:'&#129351;',label:'Dactylitis Spotter',color:'gold',explanation:'You noticed the sausage digit — dactylitis is a hallmark feature of psoriatic arthritis'},
    nail:{trigger:(sys)=>sys==='skin',icon:'&#128082;',label:'Nail Examiner',color:'blue',explanation:'You examined nails — pitting and onycholysis are strongly associated with psoriatic arthritis'}
  }
};

EMR_CASES.F4D = {
  id:'F4D', family:4,
  patient:{name:'Harold M.',age:'72M',mrn:'RDX-4004-F4D',visit:'Knee pain, swelling'},
  vitals:[{val:'BP 138/84',flag:false},{val:'HR 72',flag:false},{val:'Temp 98.4',flag:false},{val:'BMI 29',flag:false}],
  problems:[{name:'Bilateral knee pain',detail:'Insidious onset, worse with activity, 3 years'},{name:'Morning stiffness',detail:'<30 minutes'},{name:'Obesity, mild',detail:'BMI 29'}],
  meds:[{name:'Acetaminophen',detail:'PRN, moderate relief'},{name:'Lisinopril',detail:'For hypertension'}],
  cc:'"My knees ache, especially going down stairs. It\'s been getting worse for 3 years. The left is worse than the right."',
  diagnosis:'Osteoarthritis — bilateral knees, moderate-severe',
  personas:{
    patient:{name:'Harold M.',role:'Patient',location:'In exam room',avatar:'H',color:'#1a6fa8',
    greeting:'Hi doc. My knees have been giving me trouble for years. Stairs are the worst.',
    systemPrompt:`You are Harold, a 72-year-old retired carpenter. You have bilateral knee pain, worse with activity (especially stairs and prolonged standing), better with rest. Morning stiffness less than 30 minutes (resolves quickly). No significant warmth or redness. You had a right knee injury playing football age 22. Your pain has been slowly worsening for 3 years. Acetaminophen helps somewhat. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Overweight elderly man, antalgic gait favoring left leg.',flag:'normal'}],
    ext:[{label:'Knees',text:'Bilateral crepitus on range of motion. Left knee effusion (small). Bony enlargement of medial joint lines. Varus deformity left knee.',flag:'abnormal',flagText:'OA FINDINGS'},{label:'ROM',text:'Left knee: 0-95 degrees (limited). Right knee: 0-110 degrees.',flag:'abnormal',flagText:'LIMITED ROM'}],
    skin:[{label:'Skin',text:'No rashes, no tophi.',flag:'normal'}],
    heent:[{label:'Head',text:'Normal.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Normal.',flag:'normal'}]
  },
  orders:{
    xray:{name:'Knee X-rays Bilateral (Weight-bearing)',timing:0,relevant:true,result:{type:'imaging',report:'KNEE X-RAYS BILATERAL WEIGHT-BEARING\n\nLeft knee: Grade 3-4 OA (Kellgren-Lawrence). Severe medial compartment joint space narrowing. Subchondral sclerosis and osteophytes.\nRight knee: Grade 2 OA. Mild medial narrowing.', impression:'Moderate-severe OA left knee, mild-moderate right knee. Medial compartment predominant. Left knee surgical evaluation appropriate.'}},
    rf:{name:'RF / CRP (to exclude inflammatory)',timing:2,relevant:false,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['RF','<14','<20',''],['CRP','0.4','<0.5',''],['ESR','18','<20','']],note:'Inflammatory markers normal. Inflammatory arthritis excluded. Confirms mechanical OA.'}}
  },
  badges:{
    activity_worse:{trigger:(q,r)=>/stair|activit|walk|worse.*use|rest.*better/i.test(q+r),icon:'&#129695;',label:'Mechanical Pattern',color:'gold',explanation:'You identified mechanical pain — worse with activity, better with rest = OA pattern'},
    crepitus:{trigger:(sys)=>sys==='ext',icon:'&#129461;',label:'Crepitus Found',color:'blue',explanation:'You examined the joints — crepitus is characteristic of cartilage loss in OA'},
    weight_xray:{trigger:(orderId)=>orderId==='xray',icon:'&#9977;',label:'Weight-bearing',color:'gold',explanation:'Weight-bearing X-rays are essential for OA staging — non-weight-bearing underestimates severity'}
  }
};

EMR_CASES.F4E = {
  id:'F4E', family:4,
  patient:{name:'George N.',age:'58M',mrn:'RDX-4005-F4E',visit:'Acute joint pain — big toe, severe'},
  vitals:[{val:'BP 146/88',flag:true},{val:'HR 92',flag:false},{val:'Temp 38.1',flag:true},{val:'BMI 31',flag:true}],
  problems:[{name:'Acute monoarthritis',detail:'First MTP joint, right foot — onset overnight'},{name:'Hyperuricemia',detail:'Known, untreated'},{name:'Hypertension, on HCTZ',detail:'Diuretic worsens uric acid'}],
  meds:[{name:'HCTZ 25mg',detail:'For hypertension — raises uric acid'},{name:'No urate-lowering therapy',detail:''}],
  cc:'"I woke up at 3am with the worst pain of my life in my big toe. I couldn\'t even stand the weight of my sheet on it."',
  diagnosis:'Gout — acute flare, first metatarsophalangeal joint',
  personas:{
    patient:{name:'George N.',role:'Patient',location:'In exam room',avatar:'G',color:'#1a6fa8',
    greeting:'Doc, this is the worst pain I\'ve ever had. It came out of nowhere last night. My big toe is killing me.',
    systemPrompt:`You are George, a 58-year-old accountant. You woke at 3am with severe right big toe pain — 10/10. The pain was so severe even the bedsheet touching it was unbearable. You have no prior gout history. You drink 2-3 beers on weekends. You had a large steak dinner and some wine last night. You've been told your uric acid is high but never treated. You're on HCTZ for blood pressure. Keep responses 2-3 sentences.`}
  },
  exam:{
    general:[{label:'Appearance',text:'Obese, in obvious pain. Cannot bear weight on right foot.',flag:'abnormal',flagText:'ACUTE PAIN'}],
    ext:[{label:'Right 1st MTP',text:'Exquisitely tender, erythematous, warm, swollen first metatarsophalangeal joint. Podagra pattern.',flag:'abnormal',flagText:'PODAGRA'},{label:'Other joints',text:'No other joint involvement. No tophi visible.',flag:'normal'}],
    skin:[{label:'Skin',text:'No psoriasis. No rashes.',flag:'normal'}],
    heent:[{label:'Ears',text:'No tophi on auricles.',flag:'normal'}],
    cardiac:[{label:'Heart',text:'Regular.',flag:'normal'}],
    pulm:[{label:'Lungs',text:'Clear.',flag:'normal'}],
    abdomen:[{label:'Abdomen',text:'Normal.',flag:'normal'}],
    neuro:[{label:'Neurologic',text:'Normal.',flag:'normal'}]
  },
  orders:{
    uric:{name:'Serum Uric Acid',timing:0,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['Uric acid','11.2 mg/dL','<6.8','H']],note:'Markedly elevated uric acid. NOTE: During acute flare uric acid may be falsely normal — send uric acid but do not rule out gout if normal.'}},
    joint_asp:{name:'Joint Aspiration (if performed)',timing:0,relevant:true,result:{type:'labs',rows:[['Test','Result'],['Crystal analysis','Negatively birefringent needle-shaped crystals (monosodium urate)'],['WBC','28,000/uL (inflammatory)'],['Culture','Negative — no infection']],note:'DIAGNOSTIC: MSU crystals confirm gout. Culture negative — septic arthritis excluded.'}},
    bmp:{name:'BMP / Renal function',timing:0,relevant:true,result:{type:'labs',rows:[['Test','Result','Reference','Flag'],['Creatinine','1.3','0.7-1.3',''],['eGFR','64','>60','']],note:'Mildly reduced eGFR — important for medication dosing (avoid NSAIDs long-term, adjust allopurinol).'}}
  },
  badges:{
    podagra:{trigger:(sys)=>sys==='ext',icon:'&#129461;',label:'Podagra Recognized',color:'gold',explanation:'You examined the joint — classic podagra (1st MTP) in 75% of initial gout attacks'},
    dietary:{trigger:(q,r)=>/eat|food|drink|alcohol|beer|meat|purine/i.test(q+r),icon:'&#127859;',label:'Trigger Identified',color:'blue',explanation:'You asked about diet — purine-rich food and alcohol precipitate gout attacks'},
    hctz:{trigger:(q,r)=>/medication|hctz|diuretic|thiazide|blood pressure.*med/i.test(q+r),icon:'&#9877;',label:'Drug-Induced',color:'gold',explanation:'You identified HCTZ as a uricosuric agent — diuretics raise uric acid and precipitate gout'}
  }
};
