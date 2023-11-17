// src/TaskTableHeader.js
import React, { useState, useEffect } from "react";

const TaskTableHeader = ({ onCheckboxChange, initialCheckedRows }) => {
  const [totals, setTotals] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Elite: 0,
    Master: 0,
    TotalTasks: 0,
    TotalPoints: 0,
  });

  const [checkedRows, setCheckedRows] = useState(initialCheckedRows);

  useEffect(() => {
    calculateTotals();
  }, [checkedRows]);

  const handleCheckboxChange = (area) => {
    setCheckedRows((prevCheckedRows) => ({
      ...prevCheckedRows,
      [area]: !prevCheckedRows[area],
    }));
    onCheckboxChange(area);
  };

  const calculateTotals = () => {
    const newTotals = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
      Elite: 0,
      Master: 0,
      TotalTasks: 0,
      TotalPoints: 0,
    };

    Object.keys(checkedRows).forEach((area) => {
      if (checkedRows[area]) {
        newTotals.Easy += parseInt(
          document.getElementById(`${area}-easy`).innerText
        );
        newTotals.Medium += parseInt(
          document.getElementById(`${area}-medium`).innerText
        );
        newTotals.Hard += parseInt(
          document.getElementById(`${area}-hard`).innerText
        );
        newTotals.Elite += parseInt(
          document.getElementById(`${area}-elite`).innerText
        );
        newTotals.Master += parseInt(
          document.getElementById(`${area}-master`).innerText
        );
        newTotals.TotalTasks += parseInt(
          document.getElementById(`${area}-total-tasks`).innerText
        );
        newTotals.TotalPoints += parseInt(
          document
            .getElementById(`${area}-total-points`)
            .innerText.replace(/,/g, "")
        );
      }
    });

    setTotals(newTotals);
  };

  return (
    <table className="task-overview-table">
      <thead>
        <tr>
          <th>Area (Only show selected)</th>
          <th>Easy</th>
          <th>Medium</th>
          <th>Hard</th>
          <th>Elite</th>
          <th>Master</th>
          <th>Total Tasks</th>
          <th>Total Points</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["General"]}
              onChange={() => handleCheckboxChange("General")}
            />
            <img src="./assets/Globe-icon.webp" alt="General Logo" />
            General
          </td>
          <td id="General-easy">107</td>
          <td id="General-medium">128</td>
          <td id="General-hard">98</td>
          <td id="General-elite">162</td>
          <td id="General-master">8</td>
          <td id="General-total-tasks">503</td>
          <td id="General-total-points">49,630</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Misthalin"]}
              onChange={() => handleCheckboxChange("Misthalin")}
            />
            <img
              src="./assets/Misthalin_Area_Badge.webp"
              alt="Misthalin Logo"
            />
            Misthalin
          </td>
          <td id="Misthalin-easy">34</td>
          <td id="Misthalin-medium">32</td>
          <td id="Misthalin-hard">14</td>
          <td id="Misthalin-elite">16</td>
          <td id="Misthalin-master">0</td>
          <td id="Misthalin-total-tasks">96</td>
          <td id="Misthalin-total-points">5,940</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Karamja"]}
              onChange={() => handleCheckboxChange("Karamja")}
            />
            <img src="./assets/Karamja_Area_Badge.webp" alt="Karamja Logo" />
            Karamja
          </td>
          <td id="Karamja-easy">7</td>
          <td id="Karamja-medium">12</td>
          <td id="Karamja-hard">17</td>
          <td id="Karamja-elite">15</td>
          <td id="Karamja-master">6</td>
          <td id="Karamja-total-tasks">57</td>
          <td id="Karamja-total-points">7,310</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Asgarnia"]}
              onChange={() => handleCheckboxChange("Asgarnia")}
            />
            <img src="./assets/Asgarnia_Area_Badge.webp" alt="Asgarnia Logo" />
            Asgarnia
          </td>
          <td id="Asgarnia-easy">18</td>
          <td id="Asgarnia-medium">30</td>
          <td id="Asgarnia-hard">32</td>
          <td id="Asgarnia-elite">22</td>
          <td id="Asgarnia-master">3</td>
          <td id="Asgarnia-total-tasks">105</td>
          <td id="Asgarnia-total-points">9,540</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Kharidian Desert"]}
              onChange={() => handleCheckboxChange("Kharidian Desert")}
            />
            <img
              src="./assets/Desert_Area_Badge.webp"
              alt="Kharidian Desert Logo"
            />
            Kharidian Desert
          </td>
          <td id="Kharidian Desert-easy">20</td>
          <td id="Kharidian Desert-medium">39</td>
          <td id="Kharidian Desert-hard">40</td>
          <td id="Kharidian Desert-elite">21</td>
          <td id="Kharidian Desert-master">5</td>
          <td id="Kharidian Desert-total-tasks">125</td>
          <td id="Kharidian Desert-total-points">11,160</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Fremennik Provinces"]}
              onChange={() => handleCheckboxChange("Fremennik Provinces")}
            />
            <img
              src="./assets/Fremennik_Area_Badge.webp"
              alt="Fremennik Provinces Logo"
            />
            Fremennik Provinces
          </td>
          <td id="Fremennik Provinces-easy">11</td>
          <td id="Fremennik Provinces-medium">22</td>
          <td id="Fremennik Provinces-hard">34</td>
          <td id="Fremennik Provinces-elite">26</td>
          <td id="Fremennik Provinces-master">3</td>
          <td id="Fremennik Provinces-total-tasks">96</td>
          <td id="Fremennik Provinces-total-points">10,110</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Kandarin"]}
              onChange={() => handleCheckboxChange("Kandarin")}
            />
            <img src="./assets/Kandarin_Area_Badge.webp" alt="Kandarin Logo" />
            Kandarin
          </td>
          <td id="Kandarin-easy">21</td>
          <td id="Kandarin-medium">35</td>
          <td id="Kandarin-hard">24</td>
          <td id="Kandarin-elite">20</td>
          <td id="Kandarin-master">4</td>
          <td id="Kandarin-total-tasks">104</td>
          <td id="Kandarin-total-points">9,130</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Morytania"]}
              onChange={() => handleCheckboxChange("Morytania")}
            />
            <img
              src="./assets/Morytania_Area_Badge.webp"
              alt="Morytania Logo"
            />
            Morytania
          </td>
          <td id="Morytania-easy">10</td>
          <td id="Morytania-medium">28</td>
          <td id="Morytania-hard">31</td>
          <td id="Morytania-elite">27</td>
          <td id="Morytania-master">6</td>
          <td id="Morytania-total-tasks">102</td>
          <td id="Morytania-total-points">11,500</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Tirannwn"]}
              onChange={() => handleCheckboxChange("Tirannwn")}
            />
            <img src="./assets/Tirannwn_Area_Badge.webp" alt="Tirannwn Logo" />
            Tirannwn
          </td>
          <td id="Tirannwn-easy">9</td>
          <td id="Tirannwn-medium">9</td>
          <td id="Tirannwn-hard">28</td>
          <td id="Tirannwn-elite">26</td>
          <td id="Tirannwn-master">4</td>
          <td id="Tirannwn-total-tasks">76</td>
          <td id="Tirannwn-total-points">9,490</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Wilderness"]}
              onChange={() => handleCheckboxChange("Wilderness")}
            />
            <img
              src="./assets/Wilderness_Area_Badge.webp"
              alt="Wilderness Logo"
            />
            Wilderness
          </td>
          <td id="Wilderness-easy">11</td>
          <td id="Wilderness-medium">25</td>
          <td id="Wilderness-hard">26</td>
          <td id="Wilderness-elite">28</td>
          <td id="Wilderness-master">4</td>
          <td id="Wilderness-total-tasks">94</td>
          <td id="Wilderness-total-points">10,390</td>
        </tr>
        <tr>
          <td>
            <input
              type="checkbox"
              checked={checkedRows["Kourend"]}
              onChange={() => handleCheckboxChange("Kourend")}
            />
            <img src="./assets/Kourend_Area_Badge.webp" alt="Kourend" />
            Kourend
          </td>
          <td id="Kourend-easy">21</td>
          <td id="Kourend-medium">31</td>
          <td id="Kourend-hard">42</td>
          <td id="Kourend-elite">27</td>
          <td id="Kourend-master">3</td>
          <td id="Kourend-total-tasks">124</td>
          <td id="Kourend-total-points">11,410</td>
        </tr>
        <tr className="header">
          <td>TOTAL</td>
          <td>{totals.Easy}</td>
          <td>{totals.Medium}</td>
          <td>{totals.Hard}</td>
          <td>{totals.Elite}</td>
          <td>{totals.Master}</td>
          <td>{totals.TotalTasks}</td>
          <td>{totals.TotalPoints}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TaskTableHeader;
