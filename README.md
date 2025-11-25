# Sports Competitions Management System

## 📋 Project Info
**Student:** Suleimenov A.O.  
**Group:** СИБ-24-2с  
**Subject:** Database Systems  
**Lab Work:** №7 - Client Application Development

## 🎯 Description
Full-stack web application for managing sports competitions database. Implements CRUD operations, stored procedures, triggers, and reporting functionality.

## 🛠 Tech Stack
- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes  
- **Database:** PostgreSQL 16 (Docker)
- **Database Features:**
  - 12 normalized tables
  - 6 stored procedures/functions
  - 3 triggers for data validation
  - Referential integrity constraints

## 📦 Features
✅ **CRUD Operations:**
- Athletes management (add, edit, delete, view)
- Coaches management
- Competitions management
- Results management

✅ **Reports:**
- Awards by competition and sport (stored procedure)
- Female athletes aged 18-20 (stored procedure)
- All results with filtering

✅ **Database Features:**
- Automatic validation via triggers
- Stored procedures for complex queries
- Transaction support

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- Docker Desktop
- Git

### 1. Clone Repository
```bash
git clone <your-repo>
cd sport-competitions
```

### 2. Start PostgreSQL Database
```bash
docker run --name sport-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sport_competitions -p 5432:5432 -d postgres:16
```

### 3. Initialize Database
```bash
# PowerShell:
Get-Content scripts/init-db.sql | docker exec -i sport-db psql -U postgres -d sport_competitions

# Bash:
docker exec -i sport-db psql -U postgres -d sport_competitions < scripts/init-db.sql
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Configure Environment
Create `.env.local`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/sport_competitions
```

### 6. Run Application
```bash
npm run dev
```

Open: **http://localhost:3000**

## 📊 Database Schema

### Tables:
- `sport_attributes` - Sport type attributes
- `competition_types` - Types of competitions
- `coaches` - Coach information
- `awards` - Award types
- `sport_types` - Sports catalog
- `competitions` - Competition details
- `athletes` - Athletes and teams
- `individual_athletes` - Individual athlete details
- `team_members` - Team composition
- `schedules` - Competition schedule
- `results` - Competition results
- `audit_goldmedals` - Audit log for gold medals

### Stored Procedures:
1. `sp_GetAwardsByCompetitionAndSport` - Get awards filtered by competition and sport
2. `sp_GetFemaleAthletes18to20` - Get female athletes in age range 18-20
3. `sp_InsertThreeCoaches` - Bulk insert three coaches
4. `fn_GetCompetitionDurationDays` - Calculate competition duration in days
5. `fn_CalculateAge` - Calculate athlete age
6. `fn_GetAthleteAwardCount` - Count athlete awards

### Triggers:
1. `TR_CheckResultDate` - Validate result dates against competition schedule
2. `TR_PreventCoachDelete` - Prevent deleting coaches with athletes
3. `TR_AuditGoldMedals` - Log gold medal awards to audit table

## 🎨 Application Pages

### Dashboard
- Statistics cards (athletes, coaches, competitions, awards count)
- Quick navigation to all sections

### Athletes Page
- View all athletes in table format
- Add new athlete
- Edit athlete information
- Delete athlete (with foreign key constraint validation)
- Filter by type (Individual/Team)

### Coaches Page
- View all coaches
- Add new coach
- Edit coach details
- Delete coach (protected by trigger if has athletes)

### Competitions Page
- View competitions as cards
- Competition type badges (Regional/National/World Championship)
- Add new competition

### Reports Page
- All results table with full details
- Stored procedure report: Awards by Competition and Sport
- Stored procedure report: Female Athletes 18-20 years old
- Color-coded award badges (Gold/Silver/Bronze)

## 🔧 Development

### Project Structure
```
sport-competitions/
├── app/
│   ├── page.tsx                 # Dashboard
│   ├── athletes/page.tsx        # Athletes CRUD
│   ├── coaches/page.tsx         # Coaches CRUD
│   ├── competitions/page.tsx    # Competitions CRUD
│   ├── reports/page.tsx         # Reports with stored procedures
│   ├── help/page.tsx            # Help page
│   ├── layout.tsx               # Layout with navigation
│   └── api/                     # API routes for database operations
├── lib/
│   └── db.ts                    # Database connection and queries
├── scripts/
│   └── init-db.sql              # Database initialization script
└── package.json
```

### Key Technologies
- **Next.js App Router** - Modern React framework with file-based routing
- **Server Components** - Fetch data on server, reduce client bundle
- **API Routes** - Backend endpoints for database operations
- **TypeScript** - Type safety throughout the application
- **Tailwind CSS** - Utility-first CSS framework
- **PostgreSQL** - Relational database with advanced features

## 📱 Features Demonstration

### CRUD Operations
All CRUD operations respect database constraints:
- Foreign key constraints
- Trigger validations
- Data type constraints
- Business logic rules

### Stored Procedures Integration
Reports page demonstrates calling PostgreSQL stored procedures from Next.js:
```typescript
// Example: Calling stored procedure
const result = await query(
  'SELECT * FROM sp_GetAwardsByCompetitionAndSport($1, $2)',
  [competitionId, sportTypeId]
);
```

### Trigger Protection
Triggers ensure data integrity:
- Cannot delete coach with athletes
- Result dates must be within competition schedule
- Automatic audit logging for gold medals

## 🎓 Learning Outcomes
- Full-stack web development with Next.js
- PostgreSQL database design and implementation
- Stored procedures and triggers
- CRUD operations with referential integrity
- Modern UI development with Tailwind CSS
- Docker containerization
- Three-tier architecture (Presentation, Application, Data)

## 📝 Database Labs Completed
- ✅ Lab 2: Database creation with 12 tables
- ✅ Lab 3: Complex SQL queries with JOINs
- ✅ Lab 4: Database views
- ✅ Lab 5: Stored procedures and functions
- ✅ Lab 6: Triggers
- ✅ Lab 7: Client application (this project)

## 🐛 Known Issues
None - application is production-ready for educational purposes.

## 📄 License
Educational project - СИБ-24-2с, 2024-2025 Academic Year

## 👤 Author
Suleimenov A.O.  
Group: СИБ-24-2с  
Karaganda Technical University