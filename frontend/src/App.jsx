import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

const sampleClubs = [
  {
    _id: "coding-club",
    name: "Coding Club",
    category: "Technical",
    status: "ACTIVE",
    description:
      "A community for students interested in programming, competitive coding and software development.",
  },
  {
    _id: "ai-robotics",
    name: "AI & Robotics Club",
    category: "Technical",
    status: "ACTIVE",
    description:
      "Explore artificial intelligence, robotics, machine learning and innovative technology projects.",
  },
  {
    _id: "dance-club",
    name: "Dance Club",
    category: "Cultural",
    status: "ACTIVE",
    description:
      "Express yourself through dance, performances, workshops and exciting campus events.",
  },
  {
    _id: "music-club",
    name: "Music Club",
    category: "Cultural",
    status: "ACTIVE",
    description:
      "A place for singers, musicians and music enthusiasts to perform and collaborate.",
  },
  {
    _id: "photography-club",
    name: "Photography Club",
    category: "Arts",
    status: "ACTIVE",
    description:
      "Capture campus life, learn photography techniques and participate in creative projects.",
  },
  {
    _id: "literary-club",
    name: "Literary Club",
    category: "Literary",
    status: "ACTIVE",
    description:
      "A creative space for readers, writers, poets and students who love storytelling.",
  },
  {
    _id: "entrepreneurship-club",
    name: "Entrepreneurship Club",
    category: "Entrepreneurship",
    status: "ACTIVE",
    description:
      "Turn ideas into opportunities through startup discussions, ideathons and innovation activities.",
  },
  {
    _id: "sports-club",
    name: "Sports Club",
    category: "Sports",
    status: "ACTIVE",
    description:
      "Bring students together through football, cricket, badminton and other sporting activities.",
  },
  {
    _id: "design-club",
    name: "Design Club",
    category: "Creative",
    status: "ACTIVE",
    description:
      "Learn UI/UX, graphic design, visual communication and creative problem solving.",
  },
  {
    _id: "cyber-security-club",
    name: "Cyber Security Club",
    category: "Technical",
    status: "ACTIVE",
    description:
      "Learn cybersecurity concepts through workshops, challenges and practical security activities.",
  },
];

