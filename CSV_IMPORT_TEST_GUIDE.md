# 🧪 CSV Import Feature - Quick Test Guide

## ✅ Pre-Test Checklist

- [x] Backend running on port 5000
- [x] Frontend running on port 5173
- [x] Logged into the app
- [x] Sample CSV file ready: `sample-transactions.csv`

---

## 🎯 Step-by-Step Test

### Test 1: Open Transaction Form
1. **Expected:** Form modal opens with "Add Transaction" header
2. **Action:** Click "➕ Add" button in navbar
3. **Result:** Should see form with toggle, inputs, and buttons

### Test 2: Locate CSV Import Link
1. **Expected:** See "📥 Import from CSV" link at bottom
2. **Location:** Below the "Save Transaction" button
3. **Style:** Small text, slate-500, underlined, turns pink on hover
4. **Result:** Link should be visible and clickable

### Test 3: Click CSV Import
1. **Action:** Click "📥 Import from CSV" link
2. **Expected:** File picker dialog opens
3. **Filter:** Should show .csv files
4. **File:** Select `sample-transactions.csv`

### Test 4: Import Sample File
1. **Upload:** Sample CSV with 10 transactions
2. **Expected:** Message shows "⏳ Importing CSV..."
3. **Wait:** Processing takes ~1-2 seconds
4. **Success:** Alert shows "✅ 10 transactions imported successfully!"

### Test 5: Verify Dashboard Updated
1. **Transactions Table:** Should show new transactions
2. **Chart:** Pie chart should update with new data
3. **Analytics:** Summary cards should show new balance
4. **Insights:** AI insights should mention new spending patterns

### Test 6: Check Imported Data
1. **Verify Amount:** First transaction should be 500
2. **Verify Date:** Check dates match CSV (2026-03-20)
3. **Verify Category:** All should show "misc" (default)
4. **Verify Type:** Should be "expense" or "income" correctly

---

## 📋 Sample CSV Content

```csv
Date,Description,Withdrawal,Deposit
2026-03-20,Grocery Shopping,500,
2026-03-20,Salary Credit,,50000
2026-03-19,Electricity Bill,1200,
2026-03-19,Freelance Project,,8000
2026-03-18,Movie Tickets,400,
2026-03-18,Dinner at Restaurant,800,
2026-03-17,Gym Membership,500,
2026-03-17,Interest Income,,150
2026-03-16,Shopping Mall,2000,
2026-03-16,Bonus Received,,5000
```

---

## 🔍 What to Check

### Backend Response
- Open browser DevTools (F12)
- Go to Network tab
- Click CSV Import
- Should see: `POST /api/transactions/import-csv`
- Response status: **201 Created**
- Response body: `{ "message": "10 transactions imported...", "data": { "count": 10 } }`

### Frontend
- Form should close after successful import
- Dashboard should refresh automatically
- No console errors
- Loading state disappears

### Database
- New transactions should appear
- User ID attached correctly
- Dates parsed correctly
- Category field = "misc"

---

## 🐛 Error Scenarios to Test

### Scenario 1: Wrong File Type
1. **Action:** Try to import .xlsx or .txt file
2. **Expected:** Alert: "Please select a valid CSV file"
3. **Result:** File picker resets, no upload

### Scenario 2: Invalid CSV Format
1. **Action:** Import CSV without required columns
2. **Expected:** Alert: "No valid transactions found in CSV"
3. **Result:** Import fails gracefully, form stays open

### Scenario 3: Empty CSV
1. **Action:** Import CSV with only headers, no data
2. **Expected:** Alert: "No valid transactions found in CSV"
3. **Result:** No database changes

### Scenario 4: Large File
1. **Action:** Try to import file > 5MB
2. **Expected:** Error message from backend
3. **Result:** Upload rejected, user informed

---

## ✨ Expected Behavior

### Before Import
```
Dashboard shows:
- Balance: ₹ X
- Income: ₹ Y  
- Expense: ₹ Z
- Few transactions in table
```

### During Import
```
- "⏳ Importing CSV..." appears
- Link becomes disabled
- Processing takes 1-2 seconds
```

### After Import (Success)
```
- Alert: "✅ 10 transactions imported successfully!"
- Dashboard auto-refreshes
- New transactions appear in table
- Charts update
- Balance changes
- Category breakdown updates
```

---

## 📊 Verification Checklist

After importing sample CSV, verify:

- [ ] 10 transactions added to database
- [ ] Amounts are correct (500, 50000, 1200, etc.)
- [ ] Dates are correct (2026-03-XX format)
- [ ] Types detected correctly (expense vs income)
- [ ] Categories set to "misc"
- [ ] Descriptions match CSV
- [ ] Dashboard summary updated
- [ ] Charts and insights regenerated
- [ ] No console errors
- [ ] Form closes after import
- [ ] Modal dismisses properly

---

## 🚀 Test Success Criteria

✅ **Pass** if all of the following work:
1. CSV file upload is triggered
2. File is accepted (CSV only)
3. Loading message appears during upload
4. Success alert shows correct count
5. Dashboard auto-refreshes
6. Transactions appear in table
7. Data is accurate (amounts, dates, types)
8. No console errors
9. Forms behave correctly

❌ **Fail** if any of the following occur:
1. Upload doesn't work at all
2. Wrong file types accepted
3. No loading indicator
4. No success message
5. Dashboard doesn't update
6. Transactions missing or incorrect
7. Console errors present
8. Form state is inconsistent

---

## 💡 Tips

1. **First Import:** Start with sample CSV provided
2. **Bank CSV:** Export 1-2 months first, then scale up
3. **Column Names:** Check CSV headers match expected names
4. **Dates:** Ensure dates are in standard format
5. **Categories:** Edit in Profile after import
6. **Duplicates:** Import same file twice to verify handling

---

## 📞 Troubleshooting

If tests fail, check:

1. **Backend Logs:**
   - Error messages about CSV parsing
   - File upload issues
   - Database insert failures

2. **Frontend Logs (DevTools Console):**
   - Network errors
   - File input issues
   - API endpoint errors

3. **File Permissions:**
   - `uploads/` folder writable
   - Temp files can be created
   - Cleanup working properly

4. **Database:**
   - Connected and accepting writes
   - Transactions collection exists
   - User document has proper auth

---

## 🎉 Ready to Test!

Everything is set up and ready. Follow the steps above and the CSV import feature should work seamlessly!

**Happy testing! 🚀**
