// scrapeTasks.js
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url =
  "https://oldschool.runescape.wiki/w/Trailblazer_Reloaded_League/Tasks"; // Replace with the actual URL of the tasks page

const extractTasks = (html) => {
  const tasks = [];

  // Use Cheerio to traverse and extract data from the HTML
  const $ = cheerio.load(html);
  $("table tr").each((index, element) => {
    const columns = $(element).find("td");
    // Customize this part based on your HTML structure
    const task = {
      id: index + 1,
      area: $(columns[0]).find("img").attr("alt"),
      logoUrl: `./assets/${$(columns[0]).find("img").attr("alt")}_Badge.webp`,
      name: $(columns[1]).text().trim(),
      description: $(columns[2]).text().trim(),
      requirements: $(columns[3]).text().trim(),
      points: parseInt($(columns[4]).text().trim(), 10),
      completion: parseFloat($(columns[5]).text().trim()),
      completed: false,
    };
    tasks.push(task);
  });

  return tasks;
};

const fetchData = async () => {
  try {
    const response = await axios.get(url);
    const tasks = extractTasks(response.data);

    // Convert the array to a JSON string
    const serializedData = JSON.stringify(tasks, null, 2);

    // Write the data to a file
    fs.writeFileSync("tasksData.json", serializedData);

    console.log("Tasks data has been scraped and exported to tasksData.json");
  } catch (error) {
    console.error("Error fetching tasks data:", error);
  }
};

fetchData();
