SELECT 
    POSTS.id as id,
    USERS.name AS author,
    POSTS.message AS message,
    datetime(POSTS.date, 'unixepoch') as date 
FROM POSTS 
LEFT JOIN USERS on USERS.id = POSTS.user
