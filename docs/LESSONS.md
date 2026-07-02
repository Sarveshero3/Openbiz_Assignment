# Udyam Registration Clone: Lessons Learned

## 1. Web Scraping Quirks & Bot Mitigation
- **IIS Bot Blocking (403 Forbidden)**: The official government portal (`udyamregistration.gov.in`) runs IIS 10.0 and rejects requests that do not specify a standard browser `User-Agent`. Native tools (like `curl` or simple `axios` requests) receive `403 Forbidden - Access denied due to bot User-Agent`.
  - *Fix*: Our Puppeteer script explicitly calls `page.setUserAgent()` using a standard Chrome user-agent string.
- **Dynamic OTP Gating**: Step 2 (PAN Verification) is physically inaccessible without entering a valid OTP sent to a phone registered with UIDAI.
  - *Fix*: The scraper script runs Puppeteer to extract Step 1 fields dynamically, and then merges them with a hardcoded representation of Step 2 fields that we analyzed and extracted from the official sample form PDF via OCR.

## 2. Validation Edge Cases
- **Aadhaar Format Masking**: The live portal utilizes JavaScript to inject hyphens (`XXXX-XXXX-XXXX`) as the user types.
  - *Fix*: The validation regex in the schema checks for `^\d{4}-\d{4}-\d{4}$`. The UI must apply this mask dynamically, while the backend API validation must ensure compatibility.
- **PAN Format Validation**: Official PAN cards follow the regex `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`. Since input is case-insensitive, we must normalize inputs to uppercase before validation or use a case-insensitive regex in validation logic.
