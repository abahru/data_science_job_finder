async function loadJobData() {
    const res = await fetch('http://localhost:3000/jobs');
    const data = await res.json();
    const jobs = data.results;
  
    drawTopCompanies(jobs);
    drawLocationChart(jobs);
    drawAverageSalaryChart();
}

//Salary distribution from live API
function drawSalaryDistribution(jobs) {
    const salaries = jobs
    .filter(j => j.salary_min && j.salary_max)
    .map(j => (j.salary_min + j.salary_max) / 2);
  
    const ctx = document.getElementById('salaryDistChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: salaries.map((_, i) => `Job ${i + 1}`),
            datasets: [{
                label: 'Avg Salary ($)',
                data: salaries,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            plugins: {
            title: {
                display: true,
                text: 'Salary Distribution (Live Listings)'
            }
            }
        }
    });
}
  
function drawTopCompanies(jobs) {
    const companyCounts = {};
    jobs.forEach(j => {
        const name = j.company.display_name;
        companyCounts[name] = (companyCounts[name] || 0) + 1;
    });
  
    const top = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); 
  
    const ctx = document.getElementById('topCompaniesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top.map(([name]) => name),
            datasets: [{
                label: 'Job Count',
                data: top.map(([_, count]) => count),
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            plugins: {
                title: {
                    display: true,
                    text: 'Top Hiring Companies'
                }
            }
        }
    });
}
  
function drawLocationChart(jobs) {
    const locationCounts = {};
  
    jobs.forEach(j => {
        let state = j.location.area?.[1] || "Other";
        if (state.includes("District of Columbia")) {
            state = "Washington D.C.";
        }
        if (state.includes("Maryland")) {
            state = "Maryland";
        }
  
        locationCounts[state] = (locationCounts[state] || 0) + 1;
    });
  
    const top = Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);
    
    const ctx = document.getElementById('locationChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top.map(([loc]) => loc),
            datasets: [{
                label: 'Jobs',
                data: top.map(([_, count]) => count),
                backgroundColor: 'rgba(255, 159, 64, 0.6)'
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });
}

function drawAverageSalaryChart() {
    const roles = [
        'Data Scientist', 'ML Engineer', 'Data Engineer', 'AI Specialist',
        'Data Analyst', 'Statistician', 'Research Scientist', 'BI Analyst',
        'Data Architect', 'Data Journalist','Software Engineer', 'Product Manager'
    ];    
  
    const avgSalaries = [
        150000, 150000, 160000, 170000,
        110000, 120000, 120000, 140000,
        180000, 100000, 150000, 145000
    ];
  
    const ctx = document.getElementById('salaryByRoleChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: roles,
            datasets: [{
                label: 'Average Salary ($)',
                data: avgSalaries,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Salary in USD' }
                },
                x: {
                    title: { display: true, text: 'Data Roles' }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Average Salaries by Data Role (2025)'
                },
                tooltip: {
                    callbacks: {
                    label: ctx => `$${ctx.parsed.y.toLocaleString()}`
                    }
                }
            }
        }
    });
}
  
loadJobData(); 