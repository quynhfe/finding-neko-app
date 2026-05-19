# Finding Neko Expo

Expo Go version of the Finding Neko mobile UI.

## Run on iPhone with Expo Go

```powershell
npm run start
```

Scan the QR code from the Expo Go app on iPhone.

## Backend URL

The app reads the backend URL from `fe-expo/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

After changing `.env`, restart Expo with cache clear:

```bash
npm run start
```

`npm run start` already runs `expo start -c`.

Expo Go on a real phone cannot reach your computer's `localhost`. Use your computer's LAN IP in `.env` for phone testing, for example `http://192.168.2.8:5001/api`.
