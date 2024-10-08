# Frontend

## RUN

### STEP 1

Install dependencies.

```
npm i
```

Open [sample.env](sample.env), rename to .env and add the variables.

### STEP 2 (Development)

Run project in development mode.

```
npx expo run:android

# or

npx expo run:ios
```

> [!IMPORTANT]
> This requires a physical device.

> [!IMPORTANT]
> `npx expo run:ios` requires a MacOS to compile IOS code.

### STEP 2 ("Production")

Creates a build that will be similar to the real app experience.

```
npx expo run:android --variant release
```

### Production cleaning old cache (Android)

This solves the issue of running `npx expo run:android --variant release` and not building the most recent code in the project.

```
cd android
./gradlew clean
npx expo prebuild --clean
```

after this run `npx expo run:android --variant release` again.

### STEP 2 ("Production EXPO APP")

> [!NOTE]
> This does not have more use for this project.

```
npx expo start --no-dev --minify
```

## Upgrade

Upgrade expo version.

```
npm install expo@latest
npx expo install --fix
```

## Linter

Run eslint on project.

```
npx eslint .
```

## Check project health

```
npx expo-doctor
```

## Production

```
eas build:version:set
eas build:version:sync
eas build --platform android
```