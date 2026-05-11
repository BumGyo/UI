import { useMemo, useState } from "react";
import "./App.css";

const mockEvents = [
  {
    id: 1,
    date: "2026-05-03",
    time: "09:12:21",
    title: "좌측 앞문 스크래치 의심",
    location: "정문 주차장",
    camera: "CCTV A-01",
    status: "확인 필요",
  },
  {
    id: 2,
    date: "2026-05-03",
    time: "14:48:03",
    title: "문콕 접촉 의심",
    location: "지하 1층",
    camera: "CCTV B-02",
    status: "분석 완료",
  },
  {
    id: 3,
    date: "2026-05-02",
    time: "19:22:11",
    title: "우측 뒷문 충돌 의심",
    location: "후문 주차장",
    camera: "CCTV C-01",
    status: "확인 필요",
  },
  {
    id: 4,
    date: "2026-05-01",
    time: "11:03:50",
    title: "범퍼 접촉 의심",
    location: "옥외 주차장",
    camera: "CCTV D-04",
    status: "오탐 가능",
  },
];

const cameraLocations = [
  "전체",
  "정문 주차장",
  "지하 1층",
  "후문 주차장",
  "옥외 주차장",
];

function LoginPage({ onLogin }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-box">
          <div className="brand-badge">Parking Scratch Detection</div>
          <h1>주차 사고 이벤트 확인 시스템</h1>
          <p>
            CCTV 영상에서 차량 접촉/스크래치 의심 이벤트를 감지하고
            날짜별로 정리하여 확인할 수 있는 웹 UI입니다.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>로그인</h2>
          <p className="login-subtitle">관리자 화면으로 접속합니다.</p>

          <label>아이디</label>
          <input
            type="text"
            placeholder="admin"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <label>비밀번호</label>
          <input
            type="password"
            placeholder="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <button onClick={onLogin}>로그인</button>

          <div className="login-tip">
            ※ 현재는 시연용 UI 프로토타입입니다.
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const dates = useMemo(() => [...new Set(mockEvents.map((e) => e.date))], []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedLocation, setSelectedLocation] = useState("전체");

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const sameDate = event.date === selectedDate;
      const sameLocation =
        selectedLocation === "전체" || event.location === selectedLocation;
      return sameDate && sameLocation;
    });
  }, [selectedDate, selectedLocation]);

  const [selectedEventId, setSelectedEventId] = useState(
    filteredEvents[0]?.id || mockEvents[0].id
  );

  const selectedEvent =
    filteredEvents.find((e) => e.id === selectedEventId) ||
    filteredEvents[0] ||
    mockEvents[0];

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <h1>주차 사고 이벤트 관제 화면</h1>
          <p>CCTV 기반 접촉/스크래치 의심 이벤트 확인</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          로그아웃
        </button>
      </header>

      <div className="dashboard-body">
        {/* 왼쪽 메인 */}
        <section className="main-panel">
          {/* 날짜 선택 */}
          <div className="panel card">
            <div className="panel-header">
              <h2>1. 날짜 선택</h2>
              <p>날짜를 선택하면 해당 날짜의 이벤트 목록이 표시됩니다.</p>
            </div>

            <div className="date-grid">
              {dates.map((date) => (
                <button
                  key={date}
                  className={`date-box ${
                    selectedDate === date ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedDate(date);
                    const firstEvent = mockEvents.find((e) => e.date === date);
                    if (firstEvent) setSelectedEventId(firstEvent.id);
                  }}
                >
                  <div className="date-text">{date}</div>
                  <div className="date-count">
                    이벤트 {mockEvents.filter((e) => e.date === date).length}건
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 이벤트 목록 + 영상 */}
          <div className="content-grid">
            <div className="panel card">
              <div className="panel-header">
                <h2>2. 이벤트 미리보기 목록</h2>
                <p>이벤트를 클릭하면 오른쪽에서 상세 내용을 확인합니다.</p>
              </div>

              <div className="event-list">
                {filteredEvents.length === 0 ? (
                  <div className="empty-box">선택한 조건의 이벤트가 없습니다.</div>
                ) : (
                  filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`event-card ${
                        selectedEvent?.id === event.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedEventId(event.id)}
                    >
                      <div className="thumbnail">
                        <span>Preview</span>
                      </div>

                      <div className="event-info">
                        <h3>{event.title}</h3>
                        <p>
                          <strong>시간:</strong> {event.time}
                        </p>
                        <p>
                          <strong>위치:</strong> {event.location}
                        </p>
                        <p>
                          <strong>카메라:</strong> {event.camera}
                        </p>
                        <span className={`status-badge ${event.status}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="panel card">
              <div className="panel-header">
                <h2>3. 선택한 이벤트 영상 확인</h2>
                <p>선택한 이벤트에 대한 CCTV 영상을 재생하는 영역입니다.</p>
              </div>

              <div className="video-area">
                <div className="fake-video">
                  <div className="video-overlay-text">CCTV VIDEO</div>
                  <div className="detect-box"></div>
                  <button className="play-btn">▶</button>
                </div>
              </div>

              <div className="detail-box">
                <h3>이벤트 상세 정보</h3>
                <p>
                  <strong>이벤트명:</strong> {selectedEvent?.title}
                </p>
                <p>
                  <strong>날짜:</strong> {selectedEvent?.date}
                </p>
                <p>
                  <strong>시간:</strong> {selectedEvent?.time}
                </p>
                <p>
                  <strong>위치:</strong> {selectedEvent?.location}
                </p>
                <p>
                  <strong>카메라:</strong> {selectedEvent?.camera}
                </p>
                <p>
                  <strong>상태:</strong> {selectedEvent?.status}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 오른쪽 사이드 */}
        <aside className="side-panel">
          <div className="panel card">
            <div className="panel-header">
              <h2>CCTV 위치 선택</h2>
              <p>오른쪽에서 촬영 위치를 선택할 수 있습니다.</p>
            </div>

            <div className="location-list">
              {cameraLocations.map((loc) => (
                <button
                  key={loc}
                  className={`location-btn ${
                    selectedLocation === loc ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedLocation(loc);
                    const next =
                      mockEvents.find(
                        (e) =>
                          e.date === selectedDate &&
                          (loc === "전체" || e.location === loc)
                      ) || null;
                    if (next) setSelectedEventId(next.id);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="panel card">
            <div className="panel-header">
              <h2>요약</h2>
              <p>선택한 날짜 기준 이벤트 현황</p>
            </div>

            <div className="summary-box">
              <div className="summary-item">
                <span>총 이벤트</span>
                <strong>{filteredEvents.length}건</strong>
              </div>
              <div className="summary-item">
                <span>선택 날짜</span>
                <strong>{selectedDate}</strong>
              </div>
              <div className="summary-item">
                <span>촬영 위치</span>
                <strong>{selectedLocation}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
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