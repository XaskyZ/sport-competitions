import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

// Utility function for queries
export async function query(text: string, params: any[] = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows;
    } finally {
        client.release();
    }
}

// Get all athletes
export async function getAthletes() {
    return query(`
    SELECT 
      a.id, 
      a.name, 
      a.type,
      st.name as sport_type,
      c.full_name as coach_name
    FROM athletes a
    JOIN sport_types st ON a.sport_type_id = st.id
    JOIN coaches c ON a.coach_id = c.id
    ORDER BY a.name
  `);
}

// Get athletes for dropdown (simple format)
export async function getAthletesSimple() {
    return query('SELECT id, name FROM athletes ORDER BY name');
}

// Get competitions for dropdown (simple format)
export async function getCompetitionsSimple() {
    return query('SELECT id, name FROM competitions ORDER BY name');
}

// Get all coaches
export async function getCoaches() {
    return query(`SELECT * FROM coaches ORDER BY full_name`);
}

// Get all competitions
export async function getCompetitions() {
    return query(`
    SELECT 
      c.id,
      c.name,
      ct.name as type
    FROM competitions c
    JOIN competition_types ct ON c.type_id = ct.id
    ORDER BY c.name
  `);
}

// Get statistics for dashboard
export async function getStats() {
    const [athletes, coaches, competitions, awards] = await Promise.all([
        query('SELECT COUNT(*) as count FROM athletes'),
        query('SELECT COUNT(*) as count FROM coaches'),
        query('SELECT COUNT(*) as count FROM competitions'),
        query('SELECT COUNT(*) as count FROM results'),
    ]);

    return {
        athletes: athletes[0].count,
        coaches: coaches[0].count,
        competitions: competitions[0].count,
        awards: awards[0].count,
    };
}

// Get sport types for dropdown
export async function getSportTypes() {
    return query('SELECT id, name FROM sport_types ORDER BY name');
}

// Get athlete by ID
export async function getAthleteById(id: number) {
    const result = await query(`
    SELECT 
      a.id, 
      a.name, 
      a.type,
      a.sport_type_id,
      a.coach_id,
      st.name as sport_type,
      c.full_name as coach_name
    FROM athletes a
    JOIN sport_types st ON a.sport_type_id = st.id
    JOIN coaches c ON a.coach_id = c.id
    WHERE a.id = $1
  `, [id]);
    return result[0];
}

// Create athlete
export async function createAthlete(name: string, type: string, sportTypeId: number, coachId: number) {
    const result = await query(
        'INSERT INTO athletes (name, type, sport_type_id, coach_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, type, sportTypeId, coachId]
    );
    return result[0];
}

// Update athlete
export async function updateAthlete(id: number, name: string, type: string, sportTypeId: number, coachId: number) {
    await query(
        'UPDATE athletes SET name = $1, type = $2, sport_type_id = $3, coach_id = $4 WHERE id = $5',
        [name, type, sportTypeId, coachId, id]
    );
}

// Delete athlete
export async function deleteAthlete(id: number) {
    await query('DELETE FROM athletes WHERE id = $1', [id]);
}

// ==================== COACHES CRUD ====================

// Get coach by ID
export async function getCoachById(id: number) {
    const result = await query('SELECT * FROM coaches WHERE id = $1', [id]);
    return result[0];
}

// Create coach
export async function createCoach(fullName: string) {
    const result = await query(
        'INSERT INTO coaches (full_name) VALUES ($1) RETURNING id',
        [fullName]
    );
    return result[0];
}

// Update coach
export async function updateCoach(id: number, fullName: string) {
    await query('UPDATE coaches SET full_name = $1 WHERE id = $2', [fullName, id]);
}

// Delete coach
export async function deleteCoach(id: number) {
    await query('DELETE FROM coaches WHERE id = $1', [id]);
}

// ==================== COMPETITIONS CRUD ====================

// Get competition types for dropdown
export async function getCompetitionTypes() {
    return query('SELECT id, name FROM competition_types ORDER BY name');
}

// Get competitions with type_id
export async function getCompetitionsWithTypeId() {
    return query(`
    SELECT 
      c.id,
      c.name,
      c.type_id,
      ct.name as type
    FROM competitions c
    JOIN competition_types ct ON c.type_id = ct.id
    ORDER BY c.name
  `);
}

// Get competition by ID
export async function getCompetitionById(id: number) {
    const result = await query(`
    SELECT c.id, c.name, c.type_id, ct.name as type
    FROM competitions c
    JOIN competition_types ct ON c.type_id = ct.id
    WHERE c.id = $1
  `, [id]);
    return result[0];
}

// Create competition
export async function createCompetition(name: string, typeId: number) {
    const result = await query(
        'INSERT INTO competitions (name, type_id) VALUES ($1, $2) RETURNING id',
        [name, typeId]
    );
    return result[0];
}

// Update competition
export async function updateCompetition(id: number, name: string, typeId: number) {
    await query('UPDATE competitions SET name = $1, type_id = $2 WHERE id = $3', [name, typeId, id]);
}

// Delete competition
export async function deleteCompetition(id: number) {
    await query('DELETE FROM competitions WHERE id = $1', [id]);
}

// ==================== RESULTS CRUD ====================

// Get all results with related data
export async function getResults() {
    return query(`
    SELECT 
      r.id,
      r.competition_id,
      r.sport_type_id,
      r.athlete_id,
      r.award_id,
      r.event_date,
      c.name as competition_name,
      st.name as sport_type,
      a.name as athlete_name,
      aw.name as award_name
    FROM results r
    JOIN competitions c ON r.competition_id = c.id
    JOIN sport_types st ON r.sport_type_id = st.id
    JOIN athletes a ON r.athlete_id = a.id
    JOIN awards aw ON r.award_id = aw.id
    ORDER BY r.event_date DESC
  `);
}

// Get awards for dropdown
export async function getAwards() {
    return query('SELECT id, name FROM awards ORDER BY id');
}

// Get result by ID
export async function getResultById(id: number) {
    const result = await query(`
    SELECT 
      r.id,
      r.competition_id,
      r.sport_type_id,
      r.athlete_id,
      r.award_id,
      r.event_date
    FROM results r
    WHERE r.id = $1
  `, [id]);
    return result[0];
}

// Create result
export async function createResult(
    competitionId: number,
    sportTypeId: number,
    athleteId: number,
    awardId: number,
    eventDate: string
) {
    const result = await query(
        'INSERT INTO results (competition_id, sport_type_id, athlete_id, award_id, event_date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [competitionId, sportTypeId, athleteId, awardId, eventDate]
    );
    return result[0];
}

// Update result
export async function updateResult(
    id: number,
    competitionId: number,
    sportTypeId: number,
    athleteId: number,
    awardId: number,
    eventDate: string
) {
    await query(
        'UPDATE results SET competition_id = $1, sport_type_id = $2, athlete_id = $3, award_id = $4, event_date = $5 WHERE id = $6',
        [competitionId, sportTypeId, athleteId, awardId, eventDate, id]
    );
}

// Delete result
export async function deleteResult(id: number) {
    await query('DELETE FROM results WHERE id = $1', [id]);
}