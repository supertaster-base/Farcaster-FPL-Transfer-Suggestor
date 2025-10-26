# Farcaster FPL Transfer Suggestor — Ready Project

## What it includes
- Next.js 13.4.7 app (pages router)
- Tailwind CSS integration
- API route `/api/suggest` that:
  - Fetches current gameweek from FPL bootstrap-static
  - Fetches public manager picks for that gameweek
  - Suggests one transfer within the same position category
- `lib/suggest.js` contains the suggestion logic

## Quick start (macOS)
1. Extract the ZIP.
2. Open Terminal and `cd` into the project folder.
3. Check Node version: `node -v` (recommended v16+ but node-fetch v2 works on many versions).
   - If Node is missing or old, install/update via Homebrew:
     - Install Homebrew (if needed): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
     - Install Node: `brew install node`
4. Install deps: `npm install`
5. Run dev server: `npm run dev`
6. Open the app: http://localhost:3000
7. Test API: http://localhost:3000/api/suggest?managerId=<public_manager_id>

## Notes
- Use **public** FPL manager IDs only.
- The suggestion always replaces within the same position (GK/DEF/MID/FWD).
- To change styling or logic, edit files under `pages/` and `lib/`.
