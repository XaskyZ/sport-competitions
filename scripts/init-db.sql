-- ================================================================================
-- SPORTS COMPETITIONS DATABASE - PostgreSQL 16
-- Converted from MS SQL Server
-- ================================================================================

-- Drop existing tables
DROP TABLE IF EXISTS Results CASCADE;
DROP TABLE IF EXISTS Schedules CASCADE;
DROP TABLE IF EXISTS Team_Members CASCADE;
DROP TABLE IF EXISTS Individual_Athletes CASCADE;
DROP TABLE IF EXISTS Athletes CASCADE;
DROP TABLE IF EXISTS Coaches CASCADE;
DROP TABLE IF EXISTS Awards CASCADE;
DROP TABLE IF EXISTS Competitions CASCADE;
DROP TABLE IF EXISTS Competition_Types CASCADE;
DROP TABLE IF EXISTS Sport_Types CASCADE;
DROP TABLE IF EXISTS Sport_Attributes CASCADE;
DROP TABLE IF EXISTS Audit_GoldMedals CASCADE;

-- ================================================================================
-- CREATE TABLES
-- ================================================================================

-- 1. Sport Attributes
CREATE TABLE Sport_Attributes (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    CHECK (Name IN ('Team', 'Individual', 'Pair'))
);

-- 2. Competition Types
CREATE TABLE Competition_Types (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    CHECK (Name IN ('Regional', 'National Championship', 'World Championship'))
);

-- 3. Coaches
CREATE TABLE Coaches (
    ID SERIAL PRIMARY KEY,
    Full_Name VARCHAR(150) NOT NULL
);

-- 4. Awards
CREATE TABLE Awards (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    CHECK (Name IN ('Gold Medal', 'Silver Medal', 'Bronze Medal', 'Diploma', 'Certificate'))
);

-- 5. Sport Types
CREATE TABLE Sport_Types (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Attribute_ID INT NOT NULL,
    FOREIGN KEY (Attribute_ID) REFERENCES Sport_Attributes(ID) ON DELETE RESTRICT
);

-- 6. Competitions
CREATE TABLE Competitions (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Type_ID INT NOT NULL,
    FOREIGN KEY (Type_ID) REFERENCES Competition_Types(ID) ON DELETE RESTRICT
);

-- 7. Athletes/Teams
CREATE TABLE Athletes (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    Sport_Type_ID INT NOT NULL,
    Coach_ID INT NOT NULL,
    CHECK (Type IN ('Individual', 'Team')),
    FOREIGN KEY (Sport_Type_ID) REFERENCES Sport_Types(ID) ON DELETE RESTRICT,
    FOREIGN KEY (Coach_ID) REFERENCES Coaches(ID) ON DELETE RESTRICT
);

-- 8. Individual Athletes (details for individuals)
CREATE TABLE Individual_Athletes (
    Athlete_ID INT PRIMARY KEY,
    Gender CHAR(1) NOT NULL,
    Birth_Year INT NOT NULL,
    Nationality VARCHAR(100),
    CHECK (Gender IN ('M', 'F')),
    CHECK (Birth_Year BETWEEN 1900 AND 2020),
    FOREIGN KEY (Athlete_ID) REFERENCES Athletes(ID) ON DELETE CASCADE
);

-- 9. Team Members
CREATE TABLE Team_Members (
    ID SERIAL PRIMARY KEY,
    Team_ID INT NOT NULL,
    Member_Name VARCHAR(150) NOT NULL,
    FOREIGN KEY (Team_ID) REFERENCES Athletes(ID) ON DELETE CASCADE
);

-- 10. Competition Schedule
CREATE TABLE Schedules (
    ID SERIAL PRIMARY KEY,
    Competition_ID INT NOT NULL,
    Sport_Type_ID INT NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    CHECK (End_Date >= Start_Date),
    FOREIGN KEY (Competition_ID) REFERENCES Competitions(ID) ON DELETE CASCADE,
    FOREIGN KEY (Sport_Type_ID) REFERENCES Sport_Types(ID) ON DELETE RESTRICT
);

