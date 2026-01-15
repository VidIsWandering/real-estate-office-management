# Settings Pages - Quick Testing Guide

## 🚀 Start System

```bash
cd /home/baonq/projects/real-estate-office-management
docker-compose --profile full up -d
```

## 🌐 Access URLs

- **Frontend:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Settings:** http://localhost:3000/settings
- **Backend API:** http://localhost:8081/api/v1
- **API Docs:** http://localhost:8081/api-docs
- **Database GUI:** http://localhost:8082 (if using `--profile tools`)

## 🔐 Test Accounts

| Username | Password    | Role                |
| -------- | ----------- | ------------------- |
| admin    | password123 | Admin (Full Access) |
| manager1 | password123 | Manager             |
| agent1   | password123 | Agent               |

## ✅ Testing Checklist

### 1. Login Flow

- [ ] Navigate to http://localhost:3000/login
- [ ] Enter: admin / password123
- [ ] Should redirect to /settings
- [ ] Token saved in localStorage

### 2. Account Tab

- [ ] Profile displays (name, email, phone, position, status)
- [ ] Data loads without "fail to fetch" error
- [ ] Click "Edit Profile" works

### 3. Office Tab

- [ ] Office info displays (name, region, phone, address)
- [ ] Can click "Edit"
- [ ] Can modify fields
- [ ] Click "Save" shows success message

### 4. Notifications Tab

- [ ] Toggle switches display
- [ ] Can toggle email/sms/push notifications
- [ ] "Save Preferences" button enables when changed
- [ ] Success message appears after save

### 5. Config Tab

#### Catalogs Section

- [ ] **Property Types:** Shows 5+ items
- [ ] **Areas:** Shows 5+ items
- [ ] **Lead Sources:** Shows 4+ items
- [ ] **Contract Types:** Shows 3+ items
- [ ] Can add new item (press Enter)
- [ ] Can edit item (click Edit icon)
- [ ] Can delete item (click Delete icon)
- [ ] No 404 errors

#### Permissions Section

- [ ] Matrix loads with 3 positions (agent, legal_officer, accountant)
- [ ] Checkboxes display for each permission
- [ ] Can check/uncheck permissions
- [ ] "Save Permissions" button works
- [ ] Success message shows
- [ ] No 500 errors

### 6. Security Tab

#### Password Change

- [ ] Form displays (current password, new password, confirm)
- [ ] Validation works
- [ ] Can submit form

#### Active Sessions

- [ ] Shows current session
- [ ] Device info displays
- [ ] "Revoke" button present
- [ ] No 404 errors

#### Login History

- [ ] Shows login records (at least 1 from current login)
- [ ] Displays timestamp, IP, device
- [ ] No 404 errors

## 🐛 Common Issues & Solutions

### Issue: "fail to fetch"

**Cause:** Not logged in or token expired  
**Solution:** Go to /login and login again

### Issue: Empty data on tabs

**Cause:** Token not in localStorage  
**Solution:** Check browser console, should see auth_token in localStorage

### Issue: 404 errors

**Cause:** Backend not running  
**Solution:**

```bash
docker ps | grep se100-backend  # Check if running
docker logs se100-backend        # Check for errors
```

### Issue: 500 errors

**Cause:** Database table missing  
**Solution:** Already fixed - config_catalog created

## 🧪 API Testing (Optional)

Run automated tests:

```bash
./test-settings-api.sh
```

Expected output: All tests PASS (HTTP 200)

## 📊 Expected Data

### Sample Catalogs

- **Property Types:** Apartment, House, Land, Commercial
- **Areas:** District 1, District 2, District 3, Binh Thanh, Phu Nhuan
- **Lead Sources:** Website, Facebook, Referral, Walk-in
- **Contract Types:** Sale, Lease, Co-broke

### System Configs

- Office name: "RealEstate HQ - Updated"
- Working hours: 09:00 - 18:00
- Appointment duration: 90 minutes

## 🔄 Restart Services

If something goes wrong:

```bash
# Restart backend only
docker-compose restart backend

# Restart all services
docker-compose restart

# Full rebuild
docker-compose down
docker-compose --profile full up -d --build
```

## 📝 Manual CRUD Test

### Test Create Catalog

1. Go to Config tab
2. Click "+ Add" in Property Types
3. Enter "Test Property"
4. Press Enter
5. ✅ Should appear in list

### Test Update Catalog

1. Find "Test Property" in list
2. Click Edit icon (pencil)
3. Change to "Updated Property"
4. Press Enter or click Save
5. ✅ Should update in list

### Test Delete Catalog

1. Find "Updated Property" in list
2. Click Delete icon (trash)
3. Confirm deletion
4. ✅ Should disappear from list

## 🎯 Success Criteria

**All tabs should:**

- ✅ Load without "fail to fetch" errors
- ✅ Display data correctly
- ✅ Allow editing/updating
- ✅ Show success messages after save
- ✅ No 404 or 500 errors in browser console

**If all above work → System is ready! ✨**

## 🆘 Need Help?

Check detailed report: `SETTINGS_TESTING_REPORT.md`
