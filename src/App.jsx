import { useMemo, useRef, useState, useEffect } from "react";
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

// 2. 이벤트 통계 분석 뷰 (Custom SVG Charts)
function AnalyticsView({ filteredVideos, filterDays, setFilterDays }) {
  const stats = useMemo(() => {
    let totalEvents = 0;
    let pendingCount = 0;
    let resolvedCount = 0;

    const dateCounts = {};
    const cameraCounts = {};
    const eventTypeCounts = {};
    const hourCounts = Array(24).fill(0);

    // Group matching video list
    const videoIds = new Set(filteredVideos.map(v => v.id));
    const matchingVideos = mockVideos.filter(v => videoIds.has(v.id));

    matchingVideos.forEach(video => {
      const [startHour] = video.startTime.split(":").map(Number);

      video.events.forEach(event => {
        totalEvents += 1;

        // Status counts
        if (event.status === "확인 필요") pendingCount++;
        else if (event.status === "분석 완료") resolvedCount++;

        // Date grouping
        dateCounts[video.date] = (dateCounts[video.date] || 0) + 1;

        // Camera grouping
        cameraCounts[video.camera] = (cameraCounts[video.camera] || 0) + 1;

        // Type grouping
        let type = "기타";
        if (event.title.includes("스크래치") || event.title.includes("긁힘")) type = "스크래치 의심";
        else if (event.title.includes("문콕")) type = "문콕 접촉 의심";
        else if (event.title.includes("충돌") || event.title.includes("접촉")) type = "차량 충돌 의심";
        else if (event.title.includes("접근") || event.title.includes("감지")) type = "인물 접근 감지";

        eventTypeCounts[type] = (eventTypeCounts[type] || 0) + 1;

        // Hour computation
        const eventSeconds = event.timestamp;
        const eventHour = (startHour + Math.floor(eventSeconds / 3600)) % 24;
        hourCounts[eventHour]++;
      });
    });

    // Sort dates chronologically
    const sortedDates = Object.keys(dateCounts).sort().map(date => ({
      date: date.substring(5), // MM-DD
      count: dateCounts[date]
    }));

    // Convert cameras to array
    const cameraList = Object.keys(cameraCounts).map(cam => ({
      name: cam,
      count: cameraCounts[cam]
    })).sort((a, b) => b.count - a.count);

    // Convert event types to array
    const eventTypeList = Object.keys(eventTypeCounts).map(type => ({
      name: type,
      count: eventTypeCounts[type]
    }));

    // Hourly grouped brackets
    const hourlyGroups = [
      { name: "새벽 (00-06)", count: 0 },
      { name: "오전 (06-12)", count: 0 },
      { name: "오후 (12-18)", count: 0 },
      { name: "야간 (18-24)", count: 0 }
    ];
    for (let h = 0; h < 24; h++) {
      const count = hourCounts[h];
      if (h < 6) hourlyGroups[0].count += count;
      else if (h < 12) hourlyGroups[1].count += count;
      else if (h < 18) hourlyGroups[2].count += count;
      else hourlyGroups[3].count += count;
    }

    return {
      totalVideos: matchingVideos.length,
      totalEvents,
      pendingCount,
      resolvedCount,
      sortedDates,
      cameraList,
      eventTypeList,
      hourlyGroups
    };
  }, [filteredVideos]);

  const dailyTrendChart = useMemo(() => {
    const width = 500;
    const height = 200;
    const paddingX = 40;
    const paddingY = 30;
    const plotW = width - paddingX * 2;
    const plotH = height - paddingY * 2;
    const data = stats.sortedDates;
    if (data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.count), 4) + 1;

    const points = data.map((d, i) => {
      const x = paddingX + (i * plotW) / (data.length - 1);
      const y = height - paddingY - (d.count * plotH) / maxVal;
      return { x, y, label: d.date, value: d.count };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return (
      <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} className="stats-svg">
        <defs>
          <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Axis Grid lines */}
        {[0, 1, 2, 3, 4, 5].map(v => {
          const y = height - paddingY - (v * plotH) / maxVal;
          return (
            <g key={v}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="var(--chart-grid)" strokeDasharray="3 3" />
              <text x={paddingX - 10} y={y + 4} textAnchor="end" className="chart-axis-text" fill="var(--chart-text)">{v}</text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill="url(#area-gradient)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--chart-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--chart-primary)" stroke="var(--chart-grid)" strokeWidth="1" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="chart-value-text" fill="var(--chart-text-primary)">
              {p.value}
            </text>
            <text x={p.x} y={height - paddingY + 16} textAnchor="middle" className="chart-axis-text" fill="var(--chart-text)">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    );
  }, [stats.sortedDates]);

  const donutChart = useMemo(() => {
    const total = stats.totalEvents;
    if (total === 0) return null;
    const r = 50;
    const circ = 2 * Math.PI * r;
    let currentAngle = -90;

    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    const segments = [];
    for (let idx = 0; idx < stats.eventTypeList.length; idx++) {
      const type = stats.eventTypeList[idx];
      const percentage = (type.count / total) * 100;
      const angle = (type.count / total) * 360;
      const strokeDashoffset = circ - (type.count / total) * circ;
      const rotation = currentAngle;
      currentAngle += angle;
      const color = colors[idx % colors.length];

      segments.push({
        ...type,
        percentage: percentage.toFixed(1),
        strokeDashoffset,
        rotation,
        color
      });
    }

    return (
      <div className="donut-chart-container">
        <svg width="180" height="180" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={r} fill="transparent" stroke="var(--chart-grid)" strokeWidth="16" />
          {segments.map((seg, idx) => (
            <circle
              key={idx}
              cx="100"
              cy="100"
              r={r}
              fill="transparent"
              stroke={seg.color}
              strokeWidth="18"
              strokeDasharray={circ}
              strokeDashoffset={seg.strokeDashoffset}
              transform={`rotate(${seg.rotation} 100 100)`}
              className="donut-segment"
            />
          ))}
          <g className="donut-center-text">
            <text x="100" y="95" textAnchor="middle" className="donut-total" fill="var(--chart-text-primary)" style={{ fontSize: "28px", fontWeight: "800" }}>
              {total}
            </text>
            <text x="100" y="115" textAnchor="middle" className="donut-label" fill="var(--chart-text)" style={{ fontSize: "12px", fontWeight: "600" }}>
              총 감지 건수
            </text>
          </g>
        </svg>

        <div className="donut-legend">
          {segments.map((seg, idx) => (
            <div key={idx} className="legend-item">
              <span className="legend-badge" style={{ backgroundColor: seg.color }} />
              <span className="legend-name">{seg.name}</span>
              <span className="legend-count">{seg.count}건 ({seg.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [stats.eventTypeList, stats.totalEvents]);

  const hourlyChartSvg = useMemo(() => {
    const width = 450;
    const height = 200;
    const paddingX = 40;
    const paddingY = 30;
    const plotW = width - paddingX * 2;
    const plotH = height - paddingY * 2;
    const data = stats.hourlyGroups;
    const maxVal = Math.max(...data.map(d => d.count), 4) + 1;

    const barW = 32;
    const gap = (plotW - barW * data.length) / (data.length - 1);

    return (
      <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} className="stats-svg">
        {[0, 1, 2, 3, 4, 5].map(v => {
          const y = height - paddingY - (v * plotH) / maxVal;
          return (
            <g key={v}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="var(--chart-grid)" strokeDasharray="3 3" />
              <text x={paddingX - 10} y={y + 4} textAnchor="end" className="chart-axis-text" fill="var(--chart-text)">{v}</text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const barH = (d.count * plotH) / maxVal;
          const x = paddingX + i * (barW + gap);
          const y = height - paddingY - barH;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill="var(--chart-secondary)"
                rx="4"
                className="chart-bar"
              />
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="chart-value-text" fill="var(--chart-text-primary)">
                {d.count}
              </text>
              <text x={x + barW / 2} y={height - paddingY + 16} textAnchor="middle" className="chart-axis-text" fill="var(--chart-text)">
                {d.name.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }, [stats.hourlyGroups]);

  const cameraStats = useMemo(() => {
    const maxCount = Math.max(...stats.cameraList.map(c => c.count), 1);

    return (
      <div className="camera-stats-list">
        {stats.cameraList.map((cam, idx) => {
          const pct = (cam.count / maxCount) * 100;
          return (
            <div key={idx} className="camera-stat-row">
              <div className="camera-name">{cam.name}</div>
              <div className="camera-bar-wrapper">
                <div className="camera-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="camera-count">{cam.count}건</div>
            </div>
          );
        })}
      </div>
    );
  }, [stats.cameraList]);

  return (
    <div className="analytics-view">
      <div className="analytics-header">
        <h2>📊 AI 감지 이벤트 통계 분석</h2>
        <p>CCTV 녹화본에서 감지된 차량 사고 및 접촉 의심 이벤트 통계 요약입니다.</p>
      </div>

      {/* 기간 필터 */}
      <div className="filter-pills" style={{ marginBottom: "24px" }}>
        <button className={filterDays === 7 ? "active" : ""} onClick={() => setFilterDays(7)}>1주일</button>
        <button className={filterDays === 14 ? "active" : ""} onClick={() => setFilterDays(14)}>2주일</button>
        <button className={filterDays === 30 ? "active" : ""} onClick={() => setFilterDays(30)}>1개월</button>
        <button className={filterDays === 90 ? "active" : ""} onClick={() => setFilterDays(90)}>3개월</button>
        <button className={filterDays === 9999 ? "active" : ""} onClick={() => setFilterDays(9999)}>전체</button>
      </div>

      {stats.totalEvents === 0 ? (
        <div className="empty-state" style={{ padding: "80px 20px" }}>선택한 기간에 감지된 이벤트 통계 데이터가 없습니다.</div>
      ) : (
        <>
          <div className="analytics-summary-cards">
            <div className="summary-card">
              <div className="card-icon">🎥</div>
              <div className="card-data">
                <span className="card-label">분석된 총 영상</span>
                <span className="card-value">{stats.totalVideos}개</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">🚨</div>
              <div className="card-data">
                <span className="card-label">누적 감지 이벤트</span>
                <span className="card-value">{stats.totalEvents}건</span>
              </div>
            </div>
            <div className="summary-card warning">
              <div className="card-icon">⚠️</div>
              <div className="card-data">
                <span className="card-label">확인 필요 이벤트</span>
                <span className="card-value">{stats.pendingCount}건</span>
              </div>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="analytics-chart-card">
              <h3> 날짜별 감지 이벤트 추이</h3>
              <div className="chart-wrapper">{dailyTrendChart}</div>
            </div>

            <div className="analytics-chart-card">
              <h3> 이벤트 유형별 비율</h3>
              <div className="chart-wrapper donut-wrapper">{donutChart}</div>
            </div>

            <div className="analytics-chart-card">
              <h3> 시간대별 발생 빈도</h3>
              <div className="chart-wrapper">{hourlyChartSvg}</div>
            </div>

            <div className="analytics-chart-card">
              <h3> 카메라별 감지 현황</h3>
              <div className="chart-wrapper">{cameraStats}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 대시보드 컴포넌트
function Dashboard({ onLogout }) {
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

  // 프로필 & 설정 관련 상태
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("account"); // "account", "security"
  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard", "analytics"

  // 설정 정보
  const adminName = "admin";
  const [adminRealName, setAdminRealName] = useState("홍길동");
  const [adminPhone, setAdminPhone] = useState("010-1234-5678");
  const [adminEmail, setAdminEmail] = useState("admin@cbnu-capstone.com");

  // 비밀번호 변경 필드
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 테마 설정 (다크 모드)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크 모드 활성화 / 비활성화 제어
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // 날짜 필터링 계산
  const filteredVideos = useMemo(() => {
    const today = new Date();
    const startDate = formatDate(addDays(today, -filterDays));
    return mockVideos.filter((video) => video.date >= startDate);
  }, [filterDays]);

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
    setCurrentView("dashboard");
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
          <div className="profile-menu-container">
            <button
              className="profile-trigger-btn simple-avatar-trigger"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="프로필 메뉴 열기"
            >
              <div className="profile-avatar">
                <span>A</span>
              </div>
            </button>

            {isProfileOpen && (
              <>
                <div className="dropdown-overlay" onClick={() => setIsProfileOpen(false)} />
                <div className="profile-dropdown-menu">
                  {/* 관리자 정보 요약 Header */}
                  <div className="dropdown-header">
                    <div className="header-avatar">A</div>
                    <div className="header-info">
                      <span className="info-name">{adminRealName} ({adminName})</span>
                      <span className="info-role">시스템 관리자</span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  {/* 내 정보 설정 (Account Settings) */}
                  <div className="dropdown-section-title">내 정보 설정</div>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsSettingsOpen(true);
                      setActiveSettingsTab("account");
                    }}
                  >
                    👤 관리자 정보 수정
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsSettingsOpen(true);
                      setActiveSettingsTab("security");
                    }}
                  >
                    🔑 비밀번호 변경
                  </button>

                  <div className="dropdown-divider" />

                  {/* 화면 이동 */}
                  <div className="dropdown-section-title">화면 이동</div>
                  <button
                    className={`dropdown-item ${currentView === "analytics" ? "active-menu-item" : ""}`}
                    onClick={() => {
                      setIsProfileOpen(false);
                      setCurrentView("analytics");
                    }}
                  >
                    📊 이벤트 통계 그래프
                  </button>

                  <div className="dropdown-divider" />

                  {/* 테마 설정 (Appearance) */}
                  <div className="dropdown-section-title">테마 설정</div>
                  <div className="dropdown-item-toggle">
                    <span>🌙 다크 모드</span>
                    <label className="switch-mini">
                      <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                      />
                      <span className="slider-mini round"></span>
                    </label>
                  </div>

                  <div className="dropdown-divider" />

                  {/* 로그아웃 (Logout) */}
                  <button
                    className="dropdown-item logout-item"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                  >
                    🚪 로그아웃
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 컨텐츠 영역: 통계 뷰 또는 모니터링 뷰 */}
      {currentView === "analytics" ? (
        <AnalyticsView
          filteredVideos={filteredVideos}
          filterDays={filterDays}
          setFilterDays={setFilterDays}
        />
      ) : !selectedVideo ? (
        <main className="home-view">
          {/* 기간 필터 (유튜브 카테고리 필터 스타일) */}
          <div className="filter-pills">
            <button className={filterDays === 7 ? "active" : ""} onClick={() => setFilterDays(7)}>1주일</button>
            <button className={filterDays === 14 ? "active" : ""} onClick={() => setFilterDays(14)}>2주일</button>
            <button className={filterDays === 30 ? "active" : ""} onClick={() => setFilterDays(30)}>1개월</button>
            <button className={filterDays === 90 ? "active" : ""} onClick={() => setFilterDays(90)}>3개월</button>
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
                        <div className="event-item-top">
                          <span className="event-time-pill">{formatTime(event.timestamp)}</span>
                          <span className="event-actual-time-text">
                            {formatActualTime(selectedVideo.date, selectedVideo.startTime, event.timestamp)}
                          </span>
                          <button
                            className="event-play-icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentEventId(event.id);
                              setIsPlaying((playing) => !playing);
                            }}
                            aria-label={`${formatTime(event.timestamp)} 이벤트 재생 전환`}
                          >
                            {isPlaying && currentEventId === event.id ? "⏸" : "▶"}
                          </button>
                        </div>
                        <div className="event-item-bottom">
                          <h4 className="event-title-text">{event.title}</h4>
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

      {/* 설정 모달 */}
      {isSettingsOpen && (
        <div className="settings-modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="settings-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-sidebar">
              <h3>설정</h3>
              <button
                className={`settings-tab-btn ${activeSettingsTab === "account" ? "active" : ""}`}
                onClick={() => setActiveSettingsTab("account")}
              >
                👤 내 정보 설정
              </button>
              <button
                className={`settings-tab-btn ${activeSettingsTab === "security" ? "active" : ""}`}
                onClick={() => setActiveSettingsTab("security")}
              >
                🔑 비밀번호 변경
              </button>
              <button
                className="settings-modal-close-btn"
                onClick={() => setIsSettingsOpen(false)}
              >
                닫기
              </button>
            </div>

            <div className="settings-modal-content">
              {activeSettingsTab === "account" && (
                <div className="settings-tab-content">
                  <h2>내 정보 설정</h2>
                  <p className="tab-description">관리자 기본 정보를 확인 및 수정할 수 있습니다.</p>

                  <div className="settings-form-group">
                    <label>계정 아이디</label>
                    <input type="text" value={adminName} disabled className="disabled-input" />
                  </div>

                  <div className="settings-form-group">
                    <label>이름</label>
                    <input
                      type="text"
                      value={adminRealName}
                      onChange={(e) => setAdminRealName(e.target.value)}
                      placeholder="이름 입력"
                    />
                  </div>

                  <div className="settings-form-group">
                    <label>연락처</label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="연락처 입력"
                    />
                  </div>

                  <div className="settings-form-group">
                    <label>이메일 주소</label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="이메일 입력"
                    />
                  </div>

                  <button
                    className="settings-save-btn"
                    onClick={() => {
                      if (!adminRealName || !adminPhone || !adminEmail) {
                        alert("필수 입력 항목이 누락되었습니다.");
                        return;
                      }
                      alert("관리자 정보가 성공적으로 저장되었습니다.");
                    }}
                  >
                    수정 내용 저장
                  </button>
                </div>
              )}

              {activeSettingsTab === "security" && (
                <div className="settings-tab-content">
                  <h2>비밀번호 변경</h2>
                  <p className="tab-description">시스템 보안을 위해 주기적으로 비밀번호를 변경해 주십시오.</p>

                  <div className="settings-form-group">
                    <label>현재 비밀번호</label>
                    <input
                      type="password"
                      placeholder="현재 비밀번호 입력"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="settings-form-group">
                    <label>새 비밀번호</label>
                    <input
                      type="password"
                      placeholder="새 비밀번호 입력"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="settings-form-group">
                    <label>새 비밀번호 확인</label>
                    <input
                      type="password"
                      placeholder="새 비밀번호 다시 입력"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button
                    className="settings-save-btn"
                    onClick={() => {
                      if (!currentPassword || !newPassword || !confirmPassword) {
                        alert("모든 필드를 입력해 주세요.");
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        alert("새 비밀번호가 서로 일치하지 않습니다.");
                        return;
                      }
                      alert("비밀번호가 성공적으로 변경되었습니다.");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    비밀번호 변경 완료
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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
