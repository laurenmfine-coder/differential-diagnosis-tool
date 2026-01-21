# Environmental Differential Diagnosis Tool

An interactive medical education tool teaching how environmental exposures, social determinants, and contextual patient information reshape clinical diagnosis beyond traditional radiology reports.

## Overview

Traditional radiology requests contain minimal context—basic demographics, a brief clinical indication, and the ubiquitous sign-off: "Correlate clinically." But correlate with *what*, exactly?

This tool demonstrates how additional contextual data—zip code, occupation, housing conditions, environmental exposures—can dramatically shift the differential diagnosis.

## Features

- **12 comprehensive clinical cases** spanning pulmonary, pediatric, emergency, toxicology, infectious disease, nephrology, and oncology
- **Interactive reveal system** that lets learners discover how each contextual factor impacts diagnosis
- **Side-by-side comparison** of initial vs. revised differential diagnoses
- **Clinical action items** and **key teaching points** for each case
- **Category filtering** to focus on specific specialties
- **Mobile-responsive design** for use on any device

## Cases Included

1. **Industrial Pollution Pneumonia** - Southwest Detroit auto worker
2. **Pediatric Lead Poisoning** - West Baltimore toddler with developmental delay
3. **Carbon Monoxide Poisoning** - Family with headaches in winter
4. **Post-Hurricane Fungal Infection** - Fort Myers DIY remediation
5. **Farmworker Organophosphate Poisoning** - Immokalee agricultural worker
6. **Immigrant Tuberculosis** - Filipino home health aide
7. **Asbestos-Related Disease** - Navy shipyard veteran
8. **Valley Fever (Coccidioidomycosis)** - Arizona traveler
9. **Radon-Associated Lung Cancer** - Pennsylvania never-smoker
10. **Accelerated Silicosis** - Countertop fabricator (engineered stone)
11. **Mesoamerican Nephropathy** - Sugarcane cutter with heat exposure
12. **Legionnaires' Disease** - Las Vegas hotel guest

---

## Deployment to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name it something like `env-dx-tool` or `environmental-diagnosis`
4. Make it **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2: Upload Files

**Option A: Using GitHub Web Interface (Easiest)**
1. In your new repository, click **"uploading an existing file"** or the **Add file** button → **Upload files**
2. Drag and drop `index.html` from this package
3. Click **Commit changes**

**Option B: Using Git Command Line**
```bash
git clone https://github.com/YOUR-USERNAME/env-dx-tool.git
cd env-dx-tool
# Copy index.html into this folder
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 3: Enable GitHub Pages

1. In your repository, go to **Settings** (tab at the top)
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, select **main** and **/ (root)**
5. Click **Save**

### Step 4: Access Your Site

After a few minutes, your site will be live at:
```
https://YOUR-USERNAME.github.io/env-dx-tool/
```

GitHub will show this URL in the Pages settings once deployment is complete.

---

## Embedding in Substack

Once deployed, you can embed the tool in Substack posts:

### Method 1: Link Button
Create a prominent button linking to your GitHub Pages URL:
```
[Launch the Environmental Differential Diagnosis Tool →](https://YOUR-USERNAME.github.io/env-dx-tool/)
```

### Method 2: iFrame (if Substack supports)
```html
<iframe 
  src="https://YOUR-USERNAME.github.io/env-dx-tool/" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>
```

### Sample Substack Introduction

> **What if I told you the most important diagnostic information isn't in the imaging report?**
>
> Traditional radiology requests provide minimal context—basic demographics, a brief clinical indication, and the ubiquitous sign-off: "Correlate clinically." But correlate with *what*, exactly?
>
> I've created an interactive tool that demonstrates how environmental exposures, zip codes, occupational history, and social determinants can completely reshape your differential diagnosis. Try it yourself:
>
> **[Launch the Tool →](https://YOUR-USERNAME.github.io/env-dx-tool/)**

---

## Alternative Deployment Options

### Vercel (Recommended for Custom Domains)
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **New Project** → Import your GitHub repository
3. Vercel will auto-detect the static site and deploy
4. Get a free `.vercel.app` URL or connect a custom domain

### Netlify
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop the folder containing `index.html`
3. Get a free `.netlify.app` URL

---

## Technical Notes

- **Single HTML file** - No build process required, works as a static site
- **Dependencies loaded via CDN** - React, Babel, and fonts load from CDN
- **Mobile responsive** - Works on phones, tablets, and desktops
- **No backend required** - Runs entirely in the browser

---

## Customization

To add or modify cases, edit the `cases` array in `index.html`. Each case follows this structure:

```javascript
{
  id: 1,
  category: "Pulmonary",
  title: "Case Title",
  initial: {
    age: 42,
    sex: "Male",
    complaint: "Chief complaint",
    imaging: "Imaging study",
    findings: "Key findings"
  },
  initialDx: [
    { dx: "Diagnosis", likelihood: "High", reason: "Reasoning" }
  ],
  factors: {
    demographics: { title: "Title", data: { "Key": "Value" }, impact: "Clinical impact" }
  },
  revisedDx: [
    { dx: "Diagnosis", likelihood: "Very High", reason: "Reasoning", change: "↑ Change note" }
  ],
  actions: ["Action 1", "Action 2"],
  teaching: ["Teaching point 1", "Teaching point 2"]
}
```

---

## Credits

Created by **Lauren Fine, MD, FAAAAI**
Assistant Dean of Clinical Skills Education
Nova Southeastern University Dr. Kiran C. Patel College of Allopathic Medicine

---

## License

This tool is provided for medical education purposes. Feel free to use and adapt for teaching clinical reasoning.
