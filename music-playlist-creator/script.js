document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("#playlist-cards");
    const modal = document.getElementById("playlistModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalAuthor = document.getElementById("modalAuthor");
    const modalCover = document.getElementById("modalCover");
    const modalSongs = document.getElementById("modalSongs");
    const close = document.getElementsByClassName("close")[0];
    const shuffleButton = document.getElementById("shuffleButton");
    let currentPlaylist = null; 
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
                    <span class="heart"><i class="fa-solid fa-heart"></i></span><span class="like-count">${playlist.likes}</span>
                    <button class="edit-btn"><i class="fa-solid fa-pen" style="color: #ffffff;"></i></button>
                    <button class="delete-btn"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
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
            const editButtons = container.querySelectorAll(".edit-btn");
            const editBtn = editButtons[index];
            editBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openEditForm(playlist);
            });
        }
        

        function openEditForm(playlist) {
            editingPlaylistId = playlist.playlistID;
            formTitle.textContent = "Edit Playlist";
            playlistNameInput.value = playlist.playlist_name;
            playlistAuthorInput.value = playlist.playlist_author;
            playlistCoverInput.value = playlist.playlist_art || "assets/img/default_cover.jpg";

            songsContainer.querySelectorAll(".song-input-group").forEach(el => el.remove());

            playlist.songs.forEach(song => {
                songsContainer.appendChild(createSongInput(song));
            });

            playlistFormModal.style.display = "block";
        }

        const deleteButtons = container.querySelectorAll(".delete-btn");
        deleteButtons.forEach((btn, index) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation(); 
                const idToDelete = playlists[index].playlistID;
                playlists = playlists.filter(p => p.playlistID !== idToDelete);
                renderPlaylists(playlists);
            });
});
    }

    function sortPlaylists(criteria) {
        let sortedPlaylists;

        if (criteria === 'name') {
            // by name alphabetically
            sortedPlaylists = [...playlists].sort((a, b) =>
                a.playlist_name.localeCompare(b.playlist_name)
            );
        } else if (criteria === 'likes') {
            // by number of likes (descending)
            sortedPlaylists = [...playlists].sort((a, b) => b.likes - a.likes);
        } else if (criteria === 'date') {
            // by date added (most recent)
            sortedPlaylists = [...playlists].sort((a, b) =>
                new Date(b.dateAdded) - new Date(a.dateAdded)
            );
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

    const addPlaylistBtn = document.getElementById("addPlaylistBtn");
    const playlistFormModal = document.getElementById("playlistFormModal");
    const closeFormBtn = playlistFormModal.querySelector(".close-form");
    const playlistForm = document.getElementById("playlistForm");
    const formTitle = document.getElementById("formTitle");
    const playlistNameInput = document.getElementById("playlistName");
    const playlistAuthorInput = document.getElementById("playlistAuthor");
    const playlistCoverInput = document.getElementById("playlistCover");
    const songsContainer = document.getElementById("songsContainer");
    const addSongBtn = document.getElementById("addSongBtn");

    let editingPlaylistId = null;

    function createSongInput(song = {}) {
        const div = document.createElement("div");
        div.classList.add("song-input-group");
        div.innerHTML = `
        <input type="text" placeholder="Song Title" class="song-title" value="${song.title || ''}" required />
        <input type="text" placeholder="Artist" class="song-artist" value="${song.artist || ''}" required />
        <input type="text" placeholder="Album" class="song-album" value="${song.album || ''}" />
        <input type="text" placeholder="Duration" class="song-duration" value="${song.duration || ''}" />
        `;
        return div;
    }

    function resetForm() {
        playlistNameInput.value = "";
        playlistAuthorInput.value = "";
        playlistCoverInput.value = "";
        songsContainer.querySelectorAll(".song-input-group").forEach(el => el.remove());
        songsContainer.appendChild(createSongInput());
        editingPlaylistId = null;
    }

    addPlaylistBtn.addEventListener("click", () => {
        resetForm();
        formTitle.textContent = "Add New Playlist";
        playlistFormModal.style.display = "block";
    });

    closeFormBtn.addEventListener("click", () => {
        playlistFormModal.style.display = "none";
    });

    addSongBtn.addEventListener("click", () => {
        songsContainer.appendChild(createSongInput());
    });

    playlistForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const songDivs = songsContainer.querySelectorAll(".song-input-group");
        const songs = [];
        for (const div of songDivs) {
        const title = div.querySelector(".song-title").value.trim();
        const artist = div.querySelector(".song-artist").value.trim();
        const album = div.querySelector(".song-album").value.trim();
        const duration = div.querySelector(".song-duration").value.trim();
        if (title && artist) {
            songs.push({
            cover: "assets/img/default_cover.jpg", 
            title,
            artist,
            album,
            duration,
            });
        }
        }

        const playlistData = {
        playlist_name: playlistNameInput.value.trim(),
        playlist_author: playlistAuthorInput.value.trim(),
        playlist_art: playlistCoverInput.value.trim(),
        songs,
        likes: 0,
        date_added: new Date().toISOString(),
        featured: false,
        playlistID: editingPlaylistId || (playlists.length ? Math.max(...playlists.map(p => p.playlistID)) + 1 : 1),
        };

        if (editingPlaylistId) {
        const index = playlists.findIndex(p => p.playlistID === editingPlaylistId);
        if (index !== -1) {
            playlists[index] = { ...playlists[index], ...playlistData };
        }
        } else {
        playlists.push(playlistData);
        }

        renderPlaylists(playlists);
        playlistFormModal.style.display = "none";
    })
})
  