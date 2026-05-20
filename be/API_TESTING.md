# Huong dan test API backend voi Postman

Base URL mac dinh:

```text
http://localhost:5000/api
```

Chay server:

```bash
npm.cmd run start:dev
```

Neu test cac API upload anh Cloudinary, trong file `.env` can co:

```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_CAT_FOLDER=finding-neko/cats
```

Sau khi login thanh cong, copy `accessToken` va dung cho cac API can dang nhap:

```text
Authorization: Bearer <accessToken>
```

## Auth

### 1. Dang ky va gui OTP

```http
POST /auth/register
Content-Type: application/json
```

Body:

```json
{
  "username": "neko_user",
  "email": "neko@example.com",
  "password": "123456"
}
```

Ket qua mong doi:

```json
{
  "success": true,
  "email": "neko@example.com",
  "message": "..."
}
```

Ghi chu:

- `username` toi thieu 3 ky tu, chi gom chu, so va dau gach duoi.
- `email` phai dung dinh dang email.
- `password` toi thieu 6 ky tu.
- OTP se duoc gui qua email neu SMTP trong `.env` cau hinh dung.

### 2. Xac thuc OTP dang ky

```http
POST /auth/register/verify-otp
Content-Type: application/json
```

Body:

```json
{
  "username": "neko_user",
  "email": "neko@example.com",
  "password": "123456",
  "otp": "123456"
}
```

Ket qua mong doi:

```json
{
  "success": true,
  "message": "..."
}
```

Ghi chu:

- `otp` phai gom dung 6 chu so.
- Cac field `username`, `email`, `password` phai trung voi thong tin da gui o buoc dang ky.

### 3. Dang nhap

```http
POST /auth/login
Content-Type: application/json
```

Body:

```json
{
  "identifier": "neko_user",
  "password": "123456"
}
```

Hoac dang nhap bang email:

```json
{
  "identifier": "neko@example.com",
  "password": "123456"
}
```

Ket qua mong doi:

```json
{
  "success": true,
  "accessToken": "...",
  "user": {
    "id": "...",
    "username": "neko_user",
    "email": "neko@example.com",
    "fullName": "...",
    "role": "...",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## User

### 4. Lay thong tin user dang dang nhap

```http
GET /users/me
Authorization: Bearer <accessToken>
```

Khong can body.

Ket qua mong doi:

```json
{
  "success": true,
  "user": {
    "id": "...",
    "username": "neko_user",
    "email": "neko@example.com",
    "fullName": "...",
    "role": "..."
  }
}
```

## Cat Profile

### 5. Tao ho so meo

```http
POST /cats
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Trong Postman:

1. Chon tab `Body`.
2. Chon `form-data`.
3. Dien cac field sau.

| Key | Type | Value vi du |
| --- | --- | --- |
| `name` | Text | `Miu` |
| `ageMonths` | Text | `8` |
| `breed` | Text | `British Shorthair` |
| `furColor` | Text | `Xam trang` |
| `distinctiveFeatures` | Text | `Co vet trang o chan trai` |
| `images` | File | chon anh 1 |
| `images` | File | chon anh 2 |

Ket qua mong doi:

```json
{
  "success": true,
  "cat": {
    "id": "...",
    "ownerId": "...",
    "name": "Miu",
    "ageMonths": 8,
    "breed": "British Shorthair",
    "furColor": "Xam trang",
    "distinctiveFeatures": "Co vet trang o chan trai",
    "images": [
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "finding-neko/cats/..."
      }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Ghi chu:

- Field file bat buoc ten la `images`.
- Can it nhat 1 anh.
- Toi da 5 anh.
- Moi anh toi da 5MB.
- Chi ho tro JPG, PNG, WEBP.
- `ageMonths` la so nguyen tu 0 den 240.

### 6. Xoa ho so meo

```http
DELETE /cats/<catId>
Authorization: Bearer <accessToken>
```

Vi du:

```http
DELETE http://localhost:5000/api/cats/665f1a2b3c4d5e6f78901234
Authorization: Bearer <accessToken>
```

Khong can body.

Ket qua mong doi:

```json
{
  "success": true,
  "message": "Da xoa ho so meo",
  "deletedCatId": "665f1a2b3c4d5e6f78901234"
}
```

Ghi chu:

- Chi chu so huu cua ho so meo moi xoa duoc.
- API se xoa anh tren Cloudinary truoc, sau do xoa record trong MongoDB.
- Neu `catId` khong dung ObjectId MongoDB, API tra `400`.
- Neu khong tim thay ho so hoac ho so khong thuoc user dang dang nhap, API tra `404`.

### 6.1. Lay danh sach meo cua toi

```http
GET /cats/me
Authorization: Bearer <accessToken>
```

### 6.2. Lay chi tiet ho so meo cua toi

```http
GET /cats/<catId>
Authorization: Bearer <accessToken>
```

## Feed

### 7. Tao bai dang feed

```http
POST /feeds
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Trong Postman:

