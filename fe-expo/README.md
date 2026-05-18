# Finding Neko Expo

Expo Go version of the Finding Neko mobile UI.

## Run on iPhone with Expo Go

```powershell
npm run start
```

Scan the QR code from the Expo Go app on iPhone.

## Backend URL

The default API URL is set to this computer's current LAN IP in `src/services/apiClient.ts`:

```ts
export const API_BASE_URL = 'http://192.168.2.15:5000/api';
```

Expo Go cannot reach your computer's `localhost` from a real phone. If your Wi-Fi IP changes, update the URL.
