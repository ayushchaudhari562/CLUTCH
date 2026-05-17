const StudySwap = () => {
  return (
    <>
      <h1 className="m-5 text-xl font-semibold text-center">
        What you need / What you offer
      </h1>

      <div className="flex row-auto p-3">
        <input
          type="text"
          placeholder="What you offer"
          className="rounded-lg border-2 border-blue-500 p-3 m-2 w-full"
        />

        <input
          type="text"
          placeholder="What you need"
          className="rounded-lg border-2 border-red-500 p-3 m-2 w-full"
        />

        <select
          name="Urgency"
          id="urgency"
          className="rounded-md border border-blue-500 bg-white p-3 m-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select urgency</option>
          <option value="1">Today</option>
          <option value="2">Tomorrow</option>
          <option value="3">Next Week</option>
        </select>
        <button className="rounded-lg border-2 border-red-500">Post Swap</button>
      </div>

      <div className="p-5">
        <h2 className="text-lg font-semibold mb-3">Match-Swap</h2>
        <div className="border rounded-lg p-4 bg-gray-50">
          <section className="mb-3 text-gray-700">
            <p><span className="font-medium">Name:</span> Sarthak Bihari</p>
            <p><span className="font-medium">College:</span> IIIT</p>
            <p><span className="font-medium">Year:</span> 2nd</p>
            <p><span className="font-medium">Rating:</span> 1.4⭐</p>
            <p><span className="font-medium">Offer:</span> SQL Doubt</p>
            <p><span className="font-medium">Need:</span> React helper</p>
          </section>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Match
          </button>
        </div>
      </div>
    </>
  );
};

export default StudySwap;
