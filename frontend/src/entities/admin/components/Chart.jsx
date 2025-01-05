import React from "react";
import { Line } from "react-chartjs-2";

const UserCreationGraph = ({ forums }) => {
  // Sample data for user creation
  console.log(forums);
  // Extracting the required data for the graph
  const userCreationData = {
    labels: forums.map((user) => user.createdDate),
    datasets: [
      {
        label: "User Creation",
        data: forums.map((user) => user.replies.length),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>User Creation Graph</h2>
      <Line data={userCreationData} />
    </div>
  );
};

export default UserCreationGraph;