-- 11. Results
CREATE TABLE Results (
    ID SERIAL PRIMARY KEY,
    Competition_ID INT NOT NULL,
    Sport_Type_ID INT NOT NULL,
    Athlete_ID INT NOT NULL,
    Award_ID INT NOT NULL,
    Event_Date DATE NOT NULL,
    FOREIGN KEY (Competition_ID) REFERENCES Competitions(ID) ON DELETE CASCADE,
    FOREIGN KEY (Sport_Type_ID) REFERENCES Sport_Types(ID) ON DELETE RESTRICT,
    FOREIGN KEY (Athlete_ID) REFERENCES Athletes(ID) ON DELETE CASCADE,
    FOREIGN KEY (Award_ID) REFERENCES Awards(ID) ON DELETE RESTRICT
);

-- 12. Audit Table for Triggers
CREATE TABLE Audit_GoldMedals (
    AuditID SERIAL PRIMARY KEY,
    AthleteID INT,
    CompetitionID INT,
    EventDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Info VARCHAR(255)
);

-- ================================================================================
-- CREATE INDEXES
-- ================================================================================

CREATE INDEX idx_athletes_sport_type ON Athletes(Sport_Type_ID);
CREATE INDEX idx_athletes_coach ON Athletes(Coach_ID);
CREATE INDEX idx_results_competition ON Results(Competition_ID);
CREATE INDEX idx_results_sport_type ON Results(Sport_Type_ID);
CREATE INDEX idx_results_athlete ON Results(Athlete_ID);

-- ================================================================================
-- INSERT REFERENCE DATA
-- ================================================================================

-- Sport Attributes
INSERT INTO Sport_Attributes (Name) VALUES 
    ('Team'),
    ('Individual'),
    ('Pair');

-- Competition Types
INSERT INTO Competition_Types (Name) VALUES 
    ('Regional'),
    ('National Championship'),
    ('World Championship');

-- Awards
INSERT INTO Awards (Name) VALUES 
    ('Gold Medal'),
    ('Silver Medal'),
    ('Bronze Medal'),
    ('Diploma'),
    ('Certificate');

-- ================================================================================
-- INSERT TEST DATA
-- ================================================================================

-- Coaches
INSERT INTO Coaches (Full_Name) VALUES 
    ('Alexey Mishin'),
    ('Eteri Tutberidze'),
    ('Tatiana Tarasova'),
    ('Oleg Znarok'),
    ('Viktor Kudryashov'),
    ('Sergey Belov'),
    ('Anna Bogaliy-Titovets'),
    ('Igor Krutikov'),
    ('Yuri Borzakovsky'),
    ('Vladimir Kazantsev');

-- Sport Types
INSERT INTO Sport_Types (Name, Attribute_ID) VALUES 
    ('Figure Skating', 2),      -- Individual
    ('Synchronized Swimming', 3), -- Pair
    ('Basketball', 1),           -- Team
    ('Tennis', 2),               -- Individual
    ('Cross-Country Skiing', 2), -- Individual
    ('Ice Hockey', 1);           -- Team

-- Competitions
INSERT INTO Competitions (Name, Type_ID) VALUES 
    ('World Ice Hockey Championship', 3),
    ('Olympic Games', 3),
    ('Russian Figure Skating Championship', 2),
    ('Biathlon World Cup', 3);

-- Athletes (individuals)
INSERT INTO Athletes (Name, Type, Sport_Type_ID, Coach_ID) VALUES 
    ('Alina Zagitova', 'Individual', 1, 2),
    ('Daria Usacheva', 'Individual', 1, 2),
    ('Maya Khromykh', 'Individual', 1, 2),
    ('Kamila Valieva', 'Individual', 1, 2),
    ('Alexandra Boikova', 'Individual', 1, 1),
    ('Dmitry Kozlovsky', 'Individual', 1, 1);

-- Athletes (teams)
INSERT INTO Athletes (Name, Type, Sport_Type_ID, Coach_ID) VALUES 
    ('Russian Ice Hockey Team', 'Team', 6, 4),
    ('Kazakhstan Basketball Team', 'Team', 3, 6);

-- Individual Athletes data
INSERT INTO Individual_Athletes (Athlete_ID, Gender, Birth_Year, Nationality) VALUES 
    (1, 'F', 2002, 'Russia'),
    (2, 'F', 2004, 'Russia'),
    (3, 'F', 2004, 'Russia'),
    (4, 'F', 2006, 'Russia'),
    (5, 'F', 2002, 'Russia'),
    (6, 'M', 1999, 'Russia');

-- Team Members
INSERT INTO Team_Members (Team_ID, Member_Name) VALUES 
    (7, 'Alexander Ovechkin'),
    (7, 'Evgeny Malkin'),
    (7, 'Artemy Panarin'),
    (8, 'Nurzhan Moldabekov'),
    (8, 'Ruslan Aitmagambetov');

