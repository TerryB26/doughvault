
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    UserUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    ClerkUserID VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedBy INT REFERENCES Users(UserID),
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedBy INT REFERENCES Users(UserID),
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Roles (
    RoleID SERIAL PRIMARY KEY,
    RoleUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    RoleName VARCHAR(100) UNIQUE NOT NULL,
    RoleDescription TEXT,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedBy INT REFERENCES Users(UserID),
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedBy INT REFERENCES Users(UserID),
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE UserRoles (
    UserRoleID SERIAL PRIMARY KEY,
    UserRoleUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    UserID INT REFERENCES Users(UserID) ON DELETE CASCADE,
    RoleID INT REFERENCES Roles(RoleID) ON DELETE CASCADE,
    AssignedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    AssignedBy INT REFERENCES Users(UserID),
    IsActive BOOLEAN DEFAULT TRUE,
    UNIQUE(UserID, RoleID)
);


CREATE TABLE Categories (
    CategoryID SERIAL PRIMARY KEY,
    CategoryUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    CategoryName VARCHAR(100) UNIQUE NOT NULL,
    CategoryDescription TEXT,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedBy INT REFERENCES Users(UserID),
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedBy INT REFERENCES Users(UserID),
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Items (
    ItemID SERIAL PRIMARY KEY,
    ItemUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    ItemName VARCHAR(255) NOT NULL,
    ItemDescription TEXT,
    CategoryID INT REFERENCES Categories(CategoryID),
    SKU VARCHAR(100) UNIQUE,
    Unit VARCHAR(50) NOT NULL,
    Quantity DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    ReorderThreshold DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    CostPrice DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    SupplierInfo TEXT,
    StorageLocation VARCHAR(255),
    ExpiryDate DATE,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedBy INT REFERENCES Users(UserID),
    CreatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedBy INT REFERENCES Users(UserID),
    UpdatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE UsersLogs (
    LogID SERIAL PRIMARY KEY,
    LogUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    UserID INT,
    UserUUID UUID,
    Action VARCHAR(20) NOT NULL,
    OldValues JSONB,
    NewValues JSONB,
    ChangedBy INT REFERENCES Users(UserID),
    ChangedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IPAddress INET,
    UserAgent TEXT
);


CREATE TABLE RolesLogs (
    LogID SERIAL PRIMARY KEY,
    LogUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    RoleID INT,
    RoleUUID UUID,
    Action VARCHAR(20) NOT NULL,
    OldValues JSONB,
    NewValues JSONB,
    ChangedBy INT REFERENCES Users(UserID),
    ChangedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IPAddress INET,
    UserAgent TEXT
);


CREATE TABLE UserRolesLogs (
    LogID SERIAL PRIMARY KEY,
    LogUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    UserRoleID INT,
    UserRoleUUID UUID,
    Action VARCHAR(20) NOT NULL,
    OldValues JSONB,
    NewValues JSONB,
    ChangedBy INT REFERENCES Users(UserID),
    ChangedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IPAddress INET,
    UserAgent TEXT
);


CREATE TABLE CategoriesLogs (
    LogID SERIAL PRIMARY KEY,
    LogUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    CategoryID INT,
    CategoryUUID UUID,
    Action VARCHAR(20) NOT NULL,
    OldValues JSONB,
    NewValues JSONB,
    ChangedBy INT REFERENCES Users(UserID),
    ChangedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IPAddress INET,
    UserAgent TEXT
);


CREATE TABLE ItemsLogs (
    LogID SERIAL PRIMARY KEY,
    LogUUID UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    ItemID INT,
    ItemUUID UUID,
    Action VARCHAR(20) NOT NULL,
    OldValues JSONB,
    NewValues JSONB,
    QuantityChanged DECIMAL(10,2),
    ReasonCode VARCHAR(100),
    Notes TEXT,
    ChangedBy INT REFERENCES Users(UserID),
    ChangedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IPAddress INET,
    UserAgent TEXT
);


CREATE INDEX idx_users_clerk_user_id ON Users(ClerkUserID);
CREATE INDEX idx_users_email ON Users(Email);
CREATE INDEX idx_users_uuid ON Users(UserUUID);
CREATE INDEX idx_users_active ON Users(IsActive);


CREATE INDEX idx_items_uuid ON Items(ItemUUID);
CREATE INDEX idx_items_sku ON Items(SKU);
CREATE INDEX idx_items_category ON Items(CategoryID);
CREATE INDEX idx_items_active ON Items(IsActive);
CREATE INDEX idx_items_quantity ON Items(Quantity);
CREATE INDEX idx_items_reorder ON Items(ReorderThreshold);


CREATE INDEX idx_items_logs_item_id ON ItemsLogs(ItemID);
CREATE INDEX idx_items_logs_item_uuid ON ItemsLogs(ItemUUID);
CREATE INDEX idx_items_logs_action ON ItemsLogs(Action);
CREATE INDEX idx_items_logs_changed_on ON ItemsLogs(ChangedOn);
CREATE INDEX idx_items_logs_changed_by ON ItemsLogs(ChangedBy);


CREATE INDEX idx_user_roles_user_id ON UserRoles(UserID);
CREATE INDEX idx_user_roles_role_id ON UserRoles(RoleID);
CREATE INDEX idx_user_roles_active ON UserRoles(IsActive);


CREATE OR REPLACE FUNCTION audit_trigger_function() 
RETURNS TRIGGER AS $$
DECLARE
    table_name TEXT;
    log_table TEXT;
    old_values JSONB;
    new_values JSONB;
    primary_key_name TEXT;
    primary_key_value INT;
    uuid_key_name TEXT;
    uuid_key_value UUID;
BEGIN

    table_name := TG_TABLE_NAME;
    log_table := table_name || 'Logs';

    -- Convert table name to proper case for column names
    CASE table_name
        WHEN 'users' THEN 
            primary_key_name := 'UserID';
            uuid_key_name := 'UserUUID';
        WHEN 'roles' THEN 
            primary_key_name := 'RoleID';
            uuid_key_name := 'RoleUUID';
        WHEN 'userroles' THEN 
            primary_key_name := 'UserRoleID';
            uuid_key_name := 'UserRoleUUID';
        WHEN 'categories' THEN 
            primary_key_name := 'CategoryID';
            uuid_key_name := 'CategoryUUID';
        WHEN 'items' THEN 
            primary_key_name := 'ItemID';
            uuid_key_name := 'ItemUUID';
        ELSE
            primary_key_name := table_name || 'ID';
            uuid_key_name := table_name || 'UUID';
    END CASE;

    CASE TG_OP
        WHEN 'INSERT' THEN
            new_values := row_to_json(NEW)::jsonb;
            old_values := NULL;
            
            -- Extract primary key and UUID from NEW (for AFTER triggers, these should be available)
            BEGIN
                EXECUTE format('SELECT ($1).%I', primary_key_name) USING NEW INTO primary_key_value;
                EXECUTE format('SELECT ($1).%I', uuid_key_name) USING NEW INTO uuid_key_value;
            EXCEPTION WHEN OTHERS THEN
                -- If we can't get the values, log the error and continue
                RAISE NOTICE 'Could not extract % or % from %: %', primary_key_name, uuid_key_name, table_name, SQLERRM;
                primary_key_value := NULL;
                uuid_key_value := NULL;
            END;
            
        WHEN 'UPDATE' THEN
            old_values := row_to_json(OLD)::jsonb;
            new_values := row_to_json(NEW)::jsonb;
            
            -- Extract primary key and UUID from NEW (or OLD for consistency)
            EXECUTE format('SELECT ($1).%I', primary_key_name) USING NEW INTO primary_key_value;
            EXECUTE format('SELECT ($1).%I', uuid_key_name) USING NEW INTO uuid_key_value;
            
        WHEN 'DELETE' THEN
            old_values := row_to_json(OLD)::jsonb;
            new_values := NULL;
            
            -- Extract primary key and UUID from OLD
            EXECUTE format('SELECT ($1).%I', primary_key_name) USING OLD INTO primary_key_value;
            EXECUTE format('SELECT ($1).%I', uuid_key_name) USING OLD INTO uuid_key_value;
    END CASE;
    
    -- Insert into appropriate log table
    EXECUTE format(
        'INSERT INTO %I (%I, %I, Action, OldValues, NewValues, ChangedBy, ChangedOn) 
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)',
        log_table, 
        REPLACE(primary_key_name, 'ID', 'ID'),
        REPLACE(uuid_key_name, 'UUID', 'UUID')
    ) USING primary_key_value, uuid_key_value, TG_OP, old_values, new_values, 
            COALESCE(
                CASE TG_OP 
                    WHEN 'DELETE' THEN (old_values->>'UpdatedBy')::INT
                    ELSE (new_values->>'UpdatedBy')::INT
                END, 
                1
            );
    
    -- Return appropriate record
    CASE TG_OP
        WHEN 'DELETE' THEN RETURN OLD;
        ELSE RETURN NEW;
    END CASE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION items_audit_trigger_function() 
RETURNS TRIGGER AS $$
DECLARE
    old_values JSONB;
    new_values JSONB;
    quantity_changed DECIMAL(10,2);
    reason_code VARCHAR(100);
BEGIN
    CASE TG_OP
        WHEN 'INSERT' THEN
            new_values := row_to_json(NEW)::jsonb;
            old_values := NULL;
            quantity_changed := NEW.Quantity;
            reason_code := 'INITIAL_STOCK';
            
        WHEN 'UPDATE' THEN
            old_values := row_to_json(OLD)::jsonb;
            new_values := row_to_json(NEW)::jsonb;
            quantity_changed := NEW.Quantity - OLD.Quantity;
            

            IF quantity_changed > 0 THEN
                reason_code := 'RESTOCK';
            ELSIF quantity_changed < 0 THEN
                reason_code := 'CONSUMPTION';
            ELSE
                reason_code := 'INFO_UPDATE';
            END IF;
            
        WHEN 'DELETE' THEN
            old_values := row_to_json(OLD)::jsonb;
            new_values := NULL;
            quantity_changed := -OLD.Quantity;
            reason_code := 'ITEM_DELETED';
    END CASE;

    INSERT INTO ItemsLogs (
        ItemID, ItemUUID, Action, OldValues, NewValues, 
        QuantityChanged, ReasonCode, ChangedBy, ChangedOn
    ) VALUES (
        COALESCE(NEW.ItemID, OLD.ItemID),
        COALESCE(NEW.ItemUUID, OLD.ItemUUID),
        TG_OP,
        old_values,
        new_values,
        quantity_changed,
        reason_code,
        COALESCE(
            CASE TG_OP 
                WHEN 'DELETE' THEN OLD.UpdatedBy
                ELSE NEW.UpdatedBy
            END, 
            1
        ),
        CURRENT_TIMESTAMP
    );
    
    CASE TG_OP
        WHEN 'DELETE' THEN RETURN OLD;
        ELSE RETURN NEW;
    END CASE;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON Users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();


CREATE TRIGGER roles_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON Roles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();


CREATE TRIGGER user_roles_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON UserRoles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();


CREATE TRIGGER categories_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON Categories
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();


CREATE TRIGGER items_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON Items
    FOR EACH ROW EXECUTE FUNCTION items_audit_trigger_function();


CREATE OR REPLACE FUNCTION update_updated_on_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.UpdatedOn = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_users_updated_on 
    BEFORE UPDATE ON Users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_on_column();

CREATE TRIGGER update_roles_updated_on 
    BEFORE UPDATE ON Roles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_on_column();

CREATE TRIGGER update_categories_updated_on 
    BEFORE UPDATE ON Categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_on_column();

CREATE TRIGGER update_items_updated_on 
    BEFORE UPDATE ON Items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_on_column();
