import { useEffect, useState } from "react";

const Home = () => {
  const [session, setSession] = useState(0);

  return (
    <>
      <div className="m-5 space-y-6">
        <div className="flex items-center border-b border-amber-200 pb-2">
          <section className="text-lg font-semibold text-gray-700">
            Good Morning
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
            College Rank: {session}
          </div>
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-2">Swap request</h1>
          <h1 className="text-xl font-semibold">DSA Swap request</h1>
        </div>

        <footer>
          <button className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition">
            Post a swap request
          </button>
        </footer>
      </div>
    </>
  );
};

export default Home;
