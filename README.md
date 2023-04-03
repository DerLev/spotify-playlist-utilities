# spotify-playlist-utilities

[![CI](https://github.com/DerLev/spotify-playlist-utilities/actions/workflows/integration.yml/badge.svg?branch=main&event=push)](https://github.com/DerLev/spotify-playlist-utilities/actions/workflows/integration.yml)

> **Note**  
> This project is currently under development

### Goal of the Project

The goal of this project is to create a webapp that can do some useful things 
with Spotify playlists. A features that are of interest for me are different 
sortings, a way to sync two or more playlists together and maybe a ripoff 
https://soundiiz.com/tutorial/spotify-to-youtube 😉

### Roadmap for the project

[![Open](https://derlev.github.io/svg-tags/derlev%20open.svg)](https://derlev.notion.site/f431507fdd2a41be87bb9a5119a4e653?v=73f6fe0992c549dfbd592e4d1b691dc6)

### Docker container

The Docker container for this project is available at 
`ghcr.io/derlev/spotify-playlist-utilities`

#### Usage

**Environment vars:**

| Variable | Description                              | Default |
|----------|------------------------------------------|---------|
| `PORT`   | Specifies the port the webserver runs on | 5000    |

#### Tags

| Tag              | Version of app                    |
|------------------|-----------------------------------|
| `latest`         | Latest stable release             |
| `main`           | Latest release from `main` branch |
| short commit sha | Release from specific commit      |
