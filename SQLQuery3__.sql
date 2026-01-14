        BEGIN
            RAISERROR('No se pudo actualizr correctamente', 16, 1);
            RETURN;
        END


    BEGIN
        RAISERROR('El periodo ya existe', 16, 1);
        RETURN;
    END