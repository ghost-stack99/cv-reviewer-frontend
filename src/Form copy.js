import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, TextField } from '@mui/material';

const Form = () => {
  const [formData, setFormData] = useState({ name: '', job: '', resume: null });
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, resume: event.target.files[0] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('job', formData.job);
    formDataToSend.append('resume', formData.resume);

    try {
      const response = await axios.post(
        'http://ec2-15-206-172-208.ap-south-1.compute.amazonaws.com:3410/upload',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setDownloadUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading file: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open('http://ec2-15-206-172-208.ap-south-1.compute.amazonaws.com:3410/reports/'+downloadUrl);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <TextField
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <TextField
        name="job"
        label="Job"
        value={formData.job}
        onChange={handleChange}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="resume-upload"
      />
      <label htmlFor="resume-upload">
        <Button variant="contained" color="primary" component="span">
          Upload Resume
        </Button>
      </label>
      <br />
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading || !formData.name || !formData.job || !formData.resume}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>
      {downloadUrl && (
        <div>
          <Button variant="contained" color="secondary" onClick={handleDownload}>
            Download Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default Form;
