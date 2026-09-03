# KmerFoodLens — Guide Développement Backend Complet
**TechAINova v4.0 · Node.js + NestJS v10 · 2026**

> Ce document permet de développer le backend sans ambiguïté. Il est aligné avec le frontend React Native existant (`src/services/config.ts` → `localhost:3000/api` en dev, `api.kmerfoodlens.com/api` en prod).

---

## TABLE DES MATIÈRES

1. [Vue d'ensemble de l'architecture](#1-vue-densemble)
2. [Structure du monorepo NestJS](#2-structure-monorepo)
3. [Installation et configuration](#3-installation)
4. [Variables d'environnement](#4-variables-denvironnement)
5. [Schémas de base de données](#5-schemas-bdd)
6. [Module Auth — JWT RS256 + OTP + OAuth](#6-module-auth)
7. [Module Users](#7-module-users)
8. [Module Scanner IA (gRPC → Python)](#8-module-scanner)
9. [Module Restaurants](#9-module-restaurants)
10. [Module Orders + WebSocket](#10-module-orders)
11. [Module Payments — CinetPay v2](#11-module-payments)
12. [Module Events](#12-module-events)
13. [Module Courses](#13-module-courses)
14. [Module Games (Tombola)](#14-module-games)
15. [Module Community (Feed + Forum)](#15-module-community)
16. [Module Admin](#16-module-admin)
17. [Microservice IA — Python FastAPI](#17-microservice-ia)
18. [Sécurité transversale](#18-securite)
19. [WebSocket Socket.io — tous namespaces](#19-websocket)
20. [Docker Compose local](#20-docker-compose)
21. [CI/CD GitHub Actions](#21-cicd)
22. [Checklist d'intégration frontend](#22-checklist-frontend)

---

## 1. VUE D'ENSEMBLE

```
┌─────────────────────────────────────────────────────────────┐
│  React Native (Expo SDK 56)                                 │
│  src/services/api.client.ts → AES-256-GCM interceptors     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS TLS 1.3 (Cloudflare Pro)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  NestJS Gateway  :3000/api                                  │
│  11 modules · JWT RS256 · RBAC · Rate-limiting              │
│  PostgreSQL 16 (Prisma v5) + Redis 7 + BullMQ              │
└──────────────────────┬──────────────────────────────────────┘
                       │ gRPC mTLS :50051
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Python FastAPI :8000                                       │
│  TensorFlow MobileNetV2 + Google Gemini + Cloud STT        │
│  MongoDB 7 (scan history) + Redis (cache 24h)               │
└─────────────────────────────────────────────────────────────┘
```

**Flux chiffrement E2E :**
- Frontend chiffre payload sensible (AES-256-GCM, clé dérivée PBKDF2)
- NestJS reçoit `{ ciphertext, iv, rid, ts }` — déchiffre, valide anti-replay
- Réponse re-chiffrée avant envoi
- Transport : TLS 1.3 uniquement

---

## 2. STRUCTURE MONOREPO

```
kfl-backend/
├── apps/
│   ├── api/                        # NestJS principal :3000
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── scanner/
│   │   │   │   ├── restaurants/
│   │   │   │   ├── orders/
│   │   │   │   ├── payments/
│   │   │   │   ├── events/
│   │   │   │   ├── courses/
│   │   │   │   ├── games/
│   │   │   │   ├── community/
│   │   │   │   └── admin/
│   │   │   ├── common/
│   │   │   │   ├── guards/
│   │   │   │   ├── decorators/
│   │   │   │   ├── filters/
│   │   │   │   ├── interceptors/
│   │   │   │   └── pipes/
│   │   │   ├── crypto/
│   │   │   │   ├── aes.service.ts
│   │   │   │   └── anti-replay.service.ts
│   │   │   └── prisma/
│   │   │       └── prisma.service.ts
│   │   └── test/
│   └── ai-service/                 # Python FastAPI :8000
│       ├── main.py
│       ├── models/
│       ├── services/
│       └── proto/
├── libs/
│   └── shared/
│       ├── dto/
│       ├── interfaces/
│       └── proto/
│           └── ai.proto
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
├── docker-compose.prod.yml
└── .env.example
```

---

## 3. INSTALLATION

```bash
# Init projet NestJS avec monorepo
npm i -g @nestjs/cli
nest new kfl-backend --package-manager npm
cd kfl-backend

# Core dependencies
npm install @nestjs/passport passport passport-jwt passport-local
npm install @nestjs/jwt @nestjs/config
npm install @nestjs/throttler
npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express
npm install @nestjs/schedule bull @nestjs/bull
npm install @prisma/client prisma
npm install mongoose @nestjs/mongoose
npm install ioredis @nestjs/cache-manager cache-manager-ioredis
npm install socket.io @nestjs/websockets @nestjs/platform-socket.io
npm install @grpc/grpc-js @grpc/proto-loader @nestjs/microservices
npm install bcrypt speakeasy qrcode
npm install axios sharp uuid
npm install class-validator class-transformer
npm install @nestjs/swagger swagger-ui-express

# Dev dependencies
npm install -D @types/bcrypt @types/passport-jwt @types/passport-local
npm install -D @types/multer @types/uuid
```

---

## 4. VARIABLES D'ENVIRONNEMENT

Fichier `.env` (stocker les secrets dans HashiCorp Vault en prod) :

```env
# === APP ===
NODE_ENV=development
PORT=3000
APP_VERSION=4.0.0
CORS_ORIGINS=http://localhost:8081,exp://192.168.1.x

# === BASE DE DONNÉES ===
DATABASE_URL="postgresql://kfl_user:kfl_pass@localhost:5432/kfl_db?schema=public"
MONGO_URI="mongodb://kfl_user:kfl_pass@localhost:27017/kfl_community?authSource=admin"
REDIS_URL="redis://:kfl_redis_pass@localhost:6379"

# === JWT RS256 ===
# Générer : openssl genrsa -out private.pem 2048 && openssl rsa -in private.pem -pubout -out public.pem
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# === AES-256-GCM ===
# Même clé que le frontend (src/crypto/keys.ts)
AES_MASTER_KEY="hex-64-chars-master-key"
AES_SALT="hex-32-chars-salt"

# === OTP ===
OTP_SMS_PROVIDER=orange_api      # ou twilio
ORANGE_SMS_API_KEY=xxx
ORANGE_SMS_SENDER=KmerFoodLens
OTP_EXPIRY_SECONDS=300

# === OAUTH ===
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
APPLE_CLIENT_ID=cm.kfl.app
APPLE_TEAM_ID=xxx

# === CINETPAY ===
CINETPAY_API_KEY=xxx
CINETPAY_SITE_ID=xxx
CINETPAY_SECRET_KEY=xxx
CINETPAY_BASE_URL=https://api-checkout.cinetpay.com/v2
CINETPAY_NOTIFY_URL=https://api.kmerfoodlens.com/api/payments/webhook

# === IA MICROSERVICE ===
AI_GRPC_URL=localhost:50051
AI_GRPC_CERT_PATH=./certs/ca.crt
AI_GRPC_CLIENT_CERT=./certs/client.crt
AI_GRPC_CLIENT_KEY=./certs/client.key
GEMINI_API_KEY=xxx
GOOGLE_CLOUD_STT_KEY=xxx

# === CLOUDINARY ===
CLOUDINARY_CLOUD_NAME=kfl
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# === FIREBASE (Push Notifications) ===
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# === MONITORING ===
SENTRY_DSN=https://xxx@sentry.io/xxx
VAULT_ADDR=http://127.0.0.1:8200
VAULT_TOKEN=xxx
```

---

## 5. SCHÉMAS DE BASE DE DONNÉES

### 5.1 Prisma — PostgreSQL

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS ───────────────────────────────────────────────────
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  phone         String?   @unique
  passwordHash  String
  firstName     String
  lastName      String
  username      String    @unique
  role          Role      @default(STANDARD)
  isVerified    Boolean   @default(false)
  isActive      Boolean   @default(true)
  avatarUrl     String?
  city          String?
  bio           String?
  twoFactorSecret String?
  twoFactorEnabled Boolean @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  refreshTokens RefreshToken[]
  orders        Order[]
  reviews       Review[]
  savedRestaurants SavedRestaurant[]
  notifications Notification[]
  proProfile    ProProfile?
  eventRegistrations EventRegistration[]
  courseEnrollments CourseEnrollment[]
  tombolaTickets TombolaTicket[]
}

enum Role {
  STANDARD
  PRO
  ADMIN
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model ProProfile {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  restaurantName String?
  siretNumber    String?
  certifiedAt    DateTime?
  subscriptionId String?
  subscriptionEnd DateTime?
  stripeCustomerId String?
}

// ─── RESTAURANTS ──────────────────────────────────────────────
model Restaurant {
  id          String   @id @default(uuid())
  name        String
  description String?
  type        String
  city        String
  address     String
  phone       String?
  email       String?
  imageUrl    String?
  coverUrl    String?
  rating      Float    @default(0)
  reviewCount Int      @default(0)
  isOpen      Boolean  @default(true)
  openHours   Json?
  latitude    Float?
  longitude   Float?
  createdAt   DateTime @default(now())
  ownerId     String?

  menuItems   MenuItem[]
  orders      Order[]
  reviews     Review[]
  savedBy     SavedRestaurant[]
}

model MenuItem {
  id           String     @id @default(uuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  name         String
  description  String?
  price        Int        // en XAF
  category     String
  imageUrl     String?
  available    Boolean    @default(true)
  allergens    String[]
  createdAt    DateTime   @default(now())

  orderItems   OrderItem[]
}

model SavedRestaurant {
  userId       String
  restaurantId String
  user         User       @relation(fields: [userId], references: [id])
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  savedAt      DateTime   @default(now())

  @@id([userId, restaurantId])
}

model Review {
  id           String     @id @default(uuid())
  userId       String
  restaurantId String
  user         User       @relation(fields: [userId], references: [id])
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  rating       Int
  comment      String?
  createdAt    DateTime   @default(now())

  @@unique([userId, restaurantId])
}

// ─── ORDERS ───────────────────────────────────────────────────
model Order {
  id           String      @id @default(uuid())
  ref          String      @unique // KFL-XXXXXX
  userId       String
  restaurantId String
  user         User        @relation(fields: [userId], references: [id])
  restaurant   Restaurant  @relation(fields: [restaurantId], references: [id])
  status       OrderStatus @default(PENDING)
  deliveryMode String      @default("delivery") // delivery | pickup
  deliveryAddress String?
  note         String?
  subtotal     Int
  deliveryFee  Int         @default(1500)
  total        Int
  paymentMethod String?
  paymentRef   String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  items        OrderItem[]
  payment      Payment?
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  READY
  DELIVERED
  CANCELLED
}

model OrderItem {
  id         String   @id @default(uuid())
  orderId    String
  menuItemId String
  order      Order    @relation(fields: [orderId], references: [id])
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  quantity   Int
  unitPrice  Int
  note       String?
}

// ─── PAYMENTS ─────────────────────────────────────────────────
model Payment {
  id              String        @id @default(uuid())
  orderId         String        @unique
  order           Order         @relation(fields: [orderId], references: [id])
  amount          Int
  currency        String        @default("XAF")
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  cinetpayTxId    String?
  cinetpayRef     String?
  webhookReceived Boolean       @default(false)
  createdAt       DateTime      @default(now())
  paidAt          DateTime?
}

enum PaymentMethod {
  ORANGE_MONEY
  MTN_MOMO
  CARTE
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

// ─── EVENTS ───────────────────────────────────────────────────
model Event {
  id           String   @id @default(uuid())
  title        String
  description  String
  category     String
  date         DateTime
  location     String
  city         String
  price        Int      @default(0)
  isFree       Boolean  @default(false)
  maxAttendees Int
  imageUrl     String?
  organizer    String
  tags         String[]
  createdAt    DateTime @default(now())

  registrations EventRegistration[]
}

model EventRegistration {
  userId    String
  eventId   String
  user      User   @relation(fields: [userId], references: [id])
  event     Event  @relation(fields: [eventId], references: [id])
  registeredAt DateTime @default(now())

  @@id([userId, eventId])
}

// ─── COURSES ──────────────────────────────────────────────────
model Course {
  id          String   @id @default(uuid())
  title       String
  description String
  level       String   // Débutant | Intermédiaire | Expert
  duration    String
  price       Int
  imageUrl    String?
  videoUrl    String?  // HLS Cloudinary
  instructorId String
  tags        String[]
  createdAt   DateTime @default(now())

  enrollments CourseEnrollment[]
  lessons     Lesson[]
}

model Lesson {
  id        String @id @default(uuid())
  courseId  String
  course    Course @relation(fields: [courseId], references: [id])
  title     String
  duration  String
  videoUrl  String?
  order     Int
}

model CourseEnrollment {
  userId     String
  courseId   String
  user       User   @relation(fields: [userId], references: [id])
  course     Course @relation(fields: [courseId], references: [id])
  progress   Int    @default(0) // 0-100
  enrolledAt DateTime @default(now())
  completedAt DateTime?

  @@id([userId, courseId])
}

// ─── GAMES / TOMBOLA ──────────────────────────────────────────
model TombolaDraw {
  id           String   @id @default(uuid())
  title        String
  description  String
  ticketPrice  Int
  totalTickets Int
  soldTickets  Int      @default(0)
  isActive     Boolean  @default(true)
  endDate      DateTime
  drawDate     DateTime
  createdAt    DateTime @default(now())

  prizes   TombolaPrize[]
  tickets  TombolaTicket[]
}

model TombolaPrize {
  id       String      @id @default(uuid())
  drawId   String
  draw     TombolaDraw @relation(fields: [drawId], references: [id])
  rank     Int
  label    String
  value    Int
}

model TombolaTicket {
  id         String      @id @default(uuid())
  drawId     String
  userId     String
  draw       TombolaDraw @relation(fields: [drawId], references: [id])
  user       User        @relation(fields: [userId], references: [id])
  number     String
  status     String      @default("active") // active | won | lost
  prizeLabel String?
  purchasedAt DateTime   @default(now())
  paymentRef String?
}

// ─── NOTIFICATIONS ────────────────────────────────────────────
model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String
  title     String
  body      String
  data      Json?
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

### 5.2 Mongoose — MongoDB (Community + Logs)

```typescript
// src/modules/community/schemas/post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true }) authorId: string;
  @Prop({ required: true }) authorName: string;
  @Prop({ enum: ['standard', 'pro'], default: 'standard' }) authorRole: string;
  @Prop({ required: true }) initials: string;
  @Prop({ required: true }) avatarColor: string;
  @Prop({ required: true }) text: string;
  @Prop() dishTag?: string;
  @Prop() imageUrl?: string;
  @Prop({ default: 0 }) likes: number;
  @Prop({ type: [String], default: [] }) likedBy: string[];
  @Prop({ type: [String], default: [] }) savedBy: string[];
  @Prop({ type: Array, default: [] }) comments: Comment[];
  @Prop({ default: 0 }) reportCount: number;
}
export const PostSchema = SchemaFactory.createForClass(Post);

// src/modules/community/schemas/thread.schema.ts
@Schema({ timestamps: true })
export class Thread extends Document {
  @Prop({ required: true }) category: string;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) authorId: string;
  @Prop({ required: true }) authorName: string;
  @Prop({ required: true }) initials: string;
  @Prop({ required: true }) avatarColor: string;
  @Prop({ required: true }) body: string;
  @Prop({ type: Array, default: [] }) replies: Reply[];
  @Prop({ default: 0 }) likes: number;
  @Prop({ type: [String], default: [] }) likedBy: string[];
  @Prop({ default: false }) isPinned: boolean;
  @Prop({ default: 0 }) views: number;
}
export const ThreadSchema = SchemaFactory.createForClass(Thread);

// src/modules/scanner/schemas/scan.schema.ts
@Schema({ timestamps: true })
export class Scan extends Document {
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) dishName: string;
  @Prop({ required: true }) confidence: number;
  @Prop({ type: Array }) alternatives: string[];
  @Prop() imageUrl: string;
  @Prop({ type: Object }) nutritionData: Record<string, unknown>;
  @Prop() origin: string;
  @Prop({ type: Array }) ingredients: string[];
}
export const ScanSchema = SchemaFactory.createForClass(Scan);
```

---

## 6. MODULE AUTH

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Inscription + envoi OTP |
| POST | `/api/auth/verify-otp` | Public | Vérification OTP |
| POST | `/api/auth/login` | Public | Login email/password |
| POST | `/api/auth/refresh` | Public | Renouveler access token |
| POST | `/api/auth/logout` | JWT | Révoquer refresh token |
| POST | `/api/auth/forgot-password` | Public | Demande reset |
| POST | `/api/auth/reset-password` | Public | Nouveau mot de passe |
| POST | `/api/auth/google` | Public | OAuth Google (token id) |
| POST | `/api/auth/apple` | Public | OAuth Apple |
| POST | `/api/auth/2fa/enable` | JWT+Admin | Activer TOTP (admin) |
| POST | `/api/auth/2fa/verify` | JWT+Admin | Vérifier TOTP |

### Structure du module

```typescript
// src/modules/auth/auth.module.ts
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        privateKey: config.get('JWT_PRIVATE_KEY'),
        publicKey: config.get('JWT_PUBLIC_KEY'),
        signOptions: { algorithm: 'RS256', expiresIn: config.get('JWT_ACCESS_EXPIRES') },
      }),
    }),
    BullModule.registerQueue({ name: 'otp' }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, OtpService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

```typescript
// src/modules/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email déjà utilisé');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { ...dto, passwordHash, password: undefined },
    });

    await this.otpService.sendOtp(user.phone ?? user.email, user.id);
    return { message: 'OTP envoyé' };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<TokensDto> {
    const valid = await this.otpService.verify(dto.userId, dto.code);
    if (!valid) throw new UnauthorizedException('Code OTP invalide ou expiré');

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { isVerified: true },
    });

    return this.generateTokens(dto.userId);
  }

  async login(dto: LoginDto): Promise<TokensDto> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !await bcrypt.compare(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Identifiants invalides');
    }
    if (!user.isVerified) throw new ForbiddenException('Compte non vérifié');
    if (!user.isActive) throw new ForbiddenException('Compte désactivé');

    return this.generateTokens(user.id, user.role);
  }

  async refresh(refreshToken: string): Promise<TokensDto> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }

    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    return this.generateTokens(stored.user.id, stored.user.role);
  }

  private async generateTokens(userId: string, role = 'STANDARD'): Promise<TokensDto> {
    const payload = { sub: userId, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(40).toString('hex');

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }
}
```

```typescript
// src/modules/auth/otp.service.ts
@Injectable()
export class OtpService {
  constructor(private redis: RedisService, private config: ConfigService) {}

  async sendOtp(contact: string, userId: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${userId}`;
    await this.redis.set(key, code, 'EX', 300); // 5 minutes

    // Envoyer via Orange SMS API
    await axios.post(`${this.config.get('ORANGE_SMS_URL')}/sms`, {
      sender: 'KmerFoodLens',
      recipient: contact,
      message: `Votre code KFL : ${code}. Valable 5 minutes.`,
      apiKey: this.config.get('ORANGE_SMS_API_KEY'),
    });
  }

  async verify(userId: string, code: string): Promise<boolean> {
    const stored = await this.redis.get(`otp:${userId}`);
    if (stored !== code) return false;
    await this.redis.del(`otp:${userId}`);
    return true;
  }
}
```

```typescript
// src/common/guards/jwt.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// src/common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), context.getClass(),
    ]);
    if (!required) return true;

    const { user } = context.switchToHttp().getRequest();
    return required.includes(user.role);
  }
}

// src/common/decorators/roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### DTOs Auth

```typescript
// src/modules/auth/dto/register.dto.ts
export class RegisterDto {
  @IsEmail() email: string;
  @MinLength(8) @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsOptional() @IsPhoneNumber() phone?: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

export class VerifyOtpDto {
  @IsUUID() userId: string;
  @Length(6, 6) code: string;
}

export class TokensDto {
  accessToken: string;
  refreshToken: string;
}
```

---

## 7. MODULE USERS

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/users/me` | JWT | Profil courant |
| PATCH | `/api/users/me` | JWT | Modifier profil |
| POST | `/api/users/me/avatar` | JWT | Upload avatar |
| GET | `/api/users/:id` | JWT | Profil public |
| POST | `/api/users/upgrade-pro` | JWT | Demande passage Pro |
| GET | `/api/users/me/notifications` | JWT | Notifications |
| PATCH | `/api/users/me/notifications/:id` | JWT | Marquer lu |

```typescript
// src/modules/users/users.controller.ts
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req): Promise<UserDto> {
    return this.usersService.findById(req.user.sub);
  }

  @Patch('me')
  updateMe(@Req() req, @Body() dto: UpdateUserDto): Promise<UserDto> {
    return this.usersService.update(req.user.sub, dto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadAvatar(req.user.sub, file);
  }
}
```

---

## 8. MODULE SCANNER IA (gRPC → Python)

> **Flux complet**: App → AES-chiffré → `POST /api/scanner/analyze` → NestJS déchiffre → gRPC → Python FastAPI → TensorFlow → Gemini → réponse → NestJS re-chiffre → App

### Endpoint

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/scanner/analyze` | JWT | Analyser image (chiffrée AES) |
| POST | `/api/scanner/audio` | JWT | Reconnaissance vocale |
| GET | `/api/scanner/history` | JWT | Historique des scans |

```typescript
// src/modules/scanner/scanner.controller.ts
@Controller('scanner')
@UseGuards(JwtAuthGuard)
export class ScannerController {
  constructor(
    private scannerService: ScannerService,
    private aesService: AesService,
    private antiReplayService: AntiReplayService,
  ) {}

  @Post('analyze')
  async analyze(@Req() req, @Body() encryptedBody: EncryptedPayloadDto) {
    // 1. Anti-replay check
    await this.antiReplayService.validate(encryptedBody.rid, encryptedBody.ts);

    // 2. Déchiffrement AES-256-GCM
    const payload = await this.aesService.decrypt(encryptedBody);
    const { imageBase64 } = payload as { imageBase64: string };

    // 3. Appel gRPC au service Python
    const result = await this.scannerService.analyzeImage(req.user.sub, imageBase64);

    // 4. Re-chiffrement de la réponse
    return this.aesService.encrypt(result);
  }

  @Get('history')
  getHistory(@Req() req) {
    return this.scannerService.getHistory(req.user.sub);
  }
}

// src/modules/scanner/scanner.service.ts
@Injectable()
export class ScannerService {
  private grpcClient: AiServiceClient;

  constructor(
    @InjectModel(Scan.name) private scanModel: Model<Scan>,
    private config: ConfigService,
  ) {
    const credentials = grpc.credentials.createSsl(
      readFileSync(config.get('AI_GRPC_CERT_PATH')),
      readFileSync(config.get('AI_GRPC_CLIENT_KEY')),
      readFileSync(config.get('AI_GRPC_CLIENT_CERT')),
    );
    this.grpcClient = new AiServiceClient(
      config.get('AI_GRPC_URL'),
      credentials,
    );
  }

  async analyzeImage(userId: string, imageBase64: string): Promise<ScanResult> {
    return new Promise((resolve, reject) => {
      this.grpcClient.analyzeDish({ imageBase64 }, (err, response) => {
        if (err) return reject(err);

        // Sauvegarder dans MongoDB
        this.scanModel.create({
          userId,
          dishName: response.dishName,
          confidence: response.confidence,
          alternatives: response.alternatives,
          nutritionData: response.nutritionData,
          origin: response.origin,
          ingredients: response.ingredients,
        });

        resolve(response);
      });
    });
  }

  async getHistory(userId: string) {
    return this.scanModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
  }
}
```

### Proto file

```protobuf
// libs/shared/proto/ai.proto
syntax = "proto3";

package ai;

service AiService {
  rpc AnalyzeDish (AnalyzeRequest) returns (AnalyzeResponse);
  rpc TranscribeAudio (AudioRequest) returns (TranscribeResponse);
}

message AnalyzeRequest {
  string imageBase64 = 1;
}

message AnalyzeResponse {
  string dishName = 1;
  float confidence = 2;
  repeated string alternatives = 3;
  string origin = 4;
  repeated string ingredients = 5;
  NutritionData nutritionData = 6;
  string geminiDescription = 7;
}

message NutritionData {
  float calories = 1;
  float proteins = 2;
  float carbs = 3;
  float fats = 4;
  repeated string vitamins = 5;
}

message AudioRequest {
  bytes audioData = 1;
  string language = 2; // fr-FR | en-US
}

message TranscribeResponse {
  string transcript = 1;
  float confidence = 2;
}
```

---

## 9. MODULE RESTAURANTS

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/restaurants` | JWT | Liste (avec filtres) |
| GET | `/api/restaurants/:id` | JWT | Détail restaurant |
| GET | `/api/restaurants/:id/menu` | JWT | Menu complet |
| POST | `/api/restaurants/:id/save` | JWT | Sauvegarder |
| DELETE | `/api/restaurants/:id/save` | JWT | Retirer favoris |
| GET | `/api/restaurants/saved` | JWT | Restaurants sauvegardés |
| POST | `/api/restaurants/:id/reviews` | JWT | Poster avis |
| GET | `/api/restaurants/nearby` | JWT | Restaurants proches (lat/lon) |

```typescript
// src/modules/restaurants/restaurants.controller.ts
@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantsController {
  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.restaurantsService.findAll({ city, type, search, page, limit });
  }

  @Get('nearby')
  findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
    @Query('radius') radius = 5000, // mètres
  ) {
    return this.restaurantsService.findNearby(lat, lon, radius);
  }

  @Post(':id/save')
  save(@Req() req, @Param('id') id: string) {
    return this.restaurantsService.toggleSave(req.user.sub, id, true);
  }

  @Delete(':id/save')
  unsave(@Req() req, @Param('id') id: string) {
    return this.restaurantsService.toggleSave(req.user.sub, id, false);
  }
}
```

---

## 10. MODULE ORDERS + WEBSOCKET

### Endpoints REST

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/orders` | JWT | Créer commande |
| GET | `/api/orders` | JWT | Historique utilisateur |
| GET | `/api/orders/:id` | JWT | Détail commande |
| PATCH | `/api/orders/:id/cancel` | JWT | Annuler (si PENDING) |

```typescript
// src/modules/orders/orders.service.ts
@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private ordersGateway: OrdersGateway,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<Order> {
    const ref = `KFL-${Date.now().toString(36).toUpperCase()}`;

    const order = await this.prisma.order.create({
      data: {
        ref,
        userId,
        restaurantId: dto.restaurantId,
        deliveryMode: dto.deliveryMode,
        note: dto.note,
        subtotal: dto.subtotal,
        deliveryFee: dto.deliveryMode === 'delivery' ? 1500 : 0,
        total: dto.total,
        items: {
          create: dto.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            note: item.note,
          })),
        },
      },
      include: { items: { include: { menuItem: true } }, restaurant: true },
    });

    // Notifier le restaurant via WebSocket
    this.ordersGateway.notifyRestaurant(dto.restaurantId, order);
    // Push notification
    await this.notificationsService.sendPush(userId, {
      title: 'Commande confirmée',
      body: `Votre commande ${ref} a été transmise.`,
      data: { orderId: order.id, screen: 'OrderInvoice' },
    });

    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus, actorId: string): Promise<Order> {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Notifier le client via WebSocket
    this.ordersGateway.notifyUser(order.userId, { orderId, status });

    return order;
  }
}
```

### WebSocket Gateway Orders

```typescript
// src/modules/orders/orders.gateway.ts
@WebSocketGateway({ namespace: '/orders', cors: { origin: '*' } })
export class OrdersGateway {
  @WebSocketServer() server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { orderId?: string }) {
    if (data.orderId) client.join(`order:${data.orderId}`);
  }

  notifyUser(userId: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit('order_update', payload);
  }

  notifyRestaurant(restaurantId: string, order: unknown) {
    this.server.to(`restaurant:${restaurantId}`).emit('new_order', order);
  }
}
```

---

## 11. MODULE PAYMENTS — CINETPAY V2

### Flux de paiement (10 étapes)

```
1. App → POST /api/payments/initiate (chiffré AES)
2. NestJS → déchiffre payload
3. NestJS → POST https://api-checkout.cinetpay.com/v2/payment (CinetPay)
4. CinetPay → retourne { payment_url, transaction_id }
5. NestJS → crée Payment en base (PENDING) → re-chiffre réponse
6. App → affiche WebView paiement CinetPay
7. CinetPay → redirige vers app (deep link kfl://payment/callback)
8. App → GET /api/payments/:txId/status
9. CinetPay → POST /api/payments/webhook (HMAC-SHA256)
10. NestJS → valide signature HMAC → met à jour Payment + Order
```

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/payments/initiate` | JWT | Initier paiement (chiffré) |
| GET | `/api/payments/:txId/status` | JWT | Vérifier statut |
| POST | `/api/payments/webhook` | Signature HMAC | Webhook CinetPay |

```typescript
// src/modules/payments/payments.service.ts
@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private aesService: AesService,
    private ordersService: OrdersService,
  ) {}

  async initiate(userId: string, dto: InitiatePaymentDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
    });
    if (!order) throw new NotFoundException('Commande introuvable');

    const transactionId = `KFL-PAY-${Date.now()}`;

    const response = await axios.post(
      `${this.config.get('CINETPAY_BASE_URL')}/payment`,
      {
        apikey: this.config.get('CINETPAY_API_KEY'),
        site_id: this.config.get('CINETPAY_SITE_ID'),
        transaction_id: transactionId,
        amount: order.total,
        currency: 'XAF',
        description: `Commande ${order.ref}`,
        return_url: 'kfl://payment/callback',
        notify_url: this.config.get('CINETPAY_NOTIFY_URL'),
        channels: this.mapPaymentMethod(dto.method),
        customer_name: dto.customerName,
        customer_phone_number: dto.phone,
        customer_email: dto.email,
      },
    );

    if (response.data.code !== '201') {
      throw new BadRequestException('Échec initiation CinetPay');
    }

    await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        amount: order.total,
        method: dto.method as PaymentMethod,
        status: 'PENDING',
        cinetpayTxId: transactionId,
      },
    });

    return {
      paymentUrl: response.data.data.payment_url,
      transactionId,
    };
  }

  async handleWebhook(body: CinetpayWebhookDto, signature: string) {
    // 1. Valider signature HMAC-SHA256
    const expected = crypto
      .createHmac('sha256', this.config.get('CINETPAY_SECRET_KEY'))
      .update(JSON.stringify(body))
      .digest('hex');

    if (signature !== expected) throw new ForbiddenException('Signature invalide');

    // 2. Vérifier statut auprès de CinetPay
    const check = await axios.post(`${this.config.get('CINETPAY_BASE_URL')}/payment/check`, {
      apikey: this.config.get('CINETPAY_API_KEY'),
      site_id: this.config.get('CINETPAY_SITE_ID'),
      transaction_id: body.cpm_trans_id,
    });

    const isSuccess = check.data.data.cpm_result === '00';

    // 3. Mettre à jour la base
    const payment = await this.prisma.payment.update({
      where: { cinetpayTxId: body.cpm_trans_id },
      data: {
        status: isSuccess ? 'COMPLETED' : 'FAILED',
        cinetpayRef: body.cpm_paydirect_ref,
        webhookReceived: true,
        paidAt: isSuccess ? new Date() : undefined,
      },
      include: { order: true },
    });

    if (isSuccess) {
      await this.ordersService.updateStatus(payment.orderId, 'CONFIRMED', 'system');
    }
  }

  private mapPaymentMethod(method: string): string {
    const map: Record<string, string> = {
      ORANGE_MONEY: 'MOBILE_MONEY',
      MTN_MOMO: 'MOBILE_MONEY',
      CARTE: 'CREDIT_CARD',
    };
    return map[method] ?? 'ALL';
  }
}
```

---

## 12. MODULE EVENTS

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/events` | JWT | Liste événements |
| GET | `/api/events/:id` | JWT | Détail |
| POST | `/api/events/:id/register` | JWT | S'inscrire |
| DELETE | `/api/events/:id/register` | JWT | Se désinscrire |
| POST | `/api/events` | JWT+Admin | Créer événement |
| PATCH | `/api/events/:id` | JWT+Admin | Modifier |
| DELETE | `/api/events/:id` | JWT+Admin | Supprimer |

---

## 13. MODULE COURSES

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/courses` | JWT | Catalogue |
| GET | `/api/courses/:id` | JWT | Détail + leçons |
| POST | `/api/courses/:id/enroll` | JWT+Pro | S'inscrire |
| GET | `/api/courses/:id/lessons/:lessonId` | JWT+Pro | Vidéo HLS |
| PATCH | `/api/courses/:id/progress` | JWT+Pro | Mise à jour progression |
| POST | `/api/courses` | JWT+Admin | Créer cours |

---

## 14. MODULE GAMES (TOMBOLA)

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/games/tombola/draws` | JWT | Tirages actifs |
| GET | `/api/games/tombola/draws/:id` | JWT | Détail tirage |
| POST | `/api/games/tombola/draws/:id/tickets` | JWT | Acheter billets |
| GET | `/api/games/tombola/my-tickets` | JWT | Mes billets |

```typescript
// src/modules/games/games.service.ts
@Injectable()
export class GamesService {
  async buyTickets(userId: string, drawId: string, quantity: number, paymentRef: string) {
    const draw = await this.prisma.tombolaDraw.findUnique({ where: { id: drawId } });

    if (!draw.isActive) throw new BadRequestException('Ce tirage est terminé');
    if (draw.soldTickets + quantity > draw.totalTickets) {
      throw new BadRequestException('Billets insuffisants');
    }

    const tickets = Array.from({ length: quantity }, () => ({
      userId,
      drawId,
      number: `KFL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: 'active',
      paymentRef,
    }));

    await this.prisma.$transaction([
      this.prisma.tombolaTicket.createMany({ data: tickets }),
      this.prisma.tombolaDraw.update({
        where: { id: drawId },
        data: { soldTickets: { increment: quantity } },
      }),
    ]);

    // Notifier via WebSocket namespace /tombola
    this.tombolaGateway.broadcastTicketsSold(drawId, draw.soldTickets + quantity);

    return tickets;
  }
}
```

---

## 15. MODULE COMMUNITY

### Endpoints Feed

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/community/feed` | JWT | Posts récents |
| POST | `/api/community/feed` | JWT | Créer post |
| DELETE | `/api/community/feed/:id` | JWT | Supprimer son post |
| POST | `/api/community/feed/:id/like` | JWT | Liker |
| POST | `/api/community/feed/:id/save` | JWT | Sauvegarder |
| POST | `/api/community/feed/:id/comments` | JWT | Commenter |

### Endpoints Forum

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/community/forum/threads` | JWT | Liste threads |
| POST | `/api/community/forum/threads` | JWT | Créer thread |
| GET | `/api/community/forum/threads/:id` | JWT | Détail thread |
| POST | `/api/community/forum/threads/:id/replies` | JWT | Répondre |
| POST | `/api/community/forum/threads/:id/like` | JWT | Liker thread |

---

## 16. MODULE ADMIN

### Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/admin/metrics` | JWT+Admin | Métriques dashboard |
| GET | `/api/admin/users` | JWT+Admin | Liste utilisateurs |
| PATCH | `/api/admin/users/:id/role` | JWT+Admin | Changer rôle |
| PATCH | `/api/admin/users/:id/status` | JWT+Admin | Activer/désactiver |
| GET | `/api/admin/orders` | JWT+Admin | Toutes commandes |
| POST | `/api/admin/notifications/push` | JWT+Admin | Envoyer push broadcast |
| GET | `/api/admin/logs` | JWT+Admin | Logs système |
| GET | `/api/admin/moderation` | JWT+Admin | Contenus signalés |
| POST | `/api/admin/moderation/:id/approve` | JWT+Admin | Approuver |
| POST | `/api/admin/moderation/:id/reject` | JWT+Admin | Supprimer |

```typescript
// Métriques Admin (GraphQL pour Pro/Admin dashboard)
@Resolver()
export class AdminResolver {
  @Query(() => AdminMetricsType)
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async adminMetrics() {
    const [users, orders, revenue, posts, threads] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
      this.postModel.countDocuments(),
      this.threadModel.countDocuments(),
    ]);

    return { totalUsers: users, totalOrders: orders, totalRevenue: revenue._sum.amount ?? 0, totalPosts: posts, totalThreads: threads };
  }
}
```

---

## 17. MICROSERVICE IA — PYTHON FASTAPI

```python
# apps/ai-service/main.py
from fastapi import FastAPI
import grpc
from concurrent import futures
import ai_pb2_grpc
from services.recognition import RecognitionService
from services.gemini import GeminiService

app = FastAPI(title="KFL AI Service")
recognition = RecognitionService()  # TensorFlow MobileNetV2
gemini = GeminiService()

class AiServicer(ai_pb2_grpc.AiServiceServicer):
    async def AnalyzeDish(self, request, context):
        # 1. Décoder l'image base64
        img_data = base64.b64decode(request.imageBase64)
        
        # 2. Prédiction TensorFlow (modèle fine-tuné sur 47 plats camerounais)
        result = recognition.predict(img_data)
        
        # 3. Enrichissement Gemini
        enrichment = await gemini.enrich(result['dish_name'])
        
        # 4. Retourner réponse gRPC
        return ai_pb2.AnalyzeResponse(
            dishName=result['dish_name'],
            confidence=result['confidence'],
            alternatives=result['alternatives'][:3],
            origin=enrichment['origin'],
            ingredients=enrichment['ingredients'],
            nutritionData=ai_pb2.NutritionData(**enrichment['nutrition']),
            geminiDescription=enrichment['description'],
        )

def serve():
    # Charger certificats mTLS
    with open('certs/server.key', 'rb') as f: private_key = f.read()
    with open('certs/server.crt', 'rb') as f: certificate = f.read()
    with open('certs/ca.crt', 'rb') as f: ca_cert = f.read()

    credentials = grpc.ssl_server_credentials(
        [(private_key, certificate)],
        root_certificates=ca_cert,
        require_client_auth=True,
    )

    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=4))
    ai_pb2_grpc.add_AiServiceServicer_to_server(AiServicer(), server)
    server.add_secure_port('[::]:50051', credentials)
    return server

# apps/ai-service/services/recognition.py
import tensorflow as tf
import numpy as np
from PIL import Image
import io

class RecognitionService:
    def __init__(self):
        # Modèle MobileNetV2 fine-tuné sur 47 plats camerounais
        self.model = tf.keras.models.load_model('./models/kfl_dishes_v4.h5')
        self.labels = open('./models/labels.txt').read().splitlines()
        self.input_size = (224, 224)

    def predict(self, img_data: bytes) -> dict:
        img = Image.open(io.BytesIO(img_data)).convert('RGB').resize(self.input_size)
        arr = tf.keras.applications.mobilenet_v2.preprocess_input(
            np.array(img)[np.newaxis]
        )
        preds = self.model.predict(arr)[0]
        top3_idx = preds.argsort()[-3:][::-1]

        return {
            'dish_name': self.labels[top3_idx[0]],
            'confidence': float(preds[top3_idx[0]]),
            'alternatives': [self.labels[i] for i in top3_idx[1:]],
        }

# apps/ai-service/services/gemini.py
import google.generativeai as genai

class GeminiService:
    def __init__(self):
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        self.model = genai.GenerativeModel('gemini-pro')

    async def enrich(self, dish_name: str) -> dict:
        prompt = f"""
        Pour le plat camerounais "{dish_name}", fournis en JSON :
        - origin: région d'origine
        - description: description courte (2 phrases)
        - ingredients: liste des 5-8 ingrédients principaux
        - nutrition: {{ calories, proteins, carbs, fats, vitamins }}
        Réponds UNIQUEMENT en JSON valide.
        """
        response = await self.model.generate_content_async(prompt)
        return json.loads(response.text)
```

---

## 18. SÉCURITÉ TRANSVERSALE

### 18.1 Service AES-256-GCM (NestJS)

```typescript
// src/crypto/aes.service.ts
import { createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync } from 'crypto';

@Injectable()
export class AesService {
  private readonly key: Buffer;

  constructor(private config: ConfigService) {
    this.key = pbkdf2Sync(
      config.get('AES_MASTER_KEY'),
      config.get('AES_SALT'),
      100000, 32, 'sha256',
    );
  }

  async decrypt(payload: EncryptedPayloadDto): Promise<unknown> {
    const iv = Buffer.from(payload.iv, 'hex');
    const tag = Buffer.from(payload.tag, 'hex');
    const encrypted = Buffer.from(payload.ciphertext, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(decrypted.toString('utf8'));
  }

  async encrypt(data: unknown): Promise<EncryptedPayloadDto> {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final(),
    ]);

    return {
      ciphertext: encrypted.toString('hex'),
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex'),
    };
  }
}
```

### 18.2 Anti-Replay

```typescript
// src/crypto/anti-replay.service.ts
@Injectable()
export class AntiReplayService {
  constructor(private redis: RedisService) {}

  async validate(rid: string, ts: number): Promise<void> {
    const now = Date.now();
    if (Math.abs(now - ts) > 300_000) throw new UnauthorizedException('Requête expirée');

    const key = `replay:${rid}`;
    const exists = await this.redis.exists(key);
    if (exists) throw new UnauthorizedException('Requête rejouée');

    await this.redis.set(key, '1', 'EX', 300);
  }
}
```

### 18.3 Rate Limiting

```typescript
// app.module.ts
ThrottlerModule.forRoot([
  { name: 'short',  ttl: 1000,  limit: 5   },   // 5 req/sec
  { name: 'medium', ttl: 60000, limit: 100 },    // 100 req/min
  { name: 'long',   ttl: 3600000, limit: 1000 }, // 1000 req/h
]),
```

### 18.4 Intercepteur global chiffrement

```typescript
// src/common/interceptors/crypto.interceptor.ts
// Applique déchiffrement/chiffrement uniquement sur routes :
const ENCRYPTED_ROUTES = ['/scanner/analyze', '/payments/initiate'];
```

---

## 19. WEBSOCKET SOCKET.IO — TOUS NAMESPACES

| Namespace | Events Client→Serveur | Events Serveur→Client |
|-----------|----------------------|----------------------|
| `/orders` | `join { orderId }` | `order_update { orderId, status }` |
| `/chat` | `join { threadId }`, `message { text }` | `new_message { ... }` |
| `/tombola` | `join { drawId }` | `ticket_sold { drawId, totalSold }`, `draw_result { winner }` |
| `/admin` | `join` | `new_order { ... }`, `user_activity { ... }`, `alert { ... }` |

```typescript
// src/modules/community/chat.gateway.ts
@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { threadId: string }) {
    client.join(`thread:${data.threadId}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { threadId: string; text: string },
  ) {
    const reply = await this.communityService.addReply(client.data.userId, data.threadId, data.text);
    this.server.to(`thread:${data.threadId}`).emit('new_message', reply);
  }
}

// Guard WebSocket JWT
@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.auth?.token ?? client.handshake.headers?.authorization?.replace('Bearer ', '');
    
    try {
      const payload = this.jwtService.verify(token, {
        publicKey: this.config.get('JWT_PUBLIC_KEY'),
        algorithms: ['RS256'],
      });
      client.data.userId = payload.sub;
      client.data.role = payload.role;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
```

---

## 20. DOCKER COMPOSE LOCAL

```yaml
# docker-compose.yml
version: '3.9'

services:
  # ─── Bases de données ─────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: kfl_db
      POSTGRES_USER: kfl_user
      POSTGRES_PASSWORD: kfl_pass
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U kfl_user']
      interval: 5s
      timeout: 5s
      retries: 5

  mongo:
    image: mongo:7.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: kfl_user
      MONGO_INITDB_ROOT_PASSWORD: kfl_pass
      MONGO_INITDB_DATABASE: kfl_community
    ports:
      - '27017:27017'
    volumes:
      - mongodata:/data/db

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass kfl_redis_pass
    ports:
      - '6379:6379'
    volumes:
      - redisdata:/data

  # ─── Application ─────────────────────────────────────────
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - '3000:3000'
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
      mongo:
        condition: service_started
      redis:
        condition: service_started
    volumes:
      - ./apps/api/src:/app/src
    command: npm run start:dev

  ai-service:
    build:
      context: apps/ai-service
      dockerfile: Dockerfile
    ports:
      - '50051:50051'
    env_file: .env
    volumes:
      - ./apps/ai-service/models:/app/models
      - ./certs:/app/certs

volumes:
  pgdata:
  mongodata:
  redisdata:
```

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/apps/api/main"]
```

```dockerfile
# apps/ai-service/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 50051
CMD ["python", "main.py"]
```

```
# apps/ai-service/requirements.txt
fastapi==0.111.0
grpcio==1.64.0
grpcio-tools==1.64.0
tensorflow==2.17.0
Pillow==10.3.0
google-generativeai==0.7.0
google-cloud-speech==2.26.0
numpy==1.26.4
uvicorn==0.30.0
python-jose==3.3.0
```

---

## 21. CI/CD GITHUB ACTIONS

```yaml
# .github/workflows/deploy.yml
name: CI/CD KFL Backend

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: kfl_test
          POSTGRES_USER: kfl_user
          POSTGRES_PASSWORD: kfl_pass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        options: --health-cmd "redis-cli ping"

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma db push
        env:
          DATABASE_URL: postgresql://kfl_user:kfl_pass@localhost:5432/kfl_test
      - run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://kfl_user:kfl_pass@localhost:5432/kfl_test
          REDIS_URL: redis://localhost:6379

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Build & Push Docker images
        run: |
          docker build -t kfl-api:${{ github.sha }} apps/api
          docker build -t kfl-ai:${{ github.sha }} apps/ai-service
          # Push vers registry...

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/kfl-api api=kfl-api:${{ github.sha }}
          kubectl set image deployment/kfl-ai ai=kfl-ai:${{ github.sha }}
          kubectl rollout status deployment/kfl-api
```

---

## 22. CHECKLIST INTÉGRATION FRONTEND

Une fois le backend déployé sur `localhost:3000`, voici ce qui doit changer côté frontend :

### src/services/config.ts — Vérifier

```typescript
// Les endpoints doivent correspondre exactement aux routes NestJS
export const ENDPOINTS = {
  // Auth
  REGISTER:        '/auth/register',
  VERIFY_OTP:      '/auth/verify-otp',
  LOGIN:           '/auth/login',
  REFRESH:         '/auth/refresh',
  LOGOUT:          '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',

  // Scanner (chiffré AES)
  SCAN_ANALYZE:    '/scanner/analyze',    // POST, body chiffré
  SCAN_AUDIO:      '/scanner/audio',      // POST
  SCAN_HISTORY:    '/scanner/history',    // GET

  // Restaurants
  RESTAURANTS:     '/restaurants',        // GET
  RESTAURANT_SAVE: '/restaurants/:id/save',

  // Orders
  ORDERS:          '/orders',             // GET + POST
  ORDER_DETAIL:    '/orders/:id',

  // Payments (chiffré AES)
  PAYMENT_INIT:    '/payments/initiate',  // POST, body chiffré

  // Community
  FEED:            '/community/feed',
  FORUM_THREADS:   '/community/forum/threads',

  // Events
  EVENTS:          '/events',

  // Games
  TOMBOLA_DRAWS:   '/games/tombola/draws',
  MY_TICKETS:      '/games/tombola/my-tickets',
};
```

### Étapes d'intégration par ordre

1. **Auth** — Remplacer `mock.auth.ts` par vrais appels dans Login.tsx + Signup.tsx
2. **Restaurants** — Remplacer `restaurant.store.ts` seed data par `GET /api/restaurants`
3. **Orders** — Remplacer `orders.store.ts` par `POST /api/orders` + WebSocket `/orders`
4. **Payments** — Wirer `OrderPayment.tsx` sur `POST /api/payments/initiate` (AES déjà configuré dans interceptors.ts)
5. **Scanner** — Wirer `ScannerResult.tsx` sur `POST /api/scanner/analyze` (AES déjà configuré)
6. **Community** — Feed + Forum via `/api/community/*`
7. **Events** — `GET /api/events` + `POST /api/events/:id/register`
8. **Tombola** — `GET /api/games/tombola/draws` + `POST /api/games/tombola/draws/:id/tickets`

---

## DÉMARRAGE RAPIDE LOCAL

```bash
# 1. Démarrer les services
docker-compose up -d postgres mongo redis

# 2. Migrations Prisma
npx prisma migrate dev --name init
npx prisma db seed  # seed initial restaurants + admin

# 3. Démarrer NestJS en dev
npm run start:dev

# 4. Démarrer le service IA Python
cd apps/ai-service && python main.py

# 5. Tester l'API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kfl.cm","password":"Admin@2026!"}'

# Comptes de démo (à seeder)
# admin@kfl.cm     / Admin@2026!    → ADMIN
# pro@kfl.cm       / Pro@2026!      → PRO
# amah@example.com / Standard@2026! → STANDARD
```

---

*Document généré par TechAINova · KmerFoodLens v4.0 · 2026*  
*Aligné avec la spécification architecture PDF et le frontend React Native existant*