1. Chon tab `Body`.
2. Chon `form-data`.
3. Dien cac field sau.

| Key | Type | Value vi du |
| --- | --- | --- |
| `caption` | Text | `Khoanh khac moi chup cua be Miu` |
| `catIds` | Text | `665f1a2b3c4d5e6f78901234` |
| `catIds` | Text | `665f1a2b3c4d5e6f78901235` |
| `image` | File | chon 1 anh |

Co the gui `catIds` bang 1 trong 3 cach:

```text
catIds=665f1a2b3c4d5e6f78901234
catIds=665f1a2b3c4d5e6f78901235
```

Hoac:

```text
catIds=665f1a2b3c4d5e6f78901234,665f1a2b3c4d5e6f78901235
```

Hoac:

```json
["665f1a2b3c4d5e6f78901234", "665f1a2b3c4d5e6f78901235"]
```

Ket qua mong doi:

```json
{
  "success": true,
  "feed": {
    "id": "...",
    "ownerId": "...",
    "caption": "Khoanh khac moi chup cua be Miu",
    "catIds": ["665f1a2b3c4d5e6f78901234"],
    "image": {
      "url": "https://res.cloudinary.com/...",
      "publicId": "finding-neko/feeds/..."
    },
    "reactionCount": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Ghi chu:

- Field file bat buoc ten la `image`.
- Moi bai feed chi nhan 1 anh.
- Anh toi da 5MB.
- Chi ho tro JPG, PNG, WEBP.
- `caption` toi da 280 ky tu.
- Can chon it nhat 1 meo.
- Chi duoc chon meo thuoc ho so cua user dang dang nhap.
- Anh feed se duoc upload vao folder Cloudinary `CLOUDINARY_FEED_FOLDER`.

### 7.1. Lay danh sach feed

```http
GET /feeds?limit=20
Authorization: Bearer <accessToken>
```

Trang tiep theo:

```http
GET /feeds?limit=20&cursor=<nextCursor>
Authorization: Bearer <accessToken>
```

### 7.2. Lay chi tiet feed

```http
GET /feeds/<feedId>
Authorization: Bearer <accessToken>
```

### 7.3. Tha yeu thuong cho feed

```http
POST /feeds/<feedId>/reactions
Authorization: Bearer <accessToken>
```

### 7.4. Huy yeu thuong cua toi

```http
DELETE /feeds/<feedId>/reactions/me
Authorization: Bearer <accessToken>
```

## Lost Cat

### 8. Bat che do Meo lac

```http
POST /lost-cats
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:

```json
{
  "catId": "665f1a2b3c4d5e6f78901234",
  "locationText": "Cong vien Gia Dinh, Phuong 3, Go Vap",
  "latitude": 10.8136,
  "longitude": 106.6789,
  "description": "Be di lac luc 8h sang, deo vong co mau cam, rat nhat nguoi la."
}
```

Ket qua mong doi:

