document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("#playlist-cards");
    const modal = document.getElementById("playlistModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalAuthor = document.getElementById("modalAuthor");
    const modalCover = document.getElementById("modalCover");
    const modalSongs = document.getElementById("modalSongs");
    const close = document.getElementsByClassName("close")[0];
    const shuffleButton = document.getElementById("shuffleButton");
    let currentPlaylist = null; // store reference to open playlist
    const searchBar = document.getElementById("search-bar");
    const searchIcon = document.getElementById("search-icon");
    const clearIcon = document.getElementById("clear-icon");
    const sortDropdown = document.getElementById("sort-dropdown");

    function renderPlaylists(playlists) {
        if (playlists.length === 0) {
            container.innerHTML = "<p>No playlist added</p>";
            return;
        }; 

        container.innerHTML = playlists.map(playlist => `
            <div class="playlist-card">
                <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}">
                <h3>${playlist.playlist_name}</h3>
                <p>${playlist.playlist_author}</p>
                <div class="likes">
                    <span class="heart">&#10084;</span><span class="like-count">${playlist.likes}</span>
                </div>
            </div>
        `).join('');
        
        const hearts = container.querySelectorAll(".heart");
        const counts = container.querySelectorAll(".like-count");
        const cards = container.querySelectorAll(".playlist-card");

        for (let index = 0; index < playlists.length; index++) {
            const playlist = playlists[index];
            const heart = hearts[index];
            const count = counts[index];
            const card = cards[index];
            let liked = false;

            heart.addEventListener("click", (e) => {
                liked = !liked;
                heart.classList.toggle("liked");
                count.textContent = liked ? ++playlist.likes : --playlist.likes;
                heart.clicked = true;
            });

            card.addEventListener("click", (e) => {
                if (heart.clicked) {
                    heart.clicked = false; 
                    return; 
                }
                openModal(playlist);
            });
        }
    }

    function sortPlaylists(criteria) {
        let sortedPlaylists;
        
        if (criteria === 'name') {
            // by name alphabetically
            sortedPlaylists = [...playlists].sort((a, b) => a.playlist_name.localeCompare(b.playlist_name));
        } else if (criteria === 'likes') {
            // by number of likes (ascending)
            sortedPlaylists = [...playlists].sort((a, b) => a.likes - b.likes || a.playlist_name.localeCompare(b.playlist_name));
        } else if (criteria === 'date') {
            // by date added (most recent)
            sortedPlaylists = [...playlists].sort((a, b) => new Date(b.date_added) - new Date(a.date_added) || a.playlist_name.localeCompare(b.playlist_name));
        }
        
        renderPlaylists(sortedPlaylists);
    }

    sortDropdown.addEventListener("change", (e) => {
        const selectedSort = e.target.value;
        if (selectedSort) {
            sortPlaylists(selectedSort);
        }
    });

    function filterPlaylists(query) {
        const lowerCase = query.toLowerCase();
        const filteredPlaylists = playlists.filter(playlist => {
            return playlist.playlist_name.toLowerCase().includes(lowerCase) ||
                   playlist.playlist_author.toLowerCase().includes(lowerCase);
        });
        renderPlaylists(filteredPlaylists);
    }

    searchIcon.addEventListener("click", () => {
        filterPlaylists(searchBar.value);
    });

    clearIcon.addEventListener("click", () => {
        searchBar.value = "";
        clearIcon.style.display = "none"; 
        renderPlaylists(playlists); 
    });

    searchBar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            filterPlaylists(searchBar.value);
        }
    });

    searchBar.addEventListener("input", () => {
        if (searchBar.value.length > 0) {
            clearIcon.style.display = "block"; 
        } else {
            clearIcon.style.display = "none"; 
        }
    });

    renderPlaylists(playlists);

    function openModal(playlist) {
        current = playlist;
        modalTitle.textContent = playlist.playlist_name;
        modalAuthor.textContent = playlist.playlist_author;
        modalCover.src = playlist.playlist_art;
        renderSongs(playlist.songs);
        modal.style.display = "block";
    }

    function renderSongs(songs) {
        modalSongs.innerHTML = songs.map(song => `
            <div class="song-row">
                <img class="song-img" src="${song.cover}">
                <div class="song-main">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-album">${song.album}</div>
                <div class="song-duration">${song.duration}</div>
            </div>
        `).join("");
    }

    shuffleButton.addEventListener("click", () => {
        if (!current) return;
        for (let i = current.songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [current.songs[i], current.songs[j]] = [current.songs[j], current.songs[i]];
        }
        renderSongs(current.songs);
    });

    close.onclick = function () {
        modal.style.display = "none";
    } 

    window.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };
})
