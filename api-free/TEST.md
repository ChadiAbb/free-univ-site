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
  -d '{"group":"L1","options":["math","informatique"]}' //FIXME: update according to your schema
```

5) Prepare for Calendar test — create subjects and attach to user

- Login and store the token (uses `jq` to parse JSON):
```bash
token=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"pseudo":"bob","password":"Pa$$w0rd"}' | jq -r '.token')
```

- Create `Subject` documents in MongoDB and copy the generated IDs:
```bash
mongosh --eval 'use api_free; const a=db.subjects.insertOne({name:"Optimisation",year:"L3",groups:"MathInfo1",choice:[]}); const b=db.subjects.insertOne({name:"Logique",year:"L3",groups:"MathInfo1",choice:[]}); print(a.insertedId.toString()+" "+b.insertedId.toString());'
```

- Update the user's preferences with the subject IDs (replace `<id1>` and `<id2>`):
```bash
curl -X PUT http://localhost:3000/api/user/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{"group":"L1","subjects":["<id1>","<id2>"]}'
```

6) Get Free rooms (no auth)
```bash
curl -X GET http://localhost:3000/api/free/room
```

7) Get My Calendar (auth)
```bash
curl -X GET http://localhost:3000/api/calendar/me \
  -H "Authorization: Bearer $token"
```