import React from 'react';

const Ranking = ({ users }) => {
  return (
    <div className="container mx-auto mt-4" style={{ width: '950px' }}>
      <div className="mt-10 mb-4">LEADERBOARD</div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index + 1}
                </th>
                <td className="px-6 py-4">{user.address}</td>
                <td className="px-6 py-4">{user.score}</td>
              </tr>
            ))}
            {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                1
              </th>
              <td className="px-6 py-4">Apple MacBook Pro 17"</td>
              <td className="px-6 py-4">$2999</td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                2
              </th>
              <td className="px-6 py-4">Microsoft Surface Pro</td>
              <td className="px-6 py-4">$1999</td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                3
              </th>
              <td className="px-6 py-4">Microsoft Surface Pro</td>
              <td className="px-6 py-4">$99</td>
            </tr> */}
          </tbody>
        </table>
        {!users?.length && <div className="mt-2 flex justify-center">There is no ranking yet.</div>}
      </div>
    </div>
  );
};

export default Ranking;
