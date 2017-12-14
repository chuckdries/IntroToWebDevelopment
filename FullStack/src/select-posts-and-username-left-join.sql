SELECT 
    POSTS.id as id,
    USERS.name AS author,
    POSTS.message AS message 
FROM POSTS 
LEFT JOIN USERS on USERS.id = POSTS.user
