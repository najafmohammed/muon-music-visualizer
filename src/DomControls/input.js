import { mock } from "../_mock";
import play from "../../static/images/play.png";

const createTags = (r, g, b, name) => {
  const tag = document.createElement("div");
  tag.setAttribute("class", "search-result-tag");
  tag.style.backgroundColor = `rgb(${r}, ${g}, ${b},.2)`;
  tag.innerHTML = name;
  return tag;
};
const searchResultElement = (
  name,
  artists,
  genre,
  url,
  imageUrl,
  songUrl,
  tags,
  index,
  params
) => {
  const color = tags[0].color;
  const backgroundColor = (color) => `rgb(${color.r}, ${color.g}, ${color.b})`;
  const searchResult = document.createElement("div");
  searchResult.setAttribute("class", "search-result");
  searchResult.style.animationDelay = `${(0.05 * index).toFixed(2)}s`;
  searchResult.style.backgroundImage = `linear-gradient(to right,#000,${backgroundColor(
    color
  )})`;
  const searchResultImage = document.createElement("img");
  searchResultImage.setAttribute("class", "search-result-image");
  searchResultImage.setAttribute("alt", "song image");
  searchResultImage.src = imageUrl;
  searchResult.appendChild(searchResultImage);
  const searchResultInfoContainer = document.createElement("div");
  searchResultInfoContainer.setAttribute(
    "class",
    "search-result-info-container"
  );
  const searchResultName = document.createElement("div");
  searchResultName.setAttribute("class", "search-result-name");
  searchResultName.appendChild(document.createTextNode(name));
  searchResultInfoContainer.appendChild(searchResultName);

  const searchResultArtist = document.createElement("div");
  searchResultArtist.setAttribute("class", "search-result-artist");
  searchResultArtist.appendChild(
    document.createTextNode(artists.map((artist) => artist.name).join(" , "))
  );
  searchResultInfoContainer.appendChild(searchResultArtist);

  const searchResultTagsContainer = document.createElement("div");
  searchResultTagsContainer.setAttribute(
    "class",
    "search-result-tags-container"
  );
  const documentFragment = document.createDocumentFragment();
  tags.forEach((tag) =>
    documentFragment.appendChild(
      createTags(tag.color.r, tag.color.g, tag.color.b, tag.name)
    )
  );
  searchResultTagsContainer.appendChild(documentFragment);
  searchResultInfoContainer.appendChild(searchResultTagsContainer);

  searchResult.appendChild(searchResultInfoContainer);

  const searchResultPlayContainer = document.createElement("div");
  const searchResultPlayLoader = document.createElement("div");
  searchResultPlayLoader.setAttribute("data-song-url", songUrl);
  searchResultPlayLoader.setAttribute("class", "search-result-play-loader");
  const searchResultIcon = document.createElement("img");
  searchResultIcon.setAttribute("data-song-url", songUrl);
  searchResultIcon.setAttribute("loading", "lazy");
  searchResultIcon.src = play;
  searchResultPlayLoader.appendChild(searchResultIcon);
  searchResultPlayContainer.appendChild(searchResultPlayLoader);

  searchResultPlayContainer.setAttribute(
    "class",
    "search-result-play-container"
  );

  searchResultPlayLoader.addEventListener("click", (e) => {
    e.preventDefault();
    const audio = document.getElementById(`search-result-preview${index}`);
    if (audio.paused || !audio.currentTime) {
      params.currentPlaying && params.currentPlaying.pause();
      searchResultPreview.style.visibility = "visible";
      searchResultPlayLoader.style.display = "none";
      params.currentPlaying = audio;
      const url = e.target.dataset.songUrl;
      audio.src = url;
      audio.play();
    }
  });

  const searchResultPreview = document.createElement("audio");
  searchResultPreview.setAttribute("id", `search-result-preview${index}`);
  searchResultPreview.controls = "controls";
  searchResultPreview.style.visibility = "hidden";

  searchResultPlayContainer.appendChild(searchResultPreview);
  searchResult.appendChild(searchResultPlayContainer);

  return searchResult;
};

export const initSearch = () => {
  let params = {
    currentPlaying: null,
  };
  const searchLoader = document.getElementById("search-loader");
  const searchResultContainer = document.getElementById(
    "search-results-container"
  );

  document.getElementById("searchButton").addEventListener("click", () => {
    searchResultContainer.innerHTML = "";
    searchLoader.style.display = "flex";
    const searchInput = document.getElementById("search").value;
    /* Run mock */
    searchLoader.style.display = "none";
    if (mock.songs.length === 0) {
      searchResultContainer.innerHTML += `<div class="search-result-error">no data found <div>`;
      return;
    }
    mock.songs.forEach((e, index) => {
      searchResultContainer.appendChild(
        searchResultElement(
          e.name,
          e.artists,
          e.genre,
          e.url,
          e.imageUrl,
          e.songUrl,
          e.tags,
          index,
          params
        )
      );
    });

    window.onclick = function (event) {
      var modal = document.getElementById("searchModal");
      var loader = document.getElementById("search-result-play-loader");
      var span = document.getElementsByClassName("close")[0];

      if (event.target == modal || event.target === span) {
        modal.classList.remove("show");

        if (
          (params.currentPlaying && !params.currentPlaying.paused) ||
          (params.currentPlaying && params.currentPlaying.currentTime)
        ) {
          params.currentPlaying.pause();
        }
      }
      if (
        event.target === loader &&
        params.currentPlaying &&
        (!params.currentPlaying.paused || params.currentPlaying.currentTime)
      ) {
        params.currentPlaying.pause();
      }
    };
  });
};
