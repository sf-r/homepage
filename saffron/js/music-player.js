// 음악 플레이어 공통 로직. 여러 페이지에서 재사용할 수 있도록
// initMusicPlayer(tracks) 함수로 감싸고, 각 페이지는 자기 폴더의
// music-data.js에서 가져온 트랙 목록을 넘겨서 초기화합니다.
//
// 사용 예:
//   import { initMusicPlayer } from "../../js/music-player.js";
//   import { TRACKS } from "./music-data.js";
//   initMusicPlayer(TRACKS);

export function initMusicPlayer(tracks) {
  const audio = document.getElementById("audio-el");
  const toggleBtn = document.getElementById("player-toggle");
  const toggleIcon = toggleBtn.querySelector(".icon");
  const titleEl = document.getElementById("player-track-title");
  const titleTextEl = titleEl.querySelector(".track-title-text");
  const listEl = document.getElementById("playlist-list");
  const playlistPanel = document.getElementById("playlist-panel");
  const playlistToggleBtn = document.getElementById("playlist-toggle");
  const muteBtn = document.getElementById("mute-toggle");
  const volumeSlider = document.getElementById("volume-slider");
  const playerEl = document.getElementById("music-player");

  let currentIndex = -1;

  // 기본값: 소리 꺼짐. 볼륨 자체는 70%로 준비해둬서, 켜자마자 무음이 아니게 한다.
  audio.volume = 0.7;
  setMuted(true);
  volumeSlider.value = 70;

  /* 제목이 보이는 칸보다 길면 좌우로 왔다갔다하는 애니메이션을 붙인다 */
  function setTrackTitle(text) {
    titleTextEl.textContent = text;
    titleTextEl.classList.remove("marquee");
    titleTextEl.style.removeProperty("--marquee-shift");

    requestAnimationFrame(() => {
      const overflow = titleTextEl.scrollWidth - titleEl.clientWidth;
      if (overflow > 4) {
        titleTextEl.style.setProperty("--marquee-shift", `-${overflow + 12}px`);
        titleTextEl.classList.add("marquee");
      }
    });
  }

  /* 부품: 재생목록 한 줄 */
  function renderPlaylist() {
    listEl.innerHTML = "";
    tracks.forEach((track, i) => {
      const li = document.createElement("li");
      if (i === currentIndex) li.classList.add("active");

      const btn = document.createElement("button");
      btn.textContent = track.title;
      btn.addEventListener("click", () => playTrack(i));

      li.appendChild(btn);
      listEl.appendChild(li);
    });
  }

  function playTrack(index) {
    if (tracks.length === 0) return;
    currentIndex = (index + tracks.length) % tracks.length;
    const track = tracks[currentIndex];
    audio.src = track.src;
    audio.play().catch(() => {
      // 자동재생이 브라우저 정책에 막히면 버튼을 다시 눌러야 재생됩니다.
    });
    setTrackTitle(track.title);
    renderPlaylist();
  }

  function togglePlay() {
    if (currentIndex === -1) {
      playTrack(0);
      return;
    }
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function setMuted(muted) {
    audio.muted = muted;
    muteBtn.classList.toggle("muted", muted);
    muteBtn.setAttribute("aria-pressed", String(muted));
  }

  audio.addEventListener("play", () => {
    toggleBtn.classList.add("spinning");
    toggleIcon.textContent = "❚❚";
  });

  audio.addEventListener("pause", () => {
    toggleBtn.classList.remove("spinning");
    toggleIcon.textContent = "▶";
  });

  audio.addEventListener("ended", () => playTrack(currentIndex + 1));

  toggleBtn.addEventListener("click", togglePlay);

  muteBtn.addEventListener("click", () => setMuted(!audio.muted));

  volumeSlider.addEventListener("input", () => {
    const value = Number(volumeSlider.value);
    audio.volume = value / 100;
    setMuted(value === 0);
  });

  playlistToggleBtn.addEventListener("click", () => {
    playlistPanel.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!playerEl.contains(e.target)) playlistPanel.classList.remove("open");
  });

  window.addEventListener("resize", () => {
    if (currentIndex !== -1) setTrackTitle(tracks[currentIndex].title);
  });

  setTrackTitle(tracks.length ? "재생목록에서 곡을 선택하세요" : "등록된 곡이 없어요");
  renderPlaylist();
}
