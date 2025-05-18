function loadSavedJobs() {
  const saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
  const container = document.getElementById('savedJobsList');
  container.innerHTML = '';
  if (saved.length === 0) {
    container.innerHTML = '<p>No saved jobs.</p>';
    return;
  }

  saved.forEach((job, index) => {
    const jobDiv = document.createElement('div');
    jobDiv.classList.add('job');
    jobDiv.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Company:</strong> ${job.company?.display_name || 'N/A'}</p>
      <p><strong>Location:</strong> ${job.location?.display_name || 'N/A'}</p>
      <p><strong>Salary:</strong> $${Math.round(((job.salary_min || 0) + (job.salary_max || 0)) / 2)}</p>
      <a href="${job.url}" target="_blank">View Job</a><br>
      <button onclick="removeSavedJob(${index})">Remove</button>
    `;
    container.appendChild(jobDiv);
  });
}

// Save job to LocalStorage
function saveJob(job) {
  const saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
  const isAlreadySaved = saved.some(savedJob => savedJob.id === job.id);
  if (!isAlreadySaved) {
    saved.push(job);
    localStorage.setItem('savedJobs', JSON.stringify(saved));
    alert('Job saved!');
  } else {
    alert('Job already saved.');
  }
}

// Remove job from LocalStorage
function removeSavedJob(index) {
  const saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
  saved.splice(index, 1);
  localStorage.setItem('savedJobs', JSON.stringify(saved));
  loadSavedJobs();
}

loadSavedJobs();
