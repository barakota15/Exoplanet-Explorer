function showPage(pageId) {
	document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
	document.getElementById(pageId).classList.remove("hidden");
	document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
	event.target.classList.add("active");
}

let resultChart; // نخزن الجراف عشان نعمل destroy عند التحديث

async function handleFile(e) {
  const file = e.target.files[0];
  if(file && file.name.endsWith(".csv")) {
	document.getElementById("loading").style.display = "flex";
	
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log("Prediction:", data.prediction);

      // Show result section
      document.getElementById("result").classList.remove("hidden");
	  document.getElementById("loading").style.display = "none";
	  document.getElementById("uploadStatus").textContent = "✅ Uploaded: " + file.name;
      const statusSpan = document.getElementById("predictionStatus");
      if (data.prediction == 1) {
        statusSpan.textContent = "✅ Confirmed";
        statusSpan.className = "status-label status-confirmed";
      } else {
        statusSpan.textContent = "❌ Candidate";
        statusSpan.className = "status-label status-candidate";
      }

      // Pie chart
      const ctx = document.getElementById("resultChart").getContext("2d");
      if (data.features) {
		  const labels = Object.keys(data.features);
		  const values = Object.values(data.features);

		  const ctx = document.getElementById("resultChart").getContext("2d");
		  if (resultChart) resultChart.destroy();

		  resultChart = new Chart(ctx, {
			type: "doughnut",
			data: {
			  labels: labels,
			  datasets: [{
				data: values,
				backgroundColor: labels.map((_, i) => 
				  `hsl(${i * 40 % 360}, 70%, 55%)` // ألوان مختلفة تلقائياً
				)
			  }]
			},
			options: {
			  plugins: {
				legend: {
				  position: "right",
				  labels: { color: "#fff", font: { size: 12 } }
				},
				tooltip: {
				  callbacks: {
					label: function(context) {
					  return `${context.label}: ${context.formattedValue}`;
					}
				  }
				}
			  }
			}
		  });
		}

    })
    .catch(err => {
      console.error(err);
	  document.getElementById("loading").style.display = "none";
	  document.getElementById("result").classList.add("hidden");
      document.getElementById("uploadStatus").textContent = "❌ Upload failed";
    });

  } else {
	document.getElementById("loading").style.display = "none";
	document.getElementById("result").classList.add("hidden");
    document.getElementById("uploadStatus").textContent = "⚠ Please select a valid CSV file.";
  }
}


document.getElementById("model").addEventListener("change", function() {
	document.getElementById("currentModel").textContent = this.value;
});

// Chart.js
const ctx = document.getElementById('planetChart').getContext('2d');
new Chart(ctx, {
	type: 'bar',
	data: {
	  labels: ['Kepler-186f', 'TRAPPIST-1e', 'Proxima b'],
	  datasets: [{
		label: 'Mass (Earth=1)',
		data: [1.4, 0.69, 1.27],
		backgroundColor: ['#3bc8f5','#9b6bff','#f58af5']
	  }]
},
options: {
	  plugins: { legend: { labels: { color: '#fff' } } },
	  scales: {
		x: { ticks: { color: '#ccc' }, grid: { color: '#333' } },
		y: { ticks: { color: '#ccc' }, grid: { color: '#333' } }
	  }
	}
});

function toggleMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  toggle.classList.toggle("active");
  nav.classList.toggle("show");
}