-- Competition Schedule
INSERT INTO Schedules (Competition_ID, Sport_Type_ID, Start_Date, End_Date) VALUES 
    (1, 6, '2025-05-09', '2025-05-25'),
    (2, 1, '2026-02-06', '2026-02-22'),
    (3, 1, '2024-12-20', '2024-12-27'),
    (4, 5, '2025-01-10', '2025-03-20');

-- Results
INSERT INTO Results (Competition_ID, Sport_Type_ID, Athlete_ID, Award_ID, Event_Date) VALUES 
    (1, 6, 7, 1, '2025-05-25'),  -- Russian Team - Gold
    (1, 6, 7, 1, '2025-05-24'),  -- Ovechkin - Gold
    (2, 1, 1, 1, '2026-02-20'),  -- Zagitova - Gold
    (2, 1, 2, 2, '2026-02-20'),  -- Usacheva - Silver
    (3, 1, 3, 1, '2024-12-26'),  -- Khromykh - Gold
    (3, 1, 4, 3, '2024-12-26');  -- Valieva - Bronze

-- ================================================================================
-- CREATE STORED PROCEDURES (FUNCTIONS in PostgreSQL)
-- ================================================================================

-- Function 1: Get awards by competition and sport type
CREATE OR REPLACE FUNCTION sp_GetAwardsByCompetitionAndSport(
    p_competition_id INT,
    p_sport_type_id INT
)
RETURNS TABLE (
    competition_name VARCHAR,
    sport_type VARCHAR,
    athlete_name VARCHAR,
    athlete_type VARCHAR,
    award_name VARCHAR,
    event_date DATE,
    coach_name VARCHAR
) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Competitions WHERE ID = p_competition_id) THEN
        RAISE EXCEPTION 'Competition with ID % not found!', p_competition_id;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM Sport_Types WHERE ID = p_sport_type_id) THEN
        RAISE EXCEPTION 'Sport type with ID % not found!', p_sport_type_id;
    END IF;
    
    RETURN QUERY
    SELECT 
        comp.Name,
        st.Name,
        ath.Name,
        ath.Type,
        aw.Name,
        res.Event_Date,
        c.Full_Name
    FROM Results res
        INNER JOIN Competitions comp ON res.Competition_ID = comp.ID
        INNER JOIN Sport_Types st ON res.Sport_Type_ID = st.ID
        INNER JOIN Athletes ath ON res.Athlete_ID = ath.ID
        INNER JOIN Awards aw ON res.Award_ID = aw.ID
        INNER JOIN Coaches c ON ath.Coach_ID = c.ID
    WHERE res.Competition_ID = p_competition_id 
      AND res.Sport_Type_ID = p_sport_type_id
    ORDER BY res.Event_Date, aw.ID;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Get female athletes aged 18-20
CREATE OR REPLACE FUNCTION sp_GetFemaleAthletes18to20(
    p_reference_year INT DEFAULT NULL
)
RETURNS TABLE (
    athlete_id INT,
    athlete_name VARCHAR,
    birth_year INT,
    age INT,
    nationality VARCHAR,
    sport_type VARCHAR,
    coach_name VARCHAR
) AS $$
BEGIN
    IF p_reference_year IS NULL THEN
        p_reference_year := EXTRACT(YEAR FROM CURRENT_DATE);
    END IF;
    
    RETURN QUERY
    SELECT 
        a.ID,
        a.Name,
        i.Birth_Year,
        (p_reference_year - i.Birth_Year),
        i.Nationality,
        st.Name,
        c.Full_Name
    FROM Athletes a
        INNER JOIN Individual_Athletes i ON a.ID = i.Athlete_ID
        INNER JOIN Sport_Types st ON a.Sport_Type_ID = st.ID
        INNER JOIN Coaches c ON a.Coach_ID = c.ID
    WHERE i.Gender = 'F' 
      AND (p_reference_year - i.Birth_Year) BETWEEN 18 AND 20
    ORDER BY i.Birth_Year, a.Name;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Insert three coaches
CREATE OR REPLACE FUNCTION sp_InsertThreeCoaches(
    p_name_prefix VARCHAR DEFAULT 'New Coach'
)
RETURNS TABLE (
    id INT,
    full_name VARCHAR
) AS $$
DECLARE
    v_counter INT := 1;
    v_coach_name VARCHAR;
    v_id INT;
    v_name VARCHAR;