const sampleActivities = [
  {
    _id: "activity-1",
    title: "Weekly Coding Challenge",
    description:
      "Test your problem-solving skills with a fun weekly programming challenge.",
    date: "2026-09-28",
    location: "Computer Lab 1",
    status: "UPCOMING",
  },
  {
    _id: "activity-2",
    title: "AI & Robotics Workshop",
    description:
      "Hands-on introduction to artificial intelligence and robotics projects.",
    date: "2026-09-30",
    location: "Innovation Lab",
    status: "UPCOMING",
  },
  {
    _id: "activity-3",
    title: "Dance Practice Session",
    description:
      "Open dance practice session for beginners and experienced performers.",
    date: "2026-09-27",
    location: "Open Auditorium",
    status: "UPCOMING",
  },
  {
    _id: "activity-4",
    title: "Open Mic Night",
    description:
      "An evening for singers, musicians, poets and performers to showcase their talent.",
    date: "2026-10-02",
    location: "College Auditorium",
    status: "UPCOMING",
  },
  {
    _id: "activity-5",
    title: "Campus Photography Walk",
    description:
      "Explore the campus and capture creative photographs with fellow photography enthusiasts.",
    date: "2026-09-29",
    location: "Main Campus",
    status: "UPCOMING",
  },
  {
    _id: "activity-6",
    title: "Poetry & Storytelling Evening",
    description:
      "Share original poems, short stories and creative writing with the campus community.",
    date: "2026-10-04",
    location: "Seminar Hall",
    status: "UPCOMING",
  },
  {
    _id: "activity-7",
    title: "Startup Ideathon",
    description:
      "Build innovative ideas and present solutions to real-world problems.",
    date: "2026-10-06",
    location: "Innovation Centre",
    status: "UPCOMING",
  },
  {
    _id: "activity-8",
    title: "Inter-Branch Football",
    description:
      "Friendly football tournament between student teams from different branches.",
    date: "2026-10-08",
    location: "College Ground",
    status: "UPCOMING",
  },
  {
    _id: "activity-9",
    title: "UI/UX Design Workshop",
    description:
      "Learn the basics of user interface and user experience design through practical activities.",
    date: "2026-10-01",
    location: "Design Studio",
    status: "UPCOMING",
  },
  {
    _id: "activity-10",
    title: "Capture the Flag Challenge",
    description:
      "Solve cybersecurity challenges and compete with other student teams.",
    date: "2026-10-10",
    location: "Cyber Lab",
    status: "UPCOMING",
  },
  {
    _id: "activity-11",
    title: "Web Development Bootcamp",
    description:
      "Learn the fundamentals of modern frontend and backend web development.",
    date: "2026-10-03",
    location: "Computer Lab 2",
    status: "UPCOMING",
  },
  {
    _id: "activity-12",
    title: "AI Project Showcase",
    description:
      "Students present interesting artificial intelligence and machine learning projects.",
    date: "2026-10-12",
    location: "Main Auditorium",
    status: "UPCOMING",
  },
];

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const [activePage, setActivePage] = useState("dashboard");

  const [clubs, setClubs] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(false);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const apiRequest = async (url, options = {}) => {
    const token = getToken();

    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    if (!contentType.includes("application/json")) {
      throw new Error(
        `API error at ${url} - Server returned ${response.status}`,
      );
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`API error at ${url} - Invalid JSON response`);
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed at ${url}`);
    }

    return data;
  };

  const login = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();

      if (!contentType.includes("application/json")) {
        setMessage(
          `Login API returned ${response.status}. Backend response was not JSON.`,
        );
        return;
      }

      const data = JSON.parse(text);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setLoggedIn(true);
        setActivePage("dashboard");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedIn(false);
    setActivePage("dashboard");

    setClubs([]);
    setMemberships([]);
    setActivities([]);
    setNotifications([]);
  };

  const loadData = async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/clubs");

      const apiClubs =
        data.clubs || data.data || (Array.isArray(data) ? data : []);

      setClubs(apiClubs.length > 0 ? apiClubs : sampleClubs);
    } catch (error) {
      console.log(error.message);
      setClubs(sampleClubs);
    }

    try {
      const data = await apiRequest("/memberships/my");

      setMemberships(
        data.memberships || data.data || (Array.isArray(data) ? data : []),
      );
    } catch (error) {
      console.log(error.message);
    }

    try {
      const data = await apiRequest("/activities");

      const apiActivities =
        data.activities || data.data || (Array.isArray(data) ? data : []);

      setActivities(
        apiActivities.length > 0 ? apiActivities : sampleActivities,
      );
    } catch (error) {
      console.log(error.message);
      setActivities(sampleActivities);
    }

    try {
      const data = await apiRequest("/notifications");

      setNotifications(
        data.notifications || data.data || (Array.isArray(data) ? data : []),
      );
    } catch (error) {
      console.log(error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (loggedIn) {
      const timer = setTimeout(() => {
        loadData();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [loggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const joinClub = async (clubId) => {
    setMessage("");

    const isSampleClub = sampleClubs.some((club) => club._id === clubId);

    if (isSampleClub) {
      alert(
        "This club is sample data. Add it through the Admin API to enable real membership requests.",
      );
      return;
    }

    try {
      await apiRequest("/memberships/request", {
        method: "POST",
        body: JSON.stringify({
          clubId,
        }),
      });

      alert("Membership request sent successfully!");

      await loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const getMembershipStatus = (clubId) => {
    const membership = memberships.find((item) => {
      const membershipClubId = item.club?._id || item.club?.id || item.club;

      return String(membershipClubId) === String(clubId);
    });

    return membership ? membership.status : null;
  };

  const getClubIcon = (category) => {
    const value = (category || "").toLowerCase();

    if (value.includes("technical")) return "💻";
    if (value.includes("cultural")) return "🎭";
    if (value.includes("sport")) return "⚽";
    if (value.includes("music")) return "🎵";
    if (value.includes("art")) return "📸";
    if (value.includes("liter")) return "📚";
    if (value.includes("robot")) return "🤖";
    if (value.includes("entre")) return "🚀";
    if (value.includes("creative")) return "🎨";

    return "✦";
  };

  const getActivityIcon = (title) => {
    const value = (title || "").toLowerCase();

    if (
      value.includes("hack") ||
      value.includes("code") ||
      value.includes("web")
    ) {
      return "💻";
    }

    if (value.includes("ai") || value.includes("robot")) {
      return "🤖";
    }

    if (
      value.includes("sport") ||
      value.includes("football") ||
      value.includes("game")
    ) {
      return "🏆";
    }

    if (value.includes("music") || value.includes("open mic")) {
      return "🎵";
    }

    if (value.includes("dance")) return "💃";
    if (value.includes("photo")) return "📸";
    if (value.includes("workshop")) return "🛠️";
    if (value.includes("design")) return "🎨";

    if (value.includes("startup") || value.includes("ideathon")) {
      return "🚀";
    }

    if (value.includes("security") || value.includes("capture")) {
      return "🔐";
    }

    if (value.includes("poetry") || value.includes("story")) {
      return "📖";
    }

    return "✨";
  };

  if (!loggedIn) {
    return (
      <div className="page">
        <div className="left">
          <div className="logo">✦ CampusHub</div>

          <div className="hero">
            <p>STUDENT COMMUNITY PLATFORM</p>

            <h1>
              Connect.
              <br />
              Participate.
              <br />
              Belong.
            </h1>

            <span>
              Discover clubs, join communities and stay connected with
              everything happening on campus.
            </span>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "35px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  padding: "9px 14px",
                  borderRadius: "20px",
                  color: "#eeeaff",
                  fontSize: "11px",
                }}
              >
                ✦ Student Clubs
              </span>

              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  padding: "9px 14px",
                  borderRadius: "20px",
                  color: "#eeeaff",
                  fontSize: "11px",
                }}
              >
                ◈ Campus Events
              </span>

              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  padding: "9px 14px",
                  borderRadius: "20px",
                  color: "#eeeaff",
                  fontSize: "11px",
                }}
              >
                ✓ Community
              </span>
            </div>
          </div>
        </div>

        <div className="right">
          <form className="loginBox" onSubmit={login}>
            <div className="icon">✦</div>

            <h2>Welcome back</h2>

            <p>Sign in to your CampusHub account</p>

            <label>Email address</label>

            <input
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Sign in →</button>

            {message && <div className="message">{message}</div>}

            <small>CampusHub • Student Club Management</small>
          </form>
        </div>
      </div>
    );
  }

  const user = getUser();

  return (
    <div className="dashboard">
      <div className="topbar">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => setActivePage("dashboard")}
        >
          ✦ CampusHub
        </div>

        <div className="userArea">
          <span>👋 {user.name || "Student"}</span>

          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="dashboardContent">
        {message && <div className="message">{message}</div>}

        {activePage === "dashboard" && (
          <>
            <div
              style={{
                background:
                  "linear-gradient(135deg, #211a45 0%, #654bd7 55%, #8b5cf6 100%)",
                borderRadius: "24px",
                padding: "38px",
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 18px 40px rgba(77, 54, 160, 0.18)",
              }}
            >
              <p
                style={{
                  color: "#d9d2ff",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                  margin: "0 0 12px",
                }}
              >
                CAMPUSHUB • STUDENT COMMUNITY
              </p>

              <h1
                style={{
                  color: "white",
                  fontSize: "38px",
                  margin: "0 0 10px",
                }}
              >
                Welcome, {user.name || "Student"} 👋
              </h1>

              <p
                style={{
                  color: "#e1dcff",
                  fontSize: "14px",
                  margin: 0,
                  maxWidth: "620px",
                  lineHeight: "1.7",
                }}
              >
                Discover communities, join clubs, explore activities and make
                your campus experience more memorable.
              </p>
            </div>

            <div className="statRow">
              <div className="statCard">
                <small>AVAILABLE CLUBS</small>
                <strong>{clubs.length}</strong>
              </div>

              <div className="statCard">
                <small>MY MEMBERSHIPS</small>
                <strong>{memberships.length}</strong>
              </div>

              <div className="statCard">
                <small>UPCOMING ACTIVITIES</small>
                <strong>{activities.length}</strong>
              </div>
            </div>

            <div className="sectionHeader">
              <div>
                <h2>Explore CampusHub</h2>

                <p
                  style={{
                    color: "#888795",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  Everything you need to participate on campus.
                </p>
              </div>
            </div>

            <div className="cards">
              <div className="card">
                <div className="cardIcon">🏫</div>

                <h2>Student Clubs</h2>

                <p>
                  Discover technical, cultural, sports and interest-based
                  communities around campus.
                </p>

                <button onClick={() => setActivePage("clubs")}>
                  Explore Clubs →
                </button>
              </div>

              <div className="card">
                <div className="cardIcon">🎯</div>

                <h2>Campus Activities</h2>

                <p>
                  Find workshops, competitions, events and experiences happening
                  around your campus.
                </p>

                <button onClick={() => setActivePage("activities")}>
                  View Activities →
                </button>
              </div>

              <div className="card">
                <div className="cardIcon">🤝</div>

                <h2>My Memberships</h2>

                <p>
                  Track your membership requests and see which communities you
                  belong to.
                </p>

                <button onClick={() => setActivePage("memberships")}>
                  My Memberships →
                </button>
              </div>

              <div className="card">
                <div className="cardIcon">🔔</div>

                <h2>Notifications</h2>

                <p>
                  Stay updated about membership decisions and important campus
                  announcements.
                </p>

                <button onClick={() => setActivePage("notifications")}>
                  View Notifications →
                </button>
              </div>
            </div>

            <div className="infoBox">
              <h2>Find your community.</h2>

              <p>
                Your campus is more than classrooms. Discover people, ideas and
                experiences.
              </p>

              <span>
                CampusHub brings your student community together in one place.
              </span>
            </div>
          </>
        )}

        {activePage === "clubs" && (
          <>
            <button
              className="backButton"
              onClick={() => setActivePage("dashboard")}
            >
              ← Dashboard
            </button>

            <div className="welcome">
              <p>CAMPUS COMMUNITIES</p>

              <h1>Find Your Club ✨</h1>

              <span>
                Explore communities, meet people and participate in something
                you love.
              </span>
            </div>

            {loading ? (
              <p style={{ marginTop: "35px" }}>Loading clubs...</p>
            ) : (
              <div
                className="cards"
                style={{
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                {clubs.map((club) => {
                  const status = getMembershipStatus(club._id);

                  return (
                    <div className="card" key={club._id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          className="cardIcon"
                          style={{
                            marginBottom: "15px",
                          }}
                        >
                          {getClubIcon(club.category)}
                        </div>

                        <span className="statusBadge">
                          {club.status || "ACTIVE"}
                        </span>
                      </div>

                      <span className="clubBadge">
                        {club.category || "General"}
                      </span>

                      <h2>{club.name}</h2>

                      <p>
                        {club.description ||
                          "A student community for learning, collaboration and participation."}
                      </p>

                      {status ? (
                        <button
                          disabled
                          style={{
                            opacity: 0.75,
                            cursor: "default",
                            width: "100%",
                          }}
                        >
                          ✓ {status}
                        </button>
                      ) : (
                        <button
                          onClick={() => joinClub(club._id)}
                          style={{
                            width: "100%",
                          }}
                        >
                          Join Community →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activePage === "activities" && (
          <>
            <button
              className="backButton"
              onClick={() => setActivePage("dashboard")}
            >
              ← Dashboard
            </button>

            <div className="welcome">
              <p>CAMPUS EVENTS</p>

              <h1>What's Happening? 🎯</h1>

              <span>
                Discover workshops, competitions, events and activities around
                campus.
              </span>
            </div>

            <div
              className="cards"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              {activities.map((activity) => (
                <div className="card" key={activity._id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <div className="cardIcon" style={{ margin: 0 }}>
                      {getActivityIcon(activity.title)}
                    </div>

                    <span className="statusBadge">
                      {activity.status || "UPCOMING"}
                    </span>
                  </div>

                  <h2>{activity.title}</h2>

                  <p>
                    {activity.description ||
                      "An exciting campus activity for students."}
                  </p>

                  <div className="activityDate">
                    📅{" "}
                    {activity.date
                      ? new Date(activity.date).toLocaleDateString()
                      : "Date TBA"}
                  </div>

                  <div className="activityLocation">
                    📍 {activity.location || "Location TBA"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activePage === "memberships" && (
          <>
            <button
              className="backButton"
              onClick={() => setActivePage("dashboard")}
            >
              ← Dashboard
            </button>

            <div className="welcome">
              <p>YOUR COMMUNITY JOURNEY</p>

              <h1>My Memberships 🤝</h1>

              <span>
                Track your club membership requests and community participation.
              </span>
            </div>

            <div className="statRow">
              <div className="statCard">
                <small>TOTAL REQUESTS</small>
                <strong>{memberships.length}</strong>
              </div>

              <div className="statCard">
                <small>APPROVED</small>
                <strong>
                  {
                    memberships.filter((item) => item.status === "APPROVED")
                      .length
                  }
                </strong>
              </div>

              <div className="statCard">
                <small>PENDING</small>
                <strong>
                  {
                    memberships.filter((item) => item.status === "PENDING")
                      .length
                  }
                </strong>
              </div>
            </div>

            <div
              className="cards"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              {memberships.length === 0 ? (
                <div className="card">
                  <div className="cardIcon">🌱</div>

                  <h2>Start your journey</h2>

                  <p>
                    You haven't requested membership in any club yet. Find a
                    community that interests you.
                  </p>

                  <button onClick={() => setActivePage("clubs")}>
                    Explore Clubs →
                  </button>
                </div>
              ) : (
                memberships.map((membership) => (
                  <div className="card" key={membership._id}>
                    <div className="cardIcon">🤝</div>

                    <span className="clubBadge">CLUB MEMBERSHIP</span>

                    <h2>{membership.club?.name || "Club"}</h2>

                    <p>Your membership request has the following status.</p>

                    <span className="statusBadge">{membership.status}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activePage === "notifications" && (
          <>
            <button
              className="backButton"
              onClick={() => setActivePage("dashboard")}
            >
              ← Dashboard
            </button>

            <div className="welcome">
              <p>CAMPUSHUB UPDATES</p>

              <h1>Notifications 🔔</h1>

              <span>
                Stay updated with your club activity and CampusHub
                announcements.
              </span>
            </div>

            <div
              className="cards"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              {notifications.length === 0 ? (
                <div className="card">
                  <div className="cardIcon">✓</div>

                  <h2>You're all caught up</h2>

                  <p>
                    There are no new notifications at the moment. Check back
                    later for updates.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div className="card" key={notification._id}>
                    <div className="cardIcon">🔔</div>

                    <span className="clubBadge">
                      {notification.type || "SYSTEM"}
                    </span>

                    <h2>{notification.title}</h2>

                    <p>{notification.message}</p>

                    <span className="statusBadge">
                      {notification.isRead ? "READ" : "NEW"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
