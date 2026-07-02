import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Launching browser to scrape Udyam portal...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    // Use a standard browser user agent to avoid 403 Forbidden
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log('Navigating to Udyam Registration portal...');
    await page.goto('https://udyamregistration.gov.in/UdyamRegistration.aspx', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('Scraping Step 1 fields...');

    // Extract Aadhaar details from DOM
    const step1Fields = await page.evaluate(() => {
      const fields = [];

      // Aadhaar number field
      const aadhaarInput = document.querySelector('#ctl00_ContentPlaceHolder1_txtadharno') as HTMLInputElement | null;
      if (aadhaarInput) {
        fields.push({
          id: aadhaarInput.id,
          name: 'aadhaarNumber',
          label: '1. Aadhaar Number',
          type: 'text',
          placeholder: aadhaarInput.placeholder || 'Your Aadhaar No',
          maxLength: 14, // formatted as XXXX-XXXX-XXXX (with hyphens)
          validationRegex: '^\\d{4}-\\d{4}-\\d{4}$',
          errorText: 'Aadhaar number must be in XXXX-XXXX-XXXX format (12 digits)',
          component: 'text',
          required: true
        });
      }

      // Name of Entrepreneur field
      const nameInput = document.querySelector('#ctl00_ContentPlaceHolder1_txtownername') as HTMLInputElement | null;
      if (nameInput) {
        fields.push({
          id: nameInput.id,
          name: 'ownerName',
          label: '2. Name of Entrepreneur',
          type: 'text',
          placeholder: nameInput.placeholder || 'Name as per Aadhaar',
          maxLength: 100,
          validationRegex: '^[a-zA-Z\\s\\.]{3,100}$',
          errorText: 'Name must contain only alphabets, spaces or dots, minimum 3 characters',
          component: 'text',
          required: true
        });
      }

      // Consent Checkbox
      const consentCheckbox = document.querySelector('#ctl00_ContentPlaceHolder1_chkDecarationA') as HTMLInputElement | null;
      if (consentCheckbox) {
        fields.push({
          id: consentCheckbox.id,
          name: 'aadhaarConsent',
          label: 'Consent Declaration',
          type: 'checkbox',
          placeholder: '',
          maxLength: 0,
          validationRegex: 'true',
          errorText: 'You must provide your consent to proceed with Udyam Registration',
          component: 'checkbox',
          required: true
        });
      }

      return fields;
    });

    // If DOM scrape failed or returned incomplete data, fall back to robust defaults
    if (step1Fields.length < 3) {
      console.log('DOM scrape returned partial data. Merging with fallback defaults for Step 1...');
      const fallbacks = [
        {
          id: 'ctl00_ContentPlaceHolder1_txtadharno',
          name: 'aadhaarNumber',
          label: '1. Aadhaar Number',
          type: 'text',
          placeholder: 'Your Aadhaar No',
          maxLength: 14,
          validationRegex: '^\\d{4}-\\d{4}-\\d{4}$',
          errorText: 'Aadhaar number must be in XXXX-XXXX-XXXX format (12 digits)',
          component: 'text',
          required: true
        },
        {
          id: 'ctl00_ContentPlaceHolder1_txtownername',
          name: 'ownerName',
          label: '2. Name of Entrepreneur',
          type: 'text',
          placeholder: 'Name as per Aadhaar',
          maxLength: 100,
          validationRegex: '^[a-zA-Z\\s\\.]{3,100}$',
          errorText: 'Name must contain only alphabets, spaces or dots, minimum 3 characters',
          component: 'text',
          required: true
        },
        {
          id: 'ctl00_ContentPlaceHolder1_chkDecarationA',
          name: 'aadhaarConsent',
          label: 'Consent Declaration',
          type: 'checkbox',
          placeholder: '',
          maxLength: 0,
          validationRegex: 'true',
          errorText: 'You must provide your consent to proceed with Udyam Registration',
          component: 'checkbox',
          required: true
        }
      ];

      // Merge defaults, avoiding duplicates
      for (const fallback of fallbacks) {
        if (!step1Fields.some(f => f.id === fallback.id)) {
          step1Fields.push(fallback);
        }
      }
    }

    console.log('Extracted Step 1 fields:', step1Fields);

    console.log('Merging Step 2 (PAN Verification) fields...');
    // Step 2 is gated, we merge the definitions extracted from the official application form PDF
    const step2Fields = [
      {
        id: 'ctl00_ContentPlaceHolder1_ddlOrgType',
        name: 'orgType',
        label: '3. Type of Organisation',
        type: 'select',
        placeholder: 'Select Type of Organisation',
        maxLength: 0,
        options: [
          { value: 'Proprietary', label: 'Proprietary' },
          { value: 'Hindu Undivided Family (HUF)', label: 'Hindu Undivided Family (HUF)' },
          { value: 'Partnership', label: 'Partnership' },
          { value: 'Co-Operative', label: 'Co-Operative' },
          { value: 'Private Limited Company', label: 'Private Limited Company' },
          { value: 'Public Limited Company', label: 'Public Limited Company' },
          { value: 'Self Help Group (SHG)', label: 'Self Help Group (SHG)' },
          { value: 'Limited Liability Partnership', label: 'Limited Liability Partnership' },
          { value: 'Society', label: 'Society' },
          { value: 'Trust', label: 'Trust' },
          { value: 'Others', label: 'Others' }
        ],
        validationRegex: '^.+$',
        errorText: 'Please select a valid organisation type',
        component: 'select',
        required: true
      },
      {
        id: 'ctl00_ContentPlaceHolder1_txtpan',
        name: 'panNumber',
        label: '4.1 PAN',
        type: 'text',
        placeholder: 'ENTER PAN NUMBER',
        maxLength: 10,
        validationRegex: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
        errorText: 'PAN must be a 10-character alphanumeric string in standard format (e.g., ABCDE1234F)',
        component: 'text',
        required: true
      },
      {
        id: 'ctl00_ContentPlaceHolder1_txtpanownername',
        name: 'panOwnerName',
        label: '4.1.1 Name of PAN Holder',
        type: 'text',
        placeholder: 'Name as per PAN',
        maxLength: 100,
        validationRegex: '^[a-zA-Z\\s\\.]{3,100}$',
        errorText: 'Name must contain only alphabets, spaces or dots, minimum 3 characters',
        component: 'text',
        required: true
      },
      {
        id: 'ctl00_ContentPlaceHolder1_txtpanownerDOB',
        name: 'panOwnerDOB',
        label: '4.1.2 DOB or DOI as per PAN',
        type: 'date',
        placeholder: 'DD/MM/YYYY',
        maxLength: 10,
        validationRegex: '^\\d{4}-\\d{2}-\\d{2}$', // Zod/input date standard format YYYY-MM-DD
        errorText: 'Please enter a valid Date of Birth / Incorporation in YYYY-MM-DD format',
        component: 'date',
        required: true
      },
      {
        id: 'ctl00_ContentPlaceHolder1_chkDecarationPAN',
        name: 'panConsent',
        label: 'PAN Consent Declaration',
        type: 'checkbox',
        placeholder: '',
        maxLength: 0,
        validationRegex: 'true',
        errorText: 'You must provide your consent to validate PAN with CBDT database',
        component: 'checkbox',
        required: true
      },
      {
        id: 'itrFiled',
        name: 'itrFiled',
        label: 'Have you filed the ITR for Previous Year(PY)?',
        type: 'radio',
        placeholder: '',
        maxLength: 0,
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' }
        ],
        validationRegex: '^(Yes|No)$',
        errorText: 'Please select whether you have filed the ITR for PY',
        component: 'radio',
        required: true
      },
      {
        id: 'gstinAvailable',
        name: 'gstinAvailable',
        label: 'Do you have GSTIN?',
        type: 'radio',
        placeholder: '',
        maxLength: 0,
        options: [
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
          { value: 'Exempted', label: 'Exempted' }
        ],
        validationRegex: '^(Yes|No|Exempted)$',
        errorText: 'Please select your GSTIN status',
        component: 'radio',
        required: true
      }
    ];

    const schema = {
      step1: step1Fields,
      step2: step2Fields
    };

    const docsDir = path.join(__dirname, '../../docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const schemaPath = path.join(docsDir, 'udyam-schema.json');
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2), 'utf-8');
    console.log(`Successfully generated schema and wrote to ${schemaPath}`);
  } catch (error) {
    console.error('Error during scraping process:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
