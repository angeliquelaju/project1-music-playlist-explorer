document.addEventListener("DOMContentLoaded", () => {
    console.log("Featured Page Loaded");

    const featuredArt = document.getElementById("featured-art");
    const featuredTitle = document.getElementById("featured-title");
    const featuredAuthor = document.getElementById("featured-author");
    const featuredSongs = document.getElementById("featured-songs");

    function getRandomPlaylist() {
        const index = Math.floor(Math.random() * playlists.length);
        return playlists[index];
    }

    function renderFeatured(playlist) {
        featuredArt.src = playlist.playlist_art;
        featuredTitle.textContent = playlist.playlist_name;
        featuredAuthor.textContent = playlist.playlist_author;

        featuredSongs.innerHTML = playlist.songs.map(song => `
            <li class="featured-song-row">
                <img src="${song.cover}">
                <div class="featured-song-info">
                    <div class="title">${song.title}</div>
                    <div class="artist">${song.artist}</div>
                </div>
                <div class="featured-album">${song.album}</div>
                <div class="featured-duration">${song.duration}</div>
            </li>
        `).join("");
        }

        const randomPlaylist = getRandomPlaylist();
        renderFeatured(randomPlaylist);
    })