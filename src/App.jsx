import { useMemo, useRef, useState } from "react";
import "./App.css";

// 1. 영상 중심의 Mock 데이터 (영상 1개 안에 여러 이벤트가 포함됨)
const mockVideos = [
  {
    id: "v1",
    date: "2026-05-24", // 오늘 날짜 기준
    startTime: "08:00",
    camera: "지하 1층 CCTV-01",
    duration: 3600, // 총 영상 길이 (초 단위, 1시간)
    events: [
      { id: 101, timestamp: 450, title: "좌측 앞문 스크래치 의심", status: "확인 필요" },
      { id: 102, timestamp: 1820, title: "문콕 접촉 의심", status: "분석 완료" },
    ],
  },
  {
    id: "v2",
    date: "2026-05-22",
    startTime: "19:30",
    camera: "정문 옥외 주차장",
    duration: 7200, // 2시간
    events: [
      { id: 201, timestamp: 3400, title: "범퍼 접촉 의심", status: "오탐 가능" },
    ],
  },
  {
    id: "v3",
    date: "2026-05-15",
    startTime: "13:10",
    camera: "후문 주차장",
    duration: 1800, // 30분
    events: [
      { id: 301, timestamp: 900, title: "우측 뒷문 충돌 의심", status: "확인 필요" },
      { id: 302, timestamp: 1100, title: "사람 접근 감지", status: "분석 완료" },
      { id: 303, timestamp: 1550, title: "차량 긁힘 의심", status: "확인 필요" },
    ],
  },
  {
    id: "v4",
    date: "2026-04-10",
    startTime: "21:00",
    camera: "지하 2층 CCTV-04",
    duration: 3600,
    events: [
      { id: 401, timestamp: 2100, title: "기둥 충돌 의심", status: "분석 완료" },
    ],
  },
  {
    id: "v5",
    date: "2026-05-24",
    startTime: "10:20",
    camera: "지하 1층 CCTV-02",
    duration: 2700,
    events: [
      { id: 501, timestamp: 620, title: "후진 중 접촉 의심", status: "확인 필요" },
      { id: 502, timestamp: 1880, title: "차량 측면 접근 감지", status: "분석 완료" },
    ],
  },
  {
    id: "v6",
    date: "2026-05-23",
    startTime: "17:45",
    camera: "지하 2층 CCTV-03",
    duration: 5400,
    events: [
      { id: 601, timestamp: 2800, title: "주차 라인 이탈 접촉 의심", status: "오탐 가능" },
    ],
  },
  {
    id: "v7",
    date: "2026-05-21",
    startTime: "09:15",
    camera: "정문 옥외 주차장",
    duration: 3600,
    events: [
      { id: 701, timestamp: 300, title: "앞 범퍼 근접 감지", status: "분석 완료" },
      { id: 702, timestamp: 2440, title: "문 열림 접촉 의심", status: "확인 필요" },
    ],
  },
  {
    id: "v8",
    date: "2026-05-18",
    startTime: "22:05",
    camera: "후문 주차장",
    duration: 4200,
    events: [
      { id: 801, timestamp: 1260, title: "야간 차량 긁힘 의심", status: "확인 필요" },
    ],
  },
];

function LoginPage({ onLogin }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  return (
    <div className="login-layout">
      <div className="login-left-panel">
        <div className="brand-content">
          <div className="brand-badge">Parking Scratch Detection</div>
          <h1>주차 사고 이벤트 확인 시스템</h1>
          <p>
            CCTV 영상에서 차량 접촉/스크래치 의심 이벤트를 감지하고
            날짜별로 정리하여 확인할 수 있는 웹 UI입니다.
          </p>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="login-form-wrapper">
          <h2>로그인</h2>
          <p className="login-subtitle">관리자 화면으로 접속합니다.</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="admin"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#none" className="support-link">Support</a>
          </div>

          <button className="login-submit-btn" onClick={onLogin}>로그인</button>
        </div>
      </div>
    </div>
  );
}

