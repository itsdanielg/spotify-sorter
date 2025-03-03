<div align="center">
  <a href="https://vitejs.dev/">
    <img src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" alt="Logo" width="80" height="80">
  </a>
  <a href="https://spotify-sorter-tau.vercel.app/">
    <h1 align="center">Spotify Sorter</h1>
  </a>
  <p align="center">
    A web app for organizing Spotify playlists with advanced sorting options.
  </p>
  
</div>

[![React][React]][React-url] [![TypeScript][TypeScript]][TypeScript-url] [![Tailwind][Tailwind]][Tailwind-url] [![Vite][Vite]][Vite-url] [![ESLint][ESLint]][ESLint-url]

<p align="center">
  <a href="https://github.com/itsdanielg/spotify-sorter/issues/new?labels=bug&template=bug_report.md">Report Bug</a>
  ·  
  <a href="https://github.com/itsdanielg/spotify-sorter/issues/new?labels=enhancement&template=feature_request.md">Request Feature</a>
</p>

Spotify Sorter is a web application designed to organize Spotify playlists with more flexible options beyond the ones provided by the Spotify application.

## About The Project

In its current version, Spotify lets users sort their playlist tracks by limited attributes, such as:

- `Title`
- `Artist`
- `Album`
- `Date Added`
- `Duration`

This app expands sorting options by including additional attributes found within each playlist track's metadata, in addition to the options already present in Spotify.

**Additional Sorting Options:**

- `Album Track Number`
- `Release Date`

## Local Installation

This application relies on the Spotify Web API to fetch data. However, due to API rate limits, multiple users accessing the same credentials may quickly exceed the limit.

To avoid this, you can clone this project locally and create your own Spotify Developer App to use your own credentials:

### Steps:

1. Clone this respository and rename .env file to be used

```bash
git clone https://github.com/itsdanielg/spotify-sorter.git
cd spotify-sorter
mv .env_example .env
```

2. Navigate to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
3. Click **Create app**, then fill out all required fields
4. In the **Redirect URIs** section, enter the same URI found in your `.env` file
5. Ensure **Web API** is checked
6. Click **Save** to finalize the app
7. After creation, navigate to **Settings** in the dashboard.
8. Copy your **Client ID** and paste it into the `.env` file:

```bash
VITE_CLIENT_ID=your_client_id
```

8. Copy your **Client Secret** and paste it into the `.env` file:

```bash
VITE_CLIENT_SECRET=your_client_secret
```

9. Save the `.env` file

[ESLint]: https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white
[ESLint-url]: https://eslint.org/
[React]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Tailwind]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
