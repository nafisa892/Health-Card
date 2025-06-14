function showRoleForm() {
  const role = document.getElementById('role').value;
  const formFields = document.getElementById('formFields');
  const medicalSection = document.getElementById('medicalSection');

  if (role) {
    formFields.classList.remove('hidden');

    if (role === 'family') {
      medicalSection.style.display = 'none';
    } else if (role === 'emergency') {
      const allInputs = medicalSection.querySelectorAll('label, input, textarea');
      allInputs.forEach(input => input.closest('div')?.style && (input.closest('div').style.display = 'none'));

      const allowed = ['allergies', 'conditions', 'blood_group', 'emergency_name', 'emergency_phone', 'emergency_relation'];
      allowed.forEach(name => {
        const el = document.querySelector(`[name='${name}']`);
        if (el) el.closest('div').style.display = 'block';
      });
    } else {
      medicalSection.style.display = 'block';
      const allInputs = medicalSection.querySelectorAll('label, input, textarea');
      allInputs.forEach(input => input.closest('div').style.display = 'block');
    }
  } else {
    formFields.classList.add('hidden');
  }
}

function generateSummary() {
  const form = document.getElementById('healthForm');
  const formData = new FormData(form);
  const role = document.getElementById('role').value;

  const access = {
    patient: true,
    doctor: true,
    family: ['name', 'dob', 'gender', 'blood_group', 'emergency_name', 'emergency_phone', 'emergency_relation'],
    emergency: ['blood_group', 'allergies', 'conditions', 'emergency_name', 'emergency_phone', 'emergency_relation']
  };

  let summary = '<ul>';
  for (const [key, val] of formData.entries()) {
    if (val && (access[role] === true || access[role].includes(key))) {
      const label = key.replace(/_/g, ' ').toUpperCase();
      summary += `<li><strong>${label}:</strong> ${val}</li>`;
    }
  }
  summary += '</ul>';

  document.getElementById('summaryContent').innerHTML = summary;
  document.getElementById('summaryCard').classList.remove('hidden');
  document.getElementById('downloadPdf').classList.remove('hidden');

  // ✅ QR Code generation with full health info
  const qrData = `
Name: ${formData.get("name")}
DOB: ${formData.get("dob")}
Gender: ${formData.get("gender")}
Blood Group: ${formData.get("blood_group")}
Allergies: ${formData.get("allergies")}
Conditions: ${formData.get("conditions")}
Emergency Name: ${formData.get("emergency_name")}
Emergency Phone: ${formData.get("emergency_phone")}
Emergency Relation: ${formData.get("emergency_relation")}
  `;

  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), qrData);
  document.getElementById("qrCodeBox").classList.remove("hidden");
}

function downloadPDF() {
  const summary = document.getElementById('summaryCard');
  const opt = {
    margin: 1,
    filename: 'Health_Summary.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(summary).set(opt).save();
}
