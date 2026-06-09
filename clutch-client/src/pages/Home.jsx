import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import bgImg from "../image/background-wall-concept-with-copy-space.jpg";

const Home = ({ swaps = [] }) => {
  const { user } = useUser();
  const [session, setSession] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userCollege, setUserCollege] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.collegeName) {
            setUserCollege(data.collegeName);
          } else {
            setUserCollege("No college selected");
          }
        })
        .catch(err => {
          console.error("Error fetching user data:", err);
          setUserCollege("Error loading college");
        });
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function getGreeting() {
    const hour = currentTime.getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else if (hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  }

  return (
    <>
      <div className="m-5 space-y-6 bg-[url('bgImg')] h-screen w-full">
        <div className="flex items-center border-b border-amber-200 pb-2">
          <section className="text-lg font-semibold text-gray-700">
            <h1>{getGreeting()}</h1>

            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <p className="text-sm text-gray-500">
              {currentTime.toLocaleTimeString()}
            </p>
          </section>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-white shadow rounded-md p-3">
            Session Streak: {session}
          </div>
          <div className="bg-white shadow rounded-md p-3">
            Day Streak: {session}
          </div>
          <div className="bg-white shadow rounded-md p-3">
            College: <span className="font-semibold text-blue-600">{userCollege}</span>
          </div>
          <button className="cursor-pointer  bg-blue-300 text-red-600 text-xs px-6 py-3 rounded-full font-semibold shadow-sm">
            SOS
          </button>
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Swap Requests
          </h1>
          {swaps.length === 0 ? (
            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              No swap requests posted yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {swaps.map((swap) => (
                <div
                  key={swap.id}
                  className="p-5 bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {swap.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {swap.college} • {swap.year} Year
                        </p>
                      </div>
                      <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {swap.urgency}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                      <p className="flex flex-col">
                        <span className="font-semibold text-blue-600 uppercase text-xs tracking-wider">
                          Offering
                        </span>
                        <span className="text-gray-700 mt-0.5">
                          {swap.offer}
                        </span>
                      </p>
                      <p className="flex flex-col pt-1">
                        <span className="font-semibold text-red-600 uppercase text-xs tracking-wider">
                          Seeking
                        </span>
                        <span className="text-gray-700 mt-0.5">
                          {swap.need}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer>
          <button
            onClick={() => navigate("/study-swap")}
            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition shadow-md"
          >
            Post a swap request
          </button>
        </footer>
      </div>
    </>
  );
};

export default Home;
