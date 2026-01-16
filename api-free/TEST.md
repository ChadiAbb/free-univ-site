# API free-univ-site — Mode d'emploi rapide

Tests (curl)
1) Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"pseudo":"bob","password":"Pa$$w0rd"}'
```

2) Login (récupère le token dans la réponse)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"pseudo":"bob","password":"Pa$$w0rd"}'
```

3) Get Preferences (auth)
```bash
curl -X GET http://localhost:3000/api/user/preferences \
  -H "Authorization: Bearer <token>"
```

4) Update Preferences (auth)
```bash
curl -X PUT http://localhost:3000/api/user/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"group":"L1","options":["math","informatique"]}'
```