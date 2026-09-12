INSERT INTO ROLES
    (NAME, PERMISSIONS)
VALUES
    (
        "Administrador",
        JSON_OBJECT(
            'beneficiary', JSON_ARRAY('create', 'edit', 'delete', 'view', 'list'),
            'family', JSON_ARRAY('create', 'edit', 'delete', 'view', 'list'),
            'measuring_unit', JSON_ARRAY('create', 'edit', 'delete', 'view', 'list'),
            'allocation_type', JSON_ARRAY('create', 'edit', 'delete', 'view', 'list'),
            'city', JSON_ARRAY('create', 'edit', 'delete', 'list'),
            'donor', JSON_ARRAY('create', 'edit', 'delete', 'view', 'list'),
            'product', JSON_ARRAY('create', 'edit', 'delete', 'view', 'list'),
            'sala', JSON_ARRAY('create', 'edit', 'delete', 'view', 'list'),
            'volunteer', JSON_ARRAY('create', 'edit', 'delete', 'view', 'list')
        )
    ),
    (
        "Voluntário",
        JSON_OBJECT(
            'beneficiary', JSON_ARRAY('create', 'edit', 'view', 'list'),
            'family', JSON_ARRAY('create', 'edit', 'view', 'list'),
            'measuring_unit', JSON_ARRAY('create', 'edit', 'view', 'list'),
            'allocation_type', JSON_ARRAY('create', 'edit', 'view', 'list'),
            'city', JSON_ARRAY('create', 'list'),
            'donor', JSON_ARRAY('create', 'edit', 'view', 'list'),
            'product', JSON_ARRAY('create', 'edit', 'view', 'list'),
            'sala', JSON_ARRAY('create', 'edit', 'view', 'list'),
            'volunteer', JSON_ARRAY('create', 'edit', 'view', 'list')
        )
    ),
    (
        "Congregante",
        JSON_OBJECT(
            'beneficiary', JSON_ARRAY('view', 'list'),
            'family', JSON_ARRAY('view', 'list'),
            'measuring_unit', JSON_ARRAY('view', 'list'),
            'allocation_type', JSON_ARRAY('view', 'list'),
            'city', JSON_ARRAY('list'),
            'donor', JSON_ARRAY('view', 'list'),
            'product', JSON_ARRAY('view', 'list'),
            'sala', JSON_ARRAY('view', 'list'),
            'volunteer', JSON_ARRAY('view', 'list')
        )
    )
;

UPDATE roles
SET permissions = JSON_SET(
	permissions,
	'$.user', JSON_ARRAY('create', 'edit', 'view', 'list', 'delete', 'reset'),
	'$.role', JSON_ARRAY('create', 'edit', 'view', 'list'),
	'$.bill', JSON_ARRAY('create', 'edit', 'view', 'list', 'pay')
)
WHERE id = 5;

UPDATE roles
SET permissions = JSON_SET(
	permissions,
	'$.dashboard', JSON_ARRAY('view')
);

UPDATE roles
SET permissions = JSON_SET(
	permissions,
	'$.user',
	JSON_ARRAY_APPEND(permissions->'$.user', '$', 'restore')
)
WHERE id = 5;