BEGIN
    CREATE TEMP TABLE temp_coaches (id INT, full_name VARCHAR) ON COMMIT DROP;
    
    WHILE v_counter <= 3 LOOP
        v_coach_name := p_name_prefix || ' #' || v_counter;
        
        INSERT INTO Coaches (Full_Name)
        VALUES (v_coach_name)
        RETURNING ID, Full_Name INTO v_id, v_name;
        
        INSERT INTO temp_coaches VALUES (v_id, v_name);
        
        v_counter := v_counter + 1;
    END LOOP;
    
    RETURN QUERY SELECT * FROM temp_coaches;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate competition duration
CREATE OR REPLACE FUNCTION fn_GetCompetitionDurationDays(
    p_competition_id INT,
    p_sport_type_id INT DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
    v_duration INT;
BEGIN
    IF p_sport_type_id IS NOT NULL THEN
        SELECT (End_Date - Start_Date) INTO v_duration
        FROM Schedules
        WHERE Competition_ID = p_competition_id 
          AND Sport_Type_ID = p_sport_type_id;
    ELSE
        SELECT (End_Date - Start_Date) INTO v_duration
        FROM Schedules
        WHERE Competition_ID = p_competition_id
        ORDER BY Start_Date
        LIMIT 1;
    END IF;
    
    RETURN v_duration;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate age
CREATE OR REPLACE FUNCTION fn_CalculateAge(
    p_birth_year INT,
    p_reference_year INT DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
    v_age INT;
BEGIN
    IF p_reference_year IS NULL THEN
        p_reference_year := EXTRACT(YEAR FROM CURRENT_DATE);
    END IF;
    
    v_age := p_reference_year - p_birth_year;
    
    IF v_age < 0 OR v_age > 150 THEN
        RETURN NULL;
    END IF;
    
    RETURN v_age;
END;
$$ LANGUAGE plpgsql;

-- Function: Get athlete award count
CREATE OR REPLACE FUNCTION fn_GetAthleteAwardCount(
    p_athlete_id INT,
    p_award_id INT DEFAULT NULL
)
RETURNS INT AS $$
DECLARE
    v_count INT;
BEGIN
    IF p_award_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_count
        FROM Results
        WHERE Athlete_ID = p_athlete_id 
          AND Award_ID = p_award_id;
    ELSE
        SELECT COUNT(*) INTO v_count
        FROM Results
        WHERE Athlete_ID = p_athlete_id;
    END IF;
    
    RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql;

-- ================================================================================
-- CREATE TRIGGERS
-- ================================================================================

-- Trigger 1: Check result date
CREATE OR REPLACE FUNCTION trg_check_result_date()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM Schedules s
        WHERE s.Competition_ID = NEW.Competition_ID 
          AND s.Sport_Type_ID = NEW.Sport_Type_ID
          AND (NEW.Event_Date < s.Start_Date OR NEW.Event_Date > s.End_Date)
    ) THEN
        RAISE EXCEPTION 'Error! Result date is outside competition schedule.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TR_CheckResultDate
BEFORE INSERT OR UPDATE ON Results
FOR EACH ROW
EXECUTE FUNCTION trg_check_result_date();

-- Trigger 2: Prevent deleting coach with athletes
CREATE OR REPLACE FUNCTION trg_prevent_coach_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM Athletes a
        WHERE a.Coach_ID = OLD.ID
    ) THEN
        RAISE EXCEPTION 'Cannot delete coach! Coach has athletes. Reassign them first.';
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TR_PreventCoachDelete
BEFORE DELETE ON Coaches
FOR EACH ROW
EXECUTE FUNCTION trg_prevent_coach_delete();

-- Trigger 3: Audit gold medals
CREATE OR REPLACE FUNCTION trg_audit_gold_medals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.Award_ID = 1 THEN
        INSERT INTO Audit_GoldMedals (AthleteID, CompetitionID, Info)
        VALUES (
            NEW.Athlete_ID,
            NEW.Competition_ID,
            'Gold medal received! Date: ' || TO_CHAR(NEW.Event_Date, 'DD.MM.YYYY')
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TR_AuditGoldMedals
AFTER INSERT ON Results
FOR EACH ROW
EXECUTE FUNCTION trg_audit_gold_medals();

-- ================================================================================
-- COMPLETE
-- ================================================================================

SELECT 'Database successfully created!' AS status;