// 유틸 함수들
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const copied = new Date(date);
  copied.setDate(copied.getDate() + days);
  return copied;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatActualTime(dateText, startTime, seconds) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const date = new Date(`${dateText}T00:00:00`);
  date.setHours(hours, minutes, seconds, 0);

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatMonthLabel(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function getVideosByDateApi(videos) {
  return videos.reduce((groups, video) => {
    groups[video.date] = [...(groups[video.date] ?? []), video];
    return groups;
  }, {});
}

// 대시보드 컴포넌트
function Dashboard({ onLogout }) {
  const today = new Date();
  
  // 상태 관리
  const [filterDays, setFilterDays] = useState(7); // 기본 1주일
  const [selectedVideo, setSelectedVideo] = useState(null); // null이면 홈(그리드) 화면, 값이 있으면 영상 재생 화면
  const [currentEventId, setCurrentEventId] = useState(null); // 현재 선택된 이벤트 마커
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState("1");
  const [volume, setVolume] = useState(70);
  const [quality, setQuality] = useState("auto");
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(new Date("2026-05-01T00:00:00"));
  const playerContainerRef = useRef(null);

  // 날짜 필터링 계산
  const filteredVideos = useMemo(() => {
    const startDate = formatDate(addDays(today, -filterDays));
    return mockVideos.filter((video) => video.date >= startDate);
  }, [filterDays, today]);

  const videosByDate = useMemo(() => {
    return getVideosByDateApi(mockVideos);
  }, []);

  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);
  const nextVideos = useMemo(() => {
    if (!selectedVideo) return [];
    const currentIndex = mockVideos.findIndex((video) => video.id === selectedVideo.id);
    if (currentIndex === -1) return [];
    return Array.from({ length: Math.min(4, mockVideos.length - 1) }, (_, index) => {
      return mockVideos[(currentIndex + index + 1) % mockVideos.length];
    });
  }, [selectedVideo]);

  const moveCalendarMonth = (offset) => {
    setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  };

  const handleCalendarDateClick = (date) => {
    const dateText = formatDate(date);
    const videos = videosByDate[dateText] ?? [];
    if (videos.length > 0) {
      handleWatchVideo(videos[0]);
    }
  };

  // 영상을 클릭하여 시청 모드로 진입
  const handleWatchVideo = (video) => {
    setSelectedVideo(video);
    setCurrentEventId(null);
    setIsPlaying(false);
    setIsTheaterMode(false);
    setIsSidebarOpen(true);
    setCalendarMonth(new Date(`${video.date}T00:00:00`));
  };

  // 홈으로 돌아가기
  const handleBackToHome = () => {
    setSelectedVideo(null);
    setCurrentEventId(null);
    setIsPlaying(false);
    setIsTheaterMode(false);
    setIsSidebarOpen(true);
  };

  const handleToggleFullscreen = () => {
    const player = playerContainerRef.current;
    if (!player) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }

    player.requestFullscreen?.();
  };

  return (
    <div className="dashboard-layout">
      {/* 상단 네비게이션 바 */}
      <header className="top-navbar">
        <div className="nav-section nav-left">
          <button className="nav-logo nav-home-btn" onClick={handleBackToHome}>AI COMS</button>
        </div>
        <div className="nav-section nav-center">
          <span className="nav-title" aria-hidden="true"></span>
        </div>
        <div className="nav-section nav-right">
          <button className="nav-logout-btn" onClick={onLogout}>로그아웃</button>
        </div>
      </header>

      {/* 컨텐츠 영역: 선택된 비디오가 없으면 유튜브 홈 스타일(그리드), 있으면 시청 스타일 */}
      {!selectedVideo ? (
        <main className="home-view">
          {/* 기간 필터 (유튜브 카테고리 필터 스타일) */}
          <div className="filter-pills">
            <button className={filterDays === 7 ? "active" : ""} onClick={() => setFilterDays(7)}>1주일</button>
            <button className={filterDays === 14 ? "active" : ""} onClick={() => setFilterDays(14)}>2주일</button>
            <button className={filterDays === 30 ? "active" : ""} onClick={() => setFilterDays(30)}>1달</button>
            <button className={filterDays === 90 ? "active" : ""} onClick={() => setFilterDays(90)}>3달</button>
            <button className={filterDays === 9999 ? "active" : ""} onClick={() => setFilterDays(9999)}>전체</button>
          </div>

          {/* 영상 썸네일 그리드 */}
          <div className="video-grid">
            {filteredVideos.length === 0 ? (
              <div className="empty-state">선택한 기간에 해당하는 영상이 없습니다.</div>
            ) : (
              filteredVideos.map((video) => (
                <div key={video.id} className="video-card" onClick={() => handleWatchVideo(video)}>
                  <div className="video-thumbnail">
                    {/* 썸네일 이미지 자리 */}
                    <span className="event-count-badge">이벤트 {video.events.length}건</span>
                  </div>
                  <div className="video-info">
                    <h3>{video.date} {video.camera} 녹화본</h3>
                    <p>영상 길이: {formatTime(video.duration)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      ) : (
        <main className={`watch-view ${isTheaterMode ? "theater-view" : ""}`}>
          <button className="back-btn" onClick={handleBackToHome}>
            ← 목록으로 돌아가기
          </button>

          <div className={`watch-layout ${isTheaterMode ? "theater-mode" : ""} ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}>
            <aside className={`event-sidebar ${!isSidebarOpen ? "collapsed" : ""}`}>
              {isSidebarOpen ? (
                <>
                <div className="event-sidebar-header">
                  <div>
                    <h3>감지된 이벤트 목록</h3>
                    <p className="event-summary">총 {selectedVideo.events.length}건의 이벤트가 있습니다.</p>
                  </div>
                  <button
                    className="sidebar-icon-btn"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="이벤트 목록 닫기"
                  >
                    ×
                  </button>
                </div>

                <div className="event-list">
                  {selectedVideo.events.map((event) => (
                    <div
                      key={event.id}
                      className={`event-item ${currentEventId === event.id ? "active" : ""}`}
                      onClick={() => setCurrentEventId(event.id)}
                    >
                      <button
                        className="event-play-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentEventId(event.id);
                          setIsPlaying((playing) => !playing);
                        }}
                        aria-label={`${formatTime(event.timestamp)} 이벤트 재생 전환`}
                      >
                        {isPlaying && currentEventId === event.id ? "⏸" : "▶"}
                      </button>
                      <div className="event-time-block">
                        <div className="event-time">{formatTime(event.timestamp)}</div>
                        <div className="event-actual-time">
                          {formatActualTime(selectedVideo.date, selectedVideo.startTime, event.timestamp)}
                        </div>
                      </div>
                      <div className="event-details">
                        <h4>{event.title}</h4>
                        <span className={`status-tag ${event.status}`}>{event.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                </>
              ) : (
                <button
                  className="sidebar-open-btn"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  이벤트 목록 열기
                </button>
              )}

              {!isSidebarOpen && nextVideos.length > 0 && (
                <section className="next-video-section">
                  <h3>다음 영상</h3>
                  <div className="next-video-list">
                    {nextVideos.map((video) => (
                      <button
                        key={video.id}
                        className="next-video-card"
                        onClick={() => handleWatchVideo(video)}
                      >
                        <strong>{video.date}</strong>
                        <span>{video.camera}</span>
                        <small>{video.startTime} · 이벤트 {video.events.length}건 · {formatTime(video.duration)}</small>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </aside>

            {/* 우측/중앙: 메인 비디오 플레이어 */}
            <section className="player-section">
              <div className="video-metadata">
                <div className="metadata-row">
                  <span className="metadata-item"><strong>카메라:</strong> {selectedVideo.camera}</span>
                  <span className="metadata-item"><strong>날짜:</strong> {selectedVideo.date}</span>
                  <span className="metadata-item"><strong>시작 시간:</strong> {selectedVideo.startTime}</span>
                  <span className="metadata-item"><strong>총 이벤트:</strong> {selectedVideo.events.length}건 감지됨</span>
                </div>
              </div>

              <div className="player-container" ref={playerContainerRef}>
                {/* TODO: 실제 영상이 준비되면 아래 div 대신 video 태그를 사용하세요. 
                  <video src="실제경로.mp4" controls width="100%"></video>
                */}
                <div className="mock-video-player">
                  <span className="video-state-label">
                    {isPlaying ? "Playing" : "Paused"} · {quality === "auto" ? "Auto" : quality} · {playbackSpeed}x
                  </span>
                </div>

                {/* 커스텀 재생바 및 이벤트 마커 표시 */}
                <div className="custom-progress-bar">
                  <div className="progress-track">
                    {/* 재생 진행률 (임시로 0%로 고정) */}
                    <div className="progress-fill" style={{ width: "0%" }}></div>
                    
                    {/* 이벤트 마커 (타임라인의 빨간 점) */}
                    {selectedVideo.events.map((event) => {
                      const leftPosition = (event.timestamp / selectedVideo.duration) * 100;
                      return (
                        <div 
                          key={event.id}
                          className={`event-marker ${currentEventId === event.id ? 'active' : ''}`}
                          style={{ left: `${leftPosition}%` }}
                          title={event.title}
                          onClick={() => setCurrentEventId(event.id)}
                        />
                      );
                    })}
                  </div>
                  <div className="time-labels">
                    <span>0:00</span>
                    <span>{formatTime(selectedVideo.duration)}</span>
                  </div>
                  <div className="player-controls">
                    <button
                      className="control-btn"
                      onClick={() => setIsPlaying((playing) => !playing)}
                    >
                      {isPlaying ? "⏸" : "▶"}
                    </button>

                    <label className="control-field icon-control" aria-label="Playback speed">
                      <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(e.target.value)}>
                        <option value="0.5">0.5x</option>
                        <option value="1">1x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>
                    </label>

                    <label className="control-field volume-field icon-control" aria-label="Volume">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                      />
                    </label>

                    <div className="right-controls">
                      <label className="control-field quality-field icon-control" aria-label="Video quality">
                        <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                          <option value="auto">Auto</option>
                          <option value="1080p">1080p</option>
                          <option value="720p">720p</option>
                          <option value="480p">480p</option>
                        </select>
                      </label>
                      <button
                        className={`control-btn theater-btn ${isTheaterMode ? "active" : ""}`}
                        onClick={() => setIsTheaterMode((enabled) => !enabled)}
                        aria-label="영화관 모드"
                      >
                        ▭
                      </button>
                    <button
                      className="control-btn fullscreen-btn"
                      onClick={handleToggleFullscreen}
                      aria-label="전체화면"
                    >
                      ⛶
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="calendar-side-panel">
              <section className="calendar-panel event-calendar-panel">
                <div className="calendar-header">
                  <button className="calendar-nav-btn" onClick={() => moveCalendarMonth(-1)} aria-label="이전 달">
                    ‹
                  </button>
                  <h2>{formatMonthLabel(calendarMonth)}</h2>
                  <button className="calendar-nav-btn" onClick={() => moveCalendarMonth(1)} aria-label="다음 달">
                    ›
                  </button>
                </div>

                <div className="calendar-weekdays">
                  {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="calendar-grid">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="calendar-day empty" />;
                    }

                    const dateText = formatDate(date);
                    const videos = videosByDate[dateText] ?? [];
                    const hasVideo = videos.length > 0;
                    const isSelectedDate = selectedVideo.date === dateText;

                    return (
                      <button
                        key={dateText}
                        className={`calendar-day ${hasVideo ? "has-video" : ""} ${isSelectedDate ? "selected" : ""}`}
                        onClick={() => handleCalendarDateClick(date)}
                        disabled={!hasVideo}
                        title={hasVideo ? `${videos.length}개 영상 보기` : "영상 없음"}
                      >
                        <span className="calendar-date-number">{date.getDate()}</span>
                        {hasVideo && <span className="calendar-video-count">{videos.length}건</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  return isLogin ? (
    <Dashboard onLogout={() => setIsLogin(false)} />
  ) : (
    <LoginPage onLogin={() => setIsLogin(true)} />
  );
}
