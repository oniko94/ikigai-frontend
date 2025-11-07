/* Transform survey results object to an array of answers only */
export const getFlatValuesArray = (data) => {
  return Object.values(data)
    .flat()
    .map(obj => Object.values(obj)[0])
    .filter(Boolean);
};

export const buildTableHtml = (headers, data) => {
  return `
    <table class="results-table">
      <thead>
        <tr>${headers.map(text => `<th>${text}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${data
          .map(
            row => `
          <tr>
            <td>${row.skill}</td>
            <td class="ikigai">${row.ikigai}</td>
            <td class="tools">${row.tools}</td>
            <td class="holes">${row.holes}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
};

export const getProgress = (current, total) => {
  return Math.round((current / total) * 100);
};
