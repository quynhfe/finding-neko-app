# ExeProject Backend (NestJS + MongoDB Atlas)

Backend REST API cho ExeProject. Stack: **NestJS 10 + Mongoose + JWT + MongoDB Atlas**.

## Cấu trúc thư mục

```
be/
├── src/
│   ├── main.ts                       # Bootstrap NestJS, CORS, ValidationPipe, Global filter
│   ├── app.module.ts                 # Root module: ConfigModule + MongooseModule + Auth + User
│   ├── config/
│   │   ├── database.config.ts        # MongoDB Atlas connection factory
│   │   └── jwt.config.ts             # JWT module options
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts   # Global exception handler
│   │   └── decorators/
│   │       └── current-user.decorator.ts  # @CurrentUser() lấy req.user
│   ├── models/
│   │   └── user.schema.ts            # Mongoose schema User (entity)
│   └── modules/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts    # POST /api/auth/register, /api/auth/login
│       │   ├── auth.service.ts       # bcrypt hash + JWT sign
│       │   ├── dto/
│       │   │   ├── register.dto.ts
│       │   │   └── login.dto.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts   # passport-jwt validate
│       │   └── guards/
│       │       └── jwt-auth.guard.ts
│       └── user/
│           ├── user.module.ts
│           └── user.controller.ts    # GET /api/users/me (protected)
├── .env                              # Biến môi trường (KHÔNG commit)
├── .env.example                      # Template
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── nest-cli.json
```

## Setup MongoDB Atlas (Free Tier)

Vì bạn chưa có Atlas, làm theo các bước dưới đây:

### Bước 1 — Tạo tài khoản Atlas

1. Vào https://www.mongodb.com/cloud/atlas/register
2. Đăng ký bằng Google/GitHub hoặc email
3. Sau khi đăng nhập → chọn **"Build a Database"** → chọn gói **M0 FREE** (Shared, $0/tháng)

### Bước 2 — Tạo Cluster

1. Provider: chọn **AWS** (hoặc Google Cloud)
2. Region: chọn region gần Việt Nam nhất → **Singapore (ap-southeast-1)** hoặc **Mumbai**
3. Cluster Name: đặt là `exequynh-cluster` (hoặc tên gì cũng được)
4. Click **"Create Deployment"** → đợi 1–3 phút để Atlas provision cluster

### Bước 3 — Tạo Database User

Atlas sẽ tự động hiện popup **"Security Quickstart"**:

1. **Username**: ví dụ `exequynh_admin`
2. **Password**: click **"Autogenerate Secure Password"** → **COPY và lưu lại** (sẽ cần cho connection string)
3. Click **"Create User"**

### Bước 4 — Whitelist IP

1. Trong cùng popup, scroll xuống phần **"Where would you like to connect from?"**
2. Chọn **"My Local Environment"** → click **"Add My Current IP Address"**
3. (Dev: bạn có thể click **"Add a Different IP Address"** → nhập `0.0.0.0/0` để cho phép mọi IP — KHÔNG nên dùng cho production)
4. Click **"Finish and Close"**

### Bước 5 — Lấy Connection String

1. Sidebar trái → **"Database"** → tại cluster vừa tạo, click nút **"Connect"**
2. Chọn **"Drivers"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy connection string, dạng:
   ```
   mongodb+srv://exequynh_admin:<password>@exequynh-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=exequynh-cluster
   ```
5. Thay `<password>` bằng password đã lưu ở Bước 3
6. Thêm tên database `ExeProject` vào trước dấu `?`:
   ```
   mongodb+srv://exequynh_admin:YourPass123@exequynh-cluster.xxxxx.mongodb.net/ExeProject?retryWrites=true&w=majority&appName=exequynh-cluster
   ```

### Bước 6 — Cấu hình `.env`

Mở file `be/.env`, thay giá trị `MONGODB_URI` bằng connection string vừa tạo:

```env
MONGODB_URI=mongodb+srv://exequynh_admin:YourPass123@exequynh-cluster.xxxxx.mongodb.net/ExeProject?retryWrites=true&w=majority
MONGODB_DB_NAME=ExeProject
JWT_SECRET=hãy-thay-bằng-chuỗi-random-dài-ít-nhất-32-ký-tự
```

> ⚠️ **Lưu ý bảo mật**: Nếu password chứa ký tự đặc biệt (`@`, `:`, `/`, `?`, `#`), phải URL-encode: `@` → `%40`, `:` → `%3A`, v.v.

## Cài đặt & chạy

```bash
cd be
npm install
npm run start:dev
```

Server chạy tại **http://localhost:5000/api**.

Khi thấy log `Server running on http://localhost:5000/api` và không có lỗi MongoDB → kết nối thành công.

## Test API mẫu

### 1. Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "fullName": "Test User"
  }'
```

Response:
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65xxxx...",
    "email": "test@example.com",
    "fullName": "Test User",
    "role": "user",
    "isActive": true,
    "createdAt": "2026-...",
    "updatedAt": "2026-..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 3. Get current user (protected)

```bash
TOKEN="<accessToken từ login>"

curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "65xxxx...",
    "email": "test@example.com",
    "role": "user"
  }
}
```

## API Endpoints

| Method | Path                  | Auth      | Mô tả                      |
| ------ | --------------------- | --------- | -------------------------- |
| POST   | `/api/auth/register`  | Public    | Tạo user mới               |
| POST   | `/api/auth/login`     | Public    | Đăng nhập, trả accessToken |
| GET    | `/api/users/me`       | Bearer JWT | Lấy thông tin user hiện tại |

## Format response lỗi (chuẩn hóa qua Global Filter)

```json
{
  "success": false,
  "statusCode": 401,
  "error": "UnauthorizedException",
  "message": "Email hoặc mật khẩu không đúng",
  "path": "/api/auth/login",
  "timestamp": "2026-05-01T10:35:00.000Z"
}
```

## Troubleshooting

- **`MongooseServerSelectionError`**: kiểm tra IP đã whitelist trên Atlas chưa, password trong URI đã đúng và URL-encoded chưa.
- **`JsonWebTokenError`**: token đã hết hạn (mặc định 7 ngày) hoặc `JWT_SECRET` thay đổi → login lại.
- **`E11000 duplicate key`**: email đã tồn tại — dùng email khác hoặc xóa user trên Atlas (Database → Browse Collections).

## Mở rộng

Khi thêm module mới (vd. `product`, `order`):

```bash
# Tạo skeleton module
npx nest g module modules/product
npx nest g controller modules/product
npx nest g service modules/product

# Hoặc tạo tay theo pattern auth/user hiện có
```