```json
{
  "success": true,
  "report": {
    "id": "...",
    "catId": "665f1a2b3c4d5e6f78901234",
    "ownerId": "...",
    "locationText": "Cong vien Gia Dinh, Phuong 3, Go Vap",
    "latitude": 10.8136,
    "longitude": 106.6789,
    "description": "Be di lac luc 8h sang, deo vong co mau cam, rat nhat nguoi la.",
    "status": "active",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Ghi chu:

- User phai la chu so huu cua `catId`.
- Moi meo chi co 1 tin meo lac `active` tai mot thoi diem.
- Sau khi tao tin, ho so meo se duoc danh dau `isLost = true`.
- `latitude` va `longitude` duoc dung de thong bao/tim kiem quanh khu vuc.

### 9. Xem tin meo lac quanh khu vuc

```http
GET /lost-cats/nearby?latitude=10.8136&longitude=106.6789&radiusKm=5
```

Khong can body.

Ket qua mong doi:

```json
{
  "success": true,
  "reports": [
    {
      "id": "...",
      "catId": "...",
      "ownerId": "...",
      "catName": "Miu",
      "catImages": [
        {
          "url": "https://res.cloudinary.com/...",
          "publicId": "finding-neko/cats/..."
        }
      ],
      "locationText": "Cong vien Gia Dinh, Phuong 3, Go Vap",
      "latitude": 10.8136,
      "longitude": 106.6789,
      "description": "Be di lac luc 8h sang...",
      "status": "active",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

Ghi chu:

- `radiusKm` mac dinh la 5 neu khong truyen.
- `radiusKm` toi thieu 0.1 va toi da 50.
- API nay chi tra cac tin co `status = active`.

### 9.1. Lay tin meo lac cua toi

```http
GET /lost-cats/me
Authorization: Bearer <accessToken>
```

### 9.2. Huy tin meo lac

```http
PATCH /lost-cats/<lostCatReportId>/cancel
Authorization: Bearer <accessToken>
```

### 9.3. Tu danh dau da tim thay meo

```http
PATCH /lost-cats/<lostCatReportId>/resolve
Authorization: Bearer <accessToken>
```

## Cat Sighting va Notification

MVP hien tai chua dung AI. Backend phan biet "co the la meo lac" voi "meo rong" bang cach:

- Chi so sanh voi cac tin meo lac dang `active`.
- Chi match cac tin nam trong ban kinh vi tri nguoi dung bao thay.
- Tao candidate cho chu meo tu xem anh va xac nhan sau.
- Neu khong co candidate gan do, bai bao thay meo van duoc luu nhung khong gui notification.
- Neu user da dang ky Expo push token, backend se gui push notification qua Expo Push API khi tao notification.

### 10. Dang ky Expo push token

```http
POST /devices/push-token
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:

```json
{
  "expoPushToken": "ExpoPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "deviceId": "device-001",
  "platform": "android"
}
```

Ket qua mong doi:

```json
{
  "success": true,
  "deviceToken": {
    "id": "...",
    "userId": "...",
    "expoPushToken": "ExpoPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "deviceId": "device-001",
    "platform": "android",
    "isActive": true,
    "lastSeenAt": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Ghi chu:

- Mobile app can xin quyen notification va lay Expo push token truoc.
- Goi API nay sau login hoac moi lan app mo lai de cap nhat token.
- `platform` co the la `ios`, `android`, hoac `web`.
- Neu token bi Expo bao `DeviceNotRegistered`, backend se tu dong tat token do.

### 11. Huy dang ky Expo push token

```http
DELETE /devices/push-token
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:

```json
{
  "expoPushToken": "ExpoPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

Ket qua mong doi:

```json
{
  "success": true,
  "message": "Da huy dang ky push token"
}
```

### 12. Bao thay meo ngoai duong

```http
POST /cat-sightings
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Trong Postman:

1. Chon tab `Body`.
2. Chon `form-data`.
3. Dien cac field sau.

| Key | Type | Value vi du |
| --- | --- | --- |
| `locationText` | Text | `Hem 12 Nguyen Van Bao, Go Vap` |
| `latitude` | Text | `10.8136` |
| `longitude` | Text | `106.6789` |
| `description` | Text | `Be meo mau vang, dang di gan quan ca phe.` |
| `matchRadiusKm` | Text | `3` |
| `image` | File | chon 1 anh |

Ket qua mong doi khi co tin meo lac phu hop quanh do:

```json
{
  "success": true,
  "sighting": {
    "id": "...",
    "reporterId": "...",
    "image": {
      "url": "https://res.cloudinary.com/...",
      "publicId": "finding-neko/sightings/..."
    },
    "locationText": "Hem 12 Nguyen Van Bao, Go Vap",
    "latitude": 10.8136,
    "longitude": 106.6789,
    "description": "Be meo mau vang, dang di gan quan ca phe.",
    "candidates": [
      {
        "lostCatReportId": "...",
        "catId": "...",
        "ownerId": "...",
        "distanceMeters": 350,
        "status": "pending_owner_review"
      }
    ],
    "notificationCount": 1,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Ghi chu:

- Field file bat buoc ten la `image`.
- Moi sighting chi nhan 1 anh.
- Anh toi da 5MB.
- Chi ho tro JPG, PNG, WEBP.
- `matchRadiusKm` mac dinh la 3, toi da 10.
- Backend khong gui notification cho chinh chu meo neu ho tu bao thay meo cua minh.
- Backend luu in-app notification va gui Expo push notification neu chu meo da dang ky push token.
- Push notification co the hien khi app dang tat/chay nen neu may con ket noi mang va he dieu hanh cho phep notification.
- Neu tat nguon hoan toan, notification chi co the hien sau khi may bat lai va nhan push tu dich vu he dieu hanh.

### 12.1. Xem chi tiet bao cao thay meo

```http
GET /cat-sightings/<sightingId>
Authorization: Bearer <accessToken>
```

Ghi chu:

- Reporter xem duoc sighting cua minh.
- Chu meo nam trong candidate xem duoc sighting de xac nhan dung/sai.

### 13. Lay thong bao cua toi

```http
GET /notifications/me
Authorization: Bearer <accessToken>
```

Chi lay thong bao chua doc:

```http
GET /notifications/me?unreadOnly=true
Authorization: Bearer <accessToken>
```

Ket qua mong doi:

```json
{
  "success": true,
  "notifications": [
    {
      "id": "...",
      "recipientId": "...",
      "actorId": "...",
      "type": "cat_sighting_match",
      "title": "Co nguoi bao thay meo giong meo cua ban",
      "body": "...",
      "data": {
        "sightingId": "...",
        "lostCatReportId": "...",
        "catId": "...",
        "distanceMeters": 350
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### 14. Danh dau thong bao da doc

```http
PATCH /notifications/<notificationId>/read
Authorization: Bearer <accessToken>
```

Khong can body.

Ket qua mong doi:

```json
{
  "success": true,
  "notification": {
    "id": "...",
    "readAt": "..."
  }
}
```

## Reward va Leaderboard

Nguoi giup tim duoc meo chi duoc cong sao khi chu meo xac nhan mot sighting la dung. Flow test:

1. Chu meo bat che do meo lac bang `POST /lost-cats`.
2. User khac bao thay meo bang `POST /cat-sightings`.
3. Chu meo xem notification hoac response sighting de lay `sightingId` va `lostCatReportId`.
4. Chu meo goi API xac nhan ben duoi.
5. Backend cong sao cho reporter va dua vao bang xep hang.

### 15. Xac nhan nguoi giup tim thay meo va thuong sao

```http
POST /cat-sightings/<sightingId>/candidates/<lostCatReportId>/confirm
Authorization: Bearer <ownerAccessToken>
```

Khong can body.

Ket qua mong doi:

```json
{
  "success": true,
  "reward": {
    "id": "...",
    "recipientId": "...",
    "awardedBy": "...",
    "catId": "...",
    "lostCatReportId": "...",
    "sightingId": "...",
    "stars": 100,
    "reason": "found_lost_cat",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Ghi chu:

- Chi chu meo cua tin meo lac moi xac nhan duoc.
- Khong the tu thuong sao cho chinh minh.
- Moi tin meo lac chi duoc thuong sao 1 lan.
- Sau khi xac nhan:
  - Tin meo lac doi sang `resolved`.
  - Ho so meo doi `isLost = false`.
  - Candidate trong sighting doi sang `confirmed`.
  - Reporter duoc cong 100 sao.
  - Reporter nhan in-app notification va Expo push notification neu da dang ky token.

### 16. Lay bang xep hang

```http
GET /leaderboards?period=week
```

Co the dung:

```http
GET /leaderboards?period=week
GET /leaderboards?period=month
GET /leaderboards?period=all
```

Ket qua mong doi:

```json
{
  "success": true,
  "period": "week",
  "updatedAt": "...",
  "rankings": [
    {
      "rank": 1,
      "userId": "...",
      "username": "helper_01",
      "fullName": "Minh Thu",
      "totalStars": 300,
      "catsFound": 3
    }
  ]
}
```

Ghi chu:

- `week`: tinh 7 ngay gan nhat.
- `month`: tinh 1 thang gan nhat.
- `all`: tinh tat ca lich su.
- Bang xep hang lay tu collection `star_rewards`, khong lay tu so lieu tam thoi.

## Loi thuong gap

### 401 Unauthorized

Nguyen nhan:

- Thieu header `Authorization`.
- Token sai format.
- Token het han.

Dung format:

```text
Authorization: Bearer <accessToken>
```

### 400 Bad Request

Nguyen nhan thuong gap:

- Body thieu field bat buoc.
- Sai kieu du lieu.
- Upload qua 5 anh.
- Anh sai dinh dang.
- `ageMonths` khong phai so nguyen.

### 500 Cloudinary error

Nguyen nhan thuong gap:

- Thieu `CLOUDINARY_URL` trong `.env`.
- Sai API key/API secret/cloud name.
- Server chua restart sau khi sua `.env`.
