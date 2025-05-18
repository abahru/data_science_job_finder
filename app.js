function getApiUrl(page = 1, query = 'data science') {
    return `http://localhost:3000/jobs?page=${page}&query=${encodeURIComponent(query)}`;
}

const jobList = document.getElementById('jobList');
const filterForm = document.getElementById('filterForm');
const locationSelect = document.getElementById('filterLocation');
const jobTypeSelect = document.getElementById('jobType');
const minSalaryInput = document.getElementById('minSalary');
const searchInput = document.getElementById('searchInput');
const salaryChartCanvas = document.getElementById('salaryChart');
const pageNumberDisplay = document.getElementById('pageNumber');

let allJobs = [];
let currentPage = 1;
let currentQuery = 'data science';

// Fetch job data and initialize
async function fetchJobs(page = 1, reapplyFilters = false, query = currentQuery) {
    try {
        currentQuery = query;
        const res = await fetch(getApiUrl(page, query));
        const data = await res.json();
        allJobs = data.results;

        if (reapplyFilters) {
            applyFilters();
        } else {
            renderJobs(allJobs);
            renderSalaryChart(allJobs);
            populateLocations(allJobs);
            updatePageNumber();
        }
    } catch (err) {
        console.error('Error fetching jobs:', err);
    }
}

function renderJobs(jobs) {
    jobList.innerHTML = '';
    if (jobs.length === 0) {
        jobList.innerHTML = '<p>No jobs found.</p>';
        return;
    }

    jobs.forEach(job => {
        const avgSalary = ((job.salary_min || 0) + (job.salary_max || 0)) / 2;
        const div = document.createElement('div');
        div.classList.add('job');

        div.innerHTML = `
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company.display_name}</p>
        <p><strong>Location:</strong> ${job.location.display_name}</p>
        <p><strong>Salary:</strong> $${Math.round(avgSalary)}</p>
        <a href="${job.redirect_url}" target="_blank">View Job</a>
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Job';
        saveBtn.addEventListener('click', () => saveJob(job));
        div.appendChild(document.createElement('br'));
        div.appendChild(saveBtn);

        jobList.appendChild(div);
    });
}

function applyFilters() {
    const selectedLoc = locationSelect.value;
    const selectedType = jobTypeSelect.value;
    const minSalary = parseInt(minSalaryInput.value, 10) || 0;
    const searchTerm = searchInput.value.toLowerCase() || 'data science';
    currentQuery = searchTerm;

    const filtered = allJobs.filter(job => {
        const titleMatch = job.title.toLowerCase().includes(searchTerm);
        const locMatch = !selectedLoc || (job.location.area && job.location.area[1] === selectedLoc);
        const salaryAvg = ((job.salary_min || 0) + (job.salary_max || 0)) / 2;
        const salaryMatch = salaryAvg >= minSalary;
        const typeMatch = !selectedType || (job.contract_time && job.contract_time.toLowerCase() === selectedType);
        return titleMatch && locMatch && salaryMatch && typeMatch;
    });
    renderJobs(filtered);
    renderSalaryChart(filtered);
    updatePageNumber();
}

function saveJob(job) {
    let saved = JSON.parse(localStorage.getItem('savedJobs')) || [];
    if (!saved.find(j => j.id === job.id)) {
        saved.push(job);
        localStorage.setItem('savedJobs', JSON.stringify(saved));
        alert('Job saved!');
    } else {
        alert('Already saved.');
    }
}

function renderSalaryChart(jobs) {
    const canvas = document.getElementById('salaryChart');
    const ctx = canvas?.getContext?.('2d');
    if (!ctx) {
        console.error('Canvas context not found!');
        return;
    }

    const salaryJobs = jobs.filter(j => j.salary_min && j.salary_max);
    const labels = salaryJobs.map((j, i) => j.title || `Job ${i + 1}`);
    const salaries = salaryJobs.map(j => (j.salary_min + j.salary_max) / 2);

    console.log("Chart Labels:", labels);
    console.log("Chart Salaries:", salaries);

    if (window.salaryChart && typeof window.salaryChart.destroy === 'function') {
        window.salaryChart.destroy();
    }

    if (labels.length && salaries.length) {
        window.salaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
            label: 'Avg Salary ($)',
            data: salaries,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
            y: { beginAtZero: true }
            }
        }
        });
    } else {
        console.warn('Not enough data to render chart.');
        canvas.style.display = 'none';
    }
}

function updatePageNumber() {
    if (pageNumberDisplay) {
        pageNumberDisplay.textContent = `Page ${currentPage}`;
    }
}

// Pagination buttons
document.getElementById('nextBtn').addEventListener('click', () => {
    currentPage++;
    fetchJobs(currentPage, true, currentQuery);
});

document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchJobs(currentPage, true, currentQuery);
    }
});

// Filter submit
filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 1;
    const query = searchInput.value.toLowerCase() || 'data science';
    fetchJobs(currentPage, true, query);
});

//Send mock feedback
fetch('http://localhost:3000/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Aaliyah', message: 'Great site!' })
})
.then(res => res.json())
.then(data => console.log('Server response:', data))
.catch(err => console.error('Error sending feedback:', err));

fetchJobs();
