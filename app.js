// ===============================
// Config
// ===============================

const LOCATION = 'MB';

const INSTITUTES = {
  labaid: {
    label: 'Lab Aid',
    reception: '01737826436',
    image: 'la.png',

    doctors: [
      {
        name: '👨‍⚕️ এইচ. এম. এনামুল হক',
        id: 'enamul',
        serials: [4, 8, 13]
      },
      {
        name: '👨‍⚕️ শহিদুল ইসলাম খান',
        id: 'sohidul',
        serials: [14, 20, 25]
      },
      {
        name: '👨‍⚕️ মোহাম্মদ জিয়াউর রহমান',
        id: 'ziaur',
        serials: [13, 15]
      }
    ]
  }
};

// ===============================
// Helpers
// ===============================

function cleanSerial(serial) {
  if (typeof serial === 'string') return serial.replace(/ [HP]$/, '');
  return serial;
}

// ===============================
// App
// ===============================

const App = () => {

  const [institute, setInstitute] = React.useState('labaid');

  const [patientName, setPatientName] = React.useState('');
  const [patientAge, setPatientAge] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [selectedDoctor, setSelectedDoctor] = React.useState('');
  const [selectedSerial, setSelectedSerial] = React.useState(null);
  const [attendTime, setAttendTime] = React.useState('');

  const [output, setOutput] = React.useState(null);
  const [copyMsg, setCopyMsg] = React.useState('');

  const currentInst = INSTITUTES[institute];
  const doctorObj = currentInst.doctors.find(d => d.id === selectedDoctor);

  const handleGenerate = () => {
    if (!patientName || !phoneNumber || !selectedDoctor || !selectedSerial || !attendTime) {
      setOutput({ error: 'Please fill all fields' });
      return;
    }

    const doctorName = doctorObj?.name || '';

    setOutput({
      data: {
        name: patientName,
        doctor: doctorName,
        serial: cleanSerial(selectedSerial),
        attendTime,
        phone: phoneNumber
      }
    });
  };

  const handleCopy = async () => {
    if (!output?.data) return;

    const { name, doctor, serial, attendTime, phone } = output.data;

    const text = `Name: ${name}\n\n${doctor}\n\nSL No: ${serial}\n🕝: ${attendTime}\n📱: ${phone}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg('✓ Copied!');
    } catch {
      setCopyMsg('Copy failed');
    }

    setTimeout(() => setCopyMsg(''), 2000);
  };

  const handleClear = () => {
    setPatientName('');
    setPatientAge('');
    setPhoneNumber('');
    setSelectedDoctor('');
    setSelectedSerial(null);
    setAttendTime('');
    setOutput(null);
  };

  return (
    <div className="card">

      <h1 className="page-title">🏥 Medical Appointment</h1>

      {/* Location (fixed) */}
      <div className="reception-banner">
        Location: {LOCATION}
      </div>

      {/* Institute */}
      <div className="tab-bar">
        {Object.keys(INSTITUTES).map(key => (
          <label key={key} className={institute === key ? 'active' : ''}>
            <input type="radio"
              checked={institute === key}
              onChange={() => setInstitute(key)}
            />
            {INSTITUTES[key].label}
          </label>
        ))}
      </div>

      {/* Reception */}
      <div className="reception-banner">
        {currentInst.label} Reception: {currentInst.reception}
      </div>

      <img src={currentInst.image} className="hospital-img" />

      {/* Form */}
      <div className="form-group">

        <input className="field" placeholder="Patient Name"
          value={patientName}
          onChange={e => setPatientName(e.target.value)}
        />

        <input className="field" type="number" placeholder="Age"
          value={patientAge}
          onChange={e => setPatientAge(e.target.value)}
        />

        <input className="field" placeholder="Phone"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
        />

        <select className="field"
          value={selectedDoctor}
          onChange={e => {
            setSelectedDoctor(e.target.value);
            setSelectedSerial(null); // reset serial when doctor changes
          }}>
          <option value="">Select Doctor</option>
          {currentInst.doctors.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>

        {/* Dynamic Serial */}
        {doctorObj && (
          <div>
            <p className="serial-label">Select Serial</p>
            <div className="serial-grid">
              {doctorObj.serials.map(serial => (
                <button
                  key={serial}
                  onClick={() => setSelectedSerial(serial)}
                  className={`serial-btn ${selectedSerial === serial ? 'selected' : ''}`}
                >
                  {serial}
                </button>
              ))}
            </div>
          </div>
        )}

        <input className="field" placeholder="Attend Time"
          value={attendTime}
          onChange={e => setAttendTime(e.target.value)}
        />

      </div>

      <button className="btn-primary" onClick={handleGenerate}>
        Generate
      </button>

      {/* Output */}
      {output && (
        <div className="output-card">

          {output.error ? (
            <div className="msg-error">{output.error}</div>
          ) : (
            <>
              <div className="output-body">
                <p>Name: {output.data.name}</p>
                <p>{output.data.doctor}</p>
                <p>SL No: {output.data.serial}</p>
                <p>🕝 {output.data.attendTime}</p>
                <p>📱 {output.data.phone}</p>
              </div>

              <div className="output-actions">
                <button className="btn-secondary copy" onClick={handleCopy}>Copy</button>
                <button className="btn-secondary clear" onClick={handleClear}>Clear</button>
              </div>

              {copyMsg && <p className="msg-success">{copyMsg}</p>}
            </>
          )}

        </div>
      )}

    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
